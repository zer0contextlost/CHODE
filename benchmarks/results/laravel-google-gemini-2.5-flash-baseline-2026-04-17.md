# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** laravel
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 254 prompt + 184 completion = 438 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 13/36 (36% of auto-scorable)
**Stump questions (5):** 5/15 (33% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 0 _(auto)_ |
| Q2 | Test framework | Objective | Pytest | 0 _(auto)_ |
| Q3 | Package manager | Objective | Poetry | 0 _(auto)_ |
| Q4 | Routes location | Navigational | In files named `routes.py` within application modules. | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q6 | Session env vars | Domain | `SECRET_KEY`, `SESSION_COOKIE_NAME`, `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `SESSION_PERMANENT`, `SESSION_USE_SIGNER`, `SESSION_REFRESH_EACH_REQUEST`, `PERMANENT_SESSION_LIFETIME` | 1 _(auto)_ |
| Q7 | DB connection env var | Domain | `DATABASE_URL` | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | `BCRYPT_LOG_ROUNDS` | 3 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | `auth`, `main`, `models` | 1 _(auto)_ |
| Q11 | Project type | Inferential | Application skeleton | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | This project provides a basic structure for a web application with user authentication and database integration. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 13)_

---

## Raw Model Response

```
Q1: Python
Q2: Pytest
Q3: Poetry
Q4: In files named `routes.py` within application modules.
Q5: Model-View-Controller (MVC)
Q6: `SECRET_KEY`, `SESSION_COOKIE_NAME`, `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `SESSION_PERMANENT`, `SESSION_USE_SIGNER`, `SESSION_REFRESH_EACH_REQUEST`, `PERMANENT_SESSION_LIFETIME`
Q7: `DATABASE_URL`
Q8: `BCRYPT_LOG_ROUNDS`
Q9: GitHub Actions
Q10: `auth`, `main`, `models`
Q11: Application skeleton
Q12: This project provides a basic structure for a web application with user authentication and database integration.
```
