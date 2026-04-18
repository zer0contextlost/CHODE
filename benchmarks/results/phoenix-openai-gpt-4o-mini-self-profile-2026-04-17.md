# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** phoenix
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 478 paths, 4 anchor files, 10 doc files
**Call 1 — profile build:** 14726 prompt tokens → 545 completion tokens (profile)
**Call 2 — questions:** 797 prompt tokens + 127 completion tokens
**Total tokens consumed:** 16195

**CHODE equivalent:** ~306 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 48x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 15/36 (42% of auto-scorable)
**Stump questions (7):** 6/21 (29%)

---

## AI-Built Profile

```
This repository primarily uses Elixir as its programming language, specifically version 1.15, and is built around the Phoenix framework, which is a web development framework for Elixir. The repository also includes JavaScript files, particularly for the Phoenix.js client, which is designed to work with the Phoenix framework.

The key libraries in this repository include:
- Phoenix (the main framework)
- Ecto (for database interactions)
- Plug (for building web applications)
- Phoenix LiveView (for real-time user interfaces)
- Various testing libraries such as ExUnit and Jest for JavaScript testing.

The package managers used are Mix for Elixir dependencies and npm for JavaScript dependencies. The test frameworks include ExUnit for Elixir tests and Jest for JavaScript tests. The primary test commands are `mix test` for Elixir tests and `npm test` for JavaScript tests.

This project is a monorepo that serves as both a library and a CLI tool, providing a project generator (`phx.new`) for creating new Phoenix applications. Its primary purpose is to facilitate the development of web applications using the Phoenix framework, offering a robust set of tools and libraries for developers.

The top directories in the repository include:
- `lib/` (approximately 100 files): Contains the core library code for the Phoenix framework.
- `installer/` (approximately 50 files): Contains the project generator and related files.
- `assets/` (approximately 50 files): Contains JavaScript and CSS assets for the Phoenix framework.
- `test/` (approximately 100 files): Contains tests for both the Elixir and JavaScript components.
- `guides/` (approximately 50 files): Contains documentation and guides for using the Phoenix framework.

Key entry point files include:
- `mix.exs`: The main configuration file for the Elixir project, defining dependencies and project settings.
- `README.md`: Provides an overview of the project, installation instructions, and usage guidelines.
- `installer/README.md`: Specific instructions for using the project generator.

The architecture pattern is primarily MVC (Model-View-Controller), which is common in web frameworks. The repository follows conventions such as using Mix for dependency management and project configuration, and it employs a modular structure with clear separation of concerns.

Notable conventions include the use of Ecto for database interactions, which helps prevent SQL injection vulnerabilities by using parameterized queries. The repository also emphasizes security best practices, as outlined in the `guides/security.md` file, and includes a Code of Conduct to foster a welcoming community for contributors. Additionally, the project has a structured approach to versioning and release management, as detailed in the `RELEASE.md` file.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Elixir | 3 _(auto)_ |
| Q2 | Database library | Objective | Ecto | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | Plug | 3 _(auto)_ |
| Q4 | Package managers | Objective | Mix, npm | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | ExUnit for Elixir tests, Jest for JavaScript tests; commands are `mix test` for Elixir tests and `npm test` for JavaScript tests. | 3 _(auto)_ |
| Q6 | i18n library | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Ecto association rule | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Ecto field type rule | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Repo adapter | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q11 | Largest directory | Navigational | lib/ | 0 _(auto)_ |
| Q12 | Project type | Inferential | This project serves as both a library and a CLI tool. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:  
Elixir

Q2:  
Ecto

Q3:  
Plug

Q4:  
Mix, npm

Q5:  
ExUnit for Elixir tests, Jest for JavaScript tests; commands are `mix test` for Elixir tests and `npm test` for JavaScript tests.

Q6:  
Not in profile.

Q7:  
Not in profile.

Q8:  
Not in profile.

Q9:  
Not in profile.

Q10:  
Not in profile.

Q11:  
lib/

Q12:  
This project serves as both a library and a CLI tool.
```
