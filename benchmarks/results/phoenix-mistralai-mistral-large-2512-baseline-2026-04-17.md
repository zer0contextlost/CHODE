# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** phoenix
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 266 prompt + 213 completion = 479 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 30/36 (83% of auto-scorable)
**Stump questions (7):** 16/21 (76% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Elixir | 3 _(auto)_ |
| Q2 | Database library | Objective | Ecto | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | Plug (or Phoenix's built-in middleware, which is Plug-based) | 3 _(auto)_ |
| Q4 | Package managers | Objective | mix (Hex), npm/yarn (for frontend assets if applicable) | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | ExUnit, with commands like `mix test` | 2 _(auto)_ |
| Q6 | i18n library | Objective | Gettext | 3 _(auto)_ |
| Q7 | Ecto association rule | Domain | Preload them in the controller or use `Repo.preload/2` before passing to templates | 3 _(auto)_ |
| Q8 | Ecto field type rule | Domain | `:string` (for short text) or `:text` (for long text) | 3 _(auto)_ |
| Q9 | Repo adapter | Domain | Postgrex (PostgreSQL adapter) | 2 _(auto)_ |
| Q10 | CI system | Objective | GitHub Actions (or Travis CI/CircleCI, but GitHub Actions is most common in recent projects) | 3 _(auto)_ |
| Q11 | Largest directory | Navigational | `lib/` (or `test/` if tests are heavily emphasized) | 0 _(auto)_ |
| Q12 | Project type | Inferential | Application (or framework if it's Phoenix itself) | 2 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 30)_

---

## Raw Model Response

```
Here are the answers based on common patterns in Elixir/Phoenix projects (a typical software repository in the Elixir ecosystem):

Q1:
Elixir

Q2:
Ecto

Q3:
Plug (or Phoenix's built-in middleware, which is Plug-based)

Q4:
mix (Hex), npm/yarn (for frontend assets if applicable)

Q5:
ExUnit, with commands like `mix test`

Q6:
Gettext

Q7:
Preload them in the controller or use `Repo.preload/2` before passing to templates

Q8:
`:string` (for short text) or `:text` (for long text)

Q9:
Postgrex (PostgreSQL adapter)

Q10:
GitHub Actions (or Travis CI/CircleCI, but GitHub Actions is most common in recent projects)

Q11:
`lib/` (or `test/` if tests are heavily emphasized)

Q12:
Application (or framework if it's Phoenix itself)
```
