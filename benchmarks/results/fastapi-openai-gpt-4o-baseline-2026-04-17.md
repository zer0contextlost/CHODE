# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** fastapi
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 274 prompt + 263 completion = 537 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 14/36 (39% of auto-scorable)
**Stump questions (7):** 3/21 (14% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Package manager | Objective | pip | 0 _(auto)_ |
| Q2 | ASGI base framework | Objective | FastAPI | 0 _(auto)_ |
| Q3 | Validation library | Objective | Pydantic | 3 _(auto)_ |
| Q4 | Application class file | Navigational | main.py | 0 _(auto)_ |
| Q5 | Routing file | Navigational | routes.py | 0 _(auto)_ |
| Q6 | Config format | Objective | pyproject.toml | 3 _(auto)_ |
| Q7 | Architectural patterns | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q8 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q9 | Install command | Domain | pip install "fastapi[all]" | 0 _(auto)_ |
| Q10 | File distribution | Inferential | Core library: 10 files, Documentation examples: 5 files | 0 _(auto)_ |
| Q11 | Project type | Inferential | Library | 2 _(auto)_ |
| Q12 | Primary purpose | Objective | To provide a high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints. | 3 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 14)_

---

## Raw Model Response

```
Q1: What package manager is used for Python dependencies in this project?
pip

Q2: What ASGI framework does this library build on top of?
FastAPI

Q3: What data validation library provides the type system?
Pydantic

Q4: What file defines the main FastAPI application class?
main.py

Q5: What file contains the HTTP routing logic?
routes.py

Q6: What file format is used for project configuration (pyproject, setup.cfg, requirements.txt, or toml)?
pyproject.toml

Q7: What architectural patterns does this codebase implement?
Model-View-Controller (MVC)

Q8: What CI system is configured for this project?
GitHub Actions

Q9: What is the exact command to install FastAPI with all standard dependencies?
pip install "fastapi[all]"

Q10: Does the core library or the documentation examples directory contain more files? Give the counts.
Core library: 10 files, Documentation examples: 5 files

Q11: Is this a framework, library, CLI tool, or application?
Library

Q12: What is this project's primary purpose in one sentence?
To provide a high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints.
```
