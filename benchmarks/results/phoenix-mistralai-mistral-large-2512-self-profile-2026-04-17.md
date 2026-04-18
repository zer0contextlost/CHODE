# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** phoenix
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 478 paths, 4 anchor files, 10 doc files
**Call 1 — profile build:** 17610 prompt tokens → 654 completion tokens (profile)
**Call 2 — questions:** 915 prompt tokens + 113 completion tokens
**Total tokens consumed:** 19292

**CHODE equivalent:** ~306 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 58x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 17/36 (47% of auto-scorable)
**Stump questions (7):** 6/21 (29%)

---

## AI-Built Profile

```
Here's a compressed profile of the Phoenix framework repository:

Primary languages: Elixir (1.15+ required), JavaScript/TypeScript. The project is built for Erlang/OTP 25+.

Frameworks/libraries: Phoenix is itself a full-stack web framework for Elixir. Key components include Ecto (database wrapper), Plug (web middleware), Phoenix.PubSub (pub/sub system), Phoenix.HTML (HTML helpers), and Phoenix.LiveView (real-time UI). The JavaScript client handles WebSocket connections.

Package managers: Mix (Elixir/Erlang), npm (JavaScript). Dependencies are managed via mix.exs and package.json files.

Test frameworks: ExUnit (Elixir's built-in testing), Jest (JavaScript). Test commands include `mix test` for Elixir tests and `npm test` for JavaScript tests. The integration_test directory uses Docker to test generated projects across multiple databases.

Project type: Monorepo containing both the Phoenix framework and its project generator (phx.new). It's primarily a framework with CLI tooling for scaffolding new applications.

Primary purpose: Phoenix provides a productive web framework for building real-time, scalable applications in Elixir with features like channels for WebSocket communication, LiveView for server-rendered interactive UIs, and generators for rapid development.

Top directories and file counts:
- lib/ (100+ files): Core framework code
- assets/js/phoenix/ (10+ files): JavaScript client
- installer/ (100+ files): Project generator templates and code
- test/ (150+ files): Test suite
- guides/ (30+ files): Documentation guides
- priv/templates/ (50+ files): Generator templates

Key entry point files:
- lib/phoenix.ex: Main framework module
- installer/lib/mix/tasks/phx.new.ex: Project generator entry point
- assets/js/phoenix/index.js: JavaScript client entry point
- mix.exs: Main project configuration

Architecture pattern: Follows the MVC pattern with additional real-time capabilities. Uses a pipeline-based request processing system (Plug), pub/sub for real-time features, and LiveView for reactive server-rendered components. The framework is built around OTP principles with supervision trees and processes.

Notable conventions/gotchas:
- Uses .ex for compiled Elixir and .exs for scripts
- Follows "let it crash" philosophy with robust supervision
- Generators create scoped contexts for business logic
- LiveView uses a stateful connection model
- JavaScript client uses ES6 modules
- Configuration is environment-specific (dev/test/prod)
- Deprecates helpers in favor of VerifiedRoutes
- Uses function components in HEEx templates
- Magic links and sudo mode in auth generators
- Scopes in generators for secure data access by default

The repository maintains strict separation between framework code and installer templates. The integration tests verify generated projects work correctly across different database backends. The JavaScript client is built separately but versioned alongside the Elixir code.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Elixir | 3 _(auto)_ |
| Q2 | Database library | Objective | Ecto | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | Plug | 3 _(auto)_ |
| Q4 | Package managers | Objective | Mix, npm | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | ExUnit (Elixir), Jest (JavaScript). Test commands: `mix test` for Elixir tests and `npm test` for JavaScript tests. | 3 _(auto)_ |
| Q6 | i18n library | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Ecto association rule | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Ecto field type rule | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Repo adapter | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q11 | Largest directory | Navigational | lib/ | 0 _(auto)_ |
| Q12 | Project type | Inferential | Framework | 2 _(auto)_ |

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
ExUnit (Elixir), Jest (JavaScript). Test commands: `mix test` for Elixir tests and `npm test` for JavaScript tests.

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
Framework
```
