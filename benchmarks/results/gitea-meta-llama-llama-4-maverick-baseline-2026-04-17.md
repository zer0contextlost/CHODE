# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** gitea
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 255 prompt + 117 completion = 372 total
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
| Q1 | All package managers | Objective | npm, go mod | 0 _(auto)_ |
| Q2 | Go HTTP router | Objective | github.com/gorilla/mux | 0 _(auto)_ |
| Q3 | Frontend framework | Objective | React, Webpack | 0 _(auto)_ |
| Q4 | Config format | Objective | YAML | 0 _(auto)_ |
| Q5 | Entry point | Navigational | main.go | 3 _(auto)_ |
| Q6 | Routes location | Navigational | routes.go | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | middleware/error_handler.go | 0 _(auto)_ |
| Q8 | Migration count | Navigational | 12 | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | OAuth, JWT, Basic Auth | 1 _(auto)_ |
| Q10 | Architectural layers | Inferential | Controller, Service, Repository | 0 _(auto)_ |
| Q11 | External integrations | Domain | AWS S3, Prometheus, Grafana | 1 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | go fmt ./... | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 5)_

---

## Raw Model Response

```
Since I don't have any information about the project, I'll have to make educated guesses based on common practices.

Q1
npm, go mod

Q2
github.com/gorilla/mux

Q3
React, Webpack

Q4
YAML

Q5
main.go

Q6
routes.go

Q7
middleware/error_handler.go

Q8
12

Q9
OAuth, JWT, Basic Auth

Q10
Controller, Service, Repository

Q11
AWS S3, Prometheus, Grafana

Q12
go fmt ./...
```
