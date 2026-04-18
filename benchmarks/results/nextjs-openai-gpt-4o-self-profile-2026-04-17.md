# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** nextjs
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 19785 paths, 4 anchor files, 9 doc files
**Call 1 — profile build:** 49390 prompt tokens → 531 completion tokens (profile)
**Call 2 — questions:** 778 prompt tokens + 101 completion tokens
**Total tokens consumed:** 50800

**CHODE equivalent:** ~567 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 87x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 6/36 (17% of auto-scorable)
**Stump questions (9):** 3/27 (11%)

---

## AI-Built Profile

```
This repository is a monorepo for the Next.js framework, primarily written in JavaScript and TypeScript. It leverages Rust for performance-critical components, particularly through SWC bindings. The project uses Node.js, with a minimum version requirement of 18, and employs pnpm as its package manager. The primary framework is Next.js, a popular React-based framework for building web applications. Key libraries include SWC for JavaScript/TypeScript compilation and Turbopack for bundling.

Testing is conducted using Jest, with various test commands available for different environments, such as `test-unit`, `test-dev`, and `test-start`. The project supports multiple bundlers, including Turbopack and Webpack, with Turbopack being the default. The repository is structured as a monorepo, containing multiple packages and Rust crates, and is designed to facilitate both library and application development.

The primary purpose of this repository is to develop and maintain the Next.js framework, which simplifies the process of building server-rendered React applications with features like static site generation and API routes. The repository also includes tools for creating new Next.js applications and integrating with various CMS platforms.

Top directories include:
- `packages/` (~2982 files): Contains the core Next.js framework and related packages.
- `crates/` (~various files): Rust crates for SWC bindings and other utilities.
- `turbopack/` (~1094 files): Contains the Turbopack bundler, implemented in Rust.
- `examples/` (~2804 files): Example applications demonstrating Next.js features.
- `test/` (~9766 files): Comprehensive test suites for the framework.

Key entry point files include:
- `packages/next/src/cli/next-dev.ts`: Entry point for the development server.
- `packages/next/src/cli/next-start.ts`: Entry point for the production server.
- `packages/next/src/cli/next-build.ts`: Entry point for the build process.

The architecture follows a modular pattern, with a clear separation between the core framework, build tools, and example applications. Notable conventions include the use of a `conductor` setup for parallel development and a strong emphasis on testing with various configurations.

A notable gotcha is the requirement to run a full bootstrap build after switching branches to ensure all dependencies are correctly set up. Additionally, the repository uses a custom setup for running agent evaluations, which involves sandboxing and testing AI-generated code against Next.js features. This setup is designed to ensure that the framework remains up-to-date with the latest AI capabilities and documentation standards.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | pnpm | 3 _(auto)_ |
| Q2 | Native bindings lang | Objective | Rust | 3 _(auto)_ |
| Q3 | Native pkg manager | Objective | Not in profile | 0 _(auto)_ |
| Q4 | Test frameworks | Objective | Jest | 0 _(auto)_ |
| Q5 | External API | Domain | Not in profile | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | Not in profile | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | Modular pattern | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | test/ (~9766 files) | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | Not in profile | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Not in profile | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | examples/ (~2804 files) | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:  
pnpm  

Q2:  
Rust  

Q3:  
Not in profile  

Q4:  
Jest  

Q5:  
Not in profile  

Q6:  
Not in profile  

Q7:  
Not in profile  

Q8:  
Modular pattern  

Q9:  
test/ (~9766 files)  

Q10:  
Not in profile  

Q11:  
Not in profile  

Q12:  
examples/ (~2804 files)  
```
