# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** rails
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 4705 paths, 5 anchor files, 25 doc files
**Call 1 — profile build:** 79024 prompt tokens → 459 completion tokens (profile)
**Call 2 — questions:** 733 prompt tokens + 200 completion tokens
**Total tokens consumed:** 80416

**CHODE equivalent:** ~548 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 144x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 6/36 (17% of auto-scorable)
**Stump questions (8):** 3/24 (13%)

---

## AI-Built Profile

```
This repository is for Ruby on Rails, a web application framework written primarily in Ruby. The primary language is Ruby.

The framework is composed of multiple components, including Action Cable, Action Mailbox, Action Mailer, Action Pack, Action Text, Action View, Active Job, Active Model, Active Record, Active Storage, and Active Support. Key libraries include railties, which provides the Rails CLI and generators.

The project uses Yarn as a package manager for JavaScript dependencies, as seen in the package.json files in the root directory and in subdirectories like actioncable, actiontext, and activestorage. The root package.json defines workspaces for these subdirectories.

The test framework used is Minitest, with tests run using the bin/test script in each component directory or through Rake tasks from the root directory. For example, rake actionview:test runs tests for Action View.

This is a monorepo containing multiple independent components that can be used standalone or together. The primary purpose of this repository is to develop and maintain the Ruby on Rails framework.

The top directories include actioncable, actionmailbox, actionmailer, actionpack, actiontext, actionview, activejob, activemodel, activerecord, activestorage, activesupport, guides, railties, and tools, with approximate file counts ranging from tens to thousands of files. Key entry point files include railties/lib/rails.rb, which is the main entry point for the Rails framework.

The architecture pattern is a modular monolith, with each component having its own directory and being loosely coupled to allow for independent development and use.

Notable conventions include the use of CHANGELOG.md files in each component directory to track changes, and the use of Rake tasks to simplify testing and other development tasks. The project also follows a consistent coding style, with RuboCop used to enforce style guidelines.

Some gotchas include the need to run yarn build and check in the resulting artifacts when updating JavaScript source or Trix dependencies in Action Text, and the use of specific testing patterns, such as using Object#with to temporarily modify class attributes.

The repository is well-structured and follows standard professional guidelines, making it suitable for development and maintenance of the Ruby on Rails framework.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | Not in profile. | 0 _(auto)_ |
| Q2 | JS bundler | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | JS test framework | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Largest component | Navigational | Not in profile. | 0 _(auto)_ |
| Q5 | Web server | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | In-memory store | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Run component tests | Domain | rake actionview:test | 0 _(auto)_ |
| Q8 | Test config utility | Domain | Object#with | 3 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | Not in profile. | 0 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Monorepo scale | Inferential | The repository contains multiple independent components, including Action Cable, Action Mailbox, Action Mailer, Action Pack, Action Text, Action View, Active Job, Active Model, Active Record, Active Storage, and Active Support, so at least 11… | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Not in profile.

Q2
Not in profile.

Q3
Not in profile.

Q4
Not in profile.

Q5
Not in profile.

Q6
Not in profile.

Q7
rake actionview:test

Q8
Object#with

Q9
Not in profile.

Q10
Yarn

Q11
Not in profile.

Q12
The repository contains multiple independent components, including Action Cable, Action Mailbox, Action Mailer, Action Pack, Action Text, Action View, Active Job, Active Model, Active Record, Active Storage, and Active Support, so at least 11 components. However, the exact count is not provided, but it is more than the listed ones as it also includes railties. So, the answer is Not in profile for an exact count, but it is at least 11 or 12 if we count railties. To follow the format, the answer is: Not in profile.
```
