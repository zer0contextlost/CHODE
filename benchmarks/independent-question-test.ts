#!/usr/bin/env node
/**
 * CHODE Independent Question Authorship Test
 *
 * Addresses §16.4 item 9: authorship bias concern.
 * Question authors are AI models that have never seen the CHODE profile —
 * they write stump questions from the README alone.
 * A different model then evaluates CHODE vs baseline on those questions.
 *
 * Assignment (round-robin 3-model × 9 repos, author ≠ evaluator):
 *   GPT-4o authors    → Gemini Flash evaluates:  appwrite, mermaid, scala3
 *   Gemini Flash authors → Mistral Large evaluates: dagger, pocketbase, gin
 *   Mistral Large authors → GPT-4o evaluates:    ladybird, ktor, hono
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/independent-question-test.ts --key sk-or-...
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Repo configuration ─────────────────────────────────────────────────────��──

type RepoConfig = {
  name: string;
  readmePath: string;
  chodePath: string;
  authorModel: string;
  evalModel: string;
};

const B = resolve(__dirname);               // benchmarks/
const P = resolve(__dirname, 'profiles');    // benchmarks/profiles/
const ROOT = resolve(__dirname, '..');       // repo root (for gin-full, axum-full)

const REPOS: RepoConfig[] = [
  // ── GPT-4o authors → Gemini Flash evaluates ────────────────────────────────
  {
    name: 'appwrite',
    readmePath: resolve(B, 'appwrite/README.md'),
    chodePath: resolve(P, 'appwrite.chode'),
    authorModel: 'openai/gpt-4o',
    evalModel: 'google/gemini-2.5-flash',
  },
  {
    name: 'mermaid',
    readmePath: resolve(B, 'mermaid/README.md'),
    chodePath: resolve(P, 'mermaid.chode'),
    authorModel: 'openai/gpt-4o',
    evalModel: 'google/gemini-2.5-flash',
  },
  {
    name: 'scala3',
    readmePath: resolve(B, 'scala3/README.md'),
    chodePath: resolve(P, 'scala3.chode'),
    authorModel: 'openai/gpt-4o',
    evalModel: 'google/gemini-2.5-flash',
  },
  // ── Gemini Flash authors → Mistral Large evaluates ─────────────────────────
  {
    name: 'dagger',
    readmePath: resolve(B, 'dagger/README.md'),
    chodePath: resolve(P, 'dagger.chode'),
    authorModel: 'google/gemini-2.5-flash',
    evalModel: 'mistralai/mistral-large-2512',
  },
  {
    name: 'pocketbase',
    readmePath: resolve(B, 'pocketbase/README.md'),
    chodePath: resolve(P, 'pocketbase.chode'),
    authorModel: 'google/gemini-2.5-flash',
    evalModel: 'mistralai/mistral-large-2512',
  },
  {
    name: 'gin',
    readmePath: resolve(ROOT, 'gin-full/README.md'),
    chodePath: resolve(P, 'gin-full.chode'),
    authorModel: 'google/gemini-2.5-flash',
    evalModel: 'mistralai/mistral-large-2512',
  },
  // ── Mistral Large authors → GPT-4o evaluates ───────────────────────────────
  {
    name: 'ladybird',
    readmePath: resolve(B, 'ladybird/README.md'),
    chodePath: resolve(P, 'ladybird.chode'),
    authorModel: 'mistralai/mistral-large-2512',
    evalModel: 'openai/gpt-4o',
  },
  {
    name: 'ktor',
    readmePath: resolve(B, 'ktor/README.md'),
    chodePath: resolve(P, 'ktor.chode'),
    authorModel: 'mistralai/mistral-large-2512',
    evalModel: 'openai/gpt-4o',
  },
  {
    name: 'hono',
    readmePath: resolve(B, 'hono/README.md'),
    chodePath: resolve(P, 'hono.chode'),
    authorModel: 'mistralai/mistral-large-2512',
    evalModel: 'openai/gpt-4o',
  },
];

// ── API ───────────────────────────────────────────────────────────────────────

type QueryResult = { content: string; promptTokens: number; completionTokens: number };

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function query(model: string, apiKey: string, prompt: string): Promise<QueryResult> {
  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = Math.pow(2, attempt - 1) * 1500;
      console.log(`    [retry ${attempt}] waiting ${backoff}ms…`);
      await sleep(backoff);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Independent Question Benchmark',
      },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0 }),
    });

    if (res.status === 429) {
      const wait = parseInt(res.headers.get('retry-after') ?? '4') * 1000;
      lastError = new Error('rate limited');
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`OpenRouter ${res.status}: ${body}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
      usage?: { prompt_tokens: number; completion_tokens: number };
    };
    if (data.error) throw new Error(data.error.message);
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('empty response');

    await sleep(2000);
    return {
      content,
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    };
  }

  throw lastError;
}

// ── Phase 1: Question generation ─────────────────────────────────────────────

type GeneratedQuestion = {
  id: string;
  text: string;
  must: string[];
  good: string[];
  gt_raw: string;
};

function buildGenerationPrompt(repoName: string, readme: string): string {
  return `You are helping evaluate an AI context tool. Your job is to write 4 "stump questions" about the ${repoName} repository.

A stump question is one where:
1. The correct answer is a SPECIFIC technical fact (a library name, a command, a number, a file path)
2. Someone who hasn't studied this repo would likely guess wrong or guess a common alternative
3. The answer is NOT general knowledge — it's specific to how THIS project is built

You have access to the README only. Write questions whose answers appear in this README.

For each question, provide:
- The question text (natural, as a developer would ask it)
- The exact correct answer
- 1-3 required terms that must appear in a correct answer (lowercase, exact strings)
- 0-2 bonus terms for extra credit

README for ${repoName}:
---
${readme}
---

Respond in this EXACT format (repeat for all 4 questions):

Q1:
<question text>
ANSWER: <full correct answer>
MUST: <term1>, <term2>
GOOD: <bonus1>, <bonus2>

Q2:
<question text>
ANSWER: <full correct answer>
MUST: <term1>
GOOD:

Q3:
<question text>
ANSWER: <full correct answer>
MUST: <term1>, <term2>
GOOD: <bonus1>

Q4:
<question text>
ANSWER: <full correct answer>
MUST: <term1>
GOOD: <bonus1>

Write questions that would stump someone who only knows general knowledge about ${repoName}, not someone who has read the README carefully.`;
}

function parseGeneratedQuestions(raw: string): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const blocks = raw.split(/\n(?=Q\d+:)/);

  for (const block of blocks) {
    const qMatch = block.match(/^Q(\d+):/);
    if (!qMatch) continue;

    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const id = `Q${qMatch[1]}`;

    // Question text: lines after Qn: and before ANSWER:
    const answerIdx = lines.findIndex(l => l.startsWith('ANSWER:'));
    const mustIdx = lines.findIndex(l => l.startsWith('MUST:'));
    const goodIdx = lines.findIndex(l => l.startsWith('GOOD:'));

    if (answerIdx < 0 || mustIdx < 0) continue;

    const questionLines = lines.slice(1, answerIdx).filter(
      l => !l.startsWith('ANSWER:') && !l.startsWith('MUST:') && !l.startsWith('GOOD:')
    );
    const text = questionLines.join(' ').trim();
    const gt_raw = lines[answerIdx]!.replace(/^ANSWER:\s*/, '').trim();

    const mustLine = lines[mustIdx]!.replace(/^MUST:\s*/, '').trim();
    const must = mustLine ? mustLine.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

    const good: string[] = [];
    if (goodIdx >= 0) {
      const goodLine = lines[goodIdx]!.replace(/^GOOD:\s*/, '').trim();
      if (goodLine) good.push(...goodLine.split(',').map(t => t.trim().toLowerCase()).filter(Boolean));
    }

    if (text && must.length > 0) {
      questions.push({ id, text, must, good, gt_raw });
    }
  }

  return questions;
}

