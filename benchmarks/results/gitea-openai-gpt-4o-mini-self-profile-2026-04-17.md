# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** gitea
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 5585 paths, 4 anchor files, 11 doc files
**Call 1 — profile build:** 82918 prompt tokens → 543 completion tokens (profile)
**Call 2 — questions:** 790 prompt tokens + 111 completion tokens
**Total tokens consumed:** 84362

**CHODE equivalent:** ~507 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 164x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 10/36 (28% of auto-scorable)
**Stump questions (9):** 1/27 (4%)

---

## AI-Built Profile

```
This repository is primarily written in Go, with a significant portion of the frontend developed in TypeScript. The main language version is Go 1.26.2, as specified in the `go.mod` file. The project utilizes several frameworks and libraries, including Gitea's own SDK, various Go modules for web and API functionalities, and frontend libraries such as Vue.js and Codemirror for UI components.

The package managers used in this repository are Go modules for the backend and pnpm for the frontend. The `go.mod` and `package.json` files detail the dependencies for each part of the project. Key libraries include `code.gitea.io/sdk/gitea`, `@vitejs/plugin-vue`, and `@codemirror` packages for the frontend.

For testing, the repository employs the `go test` command for Go code and `@playwright/test` for end-to-end testing in the frontend. The test commands can be executed using `make` targets, such as `make lint-go` for Go linting and `make lint-js` for TypeScript linting.

This project is a self-hosted Git service, designed to provide an easy and efficient way to manage Git repositories. It is structured as a monorepo, containing both backend and frontend components, which allows for streamlined development and deployment processes.

The top-level directories include:
- `cmd/` (approximately 50 files): Contains the main application entry points and command definitions.
- `models/` (approximately 500 files): Houses the data models and business logic.
- `routers/` (approximately 200 files): Contains the routing logic for API and web requests.
- `web_src/` (approximately 300 files): Contains the frontend source code, including components and styles.
- `tests/` (approximately 200 files): Contains various test cases for both integration and unit tests.

Key entry point files include `main.go` for the backend application and `index.ts` for the frontend. The architecture pattern is a combination of MVC (Model-View-Controller) for the backend and component-based architecture for the frontend, leveraging Vue.js.

Notable conventions include the use of `make` for build and test commands, adherence to a strict code style as outlined in `AGENTS.md`, and the requirement to run `make tidy` after any changes to `go.mod`. Additionally, contributors are expected to follow a specific commit message format and maintain a clear separation of concerns in their code.

Overall, this repository is a comprehensive and well-structured project aimed at providing a robust self-hosted Git service, with a focus on maintainability and ease of use for developers.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | Go modules for the backend and pnpm for the frontend. | 1 _(auto)_ |
| Q2 | Go HTTP router | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | Frontend framework | Objective | Vue.js and Vite. | 3 _(auto)_ |
| Q4 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | main.go. | 3 _(auto)_ |
| Q6 | Routes location | Navigational | routers/. | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Migration count | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | Not in profile. | 0 _(auto)_ |
| Q10 | Architectural layers | Inferential | Entry point -> Controllers (routers) -> Models -> Data layer. | 0 _(auto)_ |
| Q11 | External integrations | Domain | Not in profile. | 0 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | make tidy. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:  
Go modules for the backend and pnpm for the frontend.

Q2:  
Not in profile.

Q3:  
Vue.js and Vite.

Q4:  
Not in profile.

Q5:  
main.go.

Q6:  
routers/.

Q7:  
Not in profile.

Q8:  
Not in profile.

Q9:  
Not in profile.

Q10:  
Entry point -> Controllers (routers) -> Models -> Data layer.

Q11:  
Not in profile.

Q12:  
make tidy.
```
