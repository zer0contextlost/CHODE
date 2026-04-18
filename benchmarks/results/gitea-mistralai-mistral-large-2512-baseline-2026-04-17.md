# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** gitea
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 257 prompt + 594 completion = 851 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 11/36 (31% of auto-scorable)
**Stump questions (9):** 5/27 (19% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | `go.mod` (Go Modules) for backend dependencies, and likely `npm`/`yarn`/`pnpm` (via `package.json`) for frontend dependencies.  --- | 1 _(auto)_ |
| Q2 | Go HTTP router | Objective | Gin or Echo (most common in Go projects; Gin is more likely if the project is lightweight).  --- | 0 _(auto)_ |
| Q3 | Frontend framework | Objective | Frontend framework: React (or Vue/Svelte, but React is most common). Bundler: Vite or Webpack (Vite is more modern and likely).  --- | 3 _(auto)_ |
| Q4 | Config format | Objective | YAML (e.g., `config.yaml` or `config.yml`) for app configuration, and possibly `.env` for environment variables.  --- | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `main.go` (Go backend entry point) and `src/main.tsx`/`src/main.jsx` or `src/index.js` (frontend entry point).  --- | 3 _(auto)_ |
| Q6 | Routes location | Navigational | HTTP routes are typically defined in a `routes/` or `api/` directory (e.g., `routes/api.go` or `internal/http/routes.go`), often grouped by domain (e.g., `user_routes.go`).  --- | 0 _(auto)_ |
| Q7 | Middleware location | Navigational | Common/error-handling middleware is usually in a `middleware/` directory (e.g., `middleware/auth.go`, `middleware/error_handler.go`).  --- | 2 _(auto)_ |
| Q8 | Migration count | Navigational | Between 5 and 20 migration files (a guess; common for small-to-medium projects). Files are likely in a `migrations/` or `db/migrations/` directory with names like `001_create_users_table.up.sql`.  --- | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | - OAuth2 (Google/GitHub/GitLab) - JWT (stateless authentication) - Session-based authentication (e.g., cookies) - Basic Auth (less common, but possible for APIs) - API keys (for machine-to-machine auth)  --- | 1 _(auto)_ |
| Q10 | Architectural layers | Inferential | 1. **Entry Point** (e.g., `main.go`) 2. **HTTP Layer** (routers, handlers) 3. **Service Layer** (business logic) 4. **Repository Layer** (database interactions) 5. **Data Layer** (database/models)  --- | 0 _(auto)_ |
| Q11 | External integrations | Domain | **Cloud Storage Providers:** - AWS S3 - Google Cloud Storage - Azure Blob Storage  **Monitoring Systems:** - Prometheus + Grafana - Datadog - Sentry (for error tracking) - OpenTelemetry (for observability)  --- | 1 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | `make lint` or `go fmt ./... && golangci-lint run` (for Go) and `npm run lint` (for frontend). Pre-commit hooks might also enforce: - `go mod tidy` (Go) - `npm run test` (frontend tests) - `pre-commit run --all-files` (if using `pre-commit`… | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 11)_

---

## Raw Model Response

```
Here are the answers based on common patterns in Go-based software repositories (e.g., typical web applications with a frontend/backend split):

---

Q1
`go.mod` (Go Modules) for backend dependencies, and likely `npm`/`yarn`/`pnpm` (via `package.json`) for frontend dependencies.

---

Q2
Gin or Echo (most common in Go projects; Gin is more likely if the project is lightweight).

---

Q3
Frontend framework: React (or Vue/Svelte, but React is most common).
Bundler: Vite or Webpack (Vite is more modern and likely).

---

Q4
YAML (e.g., `config.yaml` or `config.yml`) for app configuration, and possibly `.env` for environment variables.

---

Q5
`main.go` (Go backend entry point) and `src/main.tsx`/`src/main.jsx` or `src/index.js` (frontend entry point).

---

Q6
HTTP routes are typically defined in a `routes/` or `api/` directory (e.g., `routes/api.go` or `internal/http/routes.go`), often grouped by domain (e.g., `user_routes.go`).

---

Q7
Common/error-handling middleware is usually in a `middleware/` directory (e.g., `middleware/auth.go`, `middleware/error_handler.go`).

---

Q8
Between 5 and 20 migration files (a guess; common for small-to-medium projects). Files are likely in a `migrations/` or `db/migrations/` directory with names like `001_create_users_table.up.sql`.

---

Q9
- OAuth2 (Google/GitHub/GitLab)
- JWT (stateless authentication)
- Session-based authentication (e.g., cookies)
- Basic Auth (less common, but possible for APIs)
- API keys (for machine-to-machine auth)

---

Q10
1. **Entry Point** (e.g., `main.go`)
2. **HTTP Layer** (routers, handlers)
3. **Service Layer** (business logic)
4. **Repository Layer** (database interactions)
5. **Data Layer** (database/models)

---

Q11
**Cloud Storage Providers:**
- AWS S3
- Google Cloud Storage
- Azure Blob Storage

**Monitoring Systems:**
- Prometheus + Grafana
- Datadog
- Sentry (for error tracking)
- OpenTelemetry (for observability)

---

Q12
`make lint` or `go fmt ./... && golangci-lint run` (for Go) and `npm run lint` (for frontend). Pre-commit hooks might also enforce:
- `go mod tidy` (Go)
- `npm run test` (frontend tests)
- `pre-commit run --all-files` (if using `pre-commit` framework).
```
