#!/usr/bin/env node
/**
 * CHODE Adversarial Benchmark
 * Tests CHODE profile robustness against misleading, negation, multi-hop,
 * ambiguous, and plausible-wrong questions across caddy / ruff / zulip profiles.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/adversarial-test.ts --key sk-...
 *   node --experimental-strip-types benchmarks/adversarial-test.ts --key sk-... --models openai/gpt-4o
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Types ─────────────────────────────────────────────────────────────────────

type AdversarialType =
  | 'leading'       // false premise baked in — must resist
  | 'multi-hop'     // requires chaining facts: repo → language → ecosystem
  | 'negation'      // "what does X NOT …" — requires knowing what it DOES
  | 'ambiguous'     // under-specified; model must flag it
  | 'plausible-wrong'; // sounds right for the domain but may not be in profile

type Question = {
  id: string;
  type: AdversarialType;
  repo: 'caddy' | 'ruff' | 'zulip' | 'all'; // 'all' = multi-repo context / ambiguous
  text: string;
  /**
   * For scoring:
   * correctTerms  — must appear in a correct answer
   * wrongTerms    — their presence indicates the model fell for the trap
   * notInProfile  — true means the correct answer is "not mentioned in profile"
   */
  correctTerms: string[];
  wrongTerms: string[];
  notInProfile?: boolean;
  rubric: string; // human-readable explanation of what correct looks like
};

type RunResult = {
  q: Question;
  withProfile: string;
  withoutProfile: string;
  withScore: number;    // 1 = correct, 0 = fell for trap / wrong
  withoutScore: number;
  verdict: 'CHODE wins' | 'baseline wins' | 'tie-correct' | 'tie-wrong';
};

// ── Profile facts used to build questions ─────────────────────────────────────
//
// caddy.chode:
//   @STACK go chi cobra testify otel zap
//   @PKG gomod
//   @ENTRY cmd/caddy/main.go
//   @CI github-actions
//   @API prometheus
//   Written in Go, NOT Python/JS/Ruby.
//   Test framework: testify (Go native testing + testify)
//   Config: NOT toml/yaml by default — Caddyfile or JSON API
//
// ruff.chode:
//   @STACK rust python
//   @PKG cargo pip
//   @CONFIG toml
//   @PACKAGES crates/(4705) playground/(46) python/(14) fuzz/(6)
//   Written in Rust (linter engine) with Python bindings.
//   Package managers: cargo AND pip — NOT poetry, NOT uv, NOT npm as primary.
//   NOT a package manager itself — it is a linter/formatter.
//
// zulip.chode:
//   @STACK python
//   @FRONTEND ts preact astro webpack vite
//   @PKG pnpm uv
//   @AUTH ldap saml
//   @TEST puppeteer
//   Redis: NOT mentioned in profile.
//   Authentication: LDAP and SAML — NOT OAuth, NOT JWT as primary.
//   Package managers: pnpm (JS) and uv (Python) — NOT pip, NOT npm.

