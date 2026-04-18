# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** rails
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 4705 paths, 5 anchor files, 25 doc files
**Call 1 — profile build:** 88094 prompt tokens → 726 completion tokens (profile)
**Call 2 — questions:** 1004 prompt tokens + 104 completion tokens
**Total tokens consumed:** 89928

**CHODE equivalent:** ~548 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 161x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 16/36 (44% of auto-scorable)
**Stump questions (8):** 10/24 (42%)

---

## AI-Built Profile

```
Ruby on Rails is a monorepo web application framework containing 10+ independent but integrated components. The primary language is Ruby (3.0+), with JavaScript for frontend components. Key frameworks/libraries include Active Record (ORM), Action Pack (controllers/routing), Active Support (utilities), and others like Action Cable (WebSockets), Active Storage (file uploads), and Action Text (rich text).

Package management uses Bundler for Ruby gems and Yarn/npm for JavaScript packages. The monorepo structure uses a root-level Gemfile and package.json with workspaces for JavaScript components (actioncable, actiontext, activestorage). Testing employs Minitest as the primary framework, with component-specific test commands like `bin/test` or `rake test`. System tests use Capybara with Selenium.

This is a framework monorepo where each component can function standalone or together. The primary purpose is to provide a full-stack MVC web application framework with database abstraction, routing, view rendering, background jobs, real-time features, and file storage. Rails follows convention over configuration principles.

Top directories and approximate file counts:
- actioncable (100+ files): WebSocket framework
- actionmailbox (150+ files): Inbound email processing
- actionmailer (100+ files): Email sending framework
- actionpack (500+ files): Controllers and routing
- actiontext (100+ files): Rich text content
- actionview (400+ files): View templates and helpers
- activejob (100+ files): Background job abstraction
- activemodel (100+ files): Model interfaces
- activerecord (1000+ files): ORM/database abstraction
- activestorage (200+ files): File uploads/storage
- activesupport (300+ files): Core extensions/utilities
- railties (300+ files): CLI and framework glue
- guides (100+ files): Documentation
- tools (20+ files): Development utilities

Key entry point files include:
- rails.gemspec: Defines the Rails gem
- Gemfile: Root dependencies
- package.json: JavaScript workspace configuration
- railties/exe/rails: CLI entry point
- Each component's main lib file (e.g., activerecord/lib/active_record.rb)
- config/application.rb: Application configuration template

The architecture follows a modular MVC pattern with loose coupling between components. Each component has a similar structure: lib/ for source code, test/ for tests, and app/ for framework-specific application files. Components communicate through well-defined interfaces and Active Support's core extensions.

Notable conventions include:
- Configuration flags use class attributes with defaults
- Test files mirror source structure with _test suffix
- Configuration changes use Object#with for temporary overrides
- CHANGELOG.md updates for each release
- load_defaults version blocks for framework defaults
- Component-specific generators and rake tasks
- Parallel test execution with deterministic worker assignment

Gotchas include:
- Components must maintain backward compatibility
- Configuration changes require updates to railties/configuration.rb
- JavaScript components need build artifacts committed
- Test isolation is critical due to parallel execution
- Database adapter tests require specific setup
- Some components have external dependencies (e.g., databases)
- The monorepo structure requires careful dependency management
- Security releases follow a different process than regular releases
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | Active Job (background job abstraction) | 0 _(auto)_ |
| Q2 | JS bundler | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | JS test framework | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Largest component | Navigational | activerecord (1000+ files) | 2 _(auto)_ |
| Q5 | Web server | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | In-memory store | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Run component tests | Domain | bin/test or rake test | 2 _(auto)_ |
| Q8 | Test config utility | Domain | Object#with | 3 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | Bundler | 3 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn/npm | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Monorepo scale | Inferential | 10+ independent but integrated components | 3 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Active Job (background job abstraction)

Q2
Not in profile.

Q3
Not in profile.

Q4
activerecord (1000+ files)

Q5
Not in profile.

Q6
Not in profile.

Q7
bin/test or rake test

Q8
Object#with

Q9
Bundler

Q10
Yarn/npm

Q11
Not in profile.

Q12
10+ independent but integrated components
```
