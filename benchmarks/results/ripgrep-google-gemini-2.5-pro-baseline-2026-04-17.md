# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 259 prompt + 2260 completion = 2519 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 28/36 (78% of auto-scorable)
**Stump questions (6):** 13/18 (72% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust | 3 _(auto)_ |
| Q2 | Package manager | Objective | cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | anyhow | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | serde | 2 _(auto)_ |
| Q5 | Entry point | Navigational | src/main.rs | 2 _(auto)_ |
| Q6 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | -uuu | 3 _(auto)_ |
| Q8 | Fuzz tool | Domain | The project uses cargo-fuzz, which can be installed with `cargo install cargo-fuzz`. | 3 _(auto)_ |
| Q9 | Largest workspace | Navigational | grep-searcher | 0 _(auto)_ |
| Q10 | Platform packages | Navigational | The project contains packaging files for Chocolatey, Scoop, and scripts to build DEB and RPM packages. | 0 _(auto)_ |
| Q11 | Project type | Inferential | CLI tool | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | It is a fast, recursive command-line tool that searches directories for a regex pattern. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 28)_

---

## Raw Model Response

```
Q1:
Rust

Q2:
cargo

Q3:
anyhow

Q4:
serde

Q5:
src/main.rs

Q6:
GitHub Actions

Q7:
-uuu

Q8:
The project uses cargo-fuzz, which can be installed with `cargo install cargo-fuzz`.

Q9:
grep-searcher

Q10:
The project contains packaging files for Chocolatey, Scoop, and scripts to build DEB and RPM packages.

Q11:
CLI tool

Q12:
It is a fast, recursive command-line tool that searches directories for a regex pattern.
```
