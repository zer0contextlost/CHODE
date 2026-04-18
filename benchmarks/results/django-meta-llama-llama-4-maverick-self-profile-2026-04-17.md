# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** django
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 6947 paths, 3 anchor files, 3 doc files
**Call 1 — profile build:** 42578 prompt tokens → 435 completion tokens (profile)
**Call 2 — questions:** 761 prompt tokens + 92 completion tokens
**Total tokens consumed:** 43866

**CHODE equivalent:** ~160 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 266x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 13/36 (36% of auto-scorable)
**Stump questions (7):** 3/21 (14%)

---

## AI-Built Profile

```
The primary language of this repository is Python, specifically version 3.12 and above. The framework used is Django, a high-level Python web framework. Key libraries include asgiref, sqlparse, and tzdata.

The package manager used is pip, with dependencies specified in pyproject.toml. npm is also used for JavaScript dependencies, as seen in package.json.

The test framework used is primarily the built-in unittest framework for Python, with tests located in the tests/ directory. The test command for Python tests is not explicitly stated, but it is mentioned in the README.rst file that instructions can be found in docs/internals/contributing/writing-code/unit-tests.txt. For JavaScript tests, the test command is "grunt test --verbose", which is run using npm.

This project is a framework, specifically a web framework. Its primary purpose is to provide a high-level Python framework that encourages rapid development and clean, pragmatic design.

The top directories in this repository include django/ (636 files), tests/ (2548 files), and docs/ (729 files). Other notable directories include .github/ for GitHub Actions workflows and django/contrib/ for contrib modules.

Key entry point files include django/__init__.py and django/__main__.py. The django-admin command is defined in pyproject.toml.

The architecture pattern appears to be a monolithic repository, with both the Django framework and its tests included in the same repository. The Django framework is organized into several subdirectories, including contrib/ for contrib modules, db/ for database-related code, and core/ is not present but implied through various imports.

Notable conventions include the use of ReST for documentation and the Sphinx documentation system. The project also uses eslint for JavaScript linting, with configuration in eslint.config.mjs. The Python code is formatted using Black, with configuration in pyproject.toml. The project follows a specific code of conduct and has guidelines for contributing. 

The repository is structured to support multiple Python versions and has a comprehensive testing setup. The presence of a Gruntfile.js and package.json suggests that the project also involves JavaScript and front-end development.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | TOML | 0 _(auto)_ |
| Q3 | Package managers | Objective | pip, npm | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Monolithic repository | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Core package size | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | tests/ | 0 _(auto)_ |
| Q10 | Project type | Inferential | framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | To provide a high-level Python framework that encourages rapid development and clean, pragmatic design. | 1 _(auto)_ |
| Q12 | File skew | Inferential | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Python

Q2
TOML

Q3
pip, npm

Q4
Not in profile.

Q5
GitHub Actions

Q6
Monolithic repository

Q7
Not in profile.

Q8
Not in profile.

Q9
tests/

Q10
framework

Q11
To provide a high-level Python framework that encourages rapid development and clean, pragmatic design.

Q12
Not in profile.
```
