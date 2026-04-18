#!/usr/bin/env node
/**
 * CHODE Peer Review Follow-up Round 3
 *
 * Sends each model:
 *   1. The updated RESEARCH.md (now includes §16.4 item 9 results)
 *   2. Their round-2 follow-up verdict
 *   3. Item 9 empirical results (independent question authorship, 9 repos)
 *
 * Usage: OPENROUTER_API_KEY=sk-or-... node --experimental-strip-types benchmarks/peer-review-followup3.ts
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

// New empirical data since round 2: item 9 executed
const NEW_FINDINGS = `
## New Empirical Data Since Round 2 Review

### Item 9 (Independent Question Authorship) — Now Executed

In round 2, models flagged that §16.4 items 8 and 9 remained unexecuted. Item 9 has now been completed.

**Design:** Three AI models authored stump questions from README content only (never seeing the CHODE profile). A different model then evaluated CHODE vs. baseline on those questions. Round-robin to prevent authorship bias: author ≠ evaluator. 9 repos, 3 model pairs.

| Pair | Repos |
|------|-------|
| GPT-4o authors → Gemini Flash evaluates | appwrite, mermaid, scala3 |
| Gemini Flash authors → Mistral Large evaluates | dagger, pocketbase, gin |
| Mistral Large authors → GPT-4o evaluates | ladybird, ktor, hono |

**Results:**

| Repo | Baseline | CHODE | Δ |
|------|----------|-------|---|
| appwrite | 50% | 0% | -50pp |
| mermaid | 42% | 0% | -42pp |
| scala3 | 92% | 0% | -92pp |
| dagger | 75% | 0% | -75pp |
| pocketbase | 75% | 0% | -75pp |
| gin | 67% | 8% | -59pp |
| ladybird | 58% | 8% | -50pp |
| ktor | 58% | 0% | -58pp |
| hono | 8% | 0% | -8pp |
| **Overall** | **58%** | **2%** | **-56pp** |

**Author's interpretation:** Independently authored questions overwhelmingly target README-level specifics — install commands, port numbers, brew tap paths, license strings, specific file paths — content CHODE deliberately does not extract. CHODE's extraction scope is structural/architectural orientation (stacks, packages, routes, middleware, patterns). The 2% CHODE score vs. 58% baseline reflects the extraction scope boundary, not a general accuracy failure. The paper's 90% figure measures within-scope retrieval; this test measures out-of-scope retrieval. Both measures are legitimate but not comparable.
`.trim();

function buildPrompt(paper: string, round2verdict: string, newFindings: string): string {
  return `${paper}

---

## Your Round 2 Verdict

In the previous round you reviewed empirical responses to your original criticisms and gave this updated assessment:

${round2verdict}

---

## New Empirical Data

Since that round, the following additional experiment has been completed:

${newFindings}

---

You are the same reviewer in round 3. The paper has been updated to include the item 9 results and interpretation.

1. **Does the item 9 finding resolve the authorship bias concern?** — Specifically: does the extraction scope boundary interpretation hold up, or does this finding undermine the paper's core claims?
2. **Do any claims need to be revised?** — Is the paper's framing of 90% accuracy still defensible in light of independently authored questions scoring CHODE 2%?
3. **What remains genuinely open before arXiv submission?** — Maximum 3 items. Be specific and actionable.

Be direct. No padding.`;
}

function extractModelSection(fullReview: string, label: string): string {
  const lines = fullReview.split('\n');
  const startMarker = `## ${label}`;
  const start = lines.findIndex(l => l.trim() === startMarker);
  if (start === -1) return `[No round-2 verdict found for ${label}]`;

  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;

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
        'X-Title': 'CHODE Peer Review Follow-up Round 3',
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

  const paperPath  = resolve(__dirname, '../RESEARCH.md');
  const reviewPath = resolve(__dirname, 'results/peer-review-followup2-2026-04-18T02-52-41.md');

  const [paper, fullReview] = await Promise.all([
    readFile(paperPath, 'utf8'),
    readFile(reviewPath, 'utf8'),
  ]);

  console.log('\nCHODE Peer Review Follow-up Round 3 — querying 6 models\n');
  console.log('Focus: item 9 (independent question authorship) — extraction scope boundary\n');

  const results = await Promise.all(
    MODELS.map(m => {
      const round2verdict = extractModelSection(fullReview, m.label);
      const prompt = buildPrompt(paper, round2verdict, NEW_FINDINGS);
      return queryModel(m.id, m.label, apiKey, prompt);
    })
  );

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `peer-review-followup3-${ts}.md`);

  let md = `# CHODE Peer Review Follow-up Round 3 — ${ts}\n\n`;
  md += `Models: ${MODELS.map(m => m.label).join(', ')}\n\n`;
  md += `Focus: §16.4 item 9 executed — independent question authorship (9 repos, round-robin design).\n\n`;
  md += `Each model received: (1) full updated RESEARCH.md, (2) its own round-2 verdict, (3) item 9 empirical results.\n\n---\n\n`;

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
