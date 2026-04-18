# CHODE Semantic Re-Score Report
**Generated:** 2026-04-18T02:32:33.829Z
**Files analyzed:** 21

## Aggregate Summary

| Metric | Value |
|---|---|
| Files re-scored | 21 |
| Total auto-scorable questions | 303 |
| Strict total | 506/909 (56%) |
| Semantic total | 511/909 (56%) |
| Delta | +5 points (+1.0% relative improvement) |
| Files with improvement | 5 |
| Files with regression | 0 |
| Files unchanged | 16 |

## Per-File Results

| File | Repo | Mode | Strict | Semantic | Delta |
|---|---|---|---|---|---|
| gitea-google-gemini-2.5-flash-self-profile-2026-04-17.md | gitea | self-profile | 12/36 (33%) | 13/36 (36%) | +1 |
| gitea-google-gemini-2.5-pro-self-profile-2026-04-17.md | gitea | self-profile | 13/36 (36%) | 14/36 (39%) | +1 |
| gitea-meta-llama-llama-4-maverick-self-profile-2026-04-17.md | gitea | self-profile | 14/36 (39%) | 15/36 (42%) | +1 |
| gitea-mistralai-mistral-large-2512-baseline-2026-04-17.md | gitea | baseline | 11/36 (31%) | 12/36 (33%) | +1 |
| gitea-openai-gpt-4o-mini-self-profile-2026-04-17.md | gitea | self-profile | 10/36 (28%) | 11/36 (31%) | +1 |
| gitea-gemma4-latest-2026-04-17.md | gitea | chode | 64/87 (74%) | 64/87 (74%) | 0 |
| gitea-google-gemini-2.5-flash-2026-04-17.md | gitea | chode | 30/36 (83%) | 30/36 (83%) | 0 |
| gitea-google-gemini-2.5-flash-baseline-2026-04-17.md | gitea | baseline | 5/36 (14%) | 5/36 (14%) | 0 |
| gitea-google-gemini-2.5-pro-2026-04-17.md | gitea | chode | 36/36 (100%) | 36/36 (100%) | 0 |
| gitea-google-gemini-2.5-pro-baseline-2026-04-17.md | gitea | baseline | 7/36 (19%) | 7/36 (19%) | 0 |
| gitea-llama3.2-latest-2026-04-17.md | gitea | chode | 49/87 (56%) | 49/87 (56%) | 0 |
| gitea-meta-llama-llama-4-maverick-2026-04-17.md | gitea | chode | 36/36 (100%) | 36/36 (100%) | 0 |
| gitea-meta-llama-llama-4-maverick-baseline-2026-04-17.md | gitea | baseline | 5/36 (14%) | 5/36 (14%) | 0 |
| gitea-mistralai-mistral-large-2512-2026-04-17.md | gitea | chode | 36/36 (100%) | 36/36 (100%) | 0 |
| gitea-mistralai-mistral-large-2512-self-profile-2026-04-17.md | gitea | self-profile | 16/36 (44%) | 16/36 (44%) | 0 |
| gitea-openai-gpt-4o-2026-04-17.md | gitea | chode | 36/36 (100%) | 36/36 (100%) | 0 |
| gitea-openai-gpt-4o-baseline-2026-04-17.md | gitea | baseline | 9/36 (25%) | 9/36 (25%) | 0 |
| gitea-openai-gpt-4o-mini-2026-04-17.md | gitea | chode | 36/36 (100%) | 36/36 (100%) | 0 |
| gitea-openai-gpt-4o-mini-baseline-2026-04-17.md | gitea | baseline | 7/36 (19%) | 7/36 (19%) | 0 |
| gitea-openai-gpt-4o-self-profile-2026-04-17.md | gitea | self-profile | 13/36 (36%) | 13/36 (36%) | 0 |
| gitea-qwen2.5-coder-7b-2026-04-17.md | gitea | chode | 61/87 (70%) | 61/87 (70%) | 0 |

## Questions That Benefited From Semantic Scoring

_(Questions where semantic scoring awarded more points than strict matching)_

### gitea/Q10 (5 file(s), +5 total points)
- google/gemini-2.5-flash: "Routers -> Services -> Models" → missing required: cmd, routes, svc, mdl → semantic: partial must — missing: cmd, svc, mdl
- google/gemini-2.5-pro: "`routers` (controllers), `services` (business logic), and `m…" → missing required: cmd, routes, svc, mdl → semantic: partial must — missing: cmd, svc, mdl
- meta-llama/llama-4-maverick: "The profile mentions an MVC pattern with a service layer. So…" → missing required: cmd, routes, svc, mdl → semantic: partial must — missing: cmd, svc, mdl

