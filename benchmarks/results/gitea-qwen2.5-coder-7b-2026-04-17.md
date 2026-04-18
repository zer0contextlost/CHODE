# CHODE Benchmark — qwen2.5-coder:7b
**Date:** 2026-04-17
**Model:** qwen2.5-coder:7b
**Provider:** ollama
**Repo:** gitea
**Profile size:** ~1970 tokens
**Questions parsed:** 30/30
**Auto-scored:** 29/30 questions → 60/87 (69% of auto-scorable)
**Manual scoring needed:** 1 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Primary languages | Objective | Go | 2 _(auto)_ |
| Q2 | Web frameworks | Objective | Chi, Vue 3 | 3 _(auto)_ |
| Q3 | Databases | Objective | MySQL, SQLite3, MSSQL | 3 _(auto)_ |
| Q4 | Package managers | Objective | pnpm, gomod, uv | 3 _(auto)_ |
| Q5 | Primary purpose | Objective | The project's primary purpose is to make the easiest, fastest, and most painless way of setting up a self-hosted Git service. | 3 _(auto)_ |
| Q6 | Main entry point | Navigational | main.go | 3 _(auto)_ |
| Q7 | Monorepo / top-level count | Navigational | Yes, it is a monorepo with 968 top-level packages. | __ _(manual)_ |
| Q8 | Routes/handlers location | Navigational | HTTP routes/handlers are defined in the routers/ directory. | 2 _(auto)_ |
| Q9 | Schema/ORM models | Navigational | Data schema or ORM models are defined in the models/migrations/ directory. | 3 _(auto)_ |
| Q10 | Frontend/UI code location | Navigational | Frontend/UI code lives in the web_src/ directory. | 2 _(auto)_ |
| Q11 | Architectural pattern | Inferential | Layered (cmd→routes→svc→mdl) | 3 _(auto)_ |
| Q12 | Project type | Inferential | Fullstack | 2 _(auto)_ |
| Q13 | Configuration management | Inferential | Configuration is managed using INI files. | 3 _(auto)_ |
| Q14 | Dependency injection | Inferential | No, the project does not use dependency injection. | 3 _(auto)_ |
| Q15 | Authentication | Inferential | Authentication is handled using JWT and OAuth. | 1 _(auto)_ |
| Q16 | Main domain entities | Domain | Main domain entities include actions, activities, admin, asymkey, auth, avatars, dbfs, git, issues, organization, packages, perm. | 3 _(auto)_ |
| Q17 | External integrations | Domain | The project integrates with external services or APIs such as Azure, AWS, GitHub API, MinIO, Prometheus. | 3 _(auto)_ |
| Q18 | Test framework | Domain | The test framework used is vitest and @playwright/test. | 2 _(auto)_ |
| Q19 | How to run tests | Domain | To run the test suite, you would use `make test`. | 2 _(auto)_ |
| Q20 | CI system | Domain | GitHub Actions is used as the CI system. | 3 _(auto)_ |
| Q21 | Where to add API endpoint | Navigation | A new API endpoint would be added in the routers/ directory. | 2 _(auto)_ |
| Q22 | Migrations location | Navigation | Database migrations are found in the models/migrations/ directory. | 2 _(auto)_ |
| Q23 | Core business logic | Navigation | Core business logic is concentrated in the services/ and mdl/ directories. | 0 _(auto)_ |
| Q24 | Error handling middleware | Navigation | Error handling middleware is not explicitly mentioned, but it's implied to be part of the middleware chain. | 0 _(auto)_ |
| Q25 | Env var documentation | Navigation | Environment variables are not documented within the provided profile. | 3 _(auto)_ |
| Q26 | Top 3 internal packages | Deep | The top 3 most-used internal packages are not explicitly listed in the profile. | 0 _(auto)_ |
| Q27 | Bootstrap/init sequence | Deep | The bootstrap/initialization sequence is not detailed in the provided profile. | 0 _(auto)_ |
| Q28 | Notable design patterns | Deep | Notable design patterns include repository middleware-chain and strategy(auth). | 1 _(auto)_ |
| Q29 | Key deployer config options | Deep | Key config options a deployer would set include database connection strings, server port, authentication methods, etc. | 3 _(auto)_ |
| Q30 | New contributor essentials | Deep | A new contributor would need to know about Go language, Chi web framework, and the project's layered architecture. | 0 _(auto)_ |

**Total: __/90** _(fill in manual scores above, add to auto total of 60)_

---

## Raw Model Response

```
Q1:
Go

Q2:
Chi, Vue 3

Q3:
MySQL, SQLite3, MSSQL

Q4:
pnpm, gomod, uv

Q5:
The project's primary purpose is to make the easiest, fastest, and most painless way of setting up a self-hosted Git service.

Q6:
main.go

Q7:
Yes, it is a monorepo with 968 top-level packages.

Q8:
HTTP routes/handlers are defined in the routers/ directory.

Q9:
Data schema or ORM models are defined in the models/migrations/ directory.

Q10:
Frontend/UI code lives in the web_src/ directory.

Q11:
Layered (cmd→routes→svc→mdl)

Q12:
Fullstack

Q13:
Configuration is managed using INI files.

Q14:
No, the project does not use dependency injection.

Q15:
Authentication is handled using JWT and OAuth.

Q16:
Main domain entities include actions, activities, admin, asymkey, auth, avatars, dbfs, git, issues, organization, packages, perm.

Q17:
The project integrates with external services or APIs such as Azure, AWS, GitHub API, MinIO, Prometheus.

Q18:
The test framework used is vitest and @playwright/test.

Q19:
To run the test suite, you would use `make test`.

Q20:
GitHub Actions is used as the CI system.

Q21:
A new API endpoint would be added in the routers/ directory.

Q22:
Database migrations are found in the models/migrations/ directory.

Q23:
Core business logic is concentrated in the services/ and mdl/ directories.

Q24:
Error handling middleware is not explicitly mentioned, but it's implied to be part of the middleware chain.

Q25:
Environment variables are not documented within the provided profile.

Q26:
The top 3 most-used internal packages are not explicitly listed in the profile.

Q27:
The bootstrap/initialization sequence is not detailed in the provided profile.

Q28:
Notable design patterns include repository middleware-chain and strategy(auth).

Q29:
Key config options a deployer would set include database connection strings, server port, authentication methods, etc.

Q30:
A new contributor would need to know about Go language, Chi web framework, and the project's layered architecture.
```
