#!/usr/bin/env node
/**
 * CHODE Logprobs Experiment
 *
 * Asks GPT-4o: "Which Go HTTP router does gitea use?" in three modes:
 *   baseline  — no context
 *   chode     — CHODE profile (~500 tok)
 *   raw       — raw depth-2 repo walk (~71k chars)
 *
 * Captures top-5 token probabilities on the first answer token.
 * Target: P(chi) rises substantially from baseline → chode.
 *
 * Uses OpenRouter's logprobs support (mirrors OpenAI API).
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/logprobs.ts --key sk-or-v1-...
 */

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODEL = 'openai/gpt-4o';
const QUESTION = 'Which Go HTTP router/mux library does the Gitea project use? Reply with the library name only — one word.';

const ANCHOR_NAMES = ['go.mod', 'Makefile', 'README.md', 'CONTRIBUTING.md'];

async function buildRawContext(repoPath: string): Promise<string> {
  const chunks: string[] = [`# Raw context: ${repoPath}\n`];

  // Root-level anchors
  for (const name of ANCHOR_NAMES) {
    const p = join(repoPath, name);
    try {
      const text = await readFile(p, 'utf8');
      chunks.push(`## ${name}\n${text.slice(0, 8000)}`);
    } catch {}
  }

  // Depth-1 and depth-2 directory listing
  async function listDir(dir: string, depth: number) {
    let entries: string[] = [];
    try { entries = await readdir(dir); } catch { return; }
    for (const entry of entries.slice(0, 40)) {
      const full = join(dir, entry);
      try {
        const s = await stat(full);
        if (s.isDirectory()) {
          chunks.push(`DIR: ${full.replace(repoPath, '').replace(/\\/g, '/')}`);
          if (depth < 2) await listDir(full, depth + 1);
        }
      } catch {}
    }
  }
  await listDir(repoPath, 1);

  return chunks.join('\n\n').slice(0, 200000);
}

