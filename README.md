# CHODE

**Compressed Hierarchical Overview of Directory and Ecosystems**

A CLI that generates a compact, structured profile of any codebase. Run it once, commit the output, and every AI session on that repo starts with full orientation instead of file archaeology.

```
chode /path/to/repo
```

Produces a `.chode` file (~200–400 tokens) with stack, entry points, architecture shape, conventions, and purpose — extracted from the repo itself in under a second, no LLM required.

---

## When this is actually useful

**Good fit:**
- You're working with repos you didn't write and want fast AI orientation
- You're building agents or pipelines that need repeatable repo context without filesystem access
- You're running many API calls against the same repo and want cheap, cacheable context
- You use the MCP server to give AI assistants repo awareness in automated workflows

**Not worth it:**
- Repos you own and work in daily — you already know this stuff
- One-off questions where you'd just paste a few files anyway
- Small repos where a README is sufficient

---

## Install

Requires [Bun](https://bun.sh) or Node.js 22.6+.

```bash
git clone https://github.com/zer0contextlost/CHODE
cd CHODE
npm install
npm install -g .
```

Then use `chode` from anywhere:

```bash
chode /path/to/repo
chode https://github.com/owner/repo   # clones and profiles
chode .                               # current directory
```

---

## Output

```
---CHODE v2 @ a3f1c2e---

---DNA---
@STACK typescript react vite
@PKG pnpm
@TEST vitest playwright
@ENTRY src/index.ts
@AUTH jwt
@ROUTES src/api/ (12 files)
@STRUCT src/{components,hooks,lib}(142) api/(31)

---CONTEXT---
@PURPOSE Authentication service handling OAuth flows for enterprise customers.
@CONVENTIONS No class components. Zod for all external data. Tests colocated.
@SETUP pnpm install && pnpm dev
```

---

## Options

```
chode [options] [target]

  --full      include full directory tree and abbreviation codex (v1 format)
  --force     skip cache check and regenerate
  --stdout    write to stdout instead of file
  --json      write structured JSON to stdout
  --verify    check .chode for drift without updating
  --commit    git commit the .chode file after writing
  --version   print version
  --help      print this help
```

---

## MCP server

For AI assistants that support MCP (Claude, Cursor, etc.):

```bash
# Add to your MCP config:
chode-mcp
```

Exposes a `chode_profile` tool — the assistant calls it with a repo path and gets back the full profile without needing filesystem access itself.

---

## How it works

1. **Walk** — traverses the repo, respects `.gitignore` and `.chodeignore`
2. **Detect** — identifies languages, frameworks, CI, architecture patterns from file structure alone
3. **Ingest** — parses README and doc files, extracts purpose/conventions/setup
4. **Assemble** — compresses everything into a structured, token-efficient text format

No network calls, no LLM, no source code parsing. Pure filesystem + manifest analysis.

---

## Development

```bash
npm run typecheck     # type check
npm run test:unit     # unit tests (manifest parsers, cavemanCompress, glob)
npm run test          # regression tests against benchmark repos
npm run build         # compile to single binary
```

Source layout:

```
src/
├── index.ts          # CLI entry point
├── generate.ts       # manifest dispatch, formatContext, generateProfile
├── crawler/          # walker, detector
├── detect/           # landmarks (CI, arch, routes...), notable package tables
├── ingest/           # context extraction, manifest parsers
├── encode/           # DNA builder, tree renderer, codex, assembler
└── mcp.ts            # MCP server
```

---

## .chodeignore

Drop a `.chodeignore` in your repo root to exclude paths from profiling. Follows `.gitignore` syntax (negation patterns not currently supported).

```
generated/
*.pb.go
vendor/
```
