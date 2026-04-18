# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 1193 paths, 2 anchor files, 4 doc files
**Call 1 — profile build:** 26607 prompt tokens → 905 completion tokens (profile)
**Call 2 — questions:** 1173 prompt tokens + 164 completion tokens
**Total tokens consumed:** 28849

**CHODE equivalent:** ~451 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 59x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 17/36 (47% of auto-scorable)
**Stump questions (8):** 11/24 (46%)

---

## AI-Built Profile

```
Primary language: Go (go 1.26.1, toolchain go1.26.2)

Frameworks and key libraries:
- Cobra (for CLI command structure)
- githubv4 (GitHub GraphQL API client)
- go-gh/v2 (GitHub CLI internal utilities)
- testify (testing assertions)
- charm.land/bubbletea/v2, charm.land/bubbles/v2, charm.land/huh/v2, charm.land/lipgloss/v2 (for TUI components)
- sigstore/sigstore-go, in-toto/attestation, theupdateframework/go-tuf/v2 (for attestation verification)
- microsoft/dev-tunnels (for Codespaces connection)

Package managers: Go modules

Test frameworks and commands:
- `go test ./...` (unit tests)
- `go test -tags acceptance ./acceptance` (acceptance tests, requiring `GH_ACCEPTANCE_HOST`, `GH_ACCEPTANCE_ORG`, `GH_ACCEPTANCE_TOKEN` environment variables)
- `make lint` (golangci-lint)
- `go generate ./...` (for generating mocks)

Project type: CLI application

Primary purpose: GitHub CLI (`gh`) is a command-line tool that brings GitHub functionalities like pull requests, issues, and other concepts to the terminal, allowing users to interact with GitHub directly from their development environment. It also supports attestation verification for downloaded releases.

Top directories and approximate file counts:
- pkg/cmd (700+ files): Contains the implementation of all CLI commands.
- acceptance (100+ files): Houses blackbox acceptance tests.
- internal (100+ files): Internal utilities and shared logic.
- api (20+ files): GitHub API client (GraphQL and REST).
- docs (50+ files): Documentation for development and installation.
- .github (30+ files): GitHub Actions workflows and community files.
- git (10+ files): Git client utilities.

Key entry point files:
- `cmd/gh/main.go`: Main entry point for the CLI application.
- `internal/ghcmd/cmd.go`: Initializes the root command.
- `pkg/cmd/root/root.go`: Defines the root command and registers subcommands.

Architecture pattern: The project follows a layered architecture with a clear separation of concerns. The `pkg/cmd` directory implements individual commands, which utilize shared utilities from `pkg/cmdutil`, `pkg/iostreams`, `api`, and `internal` packages. A "Options + Factory Pattern" is used for command structure, promoting testability and dependency injection.

Notable conventions or gotchas:
- **Options + Factory Pattern**: Each command has an `Options` struct, a `NewCmdFoo` constructor for test injection, and a separate `fooRun` function for business logic.
- **HTTP Mocking**: Extensive use of `httpmock.Registry` for testing API interactions, with `defer reg.Verify(t)` to ensure all stubs are called.
- **IOStreams**: `pkg/iostreams` provides an abstraction for I/O, including TTY detection and color support.
- **Error Handling**: Specific error types in `pkg/cmdutil/errors.go` for different error scenarios (e.g., flag validation, user cancellation).
- **Feature Detection**: Uses `internal/featuredetection` to adapt behavior based on GitHub.com vs. GitHub Enterprise Server capabilities, with `// TODO <cleanupIdentifier>` comments for linter compliance.
- **JSON Output**: Commands support `--json`, `--jq`, `--template` flags for structured output.
- **Acceptance Tests**: Blackbox tests interacting with real GitHub instances, requiring specific environment variables for execution.
- **Code Style**: Emphasizes godoc comments for exported entities and avoids unnecessary or redundant comments.
- **Generated Mocks**: Uses `moq` for generating interface mocks, requiring `go generate ./...` after interface changes.
- **Build Provenance Attestation**: Since version 2.50.0, releases include build provenance attestations verifiable via `gh at verify` or Sigstore `cosign`.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | Cobra | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test command | Objective | `go test ./...` (for unit tests) and `go test -tags acceptance ./acceptance` (for acceptance tests). | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `cmd/gh/main.go` | 1 _(auto)_ |
| Q6 | Largest package | Navigational | `pkg/cmd` with 700+ files. | 1 _(auto)_ |
| Q7 | Comment convention | Domain | godoc comments | 3 _(auto)_ |
| Q8 | Banned punctuation | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Acceptance test type | Domain | Blackbox tests. | 3 _(auto)_ |
| Q10 | Test framework | Domain | Not in profile. | 0 _(auto)_ |
| Q11 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | GitHub CLI (`gh`) is a command-line tool that brings GitHub functionalities like pull requests, issues, and other concepts to the terminal, allowing users to interact with GitHub directly from their development environment. | 3 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Go

Q2
Cobra

Q3
Not in profile.

Q4
`go test ./...` (for unit tests) and `go test -tags acceptance ./acceptance` (for acceptance tests).

Q5
`cmd/gh/main.go`

Q6
`pkg/cmd` with 700+ files.

Q7
godoc comments

Q8
Not in profile.

Q9
Blackbox tests.

Q10
Not in profile.

Q11
Not in profile.

Q12
GitHub CLI (`gh`) is a command-line tool that brings GitHub functionalities like pull requests, issues, and other concepts to the terminal, allowing users to interact with GitHub directly from their development environment.
```
