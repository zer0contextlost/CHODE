# CHODE Benchmark — Self-Profile Mode — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** fastapi
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 2983 paths, 1 anchor files, 4 doc files
**Call 1 — profile build:** 36216 prompt tokens → 530 completion tokens (profile)
**Call 2 — questions:** 800 prompt tokens + 98 completion tokens
**Total tokens consumed:** 37644

**CHODE equivalent:** ~211 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 172x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 10/36 (28% of auto-scorable)
**Stump questions (7):** 3/21 (14%)

---

## AI-Built Profile

```
This repository is primarily a Python project, specifically targeting Python versions 3.10 and above, as indicated in the `pyproject.toml` file. The project is built around the FastAPI framework, a high-performance web framework for building APIs with Python, leveraging standard Python type hints. Key libraries include Starlette for the web server and Pydantic for data validation and settings management. The project also utilizes additional libraries such as `typing-extensions`, `typing-inspection`, and `annotated-doc`.

The package manager used is PDM, as specified by the `pdm-backend` in the `pyproject.toml`. The project includes optional dependencies for extended functionality, such as `httpx` for HTTP requests, `jinja2` for templating, and `uvicorn` for ASGI server capabilities.

Testing is a significant component of this repository, with a comprehensive suite of tests located in the `tests` directory. The test framework is not explicitly mentioned, but the presence of `test_` prefixed files suggests the use of `pytest`, a common choice for Python projects. Test commands likely include running `pytest` or a similar command to execute the test suite.

This repository can be classified as a monorepo, containing both the FastAPI framework itself and related documentation, examples, and tests. Its primary purpose is to provide a robust, easy-to-use framework for building APIs, with a focus on performance and developer productivity.

The top directories include `fastapi` (core framework code), `docs` (documentation in multiple languages), `docs_src` (source code for documentation examples), `tests` (test cases), and `scripts` (utility scripts). The file count is extensive, with nearly 3,000 files, indicating a large and complex codebase.

Key entry point files include `fastapi/__init__.py` and `fastapi/__main__.py`, which are typical for Python packages, allowing the framework to be imported and executed. The architecture pattern is service-oriented, focusing on API development, with a modular structure that separates concerns such as routing, middleware, and security.

Notable conventions include the use of type hints throughout the codebase, aligning with FastAPI's emphasis on type safety and developer experience. The repository also follows a structured approach to documentation, with extensive multilingual support and automated workflows for building and deploying documentation.

Overall, this repository is a comprehensive and well-organized project aimed at providing a high-performance API framework, with a strong emphasis on developer productivity and ease of use. It leverages modern Python features and libraries to deliver a robust solution for API development.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | PDM | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | Not in profile. | 0 _(auto)_ |
| Q5 | Routing file | Navigational | Not in profile. | 0 _(auto)_ |
| Q6 | Config format | Objective | pyproject.toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | Service-oriented | 0 _(auto)_ |
| Q8 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q9 | Install command | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | File distribution | Inferential | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | Framework | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | To provide a robust, easy-to-use framework for building APIs, with a focus on performance and developer productivity. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1  
PDM

Q2  
Starlette

Q3  
Pydantic

Q4  
Not in profile.

Q5  
Not in profile.

Q6  
pyproject.toml

Q7  
Service-oriented

Q8  
Not in profile.

Q9  
Not in profile.

Q10  
Not in profile.

Q11  
Framework

Q12  
To provide a robust, easy-to-use framework for building APIs, with a focus on performance and developer productivity.
```
