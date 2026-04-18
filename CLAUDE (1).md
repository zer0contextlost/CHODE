# CHODE

Compressed Hierarchical Output for Developer Efficiency.

CLI tool. Crawls project directory, outputs single `.chode` file. Any AI reads it, understands entire codebase. 80-90% fewer tokens than manual exploration.

## Architecture

Single multithreaded app. User sets root directory, tool fans out workers.

Main thread reads root, finds anchor files (package.json, go.mod, Cargo.toml, etc.), spawns zone workers. Workers run concurrent — each investigates one tech zone. Context worker reads md/txt files in parallel. Assembler stitches all reports into `.chode` output.

No config files. No setup. Just `chode .` and done.

## Output Format

Four sections in `.chode` file:

- `---TREE---` ASCII directory map, auto-extracts keywords for codex
- `---CODEX---` two-tier abbreviation dictionary (standard + project-specific)
- `---DNA---` compressed structural encoding using familiar notation
- `---CONTEXT---` caveman-compressed project knowledge from docs

Version marker `---CHODE v1---` at top of every file.

## Key Design Rules

- Lean. Target under 1000 lines total codebase.
- Fast. 1-3 seconds for typical projects.
- No AST parsing in v1. Read manifests, configs, folder names, schemas only.
- Agnostic output. Any LLM reads it. Built from syntax all models know.
- Crawler is language-aware. Output is language-agnostic.
- No progress bars. Workers print results as they finish. Simple counter at end.
- Smart ignore: respect .gitignore, skip node_modules/dist/.git/build/vendor etc.

## Codex System

Standard codec ships with tool — common abbreviations (auth, crud, api, db, jwt, etc.).
Custom codec per project — abbreviations specific to that codebase.
Rule: if abbreviation has only one meaning in software, standard. If ambiguous, must be defined.

## Compression Rules (Caveman Style)

Drop articles (a/an/the). Drop filler (just/really/basically). Drop pleasantries. Use short synonyms. Fragments OK. Technical terms exact. Code references exact.

## Integration Targets

- Claude Code: auto-load .chode like CLAUDE.md
- VS Code: workspace awareness for AI extensions
- Cursor/Windsurf: export via `--format cursor` etc.
- Git: regenerate on every push via pre-push hook + CI safety net
- .chode committed to repo so all devs share same context

## Stack (v1)

Bun or Node for CLI + file I/O. Built-in fs for walking. Glob for ignores. No heavy dependencies.

## File Structure

```
chode/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── crawler/
│   │   ├── walker.ts     # directory traversal + ignore patterns
│   │   ├── detector.ts   # anchor file detection, zone assignment
│   │   └── worker.ts     # zone worker logic
│   ├── ingest/
│   │   ├── context.ts    # md/txt reader + caveman compressor
│   │   └── manifest.ts   # package.json, go.mod, etc. parsers
│   ├── encode/
│   │   ├── tree.ts       # ASCII tree generator
│   │   ├── codex.ts      # standard + custom codec builder
│   │   ├── dna.ts        # structural DNA encoder
│   │   └── assembler.ts  # combines all sections into .chode
│   └── codecs/
│       └── standard.ts   # standard codec dictionary
├── tests/
├── benchmarks/
├── CLAUDE.md
├── README.md
├── package.json
└── tsconfig.json
```

## Benchmarking

Clone diverse OSS projects. Generate .chode. Ask AI 20 deep questions with only .chode vs full context. Compare tokens used + accuracy. Run across Claude, GPT, Gemini. Questions must test deep knowledge not surface facts.

## Conventions

- No unnecessary dependencies
- Every function does one thing
- Workers report findings as simple structs
- Code wins over docs when conflicts found
- Warn on unrecognized files, don't fail
