const MAX_CHILDREN = 6;
const MAX_DEPTH = 3;
const MAX_ROOT_ENTRIES = 14;

// Directories shown as single collapsed line — noise or infrastructure
const COLLAPSE_DIRS = new Set([
  'examples', 'fixtures', 'test', 'tests', 'acceptance', 'benchmarks', 'bench',
  'demos', 'demo', 'samples', 'sample', 'docs_src', '__snapshots__',
  '.github', '.changeset', '.codesandbox', '.husky',
  'playground', 'playgrounds', 'vendor', 'third_party',
  'docs', 'guides', 'contributing', 'errors',
]);

// ISO 639-1 codes + common BCP 47 variants used as i18n directory names
const LOCALE_CODES = new Set([
  'af','ar','az','be','bg','bn','bs','ca','cs','cy','da','de',
  'el','en','eo','es','et','eu','fa','fi','fr','ga','gl','gu',
  'he','hi','hr','hu','hy','id','is','it','ja','ka','kk','km',
  'kn','ko','lt','lv','mk','ml','mn','mr','ms','my',
  'nb','ne','nl','no','pa','pl','pt','ro','ru','si','sk','sl',
  'sq','sr','sv','sw','ta','te','th','tl','tr','uk','ur','uz',
  'vi','zh',
  'zh-cn','zh-tw','zh-hans','zh-hant','pt-br','pt-pt','es-mx',
]);

type Node = {
  name: string;
  children: Map<string, Node>;
  isFile: boolean;
};

export function buildTree(root: string, paths: string[], codexMap?: Map<string, string>): string {
  const rootName = root.split(/[\\/]/).pop() || root;
  const rootNode: Node = { name: rootName, children: new Map(), isFile: false };

  for (const path of paths) {
    const rel = path.startsWith(root)
      ? path.slice(root.length).replace(/^[\\/]+/, '')
      : path;
    const segments = rel.split(/[\\/]/).filter(Boolean);
    if (segments.length === 0) continue;
    let current = rootNode;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]!;
      const isLeaf = i === segments.length - 1;
      if (!current.children.has(seg)) {
        current.children.set(seg, { name: seg, children: new Map(), isFile: isLeaf });
      }
      current = current.children.get(seg)!;
      if (isLeaf) current.isFile = true;
    }
  }

  const lines: string[] = [`${rootNode.name}/`];
  render(rootNode, '', lines, 0, codexMap);
  return lines.join('\n');
}

function render(node: Node, prefix: string, lines: string[], depth: number, codexMap?: Map<string, string>): void {
  const entries = Array.from(node.children.values()).sort((a, b) => {
    if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
    if (depth === 0) {
      const aHidden = a.name.startsWith('.');
      const bHidden = b.name.startsWith('.');
      if (aHidden !== bHidden) return aHidden ? 1 : -1;
    }
    return a.name.localeCompare(b.name);
  });

  // Detect i18n parent: >=3 locale-code dirs making up >=60% of all child dirs
  const childDirs = entries.filter(e => !e.isFile);
  const localeDirs = childDirs.filter(d => LOCALE_CODES.has(d.name.toLowerCase()));
  const isI18nParent = localeDirs.length >= 3 && localeDirs.length / Math.max(childDirs.length, 1) >= 0.6;

  if (isI18nParent) {
    const nonLocale = entries.filter(e => e.isFile || !LOCALE_CODES.has(e.name.toLowerCase()));
    const summary = buildLocaleSummary(localeDirs);
    const allVisible = [...nonLocale, { __locale_summary: summary }];
    allVisible.forEach((item, i) => {
      if ('__locale_summary' in item) {
        const isLast = i === allVisible.length - 1;
        lines.push(`${prefix}${isLast ? '└── ' : '├── '}${item.__locale_summary}`);
        return;
      }
      const child = item as Node;
      const isLast = i === allVisible.length - 1;
      renderChild(child, prefix, lines, depth, codexMap, isLast, false);
    });
    return;
  }

  // Detect monorepo: 4+ child dirs each containing a workspace manifest
  const workspaceDirs = childDirs.filter(hasWorkspaceManifest);
  const isMonorepoParent = workspaceDirs.length >= 4;

  // Root level capped at MAX_ROOT_ENTRIES; deeper dirs use MAX_CHILDREN
  const limit = depth === 0 ? MAX_ROOT_ENTRIES : MAX_CHILDREN;
  const sliceAt = depth === 0 ? MAX_ROOT_ENTRIES - 1 : MAX_CHILDREN - 1;
  const visible = entries.length > limit ? entries.slice(0, sliceAt) : entries;
  const overflow = entries.length - visible.length;

  visible.forEach((child, i) => {
    const isLast = i === visible.length - 1 && overflow === 0;
    renderChild(child, prefix, lines, depth, codexMap, isLast, isMonorepoParent);
  });

  if (overflow > 0) {
    lines.push(`${prefix}└── (+${overflow} more)`);
  }
}