const QUESTIONS: Question[] = [
  // ── 1. Leading: caddy written in Python? ─────────────────────────────────
  {
    id: 'A1',
    type: 'leading',
    repo: 'caddy',
    text: 'Does Caddy use Python for its core implementation? If so, which Python web framework does it use?',
    correctTerms: ['go', 'no', 'not python', 'golang'],
    wrongTerms: ['django', 'flask', 'fastapi', 'yes', 'python framework'],
    rubric: 'Correct = explicitly reject Python, state Go. Score 0 if model accepts the false premise.',
  },

  // ── 2. Leading: ruff manages packages? ───────────────────────────────────
  {
    id: 'A2',
    type: 'leading',
    repo: 'ruff',
    text: 'Which Python packages does ruff manage for you, similar to how pip or poetry handle dependencies?',
    correctTerms: ['linter', 'formatter', 'not a package manager', 'no', 'does not manage'],
    wrongTerms: ['installs', 'manages packages', 'replaces pip', 'dependency management'],
    rubric: 'Correct = reject premise; ruff is a linter/formatter, not a package manager. Score 0 if model describes ruff as managing packages.',
  },

  // ── 3. Multi-hop: caddy → Go → Go test framework ─────────────────────────
  {
    id: 'A3',
    type: 'multi-hop',
    repo: 'caddy',
    text: 'What test framework does the language Caddy is written in typically use for its standard library tests?',
    correctTerms: ['go', 'testing', 'testify'],
    wrongTerms: ['jest', 'pytest', 'rspec', 'junit', 'mocha'],
    rubric: 'Correct = Go → Go testing package (stdlib "testing") and/or testify. Profile confirms @STACK includes testify. Score 0 for JS/Python/Ruby test frameworks.',
  },

  // ── 4. Multi-hop: ruff → Rust → Rust package manager ────────────────────
  {
    id: 'A4',
    type: 'multi-hop',
    repo: 'ruff',
    text: 'What package manager is used to build and publish the core compiled component of ruff, given the language it is written in?',
    correctTerms: ['cargo', 'rust'],
    wrongTerms: ['pip', 'poetry', 'npm', 'yarn', 'pnpm'],
    rubric: 'Correct = profile says @STACK rust → Rust uses Cargo (@PKG cargo pip). Score 0 for Python-only package managers.',
  },

  // ── 5. Negation: ruff package managers it does NOT use ───────────────────
  {
    id: 'A5',
    type: 'negation',
    repo: 'ruff',
    text: 'What package managers does ruff NOT use, according to its profile? The profile lists cargo and pip.',
    correctTerms: ['poetry', 'uv', 'npm', 'yarn', 'pnpm', 'pipenv'],
    wrongTerms: ['cargo', 'pip'],
    rubric: 'Correct = list package managers absent from @PKG (cargo pip). Any answer naming cargo or pip as "not used" is wrong.',
  },

  // ── 6. Negation: zulip auth methods NOT in profile ───────────────────────
  {
    id: 'A6',
    type: 'negation',
    repo: 'zulip',
    text: 'Zulip supports LDAP and SAML authentication according to its profile. What authentication methods does the profile NOT mention?',
    correctTerms: ['oauth', 'jwt', 'password', 'google', 'github', 'not mentioned', 'not in profile'],
    wrongTerms: ['ldap', 'saml'],
    rubric: 'Correct = name auth methods not in @AUTH (ldap saml). Score 0 if model lists ldap/saml as "not mentioned".',
  },

  // ── 7. Ambiguous: "main entry point" — which repo? ───────────────────────
  {
    id: 'A7',
    type: 'ambiguous',
    repo: 'all',
    text: 'What is the main entry point file?',
    correctTerms: ['which', 'clarif', 'which repo', 'specify', 'ambiguous', 'unclear', 'caddy', 'ruff', 'zulip'],
    wrongTerms: [],
    rubric: 'Correct = model asks for clarification OR lists all three repos\' entry points. Score 0 if model confidently names one without acknowledging ambiguity. Caddy: cmd/caddy/main.go. Ruff: not specified in profile. Zulip: not in profile.',
  },

  // ── 8. Ambiguous: "primary language" — which repo? ───────────────────────
  {
    id: 'A8',
    type: 'ambiguous',
    repo: 'all',
    text: 'What is the primary programming language used in this project?',
    correctTerms: ['which', 'clarif', 'which repo', 'specify', 'ambiguous', 'unclear', 'caddy', 'ruff', 'zulip'],
    wrongTerms: [],
    rubric: 'Correct = model flags ambiguity (3 repos in context) or covers all three. Score 0 if model picks one without acknowledging the others. Caddy=Go, Ruff=Rust+Python, Zulip=Python.',
  },

  // ── 9. Plausible wrong: zulip uses Redis? ────────────────────────────────
  {
    id: 'A9',
    type: 'plausible-wrong',
    repo: 'zulip',
    text: 'Does Zulip use Redis? It is a real-time chat application, so Redis would be a natural fit for message queuing.',
    correctTerms: ['not in profile', 'not mentioned', 'cannot confirm', 'profile does not', 'no mention'],
    wrongTerms: ['yes', 'uses redis', 'redis for', 'redis is used'],
    notInProfile: true,
    rubric: 'Correct = "not in profile" or explicit acknowledgment Redis is not mentioned. Profile has no Redis reference. Score 0 if model confidently confirms Redis usage from training data.',
  },

  // ── 10. Plausible wrong: caddy uses nginx config syntax? ─────────────────
  {
    id: 'A10',
    type: 'plausible-wrong',
    repo: 'caddy',
    text: 'Does Caddy use nginx-style configuration syntax, given that both are popular web servers?',
    correctTerms: ['no', 'caddyfile', 'json', 'not nginx', 'own format', 'different'],
    wrongTerms: ['yes', 'nginx syntax', 'similar to nginx', 'nginx-style'],
    rubric: 'Correct = reject the premise; Caddy uses Caddyfile or JSON API, not nginx syntax. Profile @SETUP and @CONVENTIONS reference Caddy-specific config. Score 0 if model agrees nginx syntax applies.',
  },
];

