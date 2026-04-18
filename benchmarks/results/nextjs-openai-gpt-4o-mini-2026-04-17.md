# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** nextjs
**Profile size:** ~567 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 27/36 (75% of auto-scorable)
**Stump questions (9):** 18/27 (67% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | JS pkg manager | Objective | pnpm | 3 _(auto)_ |
| Q2 | Native bindings lang | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | Native pkg manager | Objective | cargo | 3 _(auto)_ |
| Q4 | Test frameworks | Objective | playwright, vitest | 3 _(auto)_ |
| Q5 | External API | Domain | slack | 3 _(auto)_ |
| Q6 | Routing entry point | Navigational | packages/next-routing/src/index.ts | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | packages/next-routing/src/ | 3 _(auto)_ |
| Q8 | Design patterns | Inferential | repository, factory, plugin | 3 _(auto)_ |
| Q9 | Largest directory | Inferential | packages/(3.4k) | 0 _(auto)_ |
| Q10 | Auth env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CSS framework | Objective | tailwindcss | 3 _(auto)_ |
| Q12 | Second largest package | Inferential | turbopack/(2800) | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 27)_

---

## Raw Model Response

```
Q1:
pnpm

Q2:
Not in profile.

Q3:
cargo

Q4:
playwright, vitest

Q5:
slack

Q6:
packages/next-routing/src/index.ts

Q7:
packages/next-routing/src/

Q8:
repository, factory, plugin

Q9:
packages/(3.4k)

Q10:
Not in profile.

Q11:
tailwindcss

Q12:
turbopack/(2800)
```
