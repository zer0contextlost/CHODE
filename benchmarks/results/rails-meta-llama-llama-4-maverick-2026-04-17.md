# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** rails
**Profile size:** ~548 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 35/36 (97% of auto-scorable)
**Stump questions (8):** 23/24 (96% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Background job lib | Objective | resque | 3 _(auto)_ |
| Q2 | JS bundler | Objective | rollup | 3 _(auto)_ |
| Q3 | JS test framework | Objective | karma, qunit | 3 _(auto)_ |
| Q4 | Largest component | Navigational | activerecord, 1.3k | 2 _(auto)_ |
| Q5 | Web server | Objective | puma | 3 _(auto)_ |
| Q6 | In-memory store | Objective | redis | 3 _(auto)_ |
| Q7 | Run component tests | Domain | cd actionview && bin/test | 3 _(auto)_ |
| Q8 | Test config utility | Domain | Object#with | 3 _(auto)_ |
| Q9 | Ruby pkg manager | Objective | bundler | 3 _(auto)_ |
| Q10 | JS pkg manager | Objective | yarn | 3 _(auto)_ |
| Q11 | Password hashing lib | Objective | bcrypt | 3 _(auto)_ |
| Q12 | Monorepo scale | Inferential | 10+ | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 35)_

---

## Raw Model Response

```
Q1:
resque

Q2:
rollup

Q3:
karma, qunit

Q4:
activerecord, 1.3k

Q5:
puma

Q6:
redis

Q7:
cd actionview && bin/test

Q8:
Object#with

Q9:
bundler

Q10:
yarn

Q11:
bcrypt

Q12:
10+
```
