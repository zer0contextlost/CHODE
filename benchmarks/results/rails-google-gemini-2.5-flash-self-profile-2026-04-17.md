# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** rails
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 4705 paths, 5 anchor files, 25 doc files
**Call 1 — profile build:** 104065 prompt tokens → 1289 completion tokens (profile)
**Call 2 — questions:** 1578 prompt tokens + 139 completion tokens
**Total tokens consumed:** 107071

**CHODE equivalent:** ~548 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 190x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 26/36 (72% of auto-scorable)
**Stump questions (8):** 17/24 (71%)

---

## AI-Built Profile

```
Primary Language: Ruby (version not explicitly specified, but Gemfile indicates compatibility with Ruby 2.4+ and `prism` gem suggests newer Ruby versions are targeted). JavaScript is also used for frontend components.

Frameworks and Key Libraries: Ruby on Rails (Action Cable, Action Mailbox, Action Mailer, Action Pack, Action Text, Action View, Active Job, Active Model, Active Record, Active Storage, Active Support, Railties). Other notable gems include Minitest, Rake, RuboCop, MDL, SDoc, Redcarpet, Rouge, Rubyzip, Dalli, Listen, Libxml-ruby, Connection_pool, REXML, Msgpack, Bootsnap, Webrick, Jbuilder, Web-console, Rack, Useragent, Resque, Resque-scheduler, Queue_classic, Sneakers, Backburner, Puma, Redis, Redis-namespace, Websocket-client-simple, Aws-sdk-s3, Google-cloud-storage, Image_processing, Aws-sdk-sns, Webmock, Minitest-retry, Stackprof, Debug, Brakeman, Bundler-audit, Nokogiri, Sqlite3, Pg, Mysql2, Trilogy, Tzinfo-data. JavaScript libraries include Rollup, ESLint, Karma, QUnit, Mock-socket, Spark-md5, Js-sha256, Trix.

Package Managers: RubyGems (for Ruby dependencies), Yarn (for JavaScript dependencies).

Test Frameworks and Commands: Minitest is the primary test framework for Ruby. QUnit and Karma are used for JavaScript testing.
Ruby test commands:
- `cd <component> && bin/test` (run all tests in a component)
- `cd <component> && bin/test <file>` (run tests in a specific file)
- `cd <component> && bin/test -n "/test_name/"` (filter by test name)
- `cd <component> && bin/test <file>::<class>#<method>` (run specific test method)
- `rake <component>:test` (run all tests for a given component from root)
- `rake test` (run all non-isolated tests across components)
- `rake test:isolated` (run isolated tests across components)
- `rake smoke` (quick smoke test)
- Active Record specific: `bundle exec rake test:sqlite3`, `test:postgresql`, `test:mysql2`, `test:trilogy`

Project Type: Monorepo.

Primary Purpose: Ruby on Rails is a comprehensive web application framework designed to facilitate the rapid development of database-backed web applications following the Model-View-Controller (MVC) pattern. It provides a full-stack solution with integrated components for various aspects of web development.

Top Directories and Approximate File Counts:
- actioncable/: ~100 files
- actionmailbox/: ~100 files
- actionmailer/: ~100 files
- actionpack/: ~300 files
- actiontext/: ~100 files
- actionview/: ~300 files
- activejob/: ~100 files
- activemodel/: ~100 files
- activerecord/: ~1000 files
- activestorage/: ~100 files
- activesupport/: ~400 files
- guides/: ~200 files
- railties/: ~300 files
- tools/: ~50 files
- test/: (distributed within each component)

Key Entry Point Files:
- `Gemfile`: Defines Ruby dependencies.
- `package.json`: Defines JavaScript workspaces and dependencies.
- `Rakefile`: Defines Rake tasks for testing, building, and releasing.
- `bin/rails`: Rails CLI entry point.
- `lib/rails.rb`: Core Rails library.
- `lib/rails/application.rb`: Rails application configuration and bootstrap.
- `lib/rails/generators/rails/app/app_generator.rb`: Rails new application generator.

Architecture Pattern: Modular Monolith / Monorepo. Rails is structured as a collection of loosely coupled, independent components (gems) that can be used together or separately. Each component has its own directory, tests, and changelog. This allows for focused development and testing of individual parts while maintaining a cohesive framework.

Notable Conventions or Gotchas:
- **Configuration Testing**: Uses `Object#with` for temporary configuration changes in tests to avoid state leakage.
- **Configuration Flags**: Consistent pattern for defining, checking, and enabling configuration options across components, often enabled by default in new Rails versions via `load_defaults`.
- **Changelog Updates**: Requires manual updates to `CHANGELOG.md` files for each component with a specific format.
- **Test Naming**: Emphasizes descriptive test names and grouping.
- **Code Style**: Adheres to RuboCop standards, prefers `assert_not` over `assert !`, and `assert_dom_equal` for HTML comparisons.
- **JavaScript Package Management**: Generators detect the preferred JavaScript package manager (bun, pnpm, npm, or yarn) from lockfiles.
- **Active Job Adapters**: Built-in adapters for various queuing systems are being deprecated, encouraging library authors to provide their own.
- **Active Record Encryption**: Supports encryption of attributes with configurable key providers and deterministic encryption for querying.
- **Active Storage Analysis**: Blob analysis and variant processing can be configured to run immediately, later, or lazily, with local files used for immediate processing.
- **`require_dependency` Deprecation**: `require_dependency` is deprecated without replacement, with recommendations for modern autoloading approaches.
- **`Rails.app`**: A new alias for `Rails.application` for easier access to nested configurations like credentials.
- **`Rails.app.creds`**: Provides combined access to environment variables and encrypted credentials.
- **`bin/rails query`**: A new CLI command for running read-only database queries, supporting ActiveRecord expressions and raw SQL.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | Resque, Resque-scheduler, Queue_classic, Sneakers, Backburner. | 3 _(auto)_ |
| Q2 | JS bundler | Objective | Rollup. | 3 _(auto)_ |
| Q3 | JS test framework | Objective | QUnit and Karma. | 3 _(auto)_ |
| Q4 | Largest component | Navigational | activerecord/: ~1000 files | 2 _(auto)_ |
| Q5 | Web server | Objective | Puma, Webrick. | 3 _(auto)_ |
| Q6 | In-memory store | Objective | Redis, Dalli. | 3 _(auto)_ |
| Q7 | Run component tests | Domain | `cd actionview && bin/test` or `rake actionview:test` | 3 _(auto)_ |
| Q8 | Test config utility | Domain | Object#with | 3 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | RubyGems | 0 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Monorepo scale | Inferential | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
Resque, Resque-scheduler, Queue_classic, Sneakers, Backburner.

Q2:
Rollup.

Q3:
QUnit and Karma.

Q4:
activerecord/: ~1000 files

Q5:
Puma, Webrick.

Q6:
Redis, Dalli.

Q7:
`cd actionview && bin/test` or `rake actionview:test`

Q8:
Object#with

Q9:
RubyGems

Q10:
Yarn

Q11:
Not in profile.

Q12:
Not in profile.
```