## Detailed Per-File Breakdown

### gitea-google-gemini-2.5-flash-self-profile-2026-04-17.md

**Repo:** gitea | **Model:** google/gemini-2.5-flash | **Mode:** self-profile
**Strict:** 12/36 (33%) → **Semantic:** 13/36 (36%) | **Delta:** +1

| Q | Answer (truncated) | Strict | Semantic | Delta | Semantic reason |
|---|---|---|---|---|---|
| Q10 | Routers -> Services -> Models | 0 | 1 | +1 | partial must — missing: cmd, svc, mdl |

### gitea-google-gemini-2.5-pro-self-profile-2026-04-17.md

**Repo:** gitea | **Model:** google/gemini-2.5-pro | **Mode:** self-profile
**Strict:** 13/36 (36%) → **Semantic:** 14/36 (39%) | **Delta:** +1

| Q | Answer (truncated) | Strict | Semantic | Delta | Semantic reason |
|---|---|---|---|---|---|
| Q10 | `routers` (controllers), `services` (business logic), and `m… | 0 | 1 | +1 | partial must — missing: cmd, svc, mdl |

### gitea-meta-llama-llama-4-maverick-self-profile-2026-04-17.md

**Repo:** gitea | **Model:** meta-llama/llama-4-maverick | **Mode:** self-profile
**Strict:** 14/36 (39%) → **Semantic:** 15/36 (42%) | **Delta:** +1

| Q | Answer (truncated) | Strict | Semantic | Delta | Semantic reason |
|---|---|---|---|---|---|
| Q10 | The profile mentions an MVC pattern with a service layer. So… | 0 | 1 | +1 | partial must — missing: cmd, svc, mdl |

### gitea-mistralai-mistral-large-2512-baseline-2026-04-17.md

**Repo:** gitea | **Model:** mistralai/mistral-large-2512 | **Mode:** baseline
**Strict:** 11/36 (31%) → **Semantic:** 12/36 (33%) | **Delta:** +1

| Q | Answer (truncated) | Strict | Semantic | Delta | Semantic reason |
|---|---|---|---|---|---|
| Q10 | 1. **Entry Point** (e.g., `main.go`) 2. **HTTP Layer** (rout… | 0 | 1 | +1 | partial must — missing: cmd, svc, mdl |

### gitea-openai-gpt-4o-mini-self-profile-2026-04-17.md

**Repo:** gitea | **Model:** openai/gpt-4o-mini | **Mode:** self-profile
**Strict:** 10/36 (28%) → **Semantic:** 11/36 (31%) | **Delta:** +1

| Q | Answer (truncated) | Strict | Semantic | Delta | Semantic reason |
|---|---|---|---|---|---|
| Q10 | Entry point -> Controllers (routers) -> Models -> Data layer… | 0 | 1 | +1 | partial must — missing: cmd, svc, mdl |

### gitea-gemma4-latest-2026-04-17.md

**Repo:** gitea | **Model:** gemma4:latest | **Mode:** chode
**Strict:** 64/87 (74%) → **Semantic:** 64/87 (74%) | **Delta:** 0

_No change from semantic scoring._

### gitea-google-gemini-2.5-flash-2026-04-17.md

**Repo:** gitea | **Model:** google/gemini-2.5-flash | **Mode:** chode
**Strict:** 30/36 (83%) → **Semantic:** 30/36 (83%) | **Delta:** 0

_No change from semantic scoring._

### gitea-google-gemini-2.5-flash-baseline-2026-04-17.md

**Repo:** gitea | **Model:** google/gemini-2.5-flash | **Mode:** baseline
**Strict:** 5/36 (14%) → **Semantic:** 5/36 (14%) | **Delta:** 0

_No change from semantic scoring._

### gitea-google-gemini-2.5-pro-2026-04-17.md

**Repo:** gitea | **Model:** google/gemini-2.5-pro | **Mode:** chode
**Strict:** 36/36 (100%) → **Semantic:** 36/36 (100%) | **Delta:** 0

_No change from semantic scoring._

### gitea-google-gemini-2.5-pro-baseline-2026-04-17.md

**Repo:** gitea | **Model:** google/gemini-2.5-pro | **Mode:** baseline
**Strict:** 7/36 (19%) → **Semantic:** 7/36 (19%) | **Delta:** 0

_No change from semantic scoring._

### gitea-llama3.2-latest-2026-04-17.md

**Repo:** gitea | **Model:** llama3.2:latest | **Mode:** chode
**Strict:** 49/87 (56%) → **Semantic:** 49/87 (56%) | **Delta:** 0

_No change from semantic scoring._

### gitea-meta-llama-llama-4-maverick-2026-04-17.md

**Repo:** gitea | **Model:** meta-llama/llama-4-maverick | **Mode:** chode
**Strict:** 36/36 (100%) → **Semantic:** 36/36 (100%) | **Delta:** 0

_No change from semantic scoring._

### gitea-meta-llama-llama-4-maverick-baseline-2026-04-17.md

**Repo:** gitea | **Model:** meta-llama/llama-4-maverick | **Mode:** baseline
**Strict:** 5/36 (14%) → **Semantic:** 5/36 (14%) | **Delta:** 0

_No change from semantic scoring._

### gitea-mistralai-mistral-large-2512-2026-04-17.md

**Repo:** gitea | **Model:** mistralai/mistral-large-2512 | **Mode:** chode
**Strict:** 36/36 (100%) → **Semantic:** 36/36 (100%) | **Delta:** 0

_No change from semantic scoring._

### gitea-mistralai-mistral-large-2512-self-profile-2026-04-17.md

**Repo:** gitea | **Model:** mistralai/mistral-large-2512 | **Mode:** self-profile
**Strict:** 16/36 (44%) → **Semantic:** 16/36 (44%) | **Delta:** 0

_No change from semantic scoring._

### gitea-openai-gpt-4o-2026-04-17.md

**Repo:** gitea | **Model:** openai/gpt-4o | **Mode:** chode
**Strict:** 36/36 (100%) → **Semantic:** 36/36 (100%) | **Delta:** 0

_No change from semantic scoring._

### gitea-openai-gpt-4o-baseline-2026-04-17.md

**Repo:** gitea | **Model:** openai/gpt-4o | **Mode:** baseline
**Strict:** 9/36 (25%) → **Semantic:** 9/36 (25%) | **Delta:** 0

_No change from semantic scoring._

### gitea-openai-gpt-4o-mini-2026-04-17.md

**Repo:** gitea | **Model:** openai/gpt-4o-mini | **Mode:** chode
**Strict:** 36/36 (100%) → **Semantic:** 36/36 (100%) | **Delta:** 0

_No change from semantic scoring._

### gitea-openai-gpt-4o-mini-baseline-2026-04-17.md

**Repo:** gitea | **Model:** openai/gpt-4o-mini | **Mode:** baseline
**Strict:** 7/36 (19%) → **Semantic:** 7/36 (19%) | **Delta:** 0

_No change from semantic scoring._

### gitea-openai-gpt-4o-self-profile-2026-04-17.md

**Repo:** gitea | **Model:** openai/gpt-4o | **Mode:** self-profile
**Strict:** 13/36 (36%) → **Semantic:** 13/36 (36%) | **Delta:** 0

_No change from semantic scoring._

### gitea-qwen2.5-coder-7b-2026-04-17.md

**Repo:** gitea | **Model:** qwen2.5-coder:7b | **Mode:** chode
**Strict:** 61/87 (70%) → **Semantic:** 61/87 (70%) | **Delta:** 0

_No change from semantic scoring._

---

## Semantic Equivalence Rules Applied

### Abbreviation Expansions

- `ts` → `typescript`
- `js` → `javascript`
- `py` → `python`
- `rb` → `ruby`
- `rs` → `rust`
- `go` → `golang`
- `gha`, `github-actions` → `github actions`
- `postgres`, `pg`, `pq` → `postgresql`
- `sqlite3` → `sqlite`
- `node package manager` → `npm`
- `yarnpkg` → `yarn`
- `performant npm` → `pnpm`
- `php unit` → `phpunit`
- `active record`, `ar` → `activerecord`
- `action pack` → `actionpack`
- `action view` → `actionview`
- `active support` → `activesupport`
- `active job` → `activejob`
- `rail ties` → `railties`

### Flag Equivalents

- `-uuu` = `-u -u -u` = `-u3` = `--no-ignore --no-ignore-parent --no-ignore-vcs`

### Plural/Singular Pairs

- `migration` ↔ `migrations`
- `route` ↔ `routes`
- `model` ↔ `models`
- `handler` ↔ `handlers`
- `provider` ↔ `providers`
- `service` ↔ `services`
- `package` ↔ `packages`
- `plugin` ↔ `plugins`
- `entity` ↔ `entities`
- `repository` ↔ `repositories`
- `middleware` ↔ `middlewares`
- `framework` ↔ `frameworks`
- `library` ↔ `libraries`
- `test` ↔ `tests`

### Additional Normalizations
- Case insensitive matching
- Punctuation normalization (commas, semicolons, parentheses collapsed to spaces)
- Whitespace collapse
