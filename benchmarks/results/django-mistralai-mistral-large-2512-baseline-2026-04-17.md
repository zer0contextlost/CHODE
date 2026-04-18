# CHODE Benchmark — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** django
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 267 prompt + 273 completion = 540 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 20/36 (56% of auto-scorable)
**Stump questions (7):** 9/21 (43% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | Python (`.py`), YAML (for CI/config), JSON (for package metadata), and sometimes INI or TOML | 3 _(auto)_ |
| Q3 | Package managers | Objective | pip (Python), npm/yarn (for JavaScript dependencies) | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | Jest or QUnit (for JavaScript tests) | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions or Travis CI (common for Django) | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Model-View-Template (MVT) or Model-View-Controller (MVC) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | `django/middleware/common.py` or `django/middleware/security.py` (common middleware paths in Django) | 1 _(auto)_ |
| Q8 | Core package size | Navigational | Approximately 150–200 (Django’s core `django/` package has many submodules) | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | `django/` (core framework code) or `tests/` (if included in the repository) | 2 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | A high-level Python web framework for building secure and maintainable web applications. | 2 _(auto)_ |
| Q12 | File skew | Inferential | Roughly 5–10x larger (Django’s core has ~150–200 files vs. `js_tests/` having ~10–30 files). | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 20)_

---

## Raw Model Response

```
Here are the answers based on my training knowledge (primarily referencing Django, a well-known Python web framework, as the likely project in question):

Q1:
Python

Q2:
Python (`.py`), YAML (for CI/config), JSON (for package metadata), and sometimes INI or TOML

Q3:
pip (Python), npm/yarn (for JavaScript dependencies)

Q4:
Jest or QUnit (for JavaScript tests)

Q5:
GitHub Actions or Travis CI (common for Django)

Q6:
Model-View-Template (MVT) or Model-View-Controller (MVC)

Q7:
`django/middleware/common.py` or `django/middleware/security.py` (common middleware paths in Django)

Q8:
Approximately 150–200 (Django’s core `django/` package has many submodules)

Q9:
`django/` (core framework code) or `tests/` (if included in the repository)

Q10:
Framework

Q11:
A high-level Python web framework for building secure and maintainable web applications.

Q12:
Roughly 5–10x larger (Django’s core has ~150–200 files vs. `js_tests/` having ~10–30 files).
```
