# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** nextjs
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 251 prompt + 75 completion = 326 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 10/36 (28% of auto-scorable)
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
| Q4 | Test frameworks | Objective | Jest and Mocha | 0 _(auto)_ |
| Q5 | External API | Domain | GitHub API | 0 _(auto)_ |
| Q6 | Routing entry point | Navigational | index.js | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | src/middleware | 0 _(auto)_ |
| Q8 | Design patterns | Inferential | Singleton and Factory | 1 _(auto)_ |
| Q9 | Largest directory | Inferential | src | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | API_KEY and SECRET | 0 _(auto)_ |
| Q11 | CSS framework | Objective | Tailwind CSS | 3 _(auto)_ |
| Q12 | Second largest package | Inferential | utils | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 10)_

---

## Raw Model Response

```
Q1: npm  
Q2: Rust  
Q3: Cargo  
Q4: Jest and Mocha  
Q5: GitHub API  
Q6: index.js  
Q7: src/middleware  
Q8: Singleton and Factory  
Q9: src  
Q10: API_KEY and SECRET  
Q11: Tailwind CSS  
Q12: utils  
```
