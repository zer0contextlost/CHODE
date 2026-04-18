#!/usr/bin/env node
/**
 * CHODE Density Test
 * Tests what happens to accuracy as CHODE profile density increases —
 * finding the upper limit before attention dilutes.
 *
 * Hypothesis: there is a sweet spot. Too sparse = missing facts.
 * Too dense = attention dilutes and accuracy drops.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/density-test.ts --key sk-or-...
 *   (reads OPENROUTER_API_KEY env var if --key not provided)
 *
 * Output: density_level | tokens | gpt4o% | flash%
 * Saves to: benchmarks/results/density-test-[timestamp].md
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Density level profiles ────────────────────────────────────────────────────

// Base gitea profile fields (authoritative, from samples/gitea.chode)
const BASE_STACK      = 'go chi mysql jwt pq sqlite3 mssql python';
const BASE_FRONTEND   = 'ts vue esbuild vite (web_src/)';
const BASE_CI         = 'github-actions';
const BASE_PKG        = 'pnpm gomod uv';
const BASE_TEST       = '@playwright/test vitest make test make test-backend make test-frontend make test-check make test-sqlite';
const BASE_CONFIG     = 'ini';
const BASE_ENTRY      = 'main.go';
const BASE_ROUTES     = 'chi → routers/ (447 files)';
const BASE_DATA       = 'models/migrations/ (305 migrations)';
const BASE_ENTITIES   = 'models/ → actions activities admin asymkey auth avatars dbfs git issues organization packages perm';
const BASE_AUTH       = 'openid pam password webauthn ldap oauth smtp db oauth2 sspi';
const BASE_API        = 'azure aws github-api minio prometheus';
const BASE_ARCH       = 'layered(cmd→routes→svc→mdl) strategy(auth)';
const BASE_PACKAGES   = 'modules/(968) models/(649) services/(479) routers/(445) cmd/(52)';
const BASE_STRUCT     = 'modules/{git,setting,markup,packages,structs,indexer}(1.2k) models/{migrations,fixtures,issues,repo,actions,db}(769) templates/{repo,user,package,admin,org,shared}(574) routers/{web,api,private,common,install,utils}(484) services/{repository,auth,pull,context,mailer,convert}(481) web_src/{js,css,svg,fomantic}(376) cmd/(52) contrib/{gitea-monitoring-mixin,ide,backport,legal,init,launchd}(27) docker/(11) tools/(11)';
const BASE_PATTERNS   = 'strategy(auth) repository middleware-chain';
const BASE_MIDDLEWARE = 'routers/common/';
const BASE_PURPOSE    = 'goal of this project is to make easiest, fastest, and most painless way of setting up self-hosted Git service. As Gitea is written in Go, it works across all platforms and architectures that are supported by Go, including Linux, macOS, and Windows on x86, amd64, ARM and PowerPC architectures. This project has been forked from Gogs since November…';
const BASE_CONVENTIONS = 'You should always run `make fmt` before committing to conform to Gitea\'s styleguide.';
const BASE_TESTING    = 'Before submitting pull request, run all tests to make sure your changes don\'t cause regression elsewhere. Here\'s how to run test suite: code lint | | | |:-------------------- |:--------------------------------------------------------------------------- | |``make lint`` | lint everything (not needed if you only change front- or backend) |…';

// ── Profile builders ──────────────────────────────────────────────────────────

function buildMinimalProfile(): string {
  return `---CHODE v2---

---DNA---
@STACK ${BASE_STACK}
@ENTRY ${BASE_ENTRY}
@PKG ${BASE_PKG}

---CONTEXT---
@PURPOSE ${BASE_PURPOSE}
`;
}

function buildStandardProfile(): string {
  return `---CHODE v2---

---DNA---
@STACK ${BASE_STACK}
@FRONTEND ${BASE_FRONTEND}
@CI ${BASE_CI}
@PKG ${BASE_PKG}
@TEST ${BASE_TEST}
@CONFIG ${BASE_CONFIG}
@ENTRY ${BASE_ENTRY}
@ROUTES ${BASE_ROUTES}
@DATA ${BASE_DATA}
@ENTITIES ${BASE_ENTITIES}
@AUTH ${BASE_AUTH}
@API ${BASE_API}
@ARCH ${BASE_ARCH}
@PACKAGES ${BASE_PACKAGES}
@STRUCT ${BASE_STRUCT}
@PATTERNS ${BASE_PATTERNS}
@MIDDLEWARE ${BASE_MIDDLEWARE}

---CONTEXT---
@PURPOSE ${BASE_PURPOSE}
@CONVENTIONS ${BASE_CONVENTIONS}
@TESTING ${BASE_TESTING}
`;
}

function buildVerboseProfile(): string {
  // Pad to ~800 tokens by adding extended @STRUCT entries and more @PACKAGES detail
  const extraStruct = [
    'internal/{db,git,log,queue,ssh,storage,setting}(312)',
    'services/{agit,auth,convert,federation,gitdiff,markup,mirror,notify}(201)',
    'routers/{api,install,private,utils,web}(445)',
    'modules/{git,setting,markup,packages,structs,indexer,graceful,process,queue}(1.2k)',
    'models/{access,actions,activities,admin,asymkey,auth,avatars,db,git,issues,migrate,packages,perm,project,repo,unit,user,webhook}(649)',
    'templates/{repo,user,package,admin,org,shared,base,devtest,explore,mail,swagger}(574)',
    'contrib/{gitea-monitoring-mixin,ide,backport,legal,init,launchd,systemd}(32)',
    'web_src/{js,css,svg,fomantic,tests,types}(421)',
  ].join(' ');

  const extraPackages = [
    'modules/(968)',
    'models/(649)',
    'services/(479)',
    'routers/(445)',
    'templates/(348)',
    'web_src/(376)',
    'internal/(312)',
    'cmd/(52)',
    'contrib/(32)',
  ].join(' ');

  return `---CHODE v2---

---DNA---
@STACK ${BASE_STACK}
@FRONTEND ${BASE_FRONTEND}
@CI ${BASE_CI}
@PKG ${BASE_PKG}
@TEST ${BASE_TEST}
@CONFIG ${BASE_CONFIG}
@ENTRY ${BASE_ENTRY}
@ROUTES ${BASE_ROUTES}
@DATA ${BASE_DATA}
@ENTITIES ${BASE_ENTITIES}
@AUTH ${BASE_AUTH}
@API ${BASE_API}
@ARCH ${BASE_ARCH}
@PACKAGES ${extraPackages}
@STRUCT ${BASE_STRUCT} ${extraStruct}
@PATTERNS ${BASE_PATTERNS}
@MIDDLEWARE ${BASE_MIDDLEWARE}
@STRUCT2 internal/{db,git,log,queue,ssh,storage}(312) vendor/(0) scripts/{lint,test,build,generate}(18) tools/{gitea-vet,swagger,check-go-version}(11) docker/{rootless,hooks}(11)
@PACKAGES2 templates/(348) web_src/(376) internal/(312) contrib/(32) tools/(11) docker/(11)

---CONTEXT---
@PURPOSE ${BASE_PURPOSE}
@CONVENTIONS ${BASE_CONVENTIONS}
@TESTING ${BASE_TESTING}
@SETUP Run \`make build\` to compile the binary. Requires Go 1.21+. Use \`make watch\` for live-reload during development. Frontend assets built with \`make frontend\`. Database migrations run automatically on startup.
@ENV APP_NAME GITEA_WORK_DIR GITEA_CUSTOM RUN_MODE LOG_LEVEL DB_TYPE DB_HOST DB_NAME DB_USER DB_PASSWD SSH_DOMAIN HTTP_PORT ROOT_URL
@DEPLOY Single binary deployment. Docker image available at gitea/gitea. Supports SQLite (default), MySQL, PostgreSQL, MSSQL. Config file at custom/conf/app.ini. Systemd unit file in contrib/systemd/.
`;
}

function buildMaximumProfile(): string {
  // Pad to ~1500 tokens with realistic-looking but noisy technical detail.
  // Real facts are all preserved and accurate — noise is extra module paths,
  // repeated structural info, and verbose (but true) commentary.
  const noiseModulePaths = [
    'modules/git/pipeline/(23) modules/git/repo/(18) modules/git/object/(14)',
    'modules/setting/config/(9) modules/setting/sections/(7)',
    'modules/markup/html/(11) modules/markup/markdown/(8) modules/markup/orgmode/(5)',
    'modules/packages/helm/(4) modules/packages/npm/(4) modules/packages/nuget/(4) modules/packages/pypi/(4) modules/packages/maven/(4)',
    'services/auth/source/db/(3) services/auth/source/ldap/(3) services/auth/source/oauth2/(3) services/auth/source/pam/(2) services/auth/source/smtp/(2) services/auth/source/sspi/(2)',
    'routers/api/v1/admin/(12) routers/api/v1/misc/(8) routers/api/v1/notify/(6) routers/api/v1/org/(14) routers/api/v1/packages/(9) routers/api/v1/repo/(89) routers/api/v1/settings/(4) routers/api/v1/user/(19)',
    'routers/web/admin/(18) routers/web/auth/(16) routers/web/explore/(9) routers/web/feed/(7) routers/web/org/(24) routers/web/repo/(78) routers/web/shared/(12) routers/web/user/(31)',
  ].join(' ');

  const noiseInternalPackages = [
    'internal/db/engine.go internal/db/migrate.go internal/db/transactions.go',
    'internal/git/blob.go internal/git/commit.go internal/git/diff.go internal/git/log.go internal/git/ref.go internal/git/repo.go internal/git/tag.go internal/git/tree.go',
    'internal/log/manager.go internal/log/event.go internal/log/writer.go',
    'internal/queue/manager.go internal/queue/base_channel.go internal/queue/base_redis.go',
    'internal/ssh/server.go internal/ssh/client.go internal/ssh/key.go',
    'internal/storage/local.go internal/storage/minio.go internal/storage/s3.go',
  ].join('\n');

  const noiseContext = `This is a large monolithic Go web application for self-hosted Git. It uses a layered architecture where HTTP entry flows through cmd/ → routers/ → services/ → models/. The chi router handles both web UI and REST API routing under routers/web/ and routers/api/v1/ respectively. Private API for Gitea SSH hooks lives at routers/private/. Authentication supports multiple strategies via a pluggable source/provider pattern under services/auth/source/: db, ldap, oauth2, pam, smtp, sspi. Each strategy implements the Source interface. LDAP supports both BindDN and simple-auth modes. OAuth2 supports GitHub, GitLab, Google, Facebook, Discord, Gitea, Nextcloud, OpenID Connect, and custom providers. WebAuthn passkeys use go-webauthn/webauthn. The modules/ layer handles cross-cutting concerns: git operations (via git CLI subprocess), markup rendering (markdown/orgmode/asciidoc), package registry (helm/npm/nuget/pypi/maven/rubygems/cargo/pub/conda), full-text search indexing (bleve/elasticsearch/meilisearch), queue (in-memory channel or Redis), graceful server restart. Database layer uses xorm ORM with migrations tracked in models/migrations/ (305 migrations). Supports MySQL 5.7+, MariaDB 10.3+, PostgreSQL 12+, MSSQL 2012+, SQLite3. Config via INI file at custom/conf/app.ini; all settings documented at docs.gitea.com/administration/config-cheat-sheet. Frontend: Vue 3 SFCs compiled by Vite+esbuild under web_src/js/. Fomantic-UI (Semantic UI fork) provides base CSS. SVG icons in web_src/svg/. TypeScript strict mode. Test suite: vitest (frontend unit), Playwright (e2e), Go test (backend unit), and integration tests run via make targets. CI: GitHub Actions with matrix of DB backends. External integrations: MinIO/S3 for object storage, Prometheus for metrics, Azure Blob, AWS S3, GitHub API for OAuth. Deployment: single static binary, Docker (standard + rootless), systemd unit, Kubernetes via Helm chart in contrib/.`;

  return `---CHODE v2---

---DNA---
@STACK ${BASE_STACK}
@FRONTEND ${BASE_FRONTEND}
@CI ${BASE_CI}
@PKG ${BASE_PKG}
@TEST ${BASE_TEST}
@CONFIG ${BASE_CONFIG}
@ENTRY ${BASE_ENTRY}
@ROUTES ${BASE_ROUTES}
@DATA ${BASE_DATA}
@ENTITIES ${BASE_ENTITIES}
@AUTH ${BASE_AUTH}
@API ${BASE_API}
@ARCH ${BASE_ARCH}
@PACKAGES ${BASE_PACKAGES}
@STRUCT ${BASE_STRUCT}
@PATTERNS ${BASE_PATTERNS}
@MIDDLEWARE ${BASE_MIDDLEWARE}
@MODULES_DETAIL ${noiseModulePaths}
@ROUTER_BREAKDOWN routers/api/v1/(157 handlers across admin,misc,notify,org,packages,repo,settings,user) routers/web/(195 handlers across admin,auth,explore,feed,org,repo,shared,user) routers/private/(12 internal hooks)
@SERVICES_DETAIL services/agit/(7) services/auth/(28) services/convert/(12) services/federation/(3) services/gitdiff/(8) services/markup/(4) services/mirror/(6) services/notify/(4) services/pull/(9) services/release/(3) services/repository/(18) services/user/(8) services/webhook/(6)
@DB_ENGINES xorm mysql pq sqlite3 mssql go-sqlite3 modernc-sqlite
@SEARCH_BACKENDS bleve elasticsearch meilisearch
@QUEUE_BACKENDS channel redis redis-cluster persistable-channel
@PACKAGE_REGISTRIES helm npm nuget pypi maven rubygems cargo pub conda generic
@OAUTH_PROVIDERS github gitlab google facebook discord gitea nextcloud openid-connect custom
@STORAGE_BACKENDS local minio s3 azure-blob
@DEPLOY_TARGETS binary docker docker-rootless kubernetes helm-chart systemd launchd openrc

---CONTEXT---
@PURPOSE ${BASE_PURPOSE}
@CONVENTIONS ${BASE_CONVENTIONS}
@TESTING ${BASE_TESTING}
@SETUP Run \`make build\` to compile. Requires Go 1.21+. Frontend: \`make frontend\`. Watch mode: \`make watch\`. All make targets documented in Makefile. Run \`make generate\` after changing swagger or templates.
@ENV APP_NAME GITEA_WORK_DIR GITEA_CUSTOM RUN_MODE LOG_LEVEL DB_TYPE DB_HOST DB_NAME DB_USER DB_PASSWD SSH_DOMAIN HTTP_PORT ROOT_URL DISABLE_REGISTRATION REQUIRE_SIGNIN_VIEW SECRET_KEY INTERNAL_TOKEN LFS_JWT_SECRET OAUTH2_JWT_SECRET
@DEPLOY Single binary. Docker: gitea/gitea (standard + rootless). Config: custom/conf/app.ini. Migrations auto-run on start. Supports MySQL/MariaDB/PostgreSQL/MSSQL/SQLite3. Kubernetes via contrib/helm/.
@GOTCHAS Always run \`make fmt\` before committing. Git operations shell out to the git binary. WebAuthn requires HTTPS. LFS requires separate config. SSH server can conflict with host sshd; use non-standard port or app.ini SSH config. Package registry is optional module, disabled by default in some builds.
@INTERNALS ${noiseContext}
@INTERNAL_FILES ${noiseInternalPackages}
`;
}

// ── Token estimator ───────────────────────────────────────────────────────────

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ── Stump questions for Gitea (subset of 4, all high-signal) ─────────────────

type QuestionDef = { id: string; topic: string; text: string };

const DENSITY_QUESTIONS: QuestionDef[] = [
  {
    id: 'Q1',
    topic: 'Package managers',
    text: 'What package managers does this project use? List all of them.',
  },
  {
    id: 'Q2',
    topic: 'Pre-commit requirement',
    text: 'What command must you run before committing code?',
  },
  {
    id: 'Q3',
    topic: 'Auth methods',
    text: 'What authentication methods does this project support? List as many as the profile mentions.',
  },
  {
    id: 'Q4',
    topic: 'Migration count',
    text: 'How many database migration files does this project have?',
  },
];

// Ground truth for auto-scoring
type GroundTruth = { must: string[]; good: string[] };

const DENSITY_GT: Record<string, GroundTruth> = {
  Q1: { must: ['pnpm', 'gomod'], good: ['uv'] },
  Q2: { must: ['make fmt'],      good: [] },
  Q3: { must: ['ldap', 'oauth', 'webauthn'], good: ['pam', 'openid', 'smtp', 'password'] },
  Q4: { must: ['305'],           good: [] },
};

// ── API ───────────────────────────────────────────────────────────────────────

type QueryResult = { content: string; promptTokens: number; completionTokens: number };

const INTER_REQUEST_DELAY_MS = 2000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queryOpenRouter(model: string, apiKey: string, prompt: string): Promise<QueryResult> {
  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = Math.pow(2, attempt - 1) * 1500;
      console.log(`    [retry ${attempt}/${MAX_RETRIES}] waiting ${backoff}ms…`);
      await sleep(backoff);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Density Benchmark',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 2000;
      console.log(`    [rate limited] waiting ${wait}ms…`);
      lastError = new Error('OpenRouter rate limited (429)');
      await sleep(wait);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`OpenRouter error ${res.status}: ${body}`);
      if (res.status >= 500) continue;
      throw lastError;
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
      usage?: { prompt_tokens: number; completion_tokens: number };
    };
    if (data.error) throw new Error(`OpenRouter: ${data.error.message}`);
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('OpenRouter returned empty response');

    await sleep(INTER_REQUEST_DELAY_MS);
    return {
      content,
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    };
  }

  throw lastError;
}

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(profile: string, questions: QuestionDef[]): string {
  const n = questions.length;
  const last = questions[n - 1]?.id ?? `Q${n}`;
  const questionList = questions.map(q => `${q.id}: ${q.text}`).join('\n');

  return `You are participating in a controlled benchmark. You will be given a .chode profile — a compressed description of a software repository — and must answer ${n} questions using ONLY the information in the profile.

RULES:
1. Use ONLY what is written in the .chode profile. Do not use prior knowledge about this repository or its ecosystem.
2. If the information is not in the profile, answer: "Not in profile."
3. Answer all ${n} questions in order.
4. Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line. Do not repeat the question text.

Example format:
Q1:
Go and TypeScript.

Q2:
Chi (backend), Vue 3 (frontend).

THE .CHODE PROFILE:
${profile}

THE ${n} QUESTIONS:
${questionList}

Now answer Q1 through ${last} using the format shown above.`;
}

// ── Answer parser ─────────────────────────────────────────────────────────────

function parseAnswers(raw: string, questions: QuestionDef[]): Map<string, string> {
  const answers = new Map<string, string>();
  const maxQ = Math.max(...questions.map(q => parseInt(q.id.slice(1))));

  const blocks = raw.split(/\n(?=Q(\d{1,2})[:.)\s])/);

  for (const block of blocks) {
    const labelMatch = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!labelMatch) continue;
    const num = parseInt(labelMatch[1]!);
    if (num < 1 || num > maxQ) continue;

    let body = block
      .replace(/^Q\d{1,2}[:.)\s]+/, '')
      .replace(/^[A-Z]\d{1,2}[:.]\s*/m, '')
      .trim();

    if (body) answers.set(`Q${num}`, body);
  }

  return answers;
}

