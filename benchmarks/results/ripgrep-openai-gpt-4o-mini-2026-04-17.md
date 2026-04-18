# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** ripgrep
**Profile size:** ~189 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 35/36 (97% of auto-scorable)
**Stump questions (6):** 18/18 (100% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Rust. | 3 _(auto)_ |
| Q2 | Package manager | Objective | Cargo. | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | Anyhow. | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | Serde_json. | 3 _(auto)_ |
| Q5 | Entry point | Navigational | crates/core/main.rs. | 3 _(auto)_ |
| Q6 | CI system | Objective | GitHub Actions. | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | rg -uuu. | 3 _(auto)_ |
| Q8 | Fuzz tool | Domain | cargo-fuzz; To install it, run `cargo install cargo-fuzz` from the fuzz directory. | 3 _(auto)_ |
| Q9 | Largest workspace | Navigational | Crates. | 2 _(auto)_ |
| Q10 | Platform packages | Navigational | Windows, Brew. | 3 _(auto)_ |
| Q11 | Project type | Inferential | CLI tool. | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | Ripgrep is a line-oriented search tool that recursively searches the current directory for regex patterns. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 35)_

---

## Raw Model Response

```
Q1:
Rust.

Q2:
Cargo.

Q3:
Anyhow.

Q4:
Serde_json.

Q5:
crates/core/main.rs.

Q6:
GitHub Actions.

Q7:
rg -uuu.

Q8:
cargo-fuzz; To install it, run `cargo install cargo-fuzz` from the fuzz directory.

Q9:
Crates.

Q10:
Windows, Brew.

Q11:
CLI tool.

Q12:
Ripgrep is a line-oriented search tool that recursively searches the current directory for regex patterns.
```
