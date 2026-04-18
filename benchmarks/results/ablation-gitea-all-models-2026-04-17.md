# CHODE Ablation Study — All Models
**Date:** 2026-04-17
**Provider:** openrouter
**Models:** mistralai/mistral-large-2512, google/gemini-2.5-pro, google/gemini-2.5-flash, openai/gpt-4o, openai/gpt-4o-mini, meta-llama/llama-4-maverick
**Repo:** gitea (5,752 files, production Go web app)
**Auto-scorable questions:** 29/30 (Q7 = monorepo, manual)
**Max auto score:** 87 pts (29 × 3)

> Ablation study: each section stripped individually to isolate accuracy contribution.
> Scores are auto-scored points out of 87.

---

## Cross-Model Summary by Variant

| Variant | Tokens | mistralai/mistral-large-2512 | google/gemini-2.5-pro | google/gemini-2.5-flash | openai/gpt-4o | openai/gpt-4o-mini | meta-llama/llama-4-maverick |
|---|---|--- | --- | --- | --- | --- | ---|
| full | 1970 | 74/87 (85%) | 75/87 (86%) | 61/87 (70%) | 64/87 (74%) | 58/87 (67%) | 63/87 (72%) |
| no-tree | 384 | 65/87 (75%) | 66/87 (76%) | 65/87 (75%) | 65/87 (75%) | 62/87 (71%) | 64/87 (74%) |
| no-dna | 1795 | 28/87 (32%) | 34/87 (39%) | 26/87 (30%) | 23/87 (26%) | 16/87 (18%) | 27/87 (31%) |
| no-context | 1765 | 66/87 (76%) | 64/87 (74%) | 58/87 (67%) | 57/87 (66%) | 54/87 (62%) | 55/87 (63%) |
| tree-only | 1590 | 19/87 (22%) | 34/87 (39%) | 22/87 (25%) | 15/87 (17%) | 10/87 (11%) | 25/87 (29%) |
| dna-only | 179 | 59/87 (68%) | 60/87 (69%) | 57/87 (66%) | 59/87 (68%) | 56/87 (64%) | 58/87 (67%) |
| context-only | 209 | 16/87 (18%) | 14/87 (16%) | 14/87 (16%) | 14/87 (16%) | 5/87 (6%) | 14/87 (16%) |

---

## Section Attribution per Model

| Model | Full score | TREE+LEGEND drop (solo) | DNA drop (solo) | CONTEXT drop (solo) |
|---|---|---|---|---|
| mistralai/mistral-large-2512 | **74** | -9 (19/87 solo) | -46 (59/87 solo) | -8 (16/87 solo) |
| google/gemini-2.5-pro | **75** | -9 (34/87 solo) | -41 (60/87 solo) | -11 (14/87 solo) |
| google/gemini-2.5-flash | **61** | --4 (22/87 solo) | -35 (57/87 solo) | -3 (14/87 solo) |
| openai/gpt-4o | **64** | --1 (15/87 solo) | -41 (59/87 solo) | -7 (14/87 solo) |
| openai/gpt-4o-mini | **58** | --4 (10/87 solo) | -42 (56/87 solo) | -4 (5/87 solo) |
| meta-llama/llama-4-maverick | **63** | --1 (25/87 solo) | -36 (58/87 solo) | -8 (14/87 solo) |

> "Drop" = points lost when section is removed from full profile.
> "Solo" = score when only that section is present.

---

## Per-Question Scores (Full vs Removal Variants)

Columns: for each model — Full / No-TREE / No-DNA / No-CTX

