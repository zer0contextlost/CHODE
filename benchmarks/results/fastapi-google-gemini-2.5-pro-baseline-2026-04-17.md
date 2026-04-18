# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** fastapi
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 288 prompt + 1817 completion = 2105 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 21/36 (58% of auto-scorable)
**Stump questions (7):** 9/21 (43% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | Poetry | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | fastapi/applications.py | 3 _(auto)_ |
| Q5 | Routing file | Navigational | fastapi/routing.py | 3 _(auto)_ |
| Q6 | Config format | Objective | pyproject.toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | Dependency Injection | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q9 | Install command | Domain | pip install "fastapi[all]" | 0 _(auto)_ |
| Q10 | File distribution | Inferential | The documentation examples directory contains more files. Core library: ~40 files, Documentation examples: ~500 files. | 0 _(auto)_ |
| Q11 | Project type | Inferential | Framework | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | It is a modern, high-performance web framework for building APIs with Python based on standard type hints. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 21)_

---

## Raw Model Response

```
Q1:
Poetry

Q2:
Starlette

Q3:
Pydantic

Q4:
fastapi/applications.py

Q5:
fastapi/routing.py

Q6:
pyproject.toml

Q7:
Dependency Injection

Q8:
GitHub Actions

Q9:
pip install "fastapi[all]"

Q10:
The documentation examples directory contains more files. Core library: ~40 files, Documentation examples: ~500 files.

Q11:
Framework

Q12:
It is a modern, high-performance web framework for building APIs with Python based on standard type hints.
```
