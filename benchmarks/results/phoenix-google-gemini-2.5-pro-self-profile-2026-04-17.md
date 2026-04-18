# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** phoenix
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 478 paths, 4 anchor files, 10 doc files
**Call 1 — profile build:** 19045 prompt tokens → 2030 completion tokens (profile)
**Call 2 — questions:** 1048 prompt tokens + 1682 completion tokens
**Total tokens consumed:** 23805

**CHODE equivalent:** ~306 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 62x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 19/36 (53% of auto-scorable)
**Stump questions (7):** 8/21 (38%)

---

## AI-Built Profile

```
Primary language(s) and version: Elixir (~> 1.15), JavaScript (ES6+)

Framework(s) and key libraries: This repository *is* the Phoenix framework. Its core Elixir dependencies include Plug (for the web layer), Phoenix PubSub (for real-time messaging), and Telemetry (for metrics). The JavaScript client is a standalone library with no production dependencies. Generated projects often include Ecto (for database access), Phoenix LiveView, and esbuild.

Package manager(s): Mix (via Hex) for Elixir, npm for JavaScript.

Test framework(s) and test commands: ExUnit is used for Elixir tests, run with `mix test`. The repository contains multiple test suites: one in the root for the framework, one in `installer/` for the project generator, and a large `integration_test/` suite to validate generated applications. The JavaScript client uses Jest, run with `npm test`.

Project type: Monorepo containing a web framework, a CLI tool, and a client library.

Primary purpose in 1-2 sentences: Phoenix is a productive web framework for the Elixir programming language that enables developers to build feature-rich, fault-tolerant, and high-performance web applications. It provides a solid foundation for everything from traditional request/response APIs and HTML rendering to real-time applications using its Channels and LiveView features.

Top directories and approximate file counts:
- `priv/` (~100 files): Contains templates for the code generators (`phx.gen.*`).
- `installer/` (~100 files): Houses the `mix phx.new` project generator, including its own templates and logic. This is published as a separate `phx_new` package.
- `lib/` (~80 files): The core source code of the Phoenix framework.
- `test/` (~60 files): Tests for the core framework.
- `guides/` (~40 files): The official documentation guides.
- `assets/` (~20 files): The source code for the official `phoenix` JavaScript client.

Key entry point files:
- `lib/phoenix.ex`: The main application module for the framework.
- `lib/phoenix/endpoint.ex`: A core file that defines the entry point for all web requests in a Phoenix application.
- `installer/lib/mix/tasks/phx.new.ex`: The Mix task that implements the `mix phx.new` project generator.
- `assets/js/phoenix/index.js`: The main entry point for the JavaScript client library.
- `mix.exs`: The root Mix project definition for the `phoenix` package.

Architecture pattern: Phoenix follows a server-side architecture that builds on the Plug specification. It is often compared to MVC, but it officially promotes a "Context" pattern for separating business logic from web-facing components (controllers, views). Its real-time capabilities are built on a pub/sub architecture (Channels) that communicates over WebSockets or Long Polling.

Notable conventions or gotchas: The repository is a monorepo with three distinct Elixir projects: the core framework (`/`), the installer (`installer/`), and an integration test suite (`integration_test/`), each with its own `mix.exs`. The `phx_new` installer is published to Hex separately from the `phoenix` framework package. The JavaScript client in `assets/` is built and its artifacts are placed in `priv/static`, and it is published independently to npm. The release process is complex, requiring coordinated publishing to both Hex and npm.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Elixir (~> 1.15) and JavaScript (ES6+) | 3 _(auto)_ |
| Q2 | Database library | Objective | The profile states that generated projects often include Ecto for database access. | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | Plug | 3 _(auto)_ |
| Q4 | Package managers | Objective | Mix (via Hex) and npm | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | ExUnit (run with `mix test`) and Jest (run with `npm test`). | 3 _(auto)_ |
| Q6 | i18n library | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Ecto association rule | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Ecto field type rule | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Repo adapter | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q11 | Largest directory | Navigational | `priv/` and `installer/` (both with ~100 files). | 2 _(auto)_ |
| Q12 | Project type | Inferential | It is a monorepo containing a web framework, a CLI tool, and a client library. | 2 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Elixir (~> 1.15) and JavaScript (ES6+)

Q2
The profile states that generated projects often include Ecto for database access.

Q3
Plug

Q4
Mix (via Hex) and npm

Q5
ExUnit (run with `mix test`) and Jest (run with `npm test`).

Q6
Not in profile.

Q7
Not in profile.

Q8
Not in profile.

Q9
Not in profile.

Q10
Not in profile.

Q11
`priv/` and `installer/` (both with ~100 files).

Q12
It is a monorepo containing a web framework, a CLI tool, and a client library.
```
