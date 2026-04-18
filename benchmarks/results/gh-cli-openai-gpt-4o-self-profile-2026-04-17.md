# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 1193 paths, 2 anchor files, 4 doc files
**Call 1 — profile build:** 20945 prompt tokens → 530 completion tokens (profile)
**Call 2 — questions:** 779 prompt tokens + 130 completion tokens
**Total tokens consumed:** 22384

**CHODE equivalent:** ~451 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 46x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 9/36 (25% of auto-scorable)
**Stump questions (8):** 5/24 (21%)

---

## AI-Built Profile

```
This repository is a Go-based project primarily focused on developing a command-line interface (CLI) tool for interacting with GitHub. The primary language used is Go, with the project specifying Go version 1.26.1 in its `go.mod` file. The project leverages several key libraries and frameworks, including `github.com/spf13/cobra` for command-line parsing, `github.com/stretchr/testify` for testing, and `github.com/cli/go-gh/v2` for GitHub API interactions.

The package manager used is Go Modules, as indicated by the presence of `go.mod` and `go.sum` files. The project employs `go test` for running tests, with specific tags like `acceptance` for running acceptance tests that interact with real GitHub instances. The test framework is built on Go's standard testing package, with additional support from `testify` for assertions and `httpmock` for HTTP request mocking.

This project is a CLI application designed to bring GitHub functionalities such as pull requests and issues to the terminal, enhancing the developer's workflow alongside `git`. It is not a monorepo but a focused CLI tool with a clear purpose.

The top directories include:
- `pkg/cmd/`: Contains command implementations for the CLI, with approximately 400 files.
- `internal/`: Houses internal packages for feature detection, configuration, and more, with around 150 files.
- `api/`: Manages GitHub API client code, with about 20 files.
- `acceptance/`: Contains acceptance tests, with around 50 files.
- `docs/`: Provides documentation for developers, with about 20 files.

Key entry point files are `cmd/gh/main.go` for the CLI application and `internal/ghcmd/cmd.go` for command execution. The architecture follows a modular pattern, with a clear separation between command definitions, API interactions, and internal utilities.

Notable conventions include the use of the Options + Factory pattern for command structuring, where each command has an `Options` struct, a constructor function, and a separate run function for business logic. The project also emphasizes testability, with commands designed to be easily testable through dependency injection.

A notable gotcha is the use of build constraints for acceptance tests, requiring specific environment variables and tags to run. Additionally, the project includes a comprehensive set of scripts and workflows for CI/CD, emphasizing code quality and coverage.

Overall, this repository is a well-structured CLI tool project with a focus on providing a seamless GitHub experience from the command line, leveraging Go's strengths in concurrency and performance.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | `github.com/spf13/cobra` | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test command | Objective | `go test` | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `cmd/gh/main.go` | 1 _(auto)_ |
| Q6 | Largest package | Navigational | `pkg/cmd/`: Contains approximately 400 files. | 1 _(auto)_ |
| Q7 | Comment convention | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Banned punctuation | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | Acceptance tests that interact with real GitHub instances. | 0 _(auto)_ |
| Q10 | Test framework | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool's primary purpose is to bring GitHub functionalities such as pull requests and issues to the terminal, enhancing the developer's workflow alongside `git`. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1  
Go

Q2  
`github.com/spf13/cobra`

Q3  
Not in profile.

Q4  
`go test`

Q5  
`cmd/gh/main.go`

Q6  
`pkg/cmd/`: Contains approximately 400 files.

Q7  
Not in profile.

Q8  
Not in profile.

Q9  
Acceptance tests that interact with real GitHub instances.

Q10  
Not in profile.

Q11  
Not in profile.

Q12  
This tool's primary purpose is to bring GitHub functionalities such as pull requests and issues to the terminal, enhancing the developer's workflow alongside `git`.
```
