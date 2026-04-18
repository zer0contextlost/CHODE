#!/usr/bin/env node
/**
 * Noise Floor Test — focused forced-choice experiment
 *
 * Tests three modes × N models on a single forced-choice stump question.
 * Measures: Prior Overwhelming vs Attention Dilution vs correct retrieval.
 *
 * Also validates the Inversion Point: S_CHODE(Flash) > S_Raw(Pro)
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/noise-floor-test.ts --key sk-or-v1-... [--chode path/to/gitea.chode]
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTER_REQUEST_DELAY_MS = 1500;
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Forced-choice question config ─────────────────────────────────────────────

// Correct answer: chi. Common wrong answers from training data: gin, gorilla/mux, echo.
// Answer lists are shuffled per-model run to control position bias.
const CORRECT_ANSWER = 'chi';
const ALL_CHOICES = ['chi', 'gin', 'echo', 'gorilla/mux'];
const QUESTION_STEM = 'Which HTTP router library does the Gitea project use for its backend?';
const INSTRUCTION = 'Answer with exactly one word or phrase from the list. Output only that choice, nothing else.';

// Deterministic shuffle seeded by model name (controls position bias across models)
function shuffleChoices(choices: string[], seed: string): string[] {
  const arr = [...choices];
  let h = 0;
  for (const c of seed) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  for (let i = arr.length - 1; i > 0; i--) {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) | 0;
    const j = Math.abs(h) % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function buildQuestion(choices: string[]): string {
  const list = choices.map((c, i) => `${i + 1}. ${c}`).join('\n');
  return `${QUESTION_STEM}\n\nChoose from:\n${list}\n\n${INSTRUCTION}`;
}

// ── Models ────────────────────────────────────────────────────────────────────

const MODELS = [
  { label: 'gemini-flash', id: 'google/gemini-2.5-flash' },
  { label: 'gemini-pro',   id: 'google/gemini-2.5-pro' },
  { label: 'mistral-large',id: 'mistralai/mistral-large-2512' },
  { label: 'gpt-4o',       id: 'openai/gpt-4o' },
  { label: 'gpt-4o-mini',  id: 'openai/gpt-4o-mini' },
  { label: 'llama-maverick',id: 'meta-llama/llama-4-maverick' },
];

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function query(model: string, apiKey: string, systemContext: string | null, question: string): Promise<string> {
  const content = systemContext ? `${systemContext}\n\n${question}` : question;
  const messages: Array<{ role: string; content: string }> = [{ role: 'user', content }];

  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = Math.pow(2, attempt - 1) * 1000;
      console.log(`    [retry ${attempt}] waiting ${backoff}ms…`);
      await sleep(backoff);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Noise Floor Test',
      },
      body: JSON.stringify({ model, messages, temperature: 0 }),
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 2000;
      console.log(`    [rate limited] waiting ${wait}ms…`);
      lastError = new Error('rate limited');
      await sleep(wait);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`HTTP ${res.status}: ${body}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
    };
    if (data.error) throw new Error(data.error.message);
    const content = data.choices?.[0]?.message?.content?.trim() ?? '';
    await sleep(INTER_REQUEST_DELAY_MS);
    return content;
  }

  throw lastError;
}

// ── Raw context builder ───────────────────────────────────────────────────────
// Mirrors what self-profile mode feeds: file tree + anchor files + doc files

const ANCHOR_NAMES = new Set(['go.mod', 'package.json', 'Makefile', 'makefile']);
const DOC_NAMES = new Set(['readme.md', 'readme.rst', 'contributing.md', 'changelog.md']);
const WALK_SKIP = new Set(['node_modules', '.git', 'vendor', 'dist', 'build', '__pycache__']);

async function buildRawContext(repoRoot: string): Promise<string> {
  const parts: string[] = [];
  const rootNorm = repoRoot.replace(/\\/g, '/').replace(/\/?$/, '/');

  // File tree (depth ≤ 2, skip noise dirs)
  const treeLines: string[] = [];
  async function walkForTree(dir: string, depth: number): Promise<void> {
    if (depth > 2) return;
    let entries: Awaited<ReturnType<typeof readdir>>;
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (WALK_SKIP.has(e.name)) continue;
      const rel = (dir.replace(/\\/g, '/') + '/' + e.name).replace(rootNorm, '');
      treeLines.push(e.isDirectory() ? `${rel}/` : rel);
      if (e.isDirectory()) await walkForTree(join(dir, e.name), depth + 1);
    }
  }
  await walkForTree(repoRoot, 0);
  parts.push('FILE TREE (top 2 levels):\n' + treeLines.slice(0, 300).join('\n'));

  // Anchor files
  for (const name of ANCHOR_NAMES) {
    try {
      let content = await readFile(join(repoRoot, name), 'utf8');
      if (content.length > 8000) content = content.slice(0, 8000) + '\n...(truncated)';
      parts.push(`\n--- ${name} ---\n${content}`);
    } catch { /* not found */ }
  }

  // Doc files (root level only)
  let entries: Awaited<ReturnType<typeof readdir>>;
  try { entries = await readdir(repoRoot, { withFileTypes: true }); } catch { entries = []; }
  for (const e of entries) {
    if (!e.isFile()) continue;
    const low = e.name.toLowerCase();
    if (!DOC_NAMES.has(low)) continue;
    try {
      let content = await readFile(join(repoRoot, e.name), 'utf8');
      if (content.length > 12000) content = content.slice(0, 12000) + '\n...(truncated)';
      parts.push(`\n--- ${e.name} ---\n${content}`);
    } catch { /* skip */ }
  }

  return parts.join('\n\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────

type Row = {
  model: string;
  baseline: string;
  chode: string;
  raw: string;
  choices: string[];
};

async function main() {
  const args = process.argv.slice(2);
  const keyIdx = args.indexOf('--key');
  const apiKey = keyIdx >= 0 ? args[keyIdx + 1] : process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }

  const chodeIdx = args.indexOf('--chode');
  const chodePath = chodeIdx >= 0
    ? args[chodeIdx + 1]!
    : resolve(__dirname, '../samples/gitea.chode');

  const repoIdx = args.indexOf('--repo');
  const repoPath = repoIdx >= 0
    ? args[repoIdx + 1]!
    : null;

  let chodeProfile: string;
  try {
    chodeProfile = await readFile(chodePath, 'utf8');
  } catch {
    console.error(`Cannot read chode file: ${chodePath}`);
    process.exit(1);
  }

  let rawContext: string | null = null;
  if (repoPath) {
    console.log(`Building raw context from ${repoPath}…`);
    rawContext = await buildRawContext(repoPath);
    console.log(`Raw context: ${rawContext.length} chars\n`);
  } else {
    console.log('No --repo provided; skipping raw-context mode\n');
  }

  const results: Row[] = [];

  for (const model of MODELS) {
    console.log(`\n── ${model.label} ──`);
    const choices = shuffleChoices(ALL_CHOICES, model.label);
    const question = buildQuestion(choices);

    // Baseline
    process.stdout.write('  baseline… ');
    const baseline = await query(model.id, apiKey, null, question);
    console.log(JSON.stringify(baseline));

    // CHODE
    process.stdout.write('  chode…    ');
    const chodeCtx = `Here is a CHODE profile for a software repository:\n\n${chodeProfile}\n\nAnswer questions about this repository based on the profile above.`;
    const chode = await query(model.id, apiKey, chodeCtx, question);
    console.log(JSON.stringify(chode));

    // Raw context (if available)
    let raw = 'skipped';
    if (rawContext) {
      process.stdout.write('  raw…      ');
      const rawCtx = `Here are raw files from a software repository. Use them to answer questions.\n\n${rawContext}`;
      raw = await query(model.id, apiKey, rawCtx, question);
      console.log(JSON.stringify(raw));
    }

    results.push({ model: model.label, baseline, chode, raw, choices });
  }

  // ── Output table ────────────────────────────────────────────────────────────

  function classify(answer: string): string {
    const a = answer.toLowerCase();
    if (a.includes('chi')) return 'CHI ✓';
    if (a.includes('gin')) return 'GIN ✗ (prior)';
    if (a.includes('gorilla') || a.includes('mux')) return 'GORILLA ✗ (prior)';
    if (a.includes('echo')) return 'ECHO ✗ (prior)';
    if (a.includes('not') || a.includes("don't") || a.includes('cannot')) return 'ABSTAIN';
    return `OTHER: ${answer.slice(0, 30)}`;
  }

  console.log('\n\n## Results: Forced-Choice Router Question (Gitea → Chi)\n');
  console.log('| Model | Baseline | CHODE | Raw context | Answer order |');
  console.log('|:---|:---|:---|:---|:---|');
  for (const r of results) {
    const order = r.choices.join(' > ');
    console.log(`| ${r.model} | ${classify(r.baseline)} | ${classify(r.chode)} | ${classify(r.raw)} | ${order} |`);
  }

  // Inversion point check
  const chodeFlash = results.find(r => r.model === 'gemini-flash');
  const rawPro = results.find(r => r.model === 'gemini-pro');
  if (chodeFlash && rawPro && rawContext) {
    const flashCorrect = chodeFlash.chode.toLowerCase().includes(CORRECT_ANSWER);
    const proRawCorrect = rawPro.raw.toLowerCase().includes(CORRECT_ANSWER);
    console.log('\n## Inversion Point Test');
    console.log(`S_CHODE(Flash) = ${flashCorrect ? '1/1 ✓ chi' : `0/1 ✗ "${chodeFlash.chode}"`}`);
    console.log(`S_Raw(Pro)     = ${proRawCorrect ? '1/1 ✓ chi' : `0/1 ✗ "${rawPro.raw}"`}`);
    console.log(flashCorrect && !proRawCorrect
      ? '✓ INVERSION CONFIRMED: Flash+CHODE beats Pro+Raw'
      : flashCorrect && proRawCorrect
        ? '— Both correct on this question (not a clean inversion here)'
        : '? Unexpected result — check raw answers');
  }

  // Save output
  const date = new Date().toISOString().slice(0, 10);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `noise-floor-forced-choice-${date}.md`);

  let md = `# Noise Floor Test — Forced Choice (Gitea Router)\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Question:** ${QUESTION_STEM}  \n`;
  md += `**Correct answer:** ${CORRECT_ANSWER}  \n\n`;
  md += `| Model | Baseline | CHODE | Raw context | Answer order |\n`;
  md += `|:---|:---|:---|:---|:---|\n`;
  for (const r of results) {
    const order = r.choices.join(' > ');
    md += `| ${r.model} | ${classify(r.baseline)} | ${classify(r.chode)} | ${classify(r.raw)} | ${order} |\n`;
  }
  md += `\n### Raw answers\n`;
  for (const r of results) {
    md += `\n**${r.model}**  \n`;
    md += `- Baseline: \`${r.baseline}\`  \n`;
    md += `- CHODE: \`${r.chode}\`  \n`;
    md += `- Raw: \`${r.raw}\`  \n`;
  }

  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
