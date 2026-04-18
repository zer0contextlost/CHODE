# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 248 prompt + 326 completion = 574 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 29/36 (81% of auto-scorable)
**Stump questions (6):** 14/18 (78% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | The project uses Rust's built-in `Result` and `Error` types, along with the `anyhow` crate for error handling in some cases. For lower-level error handling, it may also use `thiserror`. | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | `serde` (with `serde_json` for JSON serialization) | 3 _(auto)_ |
| Q5 | Entry point | Navigational | `src/main.rs` | 2 _(auto)_ |
| Q6 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | `--no-filters` or `--no-config` (but the exact flag to disable *all* automatic filtering is `--no-ignore` combined with `--hidden` and other ignore-related flags; the most comprehensive is likely `--no-ignore --hidden --no-messages`) | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | The project uses `cargo-fuzz` (based on libFuzzer). To install it, run: `cargo install cargo-fuzz` | 3 _(auto)_ |
| Q9 | Largest workspace | Navigational | The `ripgrep` crate (or `grep-cli` if considering workspaces, but `ripgrep` itself is the largest) | 0 _(auto)_ |
| Q10 | Platform packages | Navigational | Debian (.deb), RPM (.rpm), macOS Homebrew, Windows Chocolatey, and pre-built binaries for multiple platforms (Linux, macOS, Windows). | 3 _(auto)_ |
| Q11 | Project type | Inferential | CLI tool | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | A fast, user-friendly line-oriented search tool that recursively searches directories for regex patterns while respecting ignore rules. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 29)_

---

## Raw Model Response

```
Here are the answers based on my training knowledge (primarily about the `ripgrep` project, which is a well-known Rust-based tool that fits the context of these questions):

---

Q1:
Rust

Q2:
Cargo

Q3:
The project uses Rust's built-in `Result` and `Error` types, along with the `anyhow` crate for error handling in some cases. For lower-level error handling, it may also use `thiserror`.

Q4:
`serde` (with `serde_json` for JSON serialization)

Q5:
`src/main.rs`

Q6:
GitHub Actions

Q7:
`--no-filters` or `--no-config` (but the exact flag to disable *all* automatic filtering is `--no-ignore` combined with `--hidden` and other ignore-related flags; the most comprehensive is likely `--no-ignore --hidden --no-messages`)

Q8:
The project uses `cargo-fuzz` (based on libFuzzer). To install it, run:
`cargo install cargo-fuzz`

Q9:
The `ripgrep` crate (or `grep-cli` if considering workspaces, but `ripgrep` itself is the largest)

Q10:
Debian (.deb), RPM (.rpm), macOS Homebrew, Windows Chocolatey, and pre-built binaries for multiple platforms (Linux, macOS, Windows).

Q11:
CLI tool

Q12:
A fast, user-friendly line-oriented search tool that recursively searches directories for regex patterns while respecting ignore rules.
```
