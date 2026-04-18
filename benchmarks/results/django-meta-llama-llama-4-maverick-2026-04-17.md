# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** django
**Profile size:** ~160 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 27/36 (75% of auto-scorable)
**Stump questions (7):** 15/21 (71% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | python | 3 _(auto)_ |
| Q2 | Config format | Objective | ini | 3 _(auto)_ |
| Q3 | Package managers | Objective | npm pip | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | qunit | 0 _(auto)_ |
| Q5 | CI system | Objective | github-actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | middleware-chain | 3 _(auto)_ |
| Q7 | Middleware file | Navigational | django/contrib/admindocs/middleware.py | 3 _(auto)_ |
| Q8 | Core package size | Navigational | 923 | 3 _(auto)_ |
| Q9 | Largest directory | Navigational | django | 2 _(auto)_ |
| Q10 | Project type | Inferential | application | 0 _(auto)_ |
| Q11 | Primary purpose | Objective | Django is high-level Python web framework that encourages rapid development and clean, pragmatic design. | 3 _(auto)_ |
| Q12 | File skew | Inferential | 83.9090909091   (I calculated this by dividing the number of files in the core django package (923) by the number of files in the js_tests package (11), so 923 / 11 = 83.9090909091) | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 27)_

---

## Raw Model Response

```
Q1:
python

Q2:
ini

Q3:
npm pip

Q4:
qunit

Q5:
github-actions

Q6:
middleware-chain

Q7:
django/contrib/admindocs/middleware.py

Q8:
923

Q9:
django

Q10:
application

Q11:
Django is high-level Python web framework that encourages rapid development and clean, pragmatic design.

Q12:
83.9090909091 

(I calculated this by dividing the number of files in the core django package (923) by the number of files in the js_tests package (11), so 923 / 11 = 83.9090909091)
```
