# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** django
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 6947 paths, 3 anchor files, 3 doc files
**Call 1 — profile build:** 45928 prompt tokens → 550 completion tokens (profile)
**Call 2 — questions:** 806 prompt tokens + 106 completion tokens
**Total tokens consumed:** 47390

**CHODE equivalent:** ~160 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 287x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 11/36 (31% of auto-scorable)
**Stump questions (7):** 2/21 (10%)

---

## AI-Built Profile

```
This repository is primarily a Python project, specifically a web framework, with a significant focus on Django, which is a high-level Python web framework designed to encourage rapid development and clean, pragmatic design. The primary language is Python, with a minimum required version of 3.12. The repository also includes JavaScript files, particularly for frontend testing and development.

The key framework is Django, which is complemented by several libraries such as `asgiref`, `sqlparse`, and optional dependencies like `argon2-cffi` and `bcrypt`. The project utilizes `Sphinx` for documentation generation and `eslint` for JavaScript linting. The package manager used is `pip`, as indicated by the presence of `pyproject.toml` and `requirements.txt` files.

For testing, the repository employs `pytest` and `Grunt` for JavaScript testing, with commands defined in the `package.json` file. The test commands include `eslint .` for linting and `grunt test --verbose` for running JavaScript tests. The project also has a comprehensive test suite for Django, which can be executed following the instructions in the documentation.

This project is classified as a framework, specifically a web framework, and is structured as a monorepo, containing multiple components and libraries within a single repository. The primary purpose of this repository is to provide a robust framework for building web applications in Python, facilitating rapid development and clean design.

Top-level directories include:
- `django/` (636 files): Contains the core framework code.
- `tests/` (2548 files): Contains unit and integration tests for the framework.
- `docs/` (729 files): Contains documentation files.
- `scripts/` (13 files): Contains various utility scripts.
- `js_tests/` (12 files): Contains JavaScript-specific tests.
- `extras/` (2 files): Contains additional resources or tools.

Key entry point files include:
- `django/__init__.py`: Initializes the Django package.
- `django/core/management/__init__.py`: Contains management commands for Django.
- `manage.py`: A command-line utility for administrative tasks.
- `pyproject.toml`: Defines the project metadata and dependencies.

The architecture pattern is primarily MVC (Model-View-Controller), as Django follows this design pattern, allowing for a clear separation of concerns between data models, user interface, and control logic.

Notable conventions include the requirement for non-trivial pull requests to be associated with Trac tickets, emphasizing the importance of tracking changes and discussions. Additionally, the project has a strong emphasis on documentation, with extensive guidelines for contributing and running tests, ensuring that contributors are well-informed about the project's structure and requirements.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | Package managers | Objective | pip | 2 _(auto)_ |
| Q4 | JS test frameworks | Objective | Not in profile. | 0 _(auto)_ |
| Q5 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | Architectural pattern | Inferential | MVC (Model-View-Controller) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Core package size | Navigational | 636 files | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | tests/ | 0 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | To provide a robust framework for building web applications in Python, facilitating rapid development and clean design. | 3 _(auto)_ |
| Q12 | File skew | Inferential | 53 times larger | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:  
Python

Q2:  
Not in profile.

Q3:  
pip

Q4:  
Not in profile.

Q5:  
Not in profile.

Q6:  
MVC (Model-View-Controller)

Q7:  
Not in profile.

Q8:  
636 files

Q9:  
tests/

Q10:  
Framework

Q11:  
To provide a robust framework for building web applications in Python, facilitating rapid development and clean design.

Q12:  
53 times larger
```
