#!/usr/bin/env node
/**
 * CHODE Schema Remap — gh-cli replication
 *
 * Replicates the gitea field-label retrieval failure experiment on gh-cli.
 * Hypothesis: same @STACK → typed-field gap exists for cobra (cli framework)
 * as we found for chi (http router) in gitea.
 *
 * Blind spots to test:
 *   Q_cobra:    "What CLI framework does gh use?" — cobra is only in @STACK
 *   Q_testscript: "What framework are acceptance tests built on?" — in @TESTING long text
 *
 * Variants:
 *   baseline       — original gh-cli.chode
 *   cobra-routes   — @ROUTES cobra → api/ (24 files)   [parallel to gitea chi-routes]
 *   cobra-commands — add @COMMANDS cobra               [new typed field]
 *   cobra-stack    — @STACK go [cobra=cli-framework] … [bracket annotation]
 *   combined       — cobra-commands (cleanest) + no @TESTING change
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/schema-remap-ghcli.ts --key sk-or-v1-...
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTER_REQUEST_DELAY_MS = 1500;
const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_MODELS = [
  { label: 'gemini-flash',  id: 'google/gemini-2.5-flash' },
  { label: 'gpt-4o',        id: 'openai/gpt-4o' },
  { label: 'mistral-large', id: 'mistralai/mistral-large-2512' },
];

const QUESTIONS = [
  {
    id: 'Qcobra',
    topic: 'CLI command framework',
    text: 'What CLI framework or library does gh use for building and routing commands?',
    must: ['cobra'], good: [] as string[],
    note: 'stump: experts guess flag, urfave/cli, kingpin',
  },
  {
    id: 'Qtestscript',
    topic: 'Acceptance test framework',
    text: 'What package or framework are the acceptance tests built on?',
    must: ['testscript'], good: ['go-internal'] as string[],
    note: 'stump: buried in @TESTING long text',
  },
  {
    id: 'Qgrpc',
    topic: 'RPC protocol',
    text: 'What RPC protocol does gh use for communication?',
    must: ['grpc'], good: [] as string[],
    note: 'control: grpc is in @STACK — should work in baseline if @STACK is read',
  },
];

// ── Variant generator ─────────────────────────────────────────────────────────

type Variant = { label: string; description: string; profile: string };

function buildVariants(baseline: string): Variant[] {
  // cobra-routes: add cobra to @ROUTES (parallel to gitea chi-routes)
  const cobraRoutes = baseline.replace(
    /^(@ROUTES\s+)(.+)$/m,
    (_m, field, rest) => `${field}cobra → ${rest}`,
  );

  // cobra-commands: insert new @COMMANDS field after @ROUTES
  const cobraCommands = baseline.replace(
    /^(@ROUTES.+)$/m,
    (_m, routesLine) => `${routesLine}\n@COMMANDS cobra`,
  );

  // cobra-stack: bracket annotation in @STACK
  const cobraStack = baseline.replace(
    /^(@STACK\s+go\s+(?:oauth\s+)?)cobra(\s+.+)$/m,
    (_m, pre, post) => `${pre}[cobra=cli-framework]${post}`,
  );

  // combined: cobra-commands (clean dedicated field)
  const combined = cobraCommands;

  return [
    { label: 'baseline',        description: 'Original gh-cli.chode',                          profile: baseline       },
    { label: 'cobra-routes',    description: '@ROUTES cobra → api/ (24 files)',                 profile: cobraRoutes    },
    { label: 'cobra-commands',  description: 'New field: @COMMANDS cobra',                      profile: cobraCommands  },
    { label: 'cobra-stack',     description: '@STACK go [cobra=cli-framework] oauth …',         profile: cobraStack     },
    { label: 'combined',        description: '@COMMANDS cobra (same as cobra-commands)',         profile: combined       },
  ];
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function score(q: typeof QUESTIONS[number], answer: string): number {
  const a = answer.toLowerCase();
  const hasAll = q.must.every(t => a.includes(t));
  const hasAny = q.must.some(t => a.includes(t));
  const goodCount = q.good.filter(t => a.includes(t)).length;
  if (!hasAny) return 0;
  if (!hasAll) return 1;
  if (q.good.length > 0 && goodCount === 0) return 2;
  return 3;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function queryModel(modelId: string, apiKey: string, profile: string): Promise<Map<string, string>> {
  const qList = QUESTIONS.map(q => `${q.id}: ${q.text}`).join('\n');
  const prompt = `You are given a CHODE profile — a compressed description of a software repository. Answer the questions below using ONLY information in the profile. If a fact is not present, say "Not in profile."

Format: write the label (Qcobra, Qtestscript, Qgrpc) on its own line, then your answer on the next line.

THE PROFILE:
${profile}

QUESTIONS:
${qList}

Answer all three questions now.`;

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
        'X-Title': 'CHODE Schema Remap gh-cli',
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
    return parseAnswers(content);
  }
  throw lastError;
}

function parseAnswers(raw: string): Map<string, string> {
  const answers = new Map<string, string>();
  // Match Q-labels like "Qcobra", "Qtestscript", "Qgrpc"
  const blocks = raw.split(/\n(?=Q\w+[:.)\s])/);
  for (const block of blocks) {
    const m = block.match(/^(Q\w+)[:.)\s]/);
    if (!m) continue;
    const key = m[1]!;
    if (!QUESTIONS.some(q => q.id === key)) continue;
    const body = block
      .replace(/^Q\w+[:.)\s]+/, '')
      .trim();
    if (body) answers.set(key, body);
  }
  return answers;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };

  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }

  const chodePath = get('--chode') ?? resolve(__dirname, '../samples/gh-cli.chode');
  const baseline = await readFile(chodePath, 'utf8').catch(() => {
    console.error(`Cannot read: ${chodePath}`); process.exit(1);
  }) as string;

  const modelsArg = get('--models');
  const models = modelsArg
    ? modelsArg.split(',').map(s => {
        const [label, ...rest] = s.trim().split(':');
        return { label: label!, id: rest.join(':') || label! };
      })
    : DEFAULT_MODELS;

  const variants = buildVariants(baseline);
  const totalCalls = models.length * variants.length;

  console.log(`\nCHODE Schema Remap — gh-cli Replication`);
  console.log(`  Hypothesis: @STACK → typed-field gap replicates for cobra (cli framework)`);
  console.log(`  Variants: ${variants.length}`);
  console.log(`  Models:   ${models.map(m => m.label).join(', ')}`);
  console.log(`  Questions: Qcobra (must: cobra), Qtestscript (must: testscript), Qgrpc (control: grpc)`);
  console.log(`  API calls: ${totalCalls}\n`);

  // Show diffs
  console.log('  Profile diffs from baseline:');
  for (const v of variants.slice(1)) {
    const baseLines = baseline.split('\n');
    const varLines = v.profile.split('\n');
    let shown = false;
    for (let i = 0; i < Math.max(baseLines.length, varLines.length); i++) {
      if (baseLines[i] !== varLines[i]) {
        if (!shown) { console.log(`  [${v.label}]`); shown = true; }
        console.log(`    - ${baseLines[i] ?? '(nothing)'}`);
        console.log(`    + ${varLines[i] ?? '(nothing)'}`);
      }
    }
  }
  console.log();

  // Results
  type QResult = { score: number; answer: string };
  type VarResult = { varLabel: string; results: Record<string, QResult> };
  type ModelRun = { label: string; id: string; variants: VarResult[] };
  const allRuns: ModelRun[] = [];

  for (const model of models) {
    console.log(`\n── ${model.label} ──`);
    const varResults: VarResult[] = [];

    for (const variant of variants) {
      process.stdout.write(`  ${variant.label.padEnd(16)} `);

      let answers: Map<string, string>;
      try {
        answers = await queryModel(model.id, apiKey, variant.profile);
      } catch (e) {
        console.log(`FAILED: ${e}`);
        varResults.push({ varLabel: variant.label, results: {} });
        continue;
      }

      const results: Record<string, QResult> = {};
      const marks: string[] = [];
      for (const q of QUESTIONS) {
        const ans = answers.get(q.id) ?? '';
        const s = score(q, ans);
        results[q.id] = { score: s, answer: ans };
        const mark = s === 3 ? '✓' : s === 0 ? '✗' : '~';
        marks.push(`${q.id.replace('Q', '')}=${mark}`);
      }

      console.log(marks.join('  '));
      varResults.push({ varLabel: variant.label, results });
    }

    allRuns.push({ ...model, variants: varResults });
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  let md = `# CHODE Schema Remap — gh-cli Replication\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repo:** gh-cli  \n`;
  md += `**Hypothesis:** Field-label retrieval failure replicates: cobra in @STACK not retrieved by GPT-4o when asked "what CLI framework?"  \n`;
  md += `**Control question:** Qgrpc — grpc is also in @STACK; if retrieved, @STACK IS read, failure is question-label mismatch not @STACK ignorance\n\n`;

  md += `## Variants\n\n`;
  md += `| Variant | Change |\n|---|---|\n`;
  for (const v of variants) {
    md += `| ${v.label} | ${v.description} |\n`;
  }
  md += '\n';

  for (const q of QUESTIONS) {
    md += `## Results — ${q.id} (${q.topic})\n\n`;
    const varCols = variants.map(v => v.label).join(' | ');
    const varSeps = variants.map(() => '---').join(' | ');
    md += `| Model | ${varCols} |\n|---|${varSeps}|\n`;
    for (const run of allRuns) {
      const cells = run.variants.map(vr => {
        const r = vr.results[q.id];
        if (!r) return '—';
        return r.score === 3 ? '3 ✓' : r.score === 0 ? '0 ✗' : `${r.score}~`;
      }).join(' | ');
      md += `| ${run.label} | ${cells} |\n`;
    }
    md += '\n';
  }

  md += `## Raw Answers\n\n`;
  for (const run of allRuns) {
    md += `### ${run.label}\n\n`;
    for (const vr of run.variants) {
      md += `**${vr.varLabel}**  \n`;
      for (const q of QUESTIONS) {
        const r = vr.results[q.id];
        md += `- ${q.id}: ${r?.answer.replace(/\n/g, ' ').slice(0, 150) ?? 'N/A'}  \n`;
      }
      md += '\n';
    }
  }

  md += `## Analysis\n\n`;
  md += `### Control question (Qgrpc)\n`;
  md += `If grpc (also in @STACK) is retrieved correctly in baseline, it proves models DO read @STACK — the cobra failure (if any) is question-semantic mismatch, not @STACK ignorance.\n\n`;
  md += `### Replication verdict\n`;
  for (const run of allRuns) {
    const baseVar = run.variants.find(v => v.varLabel === 'baseline');
    const cobraBaseline = baseVar?.results['Qcobra']?.score ?? -1;
    const grpcBaseline = baseVar?.results['Qgrpc']?.score ?? -1;
    const fixedBy = run.variants
      .filter(v => v.varLabel !== 'baseline' && (v.results['Qcobra']?.score ?? -1) > cobraBaseline)
      .map(v => v.varLabel);
    md += `- **${run.label}**: cobra baseline=${cobraBaseline === 3 ? '✓' : '✗'}  grpc baseline=${grpcBaseline === 3 ? '✓' : '✗'}`;
    if (fixedBy.length > 0) md += `  → cobra unlocked by: ${fixedBy.join(', ')}`;
    md += '\n';
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `schema-remap-ghcli-${date}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  // Console summary
  console.log('\n── Summary ──────────────────────────────────────────────────────────');
  console.log(`${'Model'.padEnd(16)} ${'Variant'.padEnd(16)} cobra testscript grpc(ctrl)`);
  console.log('─'.repeat(60));
  for (const run of allRuns) {
    for (const vr of run.variants) {
      const mark = (qid: string) => {
        const s = vr.results[qid]?.score;
        return s === 3 ? '✓' : s === 0 ? '✗' : s === undefined ? '?' : '~';
      };
      console.log(
        `${run.label.padEnd(16)} ${vr.varLabel.padEnd(16)} ${mark('Qcobra').padEnd(6)} ${mark('Qtestscript').padEnd(10)} ${mark('Qgrpc')}`,
      );
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
