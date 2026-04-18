#!/usr/bin/env node
import { resolve, basename } from 'node:path';
import { writeFile, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { walk } from './crawler/walker.ts';
import { detect } from './crawler/detector.ts';
import { ingestContext } from './ingest/context.ts';
import {
  parsePackageJson,
  parseGoMod,
  parseCargoToml,
  parsePyProject,
  parseGemfile,
  parsePomXml,
  parseComposerJson,
  parseMixExs,
  parsePubspec,
  parseBuildSbt,
  parsePackageSwift,
} from './ingest/manifest.ts';
import { buildCodex, buildCodexMap, STANDARD_CODEC, type CodexEntry } from './encode/codex.ts';
import { buildTree } from './encode/tree.ts';
import { buildDna } from './encode/dna.ts';
import { assemble } from './encode/assembler.ts';
import type { DnaFragment, ContextResult, Zone } from './types.ts';

const NOTABLE_JS = new Set([
  'react', 'vue', 'svelte', 'next', 'nuxt', 'astro', 'remix',
  'express', 'fastify', 'hono', 'koa', '@nestjs/core',
  'prisma', 'drizzle-orm', 'typeorm', 'mongoose',
  'zod', 'valibot', 'yup',
  'tailwindcss', 'stripe', 'redis', 'bullmq',
  'bun', 'vite', 'vitest', 'jest', 'playwright', 'mocha', 'supertest',
]);

// Go HTTP router libraries — when detected, name is prefixed onto @ROUTES value
const GO_HTTP_ROUTERS = new Set(['gin', 'echo', 'fiber', 'chi', 'mux']);

// Go: full module path (without /vN suffix) → short label
const NOTABLE_GO = new Map<string, string>([
  ['github.com/gin-gonic/gin', 'gin'],
  ['github.com/labstack/echo', 'echo'],
  ['github.com/gofiber/fiber', 'fiber'],
  ['github.com/go-chi/chi', 'chi'],
  ['github.com/gorilla/mux', 'mux'],
  ['github.com/spf13/cobra', 'cobra'],
  ['github.com/spf13/viper', 'viper'],
  ['github.com/urfave/cli', 'cli'],
  ['gorm.io/gorm', 'gorm'],
  ['entgo.io/ent', 'ent'],
  ['github.com/jackc/pgx', 'pgx'],
  ['github.com/lib/pq', 'pq'],
  ['github.com/go-sql-driver/mysql', 'mysql'],
  ['github.com/mattn/go-sqlite3', 'sqlite3'],
  ['github.com/sqlc-dev/sqlc', 'sqlc'],
  ['github.com/redis/go-redis', 'redis'],
  ['github.com/go-redis/redis', 'redis'],
  ['google.golang.org/grpc', 'grpc'],
  ['github.com/grpc-ecosystem/grpc-gateway', 'grpc-gateway'],
  ['go.uber.org/fx', 'fx'],
  ['github.com/google/wire', 'wire'],
  ['go.uber.org/zap', 'zap'],
  ['github.com/rs/zerolog', 'zerolog'],
  ['github.com/sirupsen/logrus', 'logrus'],
  ['github.com/golang-jwt/jwt', 'jwt'],
  ['github.com/cli/oauth', 'oauth'],
  ['golang.org/x/oauth2', 'oauth2'],
  ['go.opentelemetry.io/otel', 'otel'],
  ['github.com/stretchr/testify', 'testify'],
  ['github.com/onsi/ginkgo', 'ginkgo'],
  ['github.com/pressly/goose', 'goose'],
  ['github.com/charmbracelet/bubbletea', 'bubbletea'],
  ['github.com/denisenkom/go-mssqldb', 'mssql'],
  ['github.com/microsoft/go-mssqldb', 'mssql'],
]);

const NOTABLE_RUST = new Set([
  'tokio', 'axum', 'actix-web', 'actix', 'warp', 'hyper', 'tower', 'reqwest',
  'rocket', 'poem', 'tide', 'salvo',
  'serde', 'serde_json',
  'diesel', 'sqlx', 'sea-orm', 'rusqlite',
  'clap', 'structopt',
  'anyhow', 'thiserror',
  'tracing', 'log', 'env_logger',
  'tonic', 'prost',
  'redis', 'mongodb',
  'jsonwebtoken', 'oauth2',
  'rayon', 'tokio-rayon',
]);

const NOTABLE_DART = new Set([
  'riverpod', 'provider', 'bloc', 'flutter_bloc', 'get', 'getx',
  'dio', 'http', 'retrofit',
  'go_router', 'auto_route',
  'hive', 'isar', 'sqflite', 'drift',
  'firebase_core', 'cloud_firestore', 'firebase_auth',
  'freezed', 'json_serializable', 'equatable',
  'mockito', 'mocktail',
]);

const NOTABLE_SCALA = new Set([
  'akka', 'akka-http', 'akka-stream', 'pekko',
  'http4s', 'tapir', 'zio', 'cats-effect', 'cats',
  'slick', 'doobie', 'quill',
  'circe', 'play-json', 'spray-json',
  'play', 'scalatra',
  'scalatest', 'specs2', 'munit',
  'fs2', 'monix',
]);

const NOTABLE_SWIFT = new Set([
  'vapor', 'hummingbird', 'perfect',
  'SwiftNIO', 'AsyncHTTPClient',
  'Alamofire', 'Moya',
  'Combine', 'RxSwift',
  'GRDB', 'SQLite.swift', 'CoreData',
  'SnapKit', 'Kingfisher',
  'XCTest', 'Quick', 'Nimble',
  'SwiftUI', 'UIKit',
]);

const NOTABLE_KOTLIN = new Set([
  'ktor', 'spring-boot', 'exposed', 'koin', 'kodein',
  'kotlinx-coroutines', 'kotlinx-serialization', 'arrow',
  'mockk', 'kotest', 'junit',
  'retrofit', 'okhttp', 'fuel',
]);

const NOTABLE_ELIXIR = new Set([
  'phoenix', 'plug', 'ecto', 'absinthe', 'oban',
  'ex_unit', 'mox', 'bypass',
  'gettext', 'timex', 'jason', 'poison',
  'comeonin', 'bcrypt_elixir', 'guardian',
  'broadway', 'gen_stage', 'flow',
  'telemetry', 'opentelemetry',
]);

const NOTABLE_CSHARP = new Set([
  'Microsoft.AspNetCore', 'Microsoft.EntityFrameworkCore',
  'Dapper', 'MediatR', 'AutoMapper',
  'Serilog', 'NLog', 'Microsoft.Extensions.Logging',
  'xunit', 'NUnit', 'Moq', 'FluentAssertions',
  'Newtonsoft.Json', 'System.Text.Json',
  'Swashbuckle', 'NSwag',
  'MassTransit', 'Hangfire', 'Quartz',
  'IdentityServer', 'Duende',
  'FluentValidation', 'Ardalis', 'Blazored', 'Polly',
]);

const NOTABLE_PHP = new Set([
  'laravel', 'symfony', 'lumen', 'slim', 'laminas',
  'eloquent', 'doctrine', 'phinx',
  'guzzlehttp', 'pest', 'phpunit',
  'livewire', 'inertiajs', 'filament',
  'sanctum', 'passport', 'jwt-auth',
  'queue', 'horizon', 'telescope', 'octane',
]);

const NOTABLE_JAVA = new Map<string, string>([
  ['org.springframework.boot', 'spring-boot'],
  ['org.springframework', 'spring'],
  ['io.quarkus', 'quarkus'],
  ['io.micronaut', 'micronaut'],
  ['com.vaadin', 'vaadin'],
  ['org.hibernate', 'hibernate'],
  ['jakarta.persistence', 'jpa'],
  ['org.mybatis', 'mybatis'],
  ['io.vertx', 'vertx'],
  ['org.apache.kafka', 'kafka'],
  ['io.grpc', 'grpc'],
  ['org.projectlombok', 'lombok'],
  ['io.jsonwebtoken', 'jwt'],
  ['junit', 'junit'],
  ['org.mockito', 'mockito'],
]);

const NOTABLE_RUBY = new Set([
  'rails', 'sinatra', 'hanami', 'roda', 'grape', 'padrino',
  'activerecord', 'sequel', 'rom-rb',
  'sidekiq', 'resque', 'delayed_job',
  'devise', 'doorkeeper', 'pundit', 'cancancan',
  'graphql-ruby', 'grape-entity',
  'rspec', 'minitest', 'cucumber',
  'puma', 'unicorn', 'thin',
  'redis', 'mongoid', 'elasticsearch-model',
  'httparty', 'faraday', 'rest-client',
  'jwt', 'bcrypt',
  'dry-rb', 'trailblazer',
]);

const NOTABLE_PYTHON = new Set([
  'fastapi', 'django', 'flask', 'starlette', 'tornado', 'sanic', 'litestar',
  'pydantic', 'marshmallow',
  'sqlalchemy', 'alembic', 'tortoise-orm', 'databases',
  'celery', 'dramatiq', 'rq', 'arq',
  'uvicorn', 'gunicorn', 'hypercorn', 'daphne',
  'httpx', 'requests', 'aiohttp',
  'redis', 'pymongo', 'motor', 'elasticsearch',
  'typer', 'click',
  'anthropic', 'openai', 'langchain',
  'numpy', 'pandas', 'scikit-learn', 'torch', 'tensorflow',
  'boto3', 'pytest',
]);

// External service integrations — surfaced as @API, separate from stack deps
const EXT_SERVICES_GO = new Map<string, string>([
  ['github.com/stripe/stripe-go', 'stripe'],
  ['github.com/aws/aws-sdk-go', 'aws'],
  ['github.com/aws/aws-sdk-go-v2', 'aws'],
  ['cloud.google.com/go', 'gcp'],
  ['github.com/Azure/azure-sdk-for-go', 'azure'],
  ['github.com/elastic/go-elasticsearch', 'elasticsearch'],
  ['go.mongodb.org/mongo-driver', 'mongodb'],
  ['github.com/slack-go/slack', 'slack'],
  ['github.com/google/go-github', 'github-api'],
  ['github.com/sendgrid/sendgrid-go', 'sendgrid'],
  ['github.com/twilio/twilio-go', 'twilio'],
  ['github.com/mailgun/mailgun-go', 'mailgun'],
  ['github.com/prometheus/client_golang', 'prometheus'],
  ['github.com/minio/minio-go', 'minio'],
  ['github.com/opensearch-project/opensearch-go', 'opensearch'],
  ['firebase.google.com/go', 'firebase'],
  ['github.com/sashabaranov/go-openai', 'openai'],
  ['github.com/anthropics/anthropic-sdk-go', 'anthropic'],
]);

const EXT_SERVICES_JS = new Map<string, string>([
  ['stripe', 'stripe'],
  ['@stripe/stripe-js', 'stripe'],
  ['aws-sdk', 'aws'],
  ['@google-cloud', 'gcp'],
  ['@elastic/elasticsearch', 'elasticsearch'],
  ['mongodb', 'mongodb'],
  ['@sendgrid/mail', 'sendgrid'],
  ['twilio', 'twilio'],
  ['@slack/web-api', 'slack'],
  ['@slack/bolt', 'slack'],
  ['@octokit/rest', 'github-api'],
  ['@octokit/core', 'github-api'],
  ['firebase', 'firebase'],
  ['firebase-admin', 'firebase'],
  ['openai', 'openai'],
  ['@anthropic-ai/sdk', 'anthropic'],
  ['resend', 'resend'],
  ['nodemailer', 'smtp'],
  ['@mailchimp/mailchimp_marketing', 'mailchimp'],
]);

const FRONTEND_DIRS = ['web_src', 'frontend', 'client', 'ui', 'app/javascript', 'app/frontend', 'web/src'];

const FRONTEND_FRAMEWORKS = new Set([
  'react', 'vue', 'svelte', 'next', 'nuxt', 'astro', 'remix', '@angular/core',
  'solid-js', 'qwik', 'lit', 'preact',
]);
const BUNDLERS = new Set(['vite', 'webpack', 'esbuild', 'rollup', 'parcel', 'turbo']);
const TEST_FRAMEWORKS_JS = new Set([
  'vitest', 'jest', 'mocha', 'jasmine', 'ava', 'tap', 'qunit', 'karma',
  'cypress', 'playwright', '@playwright/test', 'puppeteer',
]);

const SKIP_CODEX_DIRS = new Set([
  'examples', 'fixtures', 'test', 'tests', 'benchmarks',
  'demos', 'demo', 'samples', 'sample', 'node_modules',
  'template', 'docs_src', '.changeset', '.github', '.codesandbox',
  'playground', 'playgrounds', 'vendor', 'third_party',
]);

// Short tokens that would be confusing as abbreviations (language keywords, pronouns, prepositions)
const BANNED_SHORTS = new Set([
  'in', 'do', 'if', 'is', 'or', 'as', 'of', 'to', 'be', 'by',
  'at', 'no', 'on', 'up', 'go', 'we', 'he', 'me', 'it', 'an',
  'my', 'so', 'ok', 'id',
]);

function parseChodeFields(text: string): Map<string, string> {
  const fields = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^(@[A-Z]+)\s+(.*)/);
    if (m && m[1] && m[2]) fields.set(m[1], m[2].trim());
  }
  return fields;
}

