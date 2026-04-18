# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** rails
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 282 prompt + 529 completion = 811 total
**Questions parsed:** 11/12 (missing: Q12)
**Auto-scored:** 12/12 questions → 2/36 (6% of auto-scorable)
**Stump questions (8):** 2/24 (8% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | --- | 0 _(auto)_ |
| Q2 | JS bundler | Objective | --- | 0 _(auto)_ |
| Q3 | JS test framework | Objective | --- | 0 _(auto)_ |
| Q4 | Largest component | Navigational | --- | 0 _(auto)_ |
| Q5 | Web server | Objective | --- | 0 _(auto)_ |
| Q6 | In-memory store | Objective | --- | 0 _(auto)_ |
| Q7 | Run component tests | Domain | `bin/test path/to/actionview/test` or `bundle exec rake test ACTIONVIEW_TEST_DIR=...` (exact syntax depends on the project).  --- | 2 _(auto)_ |
| Q8 | Test config utility | Domain | --- | 0 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | --- | 0 _(auto)_ |
| Q10 | JS pkg manager | Objective | --- | 0 _(auto)_ |
| Q11 | Password hashing lib | Objective | --- | 0 _(auto)_ |
| Q12 | Monorepo scale | Inferential | _(not parsed)_ | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 2)_

---

## Raw Model Response

```
Here are the answers based on my training knowledge, primarily inferred from common patterns in large Ruby on Rails monorepos (e.g., Rails itself or similar projects):

---

Q1
The project likely uses **Sidekiq** for background job processing, as it is the most common library for this purpose in Ruby/Rails applications.

---

Q2
The frontend assets are likely handled by **Webpack** (or **esbuild** in newer setups), but **Webpack** is the most traditional bundler for Rails projects with JavaScript.

---

Q3
The project probably uses **Minitest** (Rails' default) and/or **RSpec** for JavaScript testing. For JavaScript-specific tests, **Jest** is also a common choice.

---

Q4
In a Rails monorepo, the **Action Pack** component (which includes Action View) typically has the most Ruby source files. A rough guess for the count would be **~150–200 files**, but this varies by version.

---

Q5
The project uses **Puma** as the web server, which is the default for Rails applications.

---

Q6
The in-memory data store is likely **Redis**, commonly used for caching, background jobs, and real-time features.

---

Q7
To run tests for a specific component like ActionView, the command is typically:
`bin/test path/to/actionview/test` or `bundle exec rake test ACTIONVIEW_TEST_DIR=...` (exact syntax depends on the project).

---

Q8
The Active Support utility to temporarily modify class attributes in tests is **`ActiveSupport::Testing::SetupAndTeardown#around`** or more specifically, **`ActiveSupport::Testing::TimeHelpers`** for time-related changes. For general attributes, **`stub`** or **`with`** (e.g., `with_env`, `with_settings`) is used.

---

Q9
Ruby gem dependencies are managed by **Bundler**.

---

Q10
JavaScript dependencies are managed by **Yarn** (or **npm**, but Yarn is more common in Rails projects).

---

Q11
The password hashing library is **bcrypt**, which is the default in Rails for secure password storage.

---

Q12
A typical Rails monorepo (like the Rails framework itself) contains **~10–15 independent components** (e.g., Action Pack, Active Record, Active Support, Action Mailer, etc.). A precise guess would be **12 components**.
```
