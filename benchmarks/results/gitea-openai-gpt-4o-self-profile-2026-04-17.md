# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** gitea
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 5585 paths, 4 anchor files, 11 doc files
**Call 1 — profile build:** 82918 prompt tokens → 551 completion tokens (profile)
**Call 2 — questions:** 799 prompt tokens + 118 completion tokens
**Total tokens consumed:** 84386

**CHODE equivalent:** ~507 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 164x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 13/36 (36% of auto-scorable)
**Stump questions (9):** 5/27 (19%)

---

## AI-Built Profile

```
The repository is primarily written in Go (version 1.26.2) and TypeScript, with additional use of JavaScript and CSS. It leverages the Go programming language for backend development and uses Node.js (version 22.18.0 or higher) with pnpm (version 10.33.0) for managing frontend dependencies. The project employs a monorepo structure, integrating various components such as a web application, CLI tools, and libraries.

Key frameworks and libraries include the Go standard library, Chi for HTTP routing, and various Go modules for functionalities like authentication, session management, and database interaction. The frontend utilizes Vue.js for building user interfaces, along with Codemirror for code editing capabilities. The project also uses Tailwind CSS for styling and Chart.js for data visualization.

Testing is conducted using Vitest for JavaScript/TypeScript components and Go's built-in testing framework for Go code. The test commands are likely integrated into the Makefile, which includes targets for building, testing, and linting the codebase.

The primary purpose of this project is to provide a self-hosted Git service, aiming to be an easy, fast, and painless solution for setting up a Git server. It is a fork of Gogs and has evolved significantly since its inception.

Top directories include:
- `cmd/` (entry point for the application, containing main.go and related files)
- `models/` (data models and database interactions, ~500 files)
- `routers/` (HTTP route handlers, ~300 files)
- `services/` (business logic and service layer, ~200 files)
- `modules/` (utility functions and shared components, ~400 files)
- `web_src/` (frontend source code, including JavaScript, TypeScript, and CSS, ~300 files)
- `templates/` (HTML templates for server-side rendering, ~200 files)

Key entry point files include `main.go` in the `cmd/` directory, which initializes and starts the web server. The architecture follows a typical MVC pattern, with models, views (templates), and controllers (routers).

Notable conventions include the use of `make` for build automation, with targets like `make build`, `make test`, and `make lint`. The project also emphasizes code quality and style, using tools like ESLint and Stylelint for linting JavaScript and CSS, respectively. Additionally, contributions are guided by a detailed contributing guide, emphasizing the importance of discussing design before implementation and adhering to a code of conduct.

Overall, this repository is a comprehensive, open-source project designed to facilitate the deployment and management of a Git service, with a strong focus on community contributions and code quality.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | All package managers | Objective | pnpm | 1 _(auto)_ |
| Q2 | Go HTTP router | Objective | Chi | 3 _(auto)_ |
| Q3 | Frontend framework | Objective | Vue.js | 2 _(auto)_ |
| Q4 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `main.go` in the `cmd/` directory | 3 _(auto)_ |
| Q6 | Routes location | Navigational | `routers/` directory | 3 _(auto)_ |
| Q7 | Middleware location | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Migration count | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Auth methods | Inferential | Not in profile. | 0 _(auto)_ |
| Q10 | Architectural layers | Inferential | Entry point (`cmd/`), Controllers (`routers/`), Services (`services/`), Models (`models/`) | 1 _(auto)_ |
| Q11 | External integrations | Domain | Not in profile. | 0 _(auto)_ |
| Q12 | Pre-commit requirement | Domain | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1  
pnpm  

Q2  
Chi  

Q3  
Vue.js  

Q4  
Not in profile.  

Q5  
`main.go` in the `cmd/` directory  

Q6  
`routers/` directory  

Q7  
Not in profile.  

Q8  
Not in profile.  

Q9  
Not in profile.  

Q10  
Entry point (`cmd/`), Controllers (`routers/`), Services (`services/`), Models (`models/`)  

Q11  
Not in profile.  

Q12  
Not in profile.  
```
