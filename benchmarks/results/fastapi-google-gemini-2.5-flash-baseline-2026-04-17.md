# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** fastapi
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 288 prompt + 140 completion = 428 total
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
| Q5 | Routing file | Navigational | main.py | 0 _(auto)_ |
| Q6 | Config format | Objective | toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | MVC (Model-View-Controller) | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q9 | Install command | Domain | pip install "fastapi[all]" | 0 _(auto)_ |
| Q10 | File distribution | Inferential | Core library: 100+ files, Documentation examples directory: 50+ files. The core library contains more files. | 0 _(auto)_ |
| Q11 | Project type | Inferential | Framework | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 15)_

---

## Raw Model Response

```
Q1
pip

Q2
Starlette

Q3
Pydantic

Q4
main.py

Q5
main.py

Q6
toml

Q7
MVC (Model-View-Controller)

Q8
GitHub Actions

Q9
pip install "fastapi[all]"

Q10
Core library: 100+ files, Documentation examples directory: 50+ files. The core library contains more files.

Q11
Framework

Q12
FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
```
