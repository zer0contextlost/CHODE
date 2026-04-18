# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** django
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 261 prompt + 107 completion = 368 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 16/36 (44% of auto-scorable)
**Stump questions (7):** 6/21 (29% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | INI | 3 _(auto)_ |
| Q3 | Package managers | Objective | pip, setuptools | 2 _(auto)_ |
| Q4 | JS test frameworks | Objective | Jest | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | MVC (Model-View-Controller) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | /middleware | 1 _(auto)_ |
| Q8 | Core package size | Navigational | 50 | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | src | 0 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | This project is primarily designed to facilitate web development using the Django framework. | 1 _(auto)_ |
| Q12 | File skew | Inferential | The core django/ package is 10 times larger than the js_tests/ package by file count. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 16)_

---

## Raw Model Response

```
Q1: Python  
Q2: INI  
Q3: pip, setuptools  
Q4: Jest  
Q5: GitHub Actions  
Q6: MVC (Model-View-Controller)  
Q7: /middleware  
Q8: 50  
Q9: src  
Q10: Framework  
Q11: This project is primarily designed to facilitate web development using the Django framework.  
Q12: The core django/ package is 10 times larger than the js_tests/ package by file count.  
```
