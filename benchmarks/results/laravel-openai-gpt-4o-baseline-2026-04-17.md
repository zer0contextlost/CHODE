# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** laravel
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 239 prompt + 109 completion = 348 total
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
| Q3 | Package manager | Objective | pip | 0 _(auto)_ |
| Q4 | Routes location | Navigational | In a routes.py file or similar module | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q6 | Session env vars | Domain | SESSION_SECRET, SESSION_TIMEOUT | 1 _(auto)_ |
| Q7 | DB connection env var | Domain | DATABASE_URL | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | HASH_ROUNDS | 0 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | controllers, models, views | 1 _(auto)_ |
| Q11 | Project type | Inferential | Application skeleton | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | This project provides a foundational structure for building web applications. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 10)_

---

## Raw Model Response

```
Q1: 
Python

Q2: 
Pytest

Q3: 
pip

Q4: 
In a routes.py file or similar module

Q5: 
Model-View-Controller (MVC)

Q6: 
SESSION_SECRET, SESSION_TIMEOUT

Q7: 
DATABASE_URL

Q8: 
HASH_ROUNDS

Q9: 
GitHub Actions

Q10: 
controllers, models, views

Q11: 
Application skeleton

Q12: 
This project provides a foundational structure for building web applications.
```
