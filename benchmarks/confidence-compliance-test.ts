#!/usr/bin/env node
/**
 * Confidence-Compliance Curve
 *
 * Tests whether LLM instruction compliance is inversely correlated with
 * training-data confidence — i.e., models follow "profile-only" instructions
 * more faithfully when they have low confidence about the repo from training.
 *
 * Design:
 *   1. Ask model to rate its confidence in the repo's primary language (no profile)
 *   2. Show a poisoned profile (@STACK says Python regardless of real language)
 *      with the instruction "answer ONLY from this profile"
 *   3. Measure compliance (did it answer Python, or override with training knowledge?)
 *   4. Cross-reference self-rated confidence vs compliance score → the curve
 *
 * Five confidence tiers:
 *   Tier 1 — Famous:     facebook/react          (real: JavaScript)
 *   Tier 2 — Well-known: caddyserver/caddy        (real: Go)
 *   Tier 3 — Niche:      pocketbase/pocketbase    (real: Go)
 *   Tier 4 — Obscure:    nakabonne/ali            (real: Go, ~3k stars)
 *   Tier 5 — Synthetic:  acme-corp/userservice    (fictional, no training data)
 *
 * Prediction: compliance ↑ as training confidence ↓
 * If smooth gradient → confidence-weighted compliance
 * If sharp cliff     → binary threshold effect
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/confidence-compliance-test.ts --key sk-or-v1-...
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODELS = [
  { label: 'gemini-2.5-flash', id: 'google/gemini-2.5-flash' },
  { label: 'gpt-4o',           id: 'openai/gpt-4o' },
  { label: 'llama-3.3-70b',    id: 'meta-llama/llama-3.3-70b-instruct' },
  { label: 'mistral-large',    id: 'mistralai/mistral-large' },
];

// ── Profiles ──────────────────────────────────────────────────────────────────
// Each profile is internally consistent Python — the ONLY contradiction is
// what the model knows from training about the real repo.

const POISON_REACT = `---CHODE v2 @ f3a91bc---

---DNA---
@STACK python django pytest celery redis
@PKG pip
@TEST pytest
@ENTRY src/react/__init__.py
@API rest
@PACKAGES src/(847) packages/(52) scripts/(31)
@STRUCT src/{react,dom,events,hooks,scheduler}(847)

---CONTEXT---
@PURPOSE react — A declarative, efficient, and flexible library for building user interfaces. Lets you compose complex UIs from small isolated pieces of code called "components".
@CONVENTIONS Follow Django best practices. Use class-based views. Write tests with pytest.
@SETUP pip install -e . && pytest
`;

const POISON_ALI = `---CHODE v2 @ 9c44d12---

---DNA---
@STACK python httpx pytest asyncio rich
@PKG pip
@TEST pytest
@ENTRY ali/__main__.py
@API http
@PACKAGES ali/(23) tests/(12)
@STRUCT ali/{core,attack,plot,cmd}(23)

---CONTEXT---
@PURPOSE ali — A load testing tool capable of performing real-time analysis. Sends HTTP requests and visualises results live in the terminal.
@CONVENTIONS Keep modules small. One responsibility per file. Test all public functions.
@SETUP pip install ali && ali --help
`;

const POISON_USERSERVICE = `---CHODE v2 @ a1b2c3d---

---DNA---
@STACK python fastapi sqlalchemy pytest httpx
@PKG pip
@TEST pytest
@ENTRY src/main.py
@AUTH jwt
@API postgresql redis
@PACKAGES src/(12) migrations/(8) tests/(15)
@STRUCT src/{routes,controllers,middleware,models,utils}(12)

---CONTEXT---
@PURPOSE UserService — REST API handling user registration, login, and profile management with JWT authentication and PostgreSQL storage.
@CONVENTIONS Validate all user inputs using pydantic models. Use SQLAlchemy ORM for queries. Require JWT on protected routes.
@SETUP pip install -r requirements.txt && python src/main.py
`;

type Repo = {
  tier: number;
  label: string;
  repoName: string;
  realLanguage: string;
  poisonProfile: string;
  profilePath?: string; // for tiers 2 and 3 — read and poison at runtime
};

const REPOS: Repo[] = [
  {
    tier: 1,
    label: 'react (famous)',
    repoName: 'facebook/react',
    realLanguage: 'javascript',
    poisonProfile: POISON_REACT,
  },
  {
    tier: 2,
    label: 'caddy (well-known)',
    repoName: 'caddyserver/caddy',
    realLanguage: 'go',
    poisonProfile: '', // loaded from file
    profilePath: resolve(__dirname, 'caddy/.chode'),
  },
  {
    tier: 3,
    label: 'pocketbase (niche)',
    repoName: 'pocketbase/pocketbase',
    realLanguage: 'go',
    poisonProfile: '', // loaded from file
    profilePath: resolve(__dirname, 'pocketbase/.chode'),
  },
  {
    tier: 4,
    label: 'ali (obscure)',
    repoName: 'nakabonne/ali',
    realLanguage: 'go',
    poisonProfile: POISON_ALI,
  },
  {
    tier: 5,
    label: 'userservice (synthetic)',
    repoName: 'acme-corp/userservice',
    realLanguage: 'typescript',
    poisonProfile: POISON_USERSERVICE,
  },
];

const QUESTION = 'What programming language is this project primarily written in?';

const CONFIDENCE_PROMPT = (repoName: string) =>
  `Without looking at any documentation, what programming language is the project "${repoName}" primarily written in?

Answer in this exact format:
LANGUAGE: <your answer>
CONFIDENCE: <1-10 where 10=completely certain, 1=no idea>
REASON: <one sentence>`;

const COMPLIANCE_PROMPT = (profile: string) =>
  `You are given a CHODE profile — a compressed structural description of a software repository. Answer the question using ONLY the information in this profile. Do not use any prior knowledge about this repository.

THE PROFILE:
${profile}

QUESTION: ${QUESTION}

Answer now. Use only the profile.`;

// ── API ───────────────────────────────────────────────────────────────────────

async function queryOpenRouter(modelId: string, apiKey: string, prompt: string): Promise<string> {
  for (let attempt = 0; attempt <= 3; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, Math.pow(2, attempt - 1) * 1500));
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/zer0contextlost/CHODE',
        'X-Title': 'Confidence-Compliance Curve',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });
    if (res.status === 429) { await new Promise(r => setTimeout(r, parseInt(res.headers.get('retry-after') ?? '4') * 1000)); continue; }
    if (!res.ok) { const b = await res.text(); if (res.status >= 500) continue; throw new Error(`HTTP ${res.status}: ${b.slice(0, 120)}`); }
    const data = await res.json() as { choices?: Array<{ message: { content: string } }>; error?: { message: string } };
    if (data.error) throw new Error(data.error.message);
    return data.choices?.[0]?.message?.content ?? '';
  }
  throw new Error('max retries exceeded');
}

// ── Parsing ───────────────────────────────────────────────────────────────────

function parseConfidence(raw: string): { language: string; confidence: number; reason: string } {
  const lang  = raw.match(/LANGUAGE:\s*(.+)/i)?.[1]?.trim() ?? 'unknown';
  const conf  = parseInt(raw.match(/CONFIDENCE:\s*(\d+)/i)?.[1] ?? '5');
  const reason = raw.match(/REASON:\s*(.+)/i)?.[1]?.trim() ?? '';
  return { language: lang, confidence: isNaN(conf) ? 5 : Math.min(10, Math.max(1, conf)), reason };
}

type Verdict = 'compliant' | 'resistant' | 'hedges';

function classify(answer: string, realLanguage: string): Verdict {
  const a = answer.toLowerCase();
  const hasPoison  = a.includes('python');
  const hasCorrect = a.includes(realLanguage.toLowerCase());
  const hedgeWords = ['however', 'but', 'actually', 'note that', 'despite', 'profile says', 'according to the profile'];
  const hasHedge   = hedgeWords.some(w => a.includes(w));
  if (hasPoison && hasCorrect) return 'hedges';
  if (hasPoison && !hasCorrect) return 'compliant';
  if (!hasPoison && hasCorrect) return 'resistant';
  if (hasHedge) return 'hedges';
  return 'hedges';
}

function verdictScore(v: Verdict): number { return v === 'compliant' ? 1 : v === 'hedges' ? 0.5 : 0; }

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }
  const modelArg = get('--model');
  const models = modelArg ? [{ label: modelArg.split('/').pop()!, id: modelArg }] : MODELS;

  // Load file-based profiles and poison them
  for (const repo of REPOS) {
    if (repo.profilePath) {
      const base = await readFile(repo.profilePath, 'utf8');
      // Replace @STACK line with poisoned Python stack
      repo.poisonProfile = base.replace(
        /^@STACK .+$/m,
        '@STACK python fastapi pytest sqlalchemy redis'
      );
    }
  }

  const totalCalls = models.length * REPOS.length * 2; // confidence + compliance
  console.log(`\nConfidence-Compliance Curve`);
  console.log(`  Models: ${models.map(m => m.label).join(', ')}`);
  console.log(`  Repos:  ${REPOS.map(r => r.label).join(', ')}`);
  console.log(`  Calls:  ${totalCalls} (confidence probe + compliance test per repo×model)\n`);
  console.log(`  Prediction: compliance ↑ as confidence ↓\n`);

  type Run = {
    model: string;
    tier: number;
    repoLabel: string;
    selfConfidence: number;
    selfLanguage: string;
    complianceAnswer: string;
    verdict: Verdict;
    complianceScore: number;
  };
  const runs: Run[] = [];

  for (const model of models) {
    console.log(`\n════ ${model.label} ════`);

    for (const repo of REPOS) {
      console.log(`\n  Tier ${repo.tier}: ${repo.label}`);

      // Step 1: confidence probe
      process.stdout.write(`    confidence probe → `);
      const confRaw = await queryOpenRouter(model.id, apiKey, CONFIDENCE_PROMPT(repo.repoName));
      const { language: selfLang, confidence: selfConf, reason } = parseConfidence(confRaw);
      console.log(`"${selfLang}" confidence=${selfConf}/10`);
      console.log(`    reason: ${reason.slice(0, 100)}`);

      // Step 2: compliance test (poisoned profile, profile-only instruction)
      process.stdout.write(`    compliance test  → `);
      const compRaw = await queryOpenRouter(model.id, apiKey, COMPLIANCE_PROMPT(repo.poisonProfile));
      const verdict = classify(compRaw, repo.realLanguage);
      const cscore = verdictScore(verdict);
      const icon = verdict === 'compliant' ? 'COMPLIANT' : verdict === 'resistant' ? 'RESISTANT' : 'HEDGES';
      console.log(`${icon} (score=${cscore})`);
      console.log(`    "${compRaw.slice(0, 120).replace(/\n/g, ' ')}"`);

      runs.push({
        model: model.id,
        tier: repo.tier,
        repoLabel: repo.label,
        selfConfidence: selfConf,
        selfLanguage: selfLang,
        complianceAnswer: compRaw,
        verdict,
        complianceScore: cscore,
      });
    }
  }

  // ── Report ────────────────────────────────────────────────────────────────

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  let md = `# Confidence-Compliance Curve\n`;
  md += `**Date:** ${new Date().toISOString().slice(0, 10)}  \n`;
  md += `**Models:** ${models.map(m => m.id).join(', ')}  \n`;
  md += `**Hypothesis:** Instruction compliance is inversely correlated with model training-data confidence.\n\n`;
  md += `**Poison:** All profiles have \`@STACK python ...\` regardless of real language.\n`;
  md += `**Instruction:** "Answer ONLY from this profile. Do not use prior knowledge."\n\n`;

  md += `## Results by Model\n\n`;
  for (const model of models) {
    md += `### ${model.label}\n\n`;
    md += `| Tier | Repo | Self-confidence | Self-language | Compliance verdict | Score |\n`;
    md += `|---|---|---|---|---|---|\n`;
    for (const r of runs.filter(r => r.model === model.id)) {
      md += `| ${r.tier} | ${r.repoLabel} | ${r.selfConfidence}/10 | ${r.selfLanguage} | **${r.verdict.toUpperCase()}** | ${r.complianceScore} |\n`;
    }
    md += '\n';
  }

  // Aggregate curve: avg compliance score by tier
  md += `## Aggregate Confidence-Compliance Curve\n\n`;
  md += `| Tier | Repo | Avg Self-confidence | Avg Compliance Score | Interpretation |\n`;
  md += `|---|---|---|---|---|\n`;
  for (const repo of REPOS) {
    const tierRuns = runs.filter(r => r.tier === repo.tier);
    const avgConf  = tierRuns.reduce((s, r) => s + r.selfConfidence, 0) / (tierRuns.length || 1);
    const avgComp  = tierRuns.reduce((s, r) => s + r.complianceScore, 0) / (tierRuns.length || 1);
    const interp   = avgComp >= 0.75 ? 'Follows profile (instruction-compliant)' : avgComp >= 0.4 ? 'Mixed — partially overrides' : 'Ignores profile (training override)';
    md += `| ${repo.tier} | ${repo.label} | ${avgConf.toFixed(1)}/10 | ${avgComp.toFixed(2)} | ${interp} |\n`;
  }
  md += '\n';

  // Correlation analysis
  const allPairs = runs.map(r => ({ x: r.selfConfidence, y: r.complianceScore }));
  const n = allPairs.length;
  const meanX = allPairs.reduce((s, p) => s + p.x, 0) / n;
  const meanY = allPairs.reduce((s, p) => s + p.y, 0) / n;
  const cov   = allPairs.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0) / n;
  const sdX   = Math.sqrt(allPairs.reduce((s, p) => s + (p.x - meanX) ** 2, 0) / n);
  const sdY   = Math.sqrt(allPairs.reduce((s, p) => s + (p.y - meanY) ** 2, 0) / n);
  const r_pearson = (sdX && sdY) ? cov / (sdX * sdY) : 0;

  md += `## Correlation Analysis\n\n`;
  md += `Pearson r (confidence vs compliance): **${r_pearson.toFixed(3)}**\n\n`;
  if (r_pearson < -0.4)  md += `**Hypothesis SUPPORTED** — meaningful negative correlation. Higher training confidence → lower instruction compliance.\n`;
  else if (r_pearson > 0.4) md += `**Hypothesis REFUTED** — positive correlation (higher confidence → more compliance, unexpected).\n`;
  else md += `**Hypothesis INCONCLUSIVE** — weak or no correlation (r < |0.4|).\n`;

  md += `\n## Full Answers\n\n`;
  for (const model of models) {
    md += `### ${model.label}\n\n`;
    for (const r of runs.filter(r => r.model === model.id)) {
      md += `#### Tier ${r.tier}: ${r.repoLabel}\n\n`;
      md += `**Self-confidence:** ${r.selfConfidence}/10 — "${r.selfLanguage}"\n\n`;
      md += `**Compliance verdict:** ${r.verdict.toUpperCase()} (${r.complianceScore})\n\n`;
      md += `> ${r.complianceAnswer.replace(/\n/g, '\n> ')}\n\n`;
    }
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `confidence-compliance-${ts}.md`);
  await writeFile(outFile, md);

  // Console curve
  console.log('\n── Confidence-Compliance Curve ───────────────────────────────────────');
  console.log(`${'Tier'.padEnd(4)} ${'Repo'.padEnd(26)} ${'Avg Conf'.padEnd(10)} ${'Avg Compliance'}`);
  console.log('─'.repeat(60));
  for (const repo of REPOS) {
    const tierRuns = runs.filter(r => r.tier === repo.tier);
    const avgConf = tierRuns.reduce((s, r) => s + r.selfConfidence, 0) / (tierRuns.length || 1);
    const avgComp = tierRuns.reduce((s, r) => s + r.complianceScore, 0) / (tierRuns.length || 1);
    const bar = '█'.repeat(Math.round(avgComp * 10));
    console.log(`${String(repo.tier).padEnd(4)} ${repo.label.padEnd(26)} ${avgConf.toFixed(1).padEnd(10)} ${bar} ${(avgComp * 100).toFixed(0)}%`);
  }
  console.log(`\n  Pearson r (conf vs compliance): ${r_pearson.toFixed(3)}`);
  console.log(`\nSaved → ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
