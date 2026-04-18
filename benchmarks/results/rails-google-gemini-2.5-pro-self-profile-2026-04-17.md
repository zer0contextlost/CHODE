# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** rails
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 4705 paths, 5 anchor files, 25 doc files
**Call 1 — profile build:** 104065 prompt tokens → 2800 completion tokens (profile)
**Call 2 — questions:** 1174 prompt tokens + 1872 completion tokens
**Total tokens consumed:** 109911

**CHODE equivalent:** ~548 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 190x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 12/36 (33% of auto-scorable)
**Stump questions (8):** 3/24 (13%)

---

## AI-Built Profile

```
Primary language(s) and version:
The repository is written in Ruby. It is designed to be compatible with multiple Ruby versions, a common practice for a framework. The Gemfile indicates support for Ruby 2.4+ and uses platform-specific gems.

Framework(s) and key libraries:
This repository *is* the Ruby on Rails framework. It is a collection of individual components that work together. Key development and testing dependencies from the Gemfile include Minitest, Capybara, Selenium, and RuboCop. It also specifies optional backend libraries for its components, such as `pg` and `mysql2` for Active Record, `redis` for Action Cable, and `aws-sdk-s3` for Active Storage.

Package manager(s):
The project uses two primary package managers. Bundler is used for managing Ruby gems, evidenced by the `Gemfile` and `Gemfile.lock`. Yarn is used for managing JavaScript packages, as shown by the root `package.json` defining workspaces for `actioncable`, `actiontext`, and `activestorage`, and the presence of `yarn.lock`.

Test framework(s) and test commands:
The testing framework is Minitest. The standard way to run tests is to navigate into a specific component's directory and execute its local test runner, for example: `cd actionview && bin/test test/template/form_helper_test.rb`. The root `Rakefile` also provides tasks to run tests for each component, like `rake actionview:test`. Active Record has a specific test matrix to run against different database adapters (e.g., `rake test:sqlite3`, `rake test:postgresql`).

Project type (library, framework, CLI, application, monorepo):
This is a monorepo that contains the Ruby on Rails web framework. The framework itself is composed of over ten major, loosely-coupled library components (gems), such as Active Record and Action Pack.

Primary purpose in 1-2 sentences:
Ruby on Rails is a comprehensive web application framework for building database-backed applications using the Model-View-Controller (MVC) pattern. It provides a full-stack, "convention over configuration" solution for everything from routing and database interaction to front-end asset management and real-time communication.

Top directories and approximate file counts:
The repository contains over 4700 files. The top-level directories correspond to the framework's core components: `activerecord`, `actionpack`, `actionview`, `activesupport`, `railties`, `activejob`, `actionmailer`, `actioncable`, `activestorage`, and `actiontext`. Other important directories include `guides` for documentation and `tools` for development utilities.

Key entry point files:
The primary command-line interface is `railties/exe/rails`. The framework's main loading point is `railties/lib/rails.rb`. Each component has its own main file, such as `activerecord/lib/active_record.rb`. The root `package.json` serves as the entry point for the JavaScript workspaces. The `bin/test` script is the entry point for running tests within each component.

Architecture pattern (if identifiable):
The project follows a component-based architecture, where the framework is a collection of independent gems. For the applications it generates, Rails strictly promotes the Model-View-Controller (MVC) pattern.

Notable conventions or gotchas:
- The repository is a monorepo for both Ruby components and JavaScript packages (using Yarn workspaces).
- Each component is a self-contained gem with its own `.gemspec`, tests, and `CHANGELOG.md`.
- Testing is decentralized; developers must `cd` into a component's directory to run its tests.
- The `AGENTS.md` file provides a detailed guide for AI agents on navigating the codebase, a modern and unique convention.
- The release process is documented in `RELEASING_RAILS.md` and managed by Rake tasks.
- JavaScript packages like `@rails/actioncable` have their own build process using Rollup, defined in their respective `package.json` files.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | The project provides `activejob`, which is one of its core components for background job processing. | 0 _(auto)_ |
| Q2 | JS bundler | Objective | Rollup | 3 _(auto)_ |
| Q3 | JS test framework | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Largest component | Navigational | Not in profile. | 0 _(auto)_ |
| Q5 | Web server | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | In-memory store | Objective | redis | 3 _(auto)_ |
| Q7 | Run component tests | Domain | `rake actionview:test` | 0 _(auto)_ |
| Q8 | Test config utility | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | Bundler | 3 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Monorepo scale | Inferential | Over ten major components. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
The project provides `activejob`, which is one of its core components for background job processing.

Q2:
Rollup

Q3:
Not in profile.

Q4:
Not in profile.

Q5:
Not in profile.

Q6:
redis

Q7:
`rake actionview:test`

Q8:
Not in profile.

Q9:
Bundler

Q10:
Yarn

Q11:
Not in profile.

Q12:
Over ten major components.
```
