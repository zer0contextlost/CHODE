import { readFile } from 'node:fs/promises';
import { basename, sep } from 'node:path';
import type { ContextResult } from '../types.ts';

type Field = keyof NonNullable<ContextResult['compressed']>;

const FIELD_MAP: Array<[string[], Field]> = [
  [['__intro__', 'purpose', 'overview', 'about', 'what is', 'description'], 'purpose'],
  [['setup', 'installation', 'install', 'getting started', 'quickstart', 'running', 'run ', 'configuration'], 'setup'],
  [['conventions', 'style', 'code style', 'guidelines', 'philosophy'], 'conventions'],
  [['environment variables', 'env vars', 'environment', 'env', 'variables'], 'env'],
  [['testing', 'tests'], 'testing'],
  [['deploy', 'deployment', 'shipping'], 'deploy'],
  [['gotchas', 'caveats', 'known issues', 'warnings', 'notes', 'pitfalls'], 'gotchas'],
];

// Require preceding whitespace/start — prevents stripping from slashed lists like (a/an/the)
const ARTICLES = /(?<=^|\s)(a|an|the)\s+/gim;
const FILLER = /(?<=^|\s)(just|really|basically|simply|quite|very|actually|literally|merely|somewhat|rather|essentially|generally|typically|usually|certainly|obviously|clearly|easily|quickly|properly|correctly|automatically)\s+/gim;
const BOILERPLATE = /(?:please\s+(?:note|ensure|make\s+sure)|note\s+that|keep\s+in\s+mind|be\s+sure\s+to|it\s+is\s+(?:important|recommended|advised)\s+to|for\s+more\s+(?:information|details?)(?:\s+(?:see|refer\s+to|check))?|see\s+also|refer\s+to\s+the|check\s+out\s+the)[^.!?\n]*/gim;
const LIST_MARKERS = /^[ \t]*(?:\d+\.|[-*+])\s+/gm;

const ALWAYS_INGEST = new Set([
  'readme.md', 'readme.mdx', 'readme.rst',
  'contributing.md', 'contributing.rst', 'changelog.md',
  'claude.md', 'history.md', 'security.md', 'code_of_conduct.md',
]);

// Directories whose .md files we skip (examples, test fixtures, etc.)
const SKIP_DIRS = new Set([
  'examples', 'fixtures', 'test', 'tests', 'benchmarks', 'bench',
  'demos', 'demo', 'samples', 'sample', 'node_modules',
  '.changeset', '.github', '.codesandbox', 'template',
  'static', 'public', 'vendor', 'third_party', 'thirdparty',
  'contributing', 'errors',
]);

const MAX_FIELD_CHARS = 200;

function isDocFile(path: string, root: string): boolean {
  if (!/\.(md|mdx|rst)$/i.test(path)) return false;
  const posixPath = sep === '\\' ? path.replace(/\\/g, '/') : path;
  const posixRoot = (sep === '\\' ? root.replace(/\\/g, '/') : root).replace(/\/?$/, '/');
  const rel = posixPath.startsWith(posixRoot) ? posixPath.slice(posixRoot.length) : posixPath;
  const parts = rel.split('/').filter(Boolean);
  const name = (parts[parts.length - 1] ?? '').toLowerCase();
  // Skip dirs checked first — examples/README.md is noise even if named readme
  for (const dir of parts.slice(0, -1)) {
    if (SKIP_DIRS.has(dir.toLowerCase())) return false;
  }
  if (ALWAYS_INGEST.has(name)) return parts.length <= 2;
  return parts.length <= 2;
}

