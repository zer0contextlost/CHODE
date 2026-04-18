# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** gh-cli
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 1193 paths, 2 anchor files, 4 doc files
**Call 1 — profile build:** 23268 prompt tokens → 747 completion tokens (profile)
**Call 2 — questions:** 1003 prompt tokens + 137 completion tokens
**Total tokens consumed:** 25155

**CHODE equivalent:** ~451 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 52x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 19/36 (53% of auto-scorable)
**Stump questions (8):** 12/24 (50%)

---

## AI-Built Profile

```
Here's a compressed profile of the GitHub CLI (`gh`) repository:

Primary language: Go (version 1.26+ as specified in go.mod)
Key libraries/frameworks: Cobra (CLI framework), go-gh (GitHub API client), testify (testing), httpmock (HTTP mocking), bubbletea/huh (TUI components), gock (HTTP testing), opentracing, sigstore (attestation)
Package manager: Go Modules (go.mod/go.sum)
Test frameworks: Go's built-in testing package with testify/require, testscript for acceptance tests
Test commands: `go test ./...` (unit tests), `go test -tags acceptance ./acceptance` (acceptance tests), `make lint` (golangci-lint)

Project type: CLI application (monorepo structure containing the main application and supporting packages)
Primary purpose: Official GitHub command-line tool that brings GitHub functionality (pull requests, issues, repositories, etc.) directly to the terminal alongside git operations.

Top directories and file counts:
- pkg/cmd/ (500+ files): Command implementations (~100 subcommands)
- internal/ (200+ files): Core functionality packages
- api/ (20 files): GitHub API client
- acceptance/ (100+ files): Acceptance test scripts
- .github/workflows/ (15 files): CI/CD pipelines
- docs/ (20 files): Documentation
- cmd/ (5 files): Main entry points

Key entry point files:
- cmd/gh/main.go (main application entry)
- pkg/cmd/root/root.go (root command setup)
- internal/ghcmd/cmd.go (command execution core)
- pkg/cmd/factory/default.go (dependency injection)

Architecture pattern: Command pattern with dependency injection (Factory pattern). Each command follows the Options + Factory pattern where:
1. Options struct holds dependencies and flags
2. NewCmdX constructor wires dependencies
3. Separate run function contains business logic
4. Commands register in root command

Notable conventions/gotchas:
- Strict separation between command implementation (pkg/cmd/) and core logic (internal/)
- HTTP mocking via httpmock.Registry with verification
- Table-driven tests with testify assertions
- Feature detection with TODO cleanup comments for GHES compatibility
- JSON output support via --json/--jq/--template flags
- Build constraints for acceptance tests (//go:build acceptance)
- Custom testscript commands (defer, env2upper, replace, stdout2env)
- Generated mocks using moq (//go:generate directives)
- Error types in pkg/cmdutil/errors.go (FlagErrorf, SilentError, etc.)
- Lazy initialization of BaseRepo/Remotes/Branch in RunE
- Use of heredoc.Doc for command examples
- Strict godoc requirements for exported symbols
- No em dashes in code/comments/docs
- Command structure mirrors GitHub's API organization

The codebase follows a consistent pattern where each command lives in its own directory with:
- <command>.go (implementation)
- <command>_test.go (unit tests)
- http.go/http_test.go (API interactions)
- fixtures/ (test data)

Key architectural decisions include:
- Using go-gh for API interactions
- Factory pattern for dependency injection
- Testscript for acceptance testing
- Feature detection for GitHub Enterprise Server support
- Strict separation of concerns between UI, business logic, and API layers
- Comprehensive HTTP mocking for reliable tests
- JSON output support for scripting use cases
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | Cobra | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Test command | Objective | `go test ./...` (unit tests), `go test -tags acceptance ./acceptance` (acceptance tests) | 0 _(auto)_ |
| Q5 | Entry point | Navigational | cmd/gh/main.go | 1 _(auto)_ |
| Q6 | Largest package | Navigational | pkg/cmd/ with 500+ files | 1 _(auto)_ |
| Q7 | Comment convention | Domain | godoc | 3 _(auto)_ |
| Q8 | Banned punctuation | Domain | Em dash | 2 _(auto)_ |
| Q9 | Acceptance test type | Domain | Test scripts | 0 _(auto)_ |
| Q10 | Test framework | Domain | testscript | 2 _(auto)_ |
| Q11 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | Official GitHub command-line tool that brings GitHub functionality (pull requests, issues, repositories, etc.) directly to the terminal alongside git operations. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
Go

Q2:
Cobra

Q3:
Not in profile.

Q4:
`go test ./...` (unit tests), `go test -tags acceptance ./acceptance` (acceptance tests)

Q5:
cmd/gh/main.go

Q6:
pkg/cmd/ with 500+ files

Q7:
godoc

Q8:
Em dash

Q9:
Test scripts

Q10:
testscript

Q11:
GitHub Actions

Q12:
Official GitHub command-line tool that brings GitHub functionality (pull requests, issues, repositories, etc.) directly to the terminal alongside git operations.
```
