# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 222 paths, 2 anchor files, 6 doc files
**Call 1 — profile build:** 13503 prompt tokens → 694 completion tokens (profile)
**Call 2 — questions:** 937 prompt tokens + 141 completion tokens
**Total tokens consumed:** 15275

**CHODE equivalent:** ~189 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 71x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 24/36 (67% of auto-scorable)
**Stump questions (6):** 7/18 (39%)

---

## AI-Built Profile

```
Here's a compressed profile of the ripgrep repository:

Primary language is Rust (edition 2024, minimum version 1.85). This is a pure Rust project with no other languages used in the core implementation.

Key frameworks and libraries include: regex for pattern matching, ignore for gitignore handling, termcolor for terminal output, serde_json for JSON output, lexopt for argument parsing, and tikv-jemallocator for memory allocation on musl 64-bit systems. The project also uses several internal crates (globset, grep, matcher, pcre2, printer, searcher, ignore) organized in a workspace.

Package management uses Cargo exclusively. All dependencies are specified in Cargo.toml files with version constraints. The project maintains a Cargo.lock file for reproducible builds.

Testing uses Rust's built-in test framework with custom test utilities. Integration tests are located in the tests/ directory and run via `cargo test`. The project also includes fuzz testing using cargo-fuzz with libfuzzer-sys, primarily targeting glob pattern matching. Benchmarking is done through a custom benchsuite/ directory containing historical performance data.

This is a monorepo containing both a CLI application and supporting libraries. The primary product is the "rg" command-line search tool that recursively searches directories for regex patterns. It's designed as a faster, more user-friendly alternative to grep with built-in gitignore support.

Top directories and approximate file counts:
- crates/ (9 crates, ~120 files) - Core library components
- benchsuite/ (30+ files) - Historical performance benchmarks
- tests/ (10 files) - Integration tests
- .github/ (10 files) - CI/CD workflows and issue templates
- fuzz/ (5 files) - Fuzz testing infrastructure

Key entry point files include:
- crates/core/main.rs - Main binary entry point
- Cargo.toml - Root package manifest
- build.rs - Build script for pre-processing
- crates/core/flags/ - Command-line argument definitions
- crates/core/search.rs - Core search implementation

The architecture follows a modular design with clear separation of concerns:
1. Argument parsing (flags/)
2. Search execution (search.rs, haystack.rs)
3. Result printing (printer/)
4. File system traversal (ignore/)

Notable conventions include:
- Extensive use of Rust's module system with each crate having its own lib.rs
- Heavy reliance on iterators and zero-copy parsing
- Custom flag parsing system that generates man pages and shell completions
- Multiple build profiles (release, release-lto, deb)
- Feature flags for optional PCRE2 regex support
- Exclusion of non-essential files from published crates

Gotchas include:
- The project uses custom argument parsing rather than clap or structopt
- Some features like PCRE2 support require explicit feature flags
- The build process generates man pages and shell completions
- Memory allocation is tuned differently for musl systems
- The project maintains separate licenses (MIT and UNLICENSE) for different components
- Some historical benchmark data is included in the repository

The codebase follows Rust's best practices with extensive documentation, clear error handling, and thorough testing. The project maintains high performance through careful optimization of hot paths and parallel execution where possible.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | Not in profile. | 0 _(auto)_ |
| Q4 | Serialization crate | Objective | serde_json | 3 _(auto)_ |
| Q5 | Entry point | Navigational | crates/core/main.rs | 3 _(auto)_ |
| Q6 | CI system | Objective | GitHub Actions (configured via .github/ directory) | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | cargo-fuzz with libfuzzer-sys. Installation method not in profile. | 1 _(auto)_ |
| Q9 | Largest workspace | Navigational | crates/ (9 crates, ~120 files) | 2 _(auto)_ |
| Q10 | Platform packages | Navigational | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | CLI tool and supporting libraries | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | A faster, more user-friendly alternative to grep that recursively searches directories for regex patterns with built-in gitignore support. | 3 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
Rust

Q2:
Cargo

Q3:
Not in profile.

Q4:
serde_json

Q5:
crates/core/main.rs

Q6:
GitHub Actions (configured via .github/ directory)

Q7:
Not in profile.

Q8:
cargo-fuzz with libfuzzer-sys. Installation method not in profile.

Q9:
crates/ (9 crates, ~120 files)

Q10:
Not in profile.

Q11:
CLI tool and supporting libraries

Q12:
A faster, more user-friendly alternative to grep that recursively searches directories for regex patterns with built-in gitignore support.
```