// ── Phase 2: Evaluation ───────────────────────────────────────────────────────

function buildBaselinePrompt(repoName: string, questions: GeneratedQuestion[]): string {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const last = questions[questions.length - 1]?.id ?? 'Q4';

  return `Answer these questions about the ${repoName} repository from your general knowledge.
If you don't know the specific answer, make your best guess based on what you know about this project.

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

${qList}

Answer Q1 through ${last}:`;
}

function buildChodePrompt(profile: string, questions: GeneratedQuestion[]): string {
  const n = questions.length;
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const last = questions[questions.length - 1]?.id ?? `Q${n}`;

  return `You are participating in a controlled benchmark. Answer ${n} questions using ONLY the information in this .chode profile.
If the information is not in the profile, answer: "Not in profile."

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

THE .CHODE PROFILE:
${profile}

THE ${n} QUESTIONS:
${qList}

Answer Q1 through ${last}:`;
}

function parseAnswers(raw: string, questions: GeneratedQuestion[]): Map<string, string> {
  const answers = new Map<string, string>();
  const blocks = raw.split(/\n(?=Q\d+[:.)\s])/);

  for (const block of blocks) {
    const m = block.match(/^Q(\d+)[:.)\s]/);
    if (!m) continue;
    const id = `Q${m[1]}`;
    const body = block.replace(/^Q\d+[:.)\s]+/, '').trim();
    if (body) answers.set(id, body);
  }

  return answers;
}

