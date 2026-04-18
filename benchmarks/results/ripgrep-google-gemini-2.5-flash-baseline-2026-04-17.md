# CHODE Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 259 prompt + 205 completion = 464 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 30/36 (83% of auto-scorable)
**Stump questions (6):** 13/18 (72% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | This project uses the `anyhow` crate for error handling. | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | This project uses the `serde` crate for serialization and deserialization. | 2 _(auto)_ |
| Q5 | Entry point | Navigational | The main entry point file is `src/main.rs`. | 2 _(auto)_ |
| Q6 | CI system | Objective | This project uses GitHub Actions for CI. | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | The flag that disables ALL automatic filtering in ripgrep is `--no-ignore`. | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | This project uses `cargo-fuzz` for fuzz testing. It can be installed with `cargo install cargo-fuzz`. | 3 _(auto)_ |
| Q9 | Largest workspace | Navigational | The `crates/core` workspace has the most files. | 2 _(auto)_ |
| Q10 | Platform packages | Navigational | This project provides platform-specific distribution packages for Debian, RPM, macOS (Homebrew), and Windows (Scoop). | 3 _(auto)_ |
| Q11 | Project type | Inferential | This is a CLI tool. | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool is a line-oriented search tool that recursively searches the current directory for a regex pattern. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 30)_

---

## Raw Model Response

```
Q1: Rust
Q2: Cargo
Q3: This project uses the `anyhow` crate for error handling.
Q4: This project uses the `serde` crate for serialization and deserialization.
Q5: The main entry point file is `src/main.rs`.
Q6: This project uses GitHub Actions for CI.
Q7: The flag that disables ALL automatic filtering in ripgrep is `--no-ignore`.
Q8: This project uses `cargo-fuzz` for fuzz testing. It can be installed with `cargo install cargo-fuzz`.
Q9: The `crates/core` workspace has the most files.
Q10: This project provides platform-specific distribution packages for Debian, RPM, macOS (Homebrew), and Windows (Scoop).
Q11: This is a CLI tool.
Q12: This tool is a line-oriented search tool that recursively searches the current directory for a regex pattern.
```
