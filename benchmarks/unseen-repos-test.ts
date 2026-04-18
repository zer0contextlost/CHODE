#!/usr/bin/env node
/**
 * Unseen repos benchmark — ruff, zulip, appwrite, pocketbase, caddy
 * These repos were NOT in the original 9-repo benchmark set.
 * Stump questions are derived exclusively from facts in the .chode profiles.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/unseen-repos-test.ts --key sk-or-v1-...
 *
 * Output: benchmarks/results/unseen-repos-test-[timestamp].md
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTER_REQUEST_DELAY_MS = 1500;
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODELS = [
  { label: 'gpt-4o',        id: 'openai/gpt-4o'           },
  { label: 'gemini-flash',  id: 'google/gemini-2.5-flash'  },
];

type Q = {
  id: string;
  text: string;
  must: string[];   // ALL must appear for full credit
  good?: string[];  // bonus terms (lift score to 3)
  stump?: boolean;  // flagged as hard / likely to fool baseline
};

type Repo = {
  name: string;
  profilePath: string;
  questions: Q[];
};

// ── Questions ─────────────────────────────────────────────────────────────────
// Written from facts explicitly present in each .chode profile.
// "Stump" = a model relying on world knowledge alone is likely to guess wrong.

const REPOS: Repo[] = [
  // ── ruff ─────────────────────────────────────────────────────────────────
  // Profile facts: rust+python, cargo+pip, toml config, crates/(4705) files,
  // 10-100x faster, WASM stack overflow gotcha (build in release mode), npm ci playground
  {
    name: 'ruff',
    profilePath: resolve(__dirname, 'profiles/ruff.chode'),
    questions: [
      {
        id: 'Q1',
        text: 'What two programming languages is this project primarily written in?',
        must: ['rust', 'python'],
        stump: false,
      },
      {
        id: 'Q2',
        text: 'What configuration file format does this project use?',
        must: ['toml'],
        stump: false,
      },
      {
        id: 'Q3',
        text: 'How much faster is this linter claimed to be compared to existing linters?',
        must: ['10', '100'],
        stump: true,
      },
      {
        id: 'Q4',
        text: 'If you see stack overflows in the playground, what build mode should you use for the WASM module?',
        must: ['release'],
        stump: true,
      },
    ],
  },

  // ── zulip ─────────────────────────────────────────────────────────────────
  // Profile facts: python, preact+astro frontend, pnpm+uv, puppeteer tests,
  // ldap+saml auth, ~98% test coverage, routes in zilencer/urls.py,
  // data model in zilencer/models.py, toml config
  {
    name: 'zulip',
    profilePath: resolve(__dirname, 'profiles/zulip.chode'),
    questions: [
      {
        id: 'Q1',
        text: 'What two authentication protocols does this project support beyond standard password login?',
        must: ['ldap', 'saml'],
        stump: true,
      },
      {
        id: 'Q2',
        text: 'What frontend JavaScript framework/library is used in the web client (not the meta-framework)?',
        must: ['preact'],
        stump: true,
      },
      {
        id: 'Q3',
        text: 'What is the approximate test coverage percentage the server team maintains?',
        must: ['98'],
        stump: true,
      },
      {
        id: 'Q4',
        text: 'What two package managers does this project use (one for Python, one for JS)?',
        must: ['pnpm', 'uv'],
        stump: true,
      },
    ],
  },

  // ── appwrite ──────────────────────────────────────────────────────────────
  // Profile facts: php+ts, phpunit, psr-12/psr-4, resourceType values are plural,
  // docker compose exec appwrite test, 2fa+oauth, npm+composer, astro frontend
  {
    name: 'appwrite',
    profilePath: resolve(__dirname, 'profiles/appwrite.chode'),
    questions: [
      {
        id: 'Q1',
        text: 'What code style standard is enforced for formatting in this project?',
        must: ['psr-12'],
        good: ['pint'],
        stump: true,
      },
      {
        id: 'Q2',
        text: 'What convention must `resourceType` values follow in this codebase (singular or plural)?',
        must: ['plural'],
        stump: true,
      },
      {
        id: 'Q3',
        text: 'What command do you run to execute the full test suite?',
        must: ['docker', 'appwrite', 'test'],
        stump: true,
      },
      {
        id: 'Q4',
        text: 'What two authentication methods does this project support?',
        must: ['2fa', 'oauth'],
        stump: false,
      },
    ],
  },

  // ── pocketbase ────────────────────────────────────────────────────────────
  // Profile facts: go, jwt+oauth, cobra, 7 migrations, plugin pattern,
  // `./pocketbase serve`, ui/src/main.js entry, make test / make test-report
  {
    name: 'pocketbase',
    profilePath: resolve(__dirname, 'profiles/pocketbase.chode'),
    questions: [
      {
        id: 'Q1',
        text: 'What two authentication/security libraries does this project use?',
        must: ['jwt', 'oauth2'],
        stump: true,
      },
      {
        id: 'Q2',
        text: 'How many database migrations are included in this project?',
        must: ['7'],
        stump: true,
      },
      {
        id: 'Q3',
        text: 'What command do you run to start the server after downloading the prebuilt executable?',
        must: ['pocketbase', 'serve'],
        stump: true,
      },
      {
        id: 'Q4',
        text: 'What make targets are used to run tests?',
        must: ['make test'],
        good: ['test-report'],
        stump: true,
      },
    ],
  },

  // ── caddy ─────────────────────────────────────────────────────────────────
  // Profile facts: go, chi+cobra+testify+otel+zap, prometheus API,
  // modules/{caddyhttp,caddytls,caddypki,...}, entry cmd/caddy/main.go,
  // gomod, github-actions CI
  {
    name: 'caddy',
    profilePath: resolve(__dirname, 'profiles/caddy.chode'),
    questions: [
      {
        id: 'Q1',
        text: 'What observability/metrics API does this project expose?',
        must: ['prometheus'],
        stump: true,
      },
      {
        id: 'Q2',
        text: 'What is the entry point file for this project?',
        must: ['cmd/caddy/main.go'],
        stump: true,
      },
      {
        id: 'Q3',
        text: 'Name three internal Go packages (libraries) this project depends on.',
        must: ['chi', 'cobra', 'zap'],
        good: ['testify', 'otel'],
        stump: true,
      },
      {
        id: 'Q4',
        text: 'What Go package manager / module system does this project use?',
        must: ['gomod'],
        stump: false,
      },
    ],
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────────
// 0 = no must terms found (or model said "not in profile")
// 1 = some but not all must terms found
// 2 = all must terms found, no good terms (or good list is empty)
// 3 = all must + at least one good term (or good list is empty → same as 2→3)

function score(q: Q, answer: string): number {
  const a = answer.toLowerCase();
  const notFound = [
    'not in profile', 'not mentioned', 'not specified',
    'cannot be determined', 'no information', 'not provided',
  ];
  if (notFound.some(p => a.includes(p))) return 0;

  const hasAll  = q.must.every(t => a.includes(t.toLowerCase()));
  const hasAny  = q.must.some(t  => a.includes(t.toLowerCase()));
  const goodHit = (q.good ?? []).some(t => a.includes(t.toLowerCase()));

  if (!hasAny)  return 0;
  if (!hasAll)  return 1;
  if ((q.good ?? []).length > 0 && !goodHit) return 2;
  return 3;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function callModel(
  modelId: string,
  apiKey: string,
  profile: string | null,
  questions: Q[],
): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');

  const prompt = profile
    ? `You are given a CHODE profile — a compressed description of a software repository. Answer the questions below using ONLY information present in the profile. If a fact is not present, say "Not in profile."

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

THE PROFILE:
${profile}

QUESTIONS:
${qList}

Answer all questions now.`
    : `Answer the following questions about software projects based on your general knowledge. Be specific and concise.

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

QUESTIONS:
${qList}

Answer all questions now.`;

  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(Math.pow(2, attempt - 1) * 1500);
      process.stdout.write(`[retry ${attempt}] `);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Unseen Repos Test',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get('retry-after') ?? '5') * 1000;
      process.stdout.write(`[rate-limited, waiting ${retryAfter / 1000}s] `);
      await sleep(retryAfter);
      lastError = new Error('rate limited');
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`);
      if (res.status >= 500) { continue; }
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
    };
    if (data.error) throw new Error(data.error.message);

    const content = data.choices?.[0]?.message?.content ?? '';
    await sleep(INTER_REQUEST_DELAY_MS);
    return parseAnswers(content, questions.length);
  }

  throw lastError;
}

function parseAnswers(raw: string, n: number): Map<string, string> {
  const answers = new Map<string, string>();
  // Split on lines that start a new Qn label
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
  const get  = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };

  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Error: --key <openrouter-key> or OPENROUTER_API_KEY env var required');
    process.exit(1);
  }

  const totalCalls = REPOS.length * MODELS.length * 2; // baseline + chode per repo per model
  console.log('\nCHODE Unseen Repos Benchmark');
  console.log(`  Repos  : ${REPOS.map(r => r.name).join(', ')}`);
  console.log(`  Models : ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Modes  : baseline (no context) + chode (with profile)`);
  console.log(`  Calls  : ${totalCalls}\n`);

  // ── Collect results ──────────────────────────────────────────────────────

  type RepoModelResult = {
    repo:         string;
    model:        string;
    baseline:     { total: number; max: number; perQ: Record<string, number> };
    chode:        { total: number; max: number; perQ: Record<string, number> };
    chodeProfile: string;
  };

  const allResults: RepoModelResult[] = [];

  for (const repo of REPOS) {
    const chodeProfile = await readFile(repo.profilePath, 'utf8').catch(() => {
      console.error(`Cannot read profile: ${repo.profilePath}`);
      process.exit(1);
    }) as string;

    const tokEst = Math.ceil(chodeProfile.length / 4);
    console.log(`\n══ ${repo.name} (~${tokEst} tok) ══`);

    for (const model of MODELS) {
      // — baseline (no profile, no repo name in questions)
      process.stdout.write(`  ${model.label.padEnd(14)} baseline… `);
      const baseAnswers = await callModel(model.id, apiKey, null, repo.questions);

      let baseTotal = 0;
      const baseMax = repo.questions.length * 3;
      const basePerQ: Record<string, number> = {};
      for (const q of repo.questions) {
        const a = baseAnswers.get(q.id) ?? '';
        const s = score(q, a);
        basePerQ[q.id] = s;
        baseTotal += s;
      }
      process.stdout.write(`${baseTotal}/${baseMax}  chode… `);

      // — chode (with profile)
      const chodeAnswers = await callModel(model.id, apiKey, chodeProfile, repo.questions);
      let chodeTotal = 0;
      const chodeMax = baseMax;
      const chodePerQ: Record<string, number> = {};
      for (const q of repo.questions) {
        const a = chodeAnswers.get(q.id) ?? '';
        const s = score(q, a);
        chodePerQ[q.id] = s;
        chodeTotal += s;
      }

      const pct   = (n: number, d: number) => `${Math.round(n / d * 100)}%`;
      const arrow  = chodeTotal >= baseTotal ? '▲' : '▽';
      const deltaV = chodeTotal - baseTotal;
      console.log(
        `${chodeTotal}/${chodeMax}  ${arrow} chode ${pct(chodeTotal, chodeMax)} vs baseline ${pct(baseTotal, baseMax)} (Δ${deltaV >= 0 ? '+' : ''}${deltaV})`
      );

      allResults.push({
        repo: repo.name,
        model: model.label,
        baseline: { total: baseTotal,  max: baseMax,   perQ: basePerQ  },
        chode:    { total: chodeTotal, max: chodeMax,  perQ: chodePerQ },
        chodeProfile,
      });
    }
  }

  // ── Build Markdown report ─────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  const pct  = (n: number, d: number) => d > 0 ? `${Math.round(n / d * 100)}%` : '—';

  let md = `# CHODE Unseen Repos Benchmark\n\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repos:** ${REPOS.map(r => r.name).join(', ')} *(none were in the original 9-repo training set)*  \n`;
  md += `**Models:** ${MODELS.map(m => `${m.label} (\`${m.id}\`)`).join(', ')}  \n`;
  md += `**Modes:** baseline (no profile, no repo name) vs CHODE (profile injected)  \n`;
  md += `**Scoring:** 0–3 per question (0=miss, 1=partial, 2=all must terms, 3=must+good terms)  \n\n`;

  // Summary table
  md += `## Score Summary\n\n`;
  md += `| Repo | Model | Baseline | CHODE | Δ |\n`;
  md += `|---|---|---|---|---|\n`;
  for (const r of allResults) {
    const delta = r.chode.total - r.baseline.total;
    const sign  = delta >= 0 ? '+' : '';
    md += `| ${r.repo} | ${r.model} | ${r.baseline.total}/${r.baseline.max} (${pct(r.baseline.total, r.baseline.max)}) | ${r.chode.total}/${r.chode.max} (${pct(r.chode.total, r.chode.max)}) | ${sign}${delta} |\n`;
  }
  md += '\n';

  // Aggregate by repo (across models)
  md += `## Aggregate by Repo (both models combined)\n\n`;
  md += `| Repo | Baseline% | CHODE% | Δ% |\n`;
  md += `|---|---|---|---|\n`;
  for (const repo of REPOS) {
    const rows = allResults.filter(r => r.repo === repo.name);
    const bTotal = rows.reduce((s, r) => s + r.baseline.total, 0);
    const bMax   = rows.reduce((s, r) => s + r.baseline.max,   0);
    const cTotal = rows.reduce((s, r) => s + r.chode.total,    0);
    const cMax   = rows.reduce((s, r) => s + r.chode.max,      0);
    const bPct   = Math.round(bTotal / bMax * 100);
    const cPct   = Math.round(cTotal / cMax * 100);
    md += `| ${repo.name} | ${bPct}% | ${cPct}% | ${cPct - bPct >= 0 ? '+' : ''}${cPct - bPct}% |\n`;
  }
  md += '\n';

  // Overall totals
  const grandBTotal = allResults.reduce((s, r) => s + r.baseline.total, 0);
  const grandBMax   = allResults.reduce((s, r) => s + r.baseline.max,   0);
  const grandCTotal = allResults.reduce((s, r) => s + r.chode.total,    0);
  const grandCMax   = allResults.reduce((s, r) => s + r.chode.max,      0);
  const grandBPct   = Math.round(grandBTotal / grandBMax * 100);
  const grandCPct   = Math.round(grandCTotal / grandCMax * 100);
  md += `**Overall — Baseline: ${grandBPct}% | CHODE: ${grandCPct}% | Δ: ${grandCPct - grandBPct >= 0 ? '+' : ''}${grandCPct - grandBPct}%**\n\n`;

  // Per-question breakdown
  md += `## Per-Question Breakdown\n\n`;
  for (const repo of REPOS) {
    md += `### ${repo.name}\n\n`;
    const headerModels = MODELS.map(m => `${m.label} base | ${m.label} chode`).join(' | ');
    md += `| Q | Question (truncated) | Must terms | ${headerModels} |\n`;
    const sepModels = MODELS.map(() => `--- | ---`).join(' | ');
    md += `|---|---|---|${sepModels}|\n`;
    for (const q of repo.questions) {
      const truncQ  = q.text.length > 55 ? q.text.slice(0, 52) + '…' : q.text;
      const musts   = `\`${q.must.join(', ')}\`${q.good?.length ? ` *(+${q.good.join(', ')})*` : ''}`;
      const stumpMark = q.stump ? ' ★' : '';
      const modelCells = MODELS.map(m => {
        const r = allResults.find(r => r.repo === repo.name && r.model === m.label);
        const b = r?.baseline.perQ[q.id] ?? '—';
        const c = r?.chode.perQ[q.id]    ?? '—';
        return `${b}${stumpMark} | ${c}`;
      }).join(' | ');
      md += `| ${q.id} | ${truncQ} | ${musts} | ${modelCells} |\n`;
    }
    md += `\n★ = stump question (likely wrong without profile)\n\n`;

    // Inline profile
    const r0 = allResults.find(r => r.repo === repo.name);
    md += `<details><summary>CHODE profile (${Math.ceil((r0?.chodeProfile.length ?? 0) / 4)} tok)</summary>\n\n`;
    md += `\`\`\`\n${r0?.chodeProfile ?? ''}\n\`\`\`\n\n</details>\n\n`;
  }

  // ── Write file ────────────────────────────────────────────────────────────

  const outDir  = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts      = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `unseen-repos-test-${ts}.md`);
  await writeFile(outFile, md, 'utf8');
  console.log(`\nSaved → ${outFile}`);

  // Console summary
  console.log('\n── Final Scores ──────────────────────────────────────────────────────');
  console.log(`${'Repo'.padEnd(14)} ${'Model'.padEnd(14)} Baseline   CHODE      Δ`);
  console.log('─'.repeat(60));
  for (const r of allResults) {
    const delta = r.chode.total - r.baseline.total;
    console.log(
      `${r.repo.padEnd(14)} ${r.model.padEnd(14)} ` +
      `${pct(r.baseline.total, r.baseline.max).padEnd(11)}` +
      `${pct(r.chode.total, r.chode.max).padEnd(11)}` +
      `${delta >= 0 ? '+' : ''}${delta}`
    );
  }
  console.log('─'.repeat(60));
  console.log(
    `${'OVERALL'.padEnd(14)} ${'(all models)'.padEnd(14)} ` +
    `${String(grandBPct + '%').padEnd(11)}` +
    `${String(grandCPct + '%').padEnd(11)}` +
    `${grandCPct - grandBPct >= 0 ? '+' : ''}${grandCPct - grandBPct}%`
  );
}

main().catch(e => { console.error(e); process.exit(1); });
