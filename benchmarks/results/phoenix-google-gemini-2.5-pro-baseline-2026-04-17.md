# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** phoenix
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 276 prompt + 1435 completion = 1711 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 29/36 (81% of auto-scorable)
**Stump questions (7):** 17/21 (81% — answers require reading profile)
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
| Q4 | Package managers | Objective | mix, npm | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | ExUnit, `mix test` | 2 _(auto)_ |
| Q6 | i18n library | Objective | Gettext | 3 _(auto)_ |
| Q7 | Ecto association rule | Domain | Associations should be preloaded in the context or controller before being passed to the template. | 3 _(auto)_ |
| Q8 | Ecto field type rule | Domain | :string | 3 _(auto)_ |
| Q9 | Repo adapter | Domain | Ecto.Adapters.Postgres | 3 _(auto)_ |
| Q10 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q11 | Largest directory | Navigational | deps | 0 _(auto)_ |
| Q12 | Project type | Inferential | application | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 29)_

---

## Raw Model Response

```
Q1:
Elixir

Q2:
Ecto

Q3:
Plug

Q4:
mix, npm

Q5:
ExUnit, `mix test`

Q6:
Gettext

Q7:
Associations should be preloaded in the context or controller before being passed to the template.

Q8:
:string

Q9:
Ecto.Adapters.Postgres

Q10:
GitHub Actions

Q11:
deps

Q12:
application
```
