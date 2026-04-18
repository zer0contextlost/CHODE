# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** django
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 6947 paths, 3 anchor files, 3 doc files
**Call 1 — profile build:** 59751 prompt tokens → 2656 completion tokens (profile)
**Call 2 — questions:** 1185 prompt tokens + 1348 completion tokens
**Total tokens consumed:** 64940

**CHODE equivalent:** ~160 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 373x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 14/36 (39% of auto-scorable)
**Stump questions (7):** 5/21 (24%)

---

## AI-Built Profile

```
Primary language(s) and version:
The primary language is Python. The `pyproject.toml` file specifies a minimum required version of Python 3.12. JavaScript is also used for the admin interface and related tooling.

Framework(s) and key libraries:
This repository contains the source code for the Django web framework itself. It is not an application built with a framework, but the framework itself. Key Python dependencies include `asgiref` for ASGI support and `sqlparse` for SQL parsing. For frontend development and testing, it uses `Grunt`, `QUnit`, and `Puppeteer`.

Package manager(s):
The project uses `pip` for managing Python dependencies, with `setuptools` as the build backend, as defined in `pyproject.toml`. For JavaScript development dependencies, it uses `npm`, as shown by the `package.json` file.

Test framework(s) and test commands:
The Python test suite is extensive and located in the `tests/` directory. It uses Python's built-in `unittest` framework, run via Django's own custom test runner. Instructions for running tests are in the documentation. JavaScript tests for the admin interface use QUnit and are executed with the command `grunt test`, which is also aliased to `npm test`.

Project type:
This is a web framework. It provides a library of tools and conventions for developers to build web applications. It also includes a command-line interface (`django-admin`).

Primary purpose in 1-2 sentences:
Django is a high-level Python web framework designed to enable rapid development of secure and maintainable websites. It follows the "batteries-included" philosophy, providing built-in solutions for common web development tasks like ORM, authentication, and an admin interface.

Top directories and approximate file counts:
The repository contains over 6,900 files. The main directories are:
- `django/` (~3,600 files): The core framework source code, including the vast `contrib` modules and thousands of internationalization files.
- `tests/` (~2,500 files): A comprehensive suite of unit and integration tests for the framework.
- `docs/` (~700 files): Extensive documentation written in reStructuredText for the Sphinx generator.

Key entry point files:
- `django/core/management/__init__.py`: The logic behind the `django-admin` command-line utility, which is the main entry point for managing projects.
- `django/core/handlers/wsgi.py`: The entry point for running a Django project as a WSGI application.
- `django/core/handlers/asgi.py`: The entry point for running a Django project as an ASGI application, enabling asynchronous features.
- `django/__main__.py`: Allows running `python -m django`.

Architecture pattern:
Django's architecture is a variation of Model-View-Controller (MVC) known as Model-Template-View (MTV).
- **Model:** (`django.db.models`) The data access layer, an ORM that maps Python objects to database tables.
- **Template:** (`django.template`) The presentation layer, a templating language for generating HTML.
- **View:** (`django.views`) The business logic layer that handles requests and returns responses, coordinating between the model and template.

Notable conventions or gotchas:
- **Trac for Issue Tracking:** A critical gotcha for contributors is that the project uses Trac for bug reports and feature requests, not GitHub Issues. The `CONTRIBUTING.rst` file states that non-trivial pull requests without a corresponding Trac ticket will be closed.
- **"Batteries-Included":** A significant portion of the framework's functionality resides in the `django/contrib/` directory, which contains optional but tightly integrated applications like the admin site (`contrib.admin`), authentication (`contrib.auth`), and geospatial features (`contrib.gis`).
- **Internationalization:** The project has deep support for i18n, evidenced by the thousands of `.po` and `.mo` translation files for dozens of languages across all `contrib` apps.
- **Documentation:** The project maintains rigorous and comprehensive documentation in the `docs/` directory, which is a primary resource for all users.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | The profile mentions `pyproject.toml` and `package.json`. | 0 _(auto)_ |
| Q3 | Package managers | Objective | pip, npm | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | QUnit | 0 _(auto)_ |
| Q5 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Model-Template-View (MTV) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Core package size | Navigational | Approximately 3,600 files. | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | django/ | 2 _(auto)_ |
| Q10 | Project type | Inferential | This is a web framework. | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | Django is a high-level Python web framework designed to enable rapid development of secure and maintainable websites. | 3 _(auto)_ |
| Q12 | File skew | Inferential | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
Python

Q2
The profile mentions `pyproject.toml` and `package.json`.

Q3
pip, npm

Q4
QUnit

Q5
Not in profile.

Q6
Model-Template-View (MTV)

Q7
Not in profile.

Q8
Approximately 3,600 files.

Q9
django/

Q10
This is a web framework.

Q11
Django is a high-level Python web framework designed to enable rapid development of secure and maintainable websites.

Q12
Not in profile.
```
