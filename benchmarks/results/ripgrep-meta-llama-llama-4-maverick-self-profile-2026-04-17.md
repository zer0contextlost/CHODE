# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 222 paths, 2 anchor files, 6 doc files
**Call 1 — profile build:** 11440 prompt tokens → 533 completion tokens (profile)
**Call 2 — questions:** 840 prompt tokens + 103 completion tokens
**Total tokens consumed:** 12916

**CHODE equivalent:** ~189 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 61x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 18/36 (50% of auto-scorable)
**Stump questions (6):** 9/18 (50%)

---

## AI-Built Profile

```
The primary language of this repository is Rust, with a version specified in the `Cargo.toml` file as 1.85. The project is a command-line utility called ripgrep, which is a line-oriented search tool that recursively searches the current directory for a regex pattern.

The framework used is Cargo, Rust's package manager, and key libraries include `anyhow`, `bstr`, `grep`, `ignore`, `lexopt`, `log`, `serde_json`, `termcolor`, and `textwrap`. The project also uses `tikv-jemallocator` as a dependency for certain target configurations.

The package manager used is Cargo, and the test framework is also built around Cargo, with tests defined in various files under the `tests` directory. Test commands can be run using `cargo test`.

This project is a CLI application, and its primary purpose is to provide a fast and efficient search tool that respects gitignore rules and automatically skips hidden files/directories and binary files.

The top directories in this repository include `crates`, which contains various sub-crates that make up the ripgrep project, `tests`, which contains test files, `benchsuite`, which contains benchmarking data, and `fuzz`, which contains fuzz testing code. The approximate file count is 222.

Key entry point files include `crates/core/main.rs`, which is the main entry point for the ripgrep binary, and `Cargo.toml`, which defines the project's dependencies and configuration.

The architecture pattern of this repository appears to be a monorepo, with multiple sub-crates and related projects contained within a single repository. The sub-crates are organized around specific functionality, such as glob matching, grep, and printing.

Notable conventions in this repository include the use of Rust's `Cargo` build system and the organization of code into sub-crates. The project also uses a consistent naming convention and coding style throughout.

One gotcha to be aware of is that the project uses a complex build configuration, with multiple profiles and dependencies defined in `Cargo.toml`. Additionally, the project has a number of dependencies that are not included in the default `Cargo.toml` configuration, but are instead defined in the `crates/*/Cargo.toml` files.

The `fuzz` directory contains fuzz testing code, which is used to test the project's stability and robustness. The `benchsuite` directory contains benchmarking data, which is used to measure the project's performance.

Overall, this repository is well-organized and follows standard Rust and Cargo conventions. However, its complexity and the number of sub-crates and dependencies may make it challenging for new contributors to navigate.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | anyhow | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | serde_json | 3 _(auto)_ |
| Q5 | Entry point | Navigational | crates/core/main.rs | 3 _(auto)_ |
| Q6 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Disable filtering flag | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | Largest workspace | Navigational | Not in profile. | 0 _(auto)_ |
| Q10 | Platform packages | Navigational | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | CLI application | 2 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool provides a fast and efficient search functionality that respects gitignore rules and automatically skips hidden files/directories and binary files. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Rust

Q2
Cargo

Q3
anyhow

Q4
serde_json

Q5
crates/core/main.rs

Q6
Not in profile.

Q7
Not in profile.

Q8
Not in profile.

Q9
Not in profile.

Q10
Not in profile.

Q11
CLI application

Q12
This tool provides a fast and efficient search functionality that respects gitignore rules and automatically skips hidden files/directories and binary files.
```
