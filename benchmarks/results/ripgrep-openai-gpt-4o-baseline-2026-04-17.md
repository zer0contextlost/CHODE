# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 241 prompt + 108 completion = 349 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 25/36 (69% of auto-scorable)
**Stump questions (6):** 10/18 (56% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | anyhow | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | serde | 2 _(auto)_ |
| Q5 | Entry point | Navigational | main.rs | 2 _(auto)_ |
| Q6 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | --no-ignore | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | cargo-fuzz; install it with `cargo install cargo-fuzz` | 3 _(auto)_ |
| Q9 | Largest workspace | Navigational | crates | 2 _(auto)_ |
| Q10 | Platform packages | Navigational | Debian packages | 0 _(auto)_ |
| Q11 | Project type | Inferential | CLI tool | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | The primary purpose of ripgrep is to search for text patterns within files efficiently. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 25)_

---

## Raw Model Response

```
Q1:  
Rust

Q2:  
Cargo

Q3:  
anyhow

Q4:  
serde

Q5:  
main.rs

Q6:  
GitHub Actions

Q7:  
--no-ignore

Q8:  
cargo-fuzz; install it with `cargo install cargo-fuzz`

Q9:  
crates

Q10:  
Debian packages

Q11:  
CLI tool

Q12:  
The primary purpose of ripgrep is to search for text patterns within files efficiently.
```
