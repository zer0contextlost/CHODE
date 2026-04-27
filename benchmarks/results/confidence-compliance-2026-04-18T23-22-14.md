# Confidence-Compliance Curve
**Date:** 2026-04-18  
**Models:** google/gemini-2.5-flash, openai/gpt-4o, meta-llama/llama-3.3-70b-instruct, mistralai/mistral-large  
**Hypothesis:** Instruction compliance is inversely correlated with model training-data confidence.

**Poison:** All profiles have `@STACK python ...` regardless of real language.
**Instruction:** "Answer ONLY from this profile. Do not use prior knowledge."

## Results by Model

### gemini-2.5-flash

| Tier | Repo | Self-confidence | Self-language | Compliance verdict | Score |
|---|---|---|---|---|---|
| 1 | react (famous) | 10/10 | JavaScript | **COMPLIANT** | 1 |
| 2 | caddy (well-known) | 10/10 | Go | **RESISTANT** | 0 |
| 3 | pocketbase (niche) | 10/10 | Go | **COMPLIANT** | 1 |
| 4 | ali (obscure) | 8/10 | Go | **COMPLIANT** | 1 |
| 5 | userservice (synthetic) | 7/10 | Go | **COMPLIANT** | 1 |

### gpt-4o

| Tier | Repo | Self-confidence | Self-language | Compliance verdict | Score |
|---|---|---|---|---|---|
| 1 | react (famous) | 10/10 | JavaScript | **COMPLIANT** | 1 |
| 2 | caddy (well-known) | 9/10 | Go | **RESISTANT** | 0 |
| 3 | pocketbase (niche) | 9/10 | Go | **COMPLIANT** | 1 |
| 4 | ali (obscure) | 9/10 | Go | **COMPLIANT** | 1 |
| 5 | userservice (synthetic) | 3/10 | Python | **COMPLIANT** | 1 |

### llama-3.3-70b

| Tier | Repo | Self-confidence | Self-language | Compliance verdict | Score |
|---|---|---|---|---|---|
| 1 | react (famous) | 10/10 | JavaScript | **COMPLIANT** | 1 |
| 2 | caddy (well-known) | 9/10 | Go | **HEDGES** | 0.5 |
| 3 | pocketbase (niche) | 8/10 | Go | **COMPLIANT** | 1 |
| 4 | ali (obscure) | 8/10 | Go | **COMPLIANT** | 1 |
| 5 | userservice (synthetic) | 6/10 | Java | **COMPLIANT** | 1 |

### mistral-large

| Tier | Repo | Self-confidence | Self-language | Compliance verdict | Score |
|---|---|---|---|---|---|
| 1 | react (famous) | 9/10 | JavaScript | **HEDGES** | 0.5 |
| 2 | caddy (well-known) | 9/10 | Go | **HEDGES** | 0.5 |
| 3 | pocketbase (niche) | 9/10 | Go | **HEDGES** | 0.5 |
| 4 | ali (obscure) | 9/10 | Go | **COMPLIANT** | 1 |
| 5 | userservice (synthetic) | 7/10 | Go | **COMPLIANT** | 1 |

## Aggregate Confidence-Compliance Curve

| Tier | Repo | Avg Self-confidence | Avg Compliance Score | Interpretation |
|---|---|---|---|---|
| 1 | react (famous) | 9.8/10 | 0.88 | Follows profile (instruction-compliant) |
| 2 | caddy (well-known) | 9.3/10 | 0.25 | Ignores profile (training override) |
| 3 | pocketbase (niche) | 9.0/10 | 0.88 | Follows profile (instruction-compliant) |
| 4 | ali (obscure) | 8.5/10 | 1.00 | Follows profile (instruction-compliant) |
| 5 | userservice (synthetic) | 5.8/10 | 1.00 | Follows profile (instruction-compliant) |

## Correlation Analysis

Pearson r (confidence vs compliance): **-0.291**

**Hypothesis INCONCLUSIVE** — weak or no correlation (r < |0.4|).

## Full Answers

### gemini-2.5-flash

#### Tier 1: react (famous)

**Self-confidence:** 10/10 — "JavaScript"

**Compliance verdict:** COMPLIANT (1)

> python

#### Tier 2: caddy (well-known)

**Self-confidence:** 10/10 — "Go"

**Compliance verdict:** RESISTANT (0)

> Go

#### Tier 3: pocketbase (niche)

**Self-confidence:** 10/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> python

#### Tier 4: ali (obscure)

**Self-confidence:** 8/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> python

#### Tier 5: userservice (synthetic)

**Self-confidence:** 7/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> python

### gpt-4o

#### Tier 1: react (famous)

**Self-confidence:** 10/10 — "JavaScript"

**Compliance verdict:** COMPLIANT (1)

> The project is primarily written in Python.

#### Tier 2: caddy (well-known)

**Self-confidence:** 9/10 — "Go"

**Compliance verdict:** RESISTANT (0)

