# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** gitea
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 5585 paths, 4 anchor files, 11 doc files
**Call 1 — profile build:** 94505 prompt tokens → 816 completion tokens (profile)
**Call 2 — questions:** 1068 prompt tokens + 154 completion tokens
**Total tokens consumed:** 96543

**CHODE equivalent:** ~507 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 186x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 16/36 (44% of auto-scorable)
**Stump questions (9):** 7/27 (26%)

---

## AI-Built Profile

```
This Gitea repository represents a self-hosted Git service application, primarily written in **Go (Golang)** with version requirements specified in `go.mod` (Go 1.26.2). The frontend uses **TypeScript** with **Vue 3** and **Vite** as the build tool, alongside **Tailwind CSS** for styling.

Key frameworks and libraries include:
- **Backend**: Go with Chi (router), XORM (ORM), and Bleve (search)
- **Frontend**: Vue 3, Vite, TypeScript, Tailwind CSS, and CodeMirror for code editing
- **Testing**: Vitest (frontend), Playwright (E2E), and Go's built-in `testing` package (backend)
- **Package managers**: `go mod` (Go), `pnpm` (JavaScript/TypeScript)

The project is a **monolithic web application** with a **CLI component**, designed to provide a lightweight, self-hosted Git service similar to GitHub. Its primary purpose is to enable users to host their own Git repositories, manage issues, pull requests, and CI/CD workflows (via Gitea Actions) in a private or public environment.

Top directories and approximate file counts:
- `models/` (300+ files): Core data models and database logic
- `routers/` (150+ files): HTTP route handlers (API and web)
- `services/` (100+ files): Business logic layer
- `modules/` (200+ files): Reusable utility modules (e.g., Git operations, auth)
- `web_src/` (50+ files): Frontend source (TypeScript, Vue, CSS)
- `templates/` (200+ files): HTML templates (Go's `html/template`)
- `cmd/` (20+ files): CLI entry points
- `tests/` (100+ files): Integration and E2E tests

Key entry point files:
- `main.go`: Primary application entry point
- `cmd/web.go`: Web server initialization
- `routers/web/web.go`: Web route definitions
- `routers/api/v1/api.go`: API route definitions
- `web_src/js/index.ts`: Frontend application bootstrap

The architecture follows a **layered pattern**:
1. **Presentation layer**: Web/API routers and templates
2. **Service layer**: Business logic (e.g., `services/`)
3. **Data layer**: Models and database interactions (XORM)
4. **Utility layer**: Reusable modules (e.g., Git operations, auth)

Notable conventions and gotchas:
- **Build process**: Uses `make` for backend (`make backend`) and frontend (`make frontend`) builds. Requires `TAGS="bindata"` for embedded assets.
- **Configuration**: Managed via `custom/conf/app.ini` or environment variables. Defaults are in `modules/setting/`.
- **Testing**: Integration tests use a real database (SQLite, MySQL, PostgreSQL). Run with `make test` or `go test ./...`.
- **Frontend**: Uses Vite for development (`pnpm dev`) and production builds (`pnpm build`).
- **Git operations**: Heavy use of `go-git` and custom Git command wrappers in `modules/git/`.
- **Migrations**: Database migrations are versioned in `models/migrations/` and run automatically on startup.
- **Gotchas**:
  - Frontend and backend are tightly coupled; changes often require updates in both.
  - Embedded assets (templates, public files) require `make generate` after modifications.
  - Some legacy code (e.g., `web_src/js/features/repo-legacy.ts`) may use older patterns.
  - Environment variables for configuration are case-sensitive and prefixed with `GITEA__` (e.g., `GITEA__server__DOMAIN`).
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | go mod (Go), pnpm (JavaScript/TypeScript) | 1 _(auto)_ |
| Q2 | Go HTTP router | Objective | Chi | 3 _(auto)_ |
| Q3 | Frontend framework | Objective | Frontend framework: Vue 3 Bundler: Vite | 3 _(auto)_ |
| Q4 | Config format | Objective | INI format (e.g., `custom/conf/app.ini`) | 3 _(auto)_ |
| Q5 | Entry point | Navigational | main.go | 3 _(auto)_ |
| Q6 | Routes location | Navigational | `routers/web/web.go` (web routes) and `routers/api/v1/api.go` (API routes) | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Migration count | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | Not in profile. | 0 _(auto)_ |
| Q10 | Architectural layers | Inferential | 1. Presentation layer 2. Service layer 3. Data layer 4. Utility layer | 0 _(auto)_ |
| Q11 | External integrations | Domain | Not in profile. | 0 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
go mod (Go), pnpm (JavaScript/TypeScript)

Q2:
Chi

Q3:
Frontend framework: Vue 3
Bundler: Vite

Q4:
INI format (e.g., `custom/conf/app.ini`)

Q5:
main.go

Q6:
`routers/web/web.go` (web routes) and `routers/api/v1/api.go` (API routes)

Q7:
Not in profile.

Q8:
Not in profile.

Q9:
Not in profile.

Q10:
1. Presentation layer
2. Service layer
3. Data layer
4. Utility layer

Q11:
Not in profile.

Q12:
Not in profile.
```
