# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** django
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 6947 paths, 3 anchor files, 3 doc files
**Call 1 — profile build:** 53252 prompt tokens → 615 completion tokens (profile)
**Call 2 — questions:** 877 prompt tokens + 115 completion tokens
**Total tokens consumed:** 54859

**CHODE equivalent:** ~160 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 333x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 12/36 (33% of auto-scorable)
**Stump questions (7):** 0/21 (0%)

---

## AI-Built Profile

```
Based on the repository analysis, this is the Django web framework, a mature Python-based web development toolkit. Here's a compressed profile:

Primary language is Python (3.12+), with JavaScript for frontend components. Django itself is the core framework, providing a full-stack solution with built-in ORM, authentication, admin interface, and templating. Key libraries include asgiref (ASGI support), sqlparse (SQL parsing), and optional bcrypt/argon2-cffi for password hashing. The project uses setuptools for Python packaging and npm for JavaScript dependencies.

Testing employs multiple frameworks: QUnit for JavaScript tests (via grunt-contrib-qunit), with Django's own test framework for Python code. Test commands include "grunt test" for JS and Django's test runner for Python. The project is primarily a framework/library, though it includes application components like the admin interface.

Django's purpose is to provide a high-level Python web framework that enables rapid development of secure, maintainable websites with a "batteries-included" approach. It follows the MVT (Model-View-Template) pattern, similar to MVC but with Django's specific implementation.

Top directories and approximate file counts:
- django/ (core framework): ~636 files
- tests/ (test suite): ~2548 files
- docs/ (documentation): ~729 files
- django/contrib/ (contributed apps): ~3000+ files across auth, admin, gis, etc.
- .github/workflows/ (CI/CD): 15 workflow files

Key entry point files include:
- django/__init__.py (framework initialization)
- django/core/management/__init__.py (CLI entry point)
- manage.py (project management script template)
- django/conf/project_template/ (project scaffolding)
- Gruntfile.js (JavaScript task configuration)

The architecture follows a layered pattern with clear separation between:
1. Core components (django/core/)
2. Contributed applications (django/contrib/)
3. Public API (django/__init__.py exports)
4. Project templates (django/conf/project_template/)

Notable conventions and gotchas:
- Extensive use of Python's magic methods and metaclasses
- Heavy reliance on Django's settings system (global configuration)
- Template-based project scaffolding
- Internationalization support across all components (extensive locale files)
- Multiple database backends with GIS extensions
- Admin interface auto-generation from models
- Middleware-based request/response processing
- Signal system for decoupled component communication
- Migration system for database schema changes
- Multiple authentication backends and user models

The codebase shows careful attention to backward compatibility, with deprecation warnings and version-specific documentation. The extensive test suite covers both Python and JavaScript components, with particular attention to database operations and security features. The project follows strict coding standards (Black formatting, isort imports) and has comprehensive contribution guidelines.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q3 | Package managers | Objective | setuptools, npm | 0 _(auto)_ |
| Q4 | JS test frameworks | Objective | QUnit | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | MVT (Model-View-Template) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | Not in profile. | 0 _(auto)_ |
| Q8 | Core package size | Navigational | ~636 files | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | tests/ | 0 _(auto)_ |
| Q10 | Project type | Inferential | framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | To provide a high-level Python web framework that enables rapid development of secure, maintainable websites with a "batteries-included" approach. | 3 _(auto)_ |
| Q12 | File skew | Inferential | Not in profile. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
Python

Q2:
Not in profile.

Q3:
setuptools, npm

Q4:
QUnit

Q5:
GitHub Actions

Q6:
MVT (Model-View-Template)

Q7:
Not in profile.

Q8:
~636 files

Q9:
tests/

Q10:
framework

Q11:
To provide a high-level Python web framework that enables rapid development of secure, maintainable websites with a "batteries-included" approach.

Q12:
Not in profile.
```
