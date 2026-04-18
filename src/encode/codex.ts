import { STANDARD_CODEC } from '../codecs/standard.ts';

export type CodexEntry = [short: string, long: string];

export function buildCodex(candidates: CodexEntry[]): string {
  const seen = new Set(Object.keys(STANDARD_CODEC));
  const custom: CodexEntry[] = [];
  for (const [short, long] of candidates) {
    if (seen.has(short)) continue;
    seen.add(short);
    custom.push([short, long]);
  }

  const stdLines = formatEntries(Object.entries(STANDARD_CODEC));
  const customLines = custom.length > 0 ? formatEntries(custom) : '(none)';

  return `@STANDARD\n${stdLines}\n\n@CUSTOM\n${customLines}`;
}

export function buildCodexMap(candidates: CodexEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const [short, long] of Object.entries(STANDARD_CODEC)) {
    map.set(long.toLowerCase(), short);
  }
  for (const [short, long] of candidates) {
    map.set(long.toLowerCase(), short);
  }
  return map;
}

function formatEntries(entries: Iterable<[string, string]>): string {
  const parts: string[] = [];
  for (const [s, l] of entries) parts.push(`${s}:${l}`);
  return parts.join(' ');
}

export { STANDARD_CODEC };
