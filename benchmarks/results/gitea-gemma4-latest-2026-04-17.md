# CHODE Benchmark — gemma4:latest
**Date:** 2026-04-17
**Model:** gemma4:latest
**Profile:** F:\projects\benchmarks\gitea\.chode
**Profile size:** ~1911 tokens
**Questions parsed:** 30/30

---

## Scoring Sheet

> Score each answer 0–3: 3=correct+complete, 2=mostly correct minor gaps, 1=partial significant gaps, 0=wrong/absent

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Primary languages | Objective | What language(s) is this project primarily written in?** Go. *Citation: CONTEXT*  ** | /3 |
| Q2 | Web frameworks | Objective | What web framework(s) does it use?** Not in profile. *Citation: Not in profile.*  ** | /3 |
| Q3 | Databases | Objective | What database(s) does it support or use?** MySQL, PostgreSQL (via `pq`), SQLite3, and MSSQL. *Citation: DNA*  ** | /3 |
| Q4 | Package managers | Objective | What package manager(s) are used?** pnpm, gomod, and uv. *Citation: DNA*  ** | /3 |
| Q5 | Primary purpose | Objective | What is the project's primary purpose in one sentence?** To make the easiest, fastest, and most painless way of setting up a self-hosted Git service. *Citation: CONTEXT*  ** | /3 |
| Q6 | Main entry point | Navigational | What is the main entry point file?** main.go. *Citation: DNA*  ** | /3 |
| Q7 | Monorepo / top-level count | Navigational | Is this a monorepo? How many top-level packages?** Yes, it appears to be a monorepo structure. There are at least 14 visible top-level packages/directories (including `ass/`, `cmd/`, `contrib/`, `docker/`, `docs/`, `mdl/`, `mod/`, `op/`, `pu/`, `ro/`, `svc/`, `snap/`, `te/`, and the `(+58 more)`).… | /3 |
| Q8 | Routes/handlers location | Navigational | Where are HTTP routes/handlers defined?** The `ro/` directory (routers), specifically files like `ro/install/routes.go`. *Citation: TREE (ro/) and LEGEND (ro:routers)*  ** | /3 |
| Q9 | Schema/ORM models | Navigational | Where is the data schema or ORM models defined?** The `models/` directory, specifically the `models/migrations/` subdirectory. *Citation: DNA*  ** | /3 |
| Q10 | Frontend/UI code location | Navigational | Where does frontend/UI code live?** The `web_src/` directory. *Citation: DNA*  ** | /3 |
| Q11 | Architectural pattern | Inferential | What architectural pattern does the project follow?** Not in profile. *Citation: Not in profile.*  ** | /3 |
| Q12 | Frontend/backend/fullstack/etc. | Inferential | Frontend, backend, CLI, library, or fullstack?** Fullstack (it contains frontend code in `web_src/`, backend logic in `go` files, and CLI components in `cmd/`). *Citation: DNA (web_src/) and TREE (cmd/)*  ** | /3 |
| Q13 | Configuration management | Inferential | How is configuration managed?** Using INI format. *Citation: DNA*  ** | /3 |
| Q14 | Dependency injection | Inferential | Does the project use dependency injection?** Not in profile. *Citation: Not in profile.*  ** | /3 |
| Q15 | Authentication | Inferential | How is authentication handled?** It supports multiple methods including HTTP authentication, OpenID, PAM, password, and WebAuthn. *Citation: TREE (mod/au/) and DNA*  ** | /3 |
| Q16 | Main domain entities | Domain | What are the main domain entities?** Actions, activities, admin, asymmetric keys (asymkey), authentication (auth), avatars, database files (dbfs), git, issues, organization, packages, and permissions (perm). *Citation: DNA*  ** | /3 |
| Q17 | External integrations | Domain | What external services or APIs does it integrate with?** Azure, AWS, GitHub API, Minio, and Prometheus. *Citation: DNA*  ** | /3 |
| Q18 | Test framework | Domain | What test framework is used?** Playwright, Vitest, and standard Go testing (`make test`). *Citation: DNA*  ** | /3 |
| Q19 | How to run tests | Domain | How do you run the test suite?** Using various `make` targets, such as `make test`, `make test-backend`, `make test-frontend`, `make test-check`, and `make test-sqlite`. *Citation: DNA*  ** | /3 |
| Q20 | CI system | Domain | What CI system is used?** GitHub Actions. *Citation: DNA*  ** | /3 |
| Q21 | Where to add API endpoint | Navigation | Where would you add a new API endpoint?** The `ro/` directory (routers). *Citation: TREE (ro/) and LEGEND (ro:routers)*  ** | /3 |
| Q22 | Database migrations location | Navigation | Where would you find database migrations?** The `models/migrations/` directory. *Citation: DNA*  ** | /3 |
| Q23 | Core business logic location | Navigation | Where is the core business logic concentrated?** The `mod/` directory (modules) and the `svc/` directory (services). *Citation: TREE (mod/) and TREE (svc/)*  ** | /3 |
| Q24 | Error handling middleware | Navigation | Where is error handling middleware?** Not in profile. *Citation: Not in profile.*  ** | /3 |
| Q25 | Env var documentation | Navigation | Where are environment variables documented?** Not in profile. *Citation: Not in profile.*  ** | /3 |
| Q26 | Top 3 internal packages | Deep | What are the top 3 most-used internal packages?** The `mod/` directory, the `ro/` directory, and the `svc/` directory. *Citation: TREE (mod/), TREE (ro/), and TREE (svc/)*  ** | /3 |
| Q27 | Bootstrap/init sequence | Deep | What does the bootstrap/initialization sequence look like?** The process involves running commands from the `cmd/` directory and potentially executing installation logic found in `ro/install/install.go`. *Citation: TREE (cmd/) and TREE (ro/install/)*  ** | /3 |
| Q28 | Notable design patterns | Deep | What notable design patterns appear in the codebase?** Not in profile. *Citation: Not in profile.*  ** | /3 |
| Q29 | Key deployer config options | Deep | What are the key config options a deployer would set?** Deployment settings are managed via the `docker/` directory, specifically using `manifest.rootless.tmpl` and `manifest.tmpl`. *Citation: TREE (docker/)*  ** | /3 |
| Q30 | New contributor essentials | Deep | What would a new contributor need to know first?** They must run `make fmt` before committing to conform to the project's styleguide. *Citation: CONVENTIONS* | /3 |

