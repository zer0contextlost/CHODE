# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** rails
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 4705 paths, 5 anchor files, 25 doc files
**Call 1 — profile build:** 80532 prompt tokens → 537 completion tokens (profile)
**Call 2 — questions:** 808 prompt tokens + 102 completion tokens
**Total tokens consumed:** 81979

**CHODE equivalent:** ~548 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 147x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 5/36 (14% of auto-scorable)
**Stump questions (8):** 2/24 (8%)

---

## AI-Built Profile

```
This repository is a monorepo for the Ruby on Rails framework, primarily written in Ruby. The main version of Ruby used is not explicitly stated, but Rails typically supports the latest stable versions of Ruby. The repository includes several key components, such as Active Record, Action Pack, Action View, Active Model, Active Support, Action Mailer, Action Mailbox, Active Job, Action Cable, Active Storage, and Action Text, which together form the Rails framework.

The primary package manager used is RubyGems, with a `Gemfile` that specifies dependencies for various components. Additionally, JavaScript dependencies are managed using Yarn, as indicated by the presence of `package.json` files in several directories, including actioncable, actiontext, and activestorage.

The test framework utilized is Minitest, with a structured testing approach across components. Test commands can be executed from within each component directory using `bin/test`, or from the root using `rake` commands, such as `rake actionview:test` to run tests for the Action View component. The repository also supports parallel testing, which can be beneficial for performance.

The project type is a framework, specifically a web application framework designed to facilitate the development of database-backed web applications following the Model-View-Controller (MVC) architecture pattern. Rails integrates various components to provide a cohesive development experience, allowing developers to build applications efficiently.

The primary purpose of this repository is to provide a comprehensive framework for building web applications in Ruby, offering features such as routing, database interaction, view rendering, and background job processing.

Top-level directories include:
- actioncable (approx. 200 files)
- actiontext (approx. 150 files)
- activestorage (approx. 200 files)
- actionmailer (approx. 150 files)
- actionpack (approx. 300 files)
- activerecord (approx. 600 files)
- activesupport (approx. 400 files)
- railties (approx. 300 files)
- guides (approx. 100 files)

Key entry point files include `Gemfile`, `README.md`, and various `CHANGELOG.md` files for each component, which document changes and updates. The architecture pattern is primarily MVC, with a focus on modularity and separation of concerns.

Notable conventions include the use of `with` for temporary configuration changes in tests, a consistent approach to naming tests for clarity, and the practice of updating `CHANGELOG.md` files for each component with detailed entries for changes made. Additionally, the repository emphasizes the importance of maintaining a green CI before releases, ensuring that all components work harmoniously together.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | Not in profile. | 0 _(auto)_ |
| Q2 | JS bundler | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | JS test framework | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Largest component | Navigational | activerecord (approx. 600 files) | 2 _(auto)_ |
| Q5 | Web server | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | In-memory store | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Run component tests | Domain | `rake actionview:test` | 0 _(auto)_ |
| Q8 | Test config utility | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | RubyGems | 0 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Monorepo scale | Inferential | 9 independent components | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1: Not in profile.  
Q2: Not in profile.  
Q3: Not in profile.  
Q4: activerecord (approx. 600 files)  
Q5: Not in profile.  
Q6: Not in profile.  
Q7: `rake actionview:test`  
Q8: Not in profile.  
Q9: RubyGems  
Q10: Yarn  
Q11: Not in profile.  
Q12: 9 independent components  
```
