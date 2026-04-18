# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 222 paths, 2 anchor files, 6 doc files
**Call 1 — profile build:** 13909 prompt tokens → 1931 completion tokens (profile)
**Call 2 — questions:** 1032 prompt tokens + 1624 completion tokens
**Total tokens consumed:** 18496

**CHODE equivalent:** ~189 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 74x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 25/36 (69% of auto-scorable)
**Stump questions (6):** 9/18 (50%)

---

## AI-Built Profile

```
Primary language(s) and version: Rust (2024 edition, requires rustc 1.85+).

Framework(s) and key libraries: This project does not use a major application framework. It is built as a collection of interdependent libraries (crates). Key dependencies include `anyhow` for error handling, `bstr` for efficient byte string operations, `termcolor` for colored terminal output, and `log` for logging. It heavily relies on its own set of internal crates like `grep`, `ignore`, `regex`, `searcher`, and `printer` for its core functionality.

Package manager(s): Cargo, the standard Rust package manager. This is evidenced by `Cargo.toml` and `Cargo.lock` files.

Test framework(s) and test commands: The project uses Rust's built-in testing framework (`cargo test`). The main integration test suite is defined in `tests/tests.rs`. Additionally, it employs fuzz testing using `cargo-fuzz`, with targets defined in the `fuzz/` directory (e.g., `cargo fuzz run fuzz_glob`).

Project type: A command-line utility (CLI) structured as a monorepo using a Cargo workspace.

Primary purpose in 1-2 sentences: ripgrep is a high-performance, line-oriented search tool that recursively searches directories for a regex pattern. It is designed as a faster, more user-friendly replacement for tools like `grep`, with built-in respect for `.gitignore` rules and automatic filtering of hidden and binary files.

Top directories and approximate file counts:
- `crates/` (130+ files): The core source code, organized into a Cargo workspace with multiple crates (`core`, `ignore`, `searcher`, `printer`, `regex`, etc.).
- `benchsuite/` (~30 files): Contains benchmarking scripts and historical performance data.
- `tests/` (~25 files): Holds integration tests and associated test data.
- `.github/` (~5 files): Contains CI/CD workflows (GitHub Actions) and issue templates.
- `pkg/` (~5 files): Packaging scripts for Homebrew and Windows.

Key entry point files: The main application entry point is `crates/core/main.rs`, which is compiled into the `rg` executable as defined in the root `Cargo.toml`.

Architecture pattern: The project follows a modular, library-first architecture within a Cargo workspace. The top-level `ripgrep` package is a thin binary crate that orchestrates functionality from other specialized, internal crates. For example, the `ignore` crate handles directory traversal and file filtering, the `searcher` crate implements the core search logic, the `regex` crate provides the default matching engine, and the `printer` crate manages formatted output. This separation of concerns allows for clear boundaries, independent development, and potential reuse of the component libraries.

Notable conventions or gotchas:
- The project is a monorepo containing multiple interdependent crates within the `crates/` directory, managed as a single Cargo workspace.
- Performance is a primary design goal, with a dedicated `benchsuite` and extensive benchmarks in the README.
- The tool can self-generate documentation, including its man page (`--generate man`) and shell completion scripts for bash, fish, zsh, and PowerShell.
- The `RELEASE-CHECKLIST.md` outlines a detailed, multi-step process for publishing new versions of the main tool and its constituent crates.
- PCRE2 regex support is an optional feature, enabled via a Cargo feature flag (`--features pcre2`), which demonstrates a pattern of conditionally compiling in heavy dependencies.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust (2024 edition, requires rustc 1.85+). | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo, the standard Rust package manager. | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | `anyhow` | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | Entry point | Navigational | `crates/core/main.rs` | 3 _(auto)_ |
| Q6 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Largest workspace | Navigational | `crates/` | 2 _(auto)_ |
| Q10 | Platform packages | Navigational | Packaging scripts for Homebrew and Windows. | 3 _(auto)_ |
| Q11 | Project type | Inferential | A command-line utility (CLI). | 2 _(auto)_ |
| Q12 | Primary purpose | Objective | ripgrep is a high-performance, line-oriented search tool that recursively searches directories for a regex pattern. | 3 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Rust (2024 edition, requires rustc 1.85+).

Q2
Cargo, the standard Rust package manager.

Q3
`anyhow`

Q4
Not in profile.

Q5
`crates/core/main.rs`

Q6
GitHub Actions

Q7
Not in profile.

Q8
Not in profile.

Q9
`crates/`

Q10
Packaging scripts for Homebrew and Windows.

Q11
A command-line utility (CLI).

Q12
ripgrep is a high-performance, line-oriented search tool that recursively searches directories for a regex pattern.
```