// ── Auto-scorer ───────────────────────────────────────────────────────────────

type ScoreResult = { score: number; reason: string };

function autoScore(qId: string, answer: string, gt: GroundTruth): ScoreResult {
  const a = answer.toLowerCase();

  const hasAllMust = gt.must.length === 0 || gt.must.every(t => a.includes(t.toLowerCase()));
  const hasAnyMust = gt.must.length === 0 || gt.must.some(t => a.includes(t.toLowerCase()));
  const goodCount = gt.good.filter(t => a.includes(t.toLowerCase())).length;

  if (!hasAnyMust) return { score: 0, reason: `missing: ${gt.must.join(', ')}` };
  if (!hasAllMust) return { score: 1, reason: 'partial must-haves' };
  if (gt.good.length > 0 && goodCount === 0) return { score: 2, reason: `has must, missing good: ${gt.good.join(', ')}` };
  return { score: 3, reason: goodCount > 0 ? `all must + ${goodCount} good` : 'all must present' };
}

// ── Density level definition ─────────────────────────────────────────────────

type DensityLevel = {
  name: string;
  label: string;
  description: string;
  profile: string;
};

function buildDensityLevels(): DensityLevel[] {
  return [
    {
      name: 'minimal',
      label: 'Minimal',
      description: '@STACK @ENTRY @PKG only — bare minimum structural facts',
      profile: buildMinimalProfile(),
    },
    {
      name: 'standard',
      label: 'Standard',
      description: 'Normal v2 profile as-is — all DNA fields + PURPOSE/CONVENTIONS/TESTING',
      profile: buildStandardProfile(),
    },
    {
      name: 'verbose',
      label: 'Verbose',
      description: 'Extended @STRUCT and @PACKAGES, extra context fields (~800 tokens)',
      profile: buildVerboseProfile(),
    },
    {
      name: 'maximum',
      label: 'Maximum',
      description: 'Full breakdown noise — module paths, router detail, internal files (~1500 tokens)',
      profile: buildMaximumProfile(),
    },
  ];
}

