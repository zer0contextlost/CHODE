# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 260 prompt + 300 completion = 560 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 19/36 (53% of auto-scorable)
**Stump questions (8):** 9/24 (38% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | Cobra or urfave/cli (common CLI frameworks in Go projects; exact one depends on the repository, but Cobra is more likely) | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Uncertain, but if gRPC is used, evidence would include `.proto` files, `go.mod` dependencies like `google.golang.org/grpc`, or directories named `proto` or `rpc`. | 1 _(auto)_ |
| Q4 | Test command | Objective | `go test ./...` or `make test` (common in Go projects) | 3 _(auto)_ |
| Q5 | Entry point | Navigational | `main.go` or `cmd/<project-name>/main.go` (typical Go entry point) | 1 _(auto)_ |
| Q6 | Largest package | Navigational | Uncertain without repository inspection, but often `internal` or a core package like `pkg/<feature>` has the most files. | 1 _(auto)_ |
| Q7 | Comment convention | Domain | Godoc-style comments (e.g., `// Package x provides...` for packages, `// FunctionX does...` for exported symbols). | 3 _(auto)_ |
| Q8 | Banned punctuation | Domain | Semicolons (`;`) are banned in Go code, comments, and documentation. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | End-to-end or integration tests (common terminology for acceptance tests in Go). | 0 _(auto)_ |
| Q10 | Test framework | Domain | Ginkgo or Go's built-in `testing` package (Ginkgo is a popular BDD framework for Go acceptance tests). | 0 _(auto)_ |
| Q11 | CI system | Objective | GitHub Actions (most common CI for open-source Go projects). | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool automates infrastructure provisioning or configuration management (common purpose for CLI tools in Go repositories). | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 19)_

---

## Raw Model Response

```
Q1:
Go

Q2:
Cobra or urfave/cli (common CLI frameworks in Go projects; exact one depends on the repository, but Cobra is more likely)

Q3:
Uncertain, but if gRPC is used, evidence would include `.proto` files, `go.mod` dependencies like `google.golang.org/grpc`, or directories named `proto` or `rpc`.

Q4:
`go test ./...` or `make test` (common in Go projects)

Q5:
`main.go` or `cmd/<project-name>/main.go` (typical Go entry point)

Q6:
Uncertain without repository inspection, but often `internal` or a core package like `pkg/<feature>` has the most files.

Q7:
Godoc-style comments (e.g., `// Package x provides...` for packages, `// FunctionX does...` for exported symbols).

Q8:
Semicolons (`;`) are banned in Go code, comments, and documentation.

Q9:
End-to-end or integration tests (common terminology for acceptance tests in Go).

Q10:
Ginkgo or Go's built-in `testing` package (Ginkgo is a popular BDD framework for Go acceptance tests).

Q11:
GitHub Actions (most common CI for open-source Go projects).

Q12:
This tool automates infrastructure provisioning or configuration management (common purpose for CLI tools in Go repositories).
```
