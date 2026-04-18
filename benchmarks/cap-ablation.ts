#!/usr/bin/env node
/**
 * CHODE Field-Cap Ablation Study
 *
 * Tests how accuracy changes as each @FIELD value is truncated to N chars.
 * Identifies the "event horizon" — the cap below which stump facts are purged.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/cap-ablation.ts \
 *     --key sk-or-v1-... [--chode path/to/gitea.chode] [--models "m1,m2"]
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTER_REQUEST_DELAY_MS = 1500;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Cap levels to test — lower end is where step function should appear
const CAPS = [20, 40, 60, 80, 120, 200, 350, 500];

const DEFAULT_MODELS = [
  { label: 'gemini-flash',  id: 'google/gemini-2.5-flash' },
  { label: 'gpt-4o',        id: 'openai/gpt-4o' },
  { label: 'mistral-large', id: 'mistralai/mistral-large-2512' },
];

// ── Questions (gitea stump-focused subset — 12 questions) ────────────────────
// Using the per-repo gitea question set from benchmark.ts, which are
// specifically designed as stump questions.

const QUESTIONS = [
  { id: 'Q1',  topic: 'Package managers',        stump: false, text: 'What package managers are used in this project?' },
  { id: 'Q2',  topic: 'Go HTTP router',           stump: true,  text: 'What Go HTTP router/mux library does this project use?' },
  { id: 'Q3',  topic: 'Frontend framework',       stump: false, text: 'What frontend framework and build tool are used?' },
  { id: 'Q4',  topic: 'Config format',            stump: true,  text: 'What configuration file format does this project use?' },
  { id: 'Q5',  topic: 'Entry point',              stump: false, text: 'What is the main entry point file?' },
  { id: 'Q6',  topic: 'Routes location',          stump: false, text: 'Where are HTTP routes/handlers defined?' },
  { id: 'Q7',  topic: 'Middleware location',      stump: true,  text: 'Where is the middleware or common handler logic located?' },
  { id: 'Q8',  topic: 'Migration count',          stump: true,  text: 'How many database migrations does this project have?' },
  { id: 'Q9',  topic: 'Auth methods',             stump: true,  text: 'What authentication methods does this project support?' },
  { id: 'Q10', topic: 'Architectural layers',     stump: true,  text: 'What is the architectural layer order from entry point to data layer?' },
  { id: 'Q11', topic: 'External integrations',   stump: true,  text: 'What cloud storage providers and monitoring systems does it integrate with?' },
  { id: 'Q12', topic: 'Pre-commit requirement',   stump: true,  text: 'What command must you run before committing code?' },
];

// Ground truth (gitea, matching benchmark.ts REPO_GT for gitea)
type GT = { must: string[]; good: string[]; note?: string };
const GT: Record<string, GT> = {
  Q1:  { must: ['pnpm', 'gomod'],                good: ['uv'] },
  Q2:  { must: ['chi'],                          good: [],        note: 'stump: experts default to gin/echo' },
  Q3:  { must: ['vue'],                          good: ['vite', 'ts', 'esbuild'] },
  Q4:  { must: ['ini'],                          good: [],        note: 'stump: experts guess yaml/toml' },
  Q5:  { must: ['main.go'],                      good: [] },
  Q6:  { must: ['routers'],                      good: [] },
  Q7:  { must: ['routers/common'],               good: [],        note: 'stump: experts guess middleware/' },
  Q8:  { must: ['305'],                          good: [],        note: 'stump: exact count from @DATA' },
  Q9:  { must: ['ldap', 'oauth', 'webauthn'],    good: ['pam', 'openid', 'smtp', 'password'] },
  Q10: { must: ['cmd', 'routes', 'svc', 'mdl'], good: [],        note: 'stump: layered arch specifics' },
  Q11: { must: ['azure', 'aws', 'github'],       good: ['minio', 'prometheus'] },
  Q12: { must: ['make fmt'],                     good: [],        note: 'stump: exact command from @CONVENTIONS' },
};

// ── Cap application ───────────────────────────────────────────────────────────

function applyCap(chode: string, cap: number): { capped: string; truncated: string[] } {
  const truncated: string[] = [];
  const lines = chode.split('\n').map(line => {
    const m = line.match(/^(@\w+)\s+(.+)$/);
    if (!m) return line;
    const [, field, value] = m;
    if (value!.length > cap) {
      truncated.push(field!);
      return `${field} ${value!.slice(0, cap)}…`;
    }
    return line;
  });
  return { capped: lines.join('\n'), truncated };
}

// ── Scoring ───────────────────────────────────────────────────────────────────

const NOT_FOUND = ['not in profile', 'not mentioned', 'not specified', 'not explicitly', 'cannot be determined', 'no information'];

function score(qId: string, answer: string): number {
  const gt = GT[qId];
  if (!gt) return -1;
  const a = answer.toLowerCase();
  if (gt.must.length === 0 && NOT_FOUND.some(p => a.includes(p))) return 0;
  const hasAllMust = gt.must.length === 0 || gt.must.every(t => a.includes(t));
  const hasAnyMust = gt.must.length === 0 || gt.must.some(t => a.includes(t));
  const goodCount = gt.good.filter(t => a.includes(t)).length;
  if (!hasAnyMust) return 0;
  if (!hasAllMust) return 1;
  if (gt.good.length > 0 && goodCount === 0) return 2;
  return 3;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function query(modelId: string, apiKey: string, chodeProfile: string): Promise<string> {
  const qList = QUESTIONS.map(q => `${q.id}: ${q.text}`).join('\n');
  const prompt = `You are given a CHODE profile — a compressed description of a software repository. Answer the questions below using ONLY information in the profile. If a fact is not present, say "Not in profile."

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

THE PROFILE:
${chodeProfile}

QUESTIONS:
${qList}

Answer Q1–Q12 now.`;

  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = Math.pow(2, attempt - 1) * 1000;
      process.stdout.write(`[retry ${attempt}] `);
      await sleep(backoff);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Cap Ablation',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 2000;
      process.stdout.write(`[rate limited ${wait}ms] `);
      lastError = new Error('rate limited');
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`HTTP ${res.status}: ${body.slice(0, 100)}`);
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
    return content;
  }
  throw lastError;
}

// ── Parser ────────────────────────────────────────────────────────────────────

function parseAnswers(raw: string): Map<string, string> {
  const answers = new Map<string, string>();
  const blocks = raw.split(/\n(?=Q(\d{1,2})[:.)\s])/);
  for (const block of blocks) {
    const m = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!m) continue;
    const num = parseInt(m[1]!);
    if (num < 1 || num > QUESTIONS.length) continue;
    const body = block
      .replace(/^Q\d{1,2}[:.)\s]+/, '')           // strip label only, keep rest of line
      .replace(/^[A-Z]\d{1,2}[:.]\s*/m, '')       // strip "A1:" prefix some models add
      .trim();
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

  const chodePath = get('--chode') ?? 'F:/projects/benchmarks/gitea/.chode';
  const rawChode = await readFile(chodePath, 'utf8').catch(() => {
    console.error(`Cannot read: ${chodePath}`); process.exit(1);
  }) as string;

  const modelsArg = get('--models');
  const models = modelsArg
    ? modelsArg.split(',').map(s => {
        const [label, ...rest] = s.trim().split(':');
        return { label: label!, id: rest.join(':') || label! };
      })
    : DEFAULT_MODELS;

  const totalCalls = models.length * CAPS.length;
  console.log(`\nCHODE Cap Ablation Study`);
  console.log(`  Caps:     ${CAPS.join(', ')} chars`);
  console.log(`  Models:   ${models.map(m => m.label).join(', ')}`);
  console.log(`  Questions: ${QUESTIONS.length} (${QUESTIONS.filter(q => q.stump).length} stump)`);
  console.log(`  API calls: ${totalCalls}\n`);

  // Show what each cap truncates
  console.log('  Field truncation preview:');
  for (const cap of CAPS) {
    const { truncated } = applyCap(rawChode, cap);
    const profileLen = applyCap(rawChode, cap).capped.length;
    console.log(`    cap=${String(cap).padStart(3)}: truncates ${truncated.join(' ') || '(none)'}  (~${Math.ceil(profileLen/4)} tok)`);
  }
  console.log();

  // Results: model → cap → { total, perQ }
  type CapResult = { cap: number; total: number; max: number; stumpTotal: number; stumpMax: number; perQ: Record<string, number>; truncated: string[] };
  type ModelRun = { label: string; id: string; caps: CapResult[] };
  const allRuns: ModelRun[] = [];

  for (const model of models) {
    console.log(`\n── ${model.label} ──`);
    const capResults: CapResult[] = [];

    for (const cap of CAPS) {
      const { capped, truncated } = applyCap(rawChode, cap);
      const approxTok = Math.ceil(capped.length / 4);
      process.stdout.write(`  cap=${String(cap).padStart(3)} (~${approxTok} tok)… `);

      let raw: string;
      try {
        raw = await query(model.id, apiKey, capped);
      } catch (e) {
        console.log(`FAILED: ${e}`);
        continue;
      }

      const answers = parseAnswers(raw);
      const perQ: Record<string, number> = {};
      let total = 0, max = 0, stumpTotal = 0, stumpMax = 0;

      for (const q of QUESTIONS) {
        const answer = answers.get(q.id.replace('Q', '')) ?? answers.get(q.id) ?? '';
        const s = score(q.id, answer);
        if (s >= 0) {
          perQ[q.id] = s;
          total += s; max += 3;
          if (q.stump) { stumpTotal += s; stumpMax += 3; }
        }
      }

      const pct = (n: number, d: number) => d > 0 ? Math.round(n / d * 100) : 0;
      console.log(`${total}/${max} (${pct(total, max)}%)  stump: ${stumpTotal}/${stumpMax} (${pct(stumpTotal, stumpMax)}%)`);
      capResults.push({ cap, total, max, stumpTotal, stumpMax, perQ, truncated });
    }

    allRuns.push({ ...model, caps: capResults });
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  const pct = (n: number, d: number) => d > 0 ? `${Math.round(n / d * 100)}%` : '—';

  let md = `# CHODE Field-Cap Ablation Study\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repo:** gitea  \n`;
  md += `**Caps tested:** ${CAPS.join(', ')} chars  \n`;
  md += `**Questions:** ${QUESTIONS.length} total, ${QUESTIONS.filter(q => q.stump).length} stump\n\n`;

  // Field truncation table
  md += `## Field Truncation by Cap\n\n`;
  md += `| Cap | Fields truncated | ~Tokens |\n|---|---|---|\n`;
  for (const cap of CAPS) {
    const { capped, truncated } = applyCap(rawChode, cap);
    md += `| ${cap} | ${truncated.join(', ') || '(none)'} | ~${Math.ceil(capped.length / 4)} |\n`;
  }
  md += '\n';

  // Overall scores per model per cap
  md += `## Overall Score by Cap\n\n`;
  const modelCols = allRuns.map(r => r.label).join(' | ');
  const modelSeps = allRuns.map(() => '---').join(' | ');
  md += `| Cap | Tokens | ${modelCols} |\n|---|---|${modelSeps}|\n`;
  for (const cap of CAPS) {
    const { capped } = applyCap(rawChode, cap);
    const tok = `~${Math.ceil(capped.length / 4)}`;
    const scores = allRuns.map(r => {
      const cr = r.caps.find(c => c.cap === cap);
      return cr ? `${cr.total}/${cr.max} (${pct(cr.total, cr.max)})` : '—';
    }).join(' | ');
    md += `| ${cap} | ${tok} | ${scores} |\n`;
  }
  md += '\n';

  // Stump-only scores
  md += `## Stump Score by Cap\n\n`;
  md += `| Cap | ${modelCols} |\n|---|${modelSeps}|\n`;
  for (const cap of CAPS) {
    const scores = allRuns.map(r => {
      const cr = r.caps.find(c => c.cap === cap);
      return cr ? `${cr.stumpTotal}/${cr.stumpMax} (${pct(cr.stumpTotal, cr.stumpMax)})` : '—';
    }).join(' | ');
    md += `| ${cap} | ${scores} |\n`;
  }
  md += '\n';

  // Per-question breakdown (stump questions only)
  const stumpQs = QUESTIONS.filter(q => q.stump);
  md += `## Per-Question Scores (Stump Questions)\n\n`;
  for (const model of allRuns) {
    md += `### ${model.label}\n\n`;
    const capHeaders = model.caps.map(c => `cap=${c.cap}`).join(' | ');
    const capSeps = model.caps.map(() => '---').join(' | ');
    md += `| Q | Topic | ${capHeaders} |\n|---|---|${capSeps}|\n`;
    for (const q of stumpQs) {
      const scores = model.caps.map(c => {
        const s = c.perQ[q.id];
        return s !== undefined ? String(s) : '—';
      }).join(' | ');
      const gt = GT[q.id];
      md += `| ${q.id} | ${q.topic} | ${scores} | *(must: ${gt?.must.join(', ')})*\n`;
    }
    md += '\n';
  }

  // Step function detection
  md += `## Step Function Analysis\n\n`;
  md += `Fields and the cap at which they get truncated:\n\n`;
  for (const cap of CAPS) {
    const { truncated } = applyCap(rawChode, cap);
    if (truncated.length > 0) {
      md += `- **cap=${cap}**: ${truncated.join(', ')} begin truncating\n`;
    }
  }
  md += '\n';

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `cap-ablation-gitea-${date}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  // Console summary
  console.log('\n── Stump Score Summary ───────────────────────────────────────');
  console.log(`${'Cap'.padEnd(6)} ${'Tokens'.padEnd(8)} ${allRuns.map(r => r.label.padEnd(16)).join('')}`);
  for (const cap of CAPS) {
    const { capped } = applyCap(rawChode, cap);
    const tok = `~${Math.ceil(capped.length / 4)}`;
    const cols = allRuns.map(r => {
      const cr = r.caps.find(c => c.cap === cap);
      return cr ? `${pct(cr.stumpTotal, cr.stumpMax)}`.padEnd(16) : '—'.padEnd(16);
    }).join('');
    console.log(`${String(cap).padEnd(6)} ${tok.padEnd(8)} ${cols}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
