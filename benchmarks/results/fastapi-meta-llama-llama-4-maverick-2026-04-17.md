# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** fastapi
**Profile size:** ~211 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 32/36 (89% of auto-scorable)
**Stump questions (7):** 20/21 (95% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | uv | 3 _(auto)_ |
| Q2 | ASGI base framework | Objective | starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | fastapi/applications.py | 3 _(auto)_ |
| Q5 | Routing file | Navigational | fastapi/routing.py | 3 _(auto)_ |
| Q6 | Config format | Objective | toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | event-driven middleware-chain | 3 _(auto)_ |
| Q8 | CI system | Objective | github-actions | 3 _(auto)_ |
| Q9 | Install command | Domain | $ pip install "fastapi[standard]" | 3 _(auto)_ |
| Q10 | File distribution | Inferential | docs_src/(455) has more files than fastapi/(48) | 2 _(auto)_ |
| Q11 | Project type | Inferential | framework | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | FastAPI is a modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 32)_

---

## Raw Model Response

```
Q1:
uv

Q2:
starlette

Q3:
pydantic

Q4:
fastapi/applications.py

Q5:
fastapi/routing.py

Q6:
toml

Q7:
event-driven middleware-chain

Q8:
github-actions

Q9:
$ pip install "fastapi[standard]"

Q10:
docs_src/(455) has more files than fastapi/(48)

Q11:
framework

Q12:
FastAPI is a modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints.
```
