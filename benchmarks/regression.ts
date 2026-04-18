#!/usr/bin/env node
/**
 * Regression test: runs CHODE on all benchmark projects, asserts key properties.
 * Exit 0 = pass. Exit 1 = fail.
 *
 * To update baselines after an intentional change: node benchmarks/regression.ts --update
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const BASELINE_FILE = resolve(__dir, 'baselines.json');
const UPDATE = process.argv.includes('--update');

type Assertion = {
  field: string;          // e.g. '@STACK', '@ENTRY', '@ROUTES'
  contains: string[];     // all of these must appear in the field line
};

type ProjectSpec = {
  dir: string;
  assertions: Assertion[];
  tokenTolerance?: number; // fraction, default 0.15
};

const SPECS: ProjectSpec[] = [
  {
    dir: 'benchmarks/express',
    assertions: [
      { field: '@STACK', contains: ['express', 'js'] },
      { field: '@ENTRY', contains: ['index.js'] },
    ],
  },
  {
    dir: 'benchmarks/t3-app',
    assertions: [
      { field: '@STACK', contains: ['ts', 'next', 'prisma'] },
      { field: '@ENTRY', contains: ['index.ts'] },
    ],
  },
  {
    dir: 'benchmarks/gh-cli',
    assertions: [
      { field: '@STACK', contains: ['go', 'cobra'] },
      { field: '@ENTRY', contains: ['main.go'] },
      { field: '@ROUTES', contains: ['pkg/cmd'] },
    ],
  },
  {
    dir: 'benchmarks/fastapi',
    assertions: [
      { field: '@STACK', contains: ['python', 'pydantic'] },
      { field: '@ENTRY', contains: ['applications.py'] },
      { field: '@ROUTES', contains: ['routing'] },
    ],
  },
  {
    dir: 'benchmarks/axum',
    assertions: [
      { field: '@STACK', contains: ['rust'] },
    ],
  },
  {
    dir: 'benchmarks/django',
    assertions: [
      { field: '@STACK', contains: ['python'] },
    ],
  },
  {
    dir: 'benchmarks/vite',
    assertions: [
      { field: '@STACK', contains: ['ts'] },
      { field: '@ENTRY', contains: ['src/index.ts'] },
    ],
  },
  {
    dir: 'benchmarks/gin',
    assertions: [
      { field: '@STACK', contains: ['go'] },
    ],
  },
  {
    dir: 'benchmarks/actix-web',
    assertions: [
      { field: '@STACK', contains: ['rust'] },
    ],
  },
  {
    dir: 'benchmarks/nestjs',
    assertions: [
      { field: '@STACK', contains: ['ts'] },
    ],
  },
  {
    dir: 'benchmarks/rails',
    assertions: [
      { field: '@STACK', contains: ['ruby'] },
    ],
  },
  {
    dir: 'benchmarks/spring-petclinic',
    assertions: [
      { field: '@STACK', contains: ['java'] },
      { field: '@STACK', contains: ['spring-boot'] },
    ],
  },
  {
    dir: 'benchmarks/hono',
    assertions: [
      { field: '@STACK', contains: ['ts'] },
      { field: '@ENTRY', contains: ['src/index.ts'] },
    ],
  },
  {
    dir: 'benchmarks/laravel',
    assertions: [
      { field: '@STACK', contains: ['php'] },
      { field: '@ROUTES', contains: ['routes/'] },
    ],
  },
  {
    dir: 'benchmarks/ripgrep',
    assertions: [
      { field: '@STACK', contains: ['rust'] },
      { field: '@ENTRY', contains: ['main.rs'] },
    ],
  },
  {
    dir: 'benchmarks/echo-go',
    assertions: [
      { field: '@STACK', contains: ['go'] },
    ],
  },
  {
    dir: 'benchmarks/httpx',
    assertions: [
      { field: '@STACK', contains: ['python'] },
    ],
  },
  {
    dir: 'benchmarks/svelte',
    assertions: [
      { field: '@STACK', contains: ['ts'] },
      { field: '@STACK', contains: ['svelte'] },
    ],
  },
  {
    dir: 'benchmarks/phoenix',
    assertions: [
      { field: '@STACK', contains: ['elixir'] },
      { field: '@STACK', contains: ['ecto'] },
    ],
  },
  {
    dir: 'benchmarks/ktor',
    assertions: [
      { field: '@STACK', contains: ['kotlin'] },
    ],
  },
  {
    dir: 'benchmarks/eshop',
    assertions: [
      { field: '@STACK', contains: ['csharp'] },
    ],
  },
  {
    dir: 'benchmarks/cpp-json',
    assertions: [
      { field: '@STACK', contains: ['cpp'] },
    ],
  },
  {
    dir: 'benchmarks/flutter-samples',
    assertions: [
      { field: '@STACK', contains: ['dart'] },
      { field: '@ENTRY', contains: ['main.dart'] },
    ],
  },
  {
    dir: 'benchmarks/scala3',
    assertions: [
      { field: '@STACK', contains: ['scala'] },
    ],
  },
  {
    dir: 'benchmarks/http4s',
    assertions: [
      { field: '@STACK', contains: ['scala'] },
    ],
  },
  {
    dir: 'benchmarks/swift-nio',
    assertions: [
      { field: '@STACK', contains: ['swift'] },
    ],
  },
  {
    dir: 'benchmarks/nextjs',
    assertions: [
      { field: '@STACK', contains: ['ts'] },
      { field: '@STACK', contains: ['next'] },
    ],
  },
  {
    dir: 'benchmarks/typescript-compiler',
    assertions: [
      { field: '@STACK', contains: ['ts'] },
    ],
  },
  {
    dir: 'benchmarks/shadcn-ui',
    assertions: [
      { field: '@STACK', contains: ['ts', 'next', 'react'] },
      { field: '@ENTRY', contains: ['packages/shadcn/src/index.ts'] },
    ],
  },
];

type Baselines = Record<string, number>; // dir → token count

function runChode(dir: string): string {
  const target = resolve(ROOT, dir);
  execSync(
    `node --experimental-strip-types ${ROOT}/src/index.ts ${target}`,
    { stdio: 'pipe' },
  );
  return readFileSync(`${target}/.chode`, 'utf8');
}

function extractFields(chode: string): Map<string, string> {
  const fields = new Map<string, string>();
  const contextSection = chode.split('---CONTEXT---')[1] ?? '';
  for (const line of contextSection.split('\n')) {
    const m = line.match(/^(@\w+)\s+(.*)/);
    if (m && m[1] && m[2]) fields.set(m[1], m[2]);
  }
  const dnaSection = chode.split('---DNA---')[1]?.split('---CONTEXT---')[0] ?? '';
  for (const line of dnaSection.split('\n')) {
    const m = line.match(/^(@\w+)\s+(.*)/);
    if (m && m[1] && m[2]) fields.set(m[1], m[2]);
  }
  return fields;
}

function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function pass(msg: string) { console.log(`  ✓ ${msg}`); }
function fail(msg: string) { console.log(`  ✗ ${msg}`); return true; }

async function main() {
  const baselines: Baselines = existsSync(BASELINE_FILE)
    ? JSON.parse(readFileSync(BASELINE_FILE, 'utf8'))
    : {};

  let anyFailed = false;
  const newBaselines: Baselines = {};

  for (const spec of SPECS) {
    console.log(`\n${spec.dir}`);
    let chode: string;
    try {
      chode = runChode(spec.dir);
    } catch (e) {
      anyFailed = fail(`CHODE failed to run: ${e}`);
      continue;
    }

    const fields = extractFields(chode);
    const tokens = countTokens(chode);
    newBaselines[spec.dir] = tokens;

    // Field assertions
    for (const { field, contains } of spec.assertions) {
      const value = fields.get(field) ?? '';
      for (const term of contains) {
        if (value.includes(term)) {
          pass(`${field} contains "${term}"`);
        } else {
          anyFailed = fail(`${field} missing "${term}" (got: "${value || '(absent)'}")`);
        }
      }
    }

    // Token count vs baseline
    const baseline = baselines[spec.dir];
    if (baseline === undefined || UPDATE) {
      pass(`tokens: ${tokens} (baseline set)`);
    } else {
      const tol = spec.tokenTolerance ?? 0.15;
      const lo = Math.floor(baseline * (1 - tol));
      const hi = Math.ceil(baseline * (1 + tol));
      if (tokens >= lo && tokens <= hi) {
        pass(`tokens: ${tokens} (baseline ${baseline}, within ±${Math.round(tol * 100)}%)`);
      } else {
        anyFailed = fail(`tokens: ${tokens} outside [${lo}, ${hi}] (baseline ${baseline})`);
      }
    }
  }

  if (UPDATE || !existsSync(BASELINE_FILE)) {
    writeFileSync(BASELINE_FILE, JSON.stringify(newBaselines, null, 2));
    console.log(`\nBaselines written to benchmarks/baselines.json`);
  }

  console.log(anyFailed ? '\nFAIL' : '\nPASS');
  process.exit(anyFailed ? 1 : 0);
}

main();
