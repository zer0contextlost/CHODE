export type AssembleInput = {
  dna: string;
  context: string;
  tree?: string;   // optional: only included when --full is passed
  codex?: string;
  gitHash?: string; // short commit hash at generation time — staleness signal
};

export function assemble(sections: AssembleInput): string {
  const version = sections.tree ? 'v1' : 'v2';
  const header = sections.gitHash ? `---CHODE ${version} @ ${sections.gitHash}---` : `---CHODE ${version}---`;
  const parts = [header, ''];

  if (sections.tree) {
    parts.push('---TREE---', sections.tree, '', '---LEGEND---', sections.codex ?? '', '');
  }

  parts.push('---DNA---', sections.dna, '', '---CONTEXT---', sections.context, '');
  return parts.join('\n');
}
