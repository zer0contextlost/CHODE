# CHODE Ablation Study — All Models
**Date:** 2026-04-17
**Provider:** openrouter
**Models:** openai/gpt-4o-mini
**Repo:** gitea (5,752 files, production Go web app)
**Auto-scorable questions:** 29/30 (Q7 = monorepo, manual)
**Max auto score:** 87 pts (29 × 3)

> Ablation study: each section stripped individually to isolate accuracy contribution.
> Scores are auto-scored points out of 87.

---

## Cross-Model Summary by Variant

| Variant | Tokens | openai/gpt-4o-mini |
|---|---|---|
| full | 1970 | 58/87 (67%) |
| no-tree | 384 | 62/87 (71%) |
| no-dna | 1795 | 16/87 (18%) |
| no-context | 1765 | 54/87 (62%) |
| tree-only | 1590 | 10/87 (11%) |
| dna-only | 179 | 56/87 (64%) |
| context-only | 209 | 5/87 (6%) |

---

## Section Attribution per Model

| Model | Full score | TREE+LEGEND drop (solo) | DNA drop (solo) | CONTEXT drop (solo) |
|---|---|---|---|---|
| openai/gpt-4o-mini | **58** | --4 (10/87 solo) | -42 (56/87 solo) | -4 (5/87 solo) |

> "Drop" = points lost when section is removed from full profile.
> "Solo" = score when only that section is present.

---

## Per-Question Scores (Full vs Removal Variants)

Columns: for each model — Full / No-TREE / No-DNA / No-CTX

| Q | Topic | Category | gpt-4o-mini full | gpt-4o-mini no-tree | gpt-4o-mini no-dna | gpt-4o-mini no-context |
|---|---|---|--- | --- | --- | ---|
| Q1 | Primary languages | Objective | 2 | 3 | 2 | 2 |
| Q2 | Web frameworks | Objective | 0 | 2 | 0 | 0 |
| Q3 | Databases | Objective | 3 | 3 | 0 | 3 |
| Q4 | Package managers | Objective | 2 | 2 | 0 | 2 |
| Q5 | Primary purpose | Objective | 3 | 3 | 3 | 0 |
| Q6 | Main entry point | Navigational | 3 | 3 | 0 | 3 |
| Q8 | Routes/handlers location | Navigational | 2 | 2 | 0 | 2 |
| Q9 | Schema/ORM models | Navigational | 2 | 3 | 0 | 2 |
| Q10 | Frontend/UI code location | Navigational | 2 | 2 | 0 | 2 |
| Q11 | Architectural pattern | Inferential | 2 | 2 | 0 | 2 |
| Q12 | Project type | Inferential | 2 | 2 | 2 | 2 |
| Q13 | Configuration management | Inferential | 3 | 3 | 0 | 3 |
| Q14 | Dependency injection | Inferential | 3 | 3 | 3 | 3 |
| Q15 | Authentication | Inferential | 0 | 0 | 0 | 0 |
| Q16 | Main domain entities | Domain | 3 | 3 | 0 | 3 |
| Q17 | External integrations | Domain | 3 | 3 | 0 | 3 |
| Q18 | Test framework | Domain | 2 | 2 | 0 | 2 |
| Q19 | How to run tests | Domain | 2 | 2 | 0 | 3 |
| Q20 | CI system | Domain | 3 | 3 | 0 | 3 |
| Q21 | Where to add API endpoint | Navigation | 2 | 2 | 0 | 2 |
| Q22 | Migrations location | Navigation | 2 | 2 | 0 | 3 |
| Q23 | Core business logic | Navigation | 0 | 0 | 0 | 0 |
| Q24 | Error handling middleware | Navigation | 3 | 3 | 0 | 3 |
| Q25 | Env var documentation | Navigation | 3 | 3 | 3 | 3 |
| Q26 | Top 3 internal packages | Deep | 2 | 2 | 0 | 2 |
| Q27 | Bootstrap/init sequence | Deep | 0 | 0 | 0 | 0 |
| Q28 | Notable design patterns | Deep | 1 | 1 | 0 | 1 |
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

### openai/gpt-4o-mini

| Variant | Tokens | Score | % | Time |
|---|---|---|---|---|
| full | 1970 | 58/87 | 67% | 3.9s |
| no-tree | 384 | 62/87 | 71% | 5.6s |  (+4)
| no-dna | 1795 | 16/87 | 18% | 3.7s |  (-42)
| no-context | 1765 | 54/87 | 62% | 3.8s |  (-4)
| tree-only | 1590 | 10/87 | 11% | 2.0s |  (-48)
| dna-only | 179 | 56/87 | 64% | 6.1s |  (-2)
| context-only | 209 | 5/87 | 6% | 0.8s |  (-53)
