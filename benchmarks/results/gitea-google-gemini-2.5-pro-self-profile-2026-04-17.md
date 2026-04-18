# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** gitea
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 5585 paths, 4 anchor files, 11 doc files
**Call 1 — profile build:** 110150 prompt tokens → 3117 completion tokens (profile)
**Call 2 — questions:** 1211 prompt tokens + 1649 completion tokens
**Total tokens consumed:** 116127

**CHODE equivalent:** ~507 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 217x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 13/36 (36% of auto-scorable)
**Stump questions (9):** 4/27 (15%)

---

## AI-Built Profile

```
Primary language(s) and version:
Go (1.26.2), TypeScript, Node.js (>= 22.18.0)

Framework(s) and key libraries:
- Backend: Chi (web router), XORM (ORM), go-git (native Git implementation), Bleve/Elasticsearch (search indexing), `connectrpc.com/connect` (gRPC/Connect RPC).
- Frontend: Vue.js, Vite, Tailwind CSS. It also contains legacy code using jQuery and Fomantic UI.

Package manager(s):
- Go Modules (`go.mod`) for the backend.
- pnpm (`pnpm-lock.yaml`, `package.json`) for the frontend.
- pip (`pyproject.toml`) for Python-based development tools (e.g., linters).

Test framework(s) and test commands:
- Backend: Go's standard testing library. A large suite of integration tests resides in `tests/integration`. The primary test command is `make test`.
- Frontend: Vitest for unit tests and Playwright for end-to-end tests (`tests/e2e/`). E2E tests are run via `make test-e2e`.
- Fuzzing tests are present in `tests/fuzz`.

Project type:
Monorepo containing a full-stack web application.

Primary purpose in 1-2 sentences:
Gitea is a self-hosted Git service that provides a lightweight and easy-to-install alternative to platforms like GitHub or GitLab. It offers core source control management features including repository hosting, issue tracking, pull requests, and CI/CD via Gitea Actions.

Top directories and approximate file counts:
- `templates/` (~600 files): Server-side Go templates for the UI.
- `public/` (~500 files): Publicly served static assets, primarily SVG icons.
- `models/` (~400 files): Database models, ORM logic, and a large number of versioned migration files.
- `services/` (~250 files): Core business logic for features like issues, pull requests, and webhooks.
- `routers/` (~300 files): HTTP request routing and handlers, separating API, web, and private routes.
- `modules/` (~500 files): A large collection of shared utilities and packages, from Git interactions to markup rendering.
- `web_src/` (~250 files): Modern frontend source code (TypeScript, Vue, CSS).
- `options/` (~400 files): Bundled default assets like `.gitignore` and license templates.

Key entry point files:
- `main.go`: The primary application entry point that dispatches to subcommands.
- `cmd/web.go`: Defines the `web` subcommand that starts the Gitea server.
- `web_src/js/index.ts`: Main entry point for the Vite-managed frontend assets.
- `Makefile`: Central script for all build, test, and linting tasks.

Architecture pattern:
Gitea is a layered monolithic application. It employs a hybrid rendering model: the majority of the UI is rendered server-side using Go templates, which is then progressively enhanced with modern client-side components built with Vue.js and Vite. The backend is structured with `routers` (controllers), `services` (business logic), and `models` (data access layer).

Notable conventions or gotchas:
- The project is a long-running fork of Gogs, which is reflected in the mix of legacy (jQuery, Fomantic UI) and modern (Vue, Vite, Tailwind) frontend technologies.
- The build process requires both Go and Node.js (with pnpm) toolchains, orchestrated via `make`.
- Git operations are abstracted in `modules/git`, with build tags (`_gogit.go`, `_nogogit.go`) used to switch between a pure Go implementation and shelling out to the `git` command-line tool.
- Database schema changes are managed through a large, strictly versioned set of migration files in `models/migrations/`.
- Contributions require signing commits with the Developer Certificate of Origin (DCO).
- The repository has a specific policy for AI-assisted contributions, requiring disclosure and adherence to guidelines in `AGENTS.md` and `CONTRIBUTING.md`.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | Go Modules, pnpm, and pip. | 1 _(auto)_ |
| Q2 | Go HTTP router | Objective | Chi | 3 _(auto)_ |
| Q3 | Frontend framework | Objective | Vue.js is the framework and Vite is the bundler. | 3 _(auto)_ |
| Q4 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `main.go` | 3 _(auto)_ |
| Q6 | Routes location | Navigational | In the `routers/` directory. | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Migration count | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | Not in profile. | 0 _(auto)_ |
| Q10 | Architectural layers | Inferential | `routers` (controllers), `services` (business logic), and `models` (data access layer). | 0 _(auto)_ |
| Q11 | External integrations | Domain | Not in profile. | 0 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Go Modules, pnpm, and pip.

Q2
Chi

Q3
Vue.js is the framework and Vite is the bundler.

Q4
Not in profile.

Q5
`main.go`

Q6
In the `routers/` directory.

Q7
Not in profile.

Q8
Not in profile.

Q9
Not in profile.

Q10
`routers` (controllers), `services` (business logic), and `models` (data access layer).

Q11
Not in profile.

Q12
Not in profile.
```
