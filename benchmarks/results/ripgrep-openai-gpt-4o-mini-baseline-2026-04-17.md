# CHODE Benchmark — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** ripgrep
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 241 prompt + 192 completion = 433 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 23/36 (64% of auto-scorable)
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
| Q3 | Error handling crate | Objective | This project uses the `anyhow` crate for error handling. | 3 _(auto)_ |
| Q4 | Serialization crate | Objective | The `serde` crate is used for serialization. | 2 _(auto)_ |
| Q5 | Entry point | Navigational | The main entry point file is `main.rs`. | 2 _(auto)_ |
| Q6 | CI system | Objective | GitHub Actions is configured as the CI system. | 3 _(auto)_ |
| Q7 | Disable filtering flag | Domain | The flag that disables ALL automatic filtering in ripgrep is `--no-ignore`. | 0 _(auto)_ |
| Q8 | Fuzz tool | Domain | This project uses `cargo-fuzz` for fuzz testing, and it can be installed with `cargo install cargo-fuzz`. | 3 _(auto)_ |
| Q9 | Largest workspace | Navigational | The top-level workspace with the most files is likely the `src` directory. | 0 _(auto)_ |
| Q10 | Platform packages | Navigational | Platform-specific distribution packages may include `.deb` for Debian-based systems and `.rpm` for Red Hat-based systems. | 0 _(auto)_ |
| Q11 | Project type | Inferential | This is a CLI tool. | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | This tool's primary purpose is to search for patterns in files efficiently. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 23)_

---

## Raw Model Response

```
Q1: Rust  
Q2: Cargo  
Q3: This project uses the `anyhow` crate for error handling.  
Q4: The `serde` crate is used for serialization.  
Q5: The main entry point file is `main.rs`.  
Q6: GitHub Actions is configured as the CI system.  
Q7: The flag that disables ALL automatic filtering in ripgrep is `--no-ignore`.  
Q8: This project uses `cargo-fuzz` for fuzz testing, and it can be installed with `cargo install cargo-fuzz`.  
Q9: The top-level workspace with the most files is likely the `src` directory.  
Q10: Platform-specific distribution packages may include `.deb` for Debian-based systems and `.rpm` for Red Hat-based systems.  
Q11: This is a CLI tool.  
Q12: This tool's primary purpose is to search for patterns in files efficiently.
```
