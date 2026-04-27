import type { Zone, ZoneKind } from '../types.ts';

const ANCHOR_FILES: Record<string, ZoneKind> = {
  'package.json': 'ts',
  'go.mod': 'go',
  'Cargo.toml': 'rust',
  'pyproject.toml': 'python',
  'requirements.txt': 'python',
  'Gemfile': 'ruby',
  'composer.json': 'php',
  'pom.xml': 'java',
  'build.gradle': 'java',
  'build.gradle.kts': 'kotlin',
  'mix.exs': 'elixir',
  'CMakeLists.txt': 'cpp',
  'pubspec.yaml': 'dart',
  'build.sbt': 'scala',
  'Package.swift': 'swift',
  'schema.prisma': 'prisma',
};

const EXT_TO_KIND: Record<string, ZoneKind> = {
  ts: 'ts', tsx: 'ts',
  js: 'js', jsx: 'js', mjs: 'js', cjs: 'js',
  go: 'go',
  rs: 'rust',
  py: 'python',
  rb: 'ruby',
  php: 'php',
  java: 'java', kt: 'kotlin', kts: 'kotlin',
  ex: 'elixir', exs: 'elixir',
  cpp: 'cpp', cc: 'cpp', cxx: 'cpp', c: 'cpp', h: 'cpp', hpp: 'cpp',
  cs: 'csharp',
  dart: 'dart',
  scala: 'scala', sc: 'scala',
  swift: 'swift',
  yml: 'yaml', yaml: 'yaml',
  prisma: 'prisma',
  json: 'json',
  md: 'markdown', mdx: 'markdown', rst: 'markdown',
};

export type DetectResult = {
  zones: Zone[];
  anchors: Record<string, string>;
};

function depth(path: string): number {
  return path.split(/[\\/]/).length;
}

export function detect(files: string[]): DetectResult {
  const anchors: Record<string, string> = {};
  for (const path of files) {
    const name = basename(path);
    if (ANCHOR_FILES[name]) {
      if (!anchors[name] || depth(path) < depth(anchors[name]!)) {
        anchors[name] = path;
      }
    }
  }

  const byKind = new Map<ZoneKind, string[]>();
  for (const path of files) {
    const ext = extOf(path);
    const kind = ext ? EXT_TO_KIND[ext] : undefined;
    if (!kind) continue;
    if (!byKind.has(kind)) byKind.set(kind, []);
    byKind.get(kind)!.push(path);
  }

  const zones: Zone[] = [];
  for (const [kind, paths] of byKind) {
    zones.push({ kind, files: paths });
  }
  zones.sort((a, b) => b.files.length - a.files.length);

  return { zones, anchors };
}

function basename(path: string): string {
  return path.split(/[\\/]/).pop() ?? '';
}

function extOf(path: string): string | undefined {
  const m = basename(path).match(/\.([^.]+)$/);
  return m?.[1]?.toLowerCase();
}
