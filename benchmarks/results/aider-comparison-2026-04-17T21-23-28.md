# CHODE vs Aider Repo-Map — Three-Way Comparison
**Date:** 2026-04-17  
**Repos:** caddy (Go), pocketbase (Go), ruff (Rust), zulip (Python), pixijs (TypeScript)  
**Models:** gemini-flash, gpt-4o  
**Modes:** baseline (no context) | aider repo-map (~1000 tok) | CHODE profile (~400–600 tok)

## Aggregate Scores

- **baseline** (no context): 22/120 = **18%**
- **aider** (~1054 tok avg): 8/120 = **7%**
- **chode** (~343 tok avg): 99/120 = **83%**

## Score Summary

| Repo | Lang | Model | Baseline | Aider (~1k tok) | CHODE (~500 tok) | CHODE wins? |
|---|---|---|---|---|---|---|
| caddy | Go | gemini-flash | 8/12 (67%) | 0/12 (0%) | 8/12 (67%) | ✓ CHODE |
| caddy | Go | gpt-4o | 0/12 (0%) | 2/12 (17%) | 5/12 (42%) | ✓ CHODE |
| pocketbase | Go | gemini-flash | 0/12 (0%) | 0/12 (0%) | 9/12 (75%) | ✓ CHODE |
| pocketbase | Go | gpt-4o | 0/12 (0%) | 0/12 (0%) | 11/12 (92%) | ✓ CHODE |
| ruff | Rust | gemini-flash | 5/12 (42%) | 0/12 (0%) | 12/12 (100%) | ✓ CHODE |
| ruff | Rust | gpt-4o | 0/12 (0%) | 0/12 (0%) | 12/12 (100%) | ✓ CHODE |
| zulip | Python | gemini-flash | 3/12 (25%) | 0/12 (0%) | 12/12 (100%) | ✓ CHODE |
| zulip | Python | gpt-4o | 0/12 (0%) | 0/12 (0%) | 12/12 (100%) | ✓ CHODE |
| pixijs | TypeScript | gemini-flash | 3/12 (25%) | 3/12 (25%) | 9/12 (75%) | ✓ CHODE |
| pixijs | TypeScript | gpt-4o | 3/12 (25%) | 3/12 (25%) | 9/12 (75%) | ✓ CHODE |

## Per-Question Breakdown

### caddy (Go)

| Q | Stump | Must | gemini-flash base | gpt-4o base | gemini-flash aider | gpt-4o aider | gemini-flash chode | gpt-4o chode |
|---|---|---|---|---|---|---|---|---|
| Q1 |  | `go` | 2 | 0 | 0 | 2 | 2 | 2 |
| Q2 |  | `prometheus` | 3 | 0 | 0 | 0 | 3 | 3 |
| Q3 | ★ | `chi` | 0 | 0 | 0 | 0 | 0 | 0 |
| Q4 | ★ | `zap` | 3 | 0 | 0 | 0 | 3 | 0 |

### pocketbase (Go)

| Q | Stump | Must | gemini-flash base | gpt-4o base | gemini-flash aider | gpt-4o aider | gemini-flash chode | gpt-4o chode |
|---|---|---|---|---|---|---|---|---|
| Q1 |  | `go` | 0 | 0 | 0 | 0 | 0 | 2 |
| Q2 |  | `oauth` | 0 | 0 | 0 | 0 | 3 | 3 |
| Q3 | ★ | `7` | 0 | 0 | 0 | 0 | 3 | 3 |
| Q4 | ★ | `plugin` | 0 | 0 | 0 | 0 | 3 | 3 |

### ruff (Rust)

| Q | Stump | Must | gemini-flash base | gpt-4o base | gemini-flash aider | gpt-4o aider | gemini-flash chode | gpt-4o chode |
|---|---|---|---|---|---|---|---|---|
| Q1 |  | `rust, python` | 1 | 0 | 0 | 0 | 3 | 3 |
| Q2 |  | `cargo, pip` | 1 | 0 | 0 | 0 | 3 | 3 |
| Q3 | ★ | `toml` | 3 | 0 | 0 | 0 | 3 | 3 |
| Q4 | ★ | `release` | 0 | 0 | 0 | 0 | 3 | 3 |

### zulip (Python)

| Q | Stump | Must | gemini-flash base | gpt-4o base | gemini-flash aider | gpt-4o aider | gemini-flash chode | gpt-4o chode |
|---|---|---|---|---|---|---|---|---|
| Q1 |  | `python` | 3 | 0 | 0 | 0 | 3 | 3 |
| Q2 |  | `ldap, saml` | 0 | 0 | 0 | 0 | 3 | 3 |
| Q3 | ★ | `preact` | 0 | 0 | 0 | 0 | 3 | 3 |
| Q4 | ★ | `98` | 0 | 0 | 0 | 0 | 3 | 3 |

### pixijs (TypeScript)

| Q | Stump | Must | gemini-flash base | gpt-4o base | gemini-flash aider | gpt-4o aider | gemini-flash chode | gpt-4o chode |
|---|---|---|---|---|---|---|---|---|
| Q1 |  | `typescript` | 0 | 0 | 0 | 0 | 0 | 0 |
| Q2 |  | `jest` | 0 | 0 | 0 | 0 | 3 | 3 |
| Q3 | ★ | `plugin, event-driven` | 0 | 0 | 0 | 0 | 3 | 3 |
| Q4 | ★ | `playground` | 3 | 3 | 3 | 3 | 3 | 3 |

## Key Finding

Aider repo-map: **7%** at ~1000 tok  
CHODE profile:  **83%** at ~500 tok  

Aider's map is designed for code navigation (finding symbols and structure). CHODE is designed for project orientation (stack, conventions, gotchas). These question sets test the orientation use case — the domain where CHODE was built to win.