// ── Run one model × one density level ────────────────────────────────────────

type RunResult = {
  answers: Map<string, string>;
  scores: Map<string, ScoreResult>;
  raw: string;
  promptTokens: number;
  completionTokens: number;
};

async function runDensityLevel(
  model: string,
  apiKey: string,
  level: DensityLevel,
): Promise<RunResult> {
  const prompt = buildPrompt(level.profile, DENSITY_QUESTIONS);
  const result = await queryOpenRouter(model, apiKey, prompt);

  const answers = parseAnswers(result.content, DENSITY_QUESTIONS);
  const scores = new Map<string, ScoreResult>();

  for (const q of DENSITY_QUESTIONS) {
    const answer = answers.get(q.id) ?? '';
    const gt = DENSITY_GT[q.id];
    if (gt) scores.set(q.id, autoScore(q.id, answer, gt));
  }

  return {
    answers,
    scores,
    raw: result.content,
    promptTokens: result.promptTokens,
    completionTokens: result.completionTokens,
  };
}

// ── Accuracy computation ──────────────────────────────────────────────────────

function computeAccuracy(scores: Map<string, ScoreResult>): number {
  const vals = [...scores.values()];
  if (vals.length === 0) return 0;
  const total = vals.reduce((n, s) => n + s.score, 0);
  const max = vals.length * 3;
  return Math.round(total / max * 100);
}

