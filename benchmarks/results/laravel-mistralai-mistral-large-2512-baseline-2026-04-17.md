# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** laravel
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 247 prompt + 238 completion = 485 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 19/36 (53% of auto-scorable)
**Stump questions (5):** 11/15 (73% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | JavaScript (Node.js) or Python | 0 _(auto)_ |
| Q2 | Test framework | Objective | Jest (for JS) or pytest (for Python) | 0 _(auto)_ |
| Q3 | Package manager | Objective | npm (for JS) or pip/poetry (for Python) | 3 _(auto)_ |
| Q4 | Routes location | Navigational | In a `routes/` directory or directly in a main app file (e.g., `app.js`, `server.py`, or `routes/api.js`) | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) or layered architecture | 0 _(auto)_ |
| Q6 | Session env vars | Domain | `SESSION_SECRET`, `SESSION_EXPIRY`, or `COOKIE_SECRET` | 1 _(auto)_ |
| Q7 | DB connection env var | Domain | `DATABASE_URL` or `DB_CONNECTION_STRING` | 3 _(auto)_ |
| Q8 | Password hashing env | Domain | `HASH_ROUNDS` or `BCRYPT_ROUNDS` | 3 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions or Travis CI | 3 _(auto)_ |
| Q10 | App structure | Navigational | controllers/, models/, and views/ (or services/, utils/, and middleware/) | 1 _(auto)_ |
| Q11 | Project type | Inferential | Application skeleton | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | A web application backend for user authentication and data management. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 19)_

---

## Raw Model Response

```
Here are the answers based on common patterns in software repositories (particularly those resembling Node.js/Express or Python/Flask/Django projects, which are frequent in such benchmarks):

Q1
JavaScript (Node.js) or Python

Q2
Jest (for JS) or pytest (for Python)

Q3
npm (for JS) or pip/poetry (for Python)

Q4
In a `routes/` directory or directly in a main app file (e.g., `app.js`, `server.py`, or `routes/api.js`)

Q5
Model-View-Controller (MVC) or layered architecture

Q6
`SESSION_SECRET`, `SESSION_EXPIRY`, or `COOKIE_SECRET`

Q7
`DATABASE_URL` or `DB_CONNECTION_STRING`

Q8
`HASH_ROUNDS` or `BCRYPT_ROUNDS`

Q9
GitHub Actions or Travis CI

Q10
controllers/, models/, and views/ (or services/, utils/, and middleware/)

Q11
Application skeleton

Q12
A web application backend for user authentication and data management.
```