// Extensions that mark a directory as a package/component boundary
const PACKAGE_BOUNDARY_EXTS = new Set(['.gemspec', '.csproj', '.podspec', '.nuspec']);
// Filenames that signal a workspace package when 4+ sibling dirs share them
const WORKSPACE_MANIFESTS = new Set(['package.json', 'Cargo.toml', 'build.gradle.kts', 'build.gradle', 'build.sbt', 'pubspec.yaml', 'mix.exs', 'pyproject.toml']);

function hasWorkspaceManifest(node: Node): boolean {
  for (const child of node.children.values()) {
    if (child.isFile && WORKSPACE_MANIFESTS.has(child.name)) return true;
  }
  return false;
}

function isPackageBoundary(node: Node, isMonorepoContext = false): boolean {
  for (const child of node.children.values()) {
    if (child.isFile) {
      const dot = child.name.lastIndexOf('.');
      if (dot !== -1 && PACKAGE_BOUNDARY_EXTS.has(child.name.slice(dot).toLowerCase())) return true;
    }
  }
  return isMonorepoContext && hasWorkspaceManifest(node);
}

function renderChild(child: Node, prefix: string, lines: string[], depth: number, codexMap: Map<string, string> | undefined, isLast: boolean, isMonorepoContext = false): void {
  const connector = isLast ? '└── ' : '├── ';
  const displayName = child.isFile ? child.name : (codexMap?.get(child.name.toLowerCase()) ?? child.name);
  const label = child.isFile ? displayName : `${displayName}/`;
  lines.push(`${prefix}${connector}${label}`);

  if (!child.isFile && child.children.size > 0) {
    const extension = isLast ? '    ' : '│   ';
    if (COLLAPSE_DIRS.has(child.name.toLowerCase())) {
      const fileCount = countFiles(child);
      lines.push(`${prefix}${extension}└── (${fileCount} ${fileCount === 1 ? 'file' : 'files'})`);
      return;
    }
    if (isPackageBoundary(child, isMonorepoContext)) {
      const fileCount = countFiles(child);
      lines.push(`${prefix}${extension}└── (${fileCount} ${fileCount === 1 ? 'file' : 'files'})`);
      return;
    }
    if (depth + 1 >= MAX_DEPTH) {
      const fileCount = countFiles(child);
      if (fileCount > 0) lines.push(`${prefix}${extension}└── (${fileCount} ${fileCount === 1 ? 'file' : 'files'})`);
      return;
    }
    render(child, prefix + extension, lines, depth + 1, codexMap);

  }
}

function buildLocaleSummary(localeDirs: Node[]): string {
  const codes = localeDirs.map(d => d.name).sort();
  const shown = codes.slice(0, 6).join(' ');
  const extra = codes.length > 6 ? ` +${codes.length - 6} more` : '';
  return `(${codes.length} languages: ${shown}${extra})`;
}

function countFiles(node: Node): number {
  let count = 0;
  for (const child of node.children.values()) {
    if (child.isFile) count++;
    else count += countFiles(child);
  }
  return count;
}
