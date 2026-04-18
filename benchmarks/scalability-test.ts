#!/usr/bin/env node
/**
 * Scalability stress-test — multi-repo attribution with many profiles in context
 *
 * Tests whether attribution accuracy degrades as more CHODE profiles are loaded
 * into a single context window. Includes a near-identical stress scenario using
 * zulip and fastapi (both Python web frameworks) that the model must distinguish.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/scalability-test.ts --key sk-or-v1-...
 *
 * Output: benchmarks/results/scalability-test-[timestamp].md
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTER_REQUEST_DELAY_MS = 2000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODELS = [
  { label: 'gpt-4o',       id: 'openai/gpt-4o' },
  { label: 'gemini-flash', id: 'google/gemini-2.5-flash' },
];

// ── Profile registry ──────────────────────────────────────────────────────────
// Each entry: which directory contains it, ground-truth facts for questions.
// Ground truth derived by reading the actual .chode files.

type ProfileMeta = {
  name: string;
  dir: 'profiles' | 'samples';
  // Canonical facts used to build questions + score answers
  primaryLanguage: string;           // main language the tool is written in
  secondaryLanguages?: string[];     // other notable languages in the stack
  purpose: string;                   // one-line purpose (for prompt context)
  notableFramework?: string;         // key framework / library (for questions)
  hostingModel?: string;             // e.g. "self-hosted", "BaaS", "CLI tool"
};

const ALL_PROFILES: ProfileMeta[] = [
  // ── profiles/ directory ────────────────────────────────────────────────────
  {
    name: 'caddy',
    dir: 'profiles',
    primaryLanguage: 'go',
    purpose: 'production-grade HTTPS server and reverse proxy',
    notableFramework: 'chi',
  },
  {
    name: 'ruff',
    dir: 'profiles',
    primaryLanguage: 'rust',
    secondaryLanguages: ['python'],
    purpose: 'extremely fast Python linter and code formatter written in Rust',
    notableFramework: 'cargo',
  },
  {
    name: 'zulip',
    dir: 'profiles',
    primaryLanguage: 'python',
    secondaryLanguages: ['typescript'],
    purpose: 'open-source organized team chat with topic-based threading',
    notableFramework: 'django',   // implied by zerver structure / Python web
  },
  {
    name: 'appwrite',
    dir: 'profiles',
    primaryLanguage: 'php',
    secondaryLanguages: ['typescript'],
    purpose: 'open-source all-in-one backend development platform',
    notableFramework: 'phpunit',
  },
  {
    name: 'dagger',
    dir: 'profiles',
    primaryLanguage: 'go',
    secondaryLanguages: ['python', 'typescript'],
    purpose: 'programmable CI/CD engine using containerized pipelines',
    notableFramework: 'buildkit',
  },
  {
    name: 'ladybird',
    dir: 'profiles',
    primaryLanguage: 'cpp',        // C++ listed as @STACK rust cpp — primary is cpp
    secondaryLanguages: ['rust'],
    purpose: 'independent web browser with a novel engine',
    notableFramework: 'cargo',
  },
  {
    name: 'mermaid',
    dir: 'profiles',
    primaryLanguage: 'typescript',
    secondaryLanguages: [],
    purpose: 'JavaScript/TypeScript diagramming tool using Markdown-inspired text definitions',
    notableFramework: 'vite',
  },
  {
    name: 'moondream',
    dir: 'profiles',
    primaryLanguage: 'python',
    purpose: 'highly efficient open-source vision language model',
  },
  {
    name: 'pocketbase',
    dir: 'profiles',
    primaryLanguage: 'go',
    purpose: 'self-contained open-source backend/BaaS in a single binary',
    notableFramework: 'jwt',
  },
  // ── samples/ directory ────────────────────────────────────────────────────
  {
    name: 'fastapi',
    dir: 'samples',
    primaryLanguage: 'python',
    secondaryLanguages: [],
    purpose: 'high-performance Python web framework for building APIs using type hints',
    notableFramework: 'starlette',
  },
  {
    name: 'gh-cli',
    dir: 'samples',
    primaryLanguage: 'go',
    purpose: 'GitHub on the command line — pull requests, issues, and GitHub concepts in the terminal',
    notableFramework: 'cobra',
  },
  {
    name: 'gitea',
    dir: 'samples',
    primaryLanguage: 'go',
    secondaryLanguages: ['typescript', 'python'],
    purpose: 'self-hosted Git service — easiest, fastest way to set up your own Git server',
    notableFramework: 'chi',
  },
  {
    name: 'ripgrep',
    dir: 'samples',
    primaryLanguage: 'rust',
    purpose: 'extremely fast line-oriented regex search tool',
    notableFramework: 'cargo',
  },
];

// ── Tier definitions ──────────────────────────────────────────────────────────
// Tier 1: 3 profiles — baseline (mirrors multi-repo-test.ts)
// Tier 2: 5 profiles — medium load, includes near-identical pair (zulip + fastapi)
// Tier 3: all available profiles (~9-10) — maximum stress

// Near-identical pair: zulip and fastapi are both Python web projects.
// They MUST be in the same tier to stress the interference detection.

type TierDef = {
  label: string;
  profileNames: string[];   // order matters — determines position in context
  description: string;
};

const TIERS: TierDef[] = [
  {
    label: 'Tier 1 (3 profiles)',
    profileNames: ['caddy', 'ruff', 'zulip'],
    description: 'Baseline — 3 distinct-language repos (Go, Rust, Python)',
  },
  {
    label: 'Tier 2 (5 profiles)',
    // Deliberately includes zulip AND fastapi — both Python web, near-identical domain
    profileNames: ['caddy', 'ruff', 'zulip', 'fastapi', 'mermaid'],
    description: 'Medium load — includes near-identical Python web pair (zulip + fastapi)',
  },
  {
    label: 'Tier 3 (all profiles)',
    profileNames: ALL_PROFILES.map(p => p.name),
    description: 'Maximum stress — all available profiles in one context window',
  },
];

// ── Question generation ───────────────────────────────────────────────────────
// For each tier we generate 6 questions: 3 per-repo attribution + 3 reverse attribution.
// Questions are selected to:
//   a) Cover diverse repos in the tier
//   b) Always include the near-identical pair (zulip/fastapi) when both are present
//   c) Vary what attribute is asked about (language, framework, purpose)

type Question = {
  id: string;
  text: string;
  must: string[];           // all must appear in answer (case-insensitive) for score=1
  good?: string[];          // optional — strengthen a correct answer, no penalty for absence
  note: string;             // human-readable explanation of what's being tested
  isNearIdentical?: boolean; // true when this Q tests the zulip vs fastapi distinction
};

function buildQuestions(tierDef: TierDef): Question[] {
  const names = tierDef.profileNames;
  const profiles = names.map(n => ALL_PROFILES.find(p => p.name === n)!);
  const hasZulip = names.includes('zulip');
  const hasFastapi = names.includes('fastapi');
  const nearIdStress = hasZulip && hasFastapi;

  const questions: Question[] = [];

  // ── Q1: per-repo, language of first non-Python repo ───────────────────────
  const goRepo = profiles.find(p => p.primaryLanguage === 'go');
  if (goRepo) {
    questions.push({
      id: 'Q1',
      text: `In the ${goRepo.name} repository, what is the primary programming language?`,
      must: ['go'],
      note: `${goRepo.name} → Go`,
    });
  }

  // ── Q2: per-repo, language of Rust repo ──────────────────────────────────
  const rustRepo = profiles.find(p => p.primaryLanguage === 'rust');
  if (rustRepo) {
    questions.push({
      id: 'Q2',
      text: `In the ${rustRepo.name} repository, what language is the tool itself written in?`,
      must: ['rust'],
      note: `${rustRepo.name} → Rust`,
    });
  }

  // ── Q3: per-repo, near-identical stress OR third distinct language ────────
  if (nearIdStress) {
    // Ask about zulip's purpose to distinguish it from fastapi
    questions.push({
      id: 'Q3',
      text: `In the zulip repository, what is the primary use case — is it a web framework for building APIs or a team chat application?`,
      must: ['chat'],
      good: ['team', 'messaging', 'topic'],
      note: 'zulip → team chat (NOT a web API framework like fastapi)',
      isNearIdentical: true,
    });
  } else {
    const pythonRepo = profiles.find(p => p.primaryLanguage === 'python');
    if (pythonRepo) {
      questions.push({
        id: 'Q3',
        text: `In the ${pythonRepo.name} repository, what is the primary backend language?`,
        must: ['python'],
        note: `${pythonRepo.name} → Python`,
      });
    }
  }

  // ── Q4: reverse attribution — which repo uses Go ─────────────────────────
  const goRepos = profiles.filter(p => p.primaryLanguage === 'go').map(p => p.name);
  const allNamesList = names.join(', ');
  if (goRepos.length > 0) {
    questions.push({
      id: 'Q4',
      text: `Which of the repositories in context (${allNamesList}) uses Go as its primary language? List all that apply.`,
      must: [goRepos[0]!],   // must name at least one correct Go repo
      good: goRepos.slice(1),
      note: `Go → ${goRepos.join(' + ')}`,
    });
  }

  // ── Q5: near-identical stress — reverse attribution ───────────────────────
  if (nearIdStress) {
    questions.push({
      id: 'Q5',
      text: `Of the repositories in context (${allNamesList}), which one is a Python web framework for building REST APIs (not a chat application)?`,
      must: ['fastapi'],
      good: ['starlette', 'type hint'],
      note: 'API framework → fastapi (not zulip)',
      isNearIdentical: true,
    });
  } else {
    // Use a framework-level reverse question instead
    const rustRepo2 = profiles.find(p => p.primaryLanguage === 'rust');
    if (rustRepo2) {
      questions.push({
        id: 'Q5',
        text: `Which repository in context (${allNamesList}) is written in Rust?`,
        must: [rustRepo2.name],
        note: `Rust → ${rustRepo2.name}`,
      });
    }
  }

  // ── Q6: near-identical stress — distinguish framework ────────────────────
  if (nearIdStress) {
    questions.push({
      id: 'Q6',
      text: `Of zulip and fastapi, which one uses Starlette as a core dependency?`,
      must: ['fastapi'],
      good: ['starlette'],
      note: 'starlette → fastapi (not zulip, which is Django-based)',
      isNearIdentical: true,
    });
  } else {
    // Sixth question: a purpose / description reverse question
    const phpRepo = profiles.find(p => p.primaryLanguage === 'php');
    if (phpRepo) {
      questions.push({
        id: 'Q6',
        text: `Which repository in context (${allNamesList}) is written primarily in PHP?`,
        must: [phpRepo.name],
        note: `PHP → ${phpRepo.name}`,
      });
    } else {
      const tsRepo = profiles.find(p => p.primaryLanguage === 'typescript');
      if (tsRepo) {
        questions.push({
          id: 'Q6',
          text: `Which repository in context (${allNamesList}) is a TypeScript/JavaScript project?`,
          must: [tsRepo.name],
          note: `TypeScript → ${tsRepo.name}`,
        });
      }
    }
  }

  return questions;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function score(q: Question, answer: string): 0 | 1 {
  const a = answer.toLowerCase();
  const refusals = [
    'not in profile', 'not mentioned', 'not specified',
    'cannot determine', 'no information', "don't know", 'unclear',
  ];
  if (refusals.some(p => a.includes(p))) return 0;
  return q.must.every(t => a.includes(t.toLowerCase())) ? 1 : 0;
}

// ── Interference detection ────────────────────────────────────────────────────
// Flags cases where the model names the WRONG repo in its answer.
// For near-identical questions we look specifically for the wrong name being used.

function detectInterference(q: Question, answer: string, allNamesInTier: string[]): string | null {
  const a = answer.toLowerCase();
  const s = score(q, answer);

  if (q.isNearIdentical) {
    const pair = ['zulip', 'fastapi'];
    const correct = q.must[0]!.toLowerCase();
    const wrong = pair.find(n => n !== correct);
    if (wrong && a.includes(wrong) && s === 0) {
      return `near-identical confusion: said "${wrong}" instead of "${correct}"`;
    }
    return null;
  }

  // For per-repo questions: check if any other repo name appears prominently when wrong
  const askedAbout = q.text.match(/\b(caddy|ruff|zulip|fastapi|appwrite|dagger|ladybird|mermaid|moondream|pocketbase|gh-cli|gitea|ripgrep)\b/i)?.[1]?.toLowerCase();
  if (!askedAbout) return null;

  const wrongMentioned = allNamesInTier
    .map(n => n.toLowerCase())
    .filter(n => n !== askedAbout && a.includes(n));

  if (wrongMentioned.length > 0 && s === 0) {
    return `attributed to wrong repo: mentioned [${wrongMentioned.join(', ')}] instead of ${askedAbout}`;
  }
  return null;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function loadProfile(meta: ProfileMeta): Promise<string> {
  const base = meta.dir === 'profiles' ? 'profiles' : '../samples';
  const p = resolve(__dirname, base, `${meta.name}.chode`);
  const content = await readFile(p, 'utf8').catch(() => {
    console.error(`Cannot read profile: ${p}`);
    process.exit(1);
  }) as string;
  return content;
}

async function queryModel(
  modelId: string,
  apiKey: string,
  combinedContext: string,
  questions: Question[],
): Promise<Map<string, string>> {
  const qList = questions.map(q => `${q.id}: ${q.text}`).join('\n');

  const prompt = `You are given CHODE profiles — compressed descriptions of software repositories. Each profile is clearly labelled with the repository name. Answer the questions below using ONLY the information in these profiles. Do not rely on outside knowledge.

Format: write the question label (Q1, Q2, etc.) on its own line, then your answer on the next line.

═══════════ PROFILES ═══════════
${combinedContext}
════════════════════════════════

QUESTIONS:
${qList}

Answer all ${questions.length} questions now.`;

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
        'X-Title': 'CHODE Scalability Stress Test',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const wait = parseInt(res.headers.get('retry-after') ?? '5') * 1000;
      process.stdout.write(`[rate-limited, waiting ${wait / 1000}s] `);
      await sleep(wait);
      lastError = new Error('rate limited');
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`HTTP ${res.status}: ${body.slice(0, 180)}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    if (data.error) throw new Error(data.error.message);

    const content = data.choices?.[0]?.message?.content ?? '';
    await sleep(INTER_REQUEST_DELAY_MS);
    return parseAnswers(content, questions.length);
  }
  throw lastError;
}

function parseAnswers(raw: string, questionCount: number): Map<string, string> {
  const answers = new Map<string, string>();
  const blocks = raw.split(/\n(?=Q\d{1,2}[:.)\s])/);
  for (const block of blocks) {
    const m = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!m) continue;
    const num = parseInt(m[1]!);
    if (num < 1 || num > questionCount) continue;
    const body = block.replace(/^Q\d{1,2}[:.)\s]+/, '').trim();
    if (body) answers.set(`Q${num}`, body);
  }
  return answers;
}

// ── Tier runner ───────────────────────────────────────────────────────────────

type QuestionResult = {
  score: 0 | 1;
  answer: string;
  interference: string | null;
};

type ModelTierResult = {
  model: string;
  correct: number;
  total: number;
  perQ: Record<string, QuestionResult>;
};

type TierResult = {
  tier: TierDef;
  questions: Question[];
  profileCount: number;
  tokenCount: number;
  combinedContext: string;
  results: ModelTierResult[];
};

async function runTier(
  tierDef: TierDef,
  profileContents: Map<string, string>,
  apiKey: string,
): Promise<TierResult> {
  const questions = buildQuestions(tierDef);

  const combinedContext = tierDef.profileNames
    .map(name => {
      const content = profileContents.get(name) ?? `[profile ${name} not available]`;
      return `--- REPOSITORY: ${name.toUpperCase()} ---\n${content.trim()}\n--- END ${name.toUpperCase()} ---`;
    })
    .join('\n\n');

  const tokenCount = Math.ceil(combinedContext.length / 4);

  console.log(`\n  ${tierDef.label} — ${tierDef.description}`);
  console.log(`  Profiles: ${tierDef.profileNames.join(', ')}`);
  console.log(`  Context: ~${tokenCount} tokens | Questions: ${questions.length}`);

  const tierResults: ModelTierResult[] = [];

  for (const model of MODELS) {
    process.stdout.write(`    ${model.label.padEnd(14)} querying… `);

    const answers = await queryModel(model.id, apiKey, combinedContext, questions);

    let correct = 0;
    const perQ: ModelTierResult['perQ'] = {};

    for (const q of questions) {
      const answer = answers.get(q.id.replace('Q', '')) ?? answers.get(q.id) ?? '';
      const s = score(q, answer);
      const interference = detectInterference(q, answer, tierDef.profileNames);
      correct += s;
      perQ[q.id] = { score: s, answer, interference };
    }

    const intCount = Object.values(perQ).filter(v => v.interference !== null).length;
    console.log(`${correct}/${questions.length}  (${intCount} interference)`);

    tierResults.push({ model: model.label, correct, total: questions.length, perQ });
  }

  return {
    tier: tierDef,
    questions,
    profileCount: tierDef.profileNames.length,
    tokenCount,
    combinedContext,
    results: tierResults,
  };
}

// ── Markdown report ───────────────────────────────────────────────────────────

function buildReport(tierResults: TierResult[], date: string): string {
  let md = `# CHODE Scalability Stress Test\n\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Models:** ${MODELS.map(m => `${m.label} (\`${m.id}\`)`).join(', ')}  \n`;
  md += `**Tiers:** 3 (${TIERS.map(t => `${t.profileNames.length} profiles`).join(', ')})  \n`;
  md += `**Questions per tier:** 6 (3 per-repo + 3 reverse attribution)  \n`;
  md += `**Near-identical stress:** zulip vs fastapi (both Python web projects) in Tiers 2 and 3\n\n`;

  md += `## What This Tests\n\n`;
  md += `Attribution accuracy is measured across three tiers of profile count. `;
  md += `As more profiles are packed into the context window, models must work harder `;
  md += `to keep repo-specific facts correctly attributed. `;
  md += `The near-identical stress scenario (zulip and fastapi both being Python web projects) `;
  md += `is the hardest case: the model must use fine-grained semantic signals — `;
  md += `"team chat with topic threading" vs "API framework using type hints and Starlette" — `;
  md += `rather than just language labels.\n\n`;

  // ── Summary table ──────────────────────────────────────────────────────────
  md += `## Scalability Summary\n\n`;
  md += `| Tier | Profiles | Token Count | ${MODELS.map(m => `${m.label} Score`).join(' | ')} | ${MODELS.map(m => `${m.label} Interference`).join(' | ')} |\n`;
  md += `|---|---|---|${MODELS.map(() => '---').join('|')}|${MODELS.map(() => '---').join('|')}|\n`;

  for (const tr of tierResults) {
    const modelCols = MODELS.map(m => {
      const r = tr.results.find(r => r.model === m.label);
      return r ? `**${r.correct}/${r.total}**` : '—';
    }).join(' | ');
    const intCols = MODELS.map(m => {
      const r = tr.results.find(r => r.model === m.label);
      if (!r) return '—';
      const n = Object.values(r.perQ).filter(v => v.interference !== null).length;
      return `${n}`;
    }).join(' | ');
    md += `| ${tr.tier.label} | ${tr.profileCount} | ~${tr.tokenCount} | ${modelCols} | ${intCols} |\n`;
  }
  md += '\n';

  // ── Degradation analysis ───────────────────────────────────────────────────
  md += `## Accuracy vs Profile Count\n\n`;
  for (const model of MODELS) {
    md += `### ${model.label}\n\n`;
    md += `| Tier | Profiles | Score | Accuracy |\n|---|---|---|---|\n`;
    for (const tr of tierResults) {
      const r = tr.results.find(r => r.model === model.label);
      if (!r) continue;
      const pct = Math.round((r.correct / r.total) * 100);
      const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
      md += `| ${tr.tier.label} | ${tr.profileCount} | ${r.correct}/${r.total} | ${pct}% ${bar} |\n`;
    }
    md += '\n';

    // Compute degradation
    const scores = tierResults.map(tr => {
      const r = tr.results.find(r => r.model === model.label);
      return r ? r.correct / r.total : 0;
    });
    if (scores.length >= 2) {
      const degradation = ((scores[0]! - scores[scores.length - 1]!) * 100).toFixed(1);
      const direction = parseFloat(degradation) > 0 ? 'degraded' : parseFloat(degradation) < 0 ? 'improved' : 'unchanged';
      md += `**Trend:** Accuracy ${direction} by ${Math.abs(parseFloat(degradation))}pp from Tier 1 → Tier 3\n\n`;
    }
  }

  // ── Near-identical interference analysis ──────────────────────────────────
  md += `## Near-Identical Pair Analysis (zulip vs fastapi)\n\n`;
  md += `Both zulip and fastapi are Python web projects. A model that cannot distinguish them `;
  md += `will confuse their purposes and fail near-identical questions.\n\n`;

  for (const tr of tierResults) {
    const hasStress = tr.tier.profileNames.includes('zulip') && tr.tier.profileNames.includes('fastapi');
    if (!hasStress) {
      md += `**${tr.tier.label}:** N/A (fastapi not in context)\n\n`;
      continue;
    }

    md += `**${tr.tier.label}:**\n\n`;
    const niQuestions = tr.questions.filter(q => q.isNearIdentical);
    if (niQuestions.length === 0) {
      md += `No near-identical questions generated for this tier.\n\n`;
      continue;
    }
    md += `| Q | Question | ${MODELS.map(m => m.label).join(' | ')} |\n|---|---|${MODELS.map(() => '---').join('|')}|\n`;
    for (const q of niQuestions) {
      const cells = MODELS.map(m => {
        const r = tr.results.find(r => r.model === m.label);
        const cell = r?.perQ[q.id];
        if (!cell) return '—';
        const mark = cell.score === 1 ? 'PASS' : 'FAIL';
        const intFlag = cell.interference ? ' ⚠' : '';
        return `${mark}${intFlag}`;
      }).join(' | ');
      md += `| ${q.id} | ${q.note} | ${cells} |\n`;
    }
    md += '\n';
  }

  // ── Per-tier details ───────────────────────────────────────────────────────
  md += `## Per-Tier Detailed Results\n\n`;

  for (const tr of tierResults) {
    md += `### ${tr.tier.label}\n\n`;
    md += `**Profiles:** ${tr.tier.profileNames.join(', ')}  \n`;
    md += `**Description:** ${tr.tier.description}  \n`;
    md += `**Context size:** ~${tr.tokenCount} tokens  \n\n`;

    md += `#### Question Breakdown\n\n`;
    md += `| Q | What's Tested | Expected | ${MODELS.map(m => m.label).join(' | ')} |\n`;
    md += `|---|---|---|${MODELS.map(() => '---').join('|')}|\n`;

    for (const q of tr.questions) {
      const niTag = q.isNearIdentical ? ' 🔥' : '';
      const expectedStr = `\`${q.must.join(', ')}\``;
      const modelCols = MODELS.map(m => {
        const r = tr.results.find(r => r.model === m.label);
        const cell = r?.perQ[q.id];
        if (!cell) return '—';
        return cell.score === 1 ? '✓' : '✗';
      }).join(' | ');
      md += `| ${q.id}${niTag} | ${q.note} | ${expectedStr} | ${modelCols} |\n`;
    }
    md += '\n';

    // ── Model answers ────────────────────────────────────────────────────────
    md += `#### Model Answers\n\n`;
    for (const r of tr.results) {
      md += `##### ${r.model}\n\n`;
      for (const q of tr.questions) {
        const cell = r.perQ[q.id];
        if (!cell) continue;
        const mark = cell.score === 1 ? '✓' : '✗';
        const niTag = q.isNearIdentical ? ' 🔥' : '';
        md += `**${q.id}${niTag} ${mark}** — *${q.note}*\n`;
        md += `> ${cell.answer.replace(/\n/g, '\n> ')}\n`;
        if (cell.interference) {
          md += `> ⚠ **Interference:** ${cell.interference}\n`;
        }
        md += '\n';
      }
    }
  }

  // ── Combined contexts ─────────────────────────────────────────────────────
  md += `## Combined Contexts (sent verbatim per tier)\n\n`;
  for (const tr of tierResults) {
    md += `<details>\n<summary>${tr.tier.label} — context</summary>\n\n`;
    md += `\`\`\`\n${tr.combinedContext}\n\`\`\`\n\n</details>\n\n`;
  }

  return md;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };

  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Error: --key <openrouter-api-key> or OPENROUTER_API_KEY env var required');
    process.exit(1);
  }

  console.log('\nCHODE Scalability Stress Test');
  console.log('══════════════════════════════════════════════════════════════');
  console.log(`  Models:  ${MODELS.map(m => m.label).join(', ')}`);
  console.log(`  Tiers:   ${TIERS.length} (${TIERS.map(t => `${t.profileNames.length}`).join(' → ')} profiles)`);
  console.log(`  Near-identical stress: zulip vs fastapi (Tiers 2 & 3)`);
  console.log('══════════════════════════════════════════════════════════════');

  // ── Pre-load all profile files ────────────────────────────────────────────
  const profileContents = new Map<string, string>();
  const allNeededNames = new Set(TIERS.flatMap(t => t.profileNames));

  process.stdout.write('\nLoading profiles… ');
  for (const name of allNeededNames) {
    const meta = ALL_PROFILES.find(p => p.name === name);
    if (!meta) {
      console.error(`\nNo metadata for profile "${name}" — check ALL_PROFILES registry`);
      process.exit(1);
    }
    const content = await loadProfile(meta);
    profileContents.set(name, content);
    process.stdout.write(`${name} `);
  }
  console.log('\nAll profiles loaded.\n');

  // ── Run tiers sequentially ────────────────────────────────────────────────
  const allTierResults: TierResult[] = [];

  for (const tierDef of TIERS) {
    const result = await runTier(tierDef, profileContents, apiKey);
    allTierResults.push(result);
    // Brief pause between tiers to avoid burst rate limiting
    if (tierDef !== TIERS[TIERS.length - 1]) {
      process.stdout.write('  [pause 3s between tiers] ');
      await sleep(3000);
    }
  }

  // ── Console summary ───────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('Scalability Summary');
  console.log('══════════════════════════════════════════════════════════════');

  const headerParts = ['Tier'.padEnd(24), 'Profiles', 'Tokens'.padEnd(8)];
  for (const m of MODELS) headerParts.push(m.label.padEnd(12));
  for (const m of MODELS) headerParts.push(`${m.label} int.`.padEnd(10));
  console.log(headerParts.join('  '));
  console.log('─'.repeat(90));

  for (const tr of allTierResults) {
    const parts = [
      tr.tier.label.padEnd(24),
      String(tr.profileCount).padEnd(8),
      `~${tr.tokenCount}`.padEnd(8),
    ];
    for (const m of MODELS) {
      const r = tr.results.find(r => r.model === m.label);
      parts.push(r ? `${r.correct}/${r.total}`.padEnd(12) : '—'.padEnd(12));
    }
    for (const m of MODELS) {
      const r = tr.results.find(r => r.model === m.label);
      const n = r ? Object.values(r.perQ).filter(v => v.interference !== null).length : 0;
      parts.push(String(n).padEnd(10));
    }
    console.log(parts.join('  '));
  }

  // ── Save report ───────────────────────────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10);
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const md = buildReport(allTierResults, date);

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `scalability-test-${ts}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