// ── Output builder ────────────────────────────────────────────────────────────

type ModelResults = {
  model: string;
  modelSlug: string;
  levels: Array<{
    level: DensityLevel;
    tokens: number;
    result: RunResult;
    accuracy: number;
  }>;
};

function buildOutput(
  allResults: ModelResults[],
  levels: DensityLevel[],
  timestamp: string,
): string {
  const date = new Date().toISOString().slice(0, 10);

  // Summary table header
  const modelNames = allResults.map(r => r.model);
  const headerCells = ['density_level', 'tokens', ...modelNames.map(m => {
    const short = m.includes('/') ? m.split('/')[1]! : m;
    return short.replace(/-preview$/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '');
  })];
  const dividerCells = headerCells.map(() => '---');

  const summaryRows: string[] = [];
  for (const level of levels) {
    const tokenCount = estimateTokens(level.profile);
    const cells: string[] = [level.label, `~${tokenCount}`];
    for (const mr of allResults) {
      const lr = mr.levels.find(l => l.level.name === level.name);
      cells.push(lr ? `${lr.accuracy}%` : 'ERR');
    }
    summaryRows.push(`| ${cells.join(' | ')} |`);
  }

  // Per-question breakdown per model × level
  const perModelSections: string[] = [];

  for (const mr of allResults) {
    const modelShort = mr.model.includes('/') ? mr.model.split('/')[1]! : mr.model;
    let section = `## ${mr.model}\n\n`;

    for (const lr of mr.levels) {
      const tokens = estimateTokens(lr.level.profile);
      section += `### ${lr.level.label} (~${tokens} tokens)\n\n`;
      section += `**Description:** ${lr.level.description}\n\n`;
      section += `**Accuracy:** ${lr.accuracy}%\n\n`;

      // Per-question scores
      section += `| Q | Topic | Answer (truncated) | Score | Reason |\n`;
      section += `|---|---|---|---|---|\n`;
      for (const q of DENSITY_QUESTIONS) {
        const answer = lr.result.answers.get(q.id) ?? '_(not parsed)_';
        const short = answer.length > 120 ? answer.slice(0, 120).replace(/\s+\S*$/, '…') : answer;
        const escaped = short.replace(/\|/g, '\\|').replace(/\n/g, ' ');
        const scoreResult = lr.result.scores.get(q.id);
        const scoreCell = scoreResult ? `${scoreResult.score}/3` : '?';
        const reasonCell = scoreResult ? scoreResult.reason.replace(/\|/g, '\\|') : '-';
        section += `| ${q.id} | ${q.topic} | ${escaped} | ${scoreCell} | ${reasonCell} |\n`;
      }
      section += `\n`;
      section += `**Token usage:** ${lr.result.promptTokens} prompt + ${lr.result.completionTokens} completion\n\n`;
    }

    // Raw responses
    for (const lr of mr.levels) {
      section += `<details>\n<summary>${lr.level.label} — raw response</summary>\n\n\`\`\`\n${lr.result.raw}\n\`\`\`\n\n</details>\n\n`;
    }

    perModelSections.push(section);
  }

  return `# CHODE Density Test — ${date}

> Hypothesis: there is a sweet spot for profile density. Too sparse = missing facts, too dense = attention dilutes.
> Subject: Gitea (.chode profile at 4 density levels)
> Questions: ${DENSITY_QUESTIONS.length} stump questions (all require reading the profile)

---

## Summary Table

| ${headerCells.join(' | ')} |
| ${dividerCells.join(' | ')} |
${summaryRows.join('\n')}

### Question Set
${DENSITY_QUESTIONS.map(q => `- **${q.id}** (${q.topic}): ${q.text}`).join('\n')}

### Ground Truth
- **Q1** (Package managers): must have pnpm + gomod; bonus: uv
- **Q2** (Pre-commit): must have "make fmt"
- **Q3** (Auth methods): must have ldap + oauth + webauthn; bonus: pam/openid/smtp/password
- **Q4** (Migration count): must have "305"

### Scoring
Each question scored 0–3: 0=missing key terms, 1=partial, 2=all required, 3=all required + bonus depth.
Accuracy = total score / (questions × 3) as a percentage.

---

## Density Level Profiles

| Level | Tokens | Description |
|---|---|---|
${levels.map(l => `| ${l.label} | ~${estimateTokens(l.profile)} | ${l.description} |`).join('\n')}

---

${perModelSections.join('---\n\n')}
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const apiKey = get('--key') ?? process.env['OPENROUTER_API_KEY'];
  if (!apiKey) {
    console.error('Error: --key <openrouter-api-key> or OPENROUTER_API_KEY env var required');
    process.exit(1);
  }

  const MODELS = [
    'openai/gpt-4o',
    'google/gemini-2.5-flash',
  ];

  const levels = buildDensityLevels();

  console.log('\nCHODE Density Test');
  console.log('  Subject: Gitea');
  console.log(`  Questions: ${DENSITY_QUESTIONS.length} (stump)`);
  console.log(`  Density levels: ${levels.length} (${levels.map(l => l.label).join(' → ')})`);
  console.log(`  Models: ${MODELS.join(', ')}`);
  console.log(`  Total API calls: ${MODELS.length * levels.length}`);
  console.log();

  // Print profile token estimates
  for (const level of levels) {
    const tokens = estimateTokens(level.profile);
    console.log(`  ${level.label.padEnd(10)} ~${tokens} tokens`);
  }
  console.log();

  const allResults: ModelResults[] = [];

  for (const model of MODELS) {
    const modelSlug = model.replace(/[:/]/g, '-');
    console.log(`\n  Model: ${model}`);

    const modelResult: ModelResults = {
      model,
      modelSlug,
      levels: [],
    };

    for (const level of levels) {
      const tokens = estimateTokens(level.profile);
      process.stdout.write(`    ${level.label.padEnd(10)} (~${tokens} tok) … `);

      try {
        const result = await runDensityLevel(model, apiKey, level);
        const accuracy = computeAccuracy(result.scores);

        // Per-question mini-display
        const scoreStr = DENSITY_QUESTIONS.map(q => {
          const s = result.scores.get(q.id);
          return s ? `${q.id}=${s.score}` : `${q.id}=?`;
        }).join(' ');

        console.log(`${accuracy}% [${scoreStr}]`);

        modelResult.levels.push({ level, tokens, result, accuracy });
      } catch (e) {
        console.log(`ERROR: ${e}`);
        // Push a placeholder with 0% so output still renders
        modelResult.levels.push({
          level,
          tokens,
          result: {
            answers: new Map(),
            scores: new Map(),
            raw: `ERROR: ${e}`,
            promptTokens: 0,
            completionTokens: 0,
          },
          accuracy: 0,
        });
      }
    }

    allResults.push(modelResult);
  }

  // Print summary table to console
  console.log('\n\n  ── Summary ─────────────────────────────────────────────────');
  const modelShorts = MODELS.map(m => m.split('/')[1] ?? m);
  const headerRow = ['Level', 'Tokens', ...modelShorts].map(h => h.padEnd(14)).join('  ');
  console.log(`  ${headerRow}`);
  console.log(`  ${'─'.repeat(headerRow.length)}`);

  for (const level of levels) {
    const tokens = estimateTokens(level.profile);
    const cols: string[] = [level.label, `~${tokens}`];
    for (const mr of allResults) {
      const lr = mr.levels.find(l => l.level.name === level.name);
      cols.push(lr ? `${lr.accuracy}%` : 'ERR');
    }
    console.log(`  ${cols.map(c => c.padEnd(14)).join('  ')}`);
  }
  console.log();

  // Save output
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `density-test-${timestamp}.md`);

  const output = buildOutput(allResults, levels, timestamp);
  await writeFile(outFile, output, 'utf8');

  console.log(`  Results saved: ${outFile}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
