# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** gitea
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 5585 paths, 4 anchor files, 11 doc files
**Call 1 — profile build:** 80364 prompt tokens → 562 completion tokens (profile)
**Call 2 — questions:** 812 prompt tokens + 165 completion tokens
**Total tokens consumed:** 81903

**CHODE equivalent:** ~507 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 159x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 14/36 (39% of auto-scorable)
**Stump questions (9):** 5/27 (19%)

---

## AI-Built Profile

```
This repository is primarily written in Go (version 1.26.2) and JavaScript, with some TypeScript and other supporting files. The project is a monorepo that contains both backend and frontend code.

The backend is built using the Go programming language and utilizes various frameworks and libraries, including Go Chi (github.com/go-chi/chi/v5) for routing, and GORM (not explicitly listed but inferred from the presence of models and migrations) for database interactions. The go.mod file lists numerous dependencies, including AWS SDK, Azure SDK, and various other libraries for tasks such as authentication, logging, and more.

The frontend is built using JavaScript and TypeScript, with dependencies managed by pnpm (version 10.0.0 or greater). Key frontend libraries include Vue.js (version 3.5.32), CodeMirror, and Mermaid. The package.json file lists numerous dependencies, including various CodeMirror plugins, chart.js, and other UI-related libraries.

The project uses a Makefile for build and test automation. The build process involves compiling the Go code and building the frontend using pnpm and Vite. The project includes comprehensive tests, with both unit tests and end-to-end (e2e) tests written using Playwright.

The primary purpose of this project is to provide a self-hosted Git service, Gitea, which is designed to be easy to install, configure, and use. The project includes documentation, issue tracking, and pull request management.

Top directories include:
- cmd: contains the main Go application code (~30 files)
- models: contains database models and migrations (~200 files)
- modules: contains various utility modules and libraries (~150 files)
- routers: contains routing code for the web application (~100 files)
- services: contains business logic and service layer code (~100 files)
- templates: contains HTML templates for the web application (~150 files)
- web_src: contains frontend code, including JavaScript, CSS, and Vue components (~100 files)
- tests: contains test code, including integration tests and e2e tests (~100 files)

Key entry point files include main.go, cmd/web.go, and web_src/index.ts.

The architecture pattern appears to be a traditional MVC (Model-View-Controller) pattern, with some elements of a service layer. The project has a complex architecture with many interconnected components.

Notable conventions include the use of Go modules for dependency management, pnpm for frontend dependency management, and a comprehensive testing framework. The project also includes a CODE_OF_CONDUCT.md file and a CONTRIBUTING.md file, indicating a commitment to community involvement and open-source development. The project uses a variety of linters and formatters, including golangci-lint and eslint, to maintain code quality.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | Go modules and pnpm | 1 _(auto)_ |
| Q2 | Go HTTP router | Objective | Go Chi (github.com/go-chi/chi/v5) | 3 _(auto)_ |
| Q3 | Frontend framework | Objective | Vue.js and Vite | 3 _(auto)_ |
| Q4 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | main.go | 3 _(auto)_ |
| Q6 | Routes location | Navigational | routers directory | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Migration count | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | Not in profile. | 0 _(auto)_ |
| Q10 | Architectural layers | Inferential | The profile mentions an MVC pattern with a service layer. So, a possible order is: Controller (routers) -> Service (services) -> Model (models). | 0 _(auto)_ |
| Q11 | External integrations | Domain | AWS and Azure | 1 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | Not directly stated, but the project uses linters and formatters like golangci-lint and eslint, implying that running these tools is likely required or recommended before committing code, though the exact command is not specified. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Go modules and pnpm

Q2
Go Chi (github.com/go-chi/chi/v5)

Q3
Vue.js and Vite

Q4
Not in profile.

Q5
main.go

Q6
routers directory

Q7
Not in profile.

Q8
Not in profile.

Q9
Not in profile.

Q10
The profile mentions an MVC pattern with a service layer. So, a possible order is: Controller (routers) -> Service (services) -> Model (models).

Q11
AWS and Azure

Q12
Not directly stated, but the project uses linters and formatters like golangci-lint and eslint, implying that running these tools is likely required or recommended before committing code, though the exact command is not specified.
```
