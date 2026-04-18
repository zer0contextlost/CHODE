# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** nextjs
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 257 prompt + 612 completion = 869 total
**Questions parsed:** 11/12 (missing: Q12)
**Auto-scored:** 12/12 questions → 4/36 (11% of auto-scorable)
**Stump questions (9):** 4/27 (15% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | --- | 0 _(auto)_ |
| Q2 | Native bindings lang | Objective | --- | 0 _(auto)_ |
| Q3 | Native pkg manager | Objective | --- | 0 _(auto)_ |
| Q4 | Test frameworks | Objective | --- | 0 _(auto)_ |
| Q5 | External API | Domain | --- | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | --- | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | --- | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | - **Module pattern** (for organization) - **Singleton** (for config/services) - **Factory pattern** (for plugin systems) - **Observer pattern** (for event handling) - **Middleware pattern** (for request processing)  --- | 1 _(auto)_ |
| Q9 | Largest directory | Inferential | --- | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | - `NEXTAUTH_URL` / `AUTH_SECRET` (NextAuth.js) - `GITHUB_TOKEN` / `GITLAB_TOKEN` (for CI/CD) - `DATABASE_URL` (for database auth) - `API_KEY` or `AUTH0_CLIENT_ID` (for external APIs)  --- | 3 _(auto)_ |
| Q11 | CSS framework | Objective | --- | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | _(not parsed)_ | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 4)_

---

## Raw Model Response

```
Here are the answers based on common patterns in modern JavaScript/TypeScript monorepos (e.g., similar to Next.js, SWC, or other large open-source projects):

---

Q1
The monorepo most likely uses **pnpm** as its JavaScript package manager, though **yarn** (especially Yarn Workspaces) is also a common alternative.

---

Q2
The native SWC bindings are written in **Rust**.

---

Q3
Native language dependencies (e.g., Rust for SWC) are typically handled by **Cargo** (Rust's package manager).

---

Q4
Common test frameworks in such projects include **Jest** (for unit/integration tests) and **Playwright** or **Cypress** (for E2E tests). Some may also use **uvu** or **Mocha**.

---

Q5
This project likely integrates with **GitHub Actions API** (for CI/CD) or **Vercel/Netlify API** (for deployment). If authentication-related, it might use **Auth0**, **NextAuth.js**, or **Firebase Auth**.

---

Q6
The entry point file for the routing package is typically named **`index.ts`** or **`index.js`**, often located at `packages/routing/src/index.ts`.

---

Q7
Middleware is usually located in a **`middleware`** directory (e.g., `src/middleware/`) or as part of a **`server`** or **`lib`** directory. In Next.js-like projects, it might be at the root (e.g., `middleware.ts`).

---

Q8
Common design patterns in such codebases include:
- **Module pattern** (for organization)
- **Singleton** (for config/services)
- **Factory pattern** (for plugin systems)
- **Observer pattern** (for event handling)
- **Middleware pattern** (for request processing)

---

Q9
The **`packages`** top-level directory typically contains the most files, as it holds all sub-packages/modules.

---

Q10
Common authentication environment variables include:
- `NEXTAUTH_URL` / `AUTH_SECRET` (NextAuth.js)
- `GITHUB_TOKEN` / `GITLAB_TOKEN` (for CI/CD)
- `DATABASE_URL` (for database auth)
- `API_KEY` or `AUTH0_CLIENT_ID` (for external APIs)

---

Q11
The CSS framework is likely **Tailwind CSS** (common in modern monorepos), though **CSS Modules**, **Styled Components**, or **Emotion** are also possibilities.

---

Q12
The second-largest top-level package by file count is often the **`core`**, **`utils`**, or **`compiler`** package (e.g., `@repo/core` or `@repo/utils`). If the monorepo has a CLI, it might be the **`cli`** package.
```
