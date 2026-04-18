# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** nextjs
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 19785 paths, 4 anchor files, 9 doc files
**Call 1 — profile build:** 45763 prompt tokens → 485 completion tokens (profile)
**Call 2 — questions:** 733 prompt tokens + 76 completion tokens
**Total tokens consumed:** 47057

**CHODE equivalent:** ~567 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 81x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 6/36 (17% of auto-scorable)
**Stump questions (9):** 3/27 (11%)

---

## AI-Built Profile

```
This repository is a monorepo for the Next.js framework, containing the framework itself and related packages. The primary language is TypeScript, with significant Rust components.

The repository is built using pnpm as the package manager, with a complex build system orchestrated by Turborepo. The main build commands are defined in the root package.json, including "build", "build-all", and various test commands.

The project is a framework, specifically a React-based web framework, with a primary purpose of providing a robust and scalable solution for building web applications. The key features include server-side rendering, static site generation, and incremental static regeneration.

The top directories include:
- packages/ (~3000 files): contains published npm packages, including the main Next.js package
- test/ (~10000 files): contains all test suites for the project
- examples/ (~3000 files): contains example Next.js applications
- docs/ (~1000 files): contains documentation for Next.js
- crates/ (~1000 files): contains Rust crates for Next.js SWC bindings and other native components
- turbopack/ (~1000 files): contains Turbopack bundler (Rust) - a git subtree

Key entry point files include:
- packages/next/src/cli/next-dev.ts: the entry point for the development server
- packages/next/src/cli/next-start.ts: the entry point for the production server
- packages/next/src/cli/next-build.ts: the entry point for the build process

The architecture pattern is a monorepo with a mix of TypeScript and Rust components. Notable conventions include the use of pnpm workspaces, Turborepo for build orchestration, and a complex testing system with multiple test commands and configurations.

Some gotchas to be aware of include:
- The need to run a full bootstrap build after switching branches
- The importance of using the correct bundler (Turbopack or Webpack) depending on the context
- The use of NEXT_SKIP_ISOLATE environment variable to speed up test runs during development
- The requirement to generate tests using pnpm new-test for AI agents

The test framework used is Jest, with various test commands defined in the root package.json, including "test-unit", "test-dev-turbo", and "test-start-webpack". The project also includes a comprehensive documentation system, with documentation files located in the docs/ directory.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | pnpm | 3 _(auto)_ |
| Q2 | Native bindings lang | Objective | Rust | 3 _(auto)_ |
| Q3 | Native pkg manager | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test frameworks | Objective | Jest | 0 _(auto)_ |
| Q5 | External API | Domain | Not in profile. | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | Not in profile. | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | monorepo | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | test/ | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | examples/ | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
pnpm

Q2
Rust

Q3
Not in profile.

Q4
Jest

Q5
Not in profile.

Q6
Not in profile.

Q7
Not in profile.

Q8
monorepo

Q9
test/

Q10
Not in profile.

Q11
Not in profile.

Q12
examples/
```