export async function ingestContext(
  id: string,
  root: string,
  files: string[],
): Promise<ContextResult> {
  const sources: string[] = [];
  const warnings: string[] = [];
  const combined: Partial<Record<Field, string>> = {};

  const DOC_PRIORITY = ['readme.md', 'readme.mdx', 'readme.rst', 'claude.md', 'contributing.md', 'changelog.md'];
  const rootName = basename(root).toLowerCase();
  const docFiles = files
    .filter(f => isDocFile(f, root))
    .sort((a, b) => {
      const na = basename(a).toLowerCase();
      const nb = basename(b).toLowerCase();
      const ia = DOC_PRIORITY.indexOf(na);
      const ib = DOC_PRIORITY.indexOf(nb);
      if (ia !== -1 && ib !== -1) {
        if (ia !== ib) return ia - ib;
        // Same name: shallower first, then prefer parent dir matching root name
        const pa = a.split(/[\\/]/);
        const pb = b.split(/[\\/]/);
        if (pa.length !== pb.length) return pa.length - pb.length;
        const parentA = (pa[pa.length - 2] ?? '').toLowerCase();
        const parentB = (pb[pb.length - 2] ?? '').toLowerCase();
        if (parentA === rootName && parentB !== rootName) return -1;
        if (parentB === rootName && parentA !== rootName) return 1;
        return 0;
      }
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return 0;
    });

  // Filenames whose __intro__ is never a project description
  const NO_INTRO = new Set([
    'changelog.md', 'changelog.mdx', 'history.md', 'history.mdx',
    // AI agent instruction files — describe workflow, not the project
    'claude.md', 'agents.md', 'copilot-instructions.md',
  ]);

  const introFallbacks: Record<string, string> = {};

  for (const path of docFiles) {
    try {
      const text = await readFile(path, 'utf8');
      const isRst = /\.rst$/i.test(path);
      const sections = extractSections(text, isRst);
      const fname = basename(path).toLowerCase();
      const posixPath2 = sep === '\\' ? path.replace(/\\/g, '/') : path;
      const posixRoot2 = (sep === '\\' ? root.replace(/\\/g, '/') : root).replace(/\/?$/, '/');
      const rel = posixPath2.startsWith(posixRoot2) ? posixPath2.slice(posixRoot2.length) : posixPath2;
      const depth = rel.split('/').filter(Boolean).length;
      // Non-root READMEs describe their subdirectory, not the project
      const nonRootReadme = /^readme\.(md|mdx)$/.test(fname) && depth > 1;
      // Only depth-1 files have project-level context — deeper intros are subdir/component docs
      const noIntro = NO_INTRO.has(fname) || depth > 1;
      if (!noIntro && sections['__intro__']) {
        // Save intro separately; merge named sections first
        introFallbacks[path] = sections['__intro__'];
      }
      delete sections['__intro__'];
      // @PURPOSE only from root files or index/readme files — not arbitrary sub-docs
      const isPurposeEligible = depth === 1 || /^(readme|index)\.(md|mdx|rst)$/.test(fname);
      const skipFields = (!isPurposeEligible || nonRootReadme) ? new Set<Field>(['purpose']) : new Set<Field>();
      mergeContext(combined, sections, skipFields);
      sources.push(path);
    } catch (e) {
      warnings.push(`failed to read ${basename(path)}: ${String(e)}`);
    }
  }

  // Second pass: use __intro__ only to fill gaps left by named sections
  for (const [, intro] of Object.entries(introFallbacks)) {
    mergeContext(combined, { __intro__: intro });
  }

  // Supplement @ENV from .env.example / .env.sample if not already populated
  if (!combined.env) {
    const envFile = files.find(f => /[/\\]\.env\.(example|sample|template|defaults)$/i.test(f));
    if (envFile) {
      try {
        const envText = await readFile(envFile, 'utf8');
        const keys = [...envText.matchAll(/^([A-Z][A-Z0-9_]{2,})\s*=/gm)].map(m => m[1]);
        if (keys.length > 0) combined.env = keys.slice(0, 20).join(' ');
      } catch {}
    }
  }

  const compressed: ContextResult['compressed'] = {};
  for (const [key, value] of Object.entries(combined) as Array<[Field, string | undefined]>) {
    if (!value) continue;
    let v = cavemanCompress(value);
    if (v.length < 30) continue; // skip near-empty or redirect-only content
    if (v.length > MAX_FIELD_CHARS) v = v.slice(0, MAX_FIELD_CHARS).replace(/\s+\S*$/, '…');
    compressed[key] = v;
  }

  return { kind: 'context', id, sources, compressed, warnings };
}