async function runVerify(target: string, chodeFile: string): Promise<void> {
  console.log(`chode verify ${target}\n`);

  let stored: string;
  try {
    stored = await readFile(chodeFile, 'utf8');
  } catch {
    console.error('  no .chode file found — run chode first');
    process.exit(1);
  }

  const { files } = await walk(target);
  const { zones, anchors } = detect(files);
  const [context, dnaFragments] = await Promise.all([
    ingestContext('context', target, files),
    extractDna(anchors, zones, files, target),
  ]);
  const dna = buildDna(dnaFragments);
  const contextStr = formatContext(context);
  const gitHash = (() => {
    try {
      const r = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: target, encoding: 'utf8' });
      return r.stdout?.trim() || undefined;
    } catch { return undefined; }
  })();
  const fresh = assemble({ dna, context: contextStr, gitHash });

  const storedFields = parseChodeFields(stored);
  const freshFields = parseChodeFields(fresh);

  const allKeys = new Set([...storedFields.keys(), ...freshFields.keys()]);
  const added: string[] = [];
  const removed: string[] = [];
  const changed: Array<{ key: string; was: string; now: string }> = [];

  for (const key of allKeys) {
    const was = storedFields.get(key);
    const now = freshFields.get(key);
    if (!was) added.push(key);
    else if (!now) removed.push(key);
    else if (was !== now) changed.push({ key, was, now });
  }

  const hasDrift = added.length > 0 || removed.length > 0 || changed.length > 0;

  if (!hasDrift) {
    console.log('  up to date — no drift detected');
    process.exit(0);
  }

  if (added.length) {
    console.log('  added fields:');
    for (const k of added) console.log(`    + ${k} ${freshFields.get(k)}`);
  }
  if (removed.length) {
    console.log('  removed fields:');
    for (const k of removed) console.log(`    - ${k}`);
  }
  if (changed.length) {
    console.log('  changed fields:');
    for (const { key, was, now } of changed) {
      console.log(`    ~ ${key}`);
      console.log(`      was: ${was}`);
      console.log(`      now: ${now}`);
    }
  }
  console.log(`\n  ${added.length} added / ${removed.length} removed / ${changed.length} changed`);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const doCommit = args.includes('--commit');
  const force = args.includes('--force');
  const full = args.includes('--full');
  const doVerify = args.includes('--verify');
  const targetArg = args.find(a => !a.startsWith('--')) ?? '.';
  const target = resolve(targetArg);
  const chodeFile = `${target}/.chode`;
  const hashFile = `${target}/.chode.hash`;

  if (doVerify) {
    await runVerify(target, chodeFile);
    return;
  }

  try {
    const s = await stat(target);
    if (!s.isDirectory()) throw new Error('not a directory');
  } catch {
    console.error(`  error: '${target}' is not a directory`);
    process.exit(1);
  }

  const start = performance.now();
  console.log(`chode sequencing ${target}\n`);

  const { files } = await walk(target);

  // Hash check — skip regeneration if file list unchanged and not forced
  const currentHash = computeHash(files);
  if (!force) {
    try {
      const savedHash = await readFile(hashFile, 'utf8');
      if (savedHash.trim() === currentHash) {
        console.log(`  up to date (${files.length} files, hash match)`);
        return;
      }
    } catch {} // no hash file yet — proceed
  }

  const { zones, anchors } = detect(files);

  const [context, dnaFragments] = await Promise.all([
    ingestContext('context', target, files),
    extractDna(anchors, zones, files, target),
  ]);

  const dna = buildDna(dnaFragments);
  const contextStr = formatContext(context);

  const gitHash = (() => {
    try {
      const r = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: target, encoding: 'utf8' });
      return r.stdout?.trim() || undefined;
    } catch { return undefined; }
  })();

  let tree: string | undefined;
  let codex: string | undefined;
  if (full) {
    const codexCandidates = buildCustomCodexCandidates(files, target);
    const codexMap = buildCodexMap(codexCandidates);
    tree = buildTree(target, files, codexMap);
    codex = buildCodex(codexCandidates);
  }

  const output = assemble({ dna, context: contextStr, tree, codex, gitHash });
  await writeFile(chodeFile, output, 'utf8');
  await writeFile(hashFile, currentHash, 'utf8');

  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  printSummary(zones, files.length, context, elapsed, output);

  if (doCommit) {
    const add = spawnSync('git', ['add', '.chode'], { cwd: target, stdio: 'inherit' });
    if (add.status === 0) {
      const commit = spawnSync('git', ['commit', '-m', 'chore: update .chode'], { cwd: target, stdio: 'inherit' });
      if (commit.status !== 0) {
        console.log('  nothing to commit (.chode unchanged)');
      }
    } else {
      console.error('  git add failed — is this a git repository?');
    }
  }
}

