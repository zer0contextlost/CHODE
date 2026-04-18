# CHODE Ablation Study — All Models
**Date:** 2026-04-17
**Provider:** openrouter
**Models:** google/gemini-2.5-pro
**Repo:** gitea (5,752 files, production Go web app)
**Auto-scorable questions:** 29/30 (Q7 = monorepo, manual)
**Max auto score:** 87 pts (29 × 3)

> Ablation study: each section stripped individually to isolate accuracy contribution.
> Scores are auto-scored points out of 87.

---

## Cross-Model Summary by Variant

| Variant | Tokens | google/gemini-2.5-pro |
|---|---|---|
| full | 1970 | 75/87 (86%) |
| no-tree | 384 | 66/87 (76%) |
| no-dna | 1795 | 34/87 (39%) |
| no-context | 1765 | 64/87 (74%) |
| tree-only | 1590 | 34/87 (39%) |
| dna-only | 179 | 60/87 (69%) |
| context-only | 209 | 14/87 (16%) |

---

## Section Attribution per Model

| Model | Full score | TREE+LEGEND drop (solo) | DNA drop (solo) | CONTEXT drop (solo) |
|---|---|---|---|---|
| google/gemini-2.5-pro | **75** | -9 (34/87 solo) | -41 (60/87 solo) | -11 (14/87 solo) |

> "Drop" = points lost when section is removed from full profile.
> "Solo" = score when only that section is present.

---

## Per-Question Scores (Full vs Removal Variants)

Columns: for each model — Full / No-TREE / No-DNA / No-CTX

| Q | Topic | Category | gemini-2.5-pro full | gemini-2.5-pro no-tree | gemini-2.5-pro no-dna | gemini-2.5-pro no-context |
|---|---|---|--- | --- | --- | ---|
| Q1 | Primary languages | Objective | 3 | 3 | 2 | 3 |
| Q2 | Web frameworks | Objective | 3 | 3 | 0 | 3 |
| Q3 | Databases | Objective | 3 | 3 | 0 | 3 |
| Q4 | Package managers | Objective | 3 | 3 | 0 | 3 |
| Q5 | Primary purpose | Objective | 3 | 3 | 3 | 0 |
| Q6 | Main entry point | Navigational | 3 | 3 | 0 | 3 |
| Q8 | Routes/handlers location | Navigational | 3 | 2 | 3 | 2 |
| Q9 | Schema/ORM models | Navigational | 3 | 2 | 3 | 2 |
| Q10 | Frontend/UI code location | Navigational | 2 | 2 | 0 | 2 |
| Q11 | Architectural pattern | Inferential | 3 | 3 | 3 | 3 |
| Q12 | Project type | Inferential | 2 | 2 | 2 | 2 |
| Q13 | Configuration management | Inferential | 3 | 3 | 0 | 3 |
| Q14 | Dependency injection | Inferential | 3 | 3 | 3 | 3 |
| Q15 | Authentication | Inferential | 1 | 0 | 3 | 1 |
| Q16 | Main domain entities | Domain | 3 | 3 | 1 | 3 |
| Q17 | External integrations | Domain | 3 | 3 | 1 | 3 |
| Q18 | Test framework | Domain | 2 | 2 | 0 | 2 |
| Q19 | How to run tests | Domain | 3 | 3 | 0 | 3 |
| Q20 | CI system | Domain | 3 | 3 | 0 | 3 |
| Q21 | Where to add API endpoint | Navigation | 3 | 2 | 0 | 2 |
| Q22 | Migrations location | Navigation | 2 | 2 | 0 | 2 |
| Q23 | Core business logic | Navigation | 3 | 0 | 3 | 3 |
| Q24 | Error handling middleware | Navigation | 3 | 3 | 0 | 3 |
| Q25 | Env var documentation | Navigation | 3 | 3 | 3 | 3 |
| Q26 | Top 3 internal packages | Deep | 2 | 2 | 0 | 2 |
| Q27 | Bootstrap/init sequence | Deep | 1 | 1 | 0 | 1 |
| Q28 | Notable design patterns | Deep | 3 | 1 | 1 | 1 |
| Q29 | Key deployer config options | Deep | 0 | 0 | 0 | 0 |
| Q30 | New contributor essentials | Deep | 3 | 3 | 3 | 0 |

---

## Variant Descriptions

- **full**: All sections (control)
- **no-tree**: TREE+LEGEND removed — DNA+CONTEXT only
- **no-dna**: DNA removed — TREE+LEGEND+CONTEXT only
- **no-context**: CONTEXT removed — TREE+LEGEND+DNA only
- **tree-only**: TREE+LEGEND only (no DNA, no CONTEXT)
- **dna-only**: DNA only (no TREE, no CONTEXT)
- **context-only**: CONTEXT only (no TREE, no DNA)

---

## Per-Model Detail

### google/gemini-2.5-pro

| Variant | Tokens | Score | % | Time |
|---|---|---|---|---|
| full | 1970 | 75/87 | 86% | 34.7s |
| no-tree | 384 | 66/87 | 76% | 26.8s |  (-9)
| no-dna | 1795 | 34/87 | 39% | 57.6s |  (-41)
| no-context | 1765 | 64/87 | 74% | 34.5s |  (-11)
| tree-only | 1590 | 34/87 | 39% | 63.5s |  (-41)
| dna-only | 179 | 60/87 | 69% | 159.0s |  (-15)
| context-only | 209 | 14/87 | 16% | 25.5s |  (-61)
