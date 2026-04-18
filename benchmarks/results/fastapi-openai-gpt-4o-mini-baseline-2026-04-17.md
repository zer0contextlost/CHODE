# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** fastapi
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 274 prompt + 128 completion = 402 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 15/36 (42% of auto-scorable)
**Stump questions (7):** 3/21 (14% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | pip | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | main.py | 0 _(auto)_ |
| Q5 | Routing file | Navigational | routes.py | 0 _(auto)_ |
| Q6 | Config format | Objective | pyproject.toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | MVC (Model-View-Controller) | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q9 | Install command | Domain | pip install fastapi | 0 _(auto)_ |
| Q10 | File distribution | Inferential | Core library contains more files (e.g., 50 files in core vs. 30 files in examples). | 0 _(auto)_ |
| Q11 | Project type | Inferential | Framework | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | This project's primary purpose is to provide a fast and easy way to build APIs with Python. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 15)_

---

## Raw Model Response

```
Q1:  
pip

Q2:  
Starlette

Q3:  
Pydantic

Q4:  
main.py

Q5:  
routes.py

Q6:  
pyproject.toml

Q7:  
MVC (Model-View-Controller)

Q8:  
GitHub Actions

Q9:  
pip install fastapi

Q10:  
Core library contains more files (e.g., 50 files in core vs. 30 files in examples).

Q11:  
Framework

Q12:  
This project's primary purpose is to provide a fast and easy way to build APIs with Python.
```
