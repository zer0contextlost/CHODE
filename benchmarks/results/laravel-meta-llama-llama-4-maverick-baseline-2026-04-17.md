# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** laravel
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 241 prompt + 102 completion = 343 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 10/36 (28% of auto-scorable)
**Stump questions (5):** 2/15 (13% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 0 _(auto)_ |
| Q2 | Test framework | Objective | Pytest | 0 _(auto)_ |
| Q3 | Package manager | Objective | Pip | 0 _(auto)_ |
| Q4 | Routes location | Navigational | app/routes.py | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q6 | Session env vars | Domain | SESSION_SECRET, SESSION_TIMEOUT | 1 _(auto)_ |
| Q7 | DB connection env var | Domain | DATABASE_URL | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | PASSWORD_HASH_ROUNDS | 0 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | models, views, controllers | 1 _(auto)_ |
| Q11 | Project type | Inferential | Application skeleton | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | This project provides a basic structure for building a web application with user authentication and session management. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 10)_

---

## Raw Model Response

```
Q1
Python

Q2
Pytest

Q3
Pip

Q4
app/routes.py

Q5
Model-View-Controller (MVC)

Q6
SESSION_SECRET, SESSION_TIMEOUT

Q7
DATABASE_URL

Q8
PASSWORD_HASH_ROUNDS

Q9
GitHub Actions

Q10
models, views, controllers

Q11
Application skeleton

Q12
This project provides a basic structure for building a web application with user authentication and session management.
```
