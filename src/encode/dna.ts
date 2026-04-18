import type { DnaFragment } from '../types.ts';

const SECTION_ORDER = ['@STACK', '@FRONTEND', '@CI', '@PKG', '@TEST', '@CONFIG', '@ENTRY', '@ROUTES', '@DATA', '@ENTITIES', '@AUTH', '@API', '@ARCH', '@PACKAGES', '@STRUCT', '@PATTERNS', '@MIDDLEWARE', '@MUT'];

// @STRUCT bracket-expansion adds noise beyond ~120 chars (confirmed in cap ablation: GPT-4o
// peaks at cap=80-120, then drops at cap=200+ specifically due to @STRUCT expansion).
// Other DNA fields are naturally short (lists, paths) and need no cap.
const DNA_CAPS: Partial<Record<string, number>> = {
  '@STRUCT':   120,
  '@PACKAGES': 150,
};

function capDna(section: string, value: string): string {
  const cap = DNA_CAPS[section];
  if (!cap || value.length <= cap) return value;
  return value.slice(0, cap).replace(/\s+\S*$/, '…');
}

export function buildDna(fragments: DnaFragment[]): string {
  const grouped = new Map<string, string[]>();
  for (const f of fragments) {
    if (!grouped.has(f.section)) grouped.set(f.section, []);
    grouped.get(f.section)!.push(f.line);
  }

  const seen = new Set<string>();
  const lines: string[] = [];
  for (const section of SECTION_ORDER) {
    const items = grouped.get(section);
    if (items && items.length) {
      lines.push(`${section} ${capDna(section, items.join(' | '))}`);
      seen.add(section);
    }
  }
  for (const [section, items] of grouped) {
    if (seen.has(section) || items.length === 0) continue;
    lines.push(`${section} ${capDna(section, items.join(' | '))}`);
  }
  return lines.join('\n') || '(none)';
}
