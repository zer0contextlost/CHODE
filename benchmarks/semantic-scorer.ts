#!/usr/bin/env node
/**
 * CHODE Semantic Re-Scorer
 * Re-scores existing benchmark result files using semantic equivalence rules
 * instead of strict substring matching.
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/semantic-scorer.ts
 *   node --experimental-strip-types benchmarks/semantic-scorer.ts --file results/gitea-openai-gpt-4o-2026-04-17.md
 *   node --experimental-strip-types benchmarks/semantic-scorer.ts --repo gitea
 *   node --experimental-strip-types benchmarks/semantic-scorer.ts --repo gitea --mode chode
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Types ─────────────────────────────────────────────────────────────────────

type GroundTruth = {
  must: string[];
  good: string[];
  note?: string;
};

type ScoreResult = { score: number; auto: boolean; reason: string };

// ── Ground Truth (duplicated from benchmark.ts) ───────────────────────────────
// Per-repo question sets ground truth

const FASTAPI_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['uv'],                        good: [] },
  Q2:  { must: ['starlette'],                 good: [] },
  Q3:  { must: ['pydantic'],                  good: [] },
  Q4:  { must: ['applications.py'],           good: [] },
  Q5:  { must: ['routing.py'],                good: [] },
  Q6:  { must: ['toml'],                      good: [] },
  Q7:  { must: ['middleware'],                good: ['event'] },
  Q8:  { must: ['github'],                    good: ['actions'] },
  Q9:  { must: ['standard'],                  good: ['fastapi'] },
  Q10: { must: ['docs'],                      good: ['457', '53'] },
  Q11: { must: ['library'],                   good: ['framework'] },
  Q12: { must: ['api', 'python'],             good: ['fast', 'type'] },
};

const RAILS_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['resque'],                    good: [] },
  Q2:  { must: ['rollup'],                    good: [] },
  Q3:  { must: ['karma'],                     good: ['qunit'] },
  Q4:  { must: ['activerecord'],              good: ['1143'] },
  Q5:  { must: ['puma'],                      good: [] },
  Q6:  { must: ['redis'],                     good: [] },
  Q7:  { must: ['bin/test'],                  good: ['cd'] },
  Q8:  { must: ['with'],                      good: ['object'] },
  Q9:  { must: ['bundler'],                   good: [] },
  Q10: { must: ['yarn'],                      good: [] },
  Q11: { must: ['bcrypt'],                    good: [] },
  Q12: { must: ['10'],                        good: [] },
};

const NEXTJS_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['pnpm'],                      good: [] },
  Q2:  { must: ['rust'],                      good: [] },
  Q3:  { must: ['cargo'],                     good: [] },
  Q4:  { must: ['playwright', 'vitest'],      good: [] },
  Q5:  { must: ['slack'],                     good: [] },
  Q6:  { must: ['next-routing'],              good: ['packages/'] },
  Q7:  { must: ['next-routing'],              good: ['packages/'] },
  Q8:  { must: ['repository', 'factory', 'plugin'], good: [] },
  Q9:  { must: ['examples'],                  good: ['4'] },
  Q10: { must: ['auth'],                      good: ['github'] },
  Q11: { must: ['tailwind'],                  good: [] },
  Q12: { must: ['turbopack'],                 good: ['2800'] },
};

const GITEA_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['pnpm', 'gomod'],             good: ['uv'] },
  Q2:  { must: ['chi'],                        good: [] },
  Q3:  { must: ['vue'],                        good: ['esbuild', 'vite'] },
  Q4:  { must: ['ini'],                        good: [] },
  Q5:  { must: ['main.go'],                    good: [] },
  Q6:  { must: ['routers'],                    good: [] },
  Q7:  { must: ['common'],                     good: ['routers/common'] },
  Q8:  { must: ['305'],                        good: [] },
  Q9:  { must: ['ldap', 'oauth', 'webauthn'],  good: ['pam', 'openid', 'smtp', 'password'] },
  Q10: { must: ['cmd', 'routes', 'svc', 'mdl'], good: [] },
  Q11: { must: ['azure', 'aws', 'minio'],      good: ['prometheus'] },
  Q12: { must: ['make fmt'],                   good: [] },
};

const DJANGO_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['python'],                    good: [] },
  Q2:  { must: ['ini'],                        good: [] },
  Q3:  { must: ['pip'],                        good: ['npm'] },
  Q4:  { must: ['puppeteer'],                  good: ['qunit'] },
  Q5:  { must: ['github'],                     good: ['actions'] },
  Q6:  { must: ['middleware'],                 good: [] },
  Q7:  { must: ['admindocs', 'middleware'],    good: ['django/contrib'] },
  Q8:  { must: ['923'],                        good: [] },
  Q9:  { must: ['django'],                     good: ['3.6', '3600'] },
  Q10: { must: ['framework'],                  good: [] },
  Q11: { must: ['python', 'web'],              good: ['rapid', 'pragmatic'] },
  Q12: { must: ['80', '83', '923'],            good: [] },
};

const LARAVEL_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['php'],                        good: [] },
  Q2:  { must: ['phpunit'],                    good: [] },
  Q3:  { must: ['npm'],                        good: [] },
  Q4:  { must: ['routes'],                     good: [] },
  Q5:  { must: ['factory'],                    good: [] },
  Q6:  { must: ['session_driver', 'session'],  good: ['lifetime', 'encrypt'] },
  Q7:  { must: ['db_connection'],              good: [] },
  Q8:  { must: ['bcrypt'],                     good: ['rounds'] },
  Q9:  { must: ['github'],                     good: ['actions'] },
  Q10: { must: ['http', 'models', 'providers'], good: [] },
  Q11: { must: ['framework', 'skeleton'],      good: [] },
  Q12: { must: ['php', 'web'],                 good: ['elegant', 'expressive'] },
};

const PHOENIX_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['elixir'],                     good: [] },
  Q2:  { must: ['ecto'],                       good: [] },
  Q3:  { must: ['plug'],                       good: [] },
  Q4:  { must: ['mix'],                        good: ['npm'] },
  Q5:  { must: ['mix test'],                   good: ['jest'] },
  Q6:  { must: ['gettext'],                    good: [] },
  Q7:  { must: ['preload'],                    good: [] },
  Q8:  { must: ['string'],                     good: [] },
  Q9:  { must: ['postgres'],                   good: ['ecto.adapters'] },
  Q10: { must: ['github'],                     good: ['actions'] },
  Q11: { must: ['installer'],                  good: ['106'] },
  Q12: { must: ['framework'],                  good: ['elixir'] },
};

const RIPGREP_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['rust'],                       good: [] },
  Q2:  { must: ['cargo'],                      good: [] },
  Q3:  { must: ['anyhow'],                     good: [] },
  Q4:  { must: ['serde'],                      good: ['serde_json', 'json'] },
  Q5:  { must: ['main.rs'],                    good: ['crates/core'] },
  Q6:  { must: ['github'],                     good: ['actions'] },
  Q7:  { must: ['-uuu'],                       good: [] },
  Q8:  { must: ['cargo-fuzz', 'cargo install'], good: [] },
  Q9:  { must: ['crates'],                     good: ['136'] },
  Q10: { must: ['windows'],                    good: ['brew'] },
  Q11: { must: ['cli'],                        good: ['tool'] },
  Q12: { must: ['search', 'regex'],            good: ['recursive', 'gitignore'] },
};

const GHCLI_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['go'],                         good: [] },
  Q2:  { must: ['cobra'],                      good: [] },
  Q3:  { must: ['yes', 'grpc'],                good: [] },
  Q4:  { must: ['make test'],                  good: [] },
  Q5:  { must: ['gen-docs', 'main.go'],        good: ['cmd/'] },
  Q6:  { must: ['pkg', '688'],                 good: [] },
  Q7:  { must: ['godoc'],                      good: [] },
  Q8:  { must: ['em dash'],                    good: ['—'] },
  Q9:  { must: ['blackbox'],                   good: [] },
  Q10: { must: ['testscript'],                 good: ['go-internal'] },
  Q11: { must: ['github'],                     good: ['actions'] },
  Q12: { must: ['github', 'cli'],              good: ['pull request', 'terminal'] },
};

// Generic 30-question ground truth
const GITEA_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['go'],          good: ['typescript', 'ts', 'vue'] },
  Q2:  { must: ['chi'],         good: ['vue', 'vite'] },
  Q3:  { must: ['mysql', 'sqlite'], good: ['mssql', 'redis', 'postgres', 'pq'] },
  Q4:  { must: ['pnpm', 'gomod'], good: ['uv'] },
  Q5:  { must: ['git', 'self-host'], good: ['easy', 'fast', 'gogs'] },
  Q6:  { must: ['main.go'],     good: [] },
  Q7:  { must: [],              good: [] },
  Q8:  { must: ['routers'],     good: ['api/v1', 'ro/'] },
  Q9:  { must: ['models'],        good: ['mdl/', 'migrations'] },
  Q10: { must: ['web_src'],     good: ['vue', 'ts'] },
  Q11: { must: ['layered'],     good: ['cmd', 'routes', 'svc', 'mdl'] },
  Q12: { must: ['fullstack'],   good: ['cli'] },
  Q13: { must: ['ini'],         good: [] },
  Q14: { must: ['no', 'not'],   good: [] },
  Q15: { must: ['ldap', 'oauth', 'webauthn'], good: ['pam', 'openid', 'jwt', 'password'] },
  Q16: { must: ['actions', 'issues', 'organization'], good: ['auth', 'packages', 'git', 'perm'] },
  Q17: { must: ['azure', 'aws', 'github'], good: ['minio', 'prometheus'] },
  Q18: { must: ['playwright', 'vitest'], good: ['make test'] },
  Q19: { must: ['make test'],   good: ['test-backend', 'test-frontend'] },
  Q20: { must: ['github'],      good: ['actions', 'github-actions'] },
  Q21: { must: ['routers'],     good: ['api/v1', 'api', 'ro/'] },
  Q22: { must: ['models/migrations', 'migration'], good: ['305'] },
  Q23: { must: ['svc'],         good: ['services', 'mod/'] },
  Q24: { must: ['routers/common', 'common/'],  good: [] },
  Q25: { must: ['not'],         good: [] },
  Q26: { must: ['modules', 'models', 'services'], good: ['routers', 'cmd'] },
  Q27: { must: ['main.go', 'cmd/'], good: ['install', 'ro/install'] },
  Q28: { must: ['layered', 'strategy'], good: ['repository', 'middleware'] },
  Q29: { must: [],              good: ['database', 'ini'] },
  Q30: { must: ['make fmt'],    good: ['test', 'styleguide', 'contributing'] },
};

const FASTAPI_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['python'],                  good: ['starlette', 'type'] },
  Q2:  { must: ['starlette'],               good: ['fastapi', 'pydantic'] },
  Q3:  { must: [],                          good: [] },
  Q4:  { must: ['uv'],                      good: [] },
  Q5:  { must: ['api', 'python'],           good: ['fast', 'performance', 'type'] },
  Q6:  { must: ['applications.py'],         good: [] },
  Q7:  { must: ['not'],                     good: [] },
  Q8:  { must: ['routing.py'],              good: ['fastapi/'] },
  Q9:  { must: [],                          good: [] },
  Q10: { must: ['not'],                     good: [] },
  Q11: { must: ['middleware'],              good: ['event'] },
  Q12: { must: ['library'],                 good: ['framework'] },
  Q13: { must: ['toml'],                    good: [] },
  Q14: { must: [],                          good: [] },
  Q15: { must: [],                          good: [] },
  Q16: { must: [],                          good: [] },
  Q17: { must: ['not'],                     good: [] },
  Q18: { must: [],                          good: [] },
  Q19: { must: [],                          good: [] },
  Q20: { must: ['github'],                  good: ['actions'] },
  Q21: { must: ['routing.py'],              good: ['fastapi/'] },
  Q22: { must: ['not'],                     good: [] },
  Q23: { must: ['fastapi'],                 good: [] },
  Q24: { must: [],                          good: [] },
  Q25: { must: ['not'],                     good: [] },
  Q26: { must: ['fastapi'],                 good: ['docs_src'] },
  Q27: { must: ['applications.py'],         good: [] },
  Q28: { must: ['middleware'],              good: ['event'] },
  Q29: { must: [],                          good: [] },
  Q30: { must: [],                          good: [] },
};

const RAILS_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['ruby'],                    good: ['javascript', 'js'] },
  Q2:  { must: ['rails'],                   good: ['actionpack', 'rack'] },
  Q3:  { must: [],                          good: [] },
  Q4:  { must: ['bundler'],                 good: ['yarn'] },
  Q5:  { must: ['ruby'],                    good: ['web', 'framework', 'mvc', 'full'] },
  Q6:  { must: [],                          good: ['railties'] },
  Q7:  { must: ['monorepo'],                good: ['activerecord', 'actionpack', 'gems'] },
  Q8:  { must: ['actionpack'],              good: [] },
  Q9:  { must: ['activerecord'],            good: ['migration'] },
  Q10: { must: ['actionview'],              good: ['js'] },
  Q11: { must: [],                          good: ['mvc', 'modular'] },
  Q12: { must: ['framework'],               good: ['library', 'fullstack'] },
  Q13: { must: [],                          good: [] },
  Q14: { must: [],                          good: [] },
  Q15: { must: [],                          good: [] },
  Q16: { must: ['activerecord', 'actionpack', 'activesupport'], good: ['actionview', 'railties', 'activejob'] },
  Q17: { must: ['redis'],                   good: ['puma', 'resque'] },
  Q18: { must: ['minitest'],                good: ['karma', 'qunit'] },
  Q19: { must: ['bin/test'],                good: ['cd'] },
  Q20: { must: ['github'],                  good: ['actions'] },
  Q21: { must: ['actionpack'],              good: [] },
  Q22: { must: ['activerecord'],            good: ['migration'] },
  Q23: { must: ['activerecord', 'activesupport'], good: ['actionpack'] },
  Q24: { must: ['actionpack'],              good: ['middleware', 'rack'] },
  Q25: { must: [],                          good: [] },
  Q26: { must: ['activerecord', 'activesupport', 'actionpack'], good: ['railties', 'actionview'] },
  Q27: { must: ['railties'],                good: [] },
  Q28: { must: [],                          good: ['mvc', 'middleware', 'activerecord'] },
  Q29: { must: [],                          good: [] },
  Q30: { must: ['bin/test'],                good: ['cd', 'component'] },
};

const NEXTJS_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['typescript'],              good: ['javascript', 'rust'] },
  Q2:  { must: ['react'],                   good: ['next', 'tailwind', 'zod'] },
  Q3:  { must: [],                          good: [] },
  Q4:  { must: ['pnpm'],                    good: ['cargo'] },
  Q5:  { must: [],                          good: [] },
  Q6:  { must: ['next-routing'],            good: ['packages/'] },
  Q7:  { must: ['monorepo'],                good: ['packages', 'turbopack', 'crates'] },
  Q8:  { must: ['next-routing'],            good: ['packages/'] },
  Q9:  { must: [],                          good: [] },
  Q10: { must: ['packages'],                good: ['react', 'next'] },
  Q11: { must: [],                          good: ['plugin', 'modular'] },
  Q12: { must: ['framework'],               good: ['library'] },
  Q13: { must: [],                          good: [] },
  Q14: { must: [],                          good: [] },
  Q15: { must: [],                          good: [] },
  Q16: { must: [],                          good: [] },
  Q17: { must: ['slack'],                   good: [] },
  Q18: { must: ['playwright', 'vitest'],    good: [] },
  Q19: { must: ['test-dev-turbo'],          good: ['pnpm'] },
  Q20: { must: ['github'],                  good: ['actions'] },
  Q21: { must: ['next-routing'],            good: ['packages/'] },
  Q22: { must: [],                          good: [] },
  Q23: { must: ['packages', 'turbopack'],   good: [] },
  Q24: { must: ['next-routing'],            good: [] },
  Q25: { must: [],                          good: [] },
  Q26: { must: ['packages', 'turbopack', 'crates'], good: [] },
  Q27: { must: [],                          good: [] },
  Q28: { must: ['repository', 'factory', 'plugin'], good: [] },
  Q29: { must: [],                          good: [] },
  Q30: { must: [],                          good: ['contributing'] },
};

// Combined lookups
const REPO_GT: Record<string, Record<string, GroundTruth>> = {
  gitea:   GITEA_Q_GT,
  fastapi: FASTAPI_Q_GT,
  rails:   RAILS_Q_GT,
  nextjs:  NEXTJS_Q_GT,
  django:  DJANGO_Q_GT,
  laravel: LARAVEL_Q_GT,
  phoenix: PHOENIX_Q_GT,
  ripgrep: RIPGREP_Q_GT,
  'gh-cli': GHCLI_Q_GT,
};

const GROUND_TRUTH_MAP: Record<string, Record<string, GroundTruth | null>> = {
  gitea:   GITEA_GROUND_TRUTH,
  fastapi: FASTAPI_GROUND_TRUTH,
  rails:   RAILS_GROUND_TRUTH,
  nextjs:  NEXTJS_GROUND_TRUTH,
};

// ── Semantic normalization ────────────────────────────────────────────────────

/** Language/tool abbreviation expansions. Each entry: [canonical, ...aliases] */
const ABBREV_MAP: Array<[string, ...string[]]> = [
  ['typescript', 'ts'],
  ['javascript', 'js'],
  ['python',     'py'],
  ['ruby',       'rb'],
  ['rust',       'rs'],
  ['golang',     'go'],          // "golang" maps to "go" for matching purposes
  ['github actions', 'gha', 'github-actions'],
  ['postgresql', 'postgres', 'pg', 'pq'],
  ['sqlite',     'sqlite3'],
  ['npm',        'node package manager'],
  ['yarn',       'yarnpkg'],
  ['pnpm',       'performant npm'],
  ['phpunit',    'php unit'],
  ['activerecord', 'active record', 'ar'],
  ['actionpack', 'action pack'],
  ['actionview', 'action view'],
  ['activesupport', 'active support'],
  ['activejob',  'active job'],
  ['railties',   'rail ties'],
];

