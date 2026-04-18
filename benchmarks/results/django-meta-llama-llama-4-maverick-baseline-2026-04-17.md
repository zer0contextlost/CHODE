# CHODE Benchmark — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** django
**Mode:** BASELINE (no profile — training data only)
**Token usage:** 263 prompt + 388 completion = 651 total
**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 17/36 (47% of auto-scorable)
**Stump questions (7):** 7/21 (33% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | Python | 3 _(auto)_ |
| Q2 | Config format | Objective | YAML or JSON, possibly INI | 3 _(auto)_ |
| Q3 | Package managers | Objective | pip, npm, or yarn | 3 _(auto)_ |
| Q4 | JS test frameworks | Objective | Jest or Mocha | 0 _(auto)_ |
| Q5 | CI system | Objective | GitHub Actions or CircleCI | 3 _(auto)_ |
| Q6 | Architectural pattern | Inferential | MVC (Model-View-Controller) | 0 _(auto)_ |
| Q7 | Middleware file | Navigational | middleware.py | 1 _(auto)_ |
| Q8 | Core package size | Navigational | 50-100 | 0 _(auto)_ |
| Q9 | Largest directory | Navigational | tests/ | 0 _(auto)_ |
| Q10 | Project type | Inferential | Framework | 3 _(auto)_ |
| Q11 | Primary purpose | Objective | This project is a web framework for building web applications. | 1 _(auto)_ |
| Q12 | File skew | Inferential | 5-10 times larger  Let's break down my thought process: - Q1: Many popular projects are written in Python, JavaScript, or Java. Given the mention of "django" later, I guessed Python. - Q2: YAML, JSON, and INI are common configuration file formats. -… | 0 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 17)_

---

## Raw Model Response

```
Since I don't have any information about the project, I'll make educated guesses based on common practices.

Q1
Python

Q2
YAML or JSON, possibly INI

Q3
pip, npm, or yarn

Q4
Jest or Mocha

Q5
GitHub Actions or CircleCI

Q6
MVC (Model-View-Controller)

Q7
middleware.py

Q8
50-100

Q9
tests/

Q10
Framework

Q11
This project is a web framework for building web applications.

Q12
5-10 times larger

Let's break down my thought process:
- Q1: Many popular projects are written in Python, JavaScript, or Java. Given the mention of "django" later, I guessed Python.
- Q2: YAML, JSON, and INI are common configuration file formats.
- Q3: pip is Python's package manager, while npm and yarn are JavaScript package managers. Given the mention of "django" and potential JavaScript test frameworks, I listed a combination.
- Q4: Jest and Mocha are popular JavaScript test frameworks.
- Q5: GitHub Actions and CircleCI are popular CI systems.
- Q6: MVC is a common architectural pattern.
- Q7: The mention of a "middleware file path" and "django" led me to guess a Python file.
- Q8: Without knowing the project's size, I made a moderate guess.
- Q9: The "tests/" directory is often large in projects with extensive testing.
- Q10: Given the mention of "django," which is a web framework, I guessed that the project is a framework.
- Q11: Django is used for building web applications, so I made a related guess.
- Q12: Without knowing the actual file counts, I made a moderate guess that the core package is larger than the test package.
```
