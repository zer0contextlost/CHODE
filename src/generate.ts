/**
 * Core generation pipeline — shared by CLI (index.ts) and MCP server (mcp.ts).
 * Exports: generateProfile, extractDna, formatContext, buildCustomCodexCandidates
 */
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
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
import { detectLandmarks, toRel } from './detect/landmarks.ts';
import {
  NOTABLE_JS, GO_HTTP_ROUTERS, NOTABLE_GO, NOTABLE_RUST, NOTABLE_DART,
  NOTABLE_SCALA, NOTABLE_SWIFT, NOTABLE_KOTLIN, NOTABLE_ELIXIR, NOTABLE_CSHARP,
  NOTABLE_PHP, NOTABLE_JAVA, NOTABLE_RUBY, NOTABLE_PYTHON,
  EXT_SERVICES_GO, EXT_SERVICES_JS,
  FRONTEND_DIRS, FRONTEND_FRAMEWORKS, BUNDLERS, TEST_FRAMEWORKS_JS,
} from './detect/notable.ts';
import type { DnaFragment, ContextResult, Zone } from './types.ts';

export const SKIP_CODEX_DIRS = new Set([
  'examples', 'fixtures', 'test', 'tests', 'benchmarks',
  'demos', 'demo', 'samples', 'sample', 'node_modules',
  'template', 'docs_src', '.changeset', '.github', '.codesandbox',
  'playground', 'playgrounds', 'vendor', 'third_party',
]);

export const BANNED_SHORTS = new Set([
  'in', 'do', 'if', 'is', 'or', 'as', 'of', 'to', 'be', 'by',
  'at', 'no', 'on', 'up', 'go', 'we', 'he', 'me', 'it', 'an',
  'my', 'so', 'ok', 'id',
]);

function stripGoVersion(mod: string): string {
  return mod.replace(/\/v\d+$/, '');
}

export { toRel };

