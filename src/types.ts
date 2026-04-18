export type ZoneKind =
  | 'ts'
  | 'js'
  | 'go'
  | 'rust'
  | 'python'
  | 'ruby'
  | 'php'
  | 'java'
  | 'kotlin'
  | 'elixir'
  | 'cpp'
  | 'csharp'
  | 'dart'
  | 'scala'
  | 'swift'
  | 'yaml'
  | 'prisma'
  | 'json'
  | 'markdown';

export type Zone = {
  id: string;
  kind: ZoneKind;
  root: string;
  files: string[];
};

export type WorkerTask =
  | { kind: 'zone'; zone: Zone; anchors: Record<string, unknown> }
  | { kind: 'context'; id: string; root: string; files: string[] };

export type TreeFragment = {
  path: string;
  children: TreeFragment[];
};

export type DnaFragment = {
  section: string;
  line: string;
};

export type ZoneResult = {
  kind: 'zone';
  id: string;
  zoneKind: ZoneKind;
  fileCount: number;
  techs: string[];
  tree: TreeFragment;
  codex: Array<[short: string, long: string]>;
  dna: DnaFragment[];
  warnings: string[];
};

export type ContextResult = {
  kind: 'context';
  id: string;
  sources: string[];
  compressed: Partial<{
    purpose: string;
    conventions: string;
    setup: string;
    env: string;
    testing: string;
    deploy: string;
    gotchas: string;
  }>;
  warnings: string[];
};

export type WorkerResult = ZoneResult | ContextResult;