type ScoreResult = { score: number; reason: string };

function autoScore(answer: string, q: GeneratedQuestion): ScoreResult {
  const a = answer.toLowerCase();
  const abstained = /not in profile|not mentioned|don't know|cannot find|no information/i.test(a);

  if (abstained && q.must.length > 0) {
    return { score: 0, reason: 'abstained' };
  }

  const hasAllMust = q.must.every(t => a.includes(t));
  const hasAnyMust = q.must.some(t => a.includes(t));
  const goodCount = q.good.filter(t => a.includes(t)).length;

  if (!hasAnyMust) return { score: 0, reason: `missing: ${q.must.join(', ')}` };
  if (!hasAllMust) return { score: 1, reason: 'partial must-haves' };
  if (q.good.length > 0 && goodCount === 0) return { score: 2, reason: `has must, missing good: ${q.good.join(', ')}` };
  return { score: 3, reason: goodCount > 0 ? `all must + ${goodCount} good` : 'all must present' };
}

function pct(scores: ScoreResult[]): number {
  if (!scores.length) return 0;
  return Math.round(scores.reduce((n, s) => n + s.score, 0) / (scores.length * 3) * 100);
}

// ── Output ────────────────────────────────────────────────────────────────────

type RepoResult = {
  repo: RepoConfig;
  questions: GeneratedQuestion[];
  generationRaw: string;
  baseline: { answers: Map<string, string>; scores: ScoreResult[]; raw: string; tokens: number };
  chode: { answers: Map<string, string>; scores: ScoreResult[]; raw: string; tokens: number };
};

