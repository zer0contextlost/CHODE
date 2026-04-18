# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** django
**Profile size:** ~160 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 33/36 (92% of auto-scorable)
**Stump questions (7):** 18/21 (86% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | INI | 3 _(auto)_ |
| Q3 | Package managers | Objective | npm, pip | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | Puppeteer, QUnit | 3 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Middleware-chain | 3 _(auto)_ |
| Q7 | Middleware file | Navigational | django/contrib/admindocs/middleware.py | 3 _(auto)_ |
| Q8 | Core package size | Navigational | 923 | 3 _(auto)_ |
| Q9 | Largest directory | Navigational | django/ | 2 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. | 3 _(auto)_ |
| Q12 | File skew | Inferential | Approximately 84 times larger (923 files in django/ compared to 11 files in js_tests/). | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 33)_

---

## Raw Model Response

```
Q1:
Python

Q2:
INI

Q3:
npm, pip

Q4:
Puppeteer, QUnit

Q5:
GitHub Actions

Q6:
Middleware-chain

Q7:
django/contrib/admindocs/middleware.py

Q8:
923

Q9:
django/

Q10:
Framework

Q11:
Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.

Q12:
Approximately 84 times larger (923 files in django/ compared to 11 files in js_tests/).
```
