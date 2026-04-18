#!/usr/bin/env node
/**
 * Technique Comparison Benchmark
 *
 * Tests four context strategies head-to-head using the same questions:
 *   1. Baseline       — no context, training knowledge only
 *   2. README-only    — raw README.md pasted as context (~500–2000 tok)
 *   3. LLM summary    — model first summarizes README to ~500 tok, then answers
 *   4. CHODE          — structured .chode profile (~300–500 tok)
 *
 * Key question answered: "Why not just paste the README?" and
 * "Why not ask GPT to summarize it first?"
 *
 * Repos: caddy, ruff, zulip, pixijs (all have good .chode profiles + READMEs)
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/technique-comparison-test.ts --key sk-or-v1-...
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTER_REQUEST_DELAY_MS = 1500;
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODELS = [
  { label: 'gemini-flash', id: 'google/gemini-2.5-flash' },
  { label: 'gpt-4o',       id: 'openai/gpt-4o' },
];

type Q = {
  id: string;
  text: string;
  must: string[];
  good?: string[];
  note?: string;
};

type Repo = {
  name: string;
  chodePath: string;
  readmePath: string;
  questions: Q[];
};

// Questions are designed so the answer IS in the CHODE profile and also in the README.
// This tests retrieval quality, not just coverage.
const REPOS: Repo[] = [
  {
    name: 'caddy',
    chodePath: resolve(__dirname, 'profiles/caddy.chode'),
    readmePath: resolve(__dirname, 'caddy/README.md'),
    questions: [
      {
        id: 'Q1',
        text: 'What is the primary entry point file for this project?',
        must: ['cmd/caddy/main.go'],
        note: '@ENTRY — exact path, tests precision',
      },
      {
        id: 'Q2',
        text: 'What HTTP router/framework is this project built on?',
        must: ['chi'],
        note: '@STACK — one word, easy to miss in raw README',
      },
      {
        id: 'Q3',
        text: 'What external monitoring/metrics API does this project expose?',
        must: ['prometheus'],
        note: '@API — specific integration',
      },
      {
        id: 'Q4',
        text: 'How should error handling be structured in Go code per the project conventions?',
        must: ['early return', 'indent'],
        good: ['else'],
        note: '@CONVENTIONS — tests compression quality',
      },
    ],
  },
  {
    name: 'ruff',
    chodePath: resolve(__dirname, 'profiles/ruff.chode'),
    readmePath: resolve(__dirname, 'ruff/README.md'),
    questions: [
      {
        id: 'Q1',
        text: 'What programming languages is this project written in?',
        must: ['rust', 'python'],
        note: '@STACK',
      },
      {
        id: 'Q2',
        text: 'What package managers does this project use?',
        must: ['cargo', 'pip'],
        note: '@PKG',
      },
      {
        id: 'Q3',
        text: 'What is the performance claim for this tool compared to existing linters?',
        must: ['10', '100'],
        good: ['faster', 'flake8', 'black'],
        note: '@PURPOSE — key marketing claim',
      },
      {
        id: 'Q4',
        text: 'What must you do before submitting changes, according to the conventions?',
        must: ['test'],
        good: ['passing', 'run tests'],
        note: '@CONVENTIONS — testing requirement',
      },
    ],
  },
  {
    name: 'zulip',
    chodePath: resolve(__dirname, 'profiles/zulip.chode'),
    readmePath: resolve(__dirname, 'zulip/README.md'),
    questions: [
      {
        id: 'Q1',
        text: 'What authentication methods does this project support?',
        must: ['ldap', 'saml'],
        note: '@AUTH',
      },
      {
        id: 'Q2',
        text: 'What frontend framework is used for the web client?',
        must: ['preact'],
        note: '@FRONTEND — specific choice, often confused with React',
      },
      {
        id: 'Q3',
        text: 'What is the primary programming language for the backend?',
        must: ['python'],
        note: '@STACK',
      },
      {
        id: 'Q4',
        text: 'What package managers does this project use?',
        must: ['pnpm', 'uv'],
        note: '@PKG',
      },
    ],
  },
  {
    name: 'pixijs',
    chodePath: resolve(__dirname, 'profiles/pixijs.chode'),
    readmePath: resolve(__dirname, 'pixijs/README.md'),
    questions: [
      {
        id: 'Q1',
        text: 'What test framework does this project use?',
        must: ['jest'],
        note: '@TEST',
      },
      {
        id: 'Q2',
        text: 'What design patterns are used in this project?',
        must: ['plugin', 'event'],
        note: '@PATTERNS',
      },
      {
        id: 'Q3',
        text: 'What package manager does this project use?',
        must: ['npm'],
        note: '@PKG',
      },
      {
        id: 'Q4',
        text: 'What programming language is the primary codebase written in?',
        must: ['typescript', 'ts'],
        note: '@STACK — profile uses "ts" abbreviation',
      },
    ],
  },
];

// ── Scoring ────────────────────────────────────────────────────────────────────

function score(q: Q, answer: string): number {
  const a = answer.toLowerCase();
  const notFound = ['not in profile', 'not mentioned', 'not specified', 'cannot be determined', 'no information', 'not provided', 'not stated'];
  if (notFound.some(p => a.includes(p))) return 0;
  const hasAll = q.must.every(t => a.includes(t.toLowerCase()));
  const hasAny = q.must.some(t => a.includes(t.toLowerCase()));
  const goodCount = (q.good ?? []).filter(t => a.includes(t.toLowerCase())).length;
  if (!hasAny) return 0;
  if (!hasAll) return 1;
  if ((q.good ?? []).length > 0 && goodCount === 0) return 2;
  return 3;
}

// ── API ────────────────────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function callModel(
  modelId: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  for (let attempt = 0; attempt <= 3; attempt++) {
    if (attempt > 0) { await sleep(Math.pow(2, attempt - 1) * 1000); process.stdout.write(`[retry] `); }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Technique Comparison',
      },
      body: JSON.stringify({ model: modelId, messages, temperature: 0 }),
    });

    if (res.status === 429) { await sleep(parseInt(res.headers.get('retry-after') ?? '4') * 1000); continue; }
    if (!res.ok) { const b = await res.text(); if (res.status >= 500) continue; throw new Error(`HTTP ${res.status}: ${b.slice(0, 100)}`); }

    const data = await res.json() as { choices?: Array<{ message: { content: string } }>; error?: { message: string } };
    if (data.error) throw new Error(data.error.message);
    await sleep(INTER_REQUEST_DELAY_MS);
    return data.choices?.[0]?.message?.content ?? '';
  }
  throw new Error('max retries exceeded');
}

function parseAnswers(raw: string, questions: Q[]): Map<string, string> {
  const answers = new Map<string, string>();
  const n = questions.length;
  const blocks = raw.split(/\n(?=Q\d{1,2}[:.)\s])/);
  for (const block of blocks) {
    const m = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!m) continue;
    const num = parseInt(m[1]!);
    if (num < 1 || num > n) continue;
    const body = block.replace(/^Q\d{1,2}[:.)\s]+/, '').trim();
    if (body) answers.set(`Q${num}`, body);
  }
  return answers;
}

const QUESTION_PROMPT = (qList: string) => `Answer these questions concisely and specifically.

Format: label on its own line, answer on the next line.

QUESTIONS:
${qList}

Answer now.`;

const CHODE_SYSTEM = (profile: string) =>
  `You are given a CHODE profile — a compressed description of a software repository. Answer the questions below using ONLY information in the profile. If a fact is not present, say "Not in profile."`;

const README_SYSTEM = (readme: string) =>
  `You are given a software project's README. Answer the questions below using ONLY information in the README. If a fact is not present, say "Not in README."`;

// ── Technique runners ──────────────────────────────────────────────────────────

async function runBaseline(
  modelId: string, apiKey: string, questions: Q[],
): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const content = await callModel(modelId, apiKey, [
    { role: 'user', content: QUESTION_PROMPT(qList) },
  ]);
  return parseAnswers(content, questions);
}

async function runReadme(
  modelId: string, apiKey: string, readme: string, questions: Q[],
): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const content = await callModel(modelId, apiKey, [
    { role: 'user', content: `${README_SYSTEM(readme)}\n\nREADME:\n${readme}\n\n${QUESTION_PROMPT(qList)}` },
  ]);
  return parseAnswers(content, questions);
}

async function runLlmSummary(
  modelId: string, apiKey: string, readme: string, questions: Q[],
): Promise<{ answers: Map<string, string>; summary: string; summaryTok: number }> {
  // Step 1: generate summary
  const summaryRaw = await callModel(modelId, apiKey, [
    {
      role: 'user',
      content: `You are a technical documentation assistant. Read this README and produce a concise structured summary in under 500 tokens. Include: programming language(s), frameworks, package managers, test framework, entry point, authentication methods, key conventions, and purpose.\n\nREADME:\n${readme}\n\nSummary:`,
    },
  ]);
  const summary = summaryRaw.trim();
  const summaryTok = Math.ceil(summary.length / 4);

  // Step 2: answer questions from summary
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const content = await callModel(modelId, apiKey, [
    {
      role: 'user',
      content: `You are given a structured summary of a software project. Answer the questions below using ONLY information in the summary. If a fact is not present, say "Not in summary."\n\nSUMMARY:\n${summary}\n\n${QUESTION_PROMPT(qList)}`,
    },
  ]);
  return { answers: parseAnswers(content, questions), summary, summaryTok };
}

async function runChode(
  modelId: string, apiKey: string, profile: string, questions: Q[],
): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const content = await callModel(modelId, apiKey, [
    {
      role: 'user',
      content: `${CHODE_SYSTEM(profile)}\n\nTHE PROFILE:\n${profile}\n\n${QUESTION_PROMPT(qList)}`,
    },
  ]);
  return parseAnswers(content, questions);
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }

  const totalCalls = REPOS.length * MODELS.length * 5; // baseline+readme+summary(x2)+chode
  console.log(`\nCHODE Technique Comparison Benchmark`);
  console.log(`  Repos:  ${REPOS.map(r => r.name).join(', ')}`);
  console.log(`  Models: ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Techniques: baseline / readme-only / llm-summary (2-step) / chode`);
  console.log(`  API calls: ~${totalCalls}\n`);

  type TechResult = {
    score: number;
    answers: Record<string, { score: number; answer: string }>;
    inputTok: number;
    summaryTok?: number;
  };

  type RepoModelResult = {
    repo: string;
    model: string;
    max: number;
    readmeTok: number;
    chodeTok: number;
    baseline: TechResult;
    readme: TechResult;
    llmSummary: TechResult;
    chode: TechResult;
  };

  const allResults: RepoModelResult[] = [];

  for (const repo of REPOS) {
    const [profile, readme] = await Promise.all([
      readFile(repo.chodePath, 'utf8').catch(() => { console.error(`Missing: ${repo.chodePath}`); process.exit(1); }) as Promise<string>,
      readFile(repo.readmePath, 'utf8').catch(() => { console.error(`Missing: ${repo.readmePath}`); process.exit(1); }) as Promise<string>,
    ]);

    const chodeTok = Math.ceil(profile.length / 4);
    const readmeTok = Math.ceil(readme.length / 4);
    console.log(`\n══ ${repo.name} (chode ~${chodeTok} tok | readme ~${readmeTok} tok) ══`);

    for (const model of MODELS) {
      process.stdout.write(`  ${model.label.padEnd(14)} `);
      const max = repo.questions.length * 3;

      // Baseline
      process.stdout.write(`base… `);
      const baseAnswers = await runBaseline(model.id, apiKey, repo.questions);
      const baseScores: Record<string, { score: number; answer: string }> = {};
      let baseTotal = 0;
      for (const q of repo.questions) {
        const a = baseAnswers.get(q.id) ?? '';
        const s = score(q, a);
        baseScores[q.id] = { score: s, answer: a };
        baseTotal += s;
      }

      // README-only
      process.stdout.write(`readme… `);
      const readmeAnswers = await runReadme(model.id, apiKey, readme, repo.questions);
      const readmeScores: Record<string, { score: number; answer: string }> = {};
      let readmeTotal = 0;
      for (const q of repo.questions) {
        const a = readmeAnswers.get(q.id) ?? '';
        const s = score(q, a);
        readmeScores[q.id] = { score: s, answer: a };
        readmeTotal += s;
      }

      // LLM Summary (2-step)
      process.stdout.write(`llm-sum… `);
      const { answers: summaryAnswers, summaryTok } = await runLlmSummary(model.id, apiKey, readme, repo.questions);
      const summaryScores: Record<string, { score: number; answer: string }> = {};
      let summaryTotal = 0;
      for (const q of repo.questions) {
        const a = summaryAnswers.get(q.id) ?? '';
        const s = score(q, a);
        summaryScores[q.id] = { score: s, answer: a };
        summaryTotal += s;
      }

      // CHODE
      process.stdout.write(`chode… `);
      const chodeAnswers = await runChode(model.id, apiKey, profile, repo.questions);
      const chodeScores: Record<string, { score: number; answer: string }> = {};
      let chodeTotal = 0;
      for (const q of repo.questions) {
        const a = chodeAnswers.get(q.id) ?? '';
        const s = score(q, a);
        chodeScores[q.id] = { score: s, answer: a };
        chodeTotal += s;
      }

      const pct = (n: number) => `${Math.round(n / max * 100)}%`;
      console.log(`${pct(baseTotal)} | ${pct(readmeTotal)} | ${pct(summaryTotal)} | ${pct(chodeTotal)}`);

      allResults.push({
        repo: repo.name, model: model.label, max, readmeTok, chodeTok,
        baseline:   { score: baseTotal,    answers: baseScores,    inputTok: 300 },
        readme:     { score: readmeTotal,   answers: readmeScores,  inputTok: readmeTok },
        llmSummary: { score: summaryTotal,  answers: summaryScores, inputTok: summaryTok, summaryTok },
        chode:      { score: chodeTotal,    answers: chodeScores,   inputTok: chodeTok },
      });
    }
  }

  // ── Report ─────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  const pct = (n: number, d: number) => `${Math.round(n / d * 100)}%`;

  let md = `# CHODE Technique Comparison Benchmark\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repos:** ${REPOS.map(r => r.name).join(', ')}  \n`;
  md += `**Models:** ${MODELS.map(m => m.label).join(', ')}  \n\n`;

  md += `## What this tests\n\n`;
  md += `Four strategies for giving an AI model context about a repo:\n\n`;
  md += `| Technique | How | Approx tokens |\n|---|---|---|\n`;
  md += `| Baseline | No context — training knowledge only | ~300 |\n`;
  md += `| README-only | Paste raw README as context | varies (~500–2000) |\n`;
  md += `| LLM summary | Model summarizes README first, then answers from summary | ~500 (2 API calls) |\n`;
  md += `| **CHODE** | Structured .chode profile generated offline | **~350–500** |\n\n`;

  md += `## Score Summary\n\n`;
  md += `| Repo | Model | Baseline | README | LLM Summary | **CHODE** |\n|---|---|---|---|---|---|\n`;
  for (const r of allResults) {
    md += `| ${r.repo} | ${r.model} | ${pct(r.baseline.score, r.max)} | ${pct(r.readme.score, r.max)} | ${pct(r.llmSummary.score, r.max)} | **${pct(r.chode.score, r.max)}** |\n`;
  }
  md += '\n';

  // Aggregate totals
  let totBase = 0, totReadme = 0, totSummary = 0, totChode = 0, totMax = 0;
  for (const r of allResults) {
    totBase    += r.baseline.score;
    totReadme  += r.readme.score;
    totSummary += r.llmSummary.score;
    totChode   += r.chode.score;
    totMax     += r.max;
  }
  md += `**Aggregate (all repos × models):**\n`;
  md += `| Technique | Score | Avg input tokens |\n|---|---|---|\n`;
  md += `| Baseline | ${pct(totBase, totMax)} | ~300 |\n`;
  md += `| README-only | ${pct(totReadme, totMax)} | ~${Math.round(allResults.reduce((s, r) => s + r.readmeTok, 0) / allResults.length)} |\n`;
  md += `| LLM Summary | ${pct(totSummary, totMax)} | ~${Math.round(allResults.reduce((s, r) => s + (r.llmSummary.summaryTok ?? 500), 0) / allResults.length)} (×2 API calls) |\n`;
  md += `| **CHODE** | **${pct(totChode, totMax)}** | **~${Math.round(allResults.reduce((s, r) => s + r.chodeTok, 0) / allResults.length)}** |\n\n`;

  md += `## Per-Question Detail\n\n`;
  for (const repo of REPOS) {
    md += `### ${repo.name} (~${allResults.find(r => r.repo === repo.name)?.readmeTok} tok README | ~${allResults.find(r => r.repo === repo.name)?.chodeTok} tok CHODE)\n\n`;
    md += `| Q | Must contain | ${MODELS.map(m => `${m.label} base`).join(' | ')} | ${MODELS.map(m => `${m.label} readme`).join(' | ')} | ${MODELS.map(m => `${m.label} sum`).join(' | ')} | ${MODELS.map(m => `${m.label} chode`).join(' | ')} | Note |\n`;
    md += `|---|---|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|---|\n`;
    for (const q of repo.questions) {
      const cells = (tech: keyof RepoModelResult) =>
        MODELS.map(m => String((allResults.find(r => r.repo === repo.name && r.model === m.label)?.[tech] as TechResult)?.answers?.[q.id]?.score ?? '—')).join(' | ');
      md += `| ${q.id} | \`${q.must.join(', ')}\` | ${cells('baseline')} | ${cells('readme')} | ${cells('llmSummary')} | ${cells('chode')} | ${q.note ?? ''} |\n`;
    }
    md += '\n';
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `technique-comparison-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  // Console summary
  console.log('\n── Aggregate ─────────────────────────────────────────────────────');
  console.log(`${'Technique'.padEnd(16)} ${'Score'.padEnd(8)} Avg tokens`);
  console.log('─'.repeat(40));
  console.log(`${'Baseline'.padEnd(16)} ${pct(totBase, totMax).padEnd(8)} ~300`);
  console.log(`${'README-only'.padEnd(16)} ${pct(totReadme, totMax).padEnd(8)} ~${Math.round(allResults.reduce((s, r) => s + r.readmeTok, 0) / allResults.length)}`);
  console.log(`${'LLM Summary'.padEnd(16)} ${pct(totSummary, totMax).padEnd(8)} ~${Math.round(allResults.reduce((s, r) => s + (r.llmSummary.summaryTok ?? 500), 0) / allResults.length)} (2x calls)`);
  console.log(`${'CHODE'.padEnd(16)} ${pct(totChode, totMax).padEnd(8)} ~${Math.round(allResults.reduce((s, r) => s + r.chodeTok, 0) / allResults.length)}`);
}

main().catch(e => { console.error(e); process.exit(1); });
