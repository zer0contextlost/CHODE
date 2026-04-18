#!/usr/bin/env node
/**
 * Aider Repo-Map vs CHODE vs Baseline — three-way comparison
 *
 * Same repos, same questions, three context conditions:
 *   baseline  — no context (model training knowledge only)
 *   aider     — aider repo-map (~1000 tok, code structure: types/signatures)
 *   chode     — CHODE profile (~400–600 tok, stack/docs/conventions)
 *
 * Uses the same stump questions from random-repos-test.ts.
 * Design intent: aider's map is optimized for code navigation;
 * CHODE is optimized for project orientation. This test reveals
 * which approach answers "what is this repo?" questions better.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/aider-comparison-test.ts --key sk-or-v1-...
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
type Repo = { name: string; lang: string; chodePath: string; aiderPath: string; questions: Q[] };

const REPOS: Repo[] = [
  {
    name: 'caddy',
    lang: 'Go',
    chodePath:  resolve(__dirname, 'profiles/caddy.chode'),
    aiderPath:  resolve(__dirname, 'profiles/caddy.aidermap'),
    questions: [
      { id: 'Q1', stump: false, text: 'What language is this project written in?',         must: ['go'],          good: ['golang'] },
      { id: 'Q2', stump: false, text: 'What monitoring system does it integrate with?',    must: ['prometheus'],  good: [] },
      { id: 'Q3', stump: true,  text: 'What Go HTTP router library does this project use?', must: ['chi'],         good: [] },
      { id: 'Q4', stump: true,  text: 'What structured logging library is used?',          must: ['zap'],         good: [] },
    ],
  },
  {
    name: 'pocketbase',
    lang: 'Go',
    chodePath:  resolve(__dirname, 'profiles/pocketbase.chode'),
    aiderPath:  resolve(__dirname, 'profiles/pocketbase.aidermap'),
    questions: [
      { id: 'Q1', stump: false, text: 'What programming language is this project written in?', must: ['go'],        good: ['golang'] },
      { id: 'Q2', stump: false, text: 'What authentication method does this project support?',  must: ['oauth'],     good: [] },
      { id: 'Q3', stump: true,  text: 'How many database migrations does this project have?',   must: ['7'],         good: [] },
      { id: 'Q4', stump: true,  text: 'What design pattern is used for extensibility?',         must: ['plugin'],    good: [] },
    ],
  },
  {
    name: 'ruff',
    lang: 'Rust',
    chodePath:  resolve(__dirname, 'profiles/ruff.chode'),
    aiderPath:  resolve(__dirname, 'profiles/ruff.aidermap'),
    questions: [
      { id: 'Q1', stump: false, text: 'What languages is this project written in?',             must: ['rust', 'python'], good: [] },
      { id: 'Q2', stump: false, text: 'What package managers are used?',                        must: ['cargo', 'pip'],   good: [] },
      { id: 'Q3', stump: true,  text: 'What configuration file format does this project use?',  must: ['toml'],           good: [] },
      { id: 'Q4', stump: true,  text: 'What workaround is documented for stack overflows in the playground?', must: ['release'], good: ['wasm'] },
    ],
  },
  {
    name: 'zulip',
    lang: 'Python',
    chodePath:  resolve(__dirname, 'profiles/zulip.chode'),
    aiderPath:  resolve(__dirname, 'profiles/zulip.aidermap'),
    questions: [
      { id: 'Q1', stump: false, text: 'What is the primary backend language?',                 must: ['python'],         good: [] },
      { id: 'Q2', stump: false, text: 'What authentication methods are supported?',             must: ['ldap', 'saml'],   good: [] },
      { id: 'Q3', stump: true,  text: 'What frontend framework does the web client use?',       must: ['preact'],         good: [] },
      { id: 'Q4', stump: true,  text: 'What test coverage percentage does this project target?', must: ['98'],            good: [] },
    ],
  },
  {
    name: 'pixijs',
    lang: 'TypeScript',
    chodePath:  resolve(__dirname, 'profiles/pixijs.chode'),
    aiderPath:  resolve(__dirname, 'profiles/pixijs.aidermap'),
    questions: [
      { id: 'Q1', stump: false, text: 'What is the primary language of this project?',         must: ['typescript'],     good: ['ts'] },
      { id: 'Q2', stump: false, text: 'What test framework is used?',                          must: ['jest'],           good: [] },
      { id: 'Q3', stump: true,  text: 'What design patterns are present in this codebase?',    must: ['plugin', 'event-driven'], good: [] },
      { id: 'Q4', stump: true,  text: 'What playground files are gitignored?',                 must: ['playground'],     good: [] },
    ],
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────────

function score(q: Q, answer: string): number {
  const a = answer.toLowerCase();
  const notFound = ['not in profile', 'not mentioned', 'not specified', 'cannot be determined', 'no information', 'not provided', 'not in the'];
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

async function query(
  modelId: string, apiKey: string,
  context: string | null, contextLabel: string,
  questions: Q[],
): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');

  const prompt = context
    ? `You are given a ${contextLabel} — a description of a software repository. Answer the questions below using ONLY information in the provided context. If a fact is not present, say "Not in context."

Format: label on its own line, answer on the next line.

THE CONTEXT:
${context}

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
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'HTTP-Referer': 'https://github.com/chode', 'X-Title': 'CHODE vs Aider' },
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

  const totalCalls = REPOS.length * MODELS.length * 3; // baseline + aider + chode
  console.log(`\nCHODE vs Aider Repo-Map — Three-Way Comparison`);
  console.log(`  Repos:  ${REPOS.map(r => r.name).join(', ')}`);
  console.log(`  Models: ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Modes:  baseline | aider-map | chode`);
  console.log(`  Calls:  ${totalCalls}\n`);

  type Run = { repo: string; model: string; mode: 'baseline'|'aider'|'chode'; scores: Record<string, number>; total: number; max: number; tok: number };
  const runs: Run[] = [];

  for (const repo of REPOS) {
    const [chodeProfile, aiderMap] = await Promise.all([
      readFile(repo.chodePath, 'utf8').catch(() => { console.error(`Missing CHODE: ${repo.chodePath}`); process.exit(1); }),
      readFile(repo.aiderPath, 'utf8').catch(() => { console.error(`Missing aider map: ${repo.aiderPath}`); process.exit(1); }),
    ]) as [string, string];

    const chodeTok = Math.ceil(chodeProfile.length / 4);
    const aiderTok = Math.ceil(aiderMap.length / 4);
    console.log(`\n══ ${repo.name} (${repo.lang}) ══`);
    console.log(`   CHODE: ~${chodeTok} tok  |  Aider map: ~${aiderTok} tok`);

    for (const model of MODELS) {
      process.stdout.write(`  ${model.label.padEnd(14)} base… `);
      const baseAnswers = await query(model.id, apiKey, null, '', repo.questions);
      let baseTotal = 0; const baseScores: Record<string, number> = {};
      for (const q of repo.questions) { const s = score(q, baseAnswers.get(q.id) ?? ''); baseScores[q.id] = s; baseTotal += s; }
      process.stdout.write(`${baseTotal}/${repo.questions.length * 3}  aider… `);

      const aiderAnswers = await query(model.id, apiKey, aiderMap, 'aider repo-map (code structure)', repo.questions);
      let aiderTotal = 0; const aiderScores: Record<string, number> = {};
      for (const q of repo.questions) { const s = score(q, aiderAnswers.get(q.id) ?? ''); aiderScores[q.id] = s; aiderTotal += s; }
      process.stdout.write(`${aiderTotal}/${repo.questions.length * 3}  chode… `);

      const chodeAnswers = await query(model.id, apiKey, chodeProfile, 'CHODE profile', repo.questions);
      let chodeTotal = 0; const chodeScores: Record<string, number> = {};
      for (const q of repo.questions) { const s = score(q, chodeAnswers.get(q.id) ?? ''); chodeScores[q.id] = s; chodeTotal += s; }

      const max = repo.questions.length * 3;
      const pct = (n: number) => `${Math.round(n / max * 100)}%`;
      console.log(`${chodeTotal}/${max}  [${pct(baseTotal)} → ${pct(aiderTotal)} → ${pct(chodeTotal)}]`);

      runs.push({ repo: repo.name, model: model.label, mode: 'baseline', scores: baseScores,  total: baseTotal,  max, tok: 0 });
      runs.push({ repo: repo.name, model: model.label, mode: 'aider',    scores: aiderScores, total: aiderTotal, max, tok: aiderTok });
      runs.push({ repo: repo.name, model: model.label, mode: 'chode',    scores: chodeScores, total: chodeTotal, max, tok: chodeTok });
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  const pct = (n: number, d: number) => `${Math.round(n / d * 100)}%`;

  let md = `# CHODE vs Aider Repo-Map — Three-Way Comparison\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repos:** ${REPOS.map(r => `${r.name} (${r.lang})`).join(', ')}  \n`;
  md += `**Models:** ${MODELS.map(m => m.label).join(', ')}  \n`;
  md += `**Modes:** baseline (no context) | aider repo-map (~1000 tok) | CHODE profile (~400–600 tok)\n\n`;

  md += `## Aggregate Scores\n\n`;
  for (const mode of ['baseline', 'aider', 'chode'] as const) {
    const modeRuns = runs.filter(r => r.mode === mode);
    const total = modeRuns.reduce((s, r) => s + r.total, 0);
    const max   = modeRuns.reduce((s, r) => s + r.max, 0);
    const avgTok = mode === 'baseline' ? 0 : Math.round(modeRuns.reduce((s, r) => s + r.tok, 0) / modeRuns.length);
    md += `- **${mode}** (${avgTok > 0 ? `~${avgTok} tok avg` : 'no context'}): ${total}/${max} = **${pct(total, max)}**\n`;
  }
  md += '\n';

  md += `## Score Summary\n\n`;
  md += `| Repo | Lang | Model | Baseline | Aider (~1k tok) | CHODE (~500 tok) | CHODE wins? |\n`;
  md += `|---|---|---|---|---|---|---|\n`;
  for (const repo of REPOS) {
    for (const model of MODELS) {
      const base  = runs.find(r => r.repo === repo.name && r.model === model.label && r.mode === 'baseline')!;
      const aider = runs.find(r => r.repo === repo.name && r.model === model.label && r.mode === 'aider')!;
      const chode = runs.find(r => r.repo === repo.name && r.model === model.label && r.mode === 'chode')!;
      const winner = chode.total > aider.total ? '✓ CHODE' : chode.total === aider.total ? 'tie' : '✗ Aider';
      md += `| ${repo.name} | ${repo.lang} | ${model.label} | ${base.total}/${base.max} (${pct(base.total, base.max)}) | ${aider.total}/${aider.max} (${pct(aider.total, aider.max)}) | ${chode.total}/${chode.max} (${pct(chode.total, chode.max)}) | ${winner} |\n`;
    }
  }
  md += '\n';

  md += `## Per-Question Breakdown\n\n`;
  for (const repo of REPOS) {
    md += `### ${repo.name} (${repo.lang})\n\n`;
    md += `| Q | Stump | Must | ${MODELS.map(m => `${m.label} base`).join(' | ')} | ${MODELS.map(m => `${m.label} aider`).join(' | ')} | ${MODELS.map(m => `${m.label} chode`).join(' | ')} |\n`;
    md += `|---|---|---|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|\n`;
    for (const q of repo.questions) {
      const baseCells  = MODELS.map(m => String(runs.find(r => r.repo === repo.name && r.model === m.label && r.mode === 'baseline')?.scores[q.id] ?? '—')).join(' | ');
      const aiderCells = MODELS.map(m => String(runs.find(r => r.repo === repo.name && r.model === m.label && r.mode === 'aider')?.scores[q.id]    ?? '—')).join(' | ');
      const chodeCells = MODELS.map(m => String(runs.find(r => r.repo === repo.name && r.model === m.label && r.mode === 'chode')?.scores[q.id]    ?? '—')).join(' | ');
      md += `| ${q.id} | ${q.stump ? '★' : ''} | \`${q.must.join(', ')}\` | ${baseCells} | ${aiderCells} | ${chodeCells} |\n`;
    }
    md += '\n';
  }

  md += `## Key Finding\n\n`;
  const aiderTotal = runs.filter(r => r.mode === 'aider').reduce((s, r) => s + r.total, 0);
  const chodeTotal = runs.filter(r => r.mode === 'chode').reduce((s, r) => s + r.total, 0);
  const maxTotal   = runs.filter(r => r.mode === 'chode').reduce((s, r) => s + r.max, 0);
  md += `Aider repo-map: **${pct(aiderTotal, maxTotal)}** at ~1000 tok  \n`;
  md += `CHODE profile:  **${pct(chodeTotal, maxTotal)}** at ~500 tok  \n\n`;
  md += `Aider's map is designed for code navigation (finding symbols and structure). `;
  md += `CHODE is designed for project orientation (stack, conventions, gotchas). `;
  md += `These question sets test the orientation use case — the domain where CHODE was built to win.\n`;

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `aider-comparison-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  console.log('\n── Three-Way Summary ─────────────────────────────────────────────');
  console.log(`${'Repo'.padEnd(12)} ${'Model'.padEnd(14)} Baseline  Aider     CHODE`);
  console.log('─'.repeat(56));
  for (const repo of REPOS) {
    for (const model of MODELS) {
      const base  = runs.find(r => r.repo === repo.name && r.model === model.label && r.mode === 'baseline')!;
      const aider = runs.find(r => r.repo === repo.name && r.model === model.label && r.mode === 'aider')!;
      const chode = runs.find(r => r.repo === repo.name && r.model === model.label && r.mode === 'chode')!;
      console.log(`${repo.name.padEnd(12)} ${model.label.padEnd(14)} ${pct(base.total, base.max).padEnd(10)}${pct(aider.total, aider.max).padEnd(10)}${pct(chode.total, chode.max)}`);
    }
  }

  console.log('\n── Aggregate ─────────────────────────────────────────────────────');
  for (const mode of ['baseline', 'aider', 'chode'] as const) {
    const modeRuns = runs.filter(r => r.mode === mode);
    const tot = modeRuns.reduce((s, r) => s + r.total, 0);
    const max = modeRuns.reduce((s, r) => s + r.max, 0);
    console.log(`  ${mode.padEnd(10)}: ${pct(tot, max)}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
