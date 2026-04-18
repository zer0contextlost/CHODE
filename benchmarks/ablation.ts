#!/usr/bin/env node
/**
 * CHODE Ablation Study Runner
 * Tests which section (TREE+LEGEND, DNA, CONTEXT) drives benchmark accuracy.
 *
 * Runs 7 variants of the gitea .chode profile:
 *   full            — all sections (control)
 *   no-tree         — TREE+LEGEND stripped (codec useless without tree)
 *   no-dna          — DNA section stripped
 *   no-context      — CONTEXT section stripped
 *   tree-only       — only TREE+LEGEND
 *   dna-only        — only DNA
 *   context-only    — only CONTEXT
 *
 * Usage (single model):
 *   node --experimental-strip-types benchmarks/ablation.ts \
 *     --provider openrouter --model mistralai/mistral-large-2512
 *
 * Usage (all 6 test models):
 *   node --experimental-strip-types benchmarks/ablation.ts \
 *     --provider openrouter \
 *     --models "mistralai/mistral-large-2512,google/gemini-2.5-pro,google/gemini-2.5-flash,openai/gpt-4o,openai/gpt-4o-mini,meta-llama/llama-4-maverick"
 *
 * Run a subset of variants:
 *   ... --only "full,no-tree,no-dna,no-context"
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OLLAMA_URL = 'http://localhost:11434';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Questions ─────────────────────────────────────────────────────────────────

const QUESTIONS: Array<{ id: string; topic: string; category: string; text: string }> = [
  { id: 'Q1',  category: 'Objective',    topic: 'Primary languages',           text: 'What language(s) is this project primarily written in?' },
  { id: 'Q2',  category: 'Objective',    topic: 'Web frameworks',              text: 'What web framework(s) does it use?' },
  { id: 'Q3',  category: 'Objective',    topic: 'Databases',                   text: 'What database(s) does it support or use?' },
  { id: 'Q4',  category: 'Objective',    topic: 'Package managers',            text: 'What package manager(s) are used?' },
  { id: 'Q5',  category: 'Objective',    topic: 'Primary purpose',             text: "What is the project's primary purpose in one sentence?" },
  { id: 'Q6',  category: 'Navigational', topic: 'Main entry point',            text: 'What is the main entry point file?' },
  { id: 'Q7',  category: 'Navigational', topic: 'Monorepo / top-level count',  text: 'Is this a monorepo? How many top-level packages?' },
  { id: 'Q8',  category: 'Navigational', topic: 'Routes/handlers location',    text: 'Where are HTTP routes/handlers defined?' },
  { id: 'Q9',  category: 'Navigational', topic: 'Schema/ORM models',           text: 'Where is the data schema or ORM models defined?' },
  { id: 'Q10', category: 'Navigational', topic: 'Frontend/UI code location',   text: 'Where does frontend/UI code live?' },
  { id: 'Q11', category: 'Inferential',  topic: 'Architectural pattern',       text: 'What architectural pattern does the project follow?' },
  { id: 'Q12', category: 'Inferential',  topic: 'Project type',                text: 'Frontend, backend, CLI, library, or fullstack?' },
  { id: 'Q13', category: 'Inferential',  topic: 'Configuration management',    text: 'How is configuration managed?' },
  { id: 'Q14', category: 'Inferential',  topic: 'Dependency injection',        text: 'Does the project use dependency injection?' },
  { id: 'Q15', category: 'Inferential',  topic: 'Authentication',              text: 'How is authentication handled?' },
  { id: 'Q16', category: 'Domain',       topic: 'Main domain entities',        text: 'What are the main domain entities?' },
  { id: 'Q17', category: 'Domain',       topic: 'External integrations',       text: 'What external services or APIs does it integrate with?' },
  { id: 'Q18', category: 'Domain',       topic: 'Test framework',              text: 'What test framework is used?' },
  { id: 'Q19', category: 'Domain',       topic: 'How to run tests',            text: 'How do you run the test suite?' },
  { id: 'Q20', category: 'Domain',       topic: 'CI system',                   text: 'What CI system is used?' },
  { id: 'Q21', category: 'Navigation',   topic: 'Where to add API endpoint',   text: 'Where would you add a new API endpoint?' },
  { id: 'Q22', category: 'Navigation',   topic: 'Migrations location',         text: 'Where would you find database migrations?' },
  { id: 'Q23', category: 'Navigation',   topic: 'Core business logic',         text: 'Where is the core business logic concentrated?' },
  { id: 'Q24', category: 'Navigation',   topic: 'Error handling middleware',   text: 'Where is error handling middleware?' },
  { id: 'Q25', category: 'Navigation',   topic: 'Env var documentation',       text: 'Where are environment variables documented?' },
  { id: 'Q26', category: 'Deep',         topic: 'Top 3 internal packages',     text: 'What are the top 3 most-used internal packages?' },
  { id: 'Q27', category: 'Deep',         topic: 'Bootstrap/init sequence',     text: 'What does the bootstrap/initialization sequence look like?' },
  { id: 'Q28', category: 'Deep',         topic: 'Notable design patterns',     text: 'What notable design patterns appear in the codebase?' },
  { id: 'Q29', category: 'Deep',         topic: 'Key deployer config options', text: 'What are the key config options a deployer would set?' },
  { id: 'Q30', category: 'Deep',         topic: 'New contributor essentials',  text: 'What would a new contributor need to know first?' },
];

// ── Ground truth (Gitea) ──────────────────────────────────────────────────────

type GroundTruth = { must: string[]; good: string[]; note?: string };

const GITEA_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['go'],                           good: ['typescript', 'ts', 'vue'] },
  Q2:  { must: ['chi'],                          good: ['vue', 'vite'] },
  Q3:  { must: ['mysql', 'sqlite'],              good: ['mssql', 'redis', 'postgres', 'pq'] },
  Q4:  { must: ['pnpm', 'gomod'],                good: ['uv'] },
  Q5:  { must: ['git', 'self-host'],             good: ['easy', 'fast', 'gogs'] },
  Q6:  { must: ['main.go'],                      good: [] },
  Q7:  { must: [],                               good: [],                           note: 'manual' },
  Q8:  { must: ['routers'],                      good: ['api/v1', 'ro/'] },
  Q9:  { must: ['models'],                       good: ['mdl/', 'migrations'] },
  Q10: { must: ['web_src'],                      good: ['vue', 'ts'] },
  Q11: { must: ['layered'],                      good: ['cmd', 'routes', 'svc', 'mdl'] },
  Q12: { must: ['fullstack'],                    good: ['cli'] },
  Q13: { must: ['ini'],                          good: [] },
  Q14: { must: ['no', 'not'],                    good: [] },
  Q15: { must: ['ldap', 'oauth', 'webauthn'],    good: ['pam', 'openid', 'jwt', 'password'] },
  Q16: { must: ['actions', 'issues', 'organization'], good: ['auth', 'packages', 'git', 'perm'] },
  Q17: { must: ['azure', 'aws', 'github'],       good: ['minio', 'prometheus'] },
  Q18: { must: ['playwright', 'vitest'],         good: ['make test'] },
  Q19: { must: ['make test'],                    good: ['test-backend', 'test-frontend'] },
  Q20: { must: ['github'],                       good: ['actions', 'github-actions'] },
  Q21: { must: ['routers'],                      good: ['api/v1', 'api', 'ro/'] },
  Q22: { must: ['models/migrations', 'migration'], good: ['305'] },
  Q23: { must: ['svc'],                          good: ['services', 'mod/'] },
  Q24: { must: ['routers/common', 'common/'],    good: [] },
  Q25: { must: ['not'],                          good: [] },
  Q26: { must: ['modules', 'models', 'services'], good: ['routers', 'cmd'] },
  Q27: { must: ['main.go', 'cmd/'],              good: ['install', 'ro/install'] },
  Q28: { must: ['layered', 'strategy'],          good: ['repository', 'middleware'] },
  Q29: { must: [],                               good: ['database', 'ini'],          note: 'manual' },
  Q30: { must: ['make fmt'],                     good: ['test', 'styleguide', 'contributing'] },
};

// ── Section parser ────────────────────────────────────────────────────────────

type Sections = {
  header:  string;
  tree:    string;
  legend:  string;
  dna:     string;
  context: string;
};

function parseSections(raw: string): Sections {
  const treeIdx    = raw.indexOf('---TREE---');
  const legendIdx  = raw.indexOf('---LEGEND---');
  const dnaIdx     = raw.indexOf('---DNA---');
  const contextIdx = raw.indexOf('---CONTEXT---');
  if (treeIdx === -1 || legendIdx === -1 || dnaIdx === -1 || contextIdx === -1) {
    throw new Error('Missing sections in .chode file. Expected: TREE, LEGEND, DNA, CONTEXT');
  }
  return {
    header:  raw.slice(0, treeIdx),
    tree:    raw.slice(treeIdx, legendIdx),
    legend:  raw.slice(legendIdx, dnaIdx),
    dna:     raw.slice(dnaIdx, contextIdx),
    context: raw.slice(contextIdx),
  };
}

type VariantName = 'full' | 'no-tree' | 'no-dna' | 'no-context' | 'tree-only' | 'dna-only' | 'context-only';

const ALL_VARIANTS: VariantName[] = ['full', 'no-tree', 'no-dna', 'no-context', 'tree-only', 'dna-only', 'context-only'];

const VARIANT_DESC: Record<VariantName, string> = {
  'full':         'All sections (control)',
  'no-tree':      'TREE+LEGEND removed — DNA+CONTEXT only',
  'no-dna':       'DNA removed — TREE+LEGEND+CONTEXT only',
  'no-context':   'CONTEXT removed — TREE+LEGEND+DNA only',
  'tree-only':    'TREE+LEGEND only (no DNA, no CONTEXT)',
  'dna-only':     'DNA only (no TREE, no CONTEXT)',
  'context-only': 'CONTEXT only (no TREE, no DNA)',
};

function buildVariant(s: Sections, variant: VariantName): string {
  switch (variant) {
    case 'full':         return s.header + s.tree + s.legend + s.dna + s.context;
    case 'no-tree':      return s.header + s.dna + s.context;
    case 'no-dna':       return s.header + s.tree + s.legend + s.context;
    case 'no-context':   return s.header + s.tree + s.legend + s.dna;
    case 'tree-only':    return s.header + s.tree + s.legend;
    case 'dna-only':     return s.header + s.dna;
    case 'context-only': return s.header + s.context;
  }
}

// ── API backends ──────────────────────────────────────────────────────────────

async function queryOllama(model: string, prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: { temperature: 0, num_ctx: 16384 },
    }),
  });
  if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { message?: { content: string }; error?: string };
  if (data.error) throw new Error(`Ollama: ${data.error}`);
  if (!data.message?.content) throw new Error('Ollama returned empty response');
  return data.message.content;
}

async function queryOpenRouter(model: string, apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://github.com/chode',
      'X-Title': 'CHODE Ablation',
    },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0 }),
  });
  if (!res.ok) throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`);
  const data = await res.json() as {
    choices?: Array<{ message: { content: string } }>;
    error?: { message: string };
  };
  if (data.error) throw new Error(`OpenRouter: ${data.error.message}`);
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenRouter returned empty response');
  return content;
}

// ── Prompt + parser ───────────────────────────────────────────────────────────

function buildPrompt(chodeContent: string): string {
  const questionList = QUESTIONS.map(q => `${q.id}: ${q.text}`).join('\n');
  return `You are participating in a controlled benchmark. You will be given a .chode profile — a compressed description of a software repository — and must answer 30 standardized questions using ONLY the information in the profile.

RULES:
1. Use ONLY what is written in the .chode profile. Do not use prior knowledge about this repository.
2. If the information is not in the profile, answer: "Not in profile."
3. Answer all 30 questions in order.
4. Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line. Do not repeat the question text.

Example format:
Q1:
Go and TypeScript.

Q2:
Chi (backend), Vue 3 (frontend).

THE .CHODE PROFILE:
${chodeContent}

THE 30 QUESTIONS:
${questionList}

Now answer Q1 through Q30 using the format shown above.`;
}

function parseAnswers(raw: string): Map<string, string> {
  const answers = new Map<string, string>();
  const blocks = raw.split(/\n(?=Q(\d{1,2})[:.)\s])/);
  for (const block of blocks) {
    const labelMatch = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!labelMatch) continue;
    const num = parseInt(labelMatch[1]!);
    if (num < 1 || num > 30) continue;
    let body = block
      .replace(/^Q\d{1,2}[:.)\s]+/, '')           // strip label only, keep rest of line
      .replace(/^[A-Z]\d{1,2}[:.]\s*/m, '')
      .trim();
    const qText = QUESTIONS[num - 1]?.text ?? '';
    if (qText && body.toLowerCase().startsWith(qText.slice(0, 20).toLowerCase())) {
      body = body.slice(qText.length).replace(/^\s*\n?/, '').trim();
    }
    if (body) answers.set(`Q${num}`, body);
  }
  return answers;
}

