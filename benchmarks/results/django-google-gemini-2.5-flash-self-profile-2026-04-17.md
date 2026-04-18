# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** django
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 6947 paths, 3 anchor files, 3 doc files
**Call 1 — profile build:** 59751 prompt tokens → 707 completion tokens (profile)
**Call 2 — questions:** 983 prompt tokens + 148 completion tokens
**Total tokens consumed:** 61589

**CHODE equivalent:** ~160 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 373x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 12/36 (33% of auto-scorable)
**Stump questions (7):** 3/21 (14%)

---

## AI-Built Profile

```
Primary language(s) and version:
Python 3.12+ (pyproject.toml specifies 3.12, 3.13, 3.14)
JavaScript (for frontend components and testing)

Framework(s) and key libraries:
Python: Django (self-referential, as this is the Django project itself), asgiref, sqlparse, tzdata (Windows only), argon2-cffi (optional), bcrypt (optional)
JavaScript: jQuery (implied by `jquery.init.js`), QUnit (testing)

Package manager(s):
Python: pip (implied by `python -m pip install Sphinx`), setuptools (build system)
JavaScript: npm (package.json)

Test framework(s) and test commands:
Python: Django's internal test suite (run via `docs/internals/contributing/writing-code/unit-tests.txt` instructions)
JavaScript: QUnit (`grunt test --verbose`), ESLint (`eslint .` for linting)

Project type:
Framework

Primary purpose:
Django is a high-level Python web framework designed for rapid development and clean, pragmatic web application design. It provides a comprehensive set of tools and features for building robust web applications.

Top directories and approximate file counts:
django/ (core framework, ~636 files + many locale files)
tests/ (~2548 files)
docs/ (~729 files)
.github/ (CI/CD workflows, ~20 files)
django/contrib/ (reusable components, ~2000+ files including many locale files)

Key entry point files:
django/__init__.py (package initialization)
django/__main__.py (command-line execution)
django/conf/project_template/manage.py-tpl (template for project management script)
django/core/management:execute_from_command_line (entry point for `django-admin` CLI)

Architecture pattern:
Model-View-Controller (MVC) or Model-View-Template (MVT) as commonly understood in web frameworks. Django emphasizes a "batteries-included" approach, providing many built-in components for common web development tasks (admin, auth, ORM, templating, etc.).

Notable conventions or gotchas:
- Extensive use of locale files (`LC_MESSAGES/*.mo`, `*.po`) for internationalization across core and contrib apps.
- `pyproject.toml` is used for project metadata and build system configuration, indicating a modern Python project setup.
- `CONTRIBUTING.rst` explicitly states that non-trivial pull requests without a Trac ticket will be closed, highlighting a specific contribution workflow that relies on an external issue tracker (Trac) in addition to GitHub.
- Documentation is written in reStructuredText (`.rst`) and built with Sphinx.
- Frontend testing uses Grunt and QUnit, with ESLint for code quality.
- CI/CD workflows are defined in `.github/workflows/`.
- The project includes various "contrib" applications (`admin`, `auth`, `contenttypes`, `flatpages`, `gis`, `humanize`, `messages`, `postgres`, `redirects`, `sessions`, `sitemaps`, `sites`) demonstrating its modular and extensible nature.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python 3.12+ | 3 _(auto)_ |
| Q2 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | Package managers | Objective | Python: pip, setuptools JavaScript: npm | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | QUnit | 0 _(auto)_ |
| Q5 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Model-View-Controller (MVC) or Model-View-Template (MVT) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Core package size | Navigational | ~636 files + many locale files | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | tests/ | 0 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | Django is a high-level Python web framework designed for rapid development and clean, pragmatic web application design. | 3 _(auto)_ |
| Q12 | File skew | Inferential | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
Python 3.12+

Q2:
Not in profile.

Q3:
Python: pip, setuptools
JavaScript: npm

Q4:
QUnit

Q5:
Not in profile.

Q6:
Model-View-Controller (MVC) or Model-View-Template (MVT)

Q7:
Not in profile.

Q8:
~636 files + many locale files

Q9:
tests/

Q10:
Framework

Q11:
Django is a high-level Python web framework designed for rapid development and clean, pragmatic web application design.

Q12:
Not in profile.
```
