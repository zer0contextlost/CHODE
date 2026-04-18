# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** phoenix
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 257 prompt + 202 completion = 459 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 25/36 (69% of auto-scorable)
**Stump questions (7):** 11/21 (52% — answers require reading profile)
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
| Q7 | Ecto association rule | Domain | Preload associations in the controller | 3 _(auto)_ |
| Q8 | Ecto field type rule | Domain | :string | 3 _(auto)_ |
| Q9 | Repo adapter | Domain | Postgrex | 0 _(auto)_ |
| Q10 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q11 | Largest directory | Navigational | lib | 0 _(auto)_ |
| Q12 | Project type | Inferential | Framework | 2 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 25)_

---

## Raw Model Response

```
Q1: What language is this project primarily written in?
Elixir

Q2: What database library/ORM does this project use?
Ecto

Q3: What HTTP middleware layer does this project use?
Plug

Q4: What package managers does this project use? List all mentioned.
Mix

Q5: What test frameworks or test commands does this project use?
ExUnit

Q6: What internationalization library is used?
Gettext

Q7: What is the convention for Ecto associations when they will be accessed in templates?
Preload associations in the controller

Q8: What Ecto.Schema field type should be used for text database columns?
:string

Q9: What Ecto database adapter does the generated Repo module use?
Postgrex

Q10: What CI system is configured?
GitHub Actions

Q11: Which top-level directory has the most files?
lib

Q12: Is this a framework, library, application, or CLI tool?
Framework
```
