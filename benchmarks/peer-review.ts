#!/usr/bin/env node
/**
 * CHODE Peer Review — Query 6 AI models to review RESEARCH.md
 * Usage: OPENROUTER_API_KEY=sk-or-... node --experimental-strip-types benchmarks/peer-review.ts
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

const REVIEW_PROMPT = (paper: string) => `${paper}

---

You are an experienced software engineer and AI tooling researcher. You have just read the full CHODE technical report above.

Give your honest peer review:

1. **Methodology** — Is the benchmark design sound? What are the validity threats?
2. **Claims** — Which findings are well-supported? Which are overstated?
3. **Gaps** — What's missing from the research that weakens the paper?
4. **Strongest finding** — What's the single most compelling result and why?
5. **Recommendations** — What would you tell the author to fix or add before publishing?

Be direct. Skip encouragement. Prioritize signal over completeness.`;

async function queryModel(modelId: string, label: string, apiKey: string, prompt: string): Promise<{ label: string; response: string; error?: string }> {
  console.log(`  querying ${label}...`);
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/zer0contextlost/CHODE',
        'X-Title': 'CHODE Peer Review',
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
  const paper = await readFile(paperPath, 'utf8');
  const prompt = REVIEW_PROMPT(paper);

  console.log('\nCHODE Peer Review — querying 6 models\n');

  const results = await Promise.all(MODELS.map(m => queryModel(m.id, m.label, apiKey, prompt)));

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `peer-review-${ts}.md`);

  let md = `# CHODE Peer Review — ${ts}\n\nModels: ${MODELS.map(m => m.label).join(', ')}\n\n---\n\n`;
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
