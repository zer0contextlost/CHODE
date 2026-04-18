# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** phoenix
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 478 paths, 4 anchor files, 10 doc files
**Call 1 — profile build:** 19045 prompt tokens → 882 completion tokens (profile)
**Call 2 — questions:** 1157 prompt tokens + 213 completion tokens
**Total tokens consumed:** 21297

**CHODE equivalent:** ~306 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 62x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 22/36 (61% of auto-scorable)
**Stump questions (7):** 11/21 (52%)

---

## AI-Built Profile

```
Primary Language: Elixir (1.15+), JavaScript (ES6+)

Frameworks and Key Libraries:
Elixir: Phoenix (1.8.5), Plug, Ecto, Telemetry, Phoenix.PubSub, Phoenix.Template, Websock_adapter, Plug_cowboy, Bandit, Jason, ExDoc, Ecto_sql, Gettext, Telemetry_poller, Telemetry_metrics, Makeup_elixir, Makeup_eex, Makeup_syntect, Phoenix_html, Mint, Mint_web_socket, Esbuild.
JavaScript: Phoenix.js client library.

Package Managers:
Elixir: Mix (for Elixir dependencies)
JavaScript: npm (for JavaScript dependencies)

Test Frameworks and Test Commands:
Elixir: Mix test (e.g., `mix test`, `mix test --include database:postgresql`)
JavaScript: Jest (e.g., `jest`, `jest --coverage`, `jest --watch`)

Project Type: Framework (Phoenix itself), Library (Phoenix.js client), CLI (phx.new installer), Integration Test Suite. This repository is a monorepo containing the Phoenix framework, its installer, and its JavaScript client.

Primary Purpose: This repository develops and maintains the Phoenix web framework for Elixir, providing tools for building robust, real-time web applications, including a project generator and a JavaScript client for real-time communication.

Top Directories and Approximate File Counts:
- `lib/` (60 files): Core Phoenix framework Elixir code.
- `installer/` (100 files): Phoenix project generator (`phx.new`) Elixir code and templates.
- `assets/js/phoenix/` (10 files): Phoenix JavaScript client library.
- `guides/` (30 files): Documentation guides for Phoenix.
- `priv/templates/` (80 files): Templates used by Phoenix generators (e.g., `phx.gen.auth`, `phx.gen.html`).
- `test/` (100 files): Elixir test suite for the Phoenix framework.
- `integration_test/` (15 files): Integration tests for generated Phoenix projects.

Key Entry Point Files:
- `mix.exs`: Main Phoenix framework Mix project configuration.
- `installer/mix.exs`: Phoenix installer Mix project configuration.
- `package.json`: Phoenix JavaScript client package configuration.
- `lib/phoenix.ex`: Main Phoenix application module.
- `installer/lib/mix/tasks/phx.new.ex`: The core `mix phx.new` task.
- `assets/js/phoenix/index.js`: Main entry point for the Phoenix JavaScript client.

Architecture Pattern:
The Phoenix framework follows a Model-View-Controller (MVC) pattern, extended with real-time capabilities via Channels and LiveView. The repository itself is structured as a monorepo, housing the core framework, its installer, and the JavaScript client. The installer uses a templating system to generate new Phoenix projects.

Notable Conventions or Gotchas:
- Elixir version requirement: `~> 1.15` for both the framework and the installer.
- JavaScript client is built and distributed separately via npm.
- The `phx.new` installer can be run in "dev" mode to link against a local Phoenix checkout for development.
- Extensive use of Mix tasks for code generation (`phx.gen.*`).
- Security guidelines are explicitly documented, particularly regarding RCE and SQL injection, emphasizing safe practices with `binary_to_term` and Ecto queries.
- Documentation is a first-class citizen, with specific conventions for `@doc`, `@moduledoc`, and `@typedoc`.
- Integration tests use Docker Compose to manage various database environments for comprehensive testing of generated projects.
- Deprecations are clearly outlined in the `CHANGELOG.md`, indicating future breaking changes.
- The `mix.exs` files include logic to delete `phx_new` paths from `Code.get_path()` to ensure local development versions are used.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Elixir (1.15+), JavaScript (ES6+) | 3 _(auto)_ |
| Q2 | Database library | Objective | Ecto | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | Plug | 3 _(auto)_ |
| Q4 | Package managers | Objective | Elixir: Mix (for Elixir dependencies) JavaScript: npm (for JavaScript dependencies) | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | Elixir: Mix test (e.g., `mix test`, `mix test --include database:postgresql`) JavaScript: Jest (e.g., `jest`, `jest --coverage`, `jest --watch`) | 3 _(auto)_ |
| Q6 | i18n library | Objective | Gettext | 3 _(auto)_ |
| Q7 | Ecto association rule | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Ecto field type rule | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Repo adapter | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q11 | Largest directory | Navigational | `test/` (100 files) and `installer/` (100 files) both have the most files. | 2 _(auto)_ |
| Q12 | Project type | Inferential | Framework (Phoenix itself), Library (Phoenix.js client), CLI (phx.new installer), Integration Test Suite. | 2 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
Elixir (1.15+), JavaScript (ES6+)

Q2:
Ecto

Q3:
Plug

Q4:
Elixir: Mix (for Elixir dependencies)
JavaScript: npm (for JavaScript dependencies)

Q5:
Elixir: Mix test (e.g., `mix test`, `mix test --include database:postgresql`)
JavaScript: Jest (e.g., `jest`, `jest --coverage`, `jest --watch`)

Q6:
Gettext

Q7:
Not in profile.

Q8:
Not in profile.

Q9:
Not in profile.

Q10:
Not in profile.

Q11:
`test/` (100 files) and `installer/` (100 files) both have the most files.

Q12:
Framework (Phoenix itself), Library (Phoenix.js client), CLI (phx.new installer), Integration Test Suite.
```
