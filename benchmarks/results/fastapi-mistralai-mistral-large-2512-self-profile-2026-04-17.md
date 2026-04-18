# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** fastapi
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 2983 paths, 1 anchor files, 4 doc files
**Call 1 — profile build:** 41016 prompt tokens → 654 completion tokens (profile)
**Call 2 — questions:** 930 prompt tokens + 212 completion tokens
**Total tokens consumed:** 42812

**CHODE equivalent:** ~211 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 194x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 22/36 (61% of auto-scorable)
**Stump questions (7):** 11/21 (52%)

---

## AI-Built Profile

```
This repository is the official FastAPI framework codebase, a modern Python web framework for building APIs.

Primary language is Python 3.10+ (as specified in pyproject.toml). The framework is built on top of Starlette (ASGI framework) and Pydantic (data validation), with key dependencies including typing-extensions, annotated-doc, and typing-inspection. The project uses PDM as its primary package manager (pdm-backend in build-system), with dependencies defined in pyproject.toml.

Testing is handled through pytest, with test commands available via scripts/test.sh and scripts/test-cov.sh for coverage. The test suite is extensive, covering core functionality, tutorials, and edge cases. Playwright is used for browser-based testing of documentation examples.

This is primarily a framework/library project, though it includes a CLI component (fastapi.cli) and comprehensive documentation. The primary purpose is to provide a high-performance, easy-to-use Python framework for building production-ready APIs with automatic OpenAPI and JSON Schema documentation.

Directory structure and approximate file counts:
- fastapi/ (core framework): ~50 files
- tests/ (test suite): ~500 files (including tutorial tests)
- docs/ (documentation): ~2000 files (multi-language docs in en/, es/, fr/, etc.)
- docs_src/ (documentation examples): ~300 files
- scripts/: ~30 utility scripts
- .github/workflows/: 20+ CI/CD workflows

Key entry point files include:
- fastapi/__init__.py (main package)
- fastapi/applications.py (FastAPI class)
- fastapi/cli.py (CLI interface)
- pyproject.toml (project configuration)
- fastapi/routing.py (route handling)
- fastapi/dependencies/ (dependency injection system)

The architecture follows a layered pattern with clear separation between:
1. Core application/routing layer (applications.py, routing.py)
2. Request/response handling (requests.py, responses.py)
3. Dependency injection system (dependencies/)
4. Security components (security/)
5. OpenAPI documentation generation (openapi/)

Notable conventions and gotchas:
- Uses Python type hints extensively for automatic data validation and API documentation
- Follows ASGI standards for async support
- Tutorial examples are tested as part of the test suite (docs_src/ examples are mirrored in tests/)
- Multi-language documentation is maintained in parallel directories (docs/en/, docs/es/, etc.)
- Uses Pydantic v2 for data models and validation
- Many features rely on Python 3.10+ syntax (particularly type annotations)
- The test suite includes both unit tests and integration tests for tutorial examples
- CI/CD pipelines handle documentation deployment, translation management, and release processes
- Security is handled through dedicated modules with OAuth2, API keys, and HTTP auth support
- The project maintains strict backward compatibility while adding new features

The codebase is well-organized with clear separation between framework code, tests, and documentation. The extensive test coverage (including testing all tutorial examples) ensures reliability, while the multi-language documentation structure supports the framework's international community.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | PDM is used as the primary package manager. | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | fastapi/applications.py | 3 _(auto)_ |
| Q5 | Routing file | Navigational | fastapi/routing.py | 3 _(auto)_ |
| Q6 | Config format | Objective | toml (pyproject.toml) | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | Layered pattern with separation between core application/routing, request/response handling, dependency injection, security, and OpenAPI documentation generation. | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions (CI/CD workflows in .github/workflows/) | 3 _(auto)_ |
| Q9 | Install command | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | File distribution | Inferential | The documentation examples directory (docs_src/ with ~300 files) contains fewer files than the core library (fastapi/ with ~50 files). The documentation directory (docs/ with ~2000 files) contains more files than both. | 2 _(auto)_ |
| Q11 | Project type | Inferential | Framework (primarily), though it includes a CLI component. | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | To provide a high-performance, easy-to-use Python framework for building production-ready APIs with automatic OpenAPI and JSON Schema documentation. | 2 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
PDM is used as the primary package manager.

Q2:
Starlette

Q3:
Pydantic

Q4:
fastapi/applications.py

Q5:
fastapi/routing.py

Q6:
toml (pyproject.toml)

Q7:
Layered pattern with separation between core application/routing, request/response handling, dependency injection, security, and OpenAPI documentation generation.

Q8:
GitHub Actions (CI/CD workflows in .github/workflows/)

Q9:
Not in profile.

Q10:
The documentation examples directory (docs_src/ with ~300 files) contains fewer files than the core library (fastapi/ with ~50 files). The documentation directory (docs/ with ~2000 files) contains more files than both.

Q11:
Framework (primarily), though it includes a CLI component.

Q12:
To provide a high-performance, easy-to-use Python framework for building production-ready APIs with automatic OpenAPI and JSON Schema documentation.
```
