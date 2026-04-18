#!/usr/bin/env node
/**
 * Random Repos Benchmark
 * pocketbase (Go), mermaid (TypeScript), ruff (Rust), caddy (Go), dagger (Go/multi)
 * 4 questions per repo (2 general + 2 stump), 2 models, baseline vs CHODE
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/random-repos-test.ts --key sk-or-v1-...
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

type Q = { id: string; text: string; must: string[]; good?: string[]; stump: boolean };
type Repo = { name: string; lang: string; chodePath: string; questions: Q[] };

const REPOS: Repo[] = [
  {
    name: 'pocketbase',
    lang: 'Go',
    chodePath: resolve(__dirname, 'pocketbase/.chode'),
    questions: [
      { id: 'Q1', stump: false, text: 'What programming language is this project written in?',       must: ['go'],             good: ['golang'] },
      { id: 'Q2', stump: false, text: 'What authentication method does this project support?',        must: ['oauth'],          good: [] },
      { id: 'Q3', stump: true,  text: 'How many database migrations does this project have?',         must: ['7'],              good: [] },
      { id: 'Q4', stump: true,  text: 'What design pattern is used for extensibility in this project?', must: ['plugin'],      good: [] },
    ],
  },
  {
    name: 'mermaid',
    lang: 'TypeScript',
    chodePath: resolve(__dirname, 'mermaid/.chode'),
    questions: [
      { id: 'Q1', stump: false, text: 'What language is this project written in?',                   must: ['typescript'],     good: ['ts'] },
      { id: 'Q2', stump: false, text: 'What package manager does this project use?',                 must: ['pnpm'],           good: [] },
      { id: 'Q3', stump: true,  text: 'What configuration format does this project use?',            must: ['docker-compose'], good: ['yaml'] },
      { id: 'Q4', stump: true,  text: 'What end-to-end test framework is used alongside unit tests?', must: ['cypress'],       good: ['playwright'] },
    ],
  },
  {
    name: 'ruff',
    lang: 'Rust',
    chodePath: resolve(__dirname, 'ruff/.chode'),
    questions: [
      { id: 'Q1', stump: false, text: 'What languages is this project written in?',                  must: ['rust', 'python'], good: [] },
      { id: 'Q2', stump: false, text: 'What package managers are used?',                             must: ['cargo', 'pip'],   good: [] },
      { id: 'Q3', stump: true,  text: 'What configuration file format does this project use?',       must: ['toml'],           good: [] },
      { id: 'Q4', stump: true,  text: 'What workaround is documented for stack overflows in the playground?', must: ['release'], good: ['wasm'] },
    ],
  },
  {
    name: 'caddy',
    lang: 'Go',
    chodePath: resolve(__dirname, 'caddy/.chode'),
    questions: [
      { id: 'Q1', stump: false, text: 'What language is this project written in?',                   must: ['go'],             good: ['golang'] },
      { id: 'Q2', stump: false, text: 'What monitoring system does it integrate with?',              must: ['prometheus'],     good: [] },
      { id: 'Q3', stump: true,  text: 'What Go HTTP router library does this project use?',          must: ['chi'],            good: [] },
      { id: 'Q4', stump: true,  text: 'What structured logging library is used?',                    must: ['zap'],            good: [] },
    ],
  },
  {
    name: 'dagger',
    lang: 'Go/multi',
    chodePath: resolve(__dirname, 'dagger/.chode'),
    questions: [
      { id: 'Q1', stump: false, text: 'What is the primary language of this project?',               must: ['go'],             good: [] },
      { id: 'Q2', stump: false, text: 'What design patterns are present in this codebase?',          must: ['plugin'],         good: ['strategy'] },
      { id: 'Q3', stump: true,  text: 'What test frameworks are used across the SDKs?',              must: ['pytest', 'mocha'], good: ['mix'] },
      { id: 'Q4', stump: true,  text: 'What GraphQL field tag format is used for core types?',       must: ['field:"true"'],   good: ['doc:'] },
    ],
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────────

function score(q: Q, answer: string): number {
  const a = answer.toLowerCase();
  const notFound = ['not in profile', 'not mentioned', 'not specified', 'cannot be determined', 'no information'];
  if (notFound.some(p => a.includes(p))) return 0;
  const hasAll = q.must.every(t => a.includes(t.toLowerCase()));
  const hasAny = q.must.some(t => a.includes(t.toLowerCase()));
  const goodCount = (q.good ?? []).filter(t => a.includes(t.toLowerCase())).length;
  if (!hasAny) return 0;
  if (!hasAll) return 1;
  if ((q.good ?? []).length > 0 && goodCount === 0) return 2;
  return 3;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function queryModel(modelId: string, apiKey: string, profile: string | null, questions: Q[]): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const prompt = profile
    ? `You are given a CHODE profile — a compressed description of a software repository. Answer the questions using ONLY information in the profile. If a fact is not present, say "Not in profile."

Format: label on its own line, answer on the next line.

THE PROFILE:
${profile}

QUESTIONS:
${qList}

Answer now.`
    : `Answer these questions about software projects from your general knowledge. Be concise and specific.

Format: label on its own line, answer on the next line.

QUESTIONS:
${qList}

Answer now.`;

  for (let attempt = 0; attempt <= 3; attempt++) {
    if (attempt > 0) { await sleep(Math.pow(2, attempt - 1) * 1000); process.stdout.write(`[retry] `); }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'HTTP-Referer': 'https://github.com/chode', 'X-Title': 'CHODE Random Repos' },
      body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: prompt }], temperature: 0 }),
    });

    if (res.status === 429) { await sleep(parseInt(res.headers.get('retry-after') ?? '4') * 1000); continue; }
    if (!res.ok) { const b = await res.text(); if (res.status >= 500) continue; throw new Error(`HTTP ${res.status}: ${b.slice(0, 100)}`); }

    const data = await res.json() as { choices?: Array<{ message: { content: string } }>; error?: { message: string } };
    if (data.error) throw new Error(data.error.message);
    const content = data.choices?.[0]?.message?.content ?? '';
    await sleep(INTER_REQUEST_DELAY_MS);
    return parseAnswers(content, questions.length);
  }
  throw new Error('max retries exceeded');
}

function parseAnswers(raw: string, n: number): Map<string, string> {
  const answers = new Map<string, string>();
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

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }

  console.log(`\nCHODE Random Repos Benchmark`);
  console.log(`  Repos:  ${REPOS.map(r => `${r.name}(${r.lang})`).join(', ')}`);
  console.log(`  Models: ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Calls:  ${REPOS.length * MODELS.length * 2}\n`);

  type Result = { repo: string; model: string; base: Record<string, number>; chode: Record<string, number>; baseTotal: number; chodeTotal: number; max: number };
  const allResults: Result[] = [];

  for (const repo of REPOS) {
    const profile = await readFile(repo.chodePath, 'utf8').catch(() => { console.error(`Missing: ${repo.chodePath}`); process.exit(1); }) as string;
    const tok = Math.ceil(profile.length / 4);
    console.log(`\n══ ${repo.name} (${repo.lang}, ~${tok} tok) ══`);

    for (const model of MODELS) {
      process.stdout.write(`  ${model.label.padEnd(14)} base… `);
      const baseAnswers = await queryModel(model.id, apiKey, null, repo.questions);
      const base: Record<string, number> = {};
      let baseTotal = 0;
      for (const q of repo.questions) { const s = score(q, baseAnswers.get(q.id) ?? ''); base[q.id] = s; baseTotal += s; }

      process.stdout.write(`${baseTotal}/${repo.questions.length * 3}  chode… `);
      const chodeAnswers = await queryModel(model.id, apiKey, profile, repo.questions);
      const chode: Record<string, number> = {};
      let chodeTotal = 0;
      for (const q of repo.questions) { const s = score(q, chodeAnswers.get(q.id) ?? ''); chode[q.id] = s; chodeTotal += s; }

      const pct = (n: number) => `${Math.round(n / (repo.questions.length * 3) * 100)}%`;
      const delta = chodeTotal - baseTotal;
      console.log(`${chodeTotal}/${repo.questions.length * 3}  ${delta >= 0 ? '▲' : '▽'} ${pct(chodeTotal)} vs ${pct(baseTotal)}`);
      allResults.push({ repo: repo.name, model: model.label, base, chode, baseTotal, chodeTotal, max: repo.questions.length * 3 });
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  const pct = (n: number, d: number) => `${Math.round(n / d * 100)}%`;

  let md = `# CHODE Random Repos Benchmark\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repos:** pocketbase (Go), mermaid (TypeScript), ruff (Rust), caddy (Go), dagger (Go/multi)  \n`;
  md += `**Models:** ${MODELS.map(m => m.label).join(', ')}  \n\n`;

  md += `## Score Summary\n\n`;
  md += `| Repo | Lang | Model | Baseline | CHODE | Δ |\n|---|---|---|---|---|---|\n`;
  for (const r of allResults) {
    const repo = REPOS.find(x => x.name === r.repo)!;
    const delta = r.chodeTotal - r.baseTotal;
    md += `| ${r.repo} | ${repo.lang} | ${r.model} | ${r.baseTotal}/${r.max} (${pct(r.baseTotal, r.max)}) | ${r.chodeTotal}/${r.max} (${pct(r.chodeTotal, r.max)}) | ${delta >= 0 ? '+' : ''}${delta} |\n`;
  }
  md += '\n';

  md += `## Per-Question Breakdown\n\n`;
  for (const repo of REPOS) {
    md += `### ${repo.name} (${repo.lang})\n\n`;
    md += `| Q | Stump | Must | ${MODELS.map(m => `${m.label} base`).join(' | ')} | ${MODELS.map(m => `${m.label} chode`).join(' | ')} |\n`;
    md += `|---|---|---|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|\n`;
    for (const q of repo.questions) {
      const baseCells = MODELS.map(m => String(allResults.find(r => r.repo === repo.name && r.model === m.label)?.base[q.id] ?? '—')).join(' | ');
      const chodeCells = MODELS.map(m => String(allResults.find(r => r.repo === repo.name && r.model === m.label)?.chode[q.id] ?? '—')).join(' | ');
      md += `| ${q.id} | ${q.stump ? '★' : ''} | \`${q.must.join(', ')}\` | ${baseCells} | ${chodeCells} |\n`;
    }
    md += '\n';
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `random-repos-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  console.log('\n── Final Scores ──────────────────────────────────────────────────');
  console.log(`${'Repo'.padEnd(14)} ${'Model'.padEnd(14)} Baseline  CHODE     Δ`);
  console.log('─'.repeat(56));
  for (const r of allResults) {
    const delta = r.chodeTotal - r.baseTotal;
    console.log(`${r.repo.padEnd(14)} ${r.model.padEnd(14)} ${pct(r.baseTotal, r.max).padEnd(10)}${pct(r.chodeTotal, r.max).padEnd(10)}${delta >= 0 ? '+' : ''}${delta}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
