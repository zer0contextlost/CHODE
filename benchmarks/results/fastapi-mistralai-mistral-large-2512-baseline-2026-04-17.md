# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** fastapi
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 281 prompt + 192 completion = 473 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 18/36 (50% of auto-scorable)
**Stump questions (7):** 3/21 (14% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | pip (or Poetry, depending on the project's dependency management) | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | main.py (or app.py, commonly named in FastAPI projects) | 0 _(auto)_ |
| Q5 | Routing file | Navigational | routers/ (or api.py, commonly used for routing logic in FastAPI) | 0 _(auto)_ |
| Q6 | Config format | Objective | pyproject.toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | Model-View-Controller (MVC) or layered architecture (with dependency injection and repository pattern) | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q9 | Install command | Domain | pip install fastapi[all] | 0 _(auto)_ |
| Q10 | File distribution | Inferential | Core library contains more files (e.g., ~50+ in core vs. ~20-30 in examples) | 0 _(auto)_ |
| Q11 | Project type | Inferential | Library (or framework, as FastAPI is often considered both) | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | FastAPI is a modern, high-performance web framework for building APIs with Python 3.7+ based on standard type hints. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 18)_

---

## Raw Model Response

```
Q1:
pip (or Poetry, depending on the project's dependency management)

Q2:
Starlette

Q3:
Pydantic

Q4:
main.py (or app.py, commonly named in FastAPI projects)

Q5:
routers/ (or api.py, commonly used for routing logic in FastAPI)

Q6:
pyproject.toml

Q7:
Model-View-Controller (MVC) or layered architecture (with dependency injection and repository pattern)

Q8:
GitHub Actions

Q9:
pip install fastapi[all]

Q10:
Core library contains more files (e.g., ~50+ in core vs. ~20-30 in examples)

Q11:
Library (or framework, as FastAPI is often considered both)

Q12:
FastAPI is a modern, high-performance web framework for building APIs with Python 3.7+ based on standard type hints.
```
