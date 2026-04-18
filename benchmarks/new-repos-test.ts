#!/usr/bin/env node
/**
 * New repos benchmark — actix-web, spring-petclinic, nestjs, ktor
 * Targeted stump questions derived from the generated .chode profiles.
 * Tests 2 models (flash + gpt-4o) against CHODE and baseline (no context).
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/new-repos-test.ts --key sk-or-v1-...
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

type Q = { id: string; text: string; must: string[]; good?: string[]; stump?: boolean };
type Repo = { name: string; chodePath: string; questions: Q[] };

const REPOS: Repo[] = [
  {
    name: 'actix-web',
    chodePath: resolve(__dirname, 'actix-web/.chode'),
    questions: [
      { id: 'Q1', text: 'What programming language is this project written in?',                    must: ['rust'],                stump: false },
      { id: 'Q2', text: 'What CI system is configured?',                                            must: ['github'],              stump: false },
      { id: 'Q3', text: 'What crate handles proc-macro / code generation for this framework?',      must: ['actix-web-codegen'],   stump: true  },
      { id: 'Q4', text: 'What test crate is used for compile-fail tests?',                          must: ['trybuild'],            stump: true  },
    ],
  },
  {
    name: 'spring-petclinic',
    chodePath: resolve(__dirname, 'spring-petclinic/.chode'),
    questions: [
      { id: 'Q1', text: 'What language and framework does this project use?',                       must: ['java', 'spring'],      stump: false },
      { id: 'Q2', text: 'What database is used by default in this project?',                        must: ['h2'],                  stump: true  },
      { id: 'Q3', text: 'What configuration format is used?',                                       must: ['docker-compose'],      stump: true  },
      { id: 'Q4', text: 'How can you inspect the default database at runtime?',                     must: ['h2-console'],          stump: true  },
    ],
  },
  {
    name: 'nestjs',
    chodePath: resolve(__dirname, 'nestjs/.chode'),
    questions: [
      { id: 'Q1', text: 'What language is this project primarily written in?',                      must: ['typescript'],          stump: false },
      { id: 'Q2', text: 'What package manager does this project use?',                             must: ['npm'],                 stump: false },
      { id: 'Q3', text: 'What HTTP platform adapters does NestJS support?',                        must: ['express', 'fastify'],  stump: true  },
      { id: 'Q4', text: 'What design patterns appear in this codebase?',                           must: ['factory'],             stump: true  },
    ],
  },
  {
    name: 'ktor',
    chodePath: resolve(__dirname, 'ktor/.chode'),
    questions: [
      { id: 'Q1', text: 'What language is this project written in?',                                must: ['kotlin'],              stump: false },
      { id: 'Q2', text: 'What authentication methods are supported?',                              must: ['jwt', 'ldap'],         stump: true  },
      { id: 'Q3', text: 'What is the largest internal package by file count?',                     must: ['ktor-server'],         stump: true  },
      { id: 'Q4', text: 'What Kotlin code style standard does this project follow?',               must: ['kotlin_official'],     stump: true  },
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

async function queryWithProfile(modelId: string, apiKey: string, profile: string | null, questions: Q[]): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');

  const prompt = profile
    ? `You are given a CHODE profile — a compressed description of a software repository. Answer the questions below using ONLY information in the profile. If a fact is not present, say "Not in profile."

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

THE PROFILE:
${profile}

QUESTIONS:
${qList}

Answer all questions now.`
    : `Answer the following questions about software projects based on your general knowledge. Be specific.

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

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
        'X-Title': 'CHODE New Repos Test',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const wait = parseInt(res.headers.get('retry-after') ?? '4') * 1000;
      await sleep(wait); lastError = new Error('rate limited'); continue;
    }
    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`HTTP ${res.status}: ${body.slice(0, 100)}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as { choices?: Array<{ message: { content: string } }>; error?: { message: string } };
    if (data.error) throw new Error(data.error.message);

    const content = data.choices?.[0]?.message?.content ?? '';
    await sleep(INTER_REQUEST_DELAY_MS);
    return parseAnswers(content, questions.length);
  }
  throw lastError;
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

  const totalCalls = REPOS.length * MODELS.length * 2; // chode + baseline
  console.log(`\nCHODE New Repos Benchmark`);
  console.log(`  Repos:  ${REPOS.map(r => r.name).join(', ')}`);
  console.log(`  Models: ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Modes:  baseline + chode`);
  console.log(`  Calls:  ${totalCalls}\n`);

  type RepoResult = {
    repo: string;
    model: string;
    baseline: { total: number; max: number; perQ: Record<string, number> };
    chode:    { total: number; max: number; perQ: Record<string, number> };
    chodeProfile: string;
  };
  const allResults: RepoResult[] = [];

  for (const repo of REPOS) {
    const chodeProfile = await readFile(repo.chodePath, 'utf8').catch(() => {
      console.error(`Cannot read: ${repo.chodePath}`); process.exit(1);
    }) as string;

    console.log(`\n══ ${repo.name} (~${Math.ceil(chodeProfile.length / 4)} tok) ══`);

    for (const model of MODELS) {
      process.stdout.write(`  ${model.label.padEnd(14)} baseline… `);
      const baseAnswers = await queryWithProfile(model.id, apiKey, null, repo.questions);

      let baseTotal = 0, baseMax = 0;
      const basePerQ: Record<string, number> = {};
      for (const q of repo.questions) {
        const a = baseAnswers.get(q.id) ?? '';
        const s = score(q, a);
        basePerQ[q.id] = s; baseTotal += s; baseMax += 3;
      }
      process.stdout.write(`${baseTotal}/${baseMax}  chode… `);

      const chodeAnswers = await queryWithProfile(model.id, apiKey, chodeProfile, repo.questions);
      let chodeTotal = 0, chodeMax = 0;
      const chodePerQ: Record<string, number> = {};
      for (const q of repo.questions) {
        const a = chodeAnswers.get(q.id) ?? '';
        const s = score(q, a);
        chodePerQ[q.id] = s; chodeTotal += s; chodeMax += 3;
      }

      const pct = (n: number, d: number) => `${Math.round(n / d * 100)}%`;
      const arrow = chodeTotal >= baseTotal ? '▲' : '▽';
      console.log(`${chodeTotal}/${chodeMax}  ${arrow} ${pct(chodeTotal, chodeMax)} vs ${pct(baseTotal, baseMax)}`);

      allResults.push({ repo: repo.name, model: model.label, baseline: { total: baseTotal, max: baseMax, perQ: basePerQ }, chode: { total: chodeTotal, max: chodeMax, perQ: chodePerQ }, chodeProfile });
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  const pct = (n: number, d: number) => d > 0 ? `${Math.round(n / d * 100)}%` : '—';

  let md = `# CHODE New Repos Benchmark\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repos:** actix-web (Rust), spring-petclinic (Java), nestjs (TypeScript), ktor (Kotlin)  \n`;
  md += `**Models:** ${MODELS.map(m => m.label).join(', ')}  \n`;
  md += `**Modes:** baseline (no context) vs CHODE profile\n\n`;

  md += `## Score Summary\n\n`;
  md += `| Repo | Model | Baseline | CHODE | Δ |\n|---|---|---|---|---|\n`;
  for (const r of allResults) {
    const delta = r.chode.total - r.baseline.total;
    const sign = delta >= 0 ? '+' : '';
    md += `| ${r.repo} | ${r.model} | ${r.baseline.total}/${r.baseline.max} (${pct(r.baseline.total, r.baseline.max)}) | ${r.chode.total}/${r.chode.max} (${pct(r.chode.total, r.chode.max)}) | ${sign}${delta} |\n`;
  }
  md += '\n';

  md += `## Per-Question Breakdown\n\n`;
  for (const repo of REPOS) {
    md += `### ${repo.name}\n\n`;
    const stumpQs = repo.questions.filter(q => q.stump);
    md += `| Q | Topic | Must contain | ${MODELS.map(m => `${m.label} base`).join(' | ')} | ${MODELS.map(m => `${m.label} chode`).join(' | ')} |\n`;
    md += `|---|---|---|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|\n`;
    for (const q of repo.questions) {
      const musts = q.must.join(', ');
      const baseCells = MODELS.map(m => {
        const r = allResults.find(r => r.repo === repo.name && r.model === m.label);
        const s = r?.baseline.perQ[q.id] ?? '—';
        return `${s}${q.stump ? ' ★' : ''}`;
      }).join(' | ');
      const chodeCells = MODELS.map(m => {
        const r = allResults.find(r => r.repo === repo.name && r.model === m.label);
        return String(r?.chode.perQ[q.id] ?? '—');
      }).join(' | ');
      md += `| ${q.id} | | \`${musts}\` | ${baseCells} | ${chodeCells} |\n`;
    }
    md += `\n★ = stump question\n\n`;

    md += `**CHODE profile:**\n\`\`\`\n`;
    const r0 = allResults.find(r => r.repo === repo.name);
    md += r0?.chodeProfile ?? '';
    md += `\n\`\`\`\n\n`;
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `new-repos-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  // Console summary
  console.log('\n── Final Scores ──────────────────────────────────────────────────');
  console.log(`${'Repo'.padEnd(18)} ${'Model'.padEnd(14)} Baseline  CHODE     Δ`);
  console.log('─'.repeat(58));
  for (const r of allResults) {
    const delta = r.chode.total - r.baseline.total;
    console.log(
      `${r.repo.padEnd(18)} ${r.model.padEnd(14)} ` +
      `${pct(r.baseline.total, r.baseline.max).padEnd(10)}` +
      `${pct(r.chode.total, r.chode.max).padEnd(10)}` +
      `${delta >= 0 ? '+' : ''}${delta}`
    );
  }
}

main().catch(e => { console.error(e); process.exit(1); });
