# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** fastapi
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 2983 paths, 1 anchor files, 4 doc files
**Call 1 — profile build:** 53528 prompt tokens → 2611 completion tokens (profile)
**Call 2 — questions:** 1124 prompt tokens + 1354 completion tokens
**Total tokens consumed:** 58617

**CHODE equivalent:** ~211 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 254x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 29/36 (81% of auto-scorable)
**Stump questions (7):** 14/21 (67%)

---

## AI-Built Profile

```
Primary language(s) and version:
The repository is written in Python. The `pyproject.toml` file specifies a requirement of `requires-python = ">=3.10"`.

Framework(s) and key libraries:
FastAPI is itself a web framework. It is built upon two major libraries: Starlette for all the core web and ASGI (Asynchronous Server Gateway Interface) functionality, and Pydantic for data validation, serialization, and settings management. Optional dependencies for a "standard" installation include `uvicorn` (as an ASGI server), `httpx` (for the test client), `jinja2` (for templating), and `python-multipart` (for form data).

Package manager(s):
The project uses PDM for its build backend, as specified in `pyproject.toml`. The presence of a `uv.lock` file suggests that UV is used for dependency management during development, which is a common practice in projects managed with PDM.

Test framework(s) and test commands:
The project uses `pytest` for testing. The test suite is located in the `tests/` directory. Tests can be executed using shell scripts in the `scripts/` directory, such as `scripts/test.sh` and `scripts/test-cov.sh` for running tests with coverage.

Project type:
This is a web framework and library. It is distributed as a Python package and also includes a command-line interface (CLI) tool.

Primary purpose in 1-2 sentences:
FastAPI is a modern, high-performance Python web framework for building APIs. It leverages standard Python type hints to provide data validation, serialization, and automatic, interactive API documentation, aiming to make development fast and intuitive.

Top directories and approximate file counts:
- `docs/` (~2200 files): Contains the extensive documentation, which is translated into over 10 languages (e.g., `en`, `es`, `de`, `zh`).
- `tests/` (~350 files): A comprehensive test suite that mirrors the structure of the framework and its documentation.
- `docs_src/` (~300 files): Contains the source code examples used within the documentation, ensuring they are testable and correct.
- `fastapi/` (~45 files): The core source code of the framework itself.
- `scripts/` (~40 files): A collection of helper scripts for development tasks like testing, linting, and managing documentation.

Key entry point files:
- `fastapi/__init__.py`: The main entry point for users importing the library.
- `fastapi/applications.py`: Defines the central `FastAPI` class.
- `fastapi/routing.py`: Defines the `APIRouter` class for modularizing applications.
- `fastapi/cli.py`: Implements the logic for the `fastapi` command-line tool.

Architecture pattern (if identifiable):
FastAPI is built on the ASGI standard and promotes a component-based architecture. Its most prominent architectural feature is a powerful dependency injection system, which is used for handling security, database connections, and reusable logic. The framework acts as a cohesive layer on top of Starlette (for web handling) and Pydantic (for data handling), using type annotations as the "glue".

Notable conventions or gotchas:
- The framework's core design principle is its use of Python type hints to drive functionality, from request validation to API documentation generation.
- Documentation is a first-class citizen, with a massive, multi-language `docs/` folder and a parallel `docs_src/` for tested code examples.
- The `fastapi-slim` package, found in a subdirectory, is explicitly deprecated and should not be installed; it exists only as a migration path for older projects.
- The project utilizes extensive CI/CD automation via GitHub Actions for testing, documentation deployment, and managing translations.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | The project uses PDM for its build backend and UV for dependency management during development. | 3 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | `fastapi/applications.py` | 3 _(auto)_ |
| Q5 | Routing file | Navigational | `fastapi/routing.py` | 3 _(auto)_ |
| Q6 | Config format | Objective | toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | It promotes a component-based architecture and features a powerful dependency injection system. | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q9 | Install command | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | File distribution | Inferential | The documentation examples directory (`docs_src/`) contains more files, with approximately 300 files compared to the core library's (`fastapi/`) approximately 45 files. | 2 _(auto)_ |
| Q11 | Project type | Inferential | It is a web framework, a library, and a command-line interface (CLI) tool. | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | FastAPI is a modern, high-performance Python web framework for building APIs. | 3 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
The project uses PDM for its build backend and UV for dependency management during development.

Q2
Starlette

Q3
Pydantic

Q4
`fastapi/applications.py`

Q5
`fastapi/routing.py`

Q6
toml

Q7
It promotes a component-based architecture and features a powerful dependency injection system.

Q8
GitHub Actions

Q9
Not in profile.

Q10
The documentation examples directory (`docs_src/`) contains more files, with approximately 300 files compared to the core library's (`fastapi/`) approximately 45 files.

Q11
It is a web framework, a library, and a command-line interface (CLI) tool.

Q12
FastAPI is a modern, high-performance Python web framework for building APIs.
```
