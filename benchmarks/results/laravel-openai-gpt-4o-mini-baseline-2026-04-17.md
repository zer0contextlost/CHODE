# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** laravel
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 239 prompt + 179 completion = 418 total
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
| Q1 | Language | Objective | The language is primarily written in Python. | 0 _(auto)_ |
| Q2 | Test framework | Objective | The test framework used is likely pytest. | 0 _(auto)_ |
| Q3 | Package manager | Objective | The package manager used according to the profile is pip. | 0 _(auto)_ |
| Q4 | Routes location | Navigational | HTTP routes are defined in the routes.py file. | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | This codebase uses the Model-View-Controller (MVC) design pattern. | 0 _(auto)_ |
| Q6 | Session env vars | Domain | The environment variables that control session management are SESSION_SECRET and SESSION_TIMEOUT. | 1 _(auto)_ |
| Q7 | DB connection env var | Domain | The environment variable that controls the database connection is DATABASE_URL. | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | The environment variable that controls password hashing rounds is HASHING_ROUNDS. | 0 _(auto)_ |
| Q9 | CI system | Objective | The CI system configured is GitHub Actions. | 3 _(auto)_ |
| Q10 | App structure | Navigational | The three subdirectories inside the app/ directory are models/, views/, and controllers/. | 1 _(auto)_ |
| Q11 | Project type | Inferential | This is an application skeleton. | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | This project's primary purpose is to provide a web application framework for building scalable web applications. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 10)_

---

## Raw Model Response

```
Q1: The language is primarily written in Python.

Q2: The test framework used is likely pytest.

Q3: The package manager used according to the profile is pip.

Q4: HTTP routes are defined in the routes.py file.

Q5: This codebase uses the Model-View-Controller (MVC) design pattern.

Q6: The environment variables that control session management are SESSION_SECRET and SESSION_TIMEOUT.

Q7: The environment variable that controls the database connection is DATABASE_URL.

Q8: The environment variable that controls password hashing rounds is HASHING_ROUNDS.

Q9: The CI system configured is GitHub Actions.

Q10: The three subdirectories inside the app/ directory are models/, views/, and controllers/.

Q11: This is an application skeleton.

Q12: This project's primary purpose is to provide a web application framework for building scalable web applications.
```
