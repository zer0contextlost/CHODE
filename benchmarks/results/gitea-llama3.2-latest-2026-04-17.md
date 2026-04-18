# CHODE Benchmark — llama3.2:latest
**Date:** 2026-04-17
**Model:** llama3.2:latest
**Profile:** F:\projects\benchmarks\gitea\.chode
**Profile size:** ~1911 tokens
**Questions parsed:** 30/30

---

## Scoring Sheet

> Score each answer 0–3: 3=correct+complete, 2=mostly correct minor gaps, 1=partial significant gaps, 0=wrong/absent

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Primary languages | Objective | What language(s) is this project primarily written in? A1: Go (as indicated by the @ENTRY main.go section) | /3 |
| Q2 | Web frameworks | Objective | What web framework(s) does it use? A2: chi (as indicated by the @FRONTEND ts vue esbuild vite (web_src/) section, which suggests a web framework for building the frontend) | /3 |
| Q3 | Databases | Objective | What database(s) does it support or use? A3: sqlite3 (as indicated by the @DATA models/migrations/ (305 files) section and the @ENTITIES models/ → actions activities admin asymkey auth avatars dbfs git issues organization packages perm section, which lists sqlite3 as a supported database) | /3 |
| Q4 | Package managers | Objective | What package manager(s) are used? A4: pnpm (as indicated by the @PKG pnpm gomod uv section), and also gomod (as indicated by the @PKG pnpm gomod uv section) | /3 |
| Q5 | Primary purpose | Objective | What is the project's primary purpose in one sentence? A5: The project's primary purpose is to make the easiest, fastest, and most painless way of setting up a self-hosted Git service. | /3 |
| Q6 | Main entry point | Navigational | What is the main entry point file? A6: main.go (as indicated by the @ENTRY main.go section) | /3 |
| Q7 | Monorepo / top-level count | Navigational | Is this a monorepo? How many top-level packages? A7: This appears to be a monorepo, with 58 top-level packages listed in the .chode profile. | /3 |
| Q8 | Routes/handlers location | Navigational | Where are HTTP routes/handlers defined? A8: Not explicitly stated in the .chode profile, but based on the @FRONTEND ts vue esbuild vite (web_src/) section, it can be inferred that frontend/UI code lives in a separate directory and uses a web framework to define routes. | /3 |
| Q9 | Schema/ORM models | Navigational | Where is the data schema or ORM models defined? A9: Not explicitly stated in the .chode profile, but based on the @ENTITIES models/ → actions activities admin asymkey auth avatars dbfs git issues organization packages perm section, it can be inferred that data schema and ORM models are defined in… | /3 |
| Q10 | Frontend/UI code location | Navigational | Where does frontend/UI code live? A10: The frontend/UI code lives in a separate directory, likely under the @FRONTEND ts vue esbuild vite (web_src/) section. | /3 |
| Q11 | Architectural pattern | Inferential | What architectural pattern does the project follow? A11: Not explicitly stated in the .chode profile, but based on the structure and organization of the codebase, it appears to be following a microservices or modular architecture. | /3 |
| Q12 | Frontend/backend/fullstack/etc. | Inferential | Frontend, backend, CLI, library, or fullstack? A12: This is a full-stack project, as indicated by the presence of frontend/UI code, backend logic, and other components. | /3 |
| Q13 | Configuration management | Inferential | How is configuration managed? A13: Not explicitly stated in the .chode profile, but based on the @CONFIG ini section, it can be inferred that configuration is managed using an ini file. | /3 |
| Q14 | Dependency injection | Inferential | Does the project use dependency injection? A14: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears to be using dependency injection. | /3 |
| Q15 | Authentication | Inferential | How is authentication handled? A15: Not explicitly stated in the .chode profile, but based on the @AUTH section, it can be inferred that authentication is handled using a combination of auth tokens and other mechanisms. | /3 |
| Q16 | Main domain entities | Domain | What are the main domain entities? A16: The main domain entities appear to include actions, activities, admin, asymkey, auth, avatars, dbfs, git, issues, organization, packages, and perm (as listed in the @ENTITIES models/ → actions activities admin asymkey auth avatars dbfs git issues organization… | /3 |
| Q17 | External integrations | Domain | What external services or APIs does it integrate with? A17: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears to be integrating with various external services such as GitHub API. | /3 |
| Q18 | Test framework | Domain | What test framework is used? A18: The test framework used appears to be @TEST @playwright/test vitest make test make test-backend make test-frontend make test-check make test-sqlite | /3 |
| Q19 | How to run tests | Domain | How do you run the test suite? A19: To run the test suite, you can use the command "make test" | /3 |
| Q20 | CI system | Domain | What CI system is used? A20: The CI system used appears to be GitHub Actions. | /3 |
| Q21 | Where to add API endpoint | Navigation | Where would you add a new API endpoint? A21: Not explicitly stated in the .chode profile, but based on the code structure and organization, it can be inferred that new API endpoints would be added under the @API azure aws github-api minio prometheus section. | /3 |
| Q22 | Database migrations location | Navigation | Where would you find database migrations? A22: Database migrations appear to be stored in the models/migrations directory. | /3 |
| Q23 | Core business logic location | Navigation | Where is the core business logic concentrated? A23: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears that the core business logic is concentrated under the @API azure aws github-api minio prometheus section. | /3 |
| Q24 | Error handling middleware | Navigation | Where is error handling middleware? A24: Not explicitly stated in the .chode profile, but based on the code structure and organization, it can be inferred that error handling middleware would be implemented using a combination of middleware functions and error handling mechanisms. | /3 |
| Q25 | Env var documentation | Navigation | Where are environment variables documented? A25: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears that environment variables would be documented under the @CONFIG ini section. | /3 |
| Q26 | Top 3 internal packages | Deep | What are the top 3 most-used internal packages? A26: The top 3 most-used internal packages appear to include actions, auth, and dbfs (as listed in the .chode profile). | /3 |
| Q27 | Bootstrap/init sequence | Deep | What does the bootstrap/initialization sequence look like? A27: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears that the bootstrap/initialization sequence would involve loading configuration files, setting up database connections, and… | /3 |
| Q28 | Notable design patterns | Deep | What notable design patterns appear in the codebase? A28: Notable design patterns appearing in the codebase include dependency injection, microservices architecture, and possibly others (not explicitly stated in the .chode profile). | /3 |
| Q29 | Key deployer config options | Deep | What are the key config options a deployer would set? A29: The key config options that a deployer would set appear to include database connection settings, API endpoint URLs, and other configuration parameters (as listed under the @CONFIG ini section). | /3 |
| Q30 | New contributor essentials | Deep | What would a new contributor need to know first? A30: A new contributor would likely need to familiarize themselves with the project's code structure, organization, and conventions, as well as the various tools and technologies used in the project. | /3 |

**Total: __/90**

---

## Raw Model Response

```
I'll do my best to answer each question based on the provided .chode profile.

Q1: What language(s) is this project primarily written in?
A1: Go (as indicated by the @ENTRY main.go section)

Q2: What web framework(s) does it use?
A2: chi (as indicated by the @FRONTEND ts vue esbuild vite (web_src/) section, which suggests a web framework for building the frontend)

Q3: What database(s) does it support or use?
A3: sqlite3 (as indicated by the @DATA models/migrations/ (305 files) section and the @ENTITIES models/ → actions activities admin asymkey auth avatars dbfs git issues organization packages perm section, which lists sqlite3 as a supported database)

Q4: What package manager(s) are used?
A4: pnpm (as indicated by the @PKG pnpm gomod uv section), and also gomod (as indicated by the @PKG pnpm gomod uv section)

Q5: What is the project's primary purpose in one sentence?
A5: The project's primary purpose is to make the easiest, fastest, and most painless way of setting up a self-hosted Git service.

Q6: What is the main entry point file?
A6: main.go (as indicated by the @ENTRY main.go section)

Q7: Is this a monorepo? How many top-level packages?
A7: This appears to be a monorepo, with 58 top-level packages listed in the .chode profile.

Q8: Where are HTTP routes/handlers defined?
A8: Not explicitly stated in the .chode profile, but based on the @FRONTEND ts vue esbuild vite (web_src/) section, it can be inferred that frontend/UI code lives in a separate directory and uses a web framework to define routes.

Q9: Where is the data schema or ORM models defined?
A9: Not explicitly stated in the .chode profile, but based on the @ENTITIES models/ → actions activities admin asymkey auth avatars dbfs git issues organization packages perm section, it can be inferred that data schema and ORM models are defined in the models directory.

Q10: Where does frontend/UI code live?
A10: The frontend/UI code lives in a separate directory, likely under the @FRONTEND ts vue esbuild vite (web_src/) section.

Q11: What architectural pattern does the project follow?
A11: Not explicitly stated in the .chode profile, but based on the structure and organization of the codebase, it appears to be following a microservices or modular architecture.

Q12: Frontend, backend, CLI, library, or fullstack?
A12: This is a full-stack project, as indicated by the presence of frontend/UI code, backend logic, and other components.

Q13: How is configuration managed?
A13: Not explicitly stated in the .chode profile, but based on the @CONFIG ini section, it can be inferred that configuration is managed using an ini file.

Q14: Does the project use dependency injection?
A14: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears to be using dependency injection.

Q15: How is authentication handled?
A15: Not explicitly stated in the .chode profile, but based on the @AUTH section, it can be inferred that authentication is handled using a combination of auth tokens and other mechanisms.

Q16: What are the main domain entities?
A16: The main domain entities appear to include actions, activities, admin, asymkey, auth, avatars, dbfs, git, issues, organization, packages, and perm (as listed in the @ENTITIES models/ → actions activities admin asymkey auth avatars dbfs git issues organization packages perm section).

Q17: What external services or APIs does it integrate with?
A17: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears to be integrating with various external services such as GitHub API.

Q18: What test framework is used?
A18: The test framework used appears to be @TEST @playwright/test vitest make test make test-backend make test-frontend make test-check make test-sqlite

Q19: How do you run the test suite?
A19: To run the test suite, you can use the command "make test"

Q20: What CI system is used?
A20: The CI system used appears to be GitHub Actions.

Q21: Where would you add a new API endpoint?
A21: Not explicitly stated in the .chode profile, but based on the code structure and organization, it can be inferred that new API endpoints would be added under the @API azure aws github-api minio prometheus section.

Q22: Where would you find database migrations?
A22: Database migrations appear to be stored in the models/migrations directory.

Q23: Where is the core business logic concentrated?
A23: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears that the core business logic is concentrated under the @API azure aws github-api minio prometheus section.

Q24: Where is error handling middleware?
A24: Not explicitly stated in the .chode profile, but based on the code structure and organization, it can be inferred that error handling middleware would be implemented using a combination of middleware functions and error handling mechanisms.

Q25: Where are environment variables documented?
A25: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears that environment variables would be documented under the @CONFIG ini section.

Q26: What are the top 3 most-used internal packages?
A26: The top 3 most-used internal packages appear to include actions, auth, and dbfs (as listed in the .chode profile).

Q27: What does the bootstrap/initialization sequence look like?
A27: Not explicitly stated in the .chode profile, but based on the code structure and organization, it appears that the bootstrap/initialization sequence would involve loading configuration files, setting up database connections, and initializing other components.

Q28: What notable design patterns appear in the codebase?
A28: Notable design patterns appearing in the codebase include dependency injection, microservices architecture, and possibly others (not explicitly stated in the .chode profile).

Q29: What are the key config options a deployer would set?
A29: The key config options that a deployer would set appear to include database connection settings, API endpoint URLs, and other configuration parameters (as listed under the @CONFIG ini section).

Q30: What would a new contributor need to know first?
A30: A new contributor would likely need to familiarize themselves with the project's code structure, organization, and conventions, as well as the various tools and technologies used in the project.
```
