# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** gitea
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 267 prompt + 2008 completion = 2275 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 7/36 (19% of auto-scorable)
**Stump questions (9):** 4/27 (15% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | Go Modules, npm | 0 _(auto)_ |
| Q2 | Go HTTP router | Objective | chi | 3 _(auto)_ |
| Q3 | Frontend framework | Objective | React and Vite | 0 _(auto)_ |
| Q4 | Config format | Objective | YAML | 0 _(auto)_ |
| Q5 | Entry point | Navigational | cmd/api/main.go | 3 _(auto)_ |
| Q6 | Routes location | Navigational | internal/transport/http/handler.go | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | internal/transport/http/middleware/ | 0 _(auto)_ |
| Q8 | Migration count | Navigational | 27 | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | Email/Password, OAuth 2.0 (Google, GitHub), API Keys | 1 _(auto)_ |
| Q10 | Architectural layers | Inferential | Transport/Handler Layer -> Application/Service Layer -> Repository/Data Access Layer | 0 _(auto)_ |
| Q11 | External integrations | Domain | Amazon S3, Prometheus, Grafana, Sentry | 0 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | make lint test | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 7)_

---

## Raw Model Response

```
Q1:
Go Modules, npm

Q2:
chi

Q3:
React and Vite

Q4:
YAML

Q5:
cmd/api/main.go

Q6:
internal/transport/http/handler.go

Q7:
internal/transport/http/middleware/

Q8:
27

Q9:
Email/Password, OAuth 2.0 (Google, GitHub), API Keys

Q10:
Transport/Handler Layer -> Application/Service Layer -> Repository/Data Access Layer

Q11:
Amazon S3, Prometheus, Grafana, Sentry

Q12:
make lint test
```
