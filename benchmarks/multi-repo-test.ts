#!/usr/bin/env node
/**
 * Multi-repo attribution benchmark — caddy, ruff, zulip
 *
 * Puts 3 CHODE profiles in ONE context window and asks questions that require
 * correctly attributing facts to the right repository.  Tests cross-contamination:
 * a model that confuses repos will answer the wrong language for the wrong repo.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/multi-repo-test.ts --key sk-or-v1-...
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTER_REQUEST_DELAY_MS = 1500;
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODELS = [
  { label: 'gpt-4o',        id: 'openai/gpt-4o' },
  { label: 'gemini-flash',  id: 'google/gemini-2.5-flash' },
];

// Ground truth derived from reading the .chode files:
//   caddy  → @STACK go chi cobra ...  → Go
//   ruff   → @STACK rust python       → Rust (the tool itself is written in Rust)
//   zulip  → @STACK python            → Python

type Question = {
  id: string;           // Q1-Q6
  text: string;
  // All strings that MUST appear in the answer (case-insensitive)
  must: string[];
  // Optional strings that strengthen a correct answer; absence doesn't penalise
  good?: string[];
  // Human-readable notes for the report
  note: string;
};

const QUESTIONS: Question[] = [
  // ── Per-repo attribution (repo named in question) ───────────────────────────
  {
    id: 'Q1',
    text: 'In the caddy repository, what is the primary programming language?',
    must: ['go'],
    note: 'caddy → Go',
  },
  {
    id: 'Q2',
    text: 'In the ruff repository, what language is the tool itself written in?',
    must: ['rust'],
    note: 'ruff → Rust',
  },
  {
    id: 'Q3',
    text: 'In the zulip repository, what is the primary backend language?',
    must: ['python'],
    note: 'zulip → Python',
  },
  // ── Reverse attribution (answer must name the correct repo) ─────────────────
  {
    id: 'Q4',
    text: 'Which of the three repositories (caddy, ruff, zulip) uses Go as its primary language?',
    must: ['caddy'],
    good: ['go'],
    note: 'Go → caddy',
  },
  {
    id: 'Q5',
    text: 'Which of the three repositories (caddy, ruff, zulip) is the tool itself written in Rust?',
    must: ['ruff'],
    good: ['rust'],
    note: 'Rust → ruff',
  },
  {
    id: 'Q6',
    text: 'Which of the three repositories (caddy, ruff, zulip) has Python as its primary backend language?',
    must: ['zulip'],
    good: ['python'],
    note: 'Python → zulip',
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────────
// 1 = correct attribution (all must[] terms present)
// 0 = wrong or missing

function score(q: Question, answer: string): 0 | 1 {
  const a = answer.toLowerCase();
  const refusal = ['not in profile', 'not mentioned', 'not specified', 'cannot determine', 'no information'];
  if (refusal.some(p => a.includes(p))) return 0;
  return q.must.every(t => a.includes(t.toLowerCase())) ? 1 : 0;
}

// ── Interference detection ────────────────────────────────────────────────────
// If a wrong repo name appears prominently in the answer when the right one should, flag it.

function detectInterference(q: Question, answer: string): string | null {
  const a = answer.toLowerCase();
  const repos = ['caddy', 'ruff', 'zulip'];
  // For per-repo questions (Q1-Q3) we know which repo was asked about
  const askedAbout = q.text.match(/\b(caddy|ruff|zulip)\b/i)?.[1]?.toLowerCase();
  if (!askedAbout) return null; // reverse questions — skip interference check here
  const wrongMentioned = repos.filter(r => r !== askedAbout && a.includes(r));
  if (wrongMentioned.length > 0 && score(q, answer) === 0) {
    return `mentioned ${wrongMentioned.join(', ')} instead of ${askedAbout}`;
  }
  return null;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function queryModel(
  modelId: string,
  apiKey: string,
  combinedContext: string,
): Promise<Map<string, string>> {
  const qList = QUESTIONS.map(q => `${q.id}: ${q.text}`).join('\n');

  const prompt = `You are given three CHODE profiles — compressed descriptions of three different software repositories. Each profile is clearly labelled with the repository name. Answer the questions below using ONLY the information in these profiles. Do not rely on outside knowledge about these projects.

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

═══════════ PROFILES ═══════════
${combinedContext}
════════════════════════════════

QUESTIONS:
${qList}

Answer all questions now.`;

  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(Math.pow(2, attempt - 1) * 1000);
      process.stdout.write(`[retry ${attempt}] `);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Multi-Repo Attribution Test',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const wait = parseInt(res.headers.get('retry-after') ?? '4') * 1000;
      await sleep(wait);
      lastError = new Error('rate limited');
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
    };
    if (data.error) throw new Error(data.error.message);

    const content = data.choices?.[0]?.message?.content ?? '';
    await sleep(INTER_REQUEST_DELAY_MS);
    return parseAnswers(content);
  }
  throw lastError;
}

function parseAnswers(raw: string): Map<string, string> {
  const answers = new Map<string, string>();
  const blocks = raw.split(/\n(?=Q\d{1,2}[:.)\s])/);
  for (const block of blocks) {
    const m = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!m) continue;
    const num = parseInt(m[1]!);
    if (num < 1 || num > QUESTIONS.length) continue;
    const body = block.replace(/^Q\d{1,2}[:.)\s]+/, '').trim();
    if (body) answers.set(`Q${num}`, body);
  }
  return answers;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };

  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }

  // ── Load profiles ────────────────────────────────────────────────────────────
  const profileNames = ['caddy', 'ruff', 'zulip'] as const;
  const profiles: Record<string, string> = {};

  for (const name of profileNames) {
    const p = resolve(__dirname, 'profiles', `${name}.chode`);
    profiles[name] = await readFile(p, 'utf8').catch(() => {
      console.error(`Cannot read profile: ${p}`); process.exit(1);
    }) as string;
  }

  // ── Build combined context ───────────────────────────────────────────────────
  const combinedContext = profileNames
    .map(name => `--- REPOSITORY: ${name.toUpperCase()} ---\n${profiles[name]}\n--- END ${name.toUpperCase()} ---`)
    .join('\n\n');

  const totalTokensEst = Math.ceil(combinedContext.length / 4);

  console.log('\nCHODE Multi-Repo Attribution Benchmark');
  console.log(`  Repos:   ${profileNames.join(', ')}`);
  console.log(`  Models:  ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Context: ~${totalTokensEst} tokens (all 3 profiles combined)`);
  console.log(`  Questions: ${QUESTIONS.length} (3 per-repo + 3 reverse attribution)`);
  console.log(`  Calls:   ${MODELS.length} (one call per model, all Q in one prompt)\n`);

  type ModelResult = {
    model: string;
    correct: number;
    total: number;
    perQ: Record<string, { score: 0 | 1; answer: string; interference: string | null }>;
  };
  const allResults: ModelResult[] = [];

  for (const model of MODELS) {
    process.stdout.write(`  ${model.label.padEnd(14)} querying… `);

    const answers = await queryModel(model.id, apiKey, combinedContext);

    let correct = 0;
    const perQ: ModelResult['perQ'] = {};

    for (const q of QUESTIONS) {
      const answer = answers.get(q.id.replace('Q', '')) ?? answers.get(q.id) ?? '';
      const s = score(q, answer);
      const interference = detectInterference(q, answer);
      correct += s;
      perQ[q.id] = { score: s, answer, interference };
    }

    const interferenceCount = Object.values(perQ).filter(v => v.interference !== null).length;
    console.log(`${correct}/${QUESTIONS.length}  (${interferenceCount} interference case${interferenceCount === 1 ? '' : 's'})`);

    allResults.push({ model: model.label, correct, total: QUESTIONS.length, perQ });
  }

  // ── Console summary ──────────────────────────────────────────────────────────
  console.log('\n── Attribution Results ───────────────────────────────────────────');
  console.log(`${'Model'.padEnd(16)} ${'Correct'.padEnd(10)} Interference`);
  console.log('─'.repeat(44));
  for (const r of allResults) {
    const interCount = Object.values(r.perQ).filter(v => v.interference !== null).length;
    console.log(
      `${r.model.padEnd(16)} ${`${r.correct}/${r.total}`.padEnd(10)} ${interCount}`
    );
  }

  // ── Markdown report ──────────────────────────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10);
  let md = `# CHODE Multi-Repo Attribution Benchmark\n\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repos in context:** caddy (Go), ruff (Rust), zulip (Python)  \n`;
  md += `**Models:** ${MODELS.map(m => `${m.label} (\`${m.id}\`)`).join(', ')}  \n`;
  md += `**Context size:** ~${totalTokensEst} tokens (3 profiles concatenated in one prompt)  \n`;
  md += `**Questions:** ${QUESTIONS.length} total — 3 per-repo attribution, 3 reverse attribution\n\n`;

  md += `## What This Tests\n\n`;
  md += `Multiple CHODE profiles are placed in a single context window. `;
  md += `The model must correctly attribute facts (e.g. programming language) `;
  md += `to the right repository without cross-contaminating information between repos. `;
  md += `A model that confuses profiles will say caddy uses Rust, or ruff uses Go, etc.\n\n`;

  md += `## Score Summary\n\n`;
  md += `| Model | Correct / 6 | Interference Cases |\n|---|---|---|\n`;
  for (const r of allResults) {
    const interCount = Object.values(r.perQ).filter(v => v.interference !== null).length;
    md += `| ${r.model} | **${r.correct}/${r.total}** | ${interCount} |\n`;
  }
  md += '\n';

  md += `## Per-Question Breakdown\n\n`;
  md += `| Q | Question (summarised) | Expected | `;
  md += MODELS.map(m => m.label).join(' | ');
  md += ` |\n|---|---|---|${MODELS.map(() => '---').join('|')}|\n`;

  for (const q of QUESTIONS) {
    const expected = `\`${q.must.join(', ')}\``;
    const scores = MODELS.map(m => {
      const r = allResults.find(r => r.model === m.label);
      const cell = r?.perQ[q.id];
      if (!cell) return '—';
      return cell.score === 1 ? '✓' : '✗';
    }).join(' | ');
    md += `| ${q.id} | ${q.note} | ${expected} | ${scores} |\n`;
  }
  md += '\n';

  md += `## Model Answers\n\n`;
  for (const r of allResults) {
    md += `### ${r.model}\n\n`;
    for (const q of QUESTIONS) {
      const cell = r.perQ[q.id];
      if (!cell) continue;
      const mark = cell.score === 1 ? '✓' : '✗';
      md += `**${q.id} ${mark}** — *${q.note}*\n`;
      md += `> ${cell.answer.replace(/\n/g, '\n> ')}\n`;
      if (cell.interference) {
        md += `> ⚠ Interference: ${cell.interference}\n`;
      }
      md += '\n';
    }
  }

  md += `## Combined Profile Context (sent verbatim)\n\n`;
  md += `\`\`\`\n${combinedContext}\n\`\`\`\n`;

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `multi-repo-test-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
