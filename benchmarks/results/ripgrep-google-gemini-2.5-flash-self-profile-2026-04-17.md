# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 222 paths, 2 anchor files, 6 doc files
**Call 1 — profile build:** 13908 prompt tokens → 827 completion tokens (profile)
**Call 2 — questions:** 1085 prompt tokens + 169 completion tokens
**Total tokens consumed:** 15989

**CHODE equivalent:** ~189 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 74x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 23/36 (64% of auto-scorable)
**Stump questions (6):** 10/18 (56%)

---

## AI-Built Profile

```
Primary language: Rust (edition 2024, rust-version 1.85)

Frameworks and key libraries:
The project is built on Rust's standard library and several custom crates within its workspace. Key external dependencies include `anyhow` for error handling, `bstr` for byte string manipulation, `lexopt` for argument parsing, `log` for logging, `serde_json` for JSON serialization/deserialization, `termcolor` for terminal coloring, and `textwrap` for text wrapping. It also conditionally uses `tikv-jemallocator` for memory allocation on specific `musl` targets.

Package managers:
Cargo is the primary package manager for Rust.

Test frameworks and test commands:
The project uses Rust's built-in `cargo test` for unit and integration tests. Integration tests are defined in `tests/tests.rs`. Fuzz testing is also employed using `cargo-fuzz`, with targets like `fuzz_glob` (run via `cargo fuzz run <target>`). Benchmarking is done with `benchsuite/benchsuite`.

Project type:
CLI application, organized as a monorepo.

Primary purpose:
Ripgrep is a fast, line-oriented search tool that recursively searches directories for regex patterns, respecting `.gitignore` rules and automatically skipping hidden/binary files. It aims to be a superior alternative to `grep` and similar tools.

Top directories and approximate file counts:
- `.github/`: ~5 files (CI/CD workflows, issue templates)
- `benchsuite/`: ~20 files (benchmarking scripts and historical run data)
- `ci/`: ~5 files (CI utility scripts)
- `crates/`: ~150 files (core logic, organized into several internal crates: `cli`, `core`, `globset`, `grep`, `ignore`, `matcher`, `pcre2`, `printer`, `regex`, `searcher`)
- `fuzz/`: ~5 files (fuzz testing setup)
- `pkg/`: ~5 files (packaging configurations for Homebrew, Windows)
- `tests/`: ~20 files (integration tests and test data)

Key entry point files:
- `Cargo.toml`: Main project manifest, defines the `rg` binary.
- `crates/core/main.rs`: The main entry point for the `rg` executable.
- `build.rs`: Build script for the main `ripgrep` package.

Architecture pattern:
The project follows a modular, monorepo architecture, where core functionalities are broken down into several independent Rust crates (e.g., `globset`, `grep`, `ignore`, `regex`, `searcher`, `printer`). These crates are then composed by the main `crates/core` crate to form the `ripgrep` CLI application. This promotes reusability and clear separation of concerns.

Notable conventions or gotchas:
- Extensive use of internal crates within a workspace for modularity.
- Detailed `CHANGELOG.md`, `FAQ.md`, and `GUIDE.md` for user and developer documentation.
- CI/CD workflows (`.github/workflows/`) for continuous integration and release management.
- Specific build profiles (`release-lto`, `deb`) in `Cargo.toml` for optimized releases and Debian packaging.
- Fuzz testing is integrated, indicating a focus on robustness.
- The `RELEASE-CHECKLIST.md` provides a comprehensive guide for maintainers to ensure consistent releases, including updating dependencies, generating man pages, and publishing to `crates.io`.
- The project explicitly excludes certain directories from the published crate (`HomebrewFormula`, `.github/`, `ci/`, `pkg/brew`, `benchsuite/`, `scripts/`, `crates/fuzz`), indicating a clean separation between development/packaging artifacts and the core library.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust (edition 2024, rust-version 1.85) | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | `anyhow` | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | `serde_json` | 3 _(auto)_ |
| Q5 | Entry point | Navigational | `crates/core/main.rs` | 3 _(auto)_ |
| Q6 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Disable filtering flag | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | `cargo-fuzz` is used for fuzz testing. Not in profile how to install it. | 1 _(auto)_ |
| Q9 | Largest workspace | Navigational | `crates/` | 2 _(auto)_ |
| Q10 | Platform packages | Navigational | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | CLI application | 2 _(auto)_ |
| Q12 | Primary purpose | Objective | Ripgrep is a fast, line-oriented search tool that recursively searches directories for regex patterns, respecting `.gitignore` rules and automatically skipping hidden/binary files. | 3 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
Rust (edition 2024, rust-version 1.85)

Q2:
Cargo

Q3:
`anyhow`

Q4:
`serde_json`

Q5:
`crates/core/main.rs`

Q6:
Not in profile.

Q7:
Not in profile.

Q8:
`cargo-fuzz` is used for fuzz testing. Not in profile how to install it.

Q9:
`crates/`

Q10:
Not in profile.

Q11:
CLI application

Q12:
Ripgrep is a fast, line-oriented search tool that recursively searches directories for regex patterns, respecting `.gitignore` rules and automatically skipping hidden/binary files.
```
