import type { DnaFragment } from '../types.ts';

export function toRel(f: string, root: string): string {
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
  const counts = new Map<string, number>();
  const SOURCE_EXT = /\.(go|ts|tsx|js|jsx|py|rb|rs|java|kt|cs|ex|exs|scala|swift|dart|cpp|c|h|php)$/;
  for (const f of rel) {
    const slash = f.indexOf('/');
    if (slash === -1) continue;
    const topDir = f.slice(0, slash);
    if (!topDir || PACKAGE_SKIP.has(topDir.toLowerCase()) || topDir.startsWith('.')) continue;
    if (!SOURCE_EXT.test(f)) continue;
    counts.set(topDir, (counts.get(topDir) ?? 0) + 1);
  }
  if (counts.size === 0) return '';
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (top[0]![1] < 5) return '';
  return top.map(([dir, n]) => `${dir}/(${n})`).join(' ');
}

function detectPatterns(rel: string[]): string {
  const d = (name: string) => rel.some(f => f === name || f.startsWith(name + '/'));
  const patterns: string[] = [];

  const STRATEGY_DIRS = ['source', 'sources', 'provider', 'providers', 'strategy', 'strategies', 'driver', 'drivers'];
  const strategyContainers = new Map<string, Set<string>>();
  for (const f of rel) {
    const parts = f.split('/');
    const idx = parts.findIndex(p => STRATEGY_DIRS.includes(p));
    if (idx > 0 && parts.length > idx + 1) {
      const container = parts.slice(0, idx).join('/');
      if (!strategyContainers.has(container)) strategyContainers.set(container, new Set());
      const impl = parts[idx + 1]!;
      if (!impl.includes('.')) strategyContainers.get(container)!.add(impl);
    }
  }
  for (const [, impls] of strategyContainers) {
    if (impls.size >= 3) { patterns.push(`strategy(${[...impls][0]!.split('/').pop()!})`); break; }
  }

  if (rel.some(f => /^(?:[^/]+\/)?(?:repositories|repository)\//.test(f))) patterns.push('repository');
  if (rel.some(f => /^(?:[^/]+\/){0,2}(?:factory|factories|builders?)\//.test(f)) ||
      rel.some(f => /^(?:[^/]+\/){0,1}factory\.(go|ts|js|py|rb|java|cs)$/.test(f))) patterns.push('factory');

  const eventFiles = rel.filter(f => /^(?:[^/]+\/){0,2}(?:events?|event_bus|pubsub|dispatcher)\//.test(f));
  if (eventFiles.length >= 3) patterns.push('event-driven');

  const pluginFiles = rel.filter(f => /^(?:[^/]+\/)?(?:plugins?|extensions?|addons?)\//.test(f));
  if (pluginFiles.length >= 3) patterns.push('plugin');

  if (d('middleware') || d('middlewares') || d('routers/common') ||
      rel.some(f => /^[^/]+\/middleware\//.test(f))) patterns.push('middleware-chain');

  if ((d('commands') || d('command')) && (d('queries') || d('query'))) patterns.push('cqrs');

  return patterns.join(' ');
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
  const ROUTE_DIRS = [
    'src/app', 'src/pages', 'src/routes',
    'routes', 'routers', 'router', 'controllers', 'handlers', 'api',
    'src/controllers', 'src/handlers', 'src/api',
    'app/Http/Controllers', 'app/controllers',
    'app/routers', 'pkg/cmd',
    'internal/handler', 'internal/handlers',
    'internal/api', 'internal/router',
    'lib/phoenix_web/controllers', 'web/controllers',
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

const AUTH_METHODS: Array<[RegExp, string]> = [
  [/\/(ldap|ldaps)\//i, 'ldap'],
  [/\/oauth2?\//i, 'oauth'],
  [/\/webauthn\//i, 'webauthn'],
  [/\/saml\//i, 'saml'],
  [/\/openid\//i, 'openid'],
  [/\/pam\//i, 'pam'],
  [/\/sso\//i, 'sso'],
  [/\/jwt\//i, 'jwt'],
  [/\/password\//i, 'password'],
  [/\/totp\//i, 'totp'],
  [/\/(2fa|mfa|twofactor)\//i, '2fa'],
  [/\/cas\//i, 'cas'],
  [/\/smtp\//i, 'smtp'],
];

function detectAuth(rel: string[]): string | null {
  const found = new Set<string>();
  for (const f of rel) {
    for (const [re, label] of AUTH_METHODS) {
      if (re.test('/' + f)) found.add(label);
    }
  }
  const authSourceFiles = rel.filter(f => /\/auth\/source\/|\/auth\/provider\//i.test(f));
  if (authSourceFiles.length > 0) {
    const subdirs = new Set(authSourceFiles.map(f => {
      const m = f.match(/\/(?:source|provider)\/([^/]+)\//i);
      return m?.[1]?.toLowerCase();
    }).filter(Boolean));
    for (const sub of subdirs) { if (sub) found.add(sub); }
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
    if (hasUsecase) parts.push('clean-arch(domain→usecase→infra)');
    else parts.push('hexagonal(domain→infra)');
  } else if (hasUsecase && (hasDomain || hasMdl)) {
    parts.push('clean-arch(usecase→domain)');
  } else if (hasSvc && hasMdl && (hasRouters || hasCtrl || hasHandler)) {
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
  const authFiles = rel.filter(f => f.includes('/auth') || f.endsWith('_auth.go') || f.includes('/source/')).length;
  if (authFiles >= 5 && hasSvc) parts.push('strategy(auth)');
  return parts.length > 0 ? parts.join(' ') : null;
}

function detectMiddleware(rel: string[]): string | null {
  const d = (name: string) => rel.some(f => f === name || f.startsWith(name + '/'));
  for (const dir of ['middleware', 'middlewares', 'app/Http/Middleware', 'app/middleware',
                     'src/middleware', 'src/middlewares', 'internal/middleware',
                     'routers/common', 'router/common']) {
    if (d(dir)) return dir + '/';
  }
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
      const topSubs = [...subs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([s]) => s).join(',');
      return `${dir}/{${topSubs}}(${countLabel})`;
    }
    return `${dir}/(${countLabel})`;
  }).join(' ');
}

export function detectLandmarks(files: string[], root: string): DnaFragment[] {
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
