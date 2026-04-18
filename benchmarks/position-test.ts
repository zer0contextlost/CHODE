#!/usr/bin/env node
/**
 * CHODE Position Test
 * Tests whether placing a .chode profile at the START vs END of the prompt
 * affects model answer accuracy — based on the "Lost in the Middle" finding
 * that LLMs attend more strongly to content at the end of long contexts.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/position-test.ts --key sk-or-...
 *   node --experimental-strip-types benchmarks/position-test.ts --key sk-or-... --model openai/gpt-4o
 *
 * Hypothesis: END placement → higher scores (recency bias)
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Question definitions ───────────────────────────────────────────────────────
// Each question has must/good scoring terms drawn from actual profile content.
// All are "stump" questions — an expert would likely get them wrong without reading
// the profile (wrong framework, wrong tool, wrong count, etc.).

type Question = {
  id: string;
  text: string;
  must: string[];   // all required for score > 0
  good: string[];   // any one = full credit (score 3 vs 2)
  note: string;
};

// ── Gitea questions ───────────────────────────────────────────────────────────
// Profile facts: chi router, pnpm+gomod+uv, ini config, 305 migrations, make fmt
const GITEA_QUESTIONS: Question[] = [
  {
    id: 'G1',
    text: 'What Go HTTP router library does Gitea use?',
    must: ['chi'],
    good: [],
    note: 'stump: experts guess gin, echo, or mux',
  },
  {
    id: 'G2',
    text: 'What configuration file format does Gitea use?',
    must: ['ini'],
    good: [],
    note: 'stump: Go devs expect YAML/TOML',
  },
  {
    id: 'G3',
    text: 'What command must you run before committing code to Gitea?',
    must: ['make fmt'],
    good: [],
    note: 'very specific — from @CONVENTIONS',
  },
  {
    id: 'G4',
    text: 'How many database migration files does Gitea have?',
    must: ['305'],
    good: [],
    note: 'exact count from @DATA — stump',
  },
];

// ── Ruff questions ────────────────────────────────────────────────────────────
// Profile facts: rust+python, cargo+pip, toml config, crates/(4705) largest,
//   playground uses WASM (stack overflow tip)
const RUFF_QUESTIONS: Question[] = [
  {
    id: 'R1',
    text: 'What programming language are the core linting/formatting rules written in?',
    must: ['rust'],
    good: [],
    note: 'stump: project purpose implies Python, but implementation is Rust',
  },
  {
    id: 'R2',
    text: 'What package managers does this project use? List all mentioned.',
    must: ['cargo', 'pip'],
    good: ['npm'],
    note: 'stump: experts say pip only; cargo + npm also present',
  },
  {
    id: 'R3',
    text: 'What configuration file format does Ruff use for project metadata?',
    must: ['toml'],
    good: [],
    note: 'stump: some expect setup.cfg or requirements.txt',
  },
  {
    id: 'R4',
    text: 'If you see a stack overflow in the Ruff playground, what build mode should you use for the WASM module?',
    must: ['release'],
    good: ['wasm'],
    note: 'from @GOTCHAS — very specific stump',
  },
];

// ── Caddy questions ───────────────────────────────────────────────────────────
// Profile facts: go+chi+cobra+testify+otel+zap, gomod, cmd/caddy/main.go entry,
//   prometheus monitoring, modules/(199) largest package, early-return error style
const CADDY_QUESTIONS: Question[] = [
  {
    id: 'C1',
    text: 'What is the main entry point file for the Caddy binary?',
    must: ['cmd/caddy/main.go'],
    good: [],
    note: 'stump: experts guess main.go or cmd/main.go',
  },
  {
    id: 'C2',
    text: 'What observability/metrics system does Caddy integrate with?',
    must: ['prometheus'],
    good: [],
    note: 'from @API — stump if not read profile',
  },
  {
    id: 'C3',
    text: 'What Go error-handling convention does Caddy follow?',
    must: ['early return'],
    good: ['indent'],
    note: 'from @CONVENTIONS — specific Go idiom',
  },
  {
    id: 'C4',
    text: 'What package has the most files in the Caddy codebase?',
    must: ['modules'],
    good: ['199'],
    note: 'from @PACKAGES modules/(199)',
  },
];

const REPO_QUESTIONS: Record<string, Question[]> = {
  gitea: GITEA_QUESTIONS,
  ruff:  RUFF_QUESTIONS,
  caddy: CADDY_QUESTIONS,
};

// Profile paths — gitea lives in samples/, ruff and caddy in benchmarks/profiles/
const PROFILE_PATHS: Record<string, string> = {
  gitea: resolve(__dirname, '..', 'samples', 'gitea.chode'),
  ruff:  resolve(__dirname, 'profiles', 'ruff.chode'),
  caddy: resolve(__dirname, 'profiles', 'caddy.chode'),
};

// ── Prompt builders ───────────────────────────────────────────────────────────

const RULES = `RULES:
1. Use ONLY the information in the .chode profile provided.
2. If the information is not in the profile, answer: "Not in profile."
3. Answer all questions in order.
4. Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.`;

function buildQuestionBlock(questions: Question[]): string {
  return questions.map((q, i) => `Q${i + 1}: ${q.text}`).join('\n');
}

function buildStartPrompt(profile: string, questions: Question[]): string {
  const n = questions.length;
  const qBlock = buildQuestionBlock(questions);
  return `You are participating in a controlled benchmark. Answer the questions using ONLY the .chode profile below.

${RULES}

THE .CHODE PROFILE:
${profile}

THE ${n} QUESTIONS:
${qBlock}

Now answer Q1 through Q${n}.`;
}

function buildEndPrompt(profile: string, questions: Question[]): string {
  const n = questions.length;
  const qBlock = buildQuestionBlock(questions);
  return `You are participating in a controlled benchmark. Answer the questions using ONLY the .chode profile provided at the end of this prompt.

${RULES}

THE ${n} QUESTIONS:
${qBlock}

Context:
${profile}

Now answer Q1 through Q${n}.`;
}

// ── API ───────────────────────────────────────────────────────────────────────

type QueryResult = { content: string; promptTokens: number; completionTokens: number };

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function queryOpenRouter(
  model: string,
  apiKey: string,
  prompt: string,
  label: string,
): Promise<QueryResult> {
  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = Math.pow(2, attempt - 1) * 1500;
      console.log(`  [retry ${attempt}/${MAX_RETRIES} for ${label}] waiting ${backoff}ms…`);
      await sleep(backoff);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Position Test',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 200,
      }),
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 3000;
      console.log(`  [rate limited] waiting ${wait}ms…`);
      lastError = new Error('OpenRouter rate limited (429)');
      await sleep(wait);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`OpenRouter error ${res.status}: ${body}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    if (data.error) throw new Error(`OpenRouter: ${data.error.message}`);
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('OpenRouter returned empty response');

    // Polite inter-request delay
    await sleep(1500);
    return {
      content,
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    };
  }

  throw lastError;
}

// ── Parser ────────────────────────────────────────────────────────────────────

function parseAnswers(raw: string, count: number): Map<number, string> {
  const answers = new Map<number, string>();
  const blocks = raw.split(/\n(?=Q(\d{1,2})[:.)\s])/);

  for (const block of blocks) {
    const m = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!m) continue;
    const num = parseInt(m[1]!);
    if (num < 1 || num > count) continue;
    const body = block
      .replace(/^Q\d{1,2}[:.)\s]+/, '')
      .trim();
    if (body) answers.set(num, body);
  }

  return answers;
}

// ── Scorer ────────────────────────────────────────────────────────────────────

type ScoreResult = { score: number; reason: string };

function scoreAnswer(answer: string, q: Question): ScoreResult {
  const a = answer.toLowerCase();

  const NOT_FOUND = ['not in profile', 'not mentioned', 'not specified', 'cannot be determined'];
  if (NOT_FOUND.some(p => a.includes(p))) {
    return { score: 0, reason: 'abstained (not in profile)' };
  }

  const hasAllMust = q.must.every(t => a.includes(t.toLowerCase()));
  const hasAnyMust = q.must.some(t => a.includes(t.toLowerCase()));

  if (q.must.length > 0 && !hasAnyMust) {
    return { score: 0, reason: `missing: ${q.must.join(', ')}` };
  }
  if (q.must.length > 0 && !hasAllMust) {
    return { score: 1, reason: 'partial must-haves' };
  }
  // All must present — check good terms
  if (q.good.length > 0) {
    const goodHits = q.good.filter(t => a.includes(t.toLowerCase())).length;
    if (goodHits === 0) {
      return { score: 2, reason: `has must, missing good: ${q.good.join(', ')}` };
    }
    return { score: 3, reason: `full credit (must + good)` };
  }
  return { score: 3, reason: 'full credit' };
}

// ── Run one condition ─────────────────────────────────────────────────────────

type ConditionResult = {
  scores: ScoreResult[];
  total: number;
  max: number;
  raw: string;
  promptTokens: number;
};

async function runCondition(
  model: string,
  apiKey: string,
  profile: string,
  questions: Question[],
  position: 'start' | 'end',
  label: string,
): Promise<ConditionResult> {
  const prompt = position === 'start'
    ? buildStartPrompt(profile, questions)
    : buildEndPrompt(profile, questions);

  const result = await queryOpenRouter(model, apiKey, prompt, label);
  const answers = parseAnswers(result.content, questions.length);

  const scores: ScoreResult[] = questions.map((q, i) => {
    const answer = answers.get(i + 1) ?? '';
    if (!answer) return { score: 0, reason: 'not parsed' };
    return scoreAnswer(answer, q);
  });

  const total = scores.reduce((n, s) => n + s.score, 0);
  const max = questions.length * 3;

  return { scores, total, max, raw: result.content, promptTokens: result.promptTokens };
}

// ── Table formatter ───────────────────────────────────────────────────────────

function pct(n: number, d: number): string {
  return d === 0 ? '—' : `${Math.round((n / d) * 100)}%`;
}

function sign(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

function buildTable(rows: Array<{
  repo: string;
  model: string;
  startScore: number;
  endScore: number;
  max: number;
}>): string {
  const header = '| Repo | Model | START score | END score | Delta |';
  const sep    = '|------|-------|-------------|-----------|-------|';
  const lines = rows.map(r => {
    const delta = r.endScore - r.startScore;
    const deltaStr = sign(delta);
    return `| ${r.repo} | ${r.model} | ${r.startScore}/${r.max} (${pct(r.startScore, r.max)}) | ${r.endScore}/${r.max} (${pct(r.endScore, r.max)}) | ${deltaStr} |`;
  });
  return [header, sep, ...lines].join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const apiKey = get('--key') ?? process.env['OPENROUTER_API_KEY'];
  if (!apiKey) {
    console.error('Error: --key <openrouter-api-key> is required (or set OPENROUTER_API_KEY env var)');
    process.exit(1);
  }

  const modelArg = get('--model');
  const MODELS = modelArg
    ? [modelArg]
    : ['openai/gpt-4o', 'google/gemini-2.5-flash'];

  const REPOS = ['gitea', 'ruff', 'caddy'];

  console.log('\nCHODE Position Test — START vs END context placement');
  console.log(`  Models: ${MODELS.join(', ')}`);
  console.log(`  Repos:  ${REPOS.join(', ')}`);
  console.log(`  Hypothesis: END placement scores higher (recency bias)\n`);

  // Load profiles
  const profiles: Record<string, string> = {};
  for (const repo of REPOS) {
    const path = PROFILE_PATHS[repo];
    if (!path) { console.error(`No profile path defined for repo: ${repo}`); process.exit(1); }
    try {
      profiles[repo] = await readFile(path, 'utf8');
      console.log(`  Loaded ${repo} profile (${Math.ceil(profiles[repo]!.length / 4)} est. tokens) from ${path}`);
    } catch {
      console.error(`Cannot read profile for ${repo}: ${path}`);
      process.exit(1);
    }
  }

  console.log();

  type RunRecord = {
    repo: string;
    model: string;
    startResult: ConditionResult;
    endResult: ConditionResult;
    questions: Question[];
  };

  const runs: RunRecord[] = [];

  // ── Run all combinations ──────────────────────────────────────────────────
  for (const model of MODELS) {
    for (const repo of REPOS) {
      const questions = REPO_QUESTIONS[repo]!;
      const profile = profiles[repo]!;
      const modelShort = model.split('/')[1] ?? model;

      console.log(`[${repo} × ${modelShort}]`);

      console.log(`  START placement…`);
      const startResult = await runCondition(
        model, apiKey, profile, questions, 'start',
        `${repo}/${modelShort}/start`,
      );
      console.log(`  → ${startResult.total}/${startResult.max} (${pct(startResult.total, startResult.max)})`);

      console.log(`  END placement…`);
      const endResult = await runCondition(
        model, apiKey, profile, questions, 'end',
        `${repo}/${modelShort}/end`,
      );
      const delta = endResult.total - startResult.total;
      console.log(`  → ${endResult.total}/${endResult.max} (${pct(endResult.total, endResult.max)}) | Δ ${sign(delta)}\n`);

      runs.push({ repo, model, startResult, endResult, questions });
    }
  }

  // ── Build output ──────────────────────────────────────────────────────────
  const ts = new Date();
  const dateStr = ts.toISOString().slice(0, 10);
  const stamp = ts.toISOString().replace(/[:.]/g, '').replace('T', '-').slice(0, 15);

  const tableRows = runs.map(r => ({
    repo: r.repo,
    model: r.model.split('/')[1] ?? r.model,
    startScore: r.startResult.total,
    endScore: r.endResult.total,
    max: r.startResult.max,
  }));

  const table = buildTable(tableRows);

  // Per-repo per-model detail sections
  const detailSections = runs.map(r => {
    const modelShort = r.model.split('/')[1] ?? r.model;
    const lines: string[] = [
      `### ${r.repo} × ${modelShort}`,
      '',
      `| Q | Question (truncated) | START answer | START score | END answer | END score |`,
      `|---|----------------------|--------------|-------------|------------|-----------|`,
    ];

    // Re-parse answers from raw responses
    const startAnswers = parseAnswers(r.startResult.raw, r.questions.length);
    const endAnswers = parseAnswers(r.endResult.raw, r.questions.length);

    r.questions.forEach((q, i) => {
      const qn = i + 1;
      const sa = startAnswers.get(qn) ?? '_(not parsed)_';
      const ea = endAnswers.get(qn) ?? '_(not parsed)_';
      const sShort = sa.replace(/\n/g, ' ').replace(/\|/g, '\\|').slice(0, 80);
      const eShort = ea.replace(/\n/g, ' ').replace(/\|/g, '\\|').slice(0, 80);
      const ss = r.startResult.scores[i]!;
      const es = r.endResult.scores[i]!;
      lines.push(`| Q${qn} | ${q.text.slice(0, 45).replace(/\|/g, '\\|')}… | ${sShort} | ${ss.score}/3 | ${eShort} | ${es.score}/3 |`);
    });

    const delta = r.endResult.total - r.startResult.total;
    lines.push('');
    lines.push(`**START:** ${r.startResult.total}/${r.startResult.max} — **END:** ${r.endResult.total}/${r.endResult.max} — **Δ:** ${sign(delta)}`);
    lines.push('');
    lines.push('<details><summary>Raw START response</summary>');
    lines.push('');
    lines.push('```');
    lines.push(r.startResult.raw);
    lines.push('```');
    lines.push('</details>');
    lines.push('');
    lines.push('<details><summary>Raw END response</summary>');
    lines.push('');
    lines.push('```');
    lines.push(r.endResult.raw);
    lines.push('```');
    lines.push('</details>');

    return lines.join('\n');
  });

  // Hypothesis verdict
  const endWins = runs.filter(r => r.endResult.total > r.startResult.total).length;
  const startWins = runs.filter(r => r.startResult.total > r.endResult.total).length;
  const ties = runs.filter(r => r.startResult.total === r.endResult.total).length;
  const totalDelta = runs.reduce((n, r) => n + (r.endResult.total - r.startResult.total), 0);

  let verdict: string;
  if (endWins > startWins) {
    verdict = `END placement wins ${endWins}/${runs.length} matchups (Δ total: ${sign(totalDelta)}) — **hypothesis SUPPORTED**: recency bias detected.`;
  } else if (startWins > endWins) {
    verdict = `START placement wins ${startWins}/${runs.length} matchups (Δ total: ${sign(totalDelta)}) — **hypothesis REFUTED**: primacy bias or no effect.`;
  } else {
    verdict = `Tied ${ties}/${runs.length} matchups (Δ total: ${sign(totalDelta)}) — **inconclusive**: no strong position effect detected.`;
  }

  const output = `# CHODE Position Test — START vs END Context Placement
**Date:** ${dateStr}
**Models:** ${MODELS.join(', ')}
**Repos:** ${REPOS.join(', ')}
**Questions per repo:** 4
**Score per question:** 0–3 (must/good terms) | max per repo: 12

## Hypothesis

> Models attend more strongly to context placed at the **end** of the prompt
> ("Lost in the Middle", Liu et al. 2023). Therefore, placing the CHODE profile
> at the END should yield higher accuracy than at the START.

**Prompt format — START:**
\`\`\`
[CHODE profile]

Question: ...
\`\`\`

**Prompt format — END:**
\`\`\`
Question: ...

Context:
[CHODE profile]
\`\`\`

---

## Summary Table

${table}

---

## Verdict

${verdict}

END wins: ${endWins} | START wins: ${startWins} | Ties: ${ties} | Total Δ: ${sign(totalDelta)}

---

## Per-Run Detail

${detailSections.join('\n\n---\n\n')}
`;

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `position-test-${stamp}.md`);
  await writeFile(outFile, output, 'utf8');

  console.log('── Summary ──────────────────────────────────────────────');
  console.log(table);
  console.log();
  console.log(`Verdict: ${verdict}`);
  console.log(`\nResults saved: ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
