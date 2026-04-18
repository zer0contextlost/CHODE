# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** gitea
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 5585 paths, 4 anchor files, 11 doc files
**Call 1 — profile build:** 110150 prompt tokens → 934 completion tokens (profile)
**Call 2 — questions:** 1200 prompt tokens + 118 completion tokens
**Total tokens consumed:** 112402

**CHODE equivalent:** ~507 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 217x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 12/36 (33% of auto-scorable)
**Stump questions (9):** 4/27 (15%)

---

## AI-Built Profile

```
Primary language(s) and version:
Go 1.26.2. TypeScript/JavaScript for frontend.

Framework(s) and key libraries:
Backend: Go-chi/chi/v5 for routing, Xorm for ORM, Bleve/Elasticsearch/Meilisearch for indexing, go-git/go-git for Git operations, connectrpc/connect for RPC.
Frontend: Vue 3, CodeMirror, Fomantic-UI (Semantic UI fork), Tailwind CSS.

Package manager(s):
Go modules (go.mod, go.sum) for Go dependencies.
pnpm (package.json, pnpm-lock.yaml) for JavaScript/TypeScript dependencies.

Test framework(s) and test commands:
Go: `go test` for unit tests, custom integration test suite (`tests/integration`).
TypeScript: Vitest (`vitest.config.ts`) for unit tests, Playwright (`playwright.config.ts`) for E2E tests.
Test commands: `make test`, `make lint-go`, `make lint-js`.

Project type:
Application.

Primary purpose in 1-2 sentences:
Gitea is a lightweight, self-hosted Git service that provides a full-featured platform for software development, including repository management, issue tracking, and CI/CD (Gitea Actions).

Top directories and approximate file counts:
models/ (700+ files): Database models and business logic.
modules/ (600+ files): Reusable Go modules for various functionalities (Git, authentication, markup, etc.).
routers/ (300+ files): HTTP API and web route handlers.
services/ (300+ files): Business logic and service layer implementations.
templates/ (300+ files): HTML templates for the web interface.
web_src/ (200+ files): Frontend source code (TypeScript, Vue, CSS).
tests/ (200+ files): Integration and E2E tests, test data.
cmd/ (30+ files): Command-line interface for Gitea.
options/ (200+ files): Configuration options, gitignore templates, licenses, locales.
contrib/ (30+ files): Community contributions, init scripts, monitoring mixins.
docker/ (15+ files): Docker-related files.

Key entry point files:
`cmd/main.go`: Main entry point for the Go application.
`web_src/js/index.ts`: Main entry point for the frontend application.
`Dockerfile`: Docker build instructions.

Architecture pattern:
Layered architecture with clear separation of concerns:
- `models`: Data persistence and core domain logic.
- `services`: Business logic, orchestrating interactions between models.
- `modules`: Shared utilities and infrastructure components.
- `routers`: API and web presentation layer.
- `templates`, `web_src`: Frontend presentation.
The project also follows a modular design, with many functionalities encapsulated within specific modules (e.g., `modules/git`, `modules/actions`).

Notable conventions or gotchas:
- Extensive use of `make` for build, linting, and testing tasks.
- `TAGS="bindata"` is used during build to embed static assets. `sqlite` and `sqlite_unlock_notify` tags are used for SQLite support.
- `go.mod` specifies a custom `godebug` setting for `x509negativeserial=1` to relax certificate serial number checks.
- Frontend development requires Node.js LTS and pnpm.
- AI Contribution Policy is explicitly defined in `CONTRIBUTING.md`, requiring disclosure and responsible use.
- Security vulnerabilities are to be reported privately to `security@gitea.io` with PGP encryption.
- The project uses a custom fork of `go-chi/binding`, `go-chi/cache`, `go-chi/captcha`, `go-chi/session`, and `gitea.com/gitea/act` (renamed to `nektos/act` in go.mod) indicating internal modifications or specific version requirements.
- `CHANGELOG-archived.md` exists for older releases, with `CHANGELOG.md` for current changes.
- `AGENTS.md` provides developer guidelines and conventions.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | Go modules, pnpm | 1 _(auto)_ |
| Q2 | Go HTTP router | Objective | Go-chi/chi/v5 | 3 _(auto)_ |
| Q3 | Frontend framework | Objective | Frontend framework: Vue 3. Bundler: Not in profile. | 2 _(auto)_ |
| Q4 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `cmd/main.go` | 3 _(auto)_ |
| Q6 | Routes location | Navigational | `routers/` | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Migration count | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | Not in profile. | 0 _(auto)_ |
| Q10 | Architectural layers | Inferential | Routers -> Services -> Models | 0 _(auto)_ |
| Q11 | External integrations | Domain | Not in profile. | 0 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Go modules, pnpm

Q2
Go-chi/chi/v5

Q3
Frontend framework: Vue 3. Bundler: Not in profile.

Q4
Not in profile.

Q5
`cmd/main.go`

Q6
`routers/`

Q7
Not in profile.

Q8
Not in profile.

Q9
Not in profile.

Q10
Routers -> Services -> Models

Q11
Not in profile.

Q12
Not in profile.
```
