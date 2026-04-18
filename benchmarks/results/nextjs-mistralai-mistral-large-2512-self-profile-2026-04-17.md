# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** nextjs
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 19785 paths, 4 anchor files, 9 doc files
**Call 1 — profile build:** 53261 prompt tokens → 715 completion tokens (profile)
**Call 2 — questions:** 967 prompt tokens + 87 completion tokens
**Total tokens consumed:** 55030

**CHODE equivalent:** ~567 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 94x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 6/36 (17% of auto-scorable)
**Stump questions (9):** 3/27 (11%)

---

## AI-Built Profile

```
Here's a compressed profile of the Next.js repository:

Primary languages: TypeScript (primary), Rust (performance-critical components). Node.js version: 18+. The project is a monorepo using pnpm as its package manager.

Frameworks and key libraries: Next.js itself is a React framework. Core dependencies include React, SWC (Rust-based compiler), Turbopack (Rust-based bundler), and webpack as a fallback. Testing uses Jest with custom Next.js test utilities.

Project type: Monorepo containing a framework (Next.js), CLI tools (create-next-app), and supporting packages. It's primarily a framework for building React applications with server-side rendering, static site generation, and other modern web features.

Primary purpose: Next.js is a React framework that enables server-side rendering, static site generation, and other advanced features for building production-ready web applications with improved performance and developer experience.

Top directories and file counts:
- test/ (~9,766 files): Comprehensive test suite
- packages/ (~2,982 files): Published npm packages (next, create-next-app, etc.)
- examples/ (~2,804 files): Example Next.js applications
- turbopack/ (~1,094 files): Turbopack bundler implementation
- crates/ (~130 files): Rust crates for SWC bindings
- docs/ (~500 files): Documentation
- evals/ (~50 files): Agent evaluation fixtures

Key entry point files:
- packages/next/src/cli/next-dev.ts: Dev server entry
- packages/next/src/cli/next-build.ts: Build command
- packages/next/src/cli/next-start.ts: Production server
- packages/next/src/server/next-server.ts: Core server implementation
- packages/next/src/build/index.ts: Build system

Architecture pattern: The project follows a modular architecture with clear separation between:
1. Core framework (packages/next)
2. Bundler integration (Turbopack/webpack)
3. Compiler (SWC via Rust crates)
4. CLI tools (create-next-app)
5. Documentation and examples

Notable conventions and gotchas:
- Uses pnpm workspaces for monorepo management
- Rust components are compiled to WASM or native bindings
- Build system uses Turborepo for caching and parallel execution
- Defaults to Turbopack but can fall back to webpack
- Watch mode (`pnpm --filter=next dev`) is essential for fast iteration
- `NEXT_SKIP_ISOLATE=1` speeds up tests by skipping package isolation
- Always run full build after branch switches to ensure proper setup
- Test commands vary by mode (dev/start) and bundler (webpack/turbopack/rspack)
- Documentation is bundled into the package for agent consumption
- Evals test agent understanding of Next.js features

The codebase follows a convention where source files in packages/next/src/ are compiled to packages/next/dist/. The Rust crates provide high-performance transforms and compilation steps. The project maintains strict separation between development and production modes, with different test commands for each.

Key gotchas include the need to properly manage the watch build process, the importance of running appropriate test commands for different scenarios, and the requirement to rebuild after branch changes. The eval system is particularly notable as it tests AI agent understanding of Next.js features against bundled documentation.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | pnpm | 3 _(auto)_ |
| Q2 | Native bindings lang | Objective | Rust | 3 _(auto)_ |
| Q3 | Native pkg manager | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test frameworks | Objective | Jest with custom Next.js test utilities | 0 _(auto)_ |
| Q5 | External API | Domain | Not in profile. | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | Not in profile. | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | Not in profile. | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | test/ | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | packages/ | 0 _(auto)_ |

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
Jest with custom Next.js test utilities

Q5:
Not in profile.

Q6:
Not in profile.

Q7:
Not in profile.

Q8:
Not in profile.

Q9:
test/

Q10:
Not in profile.

Q11:
Not in profile.

Q12:
packages/
```
