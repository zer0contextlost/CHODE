# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** phoenix
**Profile size:** ~306 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 30/36 (83% of auto-scorable)
**Stump questions (7):** 18/21 (86% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | elixir | 3 _(auto)_ |
| Q2 | Database library | Objective | ecto | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | plug | 3 _(auto)_ |
| Q4 | Package managers | Objective | npm, mix | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | jest, mix test | 3 _(auto)_ |
| Q6 | i18n library | Objective | gettext | 3 _(auto)_ |
| Q7 | Ecto association rule | Domain | Always preload Ecto associations in queries when they'll be accessed in templates, ie message that needs to reference `message.user.email` | 3 _(auto)_ |
| Q8 | Ecto field type rule | Domain | `:string` | 3 _(auto)_ |
| Q9 | Repo adapter | Domain | Ecto.Adapters.Postgres | 3 _(auto)_ |
| Q10 | CI system | Objective | github-actions | 3 _(auto)_ |
| Q11 | Largest directory | Navigational | lib/ | 0 _(auto)_ |
| Q12 | Project type | Inferential | Not in profile. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 30)_

---

## Raw Model Response

```
Q1:
elixir

Q2:
ecto

Q3:
plug

Q4:
npm, mix

Q5:
jest, mix test

Q6:
gettext

Q7:
Always preload Ecto associations in queries when they'll be accessed in templates, ie message that needs to reference `message.user.email`

Q8:
`:string`

Q9:
Ecto.Adapters.Postgres

Q10:
github-actions

Q11:
lib/

Q12:
Not in profile.
```
