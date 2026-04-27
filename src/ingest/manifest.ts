import { readFile } from 'node:fs/promises';

export type PackageJson = {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

export type GoMod = { module: string; deps: string[] };
export type CargoToml = { name: string; deps: string[] };
export type PyProject = { name: string; deps: string[] };

export async function parsePackageJson(path: string): Promise<PackageJson> {
  const text = await readFile(path, 'utf8');
  return JSON.parse(text) as PackageJson;
}

export async function parseGoMod(path: string): Promise<GoMod> {
  const text = await readFile(path, 'utf8');
  const moduleMatch = text.match(/^module\s+(\S+)/m);
  const deps: string[] = [];
  const requireBlock = text.match(/require\s*\(([\s\S]*?)\)/);
  if (requireBlock && requireBlock[1]) {
    for (const line of requireBlock[1].split('\n')) {
      const m = line.trim().match(/^(\S+)\s+\S+/);
      if (m && m[1]) deps.push(m[1]);
    }
  }
  for (const m of text.matchAll(/^require\s+(\S+)\s+\S+/gm)) {
    if (m[1]) deps.push(m[1]);
  }
  return { module: moduleMatch?.[1] ?? '', deps };
}

export async function parseCargoToml(path: string): Promise<CargoToml> {
  const text = await readFile(path, 'utf8');
  const nameMatch = text.match(/\[package\][\s\S]*?name\s*=\s*"([^"]+)"/);
  const deps: string[] = [];
  const depsBlock = text.match(/\[dependencies\]([\s\S]*?)(?=\n\[|$)/);
  if (depsBlock && depsBlock[1]) {
    for (const line of depsBlock[1].split('\n')) {
      const m = line.match(/^([a-zA-Z0-9_-]+)\s*=/);
      if (m && m[1]) deps.push(m[1]);
    }
  }
  return { name: nameMatch?.[1] ?? '', deps };
}

export type Pubspec = { name: string; deps: string[] };

export async function parsePubspec(path: string): Promise<Pubspec> {
  const text = await readFile(path, 'utf8');
  const nameMatch = text.match(/^name:\s*(\S+)/m);
  const deps: string[] = [];
  const depsSection = text.match(/^dependencies:([\s\S]*?)(?=^\w|\z)/m);
  if (depsSection?.[1]) {
    for (const m of depsSection[1].matchAll(/^\s{2}([a-z][a-z0-9_]+):/gm)) {
      if (m[1] && m[1] !== 'flutter') deps.push(m[1]);
    }
  }
  return { name: nameMatch?.[1] ?? '', deps };
}

export type BuildSbt = { deps: string[] };

export async function parseBuildSbt(path: string): Promise<BuildSbt> {
  const text = await readFile(path, 'utf8');
  const deps: string[] = [];
  for (const m of text.matchAll(/"([^"]+)"\s*%%?\s*"([^"]+)"/g)) {
    if (m[2]) deps.push(m[2]);
  }
  return { deps };
}

export type PackageSwift = { deps: string[] };

export async function parsePackageSwift(path: string): Promise<PackageSwift> {
  const text = await readFile(path, 'utf8');
  const deps: string[] = [];
  for (const m of text.matchAll(/\.package\s*\([^)]*url:\s*"[^"]*\/([^/"]+?)(?:\.git)?"/g)) {
    if (m[1]) deps.push(m[1]);
  }
  return { deps };
}

export type MixExs = { deps: string[] };

export async function parseMixExs(path: string): Promise<MixExs> {
  const text = await readFile(path, 'utf8');
  const deps: string[] = [];
  for (const m of text.matchAll(/\{:([a-z_]+),/g)) {
    if (m[1]) deps.push(m[1]);
  }
  return { deps };
}

export type ComposerJson = { deps: string[] };

export async function parseComposerJson(path: string): Promise<ComposerJson> {
  const text = await readFile(path, 'utf8');
  const obj = JSON.parse(text) as { require?: Record<string, string>; 'require-dev'?: Record<string, string> };
  const deps = Object.keys({ ...obj.require, ...obj['require-dev'] })
    .map(d => d.split('/').pop() ?? d)
    .filter(d => d !== 'php');
  return { deps };
}

export type PomXml = { deps: string[] };

export async function parsePomXml(path: string): Promise<PomXml> {
  const text = await readFile(path, 'utf8');
  const deps: string[] = [];
  for (const m of text.matchAll(/<groupId>([^<]+)<\/groupId>/g)) {
    if (m[1]) deps.push(m[1].trim());
  }
  return { deps: [...new Set(deps)] };
}

export type Gemfile = { deps: string[] };

export async function parseGemfile(path: string): Promise<Gemfile> {
  const text = await readFile(path, 'utf8');
  const deps: string[] = [];
  for (const m of text.matchAll(/^\s*gem\s+['"]([^'"]+)['"]/gm)) {
    if (m[1]) deps.push(m[1]);
  }
  return { deps };
}

export async function parsePyProject(path: string): Promise<PyProject> {
  const text = await readFile(path, 'utf8');
  const nameMatch = text.match(/\[project\][\s\S]*?name\s*=\s*"([^"]+)"/);
  const deps: string[] = [];
  const depsBlock = text.match(/dependencies\s*=\s*\[([\s\S]*?)\n\s*\]/);
  if (depsBlock && depsBlock[1]) {
    for (const m of depsBlock[1].matchAll(/"([^"]+)"/g)) {
      const dep = m[1]?.replace(/\[.*?\]/g, '').split(/[<>=!~]/)[0]?.trim();
      if (dep) deps.push(dep);
    }
  }
  return { name: nameMatch?.[1] ?? '', deps };
}
