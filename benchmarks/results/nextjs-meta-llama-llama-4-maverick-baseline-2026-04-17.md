# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** nextjs
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 253 prompt + 85 completion = 338 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 14/36 (39% of auto-scorable)
**Stump questions (9):** 10/27 (37% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | Yarn | 0 _(auto)_ |
| Q2 | Native bindings lang | Objective | Rust | 3 _(auto)_ |
| Q3 | Native pkg manager | Objective | Cargo | 3 _(auto)_ |
| Q4 | Test frameworks | Objective | Jest and Vitest | 1 _(auto)_ |
| Q5 | External API | Domain | GitHub API | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | packages/routing/src/index.ts | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | packages/middleware/src | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | Factory and Singleton patterns | 1 _(auto)_ |
| Q9 | Largest directory | Inferential | packages | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | GITHUB_TOKEN and AUTH_SECRET | 3 _(auto)_ |
| Q11 | CSS framework | Objective | Tailwind CSS | 3 _(auto)_ |
| Q12 | Second largest package | Inferential | packages/ui | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 14)_

---

## Raw Model Response

```
Q1
Yarn

Q2
Rust

Q3
Cargo

Q4
Jest and Vitest

Q5
GitHub API

Q6
packages/routing/src/index.ts

Q7
packages/middleware/src

Q8
Factory and Singleton patterns

Q9
packages

Q10
GITHUB_TOKEN and AUTH_SECRET

Q11
Tailwind CSS

Q12
packages/ui
```
