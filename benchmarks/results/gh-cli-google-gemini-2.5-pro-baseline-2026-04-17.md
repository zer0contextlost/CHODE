# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 269 prompt + 3286 completion = 3555 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 8/36 (22% of auto-scorable)
**Stump questions (8):** 2/24 (8% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | mitchellh/cli | 0 _(auto)_ |
| Q3 | gRPC usage | Objective | Yes. It is used for the plugin system, allowing the core binary to communicate with providers over RPC. | 1 _(auto)_ |
| Q4 | Test command | Objective | make test | 3 _(auto)_ |
| Q5 | Entry point | Navigational | cmd/terraform/main.go | 1 _(auto)_ |
| Q6 | Largest package | Navigational | The `website` package, with over 1000 files. | 0 _(auto)_ |
| Q7 | Comment convention | Domain | Comments on exported functions, types, and constants must start with the name of the identifier being documented. | 0 _(auto)_ |
| Q8 | Banned punctuation | Domain | Apostrophe (') | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | Black-box, end-to-end tests. | 0 _(auto)_ |
| Q10 | Test framework | Domain | A custom testing harness built on Go's standard testing package, often referred to as the Terraform Plugin SDK's acceptance test framework. | 0 _(auto)_ |
| Q11 | CI system | Objective | CircleCI | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | It is an infrastructure as code tool that enables users to build, change, and version infrastructure safely and efficiently. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 8)_

---

## Raw Model Response

```
Q1:
Go

Q2:
mitchellh/cli

Q3:
Yes. It is used for the plugin system, allowing the core binary to communicate with providers over RPC.

Q4:
make test

Q5:
cmd/terraform/main.go

Q6:
The `website` package, with over 1000 files.

Q7:
Comments on exported functions, types, and constants must start with the name of the identifier being documented.

Q8:
Apostrophe (')

Q9:
Black-box, end-to-end tests.

Q10:
A custom testing harness built on Go's standard testing package, often referred to as the Terraform Plugin SDK's acceptance test framework.

Q11:
CircleCI

Q12:
It is an infrastructure as code tool that enables users to build, change, and version infrastructure safely and efficiently.
```
