# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** django
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 6947 paths, 3 anchor files, 3 doc files
**Call 1 — profile build:** 45928 prompt tokens → 628 completion tokens (profile)
**Call 2 — questions:** 885 prompt tokens + 110 completion tokens
**Total tokens consumed:** 47551

**CHODE equivalent:** ~160 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 287x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 7/36 (19% of auto-scorable)
**Stump questions (7):** 0/21 (0%)

---

## AI-Built Profile

```
This repository is the Django project, a high-level Python web framework designed to encourage rapid development and clean, pragmatic design. The primary language is Python, specifically versions 3.12 and above, as indicated in the `pyproject.toml`. The project also utilizes JavaScript, with dependencies managed via `npm`, requiring version 1.3.0 or higher.

Django is a comprehensive web framework that includes a wide array of built-in features and libraries, such as `asgiref` for asynchronous server gateway interface support and `sqlparse` for SQL parsing. The project also supports optional dependencies like `argon2-cffi` and `bcrypt` for password hashing.

The package manager for Python dependencies is `setuptools`, as specified in the `pyproject.toml`, while JavaScript dependencies are managed using `npm`, with `eslint`, `puppeteer`, `grunt`, and `qunit` as key development dependencies. The testing framework for JavaScript is QUnit, executed via Grunt, as indicated in the `package.json` with the command `grunt test --verbose`. For Python, testing is likely integrated into the Django framework itself, although specific test commands are not detailed in the provided files.

This project is a web framework, not a standalone application or CLI tool. It serves as a foundational library for building web applications, providing developers with tools to handle everything from database management to URL routing and template rendering.

The primary purpose of Django is to simplify the process of building complex, database-driven websites by providing reusable components and a clean, pragmatic design philosophy. It is particularly well-suited for developers who need to create web applications quickly without sacrificing scalability or maintainability.

The repository is structured with several top-level directories, including `django/` (the core framework code), `tests/` (containing over 2500 test files), and `docs/` (with around 729 documentation files). Other directories include `scripts/`, `js_tests/`, and configuration files like `package.json`, `pyproject.toml`, and `tox.ini`.

Key entry point files include `django/__init__.py` and `django/__main__.py`, which are likely used to initialize and run the framework. The `django-admin` script, defined in `pyproject.toml`, is a command-line utility for administrative tasks.

The architecture pattern of Django is primarily Model-View-Template (MVT), a variant of the Model-View-Controller (MVC) pattern. This pattern separates the data model, business logic, and user interface, promoting organized and maintainable code.

Notable conventions include the use of `ReST` and `Sphinx` for documentation, as well as a strong emphasis on community contributions, with detailed guidelines and a code of conduct. The project uses Trac for issue tracking, which is unusual for a GitHub-hosted project, indicating a preference for more robust project management tools.

Overall, Django is a mature, well-documented framework with a strong community focus, designed to streamline the development of web applications by providing a comprehensive set of tools and conventions.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | `pyproject.toml` | 0 _(auto)_ |
| Q3 | Package managers | Objective | setuptools, npm | 0 _(auto)_ |
| Q4 | JS test frameworks | Objective | QUnit | 0 _(auto)_ |
| Q5 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Model-View-Template (MVT) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Core package size | Navigational | Not in profile. | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | tests/ | 0 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | The primary purpose of Django is to simplify the process of building complex, database-driven websites by providing reusable components and a clean, pragmatic design philosophy. | 1 _(auto)_ |
| Q12 | File skew | Inferential | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1  
Python

Q2  
`pyproject.toml`

Q3  
setuptools, npm

Q4  
QUnit

Q5  
Not in profile.

Q6  
Model-View-Template (MVT)

Q7  
Not in profile.

Q8  
Not in profile.

Q9  
tests/

Q10  
Framework

Q11  
The primary purpose of Django is to simplify the process of building complex, database-driven websites by providing reusable components and a clean, pragmatic design philosophy.

Q12  
Not in profile.
```
