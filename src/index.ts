#!/usr/bin/env node
import { resolve, basename, join } from 'node:path';
import { writeFile, readFile, stat, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { walk } from './crawler/walker.ts';
import { detect } from './crawler/detector.ts';
import { ingestContext } from './ingest/context.ts';
import { buildDna } from './encode/dna.ts';
import { assemble } from './encode/assembler.ts';
import type { ContextResult, Zone } from './types.ts';
import { generateProfile, extractDna, formatContext, buildCustomCodexCandidates } from './generate.ts';
import { buildCodex, buildCodexMap } from './encode/codex.ts';
import { buildTree } from './encode/tree.ts';

async function computeHash(files: string[]): Promise<string> {
  const mtimes = await Promise.all(files.map(f => stat(f).then(s => s.mtimeMs).catch(() => 0)));
  const input = files.map((f, i) => `${f}:${mtimes[i]}`).join('\n');
  return createHash('sha1').update(input).digest('hex');
}

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

  const { files, warnings: walkWarnings } = await walk(target);
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
  if (!hasDrift) { console.log('  up to date — no drift detected'); process.exit(0); }

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

function printSummary(zones: Zone[], fileCount: number, context: ContextResult, elapsed: string, output: string, walkWarnings: string[] = []): void {
  for (const zone of zones) console.log(`  [${zone.kind}] ${zone.files.length} files`);
  if (context.sources.length > 0) {
    const names = context.sources.map(s => basename(s)).join(', ');
    console.log(`  [md] ${context.sources.length} files — ${names}`);
  }
  const tokenEstimate = Math.ceil(output.length / 4);
  console.log(`\n  ${fileCount} files | ${zones.length} zones | .chode written (~${tokenEstimate} tokens) | ${elapsed}s`);
  for (const w of [...walkWarnings, ...context.warnings]) console.log(`  warn: ${w}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--version') || args.includes('-v')) {
    console.log('chode 0.0.1');
    process.exit(0);
  }
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: chode [options] [target]

  target    path to a directory or GitHub URL (default: .)

Options:
  --full      include tree and codex sections
  --force     skip cache check and regenerate
  --stdout    write to stdout instead of file
  --json      write structured JSON to stdout instead of file
  --verify    check .chode for drift without updating
  --commit    git commit the .chode file after writing
  --version   print version
  --help      print this help`);
    process.exit(0);
  }

  const doCommit = args.includes('--commit');
  const force = args.includes('--force');
  const full = args.includes('--full');
  const doVerify = args.includes('--verify');
  const doStdout = args.includes('--stdout');
  const doJson = args.includes('--json');
  const targetArg = args.find(a => !a.startsWith('--')) ?? '.';
  const target = resolve(targetArg);
  const chodeFile = `${target}/.chode`;
  const hashFile = `${target}/.chode.hash`;

  // Fixes #3: anchored end, HTTPS-only, exactly two path segments, no query/fragment/extra paths
  const normalizedArg = targetArg.replace(/\.git$/, '');
  const isGitHubUrl = /^https:\/\/github\.com\/[^/?#]+\/[^/?#]+$/.test(normalizedArg);
  let tmpDir: string | undefined;
  if (isGitHubUrl) {
    const repoUrl = normalizedArg + '.git';
    tmpDir = await mkdtemp(join(tmpdir(), 'chode-'));
    console.log(`  cloning ${repoUrl}...\n`);
    const clone = spawnSync('git', ['clone', '--depth=1', repoUrl, tmpDir], { stdio: 'inherit' });
    if (clone.status !== 0) {
      await rm(tmpDir, { recursive: true, force: true });
      console.error('  error: git clone failed');
      process.exit(1);
    }
    const args2 = process.argv.slice(2).map(a => a === targetArg ? tmpDir! : a);
    process.argv = [...process.argv.slice(0, 2), ...args2];
  }

  const resolvedTarget = tmpDir ?? target;
  const resolvedChodeFile = `${resolvedTarget}/.chode`;
  const resolvedHashFile = `${resolvedTarget}/.chode.hash`;

  if (doVerify) {
    await runVerify(resolvedTarget, resolvedChodeFile);
    if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
    return;
  }

  if (!isGitHubUrl) {
    try {
      const s = await stat(target);
      if (!s.isDirectory()) throw new Error('not a directory');
    } catch {
      console.error(`  error: '${target}' is not a directory`);
      process.exit(1);
    }
  }

  const start = performance.now();
  console.log(`chode sequencing ${resolvedTarget}\n`);

  const { files, warnings: walkWarnings } = await walk(resolvedTarget);

  const currentHash = await computeHash(files);
  if (!force && !isGitHubUrl) {
    try {
      const savedHash = await readFile(resolvedHashFile, 'utf8');
      if (savedHash.trim() === currentHash) {
        console.log(`  up to date (${files.length} files, hash match)`);
        return;
      }
    } catch {}
  }

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
  if (full) {
    const codexCandidates = buildCustomCodexCandidates(files, resolvedTarget);
    const codexMap = buildCodexMap(codexCandidates);
    tree = buildTree(resolvedTarget, files, codexMap);
    codex = buildCodex(codexCandidates);
  }

  const output = assemble({ dna, context: contextStr, tree, codex, gitHash });

  if (doJson) {
    const dnaRecord: Record<string, string> = {};
    for (const f of dnaFragments) {
      dnaRecord[f.section] = dnaRecord[f.section] ? `${dnaRecord[f.section]} | ${f.line}` : f.line;
    }
    const flatContext = Object.fromEntries(
      Object.entries(context.compressed ?? {}).map(([k, v]) => [k, (v ?? '').replace(/\s+/g, ' ').trim()])
    );
    process.stdout.write(JSON.stringify({ version: tree ? 'v1' : 'v2', gitHash, dna: dnaRecord, context: flatContext }, null, 2) + '\n');
    if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
    return;
  }

  if (doStdout) {
    process.stdout.write(output + '\n');
    if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
    return;
  }

  await writeFile(resolvedChodeFile, output, 'utf8');
  if (!isGitHubUrl) await writeFile(resolvedHashFile, currentHash, 'utf8');

  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  printSummary(zones, files.length, context, elapsed, output, walkWarnings);

  if (doCommit && !isGitHubUrl) {
    const commit = spawnSync('git', ['commit', '-o', '-m', 'chore: update .chode', '--', '.chode'], { cwd: resolvedTarget, stdio: 'inherit' });
    if (commit.status !== 0) console.log('  nothing to commit (.chode unchanged)');
  }

  if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
}

main().catch((err) => { console.error(err); process.exit(1); });
