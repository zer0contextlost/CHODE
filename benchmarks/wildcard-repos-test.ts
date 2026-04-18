#!/usr/bin/env node
/**
 * Wild Card Repos Benchmark — Ladybird, Zulip, PixiJS, Appwrite, Moondream
 * Two-tier questions per repo:
 *   tier1 — answerable from the CHODE profile
 *   tier2 — "gap" questions: tests what CHODE misses (model training knowledge only)
 *
 * Gap questions expose where CHODE suppresses correct baseline answers
 * ("Not in profile" overcorrection) vs. cases where baseline guesses wrong.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/wildcard-repos-test.ts --key sk-or-v1-...
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
  tier: 1 | 2;     // 1 = in profile, 2 = gap (not in profile)
  note?: string;   // explanation of what's being tested
};
type Repo = { name: string; chodePath: string; questions: Q[] };

const REPOS: Repo[] = [
  {
    name: 'ladybird',
    chodePath: resolve(__dirname, 'ladybird/.chode'),
    questions: [
      {
        id: 'Q1', tier: 1,
        text: 'What programming languages is this project written in?',
        must: ['rust', 'cpp'],
        note: 'in @STACK',
      },
      {
        id: 'Q2', tier: 1,
        text: 'What package managers does this project use?',
        must: ['cargo', 'pip'],
        note: 'in @PKG',
      },
      {
        id: 'Q3', tier: 1,
        text: 'What extra git config step is needed to see PR links in git log?',
        must: ['notes', 'fetch'],
        note: 'in @GOTCHAS — tests whether model reads GOTCHAS section',
      },
      {
        id: 'Q4', tier: 2,
        text: 'What JavaScript engine does Ladybird use internally?',
        must: ['libjs'],
        good: ['serenityos'],
        note: 'GAP — not in profile; tests model prior knowledge vs. "Not in profile" overcorrection',
      },
    ],
  },
  {
    name: 'zulip',
    chodePath: resolve(__dirname, 'zulip/.chode'),
    questions: [
      {
        id: 'Q1', tier: 1,
        text: 'What authentication methods does this project support?',
        must: ['ldap', 'saml'],
        note: 'in @AUTH',
      },
      {
        id: 'Q2', tier: 1,
        text: 'What frontend framework is used for the web client?',
        must: ['preact'],
        note: 'in @FRONTEND',
      },
      {
        id: 'Q3', tier: 1,
        text: 'What test coverage percentage does this project aim for?',
        must: ['98'],
        note: 'in @TESTING section of CONTEXT',
      },
      {
        id: 'Q4', tier: 2,
        text: 'What unique Django model field type does Zulip define for message topics?',
        must: ['huddle', 'topic'],
        note: 'GAP — unique internal type not captured in profile; tests model hallucination risk',
      },
    ],
  },
  {
    name: 'pixijs',
    chodePath: resolve(__dirname, 'pixijs/.chode'),
    questions: [
      {
        id: 'Q1', tier: 1,
        text: 'What design patterns are used in this project?',
        must: ['plugin', 'event-driven'],
        note: 'in @PATTERNS',
      },
      {
        id: 'Q2', tier: 1,
        text: 'What test framework is used?',
        must: ['jest'],
        note: 'in @TEST',
      },
      {
        id: 'Q3', tier: 1,
        text: 'What playground files are gitignored?',
        must: ['playground'],
        note: 'in @GOTCHAS — tests whether model extracts gitignore detail from GOTCHAS',
      },
      {
        id: 'Q4', tier: 2,
        text: 'What GPU rendering APIs does PixiJS support?',
        must: ['webgl', 'webgpu'],
        note: 'GAP — renderer details not in profile; model training knowledge required',
      },
    ],
  },
  {
    name: 'appwrite',
    chodePath: resolve(__dirname, 'appwrite/.chode'),
    questions: [
      {
        id: 'Q1', tier: 1,
        text: 'What authentication methods does this project support?',
        must: ['oauth', '2fa'],
        note: 'in @AUTH',
      },
      {
        id: 'Q2', tier: 1,
        text: 'What coding standard is enforced for formatting?',
        must: ['psr-12'],
        note: 'in @CONVENTIONS',
      },
      {
        id: 'Q3', tier: 1,
        text: 'What frontend framework is used for the web interface?',
        must: ['astro'],
        note: 'in @FRONTEND',
      },
      {
        id: 'Q4', tier: 2,
        text: 'What specific message queue backend does Appwrite use (MariaDB or Redis)?',
        must: ['redis'],
        note: 'GAP — @STACK shows "queue" but not which backend; tests CHODE precision limit',
      },
    ],
  },
  {
    name: 'moondream',
    chodePath: resolve(__dirname, 'moondream/.chode'),
    questions: [
      {
        id: 'Q1', tier: 1,
        text: 'What CI system is used?',
        must: ['github'],
        note: 'in @CI — one of the only facts in the sparse profile',
      },
      {
        id: 'Q2', tier: 2,
        text: 'What programming language is this project primarily written in?',
        must: ['python'],
        note: 'GAP — no @STACK in profile; language absent; tests whether model says "Not in profile" or answers from training',
      },
      {
        id: 'Q3', tier: 2,
        text: 'How many parameters does the primary model variant have?',
        must: ['2b', '2 billion'],
        good: ['1.86'],
        note: 'GAP — parameter counts not in profile; tests hallucination vs. correct prior',
      },
      {
        id: 'Q4', tier: 2,
        text: 'What type of AI model is this (what modalities does it handle)?',
        must: ['vision', 'image'],
        good: ['vlm', 'multimodal'],
        note: 'Partial — purpose mentions "vision language model" in @PURPOSE text; tests deep-context retrieval',
      },
    ],
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────────

function score(q: Q, answer: string): number {
  const a = answer.toLowerCase();
  const notFound = ['not in profile', 'not mentioned', 'not specified', 'cannot be determined', 'no information', 'not provided'];
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

async function queryModel(
  modelId: string,
  apiKey: string,
  profile: string | null,
  questions: Q[],
): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');
  const prompt = profile
    ? `You are given a CHODE profile — a compressed description of a software repository. Answer the questions below using ONLY information in the profile. If a fact is not present, say "Not in profile."

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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Wildcard Repos',
      },
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

  console.log(`\nCHODE Wildcard Repos Benchmark`);
  console.log(`  Repos:  ${REPOS.map(r => r.name).join(', ')}`);
  console.log(`  Models: ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Calls:  ${REPOS.length * MODELS.length * 2}\n`);

  type Result = {
    repo: string; model: string;
    base: Record<string, { score: number; answer: string }>;
    chode: Record<string, { score: number; answer: string }>;
    baseTotal: number; chodeTotal: number; max: number;
  };
  const allResults: Result[] = [];

  for (const repo of REPOS) {
    const profile = await readFile(repo.chodePath, 'utf8').catch(() => {
      console.error(`Missing: ${repo.chodePath}`); process.exit(1);
    }) as string;
    const tok = Math.ceil(profile.length / 4);
    console.log(`\n══ ${repo.name} (~${tok} tok) ══`);

    for (const model of MODELS) {
      process.stdout.write(`  ${model.label.padEnd(14)} base… `);
      const baseAnswers = await queryModel(model.id, apiKey, null, repo.questions);
      const base: Record<string, { score: number; answer: string }> = {};
      let baseTotal = 0;
      for (const q of repo.questions) {
        const a = baseAnswers.get(q.id) ?? '';
        const s = score(q, a);
        base[q.id] = { score: s, answer: a };
        baseTotal += s;
      }

      process.stdout.write(`${baseTotal}/${repo.questions.length * 3}  chode… `);
      const chodeAnswers = await queryModel(model.id, apiKey, profile, repo.questions);
      const chode: Record<string, { score: number; answer: string }> = {};
      let chodeTotal = 0;
      for (const q of repo.questions) {
        const a = chodeAnswers.get(q.id) ?? '';
        const s = score(q, a);
        chode[q.id] = { score: s, answer: a };
        chodeTotal += s;
      }

      const pct = (n: number) => `${Math.round(n / (repo.questions.length * 3) * 100)}%`;
      const delta = chodeTotal - baseTotal;
      console.log(`${chodeTotal}/${repo.questions.length * 3}  ${delta >= 0 ? '▲' : '▽'} ${pct(chodeTotal)} vs ${pct(baseTotal)}`);
      allResults.push({ repo: repo.name, model: model.label, base, chode, baseTotal, chodeTotal, max: repo.questions.length * 3 });
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  const pct = (n: number, d: number) => `${Math.round(n / d * 100)}%`;

  let md = `# CHODE Wildcard Repos Benchmark\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repos:** Ladybird (browser), Zulip (chat), PixiJS (graphics), Appwrite (backend platform), Moondream (VLM)  \n`;
  md += `**Models:** ${MODELS.map(m => m.label).join(', ')}  \n`;
  md += `**Design:** Tier-1 questions answerable from profile; Tier-2 "gap" questions expose CHODE blind spots\n\n`;

  md += `## Score Summary\n\n`;
  md += `| Repo | Model | Baseline | CHODE | Δ |\n|---|---|---|---|---|\n`;
  for (const r of allResults) {
    const delta = r.chodeTotal - r.baseTotal;
    md += `| ${r.repo} | ${r.model} | ${r.baseTotal}/${r.max} (${pct(r.baseTotal, r.max)}) | ${r.chodeTotal}/${r.max} (${pct(r.chodeTotal, r.max)}) | ${delta >= 0 ? '+' : ''}${delta} |\n`;
  }
  md += '\n';

  // Tier breakdown
  for (const tier of [1, 2] as const) {
    const label = tier === 1 ? 'Tier 1 — Profile-answerable' : 'Tier 2 — Gap (not in profile)';
    const tierQs = REPOS.flatMap(r => r.questions.filter(q => q.tier === tier));
    if (tierQs.length === 0) continue;

    let t1Base = 0, t1Chode = 0, t1Max = 0;
    for (const repo of REPOS) {
      for (const q of repo.questions.filter(x => x.tier === tier)) {
        for (const r of allResults.filter(r => r.repo === repo.name)) {
          t1Base  += r.base[q.id]?.score  ?? 0;
          t1Chode += r.chode[q.id]?.score ?? 0;
          t1Max   += 3;
        }
      }
    }
    md += `### ${label}\n`;
    md += `Aggregate across all repos × models: Baseline **${pct(t1Base, t1Max)}** → CHODE **${pct(t1Chode, t1Max)}** (Δ ${t1Chode - t1Base >= 0 ? '+' : ''}${t1Chode - t1Base}/${t1Max})\n\n`;
  }

  md += `## Per-Question Detail\n\n`;
  for (const repo of REPOS) {
    md += `### ${repo.name}\n\n`;
    md += `| Q | Tier | Must contain | ${MODELS.map(m => `${m.label} base`).join(' | ')} | ${MODELS.map(m => `${m.label} chode`).join(' | ')} | Note |\n`;
    md += `|---|---|---|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|---|\n`;
    for (const q of repo.questions) {
      const baseCells  = MODELS.map(m => String(allResults.find(r => r.repo === repo.name && r.model === m.label)?.base[q.id]?.score  ?? '—')).join(' | ');
      const chodeCells = MODELS.map(m => String(allResults.find(r => r.repo === repo.name && r.model === m.label)?.chode[q.id]?.score ?? '—')).join(' | ');
      md += `| ${q.id} | T${q.tier} | \`${q.must.join(', ')}\` | ${baseCells} | ${chodeCells} | ${q.note ?? ''} |\n`;
    }
    md += '\n';

    // Show sample answers for gap questions
    const gapQs = repo.questions.filter(q => q.tier === 2);
    if (gapQs.length > 0) {
      md += `**Gap question answers (${repo.name}):**\n\n`;
      for (const q of gapQs) {
        md += `*${q.id}: ${q.text}*\n`;
        for (const model of MODELS) {
          const r = allResults.find(x => x.repo === repo.name && x.model === model.label);
          const base  = r?.base[q.id]?.answer  ?? '—';
          const chode = r?.chode[q.id]?.answer ?? '—';
          md += `- **${model.label}** base: ${base.slice(0, 120)}\n`;
          md += `- **${model.label}** chode: ${chode.slice(0, 120)}\n`;
        }
        md += '\n';
      }
    }
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `wildcard-repos-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  console.log('\n── Final Scores ──────────────────────────────────────────────────');
  console.log(`${'Repo'.padEnd(12)} ${'Model'.padEnd(14)} Baseline  CHODE     Δ`);
  console.log('─'.repeat(54));
  for (const r of allResults) {
    const delta = r.chodeTotal - r.baseTotal;
    console.log(`${r.repo.padEnd(12)} ${r.model.padEnd(14)} ${pct(r.baseTotal, r.max).padEnd(10)}${pct(r.chodeTotal, r.max).padEnd(10)}${delta >= 0 ? '+' : ''}${delta}`);
  }

  // Tier summary
  console.log('\n── By Tier ───────────────────────────────────────────────────────');
  for (const tier of [1, 2] as const) {
    let tBase = 0, tChode = 0, tMax = 0;
    for (const repo of REPOS) {
      for (const q of repo.questions.filter(x => x.tier === tier)) {
        for (const r of allResults.filter(r => r.repo === repo.name)) {
          tBase  += r.base[q.id]?.score  ?? 0;
          tChode += r.chode[q.id]?.score ?? 0;
          tMax   += 3;
        }
      }
    }
    const label = tier === 1 ? 'Tier 1 (in profile)' : 'Tier 2 (gap)      ';
    console.log(`${label}  Baseline ${pct(tBase, tMax).padEnd(6)}  CHODE ${pct(tChode, tMax).padEnd(6)}  Δ ${tChode - tBase >= 0 ? '+' : ''}${tChode - tBase}/${tMax}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
