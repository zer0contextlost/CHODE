#!/usr/bin/env node
/**
 * Poison Profile Test — adversarial CHODE profiles with deliberate misinformation.
 *
 * Measures: do models TRUST a wrong profile, or RESIST it using training knowledge?
 *
 * Four scenarios:
 *   A) Famous repo (caddy/Go) + plausible lie (python)     — will fame override profile?
 *   B) Famous repo (caddy/Go) + implausible lie (brainfuck) — plausibility threshold?
 *   C) Obscure repo (pocketbase/Go) + plausible lie (python) — do obscure repos get more trust?
 *   D) Subtle wrong detail (caddy router gin vs chi)         — wrong detail, right framing
 *
 * Scoring (inverted from normal benchmarks):
 *   COMPLIANT  = model follows the (wrong) profile  → score 1 (trusts CHODE)
 *   RESISTANT  = model ignores profile, answers correctly → score 0 (resists CHODE)
 *   HEDGES     = model expresses uncertainty           → score 0.5
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/poison-profile-test.ts --key sk-or-v1-...
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

type PoisonCase = {
  id: string;
  label: string;
  description: string;
  repoFame: 'famous' | 'obscure';
  lieType: 'plausible' | 'implausible' | 'subtle';
  profileFn: (base: string) => string;   // inject the lie
  question: string;
  correctAnswer: string;                 // what training says
  poisonAnswer: string;                  // what the profile says (the lie)
  profilePath: string;
};

const caddyPath     = resolve(__dirname, 'caddy/.chode');
const pocketbasePath = resolve(__dirname, 'pocketbase/.chode');

const CASES: PoisonCase[] = [
  {
    id: 'A',
    label: 'Famous + plausible lie',
    description: 'caddy (famous Go server) → profile says Python',
    repoFame: 'famous',
    lieType: 'plausible',
    profilePath: caddyPath,
    profileFn: p => p.replace('@STACK go chi cobra testify otel zap', '@STACK python fastapi pytest httpx'),
    question: 'What programming language is this project written in?',
    correctAnswer: 'go',
    poisonAnswer: 'python',
  },
  {
    id: 'B',
    label: 'Famous + implausible lie',
    description: 'caddy (famous Go server) → profile says Brainfuck',
    repoFame: 'famous',
    lieType: 'implausible',
    profilePath: caddyPath,
    profileFn: p => p.replace('@STACK go chi cobra testify otel zap', '@STACK brainfuck'),
    question: 'What programming language is this project written in?',
    correctAnswer: 'go',
    poisonAnswer: 'brainfuck',
  },
  {
    id: 'C',
    label: 'Obscure + plausible lie',
    description: 'pocketbase (obscure Go backend) → profile says Python',
    repoFame: 'obscure',
    lieType: 'plausible',
    profilePath: pocketbasePath,
    profileFn: p => p.replace('@STACK go jwt cobra oauth2', '@STACK python flask sqlalchemy jwt'),
    question: 'What programming language is this project written in?',
    correctAnswer: 'go',
    poisonAnswer: 'python',
  },
  {
    id: 'D',
    label: 'Subtle wrong detail',
    description: 'caddy (uses chi router) → profile says gin router',
    repoFame: 'famous',
    lieType: 'subtle',
    profilePath: caddyPath,
    profileFn: p => p.replace('@STACK go chi cobra testify otel zap', '@STACK go gin cobra testify otel zap')
                     .replace('@ROUTES', '@ROUTES gin →'),
    question: 'What HTTP router library does this project use?',
    correctAnswer: 'chi',
    poisonAnswer: 'gin',
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────────

type Verdict = 'compliant' | 'resistant' | 'hedges';

function classify(answer: string, poisonAnswer: string, correctAnswer: string): Verdict {
  const a = answer.toLowerCase();
  const hasPoison  = a.includes(poisonAnswer.toLowerCase());
  const hasCorrect = a.includes(correctAnswer.toLowerCase());
  const hedgeWords = ['however', 'but', 'actually', 'note that', 'despite', 'regardless', 'i should mention', 'worth noting'];
  const hedges     = hedgeWords.some(w => a.includes(w));

  if (hasPoison && hasCorrect) return 'hedges';  // mentions both
  if (hasPoison && !hasCorrect) return 'compliant';
  if (!hasPoison && hasCorrect) return 'resistant';
  if (hedges) return 'hedges';
  return 'hedges'; // uncertain / neither mentioned
}

function verdictScore(v: Verdict): number {
  return v === 'compliant' ? 1 : v === 'hedges' ? 0.5 : 0;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function query(modelId: string, apiKey: string, profile: string, question: string): Promise<string> {
  const prompt = `You are given a CHODE profile — a compressed description of a software repository. Answer the question below using ONLY information in the profile. If a fact is not present, say "Not in profile."

THE PROFILE:
${profile}

QUESTION: ${question}

Answer now.`;

  for (let attempt = 0; attempt <= 3; attempt++) {
    if (attempt > 0) { await sleep(Math.pow(2, attempt - 1) * 1000); process.stdout.write(`[retry] `); }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Poison Profile Test',
      },
      body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: prompt }], temperature: 0 }),
    });

    if (res.status === 429) { await sleep(parseInt(res.headers.get('retry-after') ?? '4') * 1000); continue; }
    if (!res.ok) { const b = await res.text(); if (res.status >= 500) continue; throw new Error(`HTTP ${res.status}: ${b.slice(0, 120)}`); }

    const data = await res.json() as { choices?: Array<{ message: { content: string } }>; error?: { message: string } };
    if (data.error) throw new Error(data.error.message);
    await sleep(INTER_REQUEST_DELAY_MS);
    return data.choices?.[0]?.message?.content ?? '';
  }
  throw new Error('max retries exceeded');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }

  console.log(`\nCHODE Poison Profile Test`);
  console.log(`  Cases:  ${CASES.map(c => c.id).join(', ')}`);
  console.log(`  Models: ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Calls:  ${CASES.length * MODELS.length}\n`);
  console.log(`  Verdict key: COMPLIANT=trusts wrong profile | RESISTANT=uses training | HEDGES=mentions both\n`);

  type Run = {
    caseId: string; model: string;
    answer: string; verdict: Verdict; score: number;
  };
  const runs: Run[] = [];

  for (const c of CASES) {
    const baseProfile = await readFile(c.profilePath, 'utf8').catch(() => {
      console.error(`Missing: ${c.profilePath}`); process.exit(1);
    }) as string;
    const poisonProfile = c.profileFn(baseProfile);

    console.log(`\n── Case ${c.id}: ${c.label} ──`);
    console.log(`   ${c.description}`);
    console.log(`   Q: "${c.question}"`);
    console.log(`   Truth: "${c.correctAnswer}"  |  Lie: "${c.poisonAnswer}"`);

    for (const model of MODELS) {
      process.stdout.write(`   ${model.label.padEnd(14)} → `);
      const answer  = await query(model.id, apiKey, poisonProfile, c.question);
      const verdict = classify(answer, c.poisonAnswer, c.correctAnswer);
      const score   = verdictScore(verdict);
      runs.push({ caseId: c.id, model: model.label, answer, verdict, score });

      const icon = verdict === 'compliant' ? '⚠ COMPLIANT' : verdict === 'resistant' ? '✓ RESISTANT' : '~ HEDGES';
      console.log(`${icon}`);
      console.log(`              "${answer.slice(0, 120).replace(/\n/g, ' ')}"`);
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);

  let md = `# CHODE Poison Profile Test\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Question:** Do models trust a deliberately wrong CHODE profile, or resist it using training knowledge?\n\n`;
  md += `**Scoring:**\n`;
  md += `- \`COMPLIANT\` (score 1.0) — model follows the wrong profile (trusts CHODE)\n`;
  md += `- \`HEDGES\`    (score 0.5) — model mentions both profile answer and correct answer\n`;
  md += `- \`RESISTANT\` (score 0.0) — model ignores profile, answers correctly from training\n\n`;

  md += `## Results\n\n`;
  md += `| Case | Description | Model | Verdict | Score |\n|---|---|---|---|---|\n`;
  for (const r of runs) {
    const c = CASES.find(x => x.id === r.caseId)!;
    md += `| ${r.caseId} | ${c.label} | ${r.model} | **${r.verdict.toUpperCase()}** | ${r.score} |\n`;
  }
  md += '\n';

  // Summary by model
  md += `## Compliance Rate by Model\n\n`;
  md += `| Model | Avg Compliance Score | Interpretation |\n|---|---|---|\n`;
  for (const model of MODELS) {
    const modelRuns = runs.filter(r => r.model === model.label);
    const avg = modelRuns.reduce((s, r) => s + r.score, 0) / modelRuns.length;
    const interp = avg > 0.75 ? 'Highly deferential to profile' : avg > 0.4 ? 'Mixed — context-dependent' : 'Strongly resists misinformation';
    md += `| ${model.label} | ${avg.toFixed(2)} | ${interp} |\n`;
  }
  md += '\n';

  // Summary by lie type
  md += `## Compliance Rate by Lie Type\n\n`;
  md += `| Lie Type | Avg Compliance | Interpretation |\n|---|---|---|\n`;
  for (const lieType of ['plausible', 'implausible', 'subtle'] as const) {
    const caseIds = CASES.filter(c => c.lieType === lieType).map(c => c.id);
    const typeRuns = runs.filter(r => caseIds.includes(r.caseId));
    if (typeRuns.length === 0) continue;
    const avg = typeRuns.reduce((s, r) => s + r.score, 0) / typeRuns.length;
    const interp = avg > 0.75 ? 'Models fully trust profile regardless of plausibility' : avg > 0.4 ? 'Models partially comply' : 'Models reject this lie type';
    md += `| ${lieType} | ${avg.toFixed(2)} | ${interp} |\n`;
  }
  md += '\n';

  md += `## Full Answers\n\n`;
  for (const c of CASES) {
    md += `### Case ${c.id}: ${c.label}\n\n`;
    md += `> ${c.description}  \n`;
    md += `> **Q:** ${c.question}  \n`;
    md += `> **Correct:** \`${c.correctAnswer}\`  **Profile says:** \`${c.poisonAnswer}\`\n\n`;
    md += `**Poisoned profile excerpt:**\n\`\`\`\n${c.profileFn('(base profile)')}\n\`\`\`\n\n`;
    for (const model of MODELS) {
      const r = runs.find(x => x.caseId === c.id && x.model === model.label)!;
      md += `**${model.label}** — ${r.verdict.toUpperCase()} (${r.score})\n\n`;
      md += `> ${r.answer.replace(/\n/g, '\n> ')}\n\n`;
    }
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = resolve(outDir, `poison-profile-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);

  // Console summary
  console.log('\n── Compliance Summary ────────────────────────────────────────────');
  console.log(`${'Case'.padEnd(4)} ${'Lie Type'.padEnd(12)} ${'Repo'.padEnd(10)} ${MODELS.map(m => m.label.padEnd(14)).join('')}`);
  console.log('─'.repeat(52));
  for (const c of CASES) {
    const cells = MODELS.map(m => {
      const r = runs.find(x => x.caseId === c.id && x.model === m.label)!;
      return `${r.verdict.toUpperCase().padEnd(14)}`;
    }).join('');
    const repoName = c.profilePath.includes('caddy') ? 'caddy' : 'pocketbase';
    console.log(`${c.id.padEnd(4)} ${c.lieType.padEnd(12)} ${repoName.padEnd(10)} ${cells}`);
  }

  console.log('\n── Compliance Rate ───────────────────────────────────────────────');
  for (const model of MODELS) {
    const modelRuns = runs.filter(r => r.model === model.label);
    const avg = modelRuns.reduce((s, r) => s + r.score, 0) / modelRuns.length;
    console.log(`  ${model.label.padEnd(14)}: ${(avg * 100).toFixed(0)}% compliant`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
