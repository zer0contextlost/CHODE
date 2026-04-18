#!/usr/bin/env node
/**
 * CHODE Ollama Benchmark Runner
 * Sends a .chode profile + 30 standardized questions to a local Ollama model.
 * Saves answers as a markdown scoring sheet for manual review.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/ollama-benchmark.ts --model qwen2.5-coder:7b
 *   node --experimental-strip-types benchmarks/ollama-benchmark.ts --model llama3.3:70b --chode /path/to/.chode
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OLLAMA_URL = 'http://localhost:11434';
const __dirname = dirname(fileURLToPath(import.meta.url));

const QUESTIONS = [
  { id: 'Q1',  topic: 'Primary languages',      category: 'Objective' },
  { id: 'Q2',  topic: 'Web frameworks',          category: 'Objective' },
  { id: 'Q3',  topic: 'Databases',               category: 'Objective' },
  { id: 'Q4',  topic: 'Package managers',        category: 'Objective' },
  { id: 'Q5',  topic: 'Primary purpose',         category: 'Objective' },
  { id: 'Q6',  topic: 'Main entry point',        category: 'Navigational' },
  { id: 'Q7',  topic: 'Monorepo / top-level count', category: 'Navigational' },
  { id: 'Q8',  topic: 'Routes/handlers location', category: 'Navigational' },
  { id: 'Q9',  topic: 'Schema/ORM models',       category: 'Navigational' },
  { id: 'Q10', topic: 'Frontend/UI code location', category: 'Navigational' },
  { id: 'Q11', topic: 'Architectural pattern',   category: 'Inferential' },
  { id: 'Q12', topic: 'Frontend/backend/fullstack/etc.', category: 'Inferential' },
  { id: 'Q13', topic: 'Configuration management', category: 'Inferential' },
  { id: 'Q14', topic: 'Dependency injection',    category: 'Inferential' },
  { id: 'Q15', topic: 'Authentication',          category: 'Inferential' },
  { id: 'Q16', topic: 'Main domain entities',    category: 'Domain' },
  { id: 'Q17', topic: 'External integrations',   category: 'Domain' },
  { id: 'Q18', topic: 'Test framework',          category: 'Domain' },
  { id: 'Q19', topic: 'How to run tests',        category: 'Domain' },
  { id: 'Q20', topic: 'CI system',               category: 'Domain' },
  { id: 'Q21', topic: 'Where to add API endpoint', category: 'Navigation' },
  { id: 'Q22', topic: 'Database migrations location', category: 'Navigation' },
  { id: 'Q23', topic: 'Core business logic location', category: 'Navigation' },
  { id: 'Q24', topic: 'Error handling middleware', category: 'Navigation' },
  { id: 'Q25', topic: 'Env var documentation',   category: 'Navigation' },
  { id: 'Q26', topic: 'Top 3 internal packages', category: 'Deep' },
  { id: 'Q27', topic: 'Bootstrap/init sequence', category: 'Deep' },
  { id: 'Q28', topic: 'Notable design patterns', category: 'Deep' },
  { id: 'Q29', topic: 'Key deployer config options', category: 'Deep' },
  { id: 'Q30', topic: 'New contributor essentials', category: 'Deep' },
];

const QUESTION_TEXT = [
  'What language(s) is this project primarily written in?',
  'What web framework(s) does it use?',
  'What database(s) does it support or use?',
  'What package manager(s) are used?',
  'What is the project\'s primary purpose in one sentence?',
  'What is the main entry point file?',
  'Is this a monorepo? How many top-level packages?',
  'Where are HTTP routes/handlers defined?',
  'Where is the data schema or ORM models defined?',
  'Where does frontend/UI code live?',
  'What architectural pattern does the project follow?',
  'Frontend, backend, CLI, library, or fullstack?',
  'How is configuration managed?',
  'Does the project use dependency injection?',
  'How is authentication handled?',
  'What are the main domain entities?',
  'What external services or APIs does it integrate with?',
  'What test framework is used?',
  'How do you run the test suite?',
  'What CI system is used?',
  'Where would you add a new API endpoint?',
  'Where would you find database migrations?',
  'Where is the core business logic concentrated?',
  'Where is error handling middleware?',
  'Where are environment variables documented?',
  'What are the top 3 most-used internal packages?',
  'What does the bootstrap/initialization sequence look like?',
  'What notable design patterns appear in the codebase?',
  'What are the key config options a deployer would set?',
  'What would a new contributor need to know first?',
];

function buildPrompt(chodeContent: string): string {
  const questionList = QUESTIONS.map((q, i) =>
    `${q.id}: ${QUESTION_TEXT[i]}`
  ).join('\n');

  return `You are participating in a controlled benchmark. You will be given a .chode profile — a compressed description of a software repository — and must answer 30 standardized questions using ONLY the information in the profile.

IMPORTANT RULES:
1. Answer from the .chode file ONLY. Do not use any prior knowledge about this specific repository.
2. If information is genuinely not in the profile, say "Not in profile."
3. Give a clear, specific answer for each question. Cite which section of the profile you used.
4. Answer all 30 questions in order.

THE .CHODE PROFILE:
${chodeContent}

THE 30 QUESTIONS:
${questionList}

Answer each question clearly labeled Q1 through Q30.`;
}

async function queryOllama(model: string, prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: { temperature: 0.1, num_ctx: 8192 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error ${res.status}: ${err}`);
  }

  const data = await res.json() as { message?: { content: string }; error?: string };
  if (data.error) throw new Error(data.error);
  return data.message?.content ?? '';
}

function parseAnswers(raw: string): Map<string, string> {
  const answers = new Map<string, string>();
  // Split on Q1:, Q2:, Q1., Q2. etc.
  const parts = raw.split(/(?=\n?Q(\d+)[:.]\s)/);
  for (const part of parts) {
    const m = part.match(/^Q(\d+)[:.]\s+([\s\S]+)/);
    if (m) {
      const num = parseInt(m[1]!);
      if (num >= 1 && num <= 30) {
        answers.set(`Q${num}`, m[2]!.trim().replace(/\n+$/, ''));
      }
    }
  }
  return answers;
}

function buildOutput(model: string, chodeFile: string, chodeContent: string, raw: string, answers: Map<string, string>): string {
  const date = new Date().toISOString().slice(0, 10);
  const tokenEst = Math.ceil(chodeContent.length / 4);
  const modelSlug = model.replace(/[:/]/g, '-');

  const rows = QUESTIONS.map((q, i) => {
    const answer = answers.get(q.id) ?? '_(not parsed)_';
    // Truncate long answers for table readability
    const short = answer.length > 300 ? answer.slice(0, 300).replace(/\s+\S*$/, '…') : answer;
    const escaped = short.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    return `| ${q.id} | ${q.topic} | ${q.category} | ${escaped} | /3 |`;
  }).join('\n');

  const parsed = answers.size;

  return `# CHODE Benchmark — ${model}
**Date:** ${date}
**Model:** ${model}
**Profile:** ${chodeFile}
**Profile size:** ~${tokenEst} tokens
**Questions parsed:** ${parsed}/30

---

## Scoring Sheet

> Score each answer 0–3: 3=correct+complete, 2=mostly correct minor gaps, 1=partial significant gaps, 0=wrong/absent

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
${rows}

**Total: __/90**

---

## Raw Model Response

\`\`\`
${raw}
\`\`\`
`;
}

async function checkModel(model: string): Promise<boolean> {
  const res = await fetch(`${OLLAMA_URL}/api/tags`);
  const data = await res.json() as { models: Array<{ name: string }> };
  return data.models.some(m => m.name === model || m.name === model + ':latest');
}

async function main() {
  const args = process.argv.slice(2);
  const modelIdx = args.indexOf('--model');
  const chodeIdx = args.indexOf('--chode');
  const modelArg = modelIdx !== -1 ? args[modelIdx + 1] : undefined;
  const chodeArg = chodeIdx !== -1 ? args[chodeIdx + 1] : undefined;

  if (!modelArg) {
    console.error('Usage: ollama-benchmark.ts --model <model-name> [--chode <path>]');
    console.error('\nAvailable via: curl http://localhost:11434/api/tags');
    process.exit(1);
  }

  const chodeFile = chodeArg
    ? resolve(chodeArg)
    : resolve('F:/projects/benchmarks/gitea/.chode');

  let chodeContent: string;
  try {
    chodeContent = await readFile(chodeFile, 'utf8');
  } catch {
    console.error(`Could not read .chode file: ${chodeFile}`);
    process.exit(1);
  }

  console.log(`\nCHODE Benchmark Runner`);
  console.log(`  Model:   ${modelArg}`);
  console.log(`  Profile: ${chodeFile}`);
  console.log(`  Size:    ~${Math.ceil(chodeContent.length / 4)} tokens\n`);

  // Check model is available
  const available = await checkModel(modelArg).catch(() => false);
  if (!available) {
    console.error(`Model "${modelArg}" not found in Ollama.`);
    console.error(`Pull it with: ollama pull ${modelArg}`);
    process.exit(1);
  }

  console.log(`  Querying Ollama... (this may take a while for large models)`);
  const start = Date.now();

  let raw: string;
  try {
    raw = await queryOllama(modelArg, buildPrompt(chodeContent));
  } catch (e) {
    console.error(`Query failed: ${e}`);
    process.exit(1);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  Done in ${elapsed}s\n`);

  const answers = parseAnswers(raw);
  console.log(`  Parsed ${answers.size}/30 answers`);

  const modelSlug = modelArg.replace(/[:/]/g, '-');
  const date = new Date().toISOString().slice(0, 10);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `gitea-${modelSlug}-${date}.md`);

  const output = buildOutput(modelArg, chodeFile, chodeContent, raw, answers);
  await writeFile(outFile, output, 'utf8');

  console.log(`  Results saved to: ${outFile}`);
  console.log(`\n  Open the file and fill in the Score column (0–3 per question).`);
  console.log(`  Claude R3 baseline for comparison: 62/90 = 68.9%\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
