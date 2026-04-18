# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 1193 paths, 2 anchor files, 4 doc files
**Call 1 — profile build:** 20945 prompt tokens → 619 completion tokens (profile)
**Call 2 — questions:** 868 prompt tokens + 135 completion tokens
**Total tokens consumed:** 22567

**CHODE equivalent:** ~451 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 46x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 8/36 (22% of auto-scorable)
**Stump questions (8):** 4/24 (17%)

---

## AI-Built Profile

```
This repository is primarily written in Go (version 1.26.1) and serves as the GitHub Command Line Interface (CLI) tool, known as `gh`. It allows users to interact with GitHub directly from the terminal, facilitating operations such as managing pull requests, issues, and repositories alongside standard Git commands.

The project utilizes several key libraries, including:
- `github.com/spf13/cobra` for command-line argument parsing and command structure.
- `github.com/AlecAivazis/survey/v2` for interactive prompts.
- `github.com/cli/go-gh/v2` for internal GitHub API interactions.
- `github.com/stretchr/testify` for testing assertions.

The package manager used is Go Modules, with dependencies specified in `go.mod` and `go.sum`. The repository employs the `go test` command for unit testing, with acceptance tests requiring the `-tags=acceptance` flag. The command to run all tests is `go test ./...`, while acceptance tests can be executed with `GH_ACCEPTANCE_HOST=<host> GH_ACCEPTANCE_ORG=<org> GH_ACCEPTANCE_TOKEN=<token> go test -tags=acceptance ./acceptance`.

This project is classified as a CLI application, designed to enhance user interaction with GitHub through command-line operations. Its primary purpose is to provide a seamless interface for GitHub functionalities, making it easier for developers to manage their projects without leaving the terminal.

The top-level directories include:
- `cmd/` (approximately 300 files): Contains command implementations for various GitHub functionalities.
- `pkg/` (approximately 200 files): Houses utility packages and command-related logic.
- `internal/` (approximately 300 files): Contains internal logic, including API interactions and feature detection.
- `acceptance/` (approximately 50 files): Contains acceptance tests that interact with a real GitHub instance.
- `docs/` (approximately 20 files): Documentation related to the project.

Key entry point files include:
- `cmd/gh/main.go`: The main entry point for the CLI application.
- `internal/ghcmd.Main()`: The function that initializes the command structure.
- `pkg/cmd/root/root.go`: Defines the root command and subcommands.

The architecture follows a modular design pattern, with a clear separation of concerns. Each command is encapsulated within its own package, following the Options + Factory pattern. This structure allows for easy testing and extensibility, as commands can be added or modified independently.

Notable conventions include the use of table-driven tests for unit testing, which is a common Go practice for handling multiple input/output scenarios. The repository also emphasizes the importance of using `require` from the `testify` library for error checks to ensure immediate test halting on failure. Additionally, the acceptance tests require specific environment variables to be set, which can be a gotcha for new contributors.

Overall, this repository exemplifies a well-structured Go CLI application, leveraging modern Go practices and libraries to provide a robust tool for GitHub users.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | github.com/spf13/cobra | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test command | Objective | go test ./... | 0 _(auto)_ |
| Q5 | Entry point | Navigational | cmd/gh/main.go | 1 _(auto)_ |
| Q6 | Largest package | Navigational | cmd/ (approximately 300 files) | 0 _(auto)_ |
| Q7 | Comment convention | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Banned punctuation | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | Notable conventions include the use of table-driven tests for unit testing. | 0 _(auto)_ |
| Q10 | Test framework | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | To provide a seamless interface for GitHub functionalities, making it easier for developers to manage their projects without leaving the terminal. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:  
Go

Q2:  
github.com/spf13/cobra

Q3:  
Not in profile.

Q4:  
go test ./...

Q5:  
cmd/gh/main.go

Q6:  
cmd/ (approximately 300 files)

Q7:  
Not in profile.

Q8:  
Not in profile.

Q9:  
Notable conventions include the use of table-driven tests for unit testing.

Q10:  
Not in profile.

Q11:  
Not in profile.

Q12:  
To provide a seamless interface for GitHub functionalities, making it easier for developers to manage their projects without leaving the terminal.
```
