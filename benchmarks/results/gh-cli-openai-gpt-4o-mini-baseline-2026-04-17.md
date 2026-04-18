# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 253 prompt + 218 completion = 471 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 13/36 (36% of auto-scorable)
**Stump questions (8):** 7/24 (29% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | The language is Go. | 3 _(auto)_ |
| Q2 | CLI framework | Objective | The project uses the Cobra CLI framework. | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Yes, this project uses gRPC. Evidence may include the presence of `.proto` files or gRPC-related dependencies in the profile. | 3 _(auto)_ |
| Q4 | Test command | Objective | The command to run tests is `go test ./...`. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | The main entry point file according to the profile is `main.go`. | 1 _(auto)_ |
| Q6 | Largest package | Navigational | The package with the most files is likely the `cmd` package, with around 10 files. | 0 _(auto)_ |
| Q7 | Comment convention | Domain | The comment style required for exported functions, types, and constants is full sentences starting with the name of the element. | 0 _(auto)_ |
| Q8 | Banned punctuation | Domain | The punctuation character banned from code, comments, and documentation is the exclamation mark (!). | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | The acceptance tests are described as end-to-end tests. | 0 _(auto)_ |
| Q10 | Test framework | Domain | The framework that powers the acceptance tests is likely Ginkgo or a similar testing framework. | 0 _(auto)_ |
| Q11 | CI system | Objective | The CI system configured is GitHub Actions. | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool's primary purpose is to facilitate the development and management of command-line applications. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 13)_

---

## Raw Model Response

```
Q1: The language is Go.

Q2: The project uses the Cobra CLI framework.

Q3: Yes, this project uses gRPC. Evidence may include the presence of `.proto` files or gRPC-related dependencies in the profile.

Q4: The command to run tests is `go test ./...`.

Q5: The main entry point file according to the profile is `main.go`.

Q6: The package with the most files is likely the `cmd` package, with around 10 files.

Q7: The comment style required for exported functions, types, and constants is full sentences starting with the name of the element.

Q8: The punctuation character banned from code, comments, and documentation is the exclamation mark (!).

Q9: The acceptance tests are described as end-to-end tests.

Q10: The framework that powers the acceptance tests is likely Ginkgo or a similar testing framework.

Q11: The CI system configured is GitHub Actions.

Q12: This tool's primary purpose is to facilitate the development and management of command-line applications.
```
