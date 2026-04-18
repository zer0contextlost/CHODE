# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** rails
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 279 prompt + 503 completion = 782 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 17/36 (47% of auto-scorable)
**Stump questions (8):** 5/24 (21% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | Sidekiq | 0 _(auto)_ |
| Q2 | JS bundler | Objective | Webpack | 0 _(auto)_ |
| Q3 | JS test framework | Objective | Jest | 0 _(auto)_ |
| Q4 | Largest component | Navigational | 44 | 0 _(auto)_ |
| Q5 | Web server | Objective | Puma | 3 _(auto)_ |
| Q6 | In-memory store | Objective | Redis | 3 _(auto)_ |
| Q7 | Run component tests | Domain | bin/test COMPONENT_NAME | 2 _(auto)_ |
| Q8 | Test config utility | Domain | stub | 0 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | Bundler | 3 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | BCrypt | 3 _(auto)_ |
| Q12 | Monorepo scale | Inferential | 7 | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 17)_

---

## Raw Model Response

```
Q1
Sidekiq

Q2
Webpack

Q3
Jest

Q4
ActionView has 44 Ruby source files, but the actual count may vary. Assuming it's a Rails project, ActionView is likely to be one of the components with the most Ruby source files. Let's assume the count is around 44.

Q5
Puma

Q6
Redis

Q7
bin/test COMPONENT_NAME

Q8
ActiveSupport::Testing::ConstantLookup or more specifically, with `around` or `stub_const` for some cases, but the most suitable answer is likely `stub_const` or `with` from `ActiveSupport::Testing::TimeHelpers` is not the case, a more suitable one is `around` or more specifically for class attributes `Class#stub` from `ActiveSupport::Testing::Stub` (Rails 7) or `stub_class` is not the case. However, a more accurate answer is `stub` or more specifically for this case: `Module#const_stub` is not the case, a more accurate answer is `around` or `Class#stub_attribute` is not the case. A more accurate answer is `stub` (Module#stub) or more specifically for class attributes: `stub` (e.g., `SomeClass.stub(:some_attribute, value) { ... }`). However, the most straightforward and likely expected answer is `around` or `stub`.

Q9
Bundler

Q10
Yarn

Q11
BCrypt

Q12
Assuming a typical Rails monorepo, it contains around 6 main components (ActionCable, ActionMailbox, ActionText, ActiveStorage, ActionView, ActionPack, ActiveJob, etc.), but the actual count can vary. For the sake of this task, let's consider the main Rails components. There are around 7-8 main components (e.g., ActionCable, ActionMailbox, ActionText, ActiveStorage, ActionView, ActiveModel, ActiveJob, etc.). However, a more accurate count is likely around 7 or more. 

Here is the reformatted response:

Q1
Sidekiq

Q2
Webpack

Q3
Jest

Q4
44

Q5
Puma

Q6
Redis

Q7
bin/test COMPONENT_NAME

Q8
stub

Q9
Bundler

Q10
Yarn

Q11
BCrypt

Q12
7
```
