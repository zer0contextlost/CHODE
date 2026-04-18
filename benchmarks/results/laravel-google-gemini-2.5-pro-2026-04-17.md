# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** laravel
**Profile size:** ~237 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 32/36 (89% of auto-scorable)
**Stump questions (5):** 15/15 (100% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | php | 3 _(auto)_ |
| Q2 | Test framework | Objective | phpunit | 3 _(auto)_ |
| Q3 | Package manager | Objective | npm | 3 _(auto)_ |
| Q4 | Routes location | Navigational | routes/ | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | factory | 3 _(auto)_ |
| Q6 | Session env vars | Domain | SESSION_DRIVER, SESSION_LIFETIME, SESSION_ENCRYPT, SESSION_PATH, SESSION_DOMAIN | 3 _(auto)_ |
| Q7 | DB connection env var | Domain | DB_CONNECTION | 3 _(auto)_ |
| Q8 | Password hashing env | Domain | BCRYPT_ROUNDS | 3 _(auto)_ |
| Q9 | CI system | Objective | github-actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | Http, Models, Providers | 3 _(auto)_ |
| Q11 | Project type | Inferential | web application framework | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | Laravel is a web application framework with expressive, elegant syntax. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 32)_

---

## Raw Model Response

```
Q1:
php

Q2:
phpunit

Q3:
npm

Q4:
routes/

Q5:
factory

Q6:
SESSION_DRIVER, SESSION_LIFETIME, SESSION_ENCRYPT, SESSION_PATH, SESSION_DOMAIN

Q7:
DB_CONNECTION

Q8:
BCRYPT_ROUNDS

Q9:
github-actions

Q10:
Http, Models, Providers

Q11:
web application framework

Q12:
Laravel is a web application framework with expressive, elegant syntax.
```
