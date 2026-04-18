# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** laravel
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 254 prompt + 2121 completion = 2375 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 23/36 (64% of auto-scorable)
**Stump questions (5):** 9/15 (60% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | PHP | 3 _(auto)_ |
| Q2 | Test framework | Objective | PHPUnit | 3 _(auto)_ |
| Q3 | Package manager | Objective | Composer | 0 _(auto)_ |
| Q4 | Routes location | Navigational | In the `routes/` directory, specifically in files like `web.php` and `api.php`. | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q6 | Session env vars | Domain | SESSION_DRIVER and SESSION_LIFETIME | 3 _(auto)_ |
| Q7 | DB connection env var | Domain | DATABASE_URL | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | BCRYPT_ROUNDS | 3 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | Http, Models, Providers | 3 _(auto)_ |
| Q11 | Project type | Inferential | Application skeleton | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | To provide a boilerplate or starting point for building a web application. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 23)_

---

## Raw Model Response

```
Q1:
PHP

Q2:
PHPUnit

Q3:
Composer

Q4:
In the `routes/` directory, specifically in files like `web.php` and `api.php`.

Q5:
Model-View-Controller (MVC)

Q6:
SESSION_DRIVER and SESSION_LIFETIME

Q7:
DATABASE_URL

Q8:
BCRYPT_ROUNDS

Q9:
GitHub Actions

Q10:
Http, Models, Providers

Q11:
Application skeleton

Q12:
To provide a boilerplate or starting point for building a web application.
```