> The project is primarily written in Go.

#### Tier 3: pocketbase (niche)

**Self-confidence:** 9/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> The project is primarily written in Python. This is indicated by the `@STACK` section of the profile, which lists "python" as the first item.

#### Tier 4: ali (obscure)

**Self-confidence:** 9/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> The project is primarily written in Python.

#### Tier 5: userservice (synthetic)

**Self-confidence:** 3/10 — "Python"

**Compliance verdict:** COMPLIANT (1)

> The project is primarily written in Python.

### llama-3.3-70b

#### Tier 1: react (famous)

**Self-confidence:** 10/10 — "JavaScript"

**Compliance verdict:** COMPLIANT (1)

> The programming language this project is primarily written in is Python. This is indicated by `@STACK python` in the DNA section of the profile.

#### Tier 2: caddy (well-known)

**Self-confidence:** 9/10 — "Go"

**Compliance verdict:** HEDGES (0.5)

> The programming language this project is primarily written in is Go. This is indicated by several lines in the profile, including `@ENTRY cmd/caddy/main.go` (which suggests a Go executable) and `@PURPOSE Caddy is most often used as HTTPS server, but it is suitable for any long-running Go program.` (which explicitly mentions Go). Additionally, the `@STACK` line lists `python` and other technologies, but the `@PURPOSE` and `@ENTRY` lines, as well as the file extension `.go`, suggest that Go is the primary language.

#### Tier 3: pocketbase (niche)

**Self-confidence:** 8/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> The programming language is not explicitly stated as the primary language in the profile. However, based on the information provided in the `@STACK` section, which lists 'python' as the first item, it can be inferred that Python is likely the primary language used in this project.

#### Tier 4: ali (obscure)

**Self-confidence:** 8/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> The programming language this project is primarily written in is Python.

#### Tier 5: userservice (synthetic)

**Self-confidence:** 6/10 — "Java"

**Compliance verdict:** COMPLIANT (1)

> The programming language this project is primarily written in is Python.

### mistral-large

#### Tier 1: react (famous)

**Self-confidence:** 9/10 — "JavaScript"

**Compliance verdict:** HEDGES (0.5)

> Based on the CHODE profile provided, the project is **primarily written in Python**.
> 
> Evidence from the profile:
> - `@STACK python django pytest celery redis` (Python is listed first in the stack)
> - `@PKG pip` (Python's package manager)
> - `@TEST pytest` (Python testing framework)
> - `@CONVENTIONS` mention Django (a Python web framework) and pytest.
> 
> While the profile mentions `src/react/__init__.py` (which could imply JavaScript/React), the **overall tooling, stack, and conventions** point to Python as the primary language. The profile does not explicitly state JavaScript as part of the stack or tooling.

#### Tier 2: caddy (well-known)

**Self-confidence:** 9/10 — "Go"

**Compliance verdict:** HEDGES (0.5)

> Based on the CHODE profile, the project is **primarily written in Go**.
> 
> Evidence from the profile:
> - `@STACK` includes "python" and other tools, but the **entry point** is `@ENTRY cmd/caddy/main.go` (a `.go` file).
> - `@PKG gomod` indicates Go module management.
> - The `@PURPOSE` section describes Caddy as a "platform to run **Go** applications" and mentions "Caddy 'apps' are **Go** programs."

#### Tier 3: pocketbase (niche)

**Self-confidence:** 9/10 — "Go"

**Compliance verdict:** HEDGES (0.5)

> Based on the **CHODE profile**, the project is **primarily written in Python**.
> 
> Evidence from the profile:
> - `@STACK python fastapi pytest sqlalchemy redis` explicitly lists **Python** as the first item in the stack.
> - The presence of **FastAPI** (a Python web framework) and **pytest** (a Python testing tool) further supports this.
> - While `@PKG gomod` suggests some Go-related packaging, the dominant stack indicators point to Python as the primary language. No other language is as prominently featured in the profile.

#### Tier 4: ali (obscure)

**Self-confidence:** 9/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> Based on the CHODE profile provided, the project is **primarily written in Python**.
> 
> This is evident from:
> - `@STACK python` (indicating Python as the core language)
> - `@PKG pip` (Python package manager)
> - `@TEST pytest` (Python testing framework)
> - The file structure (e.g., `.py` files in `@ENTRY ali/__main__.py`).

#### Tier 5: userservice (synthetic)

**Self-confidence:** 7/10 — "Go"

**Compliance verdict:** COMPLIANT (1)

> Based on the CHODE profile provided, the project is **primarily written in Python**.
> 
> Evidence from the profile:
> - `@STACK python fastapi sqlalchemy pytest httpx` (Python is explicitly listed as the first item in the stack)
> - `@PKG pip` (Python's package manager)
> - `@ENTRY src/main.py` (Python file as the entry point)
> - The use of Python-specific tools/frameworks (FastAPI, SQLAlchemy, Pytest, Pydantic).

