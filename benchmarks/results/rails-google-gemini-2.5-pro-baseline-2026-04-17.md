# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** rails
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 289 prompt + 3747 completion = 4036 total
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
| Q1 | Background job lib | Objective | Active Job | 0 _(auto)_ |
| Q2 | JS bundler | Objective | esbuild | 0 _(auto)_ |
| Q3 | JS test framework | Objective | QUnit | 0 _(auto)_ |
| Q4 | Largest component | Navigational | ActiveRecord, with approximately 735 files. | 2 _(auto)_ |
| Q5 | Web server | Objective | Puma | 3 _(auto)_ |
| Q6 | In-memory store | Objective | Redis | 3 _(auto)_ |
| Q7 | Run component tests | Domain | From within the component's directory (e.g., `actionview/`), run `bundle exec rake test`. | 0 _(auto)_ |
| Q8 | Test config utility | Domain | ActiveSupport::Testing::ConstantStubbing.stub_const | 0 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | Bundler | 3 _(auto)_ |
| Q10 | JS pkg manager | Objective | yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | bcrypt | 3 _(auto)_ |
| Q12 | Monorepo scale | Inferential | 13 | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 17)_

---

## Raw Model Response

```
Q1:
Active Job

Q2:
esbuild

Q3:
QUnit

Q4:
ActiveRecord, with approximately 735 files.

Q5:
Puma

Q6:
Redis

Q7:
From within the component's directory (e.g., `actionview/`), run `bundle exec rake test`.

Q8:
ActiveSupport::Testing::ConstantStubbing.stub_const

Q9:
Bundler

Q10:
yarn

Q11:
bcrypt

Q12:
13
```
