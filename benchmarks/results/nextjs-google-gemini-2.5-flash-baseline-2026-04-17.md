# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** nextjs
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 266 prompt + 85 completion = 351 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 11/36 (31% of auto-scorable)
**Stump questions (9):** 7/27 (26% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | npm | 0 _(auto)_ |
| Q2 | Native bindings lang | Objective | Rust | 3 _(auto)_ |
| Q3 | Native pkg manager | Objective | Cargo | 3 _(auto)_ |
| Q4 | Test frameworks | Objective | Jest, Vitest | 1 _(auto)_ |
| Q5 | External API | Domain | Stripe | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | src/index.ts | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | src/middleware | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | Singleton, Factory, Observer | 1 _(auto)_ |
| Q9 | Largest directory | Inferential | packages | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | STRIPE_SECRET_KEY, JWT_SECRET | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Tailwind CSS | 3 _(auto)_ |
| Q12 | Second largest package | Inferential | core | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 11)_

---

## Raw Model Response

```
Q1: npm
Q2: Rust
Q3: Cargo
Q4: Jest, Vitest
Q5: Stripe
Q6: src/index.ts
Q7: src/middleware
Q8: Singleton, Factory, Observer
Q9: packages
Q10: STRIPE_SECRET_KEY, JWT_SECRET
Q11: Tailwind CSS
Q12: core
```
