# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** fastapi
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 2983 paths, 1 anchor files, 4 doc files
**Call 1 — profile build:** 53529 prompt tokens → 872 completion tokens (profile)
**Call 2 — questions:** 1161 prompt tokens + 268 completion tokens
**Total tokens consumed:** 55830

**CHODE equivalent:** ~211 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 254x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 23/36 (64% of auto-scorable)
**Stump questions (7):** 8/21 (38%)

---

## AI-Built Profile

```
Primary language: Python 3.10+ (explicitly stated in pyproject.toml and .python-version, with classifiers up to 3.14).

Frameworks and key libraries: FastAPI (the project itself), Starlette (web framework foundation), Pydantic (data validation and settings management), typing-extensions, typing-inspection, annotated-doc. Optional dependencies include httpx (for testing), jinja2 (for templates), python-multipart (forms/files), email-validator, uvicorn (ASGI server), pydantic-settings, pydantic-extra-types.

Package manager: PDM (indicated by `pdm-backend` in build-system and `uv.lock`).

Test frameworks and test commands: pytest (implied by test directory structure and common Python testing practices). Test commands are defined in `scripts/coverage.sh`, `scripts/test-cov-html.sh`, `scripts/test-cov.sh`, `scripts/test.sh`. Playwright is used for some UI-related tests (`scripts/playwright/`).

Project type: Framework/Library. It provides a web framework for building APIs.

Primary purpose: FastAPI is a high-performance, easy-to-use Python web framework for building APIs, leveraging standard Python type hints for automatic data validation, serialization, and interactive API documentation (OpenAPI/Swagger UI).

Top directories and approximate file counts:
- docs/ (2000+ files): Extensive, multi-language documentation (en, de, es, fr, ja, ko, pt, ru, tr, uk, zh-hant, zh) including markdown files, images, and MkDocs configuration. This is by far the largest part of the repository.
- fastapi/ (50+ files): The core FastAPI framework source code.
- docs_src/ (300+ files): Source code examples used in the documentation, organized by tutorial section.
- tests/ (300+ files): Comprehensive test suite for the framework and its documentation examples.
- .github/ (20+ files): GitHub Actions workflows, issue/discussion templates, funding, and labeler configurations.
- scripts/ (50+ files): Various utility scripts for development, testing, documentation generation, and translation management.

Key entry point files:
- `fastapi/__init__.py`: Main package entry point.
- `fastapi/applications.py`: Defines the FastAPI application class.
- `fastapi/cli.py`: Command-line interface entry point (`fastapi` script).
- `docs/en/mkdocs.yml`: Main configuration for the English documentation site. Similar `mkdocs.yml` files exist for other languages.

Architecture pattern: The core `fastapi/` directory follows a modular structure typical of a Python web framework, with distinct modules for applications, routing, dependencies, security, responses, etc. The documentation (`docs/` and `docs_src/`) is a separate, well-organized component, indicating a strong emphasis on user guidance and examples.

Notable conventions or gotchas:
- Strong emphasis on documentation and examples, with `docs_src` containing runnable code directly referenced in the `docs`.
- Multi-language documentation is a significant feature, managed by specific scripts (`scripts/translate.py`, `scripts/notify_translations.py`, `scripts/translation_fixer.py`).
- Extensive use of GitHub Actions for CI/CD, including testing, documentation builds, and translation notifications.
- The `fastapi-slim/` directory and its `README.md` indicate a deprecated package (`fastapi-slim`) that was merged into the main `fastapi` package, serving as a migration path. This is an important historical note for users.
- The project uses `py.typed` indicating it provides type hints for static analysis.
- `_compat/` directory suggests handling compatibility across different Python or Pydantic versions.
- `fastapi/.agents/skills/fastapi/` implies the use of some form of AI agent or tool for development or documentation, possibly for generating or verifying content.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | PDM (indicated by `pdm-backend` in build-system and `uv.lock`). | 3 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette (web framework foundation). | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic (data validation and settings management). | 3 _(auto)_ |
| Q4 | Application class file | Navigational | `fastapi/applications.py` | 3 _(auto)_ |
| Q5 | Routing file | Navigational | Not in profile. | 0 _(auto)_ |
| Q6 | Config format | Objective | Not in profile. | 0 _(auto)_ |
| Q7 | Architectural patterns | Inferential | The core `fastapi/` directory follows a modular structure typical of a Python web framework, with distinct modules for applications, routing, dependencies, security, responses, etc. The documentation (`docs/` and `docs_src/`) is a separate,… | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions. | 3 _(auto)_ |
| Q9 | Install command | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | File distribution | Inferential | The documentation examples directory (`docs_src/`) contains 300+ files, while the core library (`fastapi/`) contains 50+ files. Therefore, the documentation examples directory contains more files. | 2 _(auto)_ |
| Q11 | Project type | Inferential | Framework/Library. | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | FastAPI is a high-performance, easy-to-use Python web framework for building APIs, leveraging standard Python type hints for automatic data validation, serialization, and interactive API documentation (OpenAPI/Swagger UI). | 3 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
PDM (indicated by `pdm-backend` in build-system and `uv.lock`).

Q2:
Starlette (web framework foundation).

Q3:
Pydantic (data validation and settings management).

Q4:
`fastapi/applications.py`

Q5:
Not in profile.

Q6:
Not in profile.

Q7:
The core `fastapi/` directory follows a modular structure typical of a Python web framework, with distinct modules for applications, routing, dependencies, security, responses, etc. The documentation (`docs/` and `docs_src/`) is a separate, well-organized component.

Q8:
GitHub Actions.

Q9:
Not in profile.

Q10:
The documentation examples directory (`docs_src/`) contains 300+ files, while the core library (`fastapi/`) contains 50+ files. Therefore, the documentation examples directory contains more files.

Q11:
Framework/Library.

Q12:
FastAPI is a high-performance, easy-to-use Python web framework for building APIs, leveraging standard Python type hints for automatic data validation, serialization, and interactive API documentation (OpenAPI/Swagger UI).
```