export function buildCustomCodexCandidates(files: string[], root: string): CodexEntry[] {
  const counts = new Map<string, number>();
  const stdLongs = new Set(Object.values(STANDARD_CODEC).map(v => v.toLowerCase()));

  for (const path of files) {
    const rel = path.startsWith(root) ? path.slice(root.length + 1) : path;
    const parts = rel.split(/[\\/]/);
    const dirs = parts.slice(0, -1);
    if (dirs.some(d => SKIP_CODEX_DIRS.has(d.toLowerCase()))) continue;
    for (const p of dirs) {
      if (!p || p.startsWith('.') || p.length <= 3) continue;
      if (p.includes('-')) continue;
      if (stdLongs.has(p.toLowerCase())) continue;
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
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
  return value.split('\n').filter(line => !INJECTION_RE.some(re => re.test(line))).join('\n');
}

function oneLine(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function formatContext(ctx: ContextResult): string {
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

// ── Core DNA extraction ───────────────────────────────────────────────────────

export async function extractDna(anchors: Record<string, string>, zones: Zone[], files: string[], root: string): Promise<DnaFragment[]> {
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
      const notable = [...notableSet].slice(0, 8).map(d => d.replace(/^@([^/]+)\/(.+)$/, '$1-$2'));
      const jsFiles = zones.filter(z => z.kind === 'js' || z.kind === 'ts').reduce((n, z) => n + z.files.length, 0);
      const totalFiles = zones.reduce((n, z) => n + z.files.length, 0);
      const jsIsMinor = hasForeignManifest && jsFiles / Math.max(totalFiles, 1) < 0.3;

      if (!jsIsMinor) {
        const parts: string[] = [];
        const name = rootPkg.name ?? '';
        if (name && !name.startsWith('@') && !name.includes('monorepo') && !name.includes('workspace')) parts.push(name);
        parts.push(lang);
        if (notable.length) parts.push(...notable);
        stackParts.push(parts.join(' '));
      } else if (jsFiles >= 50) {
        const frontendParts: string[] = [hasTs ? 'typescript' : 'javascript'];
        for (const f of frontendSet) frontendParts.push(f);
        for (const b of bundlerSet) frontendParts.push(b);
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
        const notable = mod.deps.map(d => NOTABLE_GO.get(stripGoVersion(d))).filter((s): s is string => s !== undefined);
        const deduped = [...new Set(notable)].slice(0, 6);
        detectedGoRouter = deduped.find(d => GO_HTTP_ROUTERS.has(d));
        stackParts.push(['go', ...deduped].join(' '));
        for (const d of mod.deps) {
          const stripped = stripGoVersion(d);
          const svc = EXT_SERVICES_GO.get(stripped) ?? [...EXT_SERVICES_GO.entries()].find(([k]) => stripped.startsWith(k))?.[1];
          if (svc) extServices.add(svc);
        }
      }
    } catch {}
  }

  if (anchors['Cargo.toml']) {
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
      } catch { stackParts.push('rust'); }
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
    } catch { stackParts.push('php'); }
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
    } catch { stackParts.push('java'); }
  }

  if (anchors['build.gradle.kts'] && !anchors['pom.xml'] && !isDartPrimary) {
    try {
      const text = await readFile(anchors['build.gradle.kts'], 'utf8');
      const notable: string[] = [];
      for (const dep of NOTABLE_KOTLIN) {
        if (text.includes(dep)) notable.push(dep);
        if (notable.length >= 6) break;
      }
      stackParts.push(['kotlin', ...notable].join(' '));
    } catch { stackParts.push('kotlin'); }
  }

  if (anchors['build.gradle'] && !anchors['pom.xml'] && !anchors['build.gradle.kts']) stackParts.push('java');

  if (anchors['mix.exs']) {
    try {
      const mix = await parseMixExs(anchors['mix.exs']);
      const notable = mix.deps.filter(d => NOTABLE_ELIXIR.has(d)).slice(0, 6);
      stackParts.push(['elixir', ...notable].join(' '));
    } catch { stackParts.push('elixir'); }
  }

  if (anchors['CMakeLists.txt'] && !isDartPrimary) stackParts.push('cpp');

  if (anchors['pubspec.yaml']) {
    try {
      const pub = await parsePubspec(anchors['pubspec.yaml']);
      const notable = pub.deps.filter(d => NOTABLE_DART.has(d)).slice(0, 6);
      stackParts.push(['dart', ...notable].join(' '));
    } catch { stackParts.push('dart'); }
  }

  if (anchors['build.sbt']) {
    try {
      const sbt = await parseBuildSbt(anchors['build.sbt']);
      const notable = sbt.deps.filter(d => NOTABLE_SCALA.has(d)).slice(0, 6);
      stackParts.push(['scala', ...notable].join(' '));
    } catch { stackParts.push('scala'); }
  }

  if (anchors['Package.swift']) {
    try {
      const pkg = await parsePackageSwift(anchors['Package.swift']);
      const notable = pkg.deps.filter(d => NOTABLE_SWIFT.has(d)).slice(0, 6);
      stackParts.push(['swift', ...notable].join(' '));
    } catch { stackParts.push('swift'); }
  }

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
      } catch { stackParts.push('csharp'); }
    }
  }

  if (anchors['Gemfile']) {
    const gemDepth = anchors['Gemfile']!.split(/[\\/]/).length;
    const hasShallowerPrimary = ['build.sbt', 'build.gradle.kts', 'build.gradle', 'pom.xml', 'go.mod', 'pyproject.toml', 'mix.exs', 'pubspec.yaml', 'Package.swift']
      .some(k => anchors[k] && anchors[k]!.split(/[\\/]/).length < gemDepth);
    if (!hasShallowerPrimary) {
      try {
        const g = await parseGemfile(anchors['Gemfile']);
        const notable = g.deps.filter(d => NOTABLE_RUBY.has(d)).slice(0, 6);
        stackParts.push(['ruby', ...notable].join(' '));
      } catch { stackParts.push('ruby'); }
    }
  }

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

  if (stackParts.length) fragments.push({ section: '@STACK', line: stackParts.join(' ') });
  if (extServices.size) fragments.push({ section: '@API', line: [...extServices].join(' ') });

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

// ── Public entry point ────────────────────────────────────────────────────────

export async function generateProfile(repoPath: string, opts: { full?: boolean } = {}): Promise<string> {
  const resolvedTarget = resolve(repoPath);
  const { files } = await walk(resolvedTarget);
  const { zones, anchors } = detect(files);

  const [context, dnaFragments] = await Promise.all([
    ingestContext('context', resolvedTarget, files),
    extractDna(anchors, zones, files, resolvedTarget),
  ]);

  const dna = buildDna(dnaFragments);
  const contextStr = formatContext(context);

  const gitHash = (() => {
    try {
      const r = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: resolvedTarget, encoding: 'utf8' });
      return r.stdout?.trim() || undefined;
    } catch { return undefined; }
  })();

  let tree: string | undefined;
  let codex: string | undefined;
  if (opts.full) {
    const codexCandidates = buildCustomCodexCandidates(files, resolvedTarget);
    const codexMap = buildCodexMap(codexCandidates);
    tree = buildTree(resolvedTarget, files, codexMap);
    codex = buildCodex(codexCandidates);
  }

  return assemble({ dna, context: contextStr, tree, codex, gitHash });
}
