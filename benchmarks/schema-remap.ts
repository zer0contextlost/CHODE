#!/usr/bin/env node
/**
 * CHODE Schema Remap Experiment
 *
 * Tests whether renaming/restructuring field labels unlocks model-specific blind spots.
 *
 * Blind spots identified in cap-ablation:
 *   Q2 (chi router): GPT-4o=0, Flash=0, Mistral=3 (finds it in @STACK)
 *   Q8 (305 migrations): Flash=0, Mistral=0, GPT-4o=3 (finds it in @DATA)
 *
 * Variants tested:
 *   baseline  — original gitea.chode (chi in @STACK only, @DATA says "305 files")
 *   chi-routes — chi added to @ROUTES: "@ROUTES chi → routers/ (447 files)"
 *   chi-stack  — chi annotated in @STACK: "@STACK go [chi=router] mysql ..."
 *   data-label — @DATA reworded: "@DATA models/migrations/ (305 migrations)"
 *   combined   — chi-routes + data-label combined
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/schema-remap.ts \
 *     --key sk-or-v1-... [--chode path/to/gitea.chode] [--models "m1,m2"]
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

// Only the two blind-spot questions
const QUESTIONS = [
  {
    id: 'Q2', topic: 'Go HTTP router',
    text: 'What Go HTTP router/mux library does this project use?',
    must: ['chi'], good: [] as string[],
    note: 'stump: experts default to gin/echo',
  },
  {
    id: 'Q8', topic: 'Migration count',
    text: 'How many database migrations does this project have?',
    must: ['305'], good: [] as string[],
    note: 'stump: exact count from @DATA',
  },
];

// ── Variant generator ─────────────────────────────────────────────────────────

type Variant = { label: string; description: string; profile: string };

function buildVariants(baseline: string): Variant[] {
  // chi-routes: add chi to @ROUTES line
  const chiRoutes = baseline.replace(
    /^(@ROUTES\s+)(.+)$/m,
    (_m, field, rest) => `${field}chi → ${rest}`,
  );

  // chi-stack: annotate @STACK with explicit role
  const chiStack = baseline.replace(
    /^(@STACK\s+go\s+)chi(\s+.+)$/m,
    (_m, pre, post) => `${pre}[chi=router]${post}`,
  );

  // data-label: change "305 files" → "305 migrations"
  const dataLabel = baseline.replace(
    /^(@DATA\s+.+)\(305 files\)(.*)$/m,
    (_m, pre, post) => `${pre}(305 migrations)${post}`,
  );

  // combined: chi-routes + data-label
  const combined = chiRoutes.replace(
    /^(@DATA\s+.+)\(305 files\)(.*)$/m,
    (_m, pre, post) => `${pre}(305 migrations)${post}`,
  );

  return [
    { label: 'baseline',   description: 'Original gitea.chode (no changes)',                profile: baseline   },
    { label: 'chi-routes', description: '@ROUTES chi → routers/ (447 files)',               profile: chiRoutes  },
    { label: 'chi-stack',  description: '@STACK go [chi=router] mysql ...',                  profile: chiStack   },
    { label: 'data-label', description: '@DATA models/migrations/ (305 migrations)',         profile: dataLabel  },
    { label: 'combined',   description: 'chi-routes + data-label combined',                  profile: combined   },
  ];
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function score(q: typeof QUESTIONS[number], answer: string): number {
  const a = answer.toLowerCase();
  const hasAll = q.must.every(t => a.includes(t));
  const hasAny = q.must.some(t => a.includes(t));
  if (!hasAny) return 0;
  if (!hasAll) return 1;
  return 3;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function queryModel(modelId: string, apiKey: string, profile: string): Promise<Map<string, string>> {
  const qList = QUESTIONS.map(q => `${q.id}: ${q.text}`).join('\n');
  const prompt = `You are given a CHODE profile — a compressed description of a software repository. Answer the questions below using ONLY information in the profile. If a fact is not present, say "Not in profile."

Format: write the label (Q2, Q8) on its own line, then your answer on the next line.

THE PROFILE:
${profile}

QUESTIONS:
${qList}

Answer Q2 and Q8 now.`;

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
        'X-Title': 'CHODE Schema Remap',
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
  const blocks = raw.split(/\n(?=Q(\d{1,2})[:.)\s])/);
  for (const block of blocks) {
    const m = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!m) continue;
    const num = parseInt(m[1]!);
    const body = block
      .replace(/^Q\d{1,2}[:.)\s]+/, '')
      .replace(/^[A-Z]\d{1,2}[:.]\s*/m, '')
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

  const chodePath = get('--chode') ?? resolve(__dirname, '../samples/gitea.chode');
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

  console.log(`\nCHODE Schema Remap Experiment`);
  console.log(`  Variants: ${variants.length} (${variants.map(v => v.label).join(', ')})`);
  console.log(`  Models:   ${models.map(m => m.label).join(', ')}`);
  console.log(`  Questions: Q2 (chi), Q8 (305 migrations)`);
  console.log(`  API calls: ${totalCalls}\n`);

  console.log('  Variants:');
  for (const v of variants) {
    console.log(`    ${v.label.padEnd(12)} — ${v.description}`);
  }
  console.log();

  // Show diffs
  console.log('  Profile diffs from baseline:');
  for (const v of variants.slice(1)) {
    const baseLines = baseline.split('\n');
    const varLines = v.profile.split('\n');
    for (let i = 0; i < Math.max(baseLines.length, varLines.length); i++) {
      if (baseLines[i] !== varLines[i]) {
        console.log(`    [${v.label}] -${baseLines[i]}`);
        console.log(`    [${v.label}] +${varLines[i]}`);
      }
    }
  }
  console.log();

  // Results: model → variant → { Q2, Q8 }
  type QResult = { score: number; answer: string };
  type VarResult = { varLabel: string; q2: QResult; q8: QResult };
  type ModelRun = { label: string; id: string; variants: VarResult[] };
  const allRuns: ModelRun[] = [];

  for (const model of models) {
    console.log(`\n── ${model.label} ──`);
    const varResults: VarResult[] = [];

    for (const variant of variants) {
      process.stdout.write(`  ${variant.label.padEnd(12)} `);

      let answers: Map<string, string>;
      try {
        answers = await queryModel(model.id, apiKey, variant.profile);
      } catch (e) {
        console.log(`FAILED: ${e}`);
        varResults.push({
          varLabel: variant.label,
          q2: { score: -1, answer: 'ERROR' },
          q8: { score: -1, answer: 'ERROR' },
        });
        continue;
      }

      const q2ans = answers.get('Q2') ?? '';
      const q8ans = answers.get('Q8') ?? '';
      const q2score = score(QUESTIONS[0]!, q2ans);
      const q8score = score(QUESTIONS[1]!, q8ans);

      const q2mark = q2score === 3 ? '✓' : q2score === 0 ? '✗' : '~';
      const q8mark = q8score === 3 ? '✓' : q8score === 0 ? '✗' : '~';

      console.log(`Q2(chi)=${q2mark}  Q8(305)=${q8mark}  | Q2: ${q2ans.slice(0, 50).replace(/\n/g, ' ')}…`);

      varResults.push({
        varLabel: variant.label,
        q2: { score: q2score, answer: q2ans },
        q8: { score: q8score, answer: q8ans },
      });
    }

    allRuns.push({ ...model, variants: varResults });
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  let md = `# CHODE Schema Remap Experiment\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Repo:** gitea  \n`;
  md += `**Blind spots tested:** Q2 (chi router), Q8 (305 migrations)  \n`;
  md += `**Hypothesis:** Model-specific blind spots are field-mapping failures — wrong label → wrong retrieval\n\n`;

  md += `## Variants\n\n`;
  md += `| Variant | Change |\n|---|---|\n`;
  for (const v of variants) {
    md += `| ${v.label} | ${v.description} |\n`;
  }
  md += '\n';

  md += `## Profile Diffs\n\n`;
  md += '```diff\n';
  for (const v of variants.slice(1)) {
    const baseLines = baseline.split('\n');
    const varLines = v.profile.split('\n');
    md += `# ${v.label}\n`;
    for (let i = 0; i < Math.max(baseLines.length, varLines.length); i++) {
      if (baseLines[i] !== varLines[i]) {
        md += `- ${baseLines[i] ?? ''}\n`;
        md += `+ ${varLines[i] ?? ''}\n`;
      }
    }
  }
  md += '```\n\n';

  md += `## Results — Q2 (chi)\n\n`;
  const varCols = variants.map(v => v.label).join(' | ');
  const varSeps = variants.map(() => '---').join(' | ');
  md += `| Model | ${varCols} |\n|---|${varSeps}|\n`;
  for (const run of allRuns) {
    const cells = run.variants.map(vr => {
      const s = vr.q2.score;
      return s === 3 ? '3 ✓' : s === 0 ? '0 ✗' : s === -1 ? 'ERR' : `${s}~`;
    }).join(' | ');
    md += `| ${run.label} | ${cells} |\n`;
  }
  md += '\n';

  md += `## Results — Q8 (305 migrations)\n\n`;
  md += `| Model | ${varCols} |\n|---|${varSeps}|\n`;
  for (const run of allRuns) {
    const cells = run.variants.map(vr => {
      const s = vr.q8.score;
      return s === 3 ? '3 ✓' : s === 0 ? '0 ✗' : s === -1 ? 'ERR' : `${s}~`;
    }).join(' | ');
    md += `| ${run.label} | ${cells} |\n`;
  }
  md += '\n';

  md += `## Raw Answers\n\n`;
  for (const run of allRuns) {
    md += `### ${run.label}\n\n`;
    for (const vr of run.variants) {
      md += `**${vr.varLabel}**  \n`;
      md += `- Q2: ${vr.q2.answer.replace(/\n/g, ' ').slice(0, 200)}  \n`;
      md += `- Q8: ${vr.q8.answer.replace(/\n/g, ' ').slice(0, 200)}  \n\n`;
    }
  }

  md += `## Analysis\n\n`;
  md += `### Predictions\n`;
  md += `- chi-routes should unlock GPT-4o and Flash for Q2 (both attend to @ROUTES over @STACK)\n`;
  md += `- chi-stack may partially help if bracket notation signals router role\n`;
  md += `- data-label should unlock Flash and Mistral for Q8 (reframe count as migration count explicitly)\n`;
  md += `- combined variant should show additive gains\n\n`;

  md += `### Findings\n`;
  const unlocked = (q: 'q2' | 'q8') => {
    const rows: string[] = [];
    for (const run of allRuns) {
      const baseScore = run.variants.find(v => v.varLabel === 'baseline')?.[q].score ?? -1;
      const improvements = run.variants
        .filter(v => v.varLabel !== 'baseline' && v[q].score > baseScore)
        .map(v => `${v.varLabel}(${v[q].score})`);
      if (improvements.length > 0) {
        rows.push(`- ${run.label}: unlocked by ${improvements.join(', ')}`);
      }
    }
    return rows.length > 0 ? rows.join('\n') : '- No models unlocked';
  };
  md += `**Q2 (chi) unlocks:**\n${unlocked('q2')}\n\n`;
  md += `**Q8 (305) unlocks:**\n${unlocked('q8')}\n\n`;

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `schema-remap-${date}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  // Console summary table
  console.log('\n── Summary ─────────────────────────────────────────────────────');
  console.log(`${'Model'.padEnd(16)} ${'Variant'.padEnd(12)} Q2(chi) Q8(305)`);
  console.log('─'.repeat(50));
  for (const run of allRuns) {
    for (const vr of run.variants) {
      const q2 = vr.q2.score === 3 ? '✓' : vr.q2.score === 0 ? '✗' : '~';
      const q8 = vr.q8.score === 3 ? '✓' : vr.q8.score === 0 ? '✗' : '~';
      console.log(`${run.label.padEnd(16)} ${vr.varLabel.padEnd(12)} ${q2.padEnd(8)} ${q8}`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
