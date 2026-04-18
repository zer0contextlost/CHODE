# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** phoenix
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 478 paths, 4 anchor files, 10 doc files
**Call 1 — profile build:** 14710 prompt tokens → 419 completion tokens (profile)
**Call 2 — questions:** 674 prompt tokens + 88 completion tokens
**Total tokens consumed:** 15891

**CHODE equivalent:** ~306 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 48x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 17/36 (47% of auto-scorable)
**Stump questions (7):** 6/21 (29%)

---

## AI-Built Profile

```
The repository is primarily written in Elixir, with a significant amount of JavaScript code in the `assets` directory. The Elixir version required is specified in the `mix.exs` files as "~> 1.15". 

The project is a framework, specifically the Phoenix web framework, which is built on top of Elixir. Key libraries include Plug, Ecto, and Telemetry. The package managers used are Mix for Elixir dependencies and npm for JavaScript dependencies.

The test frameworks used are ExUnit for Elixir tests and Jest for JavaScript tests. The test commands are `mix test` for Elixir tests and `jest` or `npm test` for JavaScript tests.

The project type is a framework, and its primary purpose is to provide a set of tools and structures for building web applications. The framework is designed to be highly customizable and extensible.

The top directories in the repository include `lib`, `test`, `assets`, `guides`, `installer`, and `integration_test`, with approximate file counts of 100, 150, 50, 20, 50, and 20, respectively.

Key entry point files include `mix.exs`, `lib/phoenix.ex`, and `assets/js/phoenix/index.js`. The architecture pattern is a mix of OTP (Open Telecom Platform) and Plug-based architecture.

Notable conventions include the use of Elixir's standard code formatting and the organization of the codebase into logical modules and directories. Gotchas may include the need to understand Elixir and OTP concepts, as well as the specific conventions and structures used in the Phoenix framework.

The repository also includes a number of guides and documentation files, including the `guides` directory, which provides detailed information on using the Phoenix framework. The `installer` directory contains code for generating new Phoenix projects, and the `integration_test` directory contains tests for the framework's generators and other functionality. 

Overall, the Phoenix framework is a complex and feature-rich project, and understanding its structure and conventions is essential for contributing to or using the framework effectively.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Elixir | 3 _(auto)_ |
| Q2 | Database library | Objective | Ecto | 3 _(auto)_ |
| Q3 | HTTP layer | Objective | Plug | 3 _(auto)_ |
| Q4 | Package managers | Objective | Mix, npm | 3 _(auto)_ |
| Q5 | Test frameworks | Objective | ExUnit, Jest, `mix test`, `jest`, `npm test` | 3 _(auto)_ |
| Q6 | i18n library | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Ecto association rule | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Ecto field type rule | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Repo adapter | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q11 | Largest directory | Navigational | test | 0 _(auto)_ |
| Q12 | Project type | Inferential | framework | 2 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Elixir

Q2
Ecto

Q3
Plug

Q4
Mix, npm

Q5
ExUnit, Jest, `mix test`, `jest`, `npm test`

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
test

Q12
framework
```
