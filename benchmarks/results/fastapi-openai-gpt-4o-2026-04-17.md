# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** fastapi
**Profile size:** ~211 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 27/36 (75% of auto-scorable)
**Stump questions (7):** 17/21 (81% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | Not in profile. | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette. | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic. | 3 _(auto)_ |
| Q4 | Application class file | Navigational | fastapi/applications.py | 3 _(auto)_ |
| Q5 | Routing file | Navigational | fastapi/routing.py | 3 _(auto)_ |
| Q6 | Config format | Objective | toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | Event-driven, middleware-chain. | 3 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions. | 3 _(auto)_ |
| Q9 | Install command | Domain | pip install "fastapi[standard]" | 3 _(auto)_ |
| Q10 | File distribution | Inferential | The documentation examples directory contains more files. Counts: docs_src/(455), fastapi/(48). | 2 _(auto)_ |
| Q11 | Project type | Inferential | Framework. | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | FastAPI framework, high performance, easy to learn, fast to code, ready for production. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 27)_

---

## Raw Model Response

```
Q1:
Not in profile.

Q2:
Starlette.

Q3:
Pydantic.

Q4:
fastapi/applications.py

Q5:
fastapi/routing.py

Q6:
toml

Q7:
Event-driven, middleware-chain.

Q8:
GitHub Actions.

Q9:
pip install "fastapi[standard]"

Q10:
The documentation examples directory contains more files. Counts: docs_src/(455), fastapi/(48).

Q11:
Framework.

Q12:
FastAPI framework, high performance, easy to learn, fast to code, ready for production.
```
