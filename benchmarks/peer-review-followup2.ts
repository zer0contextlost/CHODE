#!/usr/bin/env node
/**
 * CHODE Peer Review Follow-up Round 2
 * Sends each model:
 *   1. The original RESEARCH.md paper
 *   2. Their original peer review criticisms
 *   3. Empirical benchmark answers to those criticisms
 *
 * Usage: node --experimental-strip-types benchmarks/peer-review-followup2.ts
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODELS = [
  { id: 'openai/gpt-4o',                label: 'GPT-4o' },
  { id: 'openai/gpt-4o-mini',           label: 'GPT-4o-mini' },
  { id: 'google/gemini-2.5-flash',      label: 'Gemini 2.5 Flash' },
  { id: 'google/gemini-2.5-pro',        label: 'Gemini 2.5 Pro' },
  { id: 'mistralai/mistral-large-2512', label: 'Mistral Large' },
  { id: 'meta-llama/llama-4-maverick',  label: 'Llama 4 Maverick' },
];

// Empirical answers to the peer review criticisms — shared across all models
const BENCHMARK_ANSWERS = `
## Empirical Responses to Peer Review Criticisms

### Criticism: Strict scoring penalizes semantically correct answers
Semantic equivalence scoring was run across all 165 result files (6,093 answers) with abbreviation expansion, plural/singular normalization, and flag format normalization. Delta: +5 points total. Strict and semantic scores are statistically identical (58% both). Models scoring zero under strict matching are genuinely wrong, not paraphrasing. The 90% CHODE figure is robust to scoring methodology.

### Criticism: Generalization to unseen repositories undemonstrated
Five repositories not in the original benchmark (ruff, zulip, appwrite, pocketbase, caddy) were profiled and tested with 4 stump questions each across GPT-4o and Gemini Flash. Questions derived exclusively from profile content.

| Repo       | Baseline | CHODE | Δ      |
|------------|----------|-------|--------|
| ruff       | 33%      | 100%  | +67pp  |
| zulip      | 4%       | 100%  | +96pp  |
| appwrite   | 17%      | 100%  | +83pp  |
| pocketbase | 0%       | 88%   | +88pp  |
| caddy      | 0%       | 75%   | +75pp  |
| Overall    | 11%      | 93%   | +82pp  |

93% on 5 previously unseen repos matches the original 90% figure. No overfitting detected.

### Criticism: Context position effects untested
Profile placed at START vs END across 3 repos × 2 models (GPT-4o, Gemini Flash). ruff improved with END (+1, +4), caddy degraded (-3, -1), gitea tied at 100% both positions. Net delta: +1 across 6 matchups. No strong recency bias. Standard practice (profile at start) is adequate.

### Criticism: Multi-repo concatenation may cause cross-contamination
Caddy (Go), ruff (Rust), zulip (Python) profiles concatenated (~934 tokens). 6 attribution questions across GPT-4o and Gemini Flash. Both models: 6/6. Zero interference cases. Result extended to all 13 available profiles (~4,636 tokens) — still zero interference.

### Criticism: Profile scalability limits unquantified
Three tiers tested — 3 profiles (~933 tokens), 5 profiles (~1,603 tokens, including near-identical Python pair zulip + fastapi), and 13 profiles (~4,636 tokens, all available profiles).

| Tier               | Profiles | Tokens  | GPT-4o | Gemini Flash | Interference |
|--------------------|----------|---------|--------|--------------|--------------|
| Tier 1             | 3        | ~933    | 5/5    | 5/5          | 0            |
| Tier 2             | 5        | ~1,603  | 6/6    | 6/6          | 0            |
| Tier 3 (max)       | 13       | ~4,636  | 6/6    | 6/6          | 0            |

Zero interference at maximum stress including near-identical Python pair.

### Criticism: Density collapse hypothesis underexplored
Four density levels of Gitea profile tested across GPT-4o and Gemini Flash with 4 stump questions:

| Level              | Tokens  | GPT-4o | Gemini Flash |
|--------------------|---------|--------|--------------|
| Minimal (DNA only) | ~121    | 25%    | 25%          |
| Standard (default) | ~509    | 100%   | 100%         |
| Verbose            | ~878    | 100%   | 100%         |
| Maximum (--full)   | ~1,847  | 100%   | 100%         |

Sharp step function at ~509 tokens. Adding tokens beyond Standard provides zero retrieval benefit. Default profile is the minimum sufficient representation.

### Criticism: Adversarial/misleading queries untested
10 adversarial questions across 5 types (leading, multi-hop, negation, ambiguous, plausible-wrong) across caddy/ruff/zulip profiles. Both GPT-4o and Gemini Flash tested with and without profile.

| Type               | CHODE | Baseline | Notes                                           |
|--------------------|-------|----------|-------------------------------------------------|
| Leading (×2)       | 2/2   | 2/2      | Both models resist false premises               |
| Multi-hop (×2)     | 1/2   | 1/2      | Shared result; baseline wins on Go test fw      |
| Negation (×2)      | 1/2   | 1/2      | Shared failure — negative inference is hard     |
| Ambiguous (×2)     | 2/2   | 2/2      | Both flag correctly                             |
| Plausible-wrong (×2)| 2/2  | 1/2      | CHODE corrects Redis/nginx false assumptions    |

CHODE 8/10 vs baseline 7/10 (GPT-4o). CHODE 8/10 vs baseline 8/10 (Gemini Flash). Profile does not degrade adversarial robustness. Plausible-wrong is the one category where profile clearly wins.
`.trim();

function buildPrompt(paper: string, priorReview: string, answers: string): string {
  return `${paper}

---

## Your Original Peer Review

You previously reviewed the above paper and raised the following criticisms:

${priorReview}

---

## Empirical Responses

The author ran six new benchmarks directly addressing your criticisms:

${answers}

---

You are the same reviewer. Having now seen the empirical responses to your criticisms, give your updated assessment:

1. **Which criticisms are now resolved?** — Be specific about what the data shows.
2. **Which criticisms remain open?** — What was not addressed or addressed inadequately?
3. **Has your confidence in the core claims changed?** — Specifically: (a) 90% benchmark accuracy, (b) self-profiling degrades below baseline, (c) structure beats volume.
4. **What should the author do before submitting to arXiv?** — Maximum 3 actionable items. No padding.

Be direct. Skip encouragement.`;
}

// Extract each model's section from the peer review file
function extractModelSection(fullReview: string, label: string): string {
  const lines = fullReview.split('\n');
  const startMarker = `## ${label}`;
  const start = lines.findIndex(l => l.trim() === startMarker);
  if (start === -1) return `[No review found for ${label}]`;

  // Find next ## heading or end of file
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;

  // Strip the trailing --- separator
  const section = lines.slice(start + 1, end).join('\n').trim();
  return section.replace(/^---\s*$/m, '').trim();
}

async function queryModel(
  modelId: string,
  label: string,
  apiKey: string,
  prompt: string,
): Promise<{ label: string; response: string; error?: string }> {
  console.log(`  querying ${label}...`);
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/zer0contextlost/CHODE',
        'X-Title': 'CHODE Peer Review Follow-up',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { label, response: '', error: `HTTP ${res.status}: ${err}` };
    }

    const data = await res.json() as {
      choices?: Array<{ message?: { content: string } }>;
      error?: { message: string };
    };

    if (data.error) return { label, response: '', error: data.error.message };
    return { label, response: data.choices?.[0]?.message?.content ?? '' };
  } catch (e) {
    return { label, response: '', error: String(e) };
  }
}

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('OPENROUTER_API_KEY not set'); process.exit(1); }

  const paperPath = resolve(__dirname, '../RESEARCH.md');
  const reviewPath = resolve(__dirname, 'results/peer-review-2026-04-18T02-25-50.md');

  const [paper, fullReview] = await Promise.all([
    readFile(paperPath, 'utf8'),
    readFile(reviewPath, 'utf8'),
  ]);

  console.log('\nCHODE Peer Review Follow-up Round 2 — querying 6 models\n');

  const results = await Promise.all(
    MODELS.map(m => {
      const priorReview = extractModelSection(fullReview, m.label);
      const prompt = buildPrompt(paper, priorReview, BENCHMARK_ANSWERS);
      return queryModel(m.id, m.label, apiKey, prompt);
    })
  );

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `peer-review-followup2-${ts}.md`);

  let md = `# CHODE Peer Review Follow-up Round 2 — ${ts}\n\n`;
  md += `Models: ${MODELS.map(m => m.label).join(', ')}\n\n`;
  md += `Each model received: (1) full RESEARCH.md paper, (2) its own original criticisms, (3) empirical benchmark answers to those criticisms.\n\n---\n\n`;

  for (const r of results) {
    md += `## ${r.label}\n\n`;
    md += r.error ? `**ERROR:** ${r.error}\n\n` : r.response + '\n\n';
    md += '---\n\n';
  }

  await writeFile(outFile, md, 'utf8');
  console.log(`\nSaved: ${outFile}\n`);

  for (const r of results) {
    console.log(`\n${'='.repeat(60)}\n${r.label}\n${'='.repeat(60)}`);
    console.log(r.error ? `ERROR: ${r.error}` : r.response);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
