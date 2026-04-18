# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** nextjs
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 19785 paths, 4 anchor files, 9 doc files
**Call 1 — profile build:** 49390 prompt tokens → 567 completion tokens (profile)
**Call 2 — questions:** 814 prompt tokens + 94 completion tokens
**Total tokens consumed:** 50865

**CHODE equivalent:** ~567 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 87x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 8/36 (22% of auto-scorable)
**Stump questions (9):** 5/27 (19%)

---

## AI-Built Profile

```
This repository is a monorepo for the Next.js framework, primarily written in TypeScript and Rust. The main language is TypeScript, with Rust used for performance-critical components, particularly in the Turbopack bundler. The repository utilizes pnpm as its package manager, which supports workspaces for managing multiple packages efficiently.

Next.js is a popular React framework that enables server-side rendering, static site generation, and API routes, among other features. The repository includes various packages, such as `next`, `create-next-app`, and `next-swc`, which provide core functionalities and tools for building applications. The key libraries include React, SWC (a Rust-based JavaScript/TypeScript compiler), and Turbopack (a Rust-based bundler).

Testing is facilitated through Jest, with commands such as `pnpm test`, `pnpm test-unit`, and `pnpm test-dev-turbo` for running unit tests and development tests. The repository also supports various testing modes, including development and production, allowing for flexible testing strategies.

The project is structured as a monorepo, containing multiple packages, examples, and documentation. The top-level directories include:

- `packages/` (approximately 2982 files): Contains the core Next.js framework and related packages.
- `turbopack/` (approximately 1094 files): Houses the Turbopack bundler and its components.
- `crates/` (approximately 16785 files): Contains Rust crates for Next.js SWC bindings.
- `examples/` (approximately 2804 files): Provides example applications demonstrating Next.js features.
- `docs/` (approximately 3000 files): Contains documentation for the framework.

Key entry points for the Next.js framework include:

- `packages/next/src/cli/next-dev.ts`: Entry point for the development server.
- `packages/next/src/cli/next-start.ts`: Entry point for the production server.
- `packages/next/src/cli/next-build.ts`: Entry point for the build process.

The architecture pattern is a combination of microservices and modular design, allowing for independent development and deployment of various components. The repository follows a convention of using README files in each subdirectory to document local patterns and conventions, ensuring consistency across the codebase.

Notable conventions include the use of `pnpm` for dependency management, the requirement to run a full bootstrap build after switching branches, and the practice of writing tests alongside documentation to ensure that the framework remains accurate and up-to-date. Additionally, the repository emphasizes the importance of running tests in a headless mode for faster iteration during development.

Overall, this repository serves as a comprehensive framework for building modern web applications with React, leveraging the performance benefits of Rust and the flexibility of a monorepo structure.
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
| Q8 | Design patterns | Inferential | Microservices and modular design | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | crates/ | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | turbopack | 2 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:  
pnpm

Q2:  
Rust

Q3:  
Not in profile.

Q4:  
Jest

Q5:  
Not in profile.

Q6:  
Not in profile.

Q7:  
Not in profile.

Q8:  
Microservices and modular design

Q9:  
crates/

Q10:  
Not in profile.

Q11:  
Not in profile.

Q12:  
turbopack
```