function computeHash(files: string[]): string {
  return createHash('sha1').update(files.join('\n')).digest('hex');
}

async function extractDna(anchors: Record<string, string>, zones: Zone[], files: string[], root: string): Promise<DnaFragment[]> {
  const fragments: DnaFragment[] = [];
  const stackParts: string[] = [];
  const hasTs = zones.some(z => z.kind === 'ts');
  const lang = hasTs ? 'typescript' : 'javascript';

  const isDartPrimary = !!(anchors['pubspec.yaml'] &&
    zones.some(z => z.kind === 'dart') &&
    zones.find(z => z.kind === 'dart')!.files.length >=
      (zones.find(z => z.kind === 'kotlin')?.files.length ?? 0));

  const hasForeignManifest = !!(anchors['go.mod'] || anchors['Cargo.toml'] || anchors['pyproject.toml'] || anchors['Gemfile'] || anchors['composer.json'] || anchors['pom.xml'] || anchors['build.gradle'] || anchors['build.gradle.kts'] || anchors['mix.exs'] || anchors['CMakeLists.txt'] || anchors['pubspec.yaml'] || anchors['build.sbt'] || anchors['Package.swift']);

  const jsTestFrameworks: string[] = [];
  const extServices = new Set<string>();
  const rel = files.map(f => toRel(f, root));

  if (anchors['package.json']) {
    try {
      const rootPkg = await parsePackageJson(anchors['package.json']);
      const allPkgFiles = files.filter(f => f.endsWith('package.json') || f.endsWith('package.json'.replace(/\//g, '\\')));
      const notableSet = new Set<string>();
      const frontendSet = new Set<string>();
      const bundlerSet = new Set<string>();
      const testSet = new Set<string>();

      for (const pkgPath of allPkgFiles.slice(0, 30)) {
        try {
          const pkg = await parsePackageJson(pkgPath);
          for (const d of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
            if (NOTABLE_JS.has(d)) notableSet.add(d);
            if (FRONTEND_FRAMEWORKS.has(d)) frontendSet.add(d);
            if (BUNDLERS.has(d)) bundlerSet.add(d);
            if (TEST_FRAMEWORKS_JS.has(d)) testSet.add(d);
            const svc = EXT_SERVICES_JS.get(d) ?? [...EXT_SERVICES_JS.entries()].find(([k]) => d.startsWith(k))?.[1];
            if (svc) extServices.add(svc);
          }
        } catch {}
      }
      // Strip @scope/ prefix so "@nestjs/core" → "nestjs-core" (avoids CHODE field-label confusion)
      const notable = [...notableSet].slice(0, 8).map(d => d.replace(/^@([^/]+)\/(.+)$/, '$1-$2'));

      const jsFiles = zones.filter(z => z.kind === 'js' || z.kind === 'ts').reduce((n, z) => n + z.files.length, 0);
      const totalFiles = zones.reduce((n, z) => n + z.files.length, 0);
      const jsIsMinor = hasForeignManifest && jsFiles / Math.max(totalFiles, 1) < 0.3;

      if (!jsIsMinor) {
        const parts: string[] = [];
        const name = rootPkg.name ?? '';
        if (name && !name.startsWith('@') && !name.includes('monorepo') && !name.includes('workspace')) {
          parts.push(name);
        }
        parts.push(lang);
        if (notable.length) parts.push(...notable);
        stackParts.push(parts.join(' '));
      } else if (jsFiles >= 50) {
        // JS is secondary but substantial — surface as @FRONTEND
        const frontendParts: string[] = [hasTs ? 'typescript' : 'javascript'];
        for (const f of frontendSet) frontendParts.push(f);
        for (const b of bundlerSet) frontendParts.push(b);
        // Detect where frontend source lives
        const feDir = FRONTEND_DIRS.find(d => rel.some(f => f.startsWith(d + '/')));
        if (feDir) frontendParts.push(`(${feDir}/)`);
        if (frontendParts.length > 1) fragments.push({ section: '@FRONTEND', line: frontendParts.join(' ') });
      }

      jsTestFrameworks.push(...testSet);
    } catch {}
  }
  let detectedGoRouter: string | undefined;
  if (anchors['go.mod']) {
    try {
      const mod = await parseGoMod(anchors['go.mod']);
      if (mod.module) {
        const notable = mod.deps
          .map(d => NOTABLE_GO.get(stripGoVersion(d)))
          .filter((s): s is string => s !== undefined);
        const deduped = [...new Set(notable)].slice(0, 6);
        detectedGoRouter = deduped.find(d => GO_HTTP_ROUTERS.has(d));
        stackParts.push(['go', ...deduped].join(' '));
        // External service detection from go.mod
        for (const d of mod.deps) {
          const stripped = stripGoVersion(d);
          const svc = EXT_SERVICES_GO.get(stripped) ?? [...EXT_SERVICES_GO.entries()].find(([k]) => stripped.startsWith(k))?.[1];
          if (svc) extServices.add(svc);
        }
      }
    } catch {}
  }
  if (anchors['Cargo.toml']) {
    // Suppress Rust if another primary manifest is shallower (e.g. Kotlin workspace with Rust FFI submodule)
    const cargoDepth = anchors['Cargo.toml']!.split(/[\\/]/).length;
    const hasShallowerPrimary = ['build.gradle.kts', 'build.gradle', 'pom.xml', 'go.mod', 'pyproject.toml', 'Gemfile', 'mix.exs']
      .some(k => anchors[k] && anchors[k]!.split(/[\\/]/).length < cargoDepth);
    const rustFiles = zones.find(z => z.kind === 'rust')?.files.length ?? 0;
    const jstsFiles = zones.filter(z => z.kind === 'ts' || z.kind === 'js').reduce((n, z) => n + z.files.length, 0);
    const jssDominatesRust = jstsFiles > rustFiles * 5 && anchors['package.json'];
    if (!hasShallowerPrimary && !jssDominatesRust) {
      try {
        const c = await parseCargoToml(anchors['Cargo.toml']);
        const notable = c.deps.filter(d => NOTABLE_RUST.has(d)).slice(0, 6);
        stackParts.push(['rust', ...notable].join(' '));
      } catch {
        stackParts.push('rust');
      }
    }
  }
  if (anchors['pyproject.toml']) {
    try {
      const p = await parsePyProject(anchors['pyproject.toml']);
      if (p.name) {
        const notable = p.deps.filter(d => NOTABLE_PYTHON.has(d)).slice(0, 6);
        stackParts.push(['python', ...notable].join(' '));
      }
    } catch {}
  }
  if (anchors['composer.json']) {
    try {
      const c = await parseComposerJson(anchors['composer.json']);
      const notable = c.deps.filter(d => NOTABLE_PHP.has(d)).slice(0, 6);
      stackParts.push(['php', ...notable].join(' '));
    } catch {
      stackParts.push('php');
    }
  }
  if (anchors['pom.xml']) {
    try {
      const pom = await parsePomXml(anchors['pom.xml']);
      const notable: string[] = [];
      for (const g of pom.deps) {
        const label = NOTABLE_JAVA.get(g);
        if (label && !notable.includes(label)) notable.push(label);
        if (notable.length >= 6) break;
      }
      stackParts.push(['java', ...notable].join(' '));
    } catch {
      stackParts.push('java');
    }
  }
  if (anchors['build.gradle.kts'] && !anchors['pom.xml'] && !isDartPrimary) {
    try {
      const text = await (await import('node:fs/promises')).readFile(anchors['build.gradle.kts'], 'utf8');
      const notable: string[] = [];
      for (const dep of NOTABLE_KOTLIN) {
        if (text.includes(dep)) notable.push(dep);
        if (notable.length >= 6) break;
      }
      stackParts.push(['kotlin', ...notable].join(' '));
    } catch {
      stackParts.push('kotlin');
    }
  }
  if (anchors['build.gradle'] && !anchors['pom.xml'] && !anchors['build.gradle.kts']) {
    stackParts.push('java');
  }
  if (anchors['mix.exs']) {
    try {
      const mix = await parseMixExs(anchors['mix.exs']);
      const notable = mix.deps.filter(d => NOTABLE_ELIXIR.has(d)).slice(0, 6);
      stackParts.push(['elixir', ...notable].join(' '));
    } catch {
      stackParts.push('elixir');
    }
  }
  if (anchors['CMakeLists.txt'] && !isDartPrimary) {
    stackParts.push('cpp');
  }
  if (anchors['pubspec.yaml']) {
    try {
      const pub = await parsePubspec(anchors['pubspec.yaml']);
      const notable = pub.deps.filter(d => NOTABLE_DART.has(d)).slice(0, 6);
      stackParts.push(['dart', ...notable].join(' '));
    } catch {
      stackParts.push('dart');
    }
  }
  if (anchors['build.sbt']) {
    try {
      const sbt = await parseBuildSbt(anchors['build.sbt']);
      const notable = sbt.deps.filter(d => NOTABLE_SCALA.has(d)).slice(0, 6);
      stackParts.push(['scala', ...notable].join(' '));
    } catch {
      stackParts.push('scala');
    }
  }
  if (anchors['Package.swift']) {
    try {
      const pkg = await parsePackageSwift(anchors['Package.swift']);
      const notable = pkg.deps.filter(d => NOTABLE_SWIFT.has(d)).slice(0, 6);
      stackParts.push(['swift', ...notable].join(' '));
    } catch {
      stackParts.push('swift');
    }
  }
  // C# — detected by .csproj files in the tree (no fixed anchor name)
  if (!stackParts.length && zones.some(z => z.kind === 'csharp')) {
    const csprojFiles = files.filter(f => f.endsWith('.csproj'));
    if (csprojFiles.length) {
      try {
        const texts = await Promise.all(csprojFiles.map(f => readFile(f, 'utf8').catch(() => '')));
        const combined = texts.join('\n');
        const notable: string[] = [];
        for (const m of combined.matchAll(/<PackageReference\s+Include="([^"]+)"/g)) {
          if (m[1]) {
            const parts = m[1].split('.');
            const pkg = NOTABLE_CSHARP.has(parts[0]!) ? parts[0]! : parts.slice(0, 2).join('.');
            if (NOTABLE_CSHARP.has(pkg) && !notable.includes(pkg)) notable.push(pkg);
          }
          if (notable.length >= 6) break;
        }
        stackParts.push(['csharp', ...notable].join(' '));
      } catch {
        stackParts.push('csharp');
      }
    }
  }
  if (anchors['Gemfile']) {
    // Suppress Ruby when a shallower primary manifest exists (e.g. Scala project with Ruby docs tooling)
    const gemDepth = anchors['Gemfile']!.split(/[\\/]/).length;
    const hasShallowerPrimary = ['build.sbt', 'build.gradle.kts', 'build.gradle', 'pom.xml', 'go.mod', 'pyproject.toml', 'mix.exs', 'pubspec.yaml', 'Package.swift']
      .some(k => anchors[k] && anchors[k]!.split(/[\\/]/).length < gemDepth);
    if (!hasShallowerPrimary) {
      try {
        const g = await parseGemfile(anchors['Gemfile']);
        const notable = g.deps.filter(d => NOTABLE_RUBY.has(d)).slice(0, 6);
        stackParts.push(['ruby', ...notable].join(' '));
      } catch {
        stackParts.push('ruby');
      }
    }
  }

  // Fallback: detect Python by zone/file count when no pyproject.toml was found
  // (catches flat ML/data repos like moondream that have no package manifest)
  if (!stackParts.some(p => p.startsWith('python'))) {
    const pyZone = zones.find(z => z.kind === 'python');
    if (pyZone && pyZone.files.length >= 5) {
      const notable = pyZone.files
        .map(f => { const m = f.match(/[/\\](\w+)\.py$/); return m?.[1] ?? ''; })
        .filter(n => NOTABLE_PYTHON.has(n));
      const deduped = [...new Set(notable)].slice(0, 6);
      stackParts.push(['python', ...deduped].join(' '));
    }
  }

  if (stackParts.length) {
    fragments.push({ section: '@STACK', line: stackParts.join(' ') });
  }

  if (extServices.size) {
    fragments.push({ section: '@API', line: [...extServices].join(' ') });
  }

  // Test framework detection — JS devDeps + Makefile targets
  const makefileAnchors = files.find(f => /[/\\]Makefile$/.test(f) || f === 'Makefile');
  const makeTestTargets: string[] = [];
  if (makefileAnchors) {
    try {
      const makeText = await readFile(makefileAnchors, 'utf8');
      const targets = [...new Set(
        [...makeText.matchAll(/^(test[a-z0-9_-]*)\s*:/gm)].map(m => `make ${m[1]}`)
      )].slice(0, 5);
      makeTestTargets.push(...targets);
    } catch {}
  }
  // Non-JS test runners inferred from build files
  const nativeTests: string[] = [];
  if (files.some(f => /[/\\]mix\.exs$/.test(f) || f === 'mix.exs')) nativeTests.push('mix test');
  if (files.some(f => /[/\\]pytest\.ini$|[/\\]conftest\.py$/.test(f))) nativeTests.push('pytest');
  else if (files.some(f => /[/\\]pyproject\.toml$/.test(f) && f.split(/[/\\]/).length <= 2)) nativeTests.push('pytest');

  const testLine = [...jsTestFrameworks, ...nativeTests, ...makeTestTargets].join(' ');
  if (testLine) fragments.push({ section: '@TEST', line: testLine });

  const landmarks = detectLandmarks(files, root);
  if (detectedGoRouter) {
    const routesFrag = landmarks.find(f => f.section === '@ROUTES');
    if (routesFrag) routesFrag.line = `${detectedGoRouter} → ${routesFrag.line}`;
  }
  fragments.push(...landmarks);
  return fragments;
}

function stripGoVersion(mod: string): string {
  return mod.replace(/\/v\d+$/, '');
}

function toRel(f: string, root: string): string {
  return (f.startsWith(root) ? f.slice(root.length).replace(/^[\\/]+/, '') : f).replace(/\\/g, '/');
}

function countUnder(files: string[], prefix: string): number {
  return files.filter(f => f === prefix || f.startsWith(prefix.endsWith('/') ? prefix : prefix + '/')).length;
}

function detectConfig(rel: string[]): string | null {
  if (rel.some(f => /\.ini$/.test(f) && !f.startsWith('node_modules'))) return 'ini';
  if (rel.some(f => /^(app|config)\.(yaml|yml)$/.test(f))) return 'yaml';
  if (rel.includes('docker-compose.yml') || rel.includes('docker-compose.yaml')) return 'docker-compose yaml';
  if (rel.includes('appsettings.json')) return 'json (appsettings)';
  if (rel.some(f => /^(config|pyproject)\.toml$/.test(f))) return 'toml';
  return null;
}

const ENTITY_SKIP = new Set(['migrations', 'migration', 'fixtures', 'testdata', 'test', 'tests', 'mocks', 'seed', 'seeds']);

function detectEntities(rel: string[]): string {
  const MODEL_DIRS = ['models', 'model', 'entities', 'domain'];
  for (const dir of MODEL_DIRS) {
    const prefix = dir + '/';
    const modelRel = rel.filter(f => f.startsWith(prefix));
    if (modelRel.length < 5) continue;
    const subdirs = new Set<string>();
    for (const f of modelRel) {
      const part = f.slice(prefix.length).split('/')[0];
      // Skip files (have extension) and infrastructure dirs
      if (!part || part.includes('.') || part.startsWith('.')) continue;
      if (ENTITY_SKIP.has(part.toLowerCase())) continue;
      subdirs.add(part);
    }
    const dirs = [...subdirs].filter(d => d.length > 2);
    if (dirs.length >= 3) return `${dir}/ → ${dirs.slice(0, 12).join(' ')}`;
  }
  return '';
}

function detectCI(rel: string[]): string | null {
  if (rel.some(f => f.startsWith('.github/workflows/'))) return 'github-actions';
  if (rel.some(f => f.startsWith('.circleci/'))) return 'circleci';
  if (rel.includes('Jenkinsfile')) return 'jenkins';
  if (rel.includes('.travis.yml')) return 'travis';
  if (rel.includes('azure-pipelines.yml')) return 'azure-pipelines';
  if (rel.some(f => f.startsWith('.gitlab-ci'))) return 'gitlab-ci';
  if (rel.includes('bitbucket-pipelines.yml')) return 'bitbucket-pipelines';
  return null;
}

function detectPackageManagers(rel: string[]): string[] {
  const managers: string[] = [];
  if (rel.includes('pnpm-lock.yaml')) managers.push('pnpm');
  else if (rel.includes('yarn.lock')) managers.push('yarn');
  else if (rel.includes('bun.lockb') || rel.includes('bun.lock')) managers.push('bun');
  else if (rel.includes('package-lock.json')) managers.push('npm');
  else if (rel.some(f => f === 'package.json')) managers.push('npm');
  if (rel.includes('go.sum')) managers.push('gomod');
  if (rel.includes('Cargo.lock')) managers.push('cargo');
  if (rel.includes('uv.lock')) managers.push('uv');
  else if (rel.includes('poetry.lock')) managers.push('poetry');
  else if (rel.includes('Pipfile.lock')) managers.push('pipenv');
  else if (rel.some(f => f === 'pyproject.toml' || f === 'setup.py' || f === 'setup.cfg')) managers.push('pip');
  if (rel.includes('Gemfile.lock')) managers.push('bundler');
  if (rel.includes('composer.lock')) managers.push('composer');
  if (rel.includes('pubspec.lock')) managers.push('pub');
  if (rel.some(f => f === 'mix.exs' || f === 'mix.lock')) managers.push('mix');
  return managers;
}

const PACKAGE_SKIP = new Set([
  'test', 'tests', '__tests__', 'spec', 'specs', 'testdata', 'fixtures', 'mocks',
  'vendor', 'third_party', 'node_modules', 'dist', 'build', 'coverage', 'out',
  'docs', 'doc', 'examples', 'example', 'demos', 'demo', 'samples', 'sample',
  'scripts', 'tools', 'hack', 'assets', 'static', 'public', 'web_src',
  'migrations', 'schema', 'config', 'configs', 'docker', 'infra', 'deploy',
  '.github', '.circleci', 'contrib', 'ops',
]);

function detectTopPackages(rel: string[]): string {
  // Count source files per top-level directory — ranks internal packages by weight
  const counts = new Map<string, number>();
  const SOURCE_EXT = /\.(go|ts|tsx|js|jsx|py|rb|rs|java|kt|cs|ex|exs|scala|swift|dart|cpp|c|h|php)$/;

  for (const f of rel) {
    const slash = f.indexOf('/');
    if (slash === -1) continue;  // root-level file, not in a dir
    const topDir = f.slice(0, slash);
    if (!topDir || PACKAGE_SKIP.has(topDir.toLowerCase()) || topDir.startsWith('.')) continue;
    if (!SOURCE_EXT.test(f)) continue;
    counts.set(topDir, (counts.get(topDir) ?? 0) + 1);
  }

  if (counts.size === 0) return '';

  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Only emit if the top package is meaningfully larger than a flat root project
  if (top[0]![1] < 5) return '';

  return top.map(([dir, n]) => `${dir}/(${n})`).join(' ');
}

function detectPatterns(rel: string[]): string {
  const d = (name: string) => rel.some(f => f === name || f.startsWith(name + '/'));
  const countIn = (prefix: string) => rel.filter(f => f.startsWith(prefix + '/')).length;

  const patterns: string[] = [];

  // Strategy pattern: pluggable implementations via source/provider/driver subdirs
  // e.g. services/auth/source/{db,ldap,oauth2,smtp} → strategy(auth)
  const STRATEGY_DIRS = ['source', 'sources', 'provider', 'providers', 'strategy', 'strategies', 'driver', 'drivers'];
  const strategyContainers = new Map<string, Set<string>>();
  for (const f of rel) {
    const parts = f.split('/');
    const idx = parts.findIndex(p => STRATEGY_DIRS.includes(p));
    if (idx > 0 && parts.length > idx + 1) {
      const container = parts.slice(0, idx).join('/');  // e.g. "services/auth"
      if (!strategyContainers.has(container)) strategyContainers.set(container, new Set());
      const impl = parts[idx + 1]!;
      if (!impl.includes('.')) strategyContainers.get(container)!.add(impl);
    }
  }
  for (const [container, impls] of strategyContainers) {
    if (impls.size >= 3) {
      const label = container.split('/').pop()!;
      patterns.push(`strategy(${label})`);
      break;  // report first match only
    }
  }

  // Repository / data-access pattern — only meaningful if top-level or one level deep
  if (rel.some(f => /^(?:[^/]+\/)?(?:repositories|repository)\//.test(f))) {
    patterns.push('repository');
  }

  // Factory pattern
  if (rel.some(f => /^(?:[^/]+\/){0,2}(?:factory|factories|builders?)\//.test(f)) ||
      rel.some(f => /^(?:[^/]+\/){0,1}factory\.(go|ts|js|py|rb|java|cs)$/.test(f))) {
    patterns.push('factory');
  }

  // Event-driven — requires a dedicated top-level or near-top events infrastructure
  const eventFiles = rel.filter(f => /^(?:[^/]+\/){0,2}(?:events?|event_bus|pubsub|dispatcher)\//.test(f));
  if (eventFiles.length >= 3) patterns.push('event-driven');

  // Plugin / extension — top-level or immediate child plugins dir with real content
  const pluginFiles = rel.filter(f => /^(?:[^/]+\/)?(?:plugins?|extensions?|addons?)\//.test(f));
  if (pluginFiles.length >= 3) patterns.push('plugin');

  // Middleware chain
  if (d('middleware') || d('middlewares') || d('routers/common') ||
      rel.some(f => /^[^/]+\/middleware\//.test(f))) {
    patterns.push('middleware-chain');
  }

  // CQRS
  if ((d('commands') || d('command')) && (d('queries') || d('query'))) {
    patterns.push('cqrs');
  }

  return patterns.join(' ');
}

function detectLandmarks(files: string[], root: string): DnaFragment[] {
  const rel = files.map(f => toRel(f, root));
  const filtered = filterLandmarkFiles(rel);
  const out: DnaFragment[] = [];

  const ci = detectCI(rel);
  if (ci) out.push({ section: '@CI', line: ci });

  const pkgs = detectPackageManagers(rel);
  if (pkgs.length) out.push({ section: '@PKG', line: pkgs.join(' ') });

  const cfg = detectConfig(rel);
  if (cfg) out.push({ section: '@CONFIG', line: cfg });

  const entities = detectEntities(rel);
  if (entities) out.push({ section: '@ENTITIES', line: entities });

  const auth = detectAuth(rel);
  if (auth) out.push({ section: '@AUTH', line: auth });

  const arch = detectArch(rel);
  if (arch) out.push({ section: '@ARCH', line: arch });

  const topPkgs = detectTopPackages(rel);
  if (topPkgs) out.push({ section: '@PACKAGES', line: topPkgs });

  const struct = detectStruct(rel);
  if (struct) out.push({ section: '@STRUCT', line: struct });

  const patterns = detectPatterns(rel);
  if (patterns) out.push({ section: '@PATTERNS', line: patterns });

  const entry = findEntry(filtered);
  if (entry) out.push({ section: '@ENTRY', line: entry });

  const routes = findRoutes(filtered);
  if (routes) {
    const n = countUnder(filtered, routes.replace(/\/$/, ''));
    const suffix = routes.endsWith('/') && n > 0 ? ` (${n} files)` : '';
    out.push({ section: '@ROUTES', line: routes + suffix });
  }

  const mw = detectMiddleware(filtered);
  if (mw) out.push({ section: '@MIDDLEWARE', line: mw });

  const data = findData(filtered);
  if (data) {
    const n = data.endsWith('/') ? countUnder(filtered, data.replace(/\/$/, '')) : 0;
    const noun = n > 0 && data.toLowerCase().includes('migration') ? 'migrations' : 'files';
    const suffix = n > 0 ? ` (${n} ${noun})` : '';
    out.push({ section: '@DATA', line: data + suffix });
  }

  return out;
}

function pickByScore(files: string[], patterns: Array<[RegExp, number]>): string | null {
  let best: string | null = null;
  let bestScore = -1;
  for (const f of files) {
    for (const [re, score] of patterns) {
      if (re.test(f)) {
        const beats = score > bestScore || (score === bestScore && best !== null && f.length < best.length);
        if (beats) { best = f; bestScore = score; }
      }
    }
  }
  return best;
}

function hasDir(files: string[], dir: string): boolean {
  return files.some(f => f === dir || f.startsWith(dir + '/'));
}

function findEntry(files: string[]): string | null {
  return pickByScore(files, [
    [/^src\/index\.[jt]sx?$/, 10],
    [/^src\/main\.[jt]sx?$/, 10],
    [/^main\.go$/, 10],
    [/^src\/main\.rs$/, 10],
    [/^src\/lib\.rs$/, 9],
    [/^cmd\/[^/]+\/main\.go$/, 9],
    [/^app\.py$/, 9],
    [/^main\.py$/, 9],
    [/^index\.[jt]sx?$/, 8],
    [/^src\/server\.[jt]sx?$/, 8],
    [/^src\/app\.[jt]sx?$/, 7],
    [/^[^/]+\/main\.go$/, 7],
    [/^[^/]+\/applications\.py$/, 7],
    [/^crates\/[^/]+\/main\.rs$/, 7],
    [/^lib\/main\.dart$/, 10],
    [/^[^/]+\/lib\/main\.dart$/, 7],
    [/\/src\/index\.[jt]sx?$/, 6],
    [/\/src\/main\.[jt]sx?$/, 6],
  ]);
}

const SKIP_LANDMARK_RE = /(?:^|\/)(?:test|tests|__tests__|spec|specs|playground|playgrounds|examples?|demos?|samples?|fixtures|benchmarks|integration|node_modules|vendor|third_party)\//i;

function filterLandmarkFiles(files: string[]): string[] {
  return files.filter(f => !SKIP_LANDMARK_RE.test(f + '/'));
}

function findRoutes(files: string[]): string | null {
  // Ordered by specificity — first match wins
  const ROUTE_DIRS = [
    'src/app', 'src/pages', 'src/routes',        // Next.js / SvelteKit / Remix
    'routes',                                      // generic
    'routers',                                     // Go (Gitea, chi-based apps)
    'router',                                      // Go single-package router
    'controllers',                                 // MVC (Rails, Spring, Laravel, NestJS)
    'handlers',                                    // Go/Rust handler layer
    'api',                                         // REST-first projects
    'src/controllers', 'src/handlers', 'src/api',  // src-scoped variants
    'app/Http/Controllers',                        // Laravel
    'app/controllers',                             // Rails
    'app/routers', 'pkg/cmd',                      // Go workspace
    'internal/handler', 'internal/handlers',       // Go internal
    'internal/api', 'internal/router',             // Go internal (alt)
    'lib/phoenix_web/controllers',                 // Phoenix
    'web/controllers',                             // Phoenix alt
  ];
  for (const dir of ROUTE_DIRS) {
    if (hasDir(files, dir)) return dir + '/';
  }
  return pickByScore(files, [
    [/^[^/]+\/routing\.py$/, 8],
    [/^[^/]+\/urls\.py$/, 8],
    [/^[^/]+\/router\.(go|rs)$/, 8],
    [/^src\/router\.[jt]sx?$/, 8],
    [/^src\/routes\.[jt]sx?$/, 8],
    [/^[^/]+\/router\.[jt]sx?$/, 6],
    [/^[^/]+\/routing\/mod\.rs$/, 8],
  ]);
}

// Auth method labels in priority order — checked against file paths
const AUTH_METHODS: Array<[RegExp, string]> = [
  [/\/(ldap|ldaps)\//i,        'ldap'],
  [/\/oauth2?\//i,              'oauth'],
  [/\/webauthn\//i,             'webauthn'],
  [/\/saml\//i,                 'saml'],
  [/\/openid\//i,               'openid'],
  [/\/pam\//i,                  'pam'],
  [/\/sso\//i,                  'sso'],
  [/\/jwt\//i,                  'jwt'],
  [/\/password\//i,             'password'],
  [/\/totp\//i,                 'totp'],
  [/\/(2fa|mfa|twofactor)\//i,  '2fa'],
  [/\/cas\//i,                  'cas'],
  [/\/smtp\//i,                 'smtp'],
];

function detectAuth(rel: string[]): string | null {
  const found = new Set<string>();
  for (const f of rel) {
    for (const [re, label] of AUTH_METHODS) {
      if (re.test('/' + f)) found.add(label);
    }
  }
  // Also check if there's an auth-specific source/provider dir structure
  const authSourceFiles = rel.filter(f => /\/auth\/source\/|\/auth\/provider\//i.test(f));
  if (authSourceFiles.length > 0) {
    const subdirs = new Set(authSourceFiles.map(f => {
      const m = f.match(/\/(?:source|provider)\/([^/]+)\//i);
      return m?.[1]?.toLowerCase();
    }).filter(Boolean));
    for (const sub of subdirs) {
      if (sub) found.add(sub);
    }
  }
  if (found.size === 0) return null;
  return [...found].join(' ');
}

function detectArch(rel: string[]): string | null {
  const d = (name: string) => rel.some(f => f === name || f.startsWith(name + '/'));

  const hasSvc     = d('services') || d('service') || d('svc');
  const hasMdl     = d('models') || d('model') || d('entities') || d('entity');
  const hasCtrl    = d('controllers') || d('ctrl');
  const hasHandler = d('handlers') || d('handler');
  const hasRouters = d('routers') || d('router') || d('routes') || d('routing');
  const hasRepo    = d('repositories') || d('repository') || d('repo') || d('store');
  const hasDomain  = d('domain');
  const hasInfra   = d('infrastructure') || d('infra') || d('adapters') || d('adapter');
  const hasPorts   = d('ports');
  const hasUsecase = d('usecases') || d('usecase') || d('application') || d('app/use_cases');
  const hasViews   = d('views') || d('view') || d('templates');
  const hasCmd     = d('cmd');
  const hasMods    = d('modules');

  const parts: string[] = [];

  if (hasDomain && (hasInfra || hasPorts)) {
    // Hexagonal / Clean arch
    if (hasUsecase) parts.push('clean-arch(domain→usecase→infra)');
    else parts.push('hexagonal(domain→infra)');
  } else if (hasUsecase && (hasDomain || hasMdl)) {
    parts.push('clean-arch(usecase→domain)');
  } else if (hasSvc && hasMdl && (hasRouters || hasCtrl || hasHandler)) {
    // Classic layered: routes → svc → models
    const chain: string[] = [];
    if (hasCmd) chain.push('cmd');
    chain.push(hasRouters ? 'routes' : hasCtrl ? 'ctrl' : 'handler');
    chain.push('svc');
    chain.push(hasMdl ? 'mdl' : 'domain');
    parts.push(`layered(${chain.join('→')})`);
  } else if (hasCtrl && hasMdl && hasViews) {
    parts.push('mvc(ctrl→mdl→view)');
  } else if ((hasSvc || hasCtrl) && hasRepo) {
    parts.push('repository-pattern');
  } else if (hasMods && (hasSvc || hasCtrl)) {
    parts.push('modular');
  }

  // Auth strategy pattern — multiple auth source files
  const authFiles = rel.filter(f => f.includes('/auth') || f.endsWith('_auth.go') || f.includes('/source/')).length;
  if (authFiles >= 5 && hasSvc) parts.push('strategy(auth)');

  return parts.length > 0 ? parts.join(' ') : null;
}

function detectMiddleware(rel: string[]): string | null {
  const d = (name: string) => rel.some(f => f === name || f.startsWith(name + '/'));

  // Explicit middleware directories (highest confidence)
  for (const dir of ['middleware', 'middlewares', 'app/Http/Middleware', 'app/middleware',
                     'src/middleware', 'src/middlewares', 'internal/middleware',
                     'routers/common', 'router/common']) {
    if (d(dir)) return dir + '/';
  }

  // Files explicitly named "middleware" in a routes/handlers context
  const mwFiles = rel.filter(f =>
    /(?:^|\/)(?:routers?|handlers?|http|web|api)\/[^/]*middleware[^/]*\.(go|ts|js|py|rb)$/i.test(f) ||
    /(?:^|\/)middleware\.(go|ts|js|py|rb)$/i.test(f) ||
    /(?:^|\/)error.?handler\.(go|ts|js|py|rb)$/i.test(f)
  );
  if (mwFiles.length > 0) {
    const dirs = mwFiles.map(f => f.split('/').slice(0, -1).join('/'));
    const first = dirs[0]!;
    if (dirs.every(d => d === first)) return first + '/';
    return mwFiles[0]!;
  }

  return null;
}

function findData(files: string[]): string | null {
  const file = pickByScore(files, [
    [/^prisma\/schema\.prisma$/, 10],
    [/^[^/]+\/schema\.prisma$/, 9],
    [/^schema\.sql$/, 9],
    [/^db\/schema\.[^/]+$/, 8],
    [/^[^/]+\/models\.py$/, 7],
    [/^[^/]+\/schema\.go$/, 7],
    [/^[^/]+\/schema\.ts$/, 7],
  ]);
  if (file) return file;
  for (const dir of ['prisma', 'migrations', 'schema', 'db']) {
    if (hasDir(files, dir)) return dir + '/';
  }
  // Nested migration dirs (e.g. models/migrations, internal/db/migrations)
  for (const nested of ['models/migrations', 'internal/migrations', 'db/migrations', 'src/migrations']) {
    if (hasDir(files, nested)) return nested + '/';
  }
  return null;
}

const STRUCT_SKIP = new Set([
  'node_modules', 'vendor', 'third_party',
  'dist', 'build', 'out', 'target', 'bin', 'obj',
  'coverage', '__pycache__', '.cache', '.git',
  'test', 'tests', '__tests__', 'spec', 'specs',
  'public', 'static', 'assets', 'docs', 'doc',
  'options', 'locale', 'i18n', 'fixtures', 'testdata',
]);

// Dirs worth expanding with second-level subdir names
const STRUCT_EXPAND = new Set([
  'routers', 'router', 'routes', 'controllers', 'handlers',
  'models', 'model', 'entities', 'domain',
  'services', 'service', 'svc',
  'modules', 'module', 'pkg',
  'cmd', 'internal', 'api', 'lib',
  'app', 'src', 'core', 'server',
  'integrations', 'integration', 'contrib',
  'templates', 'views', 'web_src', 'frontend',
]);

function detectStruct(rel: string[]): string {
  const topCounts = new Map<string, number>();
  const subDirs = new Map<string, Map<string, number>>();

  for (const f of rel) {
    const parts = f.split('/');
    if (parts.length < 2) continue;
    const top = parts[0]!;
    if (!top || top.startsWith('.') || STRUCT_SKIP.has(top.toLowerCase())) continue;

    topCounts.set(top, (topCounts.get(top) ?? 0) + 1);

    // Collect second-level subdirs for expand-worthy dirs
    if (STRUCT_EXPAND.has(top.toLowerCase()) && parts.length >= 3) {
      const sub = parts[1]!;
      if (sub && !sub.includes('.') && !sub.startsWith('.')) {
        if (!subDirs.has(top)) subDirs.set(top, new Map());
        subDirs.get(top)!.set(sub, (subDirs.get(top)!.get(sub) ?? 0) + 1);
      }
    }
  }

  const sorted = [...topCounts.entries()]
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14);

  if (sorted.length === 0) return '';

  return sorted.map(([dir, count]) => {
    const countLabel = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;
    const subs = subDirs.get(dir);
    if (subs && subs.size >= 2) {
      const topSubs = [...subs.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([s]) => s)
        .join(',');
      return `${dir}/{${topSubs}}(${countLabel})`;
    }
    return `${dir}/(${countLabel})`;
  }).join(' ');
}

function buildCustomCodexCandidates(files: string[], root: string): CodexEntry[] {
  const counts = new Map<string, number>();
  const stdLongs = new Set(Object.values(STANDARD_CODEC).map(v => v.toLowerCase()));

  for (const path of files) {
    const rel = path.startsWith(root) ? path.slice(root.length + 1) : path;
    const parts = rel.split(/[\\/]/);

    // Skip entire subtree if any ancestor is a skip dir
    const dirs = parts.slice(0, -1);
    if (dirs.some(d => SKIP_CODEX_DIRS.has(d.toLowerCase()))) continue;
    for (const p of dirs) {
      if (!p || p.startsWith('.') || p.length <= 3) continue;
      if (p.includes('-')) continue;           // hyphenated = sample/feature name, not structural
      if (stdLongs.has(p.toLowerCase())) continue; // already covered by standard codec
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
    // PascalCase prefix from file basenames (e.g. UserService.ts → User)
    const fname = parts[parts.length - 1] ?? '';
    const pascal = fname.match(/^([A-Z][a-z]{2,})/);
    if (pascal?.[1]) counts.set(pascal[1], (counts.get(pascal[1]) ?? 0) + 1);
  }

  const totalDirs = counts.size;
  const minCount = Math.max(3, Math.floor(totalDirs / 15));

  const sorted = [...counts.entries()]
    .filter(([name, c]) => c >= minCount && !name.startsWith('_') && !name.startsWith('with-'))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 20);

  const used = new Set([...Object.keys(STANDARD_CODEC), ...BANNED_SHORTS]);
  const entries: CodexEntry[] = [];

  for (const [name] of sorted) {
    let short = name.slice(0, 2).toLowerCase();
    let i = 2;
    while (used.has(short) && i < name.length) short = name.slice(0, ++i).toLowerCase();
    if (used.has(short)) continue;
    used.add(short);
    entries.push([short, name]);
  }
  return entries;
}

// Patterns that indicate prompt injection attempts in README/doc content
const INJECTION_RE = [
  /ignore\s+(previous|prior|all|above)\s+(instructions?|context|prompts?)/i,
  /disregard\s+(previous|prior|all|above)/i,
  /you\s+are\s+now\s+(a|an|the)\s/i,
  /from\s+now\s+on[,\s]/i,
  /\bact\s+as\s+(a|an|the)\s/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /new\s+instructions?\s*:/i,
  /^(system|user|assistant)\s*:/i,
  /<\|im_(start|end)\|>|\[INST\]|\[\/INST\]/i,
];

function sanitizeContext(value: string): string {
  return value
    .split('\n')
    .filter(line => !INJECTION_RE.some(re => re.test(line)))
    .join('\n');
}

function formatContext(ctx: ContextResult): string {
  const order: Array<[keyof NonNullable<ContextResult['compressed']>, string]> = [
    ['purpose', '@PURPOSE'],
    ['conventions', '@CONVENTIONS'],
    ['setup', '@SETUP'],
    ['env', '@ENV'],
    ['testing', '@TESTING'],
    ['deploy', '@DEPLOY'],
    ['gotchas', '@GOTCHAS'],
  ];
  const lines: string[] = [];
  for (const [key, tag] of order) {
    const value = ctx.compressed[key];
    if (value) lines.push(`${tag} ${oneLine(sanitizeContext(value))}`);
  }
  return lines.join('\n') || '(none)';
}

function oneLine(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function printSummary(
  zones: Zone[],
  fileCount: number,
  context: ContextResult,
  elapsed: string,
  output: string,
): void {
  for (const zone of zones) {
    console.log(`  [${zone.kind}] ${zone.files.length} files`);
  }
  if (context.sources.length > 0) {
    const names = context.sources.map(s => basename(s)).join(', ');
    console.log(`  [md] ${context.sources.length} files — ${names}`);
  }
  const tokenEstimate = Math.ceil(output.length / 4);
  console.log(
    `\n  ${fileCount} files | ${zones.length} zones | .chode written (~${tokenEstimate} tokens) | ${elapsed}s`,
  );
  for (const w of context.warnings) console.log(`  warn: ${w}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
