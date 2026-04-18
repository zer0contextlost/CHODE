# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** gitea
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 252 prompt + 285 completion = 537 total
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
| Q1 | All package managers | Objective | The package managers used in this project are likely to be Go modules (go.mod) and possibly npm or yarn for frontend dependencies. | 0 _(auto)_ |
| Q2 | Go HTTP router | Objective | The Go HTTP router library used is likely to be Gorilla Mux or Gin. | 0 _(auto)_ |
| Q3 | Frontend framework | Objective | The frontend framework used is likely React, and the bundler is likely Webpack. | 0 _(auto)_ |
| Q4 | Config format | Objective | The configuration file format used in this project is likely JSON or YAML. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | The main application entry point file is likely `main.go`. | 3 _(auto)_ |
| Q6 | Routes location | Navigational | HTTP routes are typically defined in a dedicated routes file, often named `routes.go` or similar. | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | Common/error-handling middleware is usually located in a middleware directory or file, often named `middleware.go`. | 2 _(auto)_ |
| Q8 | Migration count | Navigational | The project likely has a varying number of database migration files, but a common number could be around 5 to 20. | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | The authentication methods supported by this project may include JWT, OAuth2, and basic authentication. | 1 _(auto)_ |
| Q10 | Architectural layers | Inferential | The architectural layer order from entry point to data layer is likely: Presentation Layer -> Business Logic Layer -> Data Access Layer. | 0 _(auto)_ |
| Q11 | External integrations | Domain | The project may integrate with cloud storage providers like AWS S3 and monitoring systems like Prometheus or Grafana. | 1 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | The command that must be run before committing code is likely `go fmt` or `npm run lint`. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 7)_

---

## Raw Model Response

```
Q1:  
The package managers used in this project are likely to be Go modules (go.mod) and possibly npm or yarn for frontend dependencies.

Q2:  
The Go HTTP router library used is likely to be Gorilla Mux or Gin.

Q3:  
The frontend framework used is likely React, and the bundler is likely Webpack.

Q4:  
The configuration file format used in this project is likely JSON or YAML.

Q5:  
The main application entry point file is likely `main.go`.

Q6:  
HTTP routes are typically defined in a dedicated routes file, often named `routes.go` or similar.

Q7:  
Common/error-handling middleware is usually located in a middleware directory or file, often named `middleware.go`.

Q8:  
The project likely has a varying number of database migration files, but a common number could be around 5 to 20.

Q9:  
The authentication methods supported by this project may include JWT, OAuth2, and basic authentication.

Q10:  
The architectural layer order from entry point to data layer is likely: Presentation Layer -> Business Logic Layer -> Data Access Layer.

Q11:  
The project may integrate with cloud storage providers like AWS S3 and monitoring systems like Prometheus or Grafana.

Q12:  
The command that must be run before committing code is likely `go fmt` or `npm run lint`.
```
