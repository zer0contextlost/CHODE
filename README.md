# CHODE

**Compressed Hierarchical Overview of Directory and Ecosystems**

A CLI that generates a compact, structured profile of any codebase. Run it once and every AI session starts with full orientation instead of file archaeology.

```
chode /path/to/repo
```

Produces a `.chode` file (~200-400 tokens) with stack, entry points, architecture shape, conventions, and purpose - no LLM required.

---

## Install

Requires [Bun](https://bun.sh) or Node.js 22.6+.

```bash
git clone https://github.com/zer0contextlost/CHODE
cd CHODE
npm install
npm install -g .
```

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

---CONTEXT---
@PURPOSE Authentication service handling OAuth flows for enterprise customers.
@CONVENTIONS No class components. Zod for all external data. Tests colocated.
@SETUP pnpm install && pnpm dev
```

---

## Options

```
--full      include full directory tree (v1 format)
--force     skip cache and regenerate
--stdout    write to stdout instead of file
--json      write structured JSON to stdout
--verify    check .chode for drift without updating
--commit    git commit the .chode file after writing
```

---

## MCP server

For AI assistants that support MCP (Claude, Cursor, etc.):

```bash
chode-mcp
```

Exposes a `chode_profile` tool - the assistant calls it with a repo path and gets the full profile without needing filesystem access.

---

## Development

```bash
npm run typecheck
npm run test:unit
npm run test
npm run build
```