**Total: __/90**

---

## Raw Model Response

```
**Q1: What language(s) is this project primarily written in?**
Go.
*Citation: CONTEXT*

**Q2: What web framework(s) does it use?**
Not in profile.
*Citation: Not in profile.*

**Q3: What database(s) does it support or use?**
MySQL, PostgreSQL (via `pq`), SQLite3, and MSSQL.
*Citation: DNA*

**Q4: What package manager(s) are used?**
pnpm, gomod, and uv.
*Citation: DNA*

**Q5: What is the project's primary purpose in one sentence?**
To make the easiest, fastest, and most painless way of setting up a self-hosted Git service.
*Citation: CONTEXT*

**Q6: What is the main entry point file?**
main.go.
*Citation: DNA*

**Q7: Is this a monorepo? How many top-level packages?**
Yes, it appears to be a monorepo structure. There are at least 14 visible top-level packages/directories (including `ass/`, `cmd/`, `contrib/`, `docker/`, `docs/`, `mdl/`, `mod/`, `op/`, `pu/`, `ro/`, `svc/`, `snap/`, `te/`, and the `(+58 more)`).
*Citation: TREE*

**Q8: Where are HTTP routes/handlers defined?**
The `ro/` directory (routers), specifically files like `ro/install/routes.go`.
*Citation: TREE (ro/) and LEGEND (ro:routers)*

**Q9: Where is the data schema or ORM models defined?**
The `models/` directory, specifically the `models/migrations/` subdirectory.
*Citation: DNA*

**Q10: Where does frontend/UI code live?**
The `web_src/` directory.
*Citation: DNA*

**Q11: What architectural pattern does the project follow?**
Not in profile.
*Citation: Not in profile.*

**Q12: Frontend, backend, CLI, library, or fullstack?**
Fullstack (it contains frontend code in `web_src/`, backend logic in `go` files, and CLI components in `cmd/`).
*Citation: DNA (web_src/) and TREE (cmd/)*

**Q13: How is configuration managed?**
Using INI format.
*Citation: DNA*

**Q14: Does the project use dependency injection?**
Not in profile.
*Citation: Not in profile.*

**Q15: How is authentication handled?**
It supports multiple methods including HTTP authentication, OpenID, PAM, password, and WebAuthn.
*Citation: TREE (mod/au/) and DNA*

**Q16: What are the main domain entities?**
Actions, activities, admin, asymmetric keys (asymkey), authentication (auth), avatars, database files (dbfs), git, issues, organization, packages, and permissions (perm).
*Citation: DNA*

**Q17: What external services or APIs does it integrate with?**
Azure, AWS, GitHub API, Minio, and Prometheus.
*Citation: DNA*

**Q18: What test framework is used?**
Playwright, Vitest, and standard Go testing (`make test`).
*Citation: DNA*

**Q19: How do you run the test suite?**
Using various `make` targets, such as `make test`, `make test-backend`, `make test-frontend`, `make test-check`, and `make test-sqlite`.
*Citation: DNA*

**Q20: What CI system is used?**
GitHub Actions.
*Citation: DNA*

**Q21: Where would you add a new API endpoint?**
The `ro/` directory (routers).
*Citation: TREE (ro/) and LEGEND (ro:routers)*

**Q22: Where would you find database migrations?**
The `models/migrations/` directory.
*Citation: DNA*

**Q23: Where is the core business logic concentrated?**
The `mod/` directory (modules) and the `svc/` directory (services).
*Citation: TREE (mod/) and TREE (svc/)*

**Q24: Where is error handling middleware?**
Not in profile.
*Citation: Not in profile.*

**Q25: Where are environment variables documented?**
Not in profile.
*Citation: Not in profile.*

**Q26: What are the top 3 most-used internal packages?**
The `mod/` directory, the `ro/` directory, and the `svc/` directory.
*Citation: TREE (mod/), TREE (ro/), and TREE (svc/)*

**Q27: What does the bootstrap/initialization sequence look like?**
The process involves running commands from the `cmd/` directory and potentially executing installation logic found in `ro/install/install.go`.
*Citation: TREE (cmd/) and TREE (ro/install/)*

**Q28: What notable design patterns appear in the codebase?**
Not in profile.
*Citation: Not in profile.*

**Q29: What are the key config options a deployer would set?**
Deployment settings are managed via the `docker/` directory, specifically using `manifest.rootless.tmpl` and `manifest.tmpl`.
*Citation: TREE (docker/)*

**Q30: What would a new contributor need to know first?**
They must run `make fmt` before committing to conform to the project's styleguide.
*Citation: CONVENTIONS*
```
