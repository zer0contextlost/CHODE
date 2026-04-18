# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 1193 paths, 2 anchor files, 4 doc files
**Call 1 — profile build:** 26608 prompt tokens → 2561 completion tokens (profile)
**Call 2 — questions:** 1003 prompt tokens + 1661 completion tokens
**Total tokens consumed:** 31833

**CHODE equivalent:** ~451 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 59x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 12/36 (33% of auto-scorable)
**Stump questions (8):** 8/24 (33%)

---

## AI-Built Profile

```
Primary language(s) and version:
Go, version 1.26.

Framework(s) and key libraries:
The application is a command-line interface built with the `spf13/cobra` framework. For creating rich, interactive terminal user interfaces (TUIs), it relies heavily on the Charm stack, including `charm.land/bubbletea`, `charm.land/huh`, and `charm.land/lipgloss`. GitHub API interactions are handled by a combination of a custom client in the `api/` directory and the `github.com/cli/go-gh` library. For security, it uses `sigstore/sigstore-go` to implement build provenance attestation for its release binaries.

Package manager(s):
Go Modules, managed via `go.mod` and `go.sum` files.

Test framework(s) and test commands:
Testing uses the standard Go `testing` package, augmented with `github.com/stretchr/testify` for assertions. The project features a custom HTTP mocking library (`pkg/httpmock`) for unit tests and a comprehensive acceptance test suite (`acceptance/`) built on `go-internal/testscript`.
- Unit tests: `go test ./...`
- Acceptance tests: `go test -tags acceptance ./acceptance` (requires special environment variables)
- Linting: `make lint` (uses `golangci-lint`)

Project type:
A standalone Command-Line Interface (CLI) application.

Primary purpose in 1-2 sentences:
`gh` is the official GitHub CLI. It brings GitHub functionality like pull requests, issues, actions, and repository management directly to the terminal, aiming to reduce context switching and streamline developer workflows.

Top directories and approximate file counts:
- `pkg/cmd/`: ~750 files. Contains the implementation for all CLI commands.
- `acceptance/`: ~120 files. Holds the acceptance test suite and its test data.
- `internal/`: ~100 files. Contains internal packages used across the application.
- `docs/`: ~50 files. Developer-facing documentation.
- `api/`: ~25 files. The client for interacting with the GitHub GraphQL and REST APIs.

Key entry point files:
- `cmd/gh/main.go`: The main application entry point.
- `pkg/cmd/root/root.go`: Defines the root `gh` command and assembles all subcommands.
- `acceptance/acceptance_test.go`: The entry point and configuration for the acceptance test suite.

Architecture pattern (if identifiable):
The project follows a clean, testable "Options + Factory Pattern" on top of the `cobra` framework. Each command has a dedicated `Options` struct to hold its flags and dependencies (like I/O streams, HTTP client, config). A central `Factory` is responsible for creating and providing these dependencies, effectively decoupling command logic from global application state.

Notable conventions or gotchas:
A strict separation exists between unit tests, which use extensive HTTP mocking, and acceptance tests. The acceptance tests are run with a special build tag (`-tags acceptance`) and require authentication tokens and a target GitHub organization to be set via environment variables. The codebase includes feature detection logic to handle differences between GitHub.com and various versions of GitHub Enterprise Server (GHES). The CLI is not just a simple flag-based tool; it provides rich, interactive prompts and views for many commands.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | `spf13/cobra` | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test command | Objective | `go test ./...` for unit tests, and `go test -tags acceptance ./acceptance` for acceptance tests. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `cmd/gh/main.go` | 1 _(auto)_ |
| Q6 | Largest package | Navigational | `pkg/cmd/` with approximately 750 files. | 1 _(auto)_ |
| Q7 | Comment convention | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Banned punctuation | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | A comprehensive acceptance test suite. | 0 _(auto)_ |
| Q10 | Test framework | Domain | `go-internal/testscript` | 3 _(auto)_ |
| Q11 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | It brings GitHub functionality like pull requests, issues, actions, and repository management directly to the terminal, aiming to reduce context switching and streamline developer workflows. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Go

Q2
`spf13/cobra`

Q3
Not in profile.

Q4
`go test ./...` for unit tests, and `go test -tags acceptance ./acceptance` for acceptance tests.

Q5
`cmd/gh/main.go`

Q6
`pkg/cmd/` with approximately 750 files.

Q7
Not in profile.

Q8
Not in profile.

Q9
A comprehensive acceptance test suite.

Q10
`go-internal/testscript`

Q11
Not in profile.

Q12
It brings GitHub functionality like pull requests, issues, actions, and repository management directly to the terminal, aiming to reduce context switching and streamline developer workflows.
```
