# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 269 prompt + 184 completion = 453 total
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
| Q3 | gRPC usage | Objective | Yes. The presence of `google.golang.org/grpc` in the `go.mod` file and `go.sum` file indicates gRPC usage. | 3 _(auto)_ |
| Q4 | Test command | Objective | `go test ./...` | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `cmd/protoc-gen-go-tableau/main.go` | 1 _(auto)_ |
| Q6 | Largest package | Navigational | `internal/tableau` with 10 files. | 0 _(auto)_ |
| Q7 | Comment convention | Domain | Standard GoDoc comments. | 3 _(auto)_ |
| Q8 | Banned punctuation | Domain | The profile does not explicitly ban any punctuation character. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | The acceptance tests are described as "end-to-end" tests. | 0 _(auto)_ |
| Q10 | Test framework | Domain | The acceptance tests are powered by the `cucumber/godog` framework. | 0 _(auto)_ |
| Q11 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool is a protocol buffer compiler plugin for generating Go code related to data tables. | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 16)_

---

## Raw Model Response

```
Q1
Go

Q2
Cobra

Q3
Yes. The presence of `google.golang.org/grpc` in the `go.mod` file and `go.sum` file indicates gRPC usage.

Q4
`go test ./...`

Q5
`cmd/protoc-gen-go-tableau/main.go`

Q6
`internal/tableau` with 10 files.

Q7
Standard GoDoc comments.

Q8
The profile does not explicitly ban any punctuation character.

Q9
The acceptance tests are described as "end-to-end" tests.

Q10
The acceptance tests are powered by the `cucumber/godog` framework.

Q11
GitHub Actions

Q12
This tool is a protocol buffer compiler plugin for generating Go code related to data tables.
```
