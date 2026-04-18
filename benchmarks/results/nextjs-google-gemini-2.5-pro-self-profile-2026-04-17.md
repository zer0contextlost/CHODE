# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** nextjs
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 19785 paths, 4 anchor files, 9 doc files
**Call 1 — profile build:** 64143 prompt tokens → 2812 completion tokens (profile)
**Call 2 — questions:** 1166 prompt tokens + 1743 completion tokens
**Total tokens consumed:** 69864

**CHODE equivalent:** ~567 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 113x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 10/36 (28% of auto-scorable)
**Stump questions (9):** 6/27 (22%)

---

## AI-Built Profile

```
Primary language(s) and version: The repository is a hybrid of TypeScript and Rust. It uses Node.js (specified in `.node-version`) and the Rust toolchain defined in `rust-toolchain.toml`.

Framework(s) and key libraries: This is the source code for the Next.js framework itself. It is built on React. Key internal components and dependencies include Turbopack and Rspack (Rust-based bundlers), SWC (Rust-based compiler), and Turborepo for monorepo task orchestration.

Package manager(s): The project uses pnpm, as indicated by `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and scripts in `package.json`.

Test framework(s) and test commands: The testing setup is multifaceted. Jest is used for unit tests (`pnpm test-unit`). A comprehensive integration and end-to-end test suite is run via a matrix of commands combining different modes (dev, start) and bundlers (Turbopack, Webpack, Rspack). Key commands include `pnpm test-dev-turbo` (default), `pnpm test-start-webpack`, and `pnpm test-dev-rspack`. A unique `evals` system uses `vitest` to test AI agent performance on Next.js tasks.

Project type: This is a large-scale monorepo that contains the Next.js web framework, its associated CLI (`create-next-app`), the Turbopack bundler, extensive documentation, and numerous example applications.

Primary purpose in 1-2 sentences: This repository contains the source code for Next.js, a popular open-source React framework for building full-stack web applications. It encompasses the core framework, its Rust-based compiler infrastructure (SWC/Turbopack), and the surrounding ecosystem of tools and documentation.

Top directories and approximate file counts:
-   `test/` (~9,800 files): The primary location for all integration and end-to-end tests.
-   `packages/` (~3,000 files): The source for published npm packages, including the main `next` package.
-   `examples/` (~2,800 files): A large collection of example Next.js applications.
-   `turbopack/` & `crates/` (~1,100+ files): The Rust source code for the Turbopack bundler and other native modules.
-   `docs/` (~500 files): The source for the official Next.js documentation.

Key entry point files:
-   CLI Commands: `packages/next/src/cli/next-dev.ts` (dev server), `packages/next/src/cli/next-build.ts` (build process), and `packages/next/src/cli/next-start.ts` (production server).
-   Rust Workspace: The root `Cargo.toml` defines the workspace members, including `turbopack/crates/*` and other `crates/*`.

Architecture pattern: The project follows a hybrid TypeScript/Rust architecture. The high-level framework logic and APIs are written in TypeScript, while performance-critical parts like the bundler (Turbopack) and code transformations (SWC) are implemented in Rust for maximum speed. The entire project is structured as a monorepo managed by Turborepo.

Notable conventions or gotchas:
-   The `AGENTS.md` file is a critical, condensed guide for developers (especially AI agents) on how to build, test, and contribute.
-   Local development relies on a fast, iterative workflow: running a watch process (`pnpm --filter=next dev`) in the background while running tests with optimizations like `NEXT_SKIP_ISOLATE=1`.
-   The project officially supports and uses `git worktree` for parallel development, with configuration for a tool named Conductor to manage this process.
-   A unique `evals/` directory contains a framework for running automated evaluations of AI coding agents against common Next.js development tasks.
-   The repository contains multiple bundler implementations (Turbopack, Webpack, Rspack), and tests are run against them to ensure compatibility.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | The project uses pnpm. | 3 _(auto)_ |
| Q2 | Native bindings lang | Objective | Rust. | 3 _(auto)_ |
| Q3 | Native pkg manager | Objective | The profile mentions a `Cargo.toml` file for the Rust workspace, which is the manifest file for Cargo, Rust's package manager. | 3 _(auto)_ |
| Q4 | Test frameworks | Objective | Jest and vitest. | 1 _(auto)_ |
| Q5 | External API | Domain | Not in profile. | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | Not in profile. | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | The profile describes the architecture pattern as a hybrid TypeScript/Rust architecture within a monorepo structure. | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | `test/` (~9,800 files). | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | `packages/` (~3,000 files). | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
The project uses pnpm.

Q2
Rust.

Q3
The profile mentions a `Cargo.toml` file for the Rust workspace, which is the manifest file for Cargo, Rust's package manager.

Q4
Jest and vitest.

Q5
Not in profile.

Q6
Not in profile.

Q7
Not in profile.

Q8
The profile describes the architecture pattern as a hybrid TypeScript/Rust architecture within a monorepo structure.

Q9
`test/` (~9,800 files).

Q10
Not in profile.

Q11
Not in profile.

Q12
`packages/` (~3,000 files).
```
