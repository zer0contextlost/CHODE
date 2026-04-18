# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** gitea
**Profile size:** ~507 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 36/36 (100% of auto-scorable)
**Stump questions (9):** 27/27 (100% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | pnpm, gomod, uv | 3 _(auto)_ |
| Q2 | Go HTTP router | Objective | chi | 3 _(auto)_ |
| Q3 | Frontend framework | Objective | Vue (framework), esbuild and Vite (bundlers) | 3 _(auto)_ |
| Q4 | Config format | Objective | ini | 3 _(auto)_ |
| Q5 | Entry point | Navigational | main.go | 3 _(auto)_ |
| Q6 | Routes location | Navigational | routers/ (447 files) | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | routers/common/ | 3 _(auto)_ |
| Q8 | Migration count | Navigational | 305 files | 3 _(auto)_ |
| Q9 | Auth methods | Inferential | openid, pam, password, webauthn, ldap, oauth, smtp, db, oauth2, sspi | 3 _(auto)_ |
| Q10 | Architectural layers | Inferential | cmd → routes → svc → mdl | 3 _(auto)_ |
| Q11 | External integrations | Domain | Azure, AWS, Minio, Prometheus | 3 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | make fmt | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 36)_

---

## Raw Model Response

```
Q1:
pnpm, gomod, uv

Q2:
chi

Q3:
Vue (framework), esbuild and Vite (bundlers)

Q4:
ini

Q5:
main.go

Q6:
routers/ (447 files)

Q7:
routers/common/

Q8:
305 files

Q9:
openid, pam, password, webauthn, ldap, oauth, smtp, db, oauth2, sspi

Q10:
cmd → routes → svc → mdl

Q11:
Azure, AWS, Minio, Prometheus

Q12:
make fmt
```