function stripRst(text: string): string {
  return text
    .replace(/^\.\. [a-z-]+::.*/gm, '')                   // directives
    .replace(/^[ \t]*:[a-z-]+:.*$/gm, '')                  // field lists
    .replace(/`[^`]+`_?/g, s => s.replace(/[`_]/g, ''))   // inline refs
    .replace(/\.\. _[^\n]+\n/g, '')                        // hyperlink targets
    .replace(/^[=\-~^*+#`'"<>]{3,}\s*$/gm, '');           // heading adornment lines
}

function extractSections(md: string, isRst = false): Record<string, string> {
  const text = isRst ? stripRst(md) : md;
  const sections: Record<string, string> = {};
  const lines = text.split(/\r?\n/);
  let heading = '__intro__';
  let buffer: string[] = [];
  let seenTitle = false;

  const flush = () => {
    if (buffer.length === 0) return;
    const body = buffer.join('\n').trim();
    if (body) sections[heading] = (sections[heading] ? sections[heading] + '\n\n' : '') + body;
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const next = lines[i + 1] ?? '';
    // RST: title underlined with = (h1) or - (h2)
    if (isRst && /^[=\-]{3,}$/.test(next) && line.trim()) {
      if (/^={3,}$/.test(next)) {
        if (!seenTitle) { seenTitle = true; i++; continue; }
      } else {
        flush(); heading = line.toLowerCase().trim(); i++; continue;
      }
    }
    if (!isRst && !seenTitle && /^#\s+/.test(line)) { seenTitle = true; continue; }
    const h2 = !isRst && line.match(/^##\s+(.+)/);
    if (h2 && h2[1]) { flush(); heading = h2[1].toLowerCase().trim(); continue; }
    buffer.push(line);
  }
  flush();
  return sections;
}

function mergeContext(
  into: Partial<Record<Field, string>>,
  sections: Record<string, string>,
  skipFields: Set<Field> = new Set(),
): void {
  for (const [heading, body] of Object.entries(sections)) {
    if (!body.trim()) continue;
    for (const [aliases, field] of FIELD_MAP) {
      if (skipFields.has(field)) continue;
      if (aliases.some(a => {
        if (a === '__intro__') return heading === '__intro__';
        return new RegExp(`(?:^|\\s)${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`).test(heading);
      })) {
        // First-wins, but allow longer content to replace stub content (< 50 chars)
        if (!into[field] || (into[field]!.length < 50 && body.length > into[field]!.length)) {
          into[field] = body;
        }
        break;
      }
    }
  }
}

export function cavemanCompress(text: string): string {
  const saved: string[] = [];
  const protect = (s: string): string => { saved.push(s); return `\u0000P${saved.length - 1}\u0000`; };

  let t = text;
  t = t.replace(/```[\s\S]*?```/g, protect);
  t = t.replace(/`[^`\n]+`/g, protect);
  // Strip markdown/HTML noise before compression
  t = t.replace(/^>.*$/gm, '');                            // drop blockquote lines (epigraphs, callouts)
  t = t.replace(/^-{3,}\s*$/gm, '');                      // drop horizontal rules
  t = t.replace(/<[^>]+>/g, ' ');                        // HTML tags
  t = t.replace(/!\[[^\]]*\]\[[^\]]*\]/g, '');           // ![alt][ref] reference images
  t = t.replace(/!\[[^\]]*\]\([^\)]*\)/g, '');           // ![alt](url) inline images
  t = t.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1');        // [text][ref] → text
  t = t.replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1');        // [text](url) → text
  t = t.replace(/\*\*([^*\n]+)\*\*/g, '$1');             // **bold** → text
  t = t.replace(/\*([^*\n]+)\*/g, '$1');                 // *italic* → text
  t = t.replace(/https?:\/\/\S+/g, '');

  t = t.replace(BOILERPLATE, '');
  t = t.replace(LIST_MARKERS, '');
  t = t.replace(ARTICLES, ' ');
  t = t.replace(FILLER, ' ');
  t = t.replace(/[ \t]+/g, ' ');
  t = t.replace(/ +([.,;:!?])/g, '$1');
  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.trim();

  t = t.replace(/\u0000P(\d+)\u0000/g, (_, i) => {
    const s = saved[+i] ?? '';
    return s.startsWith('```') || s.startsWith('`') ? s : '';
  });
  return t;
}
