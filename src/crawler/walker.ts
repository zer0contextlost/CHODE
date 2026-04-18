import { readdir, readFile, realpath } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DEFAULT_IGNORE = new Set([
  'node_modules', '.git', 'dist', 'build', 'vendor',
  '.next', '.nuxt', '__pycache__', '.pytest_cache', '.mypy_cache',
  'target', 'bin', 'obj', 'coverage', '.idea', '.vscode',
]);

const IGNORE_FILES = new Set(['.chode', '.chode.hash']);

// Fixes #2: hard limits to prevent resource exhaustion on adversarial repos
const MAX_FILES = 100_000;
const MAX_DEPTH = 50;

export type WalkResult = {
  files: string[];
  dirs: string[];
};

export async function walk(root: string): Promise<WalkResult> {
  const ignoreGlobs = await loadIgnoreFiles(root);
  const files: string[] = [];
  const dirs: string[] = [];
  // Fixes #1: resolve root to its real path so symlink boundary checks are consistent
  const realRoot = await realpath(root).catch(() => root);
  await walkDir(realRoot, realRoot, files, dirs, ignoreGlobs, 0);
  files.sort();
  dirs.sort();
  return { files, dirs };
}

async function walkDir(
  root: string,
  dir: string,
  files: string[],
  dirs: string[],
  ignoreGlobs: RegExp[],
  depth: number,
): Promise<void> {
  // Fixes #2: abort if depth or file count limits are exceeded
  if (depth > MAX_DEPTH || files.length >= MAX_FILES) return;

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  const subTasks: Promise<void>[] = [];
  for (const entry of entries) {
    if (files.length >= MAX_FILES) break; // Fixes #2: stop collecting once limit reached
    if (DEFAULT_IGNORE.has(entry.name)) continue;
    if (entry.isFile() && IGNORE_FILES.has(entry.name)) continue;

    const full = join(dir, entry.name);
    const rel = toPosix(relative(root, full));

    if (matchesAny(rel, entry.isDirectory(), ignoreGlobs)) continue;

    if (entry.isSymbolicLink()) {
      // Fixes #1: resolve symlink and skip if it escapes the repository root
      try {
        const real = await realpath(full);
        const rootWithSep = root.endsWith(sep) ? root : root + sep;
        if (real !== root && !real.startsWith(rootWithSep)) continue;
        // Symlink points within the root — treat as file (not recursed as dir)
        files.push(full);
      } catch {
        // Broken symlink — skip silently
      }
    } else if (entry.isDirectory()) {
      dirs.push(full);
      subTasks.push(walkDir(root, full, files, dirs, ignoreGlobs, depth + 1));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  await Promise.all(subTasks);
}

function toPosix(p: string): string {
  return sep === '\\' ? p.split(sep).join('/') : p;
}

function matchesAny(rel: string, isDir: boolean, globs: RegExp[]): boolean {
  for (const g of globs) {
    if (g.test(rel)) return true;
    if (isDir && g.test(rel + '/')) return true;
  }
  return false;
}

async function loadIgnoreFiles(root: string): Promise<RegExp[]> {
  const globs: RegExp[] = [];
  for (const name of ['.gitignore', '.chodeignore']) {
    let text: string;
    try {
      text = await readFile(join(root, name), 'utf8');
    } catch {
      continue;
    }
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#') || line.startsWith('!')) continue;
      for (const pattern of normalizePatterns(line)) {
        globs.push(globToRegex(pattern));
      }
    }
  }
  return globs;
}

function globToRegex(pattern: string): RegExp {
  let out = '';
  let i = 0;
  while (i < pattern.length) {
    const c = pattern[i]!;
    if (c === '*' && pattern[i + 1] === '*') {
      if (pattern[i + 2] === '/') { out += '(?:.*/)?'; i += 3; }
      else { out += '.*'; i += 2; }
    } else if (c === '*') { out += '[^/]*'; i++; }
    else if (c === '?') { out += '[^/]'; i++; }
    else if ('.+^$()[]{}|\\'.includes(c)) { out += '\\' + c; i++; }
    else { out += c; i++; }
  }
  return new RegExp(`^${out}$`);
}

function normalizePatterns(line: string): string[] {
  let p = line;
  if (p.endsWith('/')) p = p.slice(0, -1);
  if (p.startsWith('/')) p = p.slice(1);
  if (!p) return [];
  if (p.includes('/')) return [p, `${p}/**`];
  return [`**/${p}`, `**/${p}/**`];
}