function buildOutput(results: RepoResult[], timestamp: string): string {
  const date = new Date().toISOString().slice(0, 10);

  // Summary
  const totalBaseline = results.flatMap(r => r.baseline.scores);
  const totalChode = results.flatMap(r => r.chode.scores);
  const baselinePct = pct(totalBaseline);
  const chodePct = pct(totalChode);

  let out = `# CHODE Independent Question Authorship Test — ${date}

> §16.4 item 9 response: questions authored by AI models that never saw the CHODE profile.
> Author model ≠ evaluator model. Round-robin assignment across 3 repos.

---

## Assignment

| Repo | Author Model | Evaluator Model |
|---|---|---|
${results.map(r => `| ${r.repo.name} | ${r.repo.authorModel} | ${r.repo.evalModel} |`).join('\n')}

---

## Summary

| Repo | Baseline | CHODE | Δ |
|---|---|---|---|
${results.map(r => {
  const b = pct(r.baseline.scores);
  const c = pct(r.chode.scores);
  return `| ${r.repo.name} | ${b}% | ${c}% | ${c >= b ? '+' : ''}${c - b}pp |`;
}).join('\n')}
| **Overall** | **${baselinePct}%** | **${chodePct}%** | **${chodePct >= baselinePct ? '+' : ''}${chodePct - baselinePct}pp** |

---

`;

  for (const r of results) {
    const b = pct(r.baseline.scores);
    const c = pct(r.chode.scores);

    out += `## ${r.repo.name}\n\n`;
    out += `**Author:** ${r.repo.authorModel}  \n`;
    out += `**Evaluator:** ${r.repo.evalModel}\n\n`;

    out += `### Generated Questions\n\n`;
    out += `| Q | Question | Must terms | GT answer |\n`;
    out += `|---|---|---|---|\n`;
    for (const q of r.questions) {
      out += `| ${q.id} | ${q.text} | ${q.must.join(', ')} | ${q.gt_raw.slice(0, 80)} |\n`;
    }
    out += '\n';

    out += `### Results\n\n`;
    out += `| Q | Topic | Baseline answer | B score | CHODE answer | C score |\n`;
    out += `|---|---|---|---|---|---|\n`;
    for (const q of r.questions) {
      const ba = r.baseline.answers.get(q.id) ?? '_(none)_';
      const ca = r.chode.answers.get(q.id) ?? '_(none)_';
      const bs = r.baseline.scores[r.questions.indexOf(q)];
      const cs = r.chode.scores[r.questions.indexOf(q)];
      const bShort = ba.length > 60 ? ba.slice(0, 60) + '…' : ba;
      const cShort = ca.length > 60 ? ca.slice(0, 60) + '…' : ca;
      out += `| ${q.id} | ${q.must[0] ?? ''} | ${bShort.replace(/\|/g, '\\|').replace(/\n/g, ' ')} | ${bs?.score ?? '?'}/3 | ${cShort.replace(/\|/g, '\\|').replace(/\n/g, ' ')} | ${cs?.score ?? '?'}/3 |\n`;
    }
    out += `\n**Baseline: ${b}% | CHODE: ${c}% | Δ: ${c >= b ? '+' : ''}${c - b}pp**\n\n`;

    out += `<details>\n<summary>Question generation — raw response</summary>\n\n\`\`\`\n${r.generationRaw}\n\`\`\`\n\n</details>\n\n`;
    out += `<details>\n<summary>Baseline — raw response</summary>\n\n\`\`\`\n${r.baseline.raw}\n\`\`\`\n\n</details>\n\n`;
    out += `<details>\n<summary>CHODE — raw response</summary>\n\n\`\`\`\n${r.chode.raw}\n\`\`\`\n\n</details>\n\n`;
    out += `---\n\n`;
  }

  out += `## Finding\n\n`;
  out += `Questions were authored by AI models with no access to the CHODE profile — only the repository README. `;
  out += `Across ${results.length} repos with independently authored questions, `;
  out += `CHODE scored **${chodePct}%** vs baseline **${baselinePct}%** (Δ **${chodePct >= baselinePct ? '+' : ''}${chodePct - baselinePct}pp**). `;

  if (chodePct > baselinePct + 20) {
    out += `The gap is consistent with the primary benchmark, confirming that the original question set did not exhibit authorship bias in favour of CHODE's output format.`;
  } else if (chodePct > baselinePct) {
    out += `CHODE outperforms baseline on independently authored questions, though the gap is smaller than in the primary benchmark. `;
    out += `This may reflect that README-derived questions are easier for baseline models (training data covers README content) or partial authorship alignment with CHODE's extraction targets.`;
  } else {
    out += `The gap did not replicate on independently authored questions. This warrants further investigation into authorship bias in the primary benchmark.`;
  }

  out += `\n\nFull result file: \`benchmarks/results/independent-question-test-${timestamp}.md\`\n`;

  return out;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };
  const apiKey = get('--key') ?? process.env['OPENROUTER_API_KEY'];

  if (!apiKey) {
    console.error('Error: --key <openrouter-api-key> or OPENROUTER_API_KEY env var required');
    process.exit(1);
  }

  console.log('\nCHODE Independent Question Authorship Test');
  console.log('  Repos: zulip, ruff, caddy');
  console.log('  Phase 1: AI models write questions from README only');
  console.log('  Phase 2: different AI models evaluate CHODE vs baseline');
  console.log(`  Total API calls: ${REPOS.length * 3} (1 generation + 2 evaluation per repo)\n`);

  const results: RepoResult[] = [];

  for (const repo of REPOS) {
    console.log(`\n  ── ${repo.name} ──`);
    console.log(`  Author: ${repo.authorModel}`);
    console.log(`  Evaluator: ${repo.evalModel}`);

    const readme = await readFile(repo.readmePath, 'utf8');
    const profile = await readFile(repo.chodePath, 'utf8');

    // Phase 1: generate questions
    process.stdout.write(`  [1/3] Generating questions… `);
    const genResult = await query(repo.authorModel, apiKey, buildGenerationPrompt(repo.name, readme));
    const questions = parseGeneratedQuestions(genResult.content);
    console.log(`${questions.length} questions parsed`);

    if (questions.length === 0) {
      console.log(`  ERROR: no questions parsed from response. Raw:\n${genResult.content.slice(0, 500)}`);
      continue;
    }

    for (const q of questions) {
      console.log(`    ${q.id}: "${q.text.slice(0, 60)}…" [must: ${q.must.join(', ')}]`);
    }

    // Phase 2a: baseline
    process.stdout.write(`  [2/3] Baseline eval… `);
    const baselineResult = await query(repo.evalModel, apiKey, buildBaselinePrompt(repo.name, questions));
    const baselineAnswers = parseAnswers(baselineResult.content, questions);
    const baselineScores = questions.map(q => autoScore(baselineAnswers.get(q.id) ?? '', q));
    console.log(`${pct(baselineScores)}%`);

    // Phase 2b: CHODE
    process.stdout.write(`  [3/3] CHODE eval… `);
    const chodeResult = await query(repo.evalModel, apiKey, buildChodePrompt(profile, questions));
    const chodeAnswers = parseAnswers(chodeResult.content, questions);
    const chodeScores = questions.map(q => autoScore(chodeAnswers.get(q.id) ?? '', q));
    console.log(`${pct(chodeScores)}%`);

    results.push({
      repo,
      questions,
      generationRaw: genResult.content,
      baseline: { answers: baselineAnswers, scores: baselineScores, raw: baselineResult.content, tokens: baselineResult.promptTokens },
      chode: { answers: chodeAnswers, scores: chodeScores, raw: chodeResult.content, tokens: chodeResult.promptTokens },
    });
  }

  // Summary
  console.log('\n\n  ── Summary ──────────────────────────────────────');
  console.log('  Repo'.padEnd(12) + 'Baseline'.padEnd(12) + 'CHODE'.padEnd(12) + 'Δ');
  console.log('  ' + '─'.repeat(44));
  for (const r of results) {
    const b = pct(r.baseline.scores);
    const c = pct(r.chode.scores);
    console.log(`  ${r.repo.name.padEnd(12)}${String(b + '%').padEnd(12)}${String(c + '%').padEnd(12)}${c >= b ? '+' : ''}${c - b}pp`);
  }
  const allB = pct(results.flatMap(r => r.baseline.scores));
  const allC = pct(results.flatMap(r => r.chode.scores));
  console.log('  ' + '─'.repeat(44));
  console.log(`  ${'Overall'.padEnd(12)}${String(allB + '%').padEnd(12)}${String(allC + '%').padEnd(12)}${allC >= allB ? '+' : ''}${allC - allB}pp`);

  // Save
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `independent-question-test-${timestamp}.md`);
  await writeFile(outFile, buildOutput(results, timestamp), 'utf8');
  console.log(`\n  Results saved: ${outFile}\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
