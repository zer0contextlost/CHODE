# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** rails
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 4705 paths, 5 anchor files, 25 doc files
**Call 1 — profile build:** 80532 prompt tokens → 624 completion tokens (profile)
**Call 2 — questions:** 895 prompt tokens + 239 completion tokens
**Total tokens consumed:** 82290

**CHODE equivalent:** ~548 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 147x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 10/36 (28% of auto-scorable)
**Stump questions (8):** 4/24 (17%)

---

## AI-Built Profile

```
This repository is the codebase for Ruby on Rails, a popular web application framework. It is primarily written in Ruby, with some JavaScript components. The framework is designed to follow the Model-View-Controller (MVC) architecture pattern, which divides the application into three interconnected components: models, views, and controllers. Rails is built on top of Ruby 3.0 or later, and it leverages several key libraries, including Active Record for ORM, Action Pack for controllers and routing, Action View for templates, Active Model for model interfaces, and Active Support for utility classes.

Rails uses Bundler as its package manager for Ruby gems, and Yarn for managing JavaScript dependencies. The repository is structured as a monorepo, containing multiple components that can be used independently or together. These components include Active Record, Action Pack, Action View, Active Model, Active Support, Action Mailer, Action Mailbox, Active Job, Action Cable, Active Storage, Action Text, and Railties.

Testing in Rails is facilitated by Minitest, a Ruby testing library, and tests can be run using the `bin/test` command within each component directory. The repository supports parallel testing using multiple processes, and tests can be filtered by name or run individually. Rails also provides rake tasks for running tests across all components or specific ones, such as `rake test` and `rake test:isolated`.

The primary purpose of Rails is to provide a comprehensive framework for building database-backed web applications. It aims to simplify the development process by offering conventions over configurations, allowing developers to focus on application logic rather than boilerplate code.

The top directories in the repository include:
- `actioncable/` (approx. 150 files)
- `actionmailbox/` (approx. 100 files)
- `actionmailer/` (approx. 100 files)
- `actionpack/` (approx. 500 files)
- `actiontext/` (approx. 150 files)
- `actionview/` (approx. 400 files)
- `activejob/` (approx. 100 files)
- `activemodel/` (approx. 150 files)
- `activerecord/` (approx. 800 files)
- `activestorage/` (approx. 200 files)
- `activesupport/` (approx. 300 files)
- `railties/` (approx. 300 files)

Key entry point files include `rails.gemspec` for gem specifications, `Gemfile` for dependencies, and `bin/rails` for the Rails CLI. The architecture pattern is MVC, which is evident in the separation of concerns across models, views, and controllers.

Notable conventions include the use of configuration flags for feature toggles, changelog updates for documenting changes, and descriptive test naming for clarity. Rails emphasizes convention over configuration, which means developers should adhere to established patterns and practices to ensure compatibility and ease of use. Additionally, Rails components are designed to be loosely coupled, allowing for independent updates and maintenance.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | Active Job | 0 _(auto)_ |
| Q2 | JS bundler | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | JS test framework | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Largest component | Navigational | activerecord/ (approx. 800 files) | 2 _(auto)_ |
| Q5 | Web server | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | In-memory store | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Run component tests | Domain | `bin/test` within each component directory | 2 _(auto)_ |
| Q8 | Test config utility | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | Bundler | 3 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Monorepo scale | Inferential | 12 components | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1: What background job processing library does this project use?
Active Job

Q2: What JavaScript bundler handles frontend assets in this project?
Not in profile.

Q3: What JavaScript test framework(s) are used in this project?
Not in profile.

Q4: Which component in this monorepo has the most Ruby source files? Give the count.
activerecord/ (approx. 800 files)

Q5: What web server does this project use?
Not in profile.

Q6: What in-memory data store is part of the stack?
Not in profile.

Q7: What is the command to run tests for a specific component, for example ActionView?
`bin/test` within each component directory

Q8: What Active Support utility should you use to temporarily modify class attributes in tests instead of manual set/restore?
Not in profile.

Q9: What package manager handles Ruby gem dependencies?
Bundler

Q10: What package manager handles JavaScript dependencies?
Yarn

Q11: What password hashing library is included in the stack?
Not in profile.

Q12: How many independent components does this monorepo contain?
12 components
```
