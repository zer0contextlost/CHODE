# CHODE Benchmark — openai/gpt-4o
**Date:** 2026-04-17
**Model:** openai/gpt-4o
**Provider:** openrouter
**Repo:** django
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 261 prompt + 220 completion = 481 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 14/36 (39% of auto-scorable)
**Stump questions (7):** 4/21 (19% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | YAML | 0 _(auto)_ |
| Q3 | Package managers | Objective | pip, npm | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | Jest | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | src/middleware/authentication.py | 1 _(auto)_ |
| Q8 | Core package size | Navigational | 50 | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | src/ | 0 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | To provide a web development framework for building scalable applications. | 1 _(auto)_ |
| Q12 | File skew | Inferential | 5 times larger | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 14)_

---

## Raw Model Response

```
Q1: What language is this project primarily written in?
Python

Q2: What configuration file format does this project use?
YAML

Q3: What package managers does this project use? List all mentioned.
pip, npm

Q4: What JavaScript test frameworks are used in this project?
Jest

Q5: What CI system is configured?
GitHub Actions

Q6: What architectural pattern does this codebase implement?
Model-View-Controller (MVC)

Q7: What is the specific middleware file path mentioned in the profile?
src/middleware/authentication.py

Q8: How many source files are in the core django/ package?
50

Q9: Which top-level directory has the most files?
src/

Q10: Is this a framework, library, CLI tool, or application?
Framework

Q11: What is this project's primary purpose in one sentence?
To provide a web development framework for building scalable applications.

Q12: How many times larger is the core django/ package than the js_tests/ package by file count?
5 times larger
```