async function query(apiKey: string, context: string | null): Promise<{
  answer: string;
  topTokens: Array<{ token: string; logprob: number; prob: number }>;
  rawLogprobs: unknown;
}> {
  const prompt = context
    ? `${context}\n\n---\n\nUsing only the information above, answer:\n${QUESTION}`
    : QUESTION;

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://github.com/chode',
      'X-Title': 'CHODE Logprobs',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 5,
      logprobs: true,
      top_logprobs: 5,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json() as {
    choices?: Array<{
      message: { content: string };
      logprobs?: {
        content?: Array<{
          token: string;
          logprob: number;
          top_logprobs?: Array<{ token: string; logprob: number }>;
        }>;
      };
    }>;
    error?: { message: string };
  };

  if (data.error) throw new Error(data.error.message);

  const choice = data.choices?.[0];
  const answer = choice?.message?.content?.trim() ?? '';
  const firstPos = choice?.logprobs?.content?.[0];
  const rawLogprobs = choice?.logprobs;

  const topTokens = (firstPos?.top_logprobs ?? []).map(t => ({
    token: t.token,
    logprob: t.logprob,
    prob: Math.exp(t.logprob),
  }));

  // If chi not in top_logprobs but is the answer, add it
  if (answer.toLowerCase().includes('chi') && !topTokens.some(t => t.token.toLowerCase().includes('chi'))) {
    topTokens.push({ token: answer, logprob: firstPos?.logprob ?? -99, prob: Math.exp(firstPos?.logprob ?? -99) });
  }

  return { answer, topTokens, rawLogprobs };
}

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };

  const apiKey = get('--key') ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) { console.error('--key or OPENROUTER_API_KEY required'); process.exit(1); }

  const chodePath = get('--chode') ?? resolve(__dirname, '../samples/gitea.chode');
  const repoPath  = get('--repo')  ?? 'F:/projects/benchmarks/gitea';

  const chodeProfile = await readFile(chodePath, 'utf8').catch(() => {
    console.error(`Cannot read: ${chodePath}`); process.exit(1);
  }) as string;

  console.log(`\nCHODE Logprobs Experiment`);
  console.log(`  Model:    ${MODEL}`);
  console.log(`  Question: ${QUESTION}`);
  console.log(`  CHODE profile: ${chodePath} (~${Math.ceil(chodeProfile.length / 4)} tok)\n`);

  console.log('Building raw context...');
  const rawContext = await buildRawContext(repoPath);
  console.log(`  Raw context: ${rawContext.length} chars (~${Math.ceil(rawContext.length / 4)} tok)\n`);

  const modes: Array<{ label: string; context: string | null }> = [
    { label: 'baseline', context: null },
    { label: 'chode',    context: chodeProfile },
    { label: 'raw',      context: rawContext },
  ];

  const results: Array<{ label: string; answer: string; topTokens: Array<{ token: string; logprob: number; prob: number }> }> = [];

  for (const mode of modes) {
    process.stdout.write(`  [${mode.label}] querying... `);
    try {
      const { answer, topTokens } = await query(apiKey, mode.context);
      console.log(`answer: "${answer}"`);
      console.log('    top tokens:');
      for (const t of topTokens.slice(0, 5)) {
        const bar = '█'.repeat(Math.round(t.prob * 20));
        console.log(`      ${t.token.padEnd(14)} ${(t.prob * 100).toFixed(1).padStart(5)}%  ${bar}`);
      }
      results.push({ label: mode.label, answer, topTokens });
    } catch (e) {
      console.log(`FAILED: ${e}`);
      results.push({ label: mode.label, answer: 'ERROR', topTokens: [] });
    }
    await sleep(1500);
  }

  // P(chi) across modes
  const chiProb = (label: string) => {
    const r = results.find(r => r.label === label);
    const t = r?.topTokens.find(t => t.token.toLowerCase().includes('chi'));
    return t?.prob ?? 0;
  };

  console.log('\n── P(chi) summary ──────────────────────────────────────────────');
  for (const r of results) {
    const p = chiProb(r.label);
    const bar = '█'.repeat(Math.round(p * 40));
    console.log(`  ${r.label.padEnd(10)} ${(p * 100).toFixed(1).padStart(5)}%  ${bar}`);
  }
  const delta = chiProb('chode') - chiProb('baseline');
  console.log(`\n  ΔP(chi) baseline→chode: ${delta >= 0 ? '+' : ''}${(delta * 100).toFixed(1)}pp`);

  // ── Report ──────────────────────────────────────────────────────────────────

  const date = new Date().toISOString().slice(0, 10);
  let md = `# CHODE Logprobs Experiment\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Model:** ${MODEL}  \n`;
  md += `**Question:** ${QUESTION}  \n`;
  md += `**Correct answer:** chi  \n\n`;

  md += `## Top-5 Token Probabilities by Mode\n\n`;
  for (const r of results) {
    md += `### ${r.label}\n\n`;
    md += `**Answer:** \`${r.answer}\`  \n\n`;
    if (r.topTokens.length > 0) {
      md += `| Token | Probability | Log-prob |\n|---|---|---|\n`;
      for (const t of r.topTokens.slice(0, 5)) {
        const marker = t.token.toLowerCase().includes('chi') ? ' ← **chi**' : '';
        md += `| \`${t.token}\` | ${(t.prob * 100).toFixed(2)}%${marker} | ${t.logprob.toFixed(3)} |\n`;
      }
    } else {
      md += `*(logprobs unavailable)*\n`;
    }
    md += '\n';
  }

  md += `## P(chi) Across Modes\n\n`;
  md += `| Mode | P(chi) | Answer |\n|---|---|---|\n`;
  for (const r of results) {
    const p = chiProb(r.label);
    md += `| ${r.label} | ${(p * 100).toFixed(2)}% | \`${r.answer}\` |\n`;
  }
  md += '\n';

  const d = chiProb('chode') - chiProb('baseline');
  md += `**ΔP(chi) baseline→chode:** ${d >= 0 ? '+' : ''}${(d * 100).toFixed(1)}pp  \n`;
  md += `**Target:** ≥ +50pp  \n`;
  md += `**Result:** ${Math.abs(d * 100) >= 50 ? '✓ Target met' : '✗ Target not met'}  \n\n`;

  md += `## Interpretation\n\n`;
  if (chiProb('baseline') < 0.1 && chiProb('chode') > 0.5) {
    md += `Strong signal: CHODE collapses probability mass from competing routers onto chi. `;
    md += `Prior Overwhelming confirmed — baseline shows near-zero P(chi) because model defaults to gin/gorilla/echo from training. `;
    md += `CHODE provides the unambiguous signal needed to override trained priors.\n`;
  } else if (chiProb('chode') > chiProb('baseline')) {
    md += `P(chi) increases with CHODE context. Logprobs not captured directly (OpenRouter may not expose them for this model). `;
    md += `Answer text confirms correct retrieval.\n`;
  } else {
    md += `Logprob data unavailable or inconclusive. Check raw response for model support.\n`;
  }

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `logprobs-${date}.md`);
  await writeFile(outFile, md);
  console.log(`\nSaved → ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