// ── Prompt builders ───────────────────────────────────────────────────────────

function buildSystemInstructions(): string {
  return `You are participating in a controlled benchmark. Answer each question using ONLY the information in the provided .chode profile(s). If information is not in the profile, say "Not in profile." Do not use general training knowledge to fill gaps. If a question is ambiguous or refers to "this project" without specifying which of multiple profiles is meant, ask for clarification or address all profiles.`;
}

function buildProfiledPrompt(
  profiles: Record<string, string>,
  question: Question,
): string {
  const profileSection = Object.entries(profiles)
    .map(([name, content]) => `## ${name}.chode\n\`\`\`\n${content.trim()}\n\`\`\``)
    .join('\n\n');

  return `${buildSystemInstructions()}

The following .chode profile(s) describe software repositories:

${profileSection}

---

Question: ${question.text}

Answer using ONLY the profile(s) above. Be direct and concise.`;
}

function buildBaselinePrompt(question: Question, repoHint: string): string {
  const hint = repoHint === 'all'
    ? 'You are answering about Caddy (web server), ruff (Python linter), and Zulip (team chat). Answer based on your training knowledge.'
    : `You are answering about the ${repoHint} project. Answer based on your training knowledge.`;

  return `You are participating in a controlled benchmark. ${hint}

Question: ${question.text}

Answer directly and concisely. Make your best guess if unsure.`;
}

// ── API ───────────────────────────────────────────────────────────────────────

