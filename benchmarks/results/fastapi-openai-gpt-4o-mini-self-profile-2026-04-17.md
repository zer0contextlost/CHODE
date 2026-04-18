# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o-mini
**Date:** 2026-04-17
**Model:** openai/gpt-4o-mini
**Provider:** openrouter
**Repo:** fastapi
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 2983 paths, 1 anchor files, 4 doc files
**Call 1 — profile build:** 36216 prompt tokens → 549 completion tokens (profile)
**Call 2 — questions:** 818 prompt tokens + 117 completion tokens
**Total tokens consumed:** 37700

**CHODE equivalent:** ~211 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 172x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 7/36 (19% of auto-scorable)
**Stump questions (7):** 0/21 (0%)

---

## AI-Built Profile

```
This repository primarily uses Python as its programming language, with a focus on version 3.10 and above. The main framework is FastAPI, a high-performance web framework designed for building APIs with Python, leveraging standard Python type hints. Key libraries include Starlette for the web framework capabilities and Pydantic for data validation and settings management.

The project utilizes PDM (Python Development Master) as its package manager, which is specified in the `pyproject.toml` file. This file outlines the dependencies and project metadata, including the required Python version and optional dependencies for various functionalities.

For testing, the repository employs a variety of test frameworks, including pytest, which is commonly used in Python projects. The test commands can be executed through scripts defined in the repository, such as `scripts/test.sh`, which likely runs the test suite. The repository also includes a comprehensive set of tests located in the `tests` directory, covering various aspects of the FastAPI framework.

This project is classified as a library/framework, specifically designed to facilitate the development of web APIs. Its primary purpose is to provide a fast, easy-to-use framework for building production-ready APIs with minimal code duplication and robust features.

The top-level directories include:
- `.github` (configuration files for GitHub actions and templates)
- `docs` (documentation files, including translations and tutorials)
- `fastapi` (the core FastAPI framework code)
- `tests` (unit and integration tests)
- `scripts` (utility scripts for various tasks)
- `docs_src` (source files for documentation examples)

The `fastapi` directory contains the main implementation of the framework, while the `tests` directory includes a large number of test files, indicating a strong emphasis on testing and quality assurance.

Key entry point files include:
- `fastapi/__init__.py` (initializes the FastAPI package)
- `fastapi/__main__.py` (entry point for running the FastAPI application)
- `pyproject.toml` (defines project metadata and dependencies)

The architecture pattern of the project appears to follow a modular design, allowing for easy extension and integration of various components. The use of Pydantic for data validation and settings management suggests a focus on type safety and clarity in data handling.

Notable conventions include the use of type hints throughout the codebase, which enhances code readability and enables better editor support. The repository also emphasizes the importance of writing tests and maintaining up-to-date documentation, as indicated by the presence of extensive documentation files and a dedicated `CONTRIBUTING.md` file outlining contribution guidelines.

Overall, this repository exemplifies best practices in modern Python web development, focusing on performance, ease of use, and robust testing.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | PDM (Python Development Master) | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | fastapi/__init__.py | 0 _(auto)_ |
| Q5 | Routing file | Navigational | Not in profile. | 0 _(auto)_ |
| Q6 | Config format | Objective | pyproject | 0 _(auto)_ |
| Q7 | Architectural patterns | Inferential | Modular design | 0 _(auto)_ |
| Q8 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q9 | Install command | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | File distribution | Inferential | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | Framework | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | To provide a fast, easy-to-use framework for building production-ready APIs with minimal code duplication and robust features. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:  
PDM (Python Development Master)

Q2:  
Starlette

Q3:  
Pydantic

Q4:  
fastapi/__init__.py

Q5:  
Not in profile.

Q6:  
pyproject

Q7:  
Modular design

Q8:  
Not in profile.

Q9:  
Not in profile.

Q10:  
Not in profile.

Q11:  
Framework

Q12:  
To provide a fast, easy-to-use framework for building production-ready APIs with minimal code duplication and robust features.
```
