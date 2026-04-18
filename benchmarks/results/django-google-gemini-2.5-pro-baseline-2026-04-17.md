# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** django
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 277 prompt + 3693 completion = 3970 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 14/36 (39% of auto-scorable)
**Stump questions (7):** 4/21 (19% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | YAML | 0 _(auto)_ |
| Q3 | Package managers | Objective | pip, npm | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | QUnit | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Model-View-Template (MVT) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | django/middleware/common.py | 1 _(auto)_ |
| Q8 | Core package size | Navigational | 1857 | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | tests | 0 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | To enable the rapid development of secure, scalable, and maintainable web applications. | 1 _(auto)_ |
| Q12 | File skew | Inferential | 37 | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 14)_

---

## Raw Model Response

```
Q1:
Python

Q2:
YAML

Q3:
pip, npm

Q4:
QUnit

Q5:
GitHub Actions

Q6:
Model-View-Template (MVT)

Q7:
django/middleware/common.py

Q8:
1857

Q9:
tests

Q10:
Framework

Q11:
To enable the rapid development of secure, scalable, and maintainable web applications.

Q12:
37
```