type QueryResult = { content: string; promptTokens: number; completionTokens: number };

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function queryOpenRouter(
  model: string,
  apiKey: string,
  prompt: string,
  retries = 3,
): Promise<QueryResult> {
  let lastError: Error = new Error('unreachable');
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      const backoff = Math.pow(2, attempt - 1) * 1500;
      console.log(`    [retry ${attempt}/${retries}] waiting ${backoff}ms…`);
      await sleep(backoff);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Adversarial Benchmark',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 3000;
      console.log(`    [rate limited] waiting ${wait}ms…`);
      lastError = new Error('OpenRouter 429');
      await sleep(wait);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`OpenRouter ${res.status}: ${body}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
      usage?: { prompt_tokens: number; completion_tokens: number };
    };
    if (data.error) throw new Error(`OpenRouter: ${data.error.message}`);
    const content = data.choices?.[0]?.message?.content ?? '';
    if (!content) throw new Error('OpenRouter returned empty response');

    await sleep(1200); // inter-request courtesy delay
    return {
      content,
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    };
  }
  throw lastError;
}

// ── Scorer ────────────────────────────────────────────────────────────────────

function scoreAnswer(answer: string, q: Question): number {
  const lower = answer.toLowerCase();

  // For "not in profile" questions: correct = says not in profile or not mentioned
  if (q.notInProfile) {
    const nip = ['not in profile', 'not mentioned', 'cannot confirm', 'no mention', 'profile does not', 'no information', 'not specified'].some(p => lower.includes(p));
    const fell = q.wrongTerms.some(t => lower.includes(t.toLowerCase()));
    if (fell) return 0;
    if (nip) return 1;
    // If model hedges with uncertainty, partial credit → treat as 1
    if (['cannot', 'unclear', 'not sure', 'may', 'might', 'possibly'].some(p => lower.includes(p))) return 1;
    return 0;
  }

  // For ambiguous questions: correct = acknowledges ambiguity OR covers all repos
  if (q.type === 'ambiguous') {
    const hasClarif = q.correctTerms.some(t => lower.includes(t.toLowerCase()));
    return hasClarif ? 1 : 0;
  }

  // General: check wrong terms first (trap detection)
  const fellForTrap = q.wrongTerms.length > 0 && q.wrongTerms.some(t => lower.includes(t.toLowerCase()));
  if (fellForTrap) return 0;

  // Then check correct terms — any correct term present = pass
  const hasCorrect = q.correctTerms.some(t => lower.includes(t.toLowerCase()));
  return hasCorrect ? 1 : 0;
}

// ── Reporter ──────────────────────────────────────────────────────────────────

function typeLabel(t: AdversarialType): string {
  return {
    'leading': 'Leading (false premise)',
    'multi-hop': 'Multi-hop reasoning',
    'negation': 'Negation',
    'ambiguous': 'Ambiguous (multi-repo)',
    'plausible-wrong': 'Plausible wrong',
  }[t];
}

function verdictEmoji(v: RunResult['verdict']): string {
  return {
    'CHODE wins': '✓ CHODE',
    'baseline wins': '✗ Baseline',
    'tie-correct': '= Both correct',
    'tie-wrong': '= Both wrong',
  }[v];
}

function buildMarkdownReport(
  model: string,
  results: RunResult[],
  totalWith: number,
  totalWithout: number,
): string {
  const date = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  const pct = (n: number) => `${Math.round(n / QUESTIONS.length * 100)}%`;

  const byType: Record<string, RunResult[]> = {};
  for (const r of results) {
    byType[r.q.type] ??= [];
    byType[r.q.type].push(r);
  }

  const typeSummaryRows = Object.entries(byType).map(([type, rs]) => {
    const w = rs.reduce((s, r) => s + r.withScore, 0);
    const wo = rs.reduce((s, r) => s + r.withoutScore, 0);
    return `| ${typeLabel(type as AdversarialType)} | ${w}/${rs.length} | ${wo}/${rs.length} |`;
  }).join('\n');

  const detailRows = results.map(r => {
    const withA = r.withProfile.replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 200);
    const woA = r.withoutProfile.replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 200);
    const v = verdictEmoji(r.verdict);
    return `| **${r.q.id}** | ${typeLabel(r.q.type)} | ${r.q.repo} | ${withA}… | ${r.withScore} | ${woA}… | ${r.withoutScore} | ${v} |`;
  }).join('\n');

  // Full Q&A section
  const qaSections = results.map(r => {
    return `### ${r.q.id} — ${typeLabel(r.q.type)} (repo: ${r.q.repo})

**Question:** ${r.q.text}

**Rubric:** ${r.q.rubric}

**With CHODE profile (score: ${r.withScore}/1):**
> ${r.withProfile.replace(/\n/g, '\n> ')}

**Baseline / no profile (score: ${r.withoutScore}/1):**
> ${r.withoutProfile.replace(/\n/g, '\n> ')}

**Verdict:** ${verdictEmoji(r.verdict)}

---`;
  }).join('\n\n');

  return `# CHODE Adversarial Benchmark — ${model}
**Date:** ${date}
**Model:** ${model}
**Questions:** ${QUESTIONS.length} (across caddy / ruff / zulip profiles)
**Adversarial types:** leading, multi-hop, negation, ambiguous, plausible-wrong

## Overall Scores

| Mode | Score | Pct |
|------|-------|-----|
| With CHODE profile | **${totalWith}/${QUESTIONS.length}** | **${pct(totalWith)}** |
| Without profile (baseline) | **${totalWithout}/${QUESTIONS.length}** | **${pct(totalWithout)}** |
| Delta | **+${totalWith - totalWithout}** | **+${Math.round((totalWith - totalWithout) / QUESTIONS.length * 100)}pp** |

## By Question Type

| Type | With Profile | Without Profile |
|------|-------------|-----------------|
${typeSummaryRows}

## Question-by-Question Summary

| Q | Type | Repo | With-Profile Answer | Score | Baseline Answer | Score | Verdict |
|---|------|------|---------------------|-------|-----------------|-------|---------|
${detailRows}

---

## Full Q&A Detail

${qaSections}

---

## Profiles Used

### caddy.chode
\`\`\`
@STACK go chi cobra testify otel zap
@CI github-actions
@PKG gomod
@ENTRY cmd/caddy/main.go
@API prometheus
\`\`\`

### ruff.chode
\`\`\`
@STACK rust python
@CI github-actions
@PKG cargo pip
@CONFIG toml
@PACKAGES crates/(4705) playground/(46) python/(14) fuzz/(6)
\`\`\`

### zulip.chode
\`\`\`
@STACK python
@FRONTEND ts preact astro webpack vite
@PKG pnpm uv
@AUTH ldap saml
@TEST puppeteer
@CONFIG toml
\`\`\`

---
*Generated by CHODE adversarial-test.ts*
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const keyArg = get('--key') ?? process.env['OPENROUTER_API_KEY'];
  const modelsArg = get('--models');

  if (!keyArg) {
    console.error('Usage: adversarial-test.ts --key <openrouter-key> [--models model1,model2]');
    console.error('Or set OPENROUTER_API_KEY env var.');
    process.exit(1);
  }

  const models = modelsArg
    ? modelsArg.split(',').map(m => m.trim())
    : ['openai/gpt-4o', 'google/gemini-2.5-flash'];

  // Load profiles
  const profileDir = resolve(__dirname, 'profiles');
  const [caddyContent, ruffContent, zulipContent] = await Promise.all([
    readFile(resolve(profileDir, 'caddy.chode'), 'utf8'),
    readFile(resolve(profileDir, 'ruff.chode'), 'utf8'),
    readFile(resolve(profileDir, 'zulip.chode'), 'utf8'),
  ]);

  const allProfiles: Record<string, string> = {
    caddy: caddyContent,
    ruff: ruffContent,
    zulip: zulipContent,
  };

  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });

  // Timestamp for output filename
  const ts = new Date().toISOString().replace(/[:.]/g, '').replace('T', '-').slice(0, 15);

  for (const model of models) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Model: ${model}`);
    console.log(`${'─'.repeat(60)}`);

    const results: RunResult[] = [];
    let totalWith = 0;
    let totalWithout = 0;

    for (const q of QUESTIONS) {
      console.log(`\n  [${q.id}] ${q.type.toUpperCase()} — ${q.repo}`);
      console.log(`  Q: ${q.text.slice(0, 80)}…`);

      // Select profiles to include
      const profilesForQ: Record<string, string> = q.repo === 'all'
        ? allProfiles
        : { [q.repo]: allProfiles[q.repo]! };

      // ── With CHODE profile ────────────────────────────────────────────────
      let withAnswer = '';
      try {
        const prompt = buildProfiledPrompt(profilesForQ, q);
        const r = await queryOpenRouter(model, keyArg, prompt);
        withAnswer = r.content.trim();
      } catch (e) {
        console.error(`    [ERROR with-profile] ${e}`);
        withAnswer = `ERROR: ${e}`;
      }

      // ── Baseline (no profile) ─────────────────────────────────────────────
      let withoutAnswer = '';
      try {
        const prompt = buildBaselinePrompt(q, q.repo);
        const r = await queryOpenRouter(model, keyArg, prompt);
        withoutAnswer = r.content.trim();
      } catch (e) {
        console.error(`    [ERROR baseline] ${e}`);
        withoutAnswer = `ERROR: ${e}`;
      }

      const withScore = scoreAnswer(withAnswer, q);
      const withoutScore = scoreAnswer(withoutAnswer, q);
      totalWith += withScore;
      totalWithout += withoutScore;

      const verdict: RunResult['verdict'] =
        withScore === 1 && withoutScore === 0 ? 'CHODE wins' :
        withScore === 0 && withoutScore === 1 ? 'baseline wins' :
        withScore === 1 && withoutScore === 1 ? 'tie-correct' :
        'tie-wrong';

      console.log(`  With profile: ${withScore}/1  |  Baseline: ${withoutScore}/1  |  ${verdict}`);

      results.push({ q, withProfile: withAnswer, withoutProfile: withoutAnswer, withScore, withoutScore, verdict });
    }

    console.log(`\n  TOTAL — With profile: ${totalWith}/${QUESTIONS.length}  |  Baseline: ${totalWithout}/${QUESTIONS.length}`);
    console.log(`  Delta: ${totalWith >= totalWithout ? '+' : ''}${totalWith - totalWithout}`);

    const modelSlug = model.replace(/[:/]/g, '-');
    const outFile = resolve(outDir, `adversarial-test-${modelSlug}-${ts}.md`);
    const report = buildMarkdownReport(model, results, totalWith, totalWithout);
    await writeFile(outFile, report, 'utf8');
    console.log(`\n  Saved: ${outFile}`);
  }

  // ── Combined summary if multiple models ───────────────────────────────────
  if (models.length > 1) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log('Multi-model run complete. Each model has its own result file.');
    console.log('Compare files in benchmarks/results/ for cross-model analysis.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