| Q | Topic | Category | mistral-large-2512 full | mistral-large-2512 no-tree | mistral-large-2512 no-dna | mistral-large-2512 no-context | gemini-2.5-pro full | gemini-2.5-pro no-tree | gemini-2.5-pro no-dna | gemini-2.5-pro no-context | gemini-2.5-flash full | gemini-2.5-flash no-tree | gemini-2.5-flash no-dna | gemini-2.5-flash no-context | gpt-4o full | gpt-4o no-tree | gpt-4o no-dna | gpt-4o no-context | gpt-4o-mini full | gpt-4o-mini no-tree | gpt-4o-mini no-dna | gpt-4o-mini no-context | llama-4-maverick full | llama-4-maverick no-tree | llama-4-maverick no-dna | llama-4-maverick no-context |
|---|---|---|--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---|
| Q1 | Primary languages | Objective | 2 | 3 | 2 | 2 | 3 | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 2 | 3 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 3 | 2 | 2 |
| Q2 | Web frameworks | Objective | 2 | 2 | 0 | 2 | 3 | 3 | 0 | 3 | 2 | 3 | 0 | 2 | 2 | 3 | 0 | 2 | 0 | 2 | 0 | 0 | 2 | 3 | 0 | 2 |
| Q3 | Databases | Objective | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 |
| Q4 | Package managers | Objective | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 3 | 3 | 0 | 3 |
| Q5 | Primary purpose | Objective | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 |
| Q6 | Main entry point | Navigational | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 |
| Q8 | Routes/handlers location | Navigational | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 3 |
| Q9 | Schema/ORM models | Navigational | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 2 | 2 | 2 | 3 | 2 | 3 | 3 | 3 | 3 | 2 | 3 | 0 | 2 | 2 | 2 | 3 | 2 |
| Q10 | Frontend/UI code location | Navigational | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 |
| Q11 | Architectural pattern | Inferential | 3 | 3 | 0 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 2 | 2 | 0 | 2 | 3 | 2 | 0 | 2 |
| Q12 | Project type | Inferential | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| Q13 | Configuration management | Inferential | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 |
| Q14 | Dependency injection | Inferential | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| Q15 | Authentication | Inferential | 3 | 0 | 0 | 0 | 1 | 0 | 3 | 1 | 0 | 0 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Q16 | Main domain entities | Domain | 3 | 3 | 1 | 3 | 3 | 3 | 1 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 1 | 3 |
| Q17 | External integrations | Domain | 3 | 3 | 0 | 3 | 3 | 3 | 1 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 1 | 3 |
| Q18 | Test framework | Domain | 3 | 2 | 0 | 3 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 |
| Q19 | How to run tests | Domain | 3 | 3 | 2 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 2 | 2 | 0 | 3 | 3 | 3 | 0 | 3 |
| Q20 | CI system | Domain | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 |
| Q21 | Where to add API endpoint | Navigation | 3 | 2 | 0 | 3 | 3 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 0 | 2 | 0 | 0 |
| Q22 | Migrations location | Navigation | 3 | 3 | 0 | 3 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 3 | 2 | 2 | 1 | 2 |
| Q23 | Core business logic | Navigation | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 2 | 2 |
| Q24 | Error handling middleware | Navigation | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 0 | 3 | 0 | 0 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 1 | 3 |
| Q25 | Env var documentation | Navigation | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| Q26 | Top 3 internal packages | Deep | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 0 | 0 |
| Q27 | Bootstrap/init sequence | Deep | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Q28 | Notable design patterns | Deep | 1 | 1 | 0 | 1 | 3 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 0 | 1 |
| Q29 | Key deployer config options | Deep | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| Q30 | New contributor essentials | Deep | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 | 3 | 3 | 3 | 0 |

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

### mistralai/mistral-large-2512

| Variant | Tokens | Score | % | Time |
|---|---|---|---|---|
| full | 1970 | 74/87 | 85% | 10.0s |
| no-tree | 384 | 65/87 | 75% | 7.2s |  (-9)
| no-dna | 1795 | 28/87 | 32% | 6.6s |  (-46)
| no-context | 1765 | 66/87 | 76% | 9.3s |  (-8)
| tree-only | 1590 | 19/87 | 22% | 6.1s |  (-55)
| dna-only | 179 | 59/87 | 68% | 6.4s |  (-15)
| context-only | 209 | 16/87 | 18% | 4.0s |  (-58)

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

### google/gemini-2.5-flash

| Variant | Tokens | Score | % | Time |
|---|---|---|---|---|
| full | 1970 | 61/87 | 70% | 2.4s |
| no-tree | 384 | 65/87 | 75% | 2.3s |  (+4)
| no-dna | 1795 | 26/87 | 30% | 2.7s |  (-35)
| no-context | 1765 | 58/87 | 67% | 2.4s |  (-3)
| tree-only | 1590 | 22/87 | 25% | 3.7s |  (-39)
| dna-only | 179 | 57/87 | 66% | 2.1s |  (-4)
| context-only | 209 | 14/87 | 16% | 1.8s |  (-47)

### openai/gpt-4o

| Variant | Tokens | Score | % | Time |
|---|---|---|---|---|
| full | 1970 | 64/87 | 74% | 3.4s |
| no-tree | 384 | 65/87 | 75% | 3.9s |  (+1)
| no-dna | 1795 | 23/87 | 26% | 1.6s |  (-41)
| no-context | 1765 | 57/87 | 66% | 3.9s |  (-7)
| tree-only | 1590 | 15/87 | 17% | 1.5s |  (-49)
| dna-only | 179 | 59/87 | 68% | 3.1s |  (-5)
| context-only | 209 | 14/87 | 16% | 2.2s |  (-50)

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

### meta-llama/llama-4-maverick

| Variant | Tokens | Score | % | Time |
|---|---|---|---|---|
| full | 1970 | 63/87 | 72% | 8.0s |
| no-tree | 384 | 64/87 | 74% | 10.2s |  (+1)
| no-dna | 1795 | 27/87 | 31% | 15.8s |  (-36)
| no-context | 1765 | 55/87 | 63% | 3.3s |  (-8)
| tree-only | 1590 | 25/87 | 29% | 2.2s |  (-38)
| dna-only | 179 | 58/87 | 67% | 9.0s |  (-5)
| context-only | 209 | 14/87 | 16% | 8.8s |  (-49)
