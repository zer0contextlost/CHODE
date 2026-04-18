# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 253 prompt + 269 completion = 522 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 12/36 (33% of auto-scorable)
**Stump questions (8):** 6/24 (25% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | This project is likely written in Go. | 3 _(auto)_ |
| Q2 | CLI framework | Objective | This project might use the Cobra CLI framework/library. | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | This project might use gRPC, but without specific evidence from the profile, this is uncertain. | 1 _(auto)_ |
| Q4 | Test command | Objective | The command to run tests is likely `go test ./...`. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | The main entry point file is likely `main.go`. | 1 _(auto)_ |
| Q6 | Largest package | Navigational | Without specific data, it's difficult to determine which package has the most files, but it could be the `cmd` or `pkg` directory. | 1 _(auto)_ |
| Q7 | Comment convention | Domain | The required comment style for exported functions, types, and constants is likely to be Go-style comments, which start with the name of the function, type, or constant. | 0 _(auto)_ |
| Q8 | Banned punctuation | Domain | The punctuation character banned from code, comments, and documentation might be the semicolon (`;`), as Go typically discourages its use. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | The acceptance tests are likely described as end-to-end tests. | 0 _(auto)_ |
| Q10 | Test framework | Domain | The acceptance tests might be powered by the `testing` package or a framework like `Ginkgo`. | 0 _(auto)_ |
| Q11 | CI system | Objective | The CI system configured could be GitHub Actions or Travis CI. | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool's primary purpose is likely to provide a command-line interface for managing or interacting with a specific service or application. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 12)_

---

## Raw Model Response

```
Q1: 
This project is likely written in Go.

Q2: 
This project might use the Cobra CLI framework/library.

Q3: 
This project might use gRPC, but without specific evidence from the profile, this is uncertain.

Q4: 
The command to run tests is likely `go test ./...`.

Q5: 
The main entry point file is likely `main.go`.

Q6: 
Without specific data, it's difficult to determine which package has the most files, but it could be the `cmd` or `pkg` directory.

Q7: 
The required comment style for exported functions, types, and constants is likely to be Go-style comments, which start with the name of the function, type, or constant.

Q8: 
The punctuation character banned from code, comments, and documentation might be the semicolon (`;`), as Go typically discourages its use.

Q9: 
The acceptance tests are likely described as end-to-end tests.

Q10: 
The acceptance tests might be powered by the `testing` package or a framework like `Ginkgo`.

Q11: 
The CI system configured could be GitHub Actions or Travis CI.

Q12: 
This tool's primary purpose is likely to provide a command-line interface for managing or interacting with a specific service or application.
```
