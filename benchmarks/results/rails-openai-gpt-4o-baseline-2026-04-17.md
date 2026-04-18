# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** rails
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 276 prompt + 97 completion = 373 total
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
| Q4 | Largest component | Navigational | ActiveRecord, with 150 Ruby source files | 2 _(auto)_ |
| Q5 | Web server | Objective | Puma | 3 _(auto)_ |
| Q6 | In-memory store | Objective | Redis | 3 _(auto)_ |
| Q7 | Run component tests | Domain | bin/rails test component_name | 0 _(auto)_ |
| Q8 | Test config utility | Domain | ActiveSupport::Testing::Isolation | 0 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | Bundler | 3 _(auto)_ |
| Q10 | JS pkg manager | Objective | Yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | BCrypt | 3 _(auto)_ |
| Q12 | Monorepo scale | Inferential | 6 components | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 17)_

---

## Raw Model Response

```
Q1: 
Sidekiq

Q2: 
Webpack

Q3: 
Jest

Q4: 
ActiveRecord, with 150 Ruby source files

Q5: 
Puma

Q6: 
Redis

Q7: 
bin/rails test component_name

Q8: 
ActiveSupport::Testing::Isolation

Q9: 
Bundler

Q10: 
Yarn

Q11: 
BCrypt

Q12: 
6 components
```
