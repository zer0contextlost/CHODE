# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** gitea
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 267 prompt + 107 completion = 374 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 5/36 (14% of auto-scorable)
**Stump questions (9):** 2/27 (7% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | npm, Go Modules | 0 _(auto)_ |
| Q2 | Go HTTP router | Objective | gorilla/mux | 0 _(auto)_ |
| Q3 | Frontend framework | Objective | React, Webpack | 0 _(auto)_ |
| Q4 | Config format | Objective | YAML | 0 _(auto)_ |
| Q5 | Entry point | Navigational | main.go | 3 _(auto)_ |
| Q6 | Routes location | Navigational | pkg/api/routes.go | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | pkg/middleware/error_handler.go | 0 _(auto)_ |
| Q8 | Migration count | Navigational | 3 | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | JWT, OAuth2 | 1 _(auto)_ |
| Q10 | Architectural layers | Inferential | Handlers, Services, Repositories, Models | 0 _(auto)_ |
| Q11 | External integrations | Domain | AWS S3, Prometheus, Grafana | 1 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | make test | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 5)_

---

## Raw Model Response

```
Q1: npm, Go Modules
Q2: gorilla/mux
Q3: React, Webpack
Q4: YAML
Q5: main.go
Q6: pkg/api/routes.go
Q7: pkg/middleware/error_handler.go
Q8: 3
Q9: JWT, OAuth2
Q10: Handlers, Services, Repositories, Models
Q11: AWS S3, Prometheus, Grafana
Q12: make test
```
