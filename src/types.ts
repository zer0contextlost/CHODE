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
  kind: ZoneKind;
  files: string[];
};

export type TreeFragment = {
  path: string;
  children: TreeFragment[];
};

export type DnaFragment = {
  section: string;
  line: string;
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