/** Flag equivalences: all normalize to the canonical form */
const FLAG_EQUIVALENTS: Array<string[]> = [
  ['-uuu', '-u -u -u', '-u3', '--no-ignore --no-ignore-parent --no-ignore-vcs'],
];

/** Plural/singular pairs: [singular, plural] */
const PLURAL_MAP: Array<[string, string]> = [
  ['migration', 'migrations'],
  ['route',     'routes'],
  ['model',     'models'],
  ['handler',   'handlers'],
  ['provider',  'providers'],
  ['service',   'services'],
  ['package',   'packages'],
  ['plugin',    'plugins'],
  ['entity',    'entities'],
  ['repository', 'repositories'],
  ['middleware', 'middlewares'],
  ['framework',  'frameworks'],
  ['library',    'libraries'],
  ['test',       'tests'],
];

/**
 * Normalize an answer string for semantic matching:
 * 1. Lowercase
 * 2. Expand abbreviations to canonical forms
 * 3. Normalize flag equivalents
 * 4. Normalize plural/singular
 * 5. Collapse whitespace and punctuation
 */
function normalize(text: string): string {
  let s = text.toLowerCase();

  // Normalize flag equivalents — replace all variants with the canonical
  for (const group of FLAG_EQUIVALENTS) {
    const canonical = group[0]!;
    for (const variant of group) {
      if (variant !== canonical) {
        s = s.split(variant).join(canonical);
      }
    }
  }

  // Normalize abbreviations: expand aliases → canonical
  for (const [canonical, ...aliases] of ABBREV_MAP) {
    for (const alias of aliases) {
      // Word-boundary aware replacement: match alias as whole token
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      s = s.replace(new RegExp(`\\b${escaped}\\b`, 'g'), canonical);
    }
  }

  // Normalize plural/singular: if answer has plural, also match singular (by adding singular)
  // We don't strip plurals — we ADD the singular form so matching works both ways.
  // But for contains-check purposes, we want: if gt says "migration" and answer says "migrations", pass.
  // We handle this in semanticContains instead.

  // Normalize punctuation clusters to spaces (keep alphanumeric, spaces, dots, slashes, hyphens)
  s = s.replace(/[,;:!?()[\]{}'"]+/g, ' ');
  // Collapse multiple spaces
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

/**
 * Semantic contains check: does `answer` contain `term`?
 * Applies all normalization + plural/singular flexibility.
 */
function semanticContains(answer: string, term: string): boolean {
  const normAnswer = normalize(answer);
  const normTerm = normalize(term);

  // Direct substring match after normalization
  if (normAnswer.includes(normTerm)) return true;

  // Plural/singular flexibility: if term is singular, also check plural (and vice versa)
  for (const [singular, plural] of PLURAL_MAP) {
    if (normTerm === singular && normAnswer.includes(plural)) return true;
    if (normTerm === plural && normAnswer.includes(singular)) return true;
  }

  // Flag equivalents: if term is any variant, check if answer has any variant
  for (const group of FLAG_EQUIVALENTS) {
    if (group.includes(normTerm)) {
      for (const variant of group) {
        if (normAnswer.includes(normalize(variant))) return true;
      }
    }
  }

  // Abbreviation reverse-check: if term is canonical, check if answer has any alias
  for (const [canonical, ...aliases] of ABBREV_MAP) {
    if (normTerm === canonical) {
      for (const alias of aliases) {
        if (normAnswer.includes(normalize(alias))) return true;
      }
    }
    // If term is an alias, check if answer has canonical or other aliases
    if (aliases.includes(normTerm)) {
      if (normAnswer.includes(canonical)) return true;
      for (const alias of aliases) {
        if (alias !== normTerm && normAnswer.includes(alias)) return true;
      }
    }
  }

  return false;
}

// ── Strict scorer (original logic, replicated) ────────────────────────────────

const NOT_FOUND_PHRASES = [
  'not in profile', 'not explicitly stated', 'not mentioned',
  'not specified', 'cannot be determined', 'no information',
];

function strictScore(answer: string, gt: GroundTruth | null | undefined): ScoreResult {
  if (!gt) return { score: -1, auto: false, reason: 'manual' };
  if (gt.must.length === 0 && gt.good.length === 0) return { score: -1, auto: false, reason: 'manual' };

  const a = answer.toLowerCase();

  if (gt.must.length === 0 && NOT_FOUND_PHRASES.some(p => a.includes(p))) {
    return { score: 0, auto: true, reason: 'not in profile (no required terms)' };
  }

  const hasAllMust = gt.must.length === 0 || gt.must.every(t => a.includes(t.toLowerCase()));
  const hasAnyMust = gt.must.length === 0 || gt.must.some(t => a.includes(t.toLowerCase()));
  const goodCount = gt.good.filter(t => a.includes(t.toLowerCase())).length;

  if (!hasAnyMust) return { score: 0, auto: true, reason: `missing required: ${gt.must.join(', ')}` };
  if (!hasAllMust) return { score: 1, auto: true, reason: 'partial must-haves' };
  if (gt.good.length > 0 && goodCount === 0) return { score: 2, auto: true, reason: `has must, missing good: ${gt.good.join(', ')}` };
  return { score: 3, auto: true, reason: goodCount > 0 ? `has must + good (${goodCount}/${gt.good.length})` : 'all must present' };
}

// ── Semantic scorer ───────────────────────────────────────────────────────────

function semanticScore(answer: string, gt: GroundTruth | null | undefined): ScoreResult {
  if (!gt) return { score: -1, auto: false, reason: 'manual' };
  if (gt.must.length === 0 && gt.good.length === 0) return { score: -1, auto: false, reason: 'manual' };

  const a = answer.toLowerCase();

  if (gt.must.length === 0 && NOT_FOUND_PHRASES.some(p => a.includes(p))) {
    return { score: 0, auto: true, reason: 'not in profile (no required terms)' };
  }

  const hasAllMust = gt.must.length === 0 || gt.must.every(t => semanticContains(answer, t));
  const hasAnyMust = gt.must.length === 0 || gt.must.some(t => semanticContains(answer, t));
  const goodCount = gt.good.filter(t => semanticContains(answer, t)).length;

  const missingMust = gt.must.filter(t => !semanticContains(answer, t));

  if (!hasAnyMust) return { score: 0, auto: true, reason: `missing required: ${gt.must.join(', ')}` };
  if (!hasAllMust) return { score: 1, auto: true, reason: `partial must — missing: ${missingMust.join(', ')}` };
  if (gt.good.length > 0 && goodCount === 0) return { score: 2, auto: true, reason: `has must, missing good: ${gt.good.join(', ')}` };
  return { score: 3, auto: true, reason: goodCount > 0 ? `has must + good (${goodCount}/${gt.good.length})` : 'all must present' };
}

// ── Result file parser ────────────────────────────────────────────────────────

type ParsedResultFile = {
  filePath: string;
  fileName: string;
  model: string;
  repo: string;
  mode: 'chode' | 'baseline' | 'self-profile' | 'unknown';
  questionAnswers: Map<string, string>;    // qId → answer text (from scoring sheet)
  originalScores: Map<string, number>;     // qId → score (auto-scored, -1 = manual)
  isManual: Map<string, boolean>;
  groundTruthMap: Record<string, GroundTruth | null> | null;
};

/**
 * Detect which ground truth map to use for a given repo+question count.
 * Per-repo Q-sets (12 questions) use REPO_GT; generic 30-question sets use GROUND_TRUTH_MAP.
 */
function resolveGroundTruth(
  repo: string,
  questionCount: number,
): Record<string, GroundTruth | null> | null {
  // Per-repo 12-Q sets
  if (questionCount <= 15 && REPO_GT[repo]) {
    return REPO_GT[repo] as Record<string, GroundTruth | null>;
  }
  // Generic 30-Q sets
  return GROUND_TRUTH_MAP[repo] ?? null;
}

/**
 * Parse a single benchmark result markdown file.
 * Extracts model answers from the Scoring Sheet table.
 */
function parseResultFile(content: string, filePath: string): ParsedResultFile | null {
  const fileName = basename(filePath);

  // Extract header fields
  const modelMatch = content.match(/^\*\*Model:\*\*\s*(.+)$/m);
  const repoMatch = content.match(/^\*\*Repo:\*\*\s*(.+)$/m);

  if (!repoMatch) {
    // Try to infer repo from filename
    const knownRepos = ['gitea', 'fastapi', 'rails', 'nextjs', 'django', 'laravel', 'phoenix', 'ripgrep', 'gh-cli'];
    const inferredRepo = knownRepos.find(r => fileName.startsWith(r + '-'));
    if (!inferredRepo) return null;
  }

  const model = modelMatch?.[1]?.trim() ?? 'unknown';
  const repo = repoMatch?.[1]?.trim() ?? (() => {
    const knownRepos = ['gitea', 'fastapi', 'rails', 'nextjs', 'django', 'laravel', 'phoenix', 'ripgrep', 'gh-cli'];
    return knownRepos.find(r => fileName.startsWith(r + '-')) ?? 'unknown';
  })();

  // Detect mode
  let mode: ParsedResultFile['mode'] = 'chode';
  if (content.includes('BASELINE') || fileName.includes('-baseline-')) mode = 'baseline';
  else if (content.includes('SELF-PROFILE') || fileName.includes('-self-profile-')) mode = 'self-profile';

  // Parse scoring sheet table rows
  // Format: | Q1 | Topic | Category | Model Answer | Score |
  const questionAnswers = new Map<string, string>();
  const originalScores = new Map<string, number>();
  const isManual = new Map<string, boolean>();

  const tableRowRe = /^\|\s*(Q\d{1,2})\s*\|[^|]+\|[^|]+\|\s*(.*?)\s*\|\s*(.*?)\s*\|/gm;
  let match: RegExpExecArray | null;

  while ((match = tableRowRe.exec(content)) !== null) {
    const qId = match[1]!.trim();
    const answerRaw = match[2]!.trim();
    const scoreRaw = match[3]!.trim();

    // Unescape pipe characters that were escaped in the table
    const answer = answerRaw.replace(/\\\|/g, '|');
    questionAnswers.set(qId, answer);

    // Parse score cell: "3 _(auto)_", "__ _(manual)_", "2 _(auto)_", "/3", "__"
    if (scoreRaw.includes('manual')) {
      isManual.set(qId, true);
      originalScores.set(qId, -1);
    } else if (scoreRaw.includes('auto')) {
      isManual.set(qId, false);
      const numMatch = scoreRaw.match(/^(\d)/);
      originalScores.set(qId, numMatch ? parseInt(numMatch[1]!) : -1);
    } else if (scoreRaw.match(/^\d/)) {
      // Old format with no auto/manual label
      isManual.set(qId, false);
      originalScores.set(qId, parseInt(scoreRaw[0]!));
    } else {
      // Blank / unfilled __ — skip
      isManual.set(qId, true);
      originalScores.set(qId, -1);
    }
  }

  if (questionAnswers.size === 0) return null;

  const groundTruthMap = resolveGroundTruth(repo, questionAnswers.size);

  return {
    filePath,
    fileName,
    model,
    repo,
    mode,
    questionAnswers,
    originalScores,
    isManual,
    groundTruthMap,
  };
}

// ── Per-file rescoring ────────────────────────────────────────────────────────

type QuestionRescoreDetail = {
  qId: string;
  answer: string;
  originalScore: number;
  semanticScore: number;
  delta: number;
  strictReason: string;
  semanticReason: string;
  wasManual: boolean;
};

type FileRescoreResult = {
  fileName: string;
  model: string;
  repo: string;
  mode: string;
  totalQuestions: number;
  autoScoredQuestions: number;        // questions where GT exists and was auto-scored
  originalTotal: number;
  semanticTotal: number;
  delta: number;
  originalAvg: number;
  semanticAvg: number;
  maxPossible: number;
  details: QuestionRescoreDetail[];
  benefitedQuestions: QuestionRescoreDetail[];   // where semantic > strict
  regressedQuestions: QuestionRescoreDetail[];   // where semantic < strict (should be 0)
};

function rescoreFile(parsed: ParsedResultFile): FileRescoreResult {
  const details: QuestionRescoreDetail[] = [];

  for (const [qId, answer] of parsed.questionAnswers) {
    const gt = parsed.groundTruthMap?.[qId] ?? null;
    const wasManual = parsed.isManual.get(qId) ?? true;
    const originalScore = parsed.originalScores.get(qId) ?? -1;

    const strict = strictScore(answer, gt);
    const semantic = semanticScore(answer, gt);

    details.push({
      qId,
      answer,
      originalScore,
      semanticScore: semantic.score,
      delta: semantic.score - strict.score,
      strictReason: strict.reason,
      semanticReason: semantic.reason,
      wasManual,
    });
  }

  // Only consider auto-scorable questions (GT exists, not manual-only)
  const autoScorable = details.filter(d => {
    const gt = parsed.groundTruthMap?.[d.qId] ?? null;
    if (!gt) return false;
    if (gt.must.length === 0 && gt.good.length === 0) return false;
    return true;
  });

  const originalTotal = autoScorable.reduce((n, d) => {
    const s = strictScore(d.answer, parsed.groundTruthMap?.[d.qId] ?? null);
    return n + Math.max(0, s.score);
  }, 0);

  const semanticTotal = autoScorable.reduce((n, d) => n + Math.max(0, d.semanticScore), 0);
  const maxPossible = autoScorable.length * 3;

  const benefitedQuestions = details.filter(d => d.delta > 0);
  const regressedQuestions = details.filter(d => d.delta < 0);

  return {
    fileName: parsed.fileName,
    model: parsed.model,
    repo: parsed.repo,
    mode: parsed.mode,
    totalQuestions: details.length,
    autoScoredQuestions: autoScorable.length,
    originalTotal,
    semanticTotal,
    delta: semanticTotal - originalTotal,
    originalAvg: maxPossible > 0 ? originalTotal / maxPossible : 0,
    semanticAvg: maxPossible > 0 ? semanticTotal / maxPossible : 0,
    maxPossible,
    details,
    benefitedQuestions,
    regressedQuestions,
  };
}

// ── Summary builder ───────────────────────────────────────────────────────────

function pct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

function buildSummaryReport(results: FileRescoreResult[], timestamp: string): string {
  const lines: string[] = [];

  lines.push(`# CHODE Semantic Re-Score Report`);
  lines.push(`**Generated:** ${timestamp}`);
  lines.push(`**Files analyzed:** ${results.length}`);
  lines.push('');

  // Overall aggregate stats
  const totalOriginal = results.reduce((n, r) => n + r.originalTotal, 0);
  const totalSemantic = results.reduce((n, r) => n + r.semanticTotal, 0);
  const totalMax = results.reduce((n, r) => n + r.maxPossible, 0);
  const totalDelta = totalSemantic - totalOriginal;

  lines.push('## Aggregate Summary');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|---|---|`);
  lines.push(`| Files re-scored | ${results.length} |`);
  lines.push(`| Total auto-scorable questions | ${results.reduce((n, r) => n + r.autoScoredQuestions, 0)} |`);
  lines.push(`| Strict total | ${totalOriginal}/${totalMax} (${pct(totalOriginal / totalMax)}) |`);
  lines.push(`| Semantic total | ${totalSemantic}/${totalMax} (${pct(totalSemantic / totalMax)}) |`);
  lines.push(`| Delta | +${totalDelta} points (+${((totalDelta / Math.max(1, totalOriginal)) * 100).toFixed(1)}% relative improvement) |`);
  lines.push(`| Files with improvement | ${results.filter(r => r.delta > 0).length} |`);
  lines.push(`| Files with regression | ${results.filter(r => r.delta < 0).length} |`);
  lines.push(`| Files unchanged | ${results.filter(r => r.delta === 0).length} |`);
  lines.push('');

  // Per-file table
  lines.push('## Per-File Results');
  lines.push('');
  lines.push('| File | Repo | Mode | Strict | Semantic | Delta |');
  lines.push('|---|---|---|---|---|---|');
  for (const r of results.sort((a, b) => b.delta - a.delta)) {
    const strictStr = `${r.originalTotal}/${r.maxPossible} (${pct(r.originalAvg)})`;
    const semStr = `${r.semanticTotal}/${r.maxPossible} (${pct(r.semanticAvg)})`;
    const deltaStr = r.delta > 0 ? `+${r.delta}` : r.delta === 0 ? '0' : `${r.delta}`;
    lines.push(`| ${r.fileName} | ${r.repo} | ${r.mode} | ${strictStr} | ${semStr} | ${deltaStr} |`);
  }
  lines.push('');

  // Which questions benefited most (aggregate across all files)
  const qBenefit = new Map<string, { count: number; totalDelta: number; examples: string[] }>();
  for (const r of results) {
    for (const d of r.benefitedQuestions) {
      const key = `${r.repo}/${d.qId}`;
      const existing = qBenefit.get(key) ?? { count: 0, totalDelta: 0, examples: [] };
      existing.count++;
      existing.totalDelta += d.delta;
      if (existing.examples.length < 3) {
        existing.examples.push(`${r.model}: "${d.answer.slice(0, 60)}${d.answer.length > 60 ? '…' : ''}" → ${d.strictReason} → semantic: ${d.semanticReason}`);
      }
      qBenefit.set(key, existing);
    }
  }

  if (qBenefit.size > 0) {
    lines.push('## Questions That Benefited From Semantic Scoring');
    lines.push('');
    lines.push('_(Questions where semantic scoring awarded more points than strict matching)_');
    lines.push('');

    const sorted = [...qBenefit.entries()].sort((a, b) => b[1].totalDelta - a[1].totalDelta);
    for (const [key, stats] of sorted) {
      lines.push(`### ${key} (${stats.count} file(s), +${stats.totalDelta} total points)`);
      for (const ex of stats.examples) {
        lines.push(`- ${ex}`);
      }
      lines.push('');
    }
  }

  // Detailed per-file breakdown
  lines.push('## Detailed Per-File Breakdown');
  lines.push('');

  for (const r of results.sort((a, b) => b.delta - a.delta)) {
    lines.push(`### ${r.fileName}`);
    lines.push('');
    lines.push(`**Repo:** ${r.repo} | **Model:** ${r.model} | **Mode:** ${r.mode}`);
    lines.push(`**Strict:** ${r.originalTotal}/${r.maxPossible} (${pct(r.originalAvg)}) → **Semantic:** ${r.semanticTotal}/${r.maxPossible} (${pct(r.semanticAvg)}) | **Delta:** ${r.delta > 0 ? '+' : ''}${r.delta}`);
    lines.push('');

    if (r.benefitedQuestions.length > 0 || r.regressedQuestions.length > 0) {
      lines.push('| Q | Answer (truncated) | Strict | Semantic | Delta | Semantic reason |');
      lines.push('|---|---|---|---|---|---|');

      const changed = [...r.benefitedQuestions, ...r.regressedQuestions]
        .sort((a, b) => a.qId.localeCompare(b.qId, undefined, { numeric: true }));

      for (const d of changed) {
        const ans = d.answer.length > 60 ? d.answer.slice(0, 60) + '…' : d.answer;
        const escapedAns = ans.replace(/\|/g, '\\|');
        const deltaStr = d.delta > 0 ? `+${d.delta}` : `${d.delta}`;
        const semReason = d.semanticReason.replace(/\|/g, '\\|');
        const strictDisp = d.originalScore >= 0 ? String(d.originalScore) : 'M';
        const semDisp = d.semanticScore >= 0 ? String(d.semanticScore) : 'M';
        lines.push(`| ${d.qId} | ${escapedAns} | ${strictDisp} | ${semDisp} | ${deltaStr} | ${semReason} |`);
      }
      lines.push('');
    } else {
      lines.push('_No change from semantic scoring._');
      lines.push('');
    }
  }

  // Semantic rules reference
  lines.push('---');
  lines.push('');
  lines.push('## Semantic Equivalence Rules Applied');
  lines.push('');
  lines.push('### Abbreviation Expansions');
  lines.push('');
  for (const [canonical, ...aliases] of ABBREV_MAP) {
    lines.push(`- \`${aliases.join('`, `')}\` → \`${canonical}\``);
  }
  lines.push('');
  lines.push('### Flag Equivalents');
  lines.push('');
  for (const group of FLAG_EQUIVALENTS) {
    lines.push(`- ${group.map(f => `\`${f}\``).join(' = ')}`);
  }
  lines.push('');
  lines.push('### Plural/Singular Pairs');
  lines.push('');
  for (const [singular, plural] of PLURAL_MAP) {
    lines.push(`- \`${singular}\` ↔ \`${plural}\``);
  }
  lines.push('');
  lines.push('### Additional Normalizations');
  lines.push('- Case insensitive matching');
  lines.push('- Punctuation normalization (commas, semicolons, parentheses collapsed to spaces)');
  lines.push('- Whitespace collapse');
  lines.push('');

  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const specificFile = get('--file');
  const repoFilter = get('--repo');
  const modeFilter = get('--mode');   // 'chode', 'baseline', 'self-profile'

  const resultsDir = resolve(__dirname, 'results');

  // Collect files to process
  let files: string[] = [];

  if (specificFile) {
    files = [resolve(specificFile)];
  } else {
    const entries = await readdir(resultsDir);
    files = entries
      .filter(f => f.endsWith('.md'))
      .filter(f => {
        // Skip comparison/summary files and other non-benchmark files
        const skip = [
          'ablation', 'comparison', 'aider', 'cap-ablation', 'logprobs',
          'new-repos', 'noise-floor', 'peer-review', 'poison', 'random-repos',
          'schema-remap', 'technique-comparison', 'wildcard-repos',
          'semantic-rescore',
        ];
        return !skip.some(s => f.startsWith(s));
      })
      .map(f => join(resultsDir, f));
  }

  console.log(`\nCHODE Semantic Re-Scorer`);
  console.log(`  Results dir: ${resultsDir}`);
  console.log(`  Candidate files: ${files.length}`);

  // Parse and rescore
  const fileResults: FileRescoreResult[] = [];
  let skipped = 0;

  for (const filePath of files) {
    let content: string;
    try {
      content = await readFile(filePath, 'utf8');
    } catch {
      console.warn(`  WARN: Cannot read ${basename(filePath)}`);
      skipped++;
      continue;
    }

    const parsed = parseResultFile(content, filePath);
    if (!parsed) {
      skipped++;
      continue;
    }

    // Apply filters
    if (repoFilter && parsed.repo !== repoFilter) continue;
    if (modeFilter && parsed.mode !== modeFilter) continue;

    // Skip files where we have no ground truth for this repo
    if (!parsed.groundTruthMap) {
      console.log(`  SKIP (no GT): ${parsed.fileName}`);
      skipped++;
      continue;
    }

    const result = rescoreFile(parsed);
    fileResults.push(result);

    const deltaStr = result.delta > 0 ? `+${result.delta}` : String(result.delta);
    console.log(`  ${parsed.fileName.padEnd(65)} ${result.originalTotal}/${result.maxPossible} → ${result.semanticTotal}/${result.maxPossible} (${deltaStr})`);
  }

  console.log(`\n  Processed: ${fileResults.length} files, skipped: ${skipped}`);

  if (fileResults.length === 0) {
    console.log('  No files to report on.');
    return;
  }

  // Build and save report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const report = buildSummaryReport(fileResults, new Date().toISOString());

  await mkdir(resultsDir, { recursive: true });
  const outFile = resolve(resultsDir, `semantic-rescore-${timestamp}.md`);
  await writeFile(outFile, report, 'utf8');

  const totalOrig = fileResults.reduce((n, r) => n + r.originalTotal, 0);
  const totalSem = fileResults.reduce((n, r) => n + r.semanticTotal, 0);
  const totalMax = fileResults.reduce((n, r) => n + r.maxPossible, 0);

  console.log(`\n  Strict:   ${totalOrig}/${totalMax} (${Math.round(totalOrig / totalMax * 100)}%)`);
  console.log(`  Semantic: ${totalSem}/${totalMax} (${Math.round(totalSem / totalMax * 100)}%)`);
  console.log(`  Delta:    +${totalSem - totalOrig} points`);
  console.log(`\n  Report: ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
