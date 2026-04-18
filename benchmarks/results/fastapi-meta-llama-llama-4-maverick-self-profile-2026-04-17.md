# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** fastapi
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 2983 paths, 1 anchor files, 4 doc files
**Call 1 — profile build:** 34896 prompt tokens → 430 completion tokens (profile)
**Call 2 — questions:** 702 prompt tokens + 127 completion tokens
**Total tokens consumed:** 36155

**CHODE equivalent:** ~211 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 165x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 19/36 (53% of auto-scorable)
**Stump questions (7):** 8/21 (38%)

---

## AI-Built Profile

```
The primary language of this repository is Python, with a required version of >=3.10. The framework is FastAPI, a modern, fast web framework for building APIs with Python based on standard Python type hints. Key libraries include Starlette (>=0.46.0), Pydantic (>=2.9.0), and typing-extensions (>=4.8.0).

The package manager used is PDM (Python Development Master), as indicated by the presence of pyproject.toml and uv.lock files.

The test framework used is Pytest, with test files located in the tests/ directory. Test commands can be run using scripts/test.sh.

This project is a framework/library, specifically a web framework for building APIs. Its primary purpose is to provide a high-performance, easy-to-use, and standards-based framework for building APIs with Python.

The top directories and approximate file counts are: 
- .github (27 files)
- docs (over 1000 files, including documentation in multiple languages)
- docs_src (over 200 files, including source code for documentation examples)
- fastapi (over 20 files, including the framework's core code)
- scripts (over 20 files, including utility scripts)
- tests (over 100 files, including test cases)

Key entry point files include fastapi/__init__.py, fastapi/applications.py, and fastapi/cli.py.

The architecture pattern appears to be a mix of monolithic and modular, with the core framework code located in the fastapi/ directory, and documentation and test code organized in separate directories.

Notable conventions include the use of Pydantic models for data validation and serialization, and the use of Starlette's ASGI compatibility for building high-performance web applications. The project also follows standard professional guidelines for documentation, testing, and security.

Some gotchas to be aware of include the requirement for Python >=3.10, and the use of PDM as the package manager, which may require additional setup or configuration for some users. Additionally, the project's documentation is extensive and includes multiple languages, which may require additional effort to maintain or contribute to.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | PDM (Python Development Master) | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | Starlette | 3 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | fastapi/applications.py | 3 _(auto)_ |
| Q5 | Routing file | Navigational | Not in profile. | 0 _(auto)_ |
| Q6 | Config format | Objective | toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | a mix of monolithic and modular | 0 _(auto)_ |
| Q8 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q9 | Install command | Domain | Not in profile. | 0 _(auto)_ |
| Q10 | File distribution | Inferential | docs (over 1000 files) contains more files than docs_src (over 200 files) | 2 _(auto)_ |
| Q11 | Project type | Inferential | a framework/library | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | Its primary purpose is to provide a high-performance, easy-to-use, and standards-based framework for building APIs with Python. | 2 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
PDM (Python Development Master)

Q2
Starlette

Q3
Pydantic

Q4
fastapi/applications.py

Q5
Not in profile.

Q6
toml

Q7
a mix of monolithic and modular

Q8
Not in profile.

Q9
Not in profile.

Q10
docs (over 1000 files) contains more files than docs_src (over 200 files)

Q11
a framework/library

Q12
Its primary purpose is to provide a high-performance, easy-to-use, and standards-based framework for building APIs with Python.
```
