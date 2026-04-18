# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** django
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 277 prompt + 118 completion = 395 total
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
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | INI, YAML | 3 _(auto)_ |
| Q3 | Package managers | Objective | pip, npm | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | QUnit, Jest | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | django/middleware/csrf.py | 1 _(auto)_ |
| Q8 | Core package size | Navigational | 1000-2000 | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | django/ | 2 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. | 3 _(auto)_ |
| Q12 | File skew | Inferential | 10-20 times | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 21)_

---

## Raw Model Response

```
Q1: Python
Q2: INI, YAML
Q3: pip, npm
Q4: QUnit, Jest
Q5: GitHub Actions
Q6: Model-View-Controller (MVC)
Q7: django/middleware/csrf.py
Q8: 1000-2000
Q9: django/
Q10: Framework
Q11: Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.
Q12: 10-20 times
```
