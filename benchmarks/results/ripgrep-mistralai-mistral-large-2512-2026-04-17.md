# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
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
| Q1 | Language | Objective | rust | 3 _(auto)_ |
| Q2 | Package manager | Objective | cargo | 3 _(auto)_ |
| Q3 | Error handling crate | Objective | anyhow | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | serde_json | 3 _(auto)_ |
| Q5 | Entry point | Navigational | crates/core/main.rs | 3 _(auto)_ |
| Q6 | CI system | Objective | github-actions | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | -uuu | 3 _(auto)_ |
| Q8 | Fuzz tool | Domain | cargo-fuzz; install it by running `cargo install cargo-fuzz` from the `fuzz` directory. | 3 _(auto)_ |
| Q9 | Largest workspace | Navigational | crates | 2 _(auto)_ |
| Q10 | Platform packages | Navigational | windows, brew | 3 _(auto)_ |
| Q11 | Project type | Inferential | CLI tool | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | ripgrep is a line-oriented search tool that recursively searches the current directory for a regex pattern. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 35)_

---

## Raw Model Response

```
Q1:
rust

Q2:
cargo

Q3:
anyhow

Q4:
serde_json

Q5:
crates/core/main.rs

Q6:
github-actions

Q7:
-uuu

Q8:
cargo-fuzz; install it by running `cargo install cargo-fuzz` from the `fuzz` directory.

Q9:
crates

Q10:
windows, brew

Q11:
CLI tool

Q12:
ripgrep is a line-oriented search tool that recursively searches the current directory for a regex pattern.
```
