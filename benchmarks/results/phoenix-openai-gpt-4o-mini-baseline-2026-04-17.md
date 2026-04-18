# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** phoenix
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 257 prompt + 77 completion = 334 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 19/36 (53% of auto-scorable)
**Stump questions (7):** 7/21 (33% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Elixir | 3 _(auto)_ |
| Q2 | Database library | Objective | Ecto | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | Plug | 3 _(auto)_ |
| Q4 | Package managers | Objective | Mix | 2 _(auto)_ |
| Q5 | Test frameworks | Objective | ExUnit | 0 _(auto)_ |
| Q6 | i18n library | Objective | Gettext | 3 _(auto)_ |
| Q7 | Ecto association rule | Domain | Use the `:through` option for associations | 0 _(auto)_ |
| Q8 | Ecto field type rule | Domain | text | 0 _(auto)_ |
| Q9 | Repo adapter | Domain | PostgreSQL | 2 _(auto)_ |
| Q10 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q11 | Largest directory | Navigational | lib | 0 _(auto)_ |
| Q12 | Project type | Inferential | Application | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 19)_

---

## Raw Model Response

```
Q1: Elixir  
Q2: Ecto  
Q3: Plug  
Q4: Mix  
Q5: ExUnit  
Q6: Gettext  
Q7: Use the `:through` option for associations  
Q8: :text  
Q9: PostgreSQL  
Q10: GitHub Actions  
Q11: lib  
Q12: Application  
```
