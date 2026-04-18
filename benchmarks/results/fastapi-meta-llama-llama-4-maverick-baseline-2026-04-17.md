# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** fastapi
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 276 prompt + 89 completion = 365 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 12/36 (33% of auto-scorable)
**Stump questions (7):** 3/21 (14% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | pip | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | FastAPI | 0 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | main.py | 0 _(auto)_ |
| Q5 | Routing file | Navigational | routes.py | 0 _(auto)_ |
| Q6 | Config format | Objective | toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | MVC and Repository | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q9 | Install command | Domain | pip install fastapi[all] | 0 _(auto)_ |
| Q10 | File distribution | Inferential | 50, 20 | 0 _(auto)_ |
| Q11 | Project type | Inferential | library | 2 _(auto)_ |
| Q12 | Primary purpose | Objective | This project provides a reusable set of APIs for data processing. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 12)_

---

## Raw Model Response

```
Q1
pip

Q2
FastAPI

Q3
Pydantic

Q4
main.py

Q5
routes.py

Q6
toml

Q7
MVC and Repository

Q8
GitHub Actions

Q9
pip install fastapi[all]

Q10
50, 20

Q11
library

Q12
This project provides a reusable set of APIs for data processing.
```
