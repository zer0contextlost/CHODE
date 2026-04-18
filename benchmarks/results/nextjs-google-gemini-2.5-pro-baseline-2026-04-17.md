# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** nextjs
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 266 prompt + 3484 completion = 3750 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 13/36 (36% of auto-scorable)
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
| Q4 | Test frameworks | Objective | Jest | 0 _(auto)_ |
| Q5 | External API | Domain | Vercel | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | index.ts | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | In a `middleware.ts` file at the root of the `src` or `app` directory. | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | Component-based architecture, file-based routing, middleware, and facade patterns. | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | examples | 2 _(auto)_ |
| Q10 | Auth env vars | Domain | NEXTAUTH_URL, NEXTAUTH_SECRET | 2 _(auto)_ |
| Q11 | CSS framework | Objective | Tailwind CSS | 3 _(auto)_ |
| Q12 | Second largest package | Inferential | create-next-app | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 13)_

---

## Raw Model Response

```
Q1:
Yarn

Q2:
Rust

Q3:
Cargo

Q4:
Jest

Q5:
Vercel

Q6:
index.ts

Q7:
In a `middleware.ts` file at the root of the `src` or `app` directory.

Q8:
Component-based architecture, file-based routing, middleware, and facade patterns.

Q9:
examples

Q10:
NEXTAUTH_URL, NEXTAUTH_SECRET

Q11:
Tailwind CSS

Q12:
create-next-app
```
