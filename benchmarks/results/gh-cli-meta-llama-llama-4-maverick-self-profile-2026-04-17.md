# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 1193 paths, 2 anchor files, 4 doc files
**Call 1 — profile build:** 19802 prompt tokens → 564 completion tokens (profile)
**Call 2 — questions:** 815 prompt tokens + 108 completion tokens
**Total tokens consumed:** 21289

**CHODE equivalent:** ~451 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 44x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 14/36 (39% of auto-scorable)
**Stump questions (8):** 10/24 (42%)

---

## AI-Built Profile

```
The primary language of this repository is Go, with a version specified in the go.mod file as 1.26.1. The project is a Command-Line Interface (CLI) tool, specifically the GitHub CLI, denoted by the module path github.com/cli/cli/v2.

The project utilizes several key libraries and frameworks, including the Cobra command framework (github.com/spf13/cobra v1.10.2), the Survey library for interactive prompts (github.com/AlecAivazis/survey/v2 v2.3.7), and the Lip Gloss library for text styling (charm.land/lipgloss/v2 v2.0.2). It also leverages the GitHub GraphQL API client (github.com/shurcooL/githubv4 v0.0.0-20240727222349-48295856cce7) and the Go Git library (github.com/go-git/go-git/v5).

The package manager used is Go Modules, as evidenced by the presence of go.mod and go.sum files.

The test framework used is Go's built-in testing package, with additional libraries like Testify (github.com/stretchr/testify v1.11.1) for assertions and HTTPmock (pkg/httpmock/) for mocking HTTP requests. The acceptance tests are built on top of the go-internal/testscript package. The test commands include go test ./... for unit tests and go test -tags=acceptance ./acceptance for acceptance tests.

The project is a CLI application, and its primary purpose is to bring GitHub functionality to the terminal, allowing users to interact with GitHub from the command line.

The top directories in the repository include pkg/ (containing command implementations), internal/ (containing internal packages), api/ (containing GitHub API client code), and docs/ (containing documentation). The approximate file count is over 1193 files.

The key entry point files are cmd/gh/main.go, which calls into internal/ghcmd.Main(), and pkg/cmd/root/root.go, which defines the root command.

The architecture pattern appears to be a modular, command-based structure, with each command living in its own package under pkg/cmd/. The project follows a factory pattern, with a factory object (cmdutil.Factory) providing dependencies to commands.

Notable conventions include the use of table-driven tests, the Options + Factory pattern for command implementation, and the use of // TODO comments for feature detection cleanup. The project also has a specific code style, with guidelines for godoc comments, error handling, and code organization. 

The repository is well-structured and follows standard Go conventions, making it easy to navigate and understand. However, the presence of a large number of files and the complexity of the codebase may require some time to fully comprehend.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | Cobra command framework | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test command | Objective | go test ./... | 0 _(auto)_ |
| Q5 | Entry point | Navigational | cmd/gh/main.go | 1 _(auto)_ |
| Q6 | Largest package | Navigational | Not in profile. | 0 _(auto)_ |
| Q7 | Comment convention | Domain | godoc comments | 3 _(auto)_ |
| Q8 | Banned punctuation | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | Test framework | Domain | go-internal/testscript package | 3 _(auto)_ |
| Q11 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | The primary purpose is to bring GitHub functionality to the terminal, allowing users to interact with GitHub from the command line. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Go

Q2
Cobra command framework

Q3
Not in profile.

Q4
go test ./...

Q5
cmd/gh/main.go

Q6
Not in profile.

Q7
godoc comments

Q8
Not in profile.

Q9
Not in profile.

Q10
go-internal/testscript package

Q11
Not in profile.

Q12
The primary purpose is to bring GitHub functionality to the terminal, allowing users to interact with GitHub from the command line.
```