// ── Scorer ────────────────────────────────────────────────────────────────────

const NOT_FOUND_PHRASES = ['not in profile', 'not explicitly stated', 'not mentioned', 'not specified', 'cannot be determined', 'no information'];

type ScoreResult = { score: number; auto: boolean };

function autoScore(qId: string, answer: string, gt: GroundTruth | null | undefined): ScoreResult {
  if (!gt) return { score: -1, auto: false };
  if (gt.must.length === 0 && gt.good.length === 0) return { score: -1, auto: false };
  const a = answer.toLowerCase();
  if (gt.must.length === 0 && NOT_FOUND_PHRASES.some(p => a.includes(p))) {
    return { score: 0, auto: true };
  }
  const hasAllMust = gt.must.length === 0 || gt.must.every(t => a.includes(t.toLowerCase()));
  const hasAnyMust = gt.must.length === 0 || gt.must.some(t => a.includes(t.toLowerCase()));
  const goodCount = gt.good.filter(t => a.includes(t.toLowerCase())).length;
  if (!hasAnyMust) return { score: 0, auto: true };
  if (!hasAllMust) return { score: 1, auto: true };
  if (gt.good.length > 0 && goodCount === 0) return { score: 2, auto: true };
  return { score: 3, auto: true };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type VariantResult = {
  variant: VariantName;
  tokens: number;
  autoTotal: number;
  autoMax: number;
  scores: Map<string, ScoreResult>;
  elapsed: number;
};

type ModelResults = {
  model: string;
  variants: VariantResult[];
};

// ── Run one variant ───────────────────────────────────────────────────────────

async function runVariant(
  variant: VariantName,
  content: string,
  provider: string,
  model: string,
  apiKey: string | undefined,
): Promise<VariantResult> {
  const tokens = Math.ceil(content.length / 4);
  const prompt = buildPrompt(content);
  const start = Date.now();
  const raw = provider === 'openrouter'
    ? await queryOpenRouter(model, apiKey!, prompt)
    : await queryOllama(model, prompt);
  const elapsed = (Date.now() - start) / 1000;

  const answers = parseAnswers(raw);
  const scores = new Map<string, ScoreResult>();
  for (const q of QUESTIONS) {
    const answer = answers.get(q.id) ?? '';
    scores.set(q.id, autoScore(q.id, answer, GITEA_GROUND_TRUTH[q.id]));
  }

  const autoScored = [...scores.values()].filter(s => s.auto);
  const autoTotal = autoScored.reduce((n, s) => n + s.score, 0);
  const autoMax = autoScored.length * 3;

  return { variant, tokens, autoTotal, autoMax, scores, elapsed };
}

// ── Report builder ────────────────────────────────────────────────────────────

function pct(score: number, max: number) { return Math.round(score / max * 100); }

function buildReport(provider: string, allResults: ModelResults[], variants: VariantName[], date: string): string {
  const models = allResults.map(r => r.model);

  // ── Cross-model summary table (one row per variant) ──
  const variantTokens: Record<VariantName, number> = {} as any;
  for (const vr of allResults[0]?.variants ?? []) variantTokens[vr.variant] = vr.tokens;

  const crossRows = variants.map(v => {
    const scores = allResults.map(mr => {
      const vr = mr.variants.find(x => x.variant === v);
      return vr ? `${vr.autoTotal}/${vr.autoMax} (${pct(vr.autoTotal, vr.autoMax)}%)` : '—';
    });
    return `| ${v} | ${variantTokens[v] ?? '?'} | ${scores.join(' | ')} |`;
  }).join('\n');

  const modelHeaders = models.join(' | ');
  const modelSeps = models.map(() => '---').join(' | ');

  // ── Section attribution per model ──
  const attrRows = allResults.map(mr => {
    const full     = mr.variants.find(v => v.variant === 'full');
    const noTree   = mr.variants.find(v => v.variant === 'no-tree');
    const noDna    = mr.variants.find(v => v.variant === 'no-dna');
    const noCtx    = mr.variants.find(v => v.variant === 'no-context');
    const treeOnly = mr.variants.find(v => v.variant === 'tree-only');
    const dnaOnly  = mr.variants.find(v => v.variant === 'dna-only');
    const ctxOnly  = mr.variants.find(v => v.variant === 'context-only');
    const f = full?.autoTotal ?? '?';
    const treeDrop = (full && noTree)   ? full.autoTotal - noTree.autoTotal   : '?';
    const dnaDrop  = (full && noDna)    ? full.autoTotal - noDna.autoTotal    : '?';
    const ctxDrop  = (full && noCtx)    ? full.autoTotal - noCtx.autoTotal    : '?';
    const treeSolo = treeOnly ? `${treeOnly.autoTotal}/${treeOnly.autoMax}` : '?';
    const dnaSolo  = dnaOnly  ? `${dnaOnly.autoTotal}/${dnaOnly.autoMax}`   : '?';
    const ctxSolo  = ctxOnly  ? `${ctxOnly.autoTotal}/${ctxOnly.autoMax}`   : '?';
    return `| ${mr.model} | **${f}** | -${treeDrop} (${treeSolo} solo) | -${dnaDrop} (${dnaSolo} solo) | -${ctxDrop} (${ctxSolo} solo) |`;
  }).join('\n');

  // ── Per-question cross-model × variant heat map (just full vs no-X) ──
  const autoQids = QUESTIONS.filter(q => {
    const gt = GITEA_GROUND_TRUTH[q.id];
    return gt && (gt.must.length > 0 || gt.good.length > 0);
  }).map(q => q.id);

  // For each question, show score for each model under 'full', 'no-tree', 'no-dna', 'no-context'
  const removalVariants: VariantName[] = ['full', 'no-tree', 'no-dna', 'no-context'];
  const questionRows = autoQids.map(qid => {
    const q = QUESTIONS.find(x => x.id === qid)!;
    const cells = allResults.flatMap(mr =>
      removalVariants.map(v => {
        const vr = mr.variants.find(x => x.variant === v);
        const s = vr?.scores.get(qid);
        return s?.auto ? s.score.toString() : '—';
      })
    );
    return `| ${qid} | ${q.topic} | ${q.category} | ${cells.join(' | ')} |`;
  }).join('\n');

  const qHeaders = allResults.flatMap(mr =>
    removalVariants.map(v => `${mr.model.split('/').pop()} ${v}`)
  ).join(' | ');
  const qSeps = allResults.flatMap(() => removalVariants.map(() => '---')).join(' | ');

  return `# CHODE Ablation Study — All Models
**Date:** ${date}
**Provider:** ${provider}
**Models:** ${models.join(', ')}
**Repo:** gitea (5,752 files, production Go web app)
**Auto-scorable questions:** 29/30 (Q7 = monorepo, manual)
**Max auto score:** 87 pts (29 × 3)

> Ablation study: each section stripped individually to isolate accuracy contribution.
> Scores are auto-scored points out of 87.

---

## Cross-Model Summary by Variant

| Variant | Tokens | ${modelHeaders} |
|---|---|${modelSeps}|
${crossRows}

---

## Section Attribution per Model

| Model | Full score | TREE+LEGEND drop (solo) | DNA drop (solo) | CONTEXT drop (solo) |
|---|---|---|---|---|
${attrRows}

> "Drop" = points lost when section is removed from full profile.
> "Solo" = score when only that section is present.

---

## Per-Question Scores (Full vs Removal Variants)

Columns: for each model — Full / No-TREE / No-DNA / No-CTX

| Q | Topic | Category | ${qHeaders} |
|---|---|---|${qSeps}|
${questionRows}

---

## Variant Descriptions

${ALL_VARIANTS.map(v => `- **${v}**: ${VARIANT_DESC[v]}`).join('\n')}

---

## Per-Model Detail

${allResults.map(mr => {
    const rows = mr.variants.map(vr => {
      const full = mr.variants.find(v => v.variant === 'full');
      const delta = (full && vr.variant !== 'full')
        ? ` (${vr.autoTotal - full.autoTotal >= 0 ? '+' : ''}${vr.autoTotal - full.autoTotal})`
        : '';
      return `| ${vr.variant} | ${vr.tokens} | ${vr.autoTotal}/${vr.autoMax} | ${pct(vr.autoTotal, vr.autoMax)}% | ${vr.elapsed.toFixed(1)}s |${delta ? ` ${delta}` : ''}`;
    }).join('\n');
    return `### ${mr.model}\n\n| Variant | Tokens | Score | % | Time |\n|---|---|---|---|---|\n${rows}`;
  }).join('\n\n')}
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };

  const modelArg  = get('--model');
  const modelsArg = get('--models');
  const provider  = get('--provider') ?? 'ollama';
  const apiKey    = get('--key') ?? process.env['OPENROUTER_API_KEY'];
  const chodeArg  = get('--chode');
  const onlyArg   = get('--only');

  const models: string[] = modelsArg
    ? modelsArg.split(',').map(s => s.trim()).filter(Boolean)
    : modelArg
      ? [modelArg]
      : [];

  if (models.length === 0) {
    console.error('Usage: ablation.ts --model <name> | --models "m1,m2,..." [--provider ollama|openrouter] [--key <key>] [--chode <path>] [--only "v1,v2,..."]');
    process.exit(1);
  }
  if (provider === 'openrouter' && !apiKey) {
    console.error('OpenRouter requires --key or OPENROUTER_API_KEY env var');
    process.exit(1);
  }

  const variants: VariantName[] = onlyArg
    ? (onlyArg.split(',').map(s => s.trim()) as VariantName[])
    : ALL_VARIANTS;

  const chodeFile = chodeArg
    ? resolve(chodeArg)
    : resolve('F:/projects/benchmarks/gitea/.chode');

  let rawChode: string;
  try {
    rawChode = await readFile(chodeFile, 'utf8');
  } catch {
    console.error(`Cannot read .chode file: ${chodeFile}`);
    process.exit(1);
  }

  const sections = parseSections(rawChode);
  const totalCalls = models.length * variants.length;

  console.log(`\nCHODE Ablation Study`);
  console.log(`  Provider:  ${provider}`);
  console.log(`  Models:    ${models.join(', ')}`);
  console.log(`  Variants:  ${variants.join(', ')}`);
  console.log(`  API calls: ${totalCalls} (${models.length} models × ${variants.length} variants)`);
  console.log(`  Full profile: ~${Math.ceil(rawChode.length / 4)} tokens\n`);

  const allResults: ModelResults[] = [];

  for (const model of models) {
    console.log(`\n  === ${model} ===`);
    const variantResults: VariantResult[] = [];

    for (const variant of variants) {
      const content = buildVariant(sections, variant);
      const tokens = Math.ceil(content.length / 4);
      process.stdout.write(`  [${variant}] ~${tokens} tok — querying...`);
      try {
        const result = await runVariant(variant, content, provider, model, apiKey);
        variantResults.push(result);
        const p = pct(result.autoTotal, result.autoMax);
        const full = variantResults.find(v => v.variant === 'full');
        const delta = (full && variant !== 'full') ? ` (${result.autoTotal - full.autoTotal >= 0 ? '+' : ''}${result.autoTotal - full.autoTotal})` : '';
        console.log(` ${result.autoTotal}/${result.autoMax} = ${p}%${delta} [${result.elapsed.toFixed(1)}s]`);
      } catch (e) {
        console.log(` FAILED: ${e}`);
      }
    }

    allResults.push({ model, variants: variantResults });
  }

  const date = new Date().toISOString().slice(0, 10);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });

  // One combined report
  const combinedSlug = models.length > 1 ? 'all-models' : models[0]!.replace(/[:/]/g, '-');
  const outFile = resolve(outDir, `ablation-gitea-${combinedSlug}-${date}.md`);
  const report = buildReport(provider, allResults, variants, date);
  await writeFile(outFile, report, 'utf8');

  // Also write per-model files for reference
  for (const mr of allResults) {
    const slug = mr.model.replace(/[:/]/g, '-');
    const perFile = resolve(outDir, `ablation-gitea-${slug}-${date}.md`);
    const perReport = buildReport(provider, [mr], variants, date);
    await writeFile(perFile, perReport, 'utf8');
  }

  console.log(`\n  Combined report: ${outFile}`);
  console.log(`  Per-model files: benchmarks/results/ablation-gitea-*-${date}.md\n`);

  // Final summary
  console.log('  ── Final Summary ─────────────────────────────────────────────');
  for (const mr of allResults) {
    const full = mr.variants.find(v => v.variant === 'full');
    if (!full) continue;
    console.log(`\n  ${mr.model}`);
    for (const vr of mr.variants) {
      const delta = vr.variant !== 'full' ? ` (${vr.autoTotal - full.autoTotal >= 0 ? '+' : ''}${vr.autoTotal - full.autoTotal})` : '';
      console.log(`    ${vr.variant.padEnd(14)} ${vr.autoTotal}/${vr.autoMax} = ${pct(vr.autoTotal, vr.autoMax)}%${delta}  [${vr.tokens} tok]`);
    }
  }
  console.log('');
}

main().catch(e => { console.error(e); process.exit(1); });
