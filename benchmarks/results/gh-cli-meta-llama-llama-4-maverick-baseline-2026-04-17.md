# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 256 prompt + 118 completion = 374 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 16/36 (44% of auto-scorable)
**Stump questions (8):** 10/24 (42% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | Cobra | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Yes, there is a reference to "grpc" in the project's dependencies or imports. | 3 _(auto)_ |
| Q4 | Test command | Objective | go test ./... | 0 _(auto)_ |
| Q5 | Entry point | Navigational | main.go | 1 _(auto)_ |
| Q6 | Largest package | Navigational | internal, 25 | 0 _(auto)_ |
| Q7 | Comment convention | Domain | godoc style, which is a specific format for comments on exported elements. | 3 _(auto)_ |
| Q8 | Banned punctuation | Domain | ; | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | End-to-end tests | 0 _(auto)_ |
| Q10 | Test framework | Domain | Ginkgo | 0 _(auto)_ |
| Q11 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool is a command-line interface for managing and interacting with a software repository or system. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 16)_

---

## Raw Model Response

```
Q1
Go

Q2
Cobra

Q3
Yes, there is a reference to "grpc" in the project's dependencies or imports.

Q4
go test ./...

Q5
main.go

Q6
internal, 25

Q7
godoc style, which is a specific format for comments on exported elements.

Q8
;

Q9
End-to-end tests

Q10
Ginkgo

Q11
GitHub Actions

Q12
This tool is a command-line interface for managing and interacting with a software repository or system.
```
