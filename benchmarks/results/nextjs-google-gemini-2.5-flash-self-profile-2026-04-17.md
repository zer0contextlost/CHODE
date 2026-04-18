# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** nextjs
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 19785 paths, 4 anchor files, 9 doc files
**Call 1 — profile build:** 64143 prompt tokens → 1059 completion tokens (profile)
**Call 2 — questions:** 1324 prompt tokens + 145 completion tokens
**Total tokens consumed:** 66671

**CHODE equivalent:** ~567 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 113x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 9/36 (25% of auto-scorable)
**Stump questions (9):** 3/27 (11%)

---

## AI-Built Profile

```
Primary Language(s) and Version:
TypeScript (JavaScript), Rust. Node.js 18+ is required.

Framework(s) and Key Libraries:
Next.js (the framework itself), React. SWC (Rust-based JavaScript/TypeScript compiler), Turbopack (Rust-based bundler), Rspack (Rust-based bundler). Lerna for monorepo management.

Package Manager(s):
pnpm (primary), npm (for `create-next-app`).

Test Framework(s) and Test Commands:
Jest (`pnpm test-unit`), Vitest (for evals), Playwright/Cypress (implied by docs, but not directly in `package.json` scripts for general tests).
Key test commands:
- `pnpm test-unit`: Runs unit tests.
- `pnpm test-dev-turbo`: Runs integration tests in development mode with Turbopack.
- `pnpm test-dev-webpack`: Runs integration tests in development mode with Webpack.
- `pnpm test-start-turbo`: Runs integration tests in production build+start mode with Turbopack.
- `pnpm test-start-webpack`: Runs integration tests in production build+start mode with Webpack.
- `pnpm testheadless <path>`: Runs tests headless without rebuilding.
- `pnpm new-test`: Generates new test files.
- `pnpm eval <name>`: Runs agent evaluations.

Project Type:
Monorepo containing a web framework, related tools, and documentation.

Primary Purpose:
To develop, maintain, and test the Next.js web framework, its associated tooling (like `create-next-app`, ESLint plugin, font optimization), and documentation, with a strong focus on performance and developer experience through Rust-based bundlers and compilers.

Top Directories and Approximate File Counts:
- `test/`: ~9700 files (extensive test suite)
- `packages/`: ~2900 files (published npm packages like `next`, `create-next-app`, `next-swc`)
- `examples/`: ~2800 files (example Next.js applications)
- `turbopack/`: ~1000 files (Turbopack bundler, Rust-based)
- `crates/`: ~100 files (Rust crates for Next.js SWC bindings and core functionalities)
- `docs/`: ~300 files (Next.js documentation)
- `evals/`: ~100 files (agent evaluations)
- `.agents/`: ~15 files (agent skills)
- `.github/`: ~50 files (GitHub Actions workflows, issue templates)

Key Entry Point Files:
- `packages/next/src/cli/next-dev.ts`: Development server CLI entry.
- `packages/next/src/cli/next-start.ts`: Production server CLI entry.
- `packages/next/src/cli/next-build.ts`: Build CLI entry.
- `crates/next-napi-bindings/src/lib.rs`: NAPI bindings for Rust functionalities.
- `rspack/crates/binding/src/lib.rs`: Rspack NAPI bindings.
- `run-evals.js`: Script for running agent evaluations.

Architecture Pattern:
A hybrid architecture leveraging both JavaScript/TypeScript for the framework's user-facing parts and Rust for performance-critical components like bundlers (Turbopack, Rspack) and compilers (SWC). It follows a monorepo structure to manage multiple interdependent packages. The framework supports both App Router and Pages Router paradigms, with a strong emphasis on server-side rendering (SSR), static site generation (SSG), and incremental static regeneration (ISR).

Notable Conventions or Gotchas:
- Extensive use of `pnpm` for package management and `turbo` for monorepo task orchestration.
- `AGENTS.md` (symlinked from `CLAUDE.md`) serves as a guide for AI agents, indicating a focus on AI-assisted development and documentation.
- `NEXT_SKIP_ISOLATE=1` environment variable for faster test runs by skipping package packing.
- Explicit bundler selection (`--webpack`) for `next dev` and `next build`, with Turbopack being the default.
- Strict guidelines for contributing, including reading `README.md` files in subdirectories for local conventions.
- Agent evaluations (`evals/`) are used to test and improve AI agent performance based on Next.js documentation.
- `pnpm build-all` is crucial after branch switches to ensure all JS and Rust code is correctly built.
- `pnpm --filter=next dev` is recommended for fast iterative development, running in the background.
- `Cargo.toml` defines a workspace for Rust crates, with specific profiles for development and release, including size optimizations for certain dependencies.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | pnpm (primary), npm (for `create-next-app`). | 3 _(auto)_ |
| Q2 | Native bindings lang | Objective | Rust. | 3 _(auto)_ |
| Q3 | Native pkg manager | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test frameworks | Objective | Jest, Vitest, Playwright/Cypress (implied by docs, but not directly in `package.json` scripts for general tests). | 3 _(auto)_ |
| Q5 | External API | Domain | Not in profile. | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | Not in profile. | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | Not in profile. | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | `test/` | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | `packages/` | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
pnpm (primary), npm (for `create-next-app`).

Q2:
Rust.

Q3:
Not in profile.

Q4:
Jest, Vitest, Playwright/Cypress (implied by docs, but not directly in `package.json` scripts for general tests).

Q5:
Not in profile.

Q6:
Not in profile.

Q7:
Not in profile.

Q8:
Not in profile.

Q9:
`test/`

Q10:
Not in profile.

Q11:
Not in profile.

Q12:
`packages/`
```
