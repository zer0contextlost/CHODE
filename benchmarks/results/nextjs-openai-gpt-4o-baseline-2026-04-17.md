# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** nextjs
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 251 prompt + 76 completion = 327 total
**Questions parsed:** 0/12 (missing: Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12)
**Auto-scored:** 12/12 questions → 0/36 (0% of auto-scorable)
**Stump questions (9):** 0/27 (0% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | _(not parsed)_ | 0 _(auto)_ |
| Q2 | Native bindings lang | Objective | _(not parsed)_ | 0 _(auto)_ |
| Q3 | Native pkg manager | Objective | _(not parsed)_ | 0 _(auto)_ |
| Q4 | Test frameworks | Objective | _(not parsed)_ | 0 _(auto)_ |
| Q5 | External API | Domain | _(not parsed)_ | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | _(not parsed)_ | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | _(not parsed)_ | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | _(not parsed)_ | 0 _(auto)_ |
| Q9 | Largest directory | Inferential | _(not parsed)_ | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | _(not parsed)_ | 0 _(auto)_ |
| Q11 | CSS framework | Objective | _(not parsed)_ | 0 _(auto)_ |
| Q12 | Second largest package | Inferential | _(not parsed)_ | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 0)_

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
Jest, Mocha

Q5
Stripe API

Q6
index.js

Q7
src/middleware

Q8
Singleton, Observer

Q9
src

Q10
AUTH_TOKEN, API_KEY

Q11
Tailwind CSS

Q12
utils
```
