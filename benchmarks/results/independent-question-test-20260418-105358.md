# CHODE Independent Question Authorship Test — 2026-04-18

> §16.4 item 9 response: questions authored by AI models that never saw the CHODE profile.
> Author model ≠ evaluator model. Round-robin assignment across 3 repos.

---

## Assignment

| Repo | Author Model | Evaluator Model |
|---|---|---|
| zulip | openai/gpt-4o | google/gemini-2.5-flash |
| ruff | google/gemini-2.5-flash | mistralai/mistral-large-2512 |
| caddy | mistralai/mistral-large-2512 | openai/gpt-4o |

---

## Summary

| Repo | Baseline | CHODE | Δ |
|---|---|---|---|
| zulip | 67% | 0% | -67pp |
| ruff | 58% | 0% | -58pp |
| caddy | 50% | 0% | -50pp |
| **Overall** | **58%** | **0%** | **-58pp** |

---

## zulip

**Author:** openai/gpt-4o  
**Evaluator:** google/gemini-2.5-flash

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the badge URL for checking Zulip's GitHub Actions build status? | github, actions | https://github.com/zulip/zulip/actions/workflows/zulip-ci.yml/badge.svg |
| Q2 | Which static type checker is used in the Zulip project, as indicated by the README? | mypy | Mypy |
| Q3 | If you want to self-host Zulip using a cloud service, which two providers are mentioned in the README? | digital, render | Digital Ocean and Render |
| Q4 | Under which license is Zulip distributed? | apache | Apache 2.0 |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | github | https://github.com/zulip/zulip/workflows/Zulip%20CI/badge.sv… | 1/3 | Not in profile. | 0/3 |
| Q2 | mypy | MyPy | 3/3 | Not in profile. | 0/3 |
| Q3 | digital | DigitalOcean and Amazon Web Services (AWS) | 1/3 | Not in profile. | 0/3 |
| Q4 | apache | Apache License, Version 2.0 | 3/3 | Not in profile. | 0/3 |

**Baseline: 67% | CHODE: 0% | Δ: -67pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:
What is the badge URL for checking Zulip's GitHub Actions build status?
ANSWER: https://github.com/zulip/zulip/actions/workflows/zulip-ci.yml/badge.svg
MUST: github, actions
GOOD: badge

Q2:
Which static type checker is used in the Zulip project, as indicated by the README?
ANSWER: Mypy
MUST: mypy
GOOD:

Q3:
If you want to self-host Zulip using a cloud service, which two providers are mentioned in the README?
ANSWER: Digital Ocean and Render
MUST: digital, render
GOOD: ocean

Q4:
Under which license is Zulip distributed?
ANSWER: Apache 2.0
MUST: apache
GOOD: license
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
https://github.com/zulip/zulip/workflows/Zulip%20CI/badge.svg

Q2:
MyPy

Q3:
DigitalOcean and Amazon Web Services (AWS)

Q4:
Apache License, Version 2.0
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1
Not in profile.
Q2
Not in profile.
Q3
Not in profile.
Q4
Not in profile.
```

</details>

---

## ruff

**Author:** google/gemini-2.5-flash  
**Evaluator:** mistralai/mistral-large-2512

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the specific command to install a particular version of Ruff using the standalone installer script on macOS or Linux? | curl, install.sh | curl -LsSf https://astral.sh/ruff/0.15.11/install.sh | sh |
| Q2 | Which specific configuration file type is used for Ruff's default configuration if left unspecified? | ruff.toml | ruff.toml |
| Q3 | What is the exact name of the pre-commit hook ID used to run the Ruff formatter? | ruff-format, id | ruff-format |
| Q4 | Which specific GitHub Action is recommended for integrating Ruff into a CI workflow? | ruff-action | astral-sh/ruff-action@v3 |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | curl | `curl -LsSf https://astral.sh/ruff/install.sh \| sh -s -- --v… | 3/3 | Not in profile. | 0/3 |
| Q2 | ruff.toml | `pyproject.toml` | 0/3 | Not in profile. | 0/3 |
| Q3 | ruff-format | `ruff-format` | 1/3 | Not in profile. | 0/3 |
| Q4 | ruff-action | `ruff-action` (or more specifically, the action available at… | 3/3 | Not in profile. | 0/3 |

**Baseline: 58% | CHODE: 0% | Δ: -58pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:
What is the specific command to install a particular version of Ruff using the standalone installer script on macOS or Linux?
ANSWER: curl -LsSf https://astral.sh/ruff/0.15.11/install.sh | sh
MUST: curl, install.sh
GOOD: 0.15.11, sh

Q2:
Which specific configuration file type is used for Ruff's default configuration if left unspecified?
ANSWER: ruff.toml
MUST: ruff.toml
GOOD:

Q3:
What is the exact name of the pre-commit hook ID used to run the Ruff formatter?
ANSWER: ruff-format
MUST: ruff-format, id
GOOD: pre-commit

Q4:
Which specific GitHub Action is recommended for integrating Ruff into a CI workflow?
ANSWER: astral-sh/ruff-action@v3
MUST: ruff-action
GOOD: github, actions
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
`curl -LsSf https://astral.sh/ruff/install.sh | sh -s -- --version <VERSION>`
(Replace `<VERSION>` with the desired version, e.g., `0.4.4`.)

Q2:
`pyproject.toml`

Q3:
`ruff-format`

Q4:
`ruff-action` (or more specifically, the action available at `https://github.com/astral-sh/ruff-action`)
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1
Not in profile.

Q2
Not in profile.

Q3
Not in profile.

Q4
Not in profile.
```

</details>

---

## caddy

**Author:** mistralai/mistral-large-2512  
**Evaluator:** openai/gpt-4o

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the name of the library that powers Caddy's automatic HTTPS functionality? | certmagic | CertMagic |
| Q2 | What is the minimum required Go version to build Caddy from source? | 1.25.0 | 1.25.0 |
| Q3 | What command-line tool is used to build Caddy with version information and/or plugins? | xcaddy, build | xcaddy |
| Q4 | What script is used to run Caddy temporarily with `go run` while still allowing it to bind to low ports? | setcap.sh | setcap.sh |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | certmagic | The library that powers Caddy's automatic HTTPS functionalit… | 3/3 | Not in profile. | 0/3 |
| Q2 | 1.25.0 | The minimum required Go version to build Caddy from source i… | 0/3 | Not in profile. | 0/3 |
| Q3 | xcaddy | The command-line tool used to build Caddy with version infor… | 3/3 | Not in profile. | 0/3 |
| Q4 | setcap.sh | The script used to run Caddy temporarily with `go run` while… | 0/3 | Not in profile. | 0/3 |

**Baseline: 50% | CHODE: 0% | Δ: -50pp**

<details>
<summary>Question generation — raw response</summary>

```
Here are four stump questions based on the Caddy repository's README:

---

Q1:
What is the name of the library that powers Caddy's automatic HTTPS functionality?
ANSWER: CertMagic
MUST: certmagic
GOOD: tls, automatic https

---

Q2:
What is the minimum required Go version to build Caddy from source?
ANSWER: 1.25.0
MUST: 1.25.0
GOOD:

---

Q3:
What command-line tool is used to build Caddy with version information and/or plugins?
ANSWER: xcaddy
MUST: xcaddy, build
GOOD: plugins

---

Q4:
What script is used to run Caddy temporarily with `go run` while still allowing it to bind to low ports?
ANSWER: setcap.sh
MUST: setcap.sh
GOOD: go run
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:  
The library that powers Caddy's automatic HTTPS functionality is called "CertMagic."

Q2:  
The minimum required Go version to build Caddy from source is typically the latest stable version or one of the recent versions, often around Go 1.16 or later. However, you should check the specific repository documentation for the most accurate requirement.

Q3:  
The command-line tool used to build Caddy with version information and/or plugins is `xcaddy`.

Q4:  
The script used to run Caddy temporarily with `go run` while still allowing it to bind to low ports is typically a shell script that uses `sudo` to elevate privileges, often named something like `run.sh` or a similar custom script. However, the exact name can vary, so checking the repository for such a script would be necessary.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1: Not in profile.

Q2: Not in profile.

Q3: Not in profile.

Q4: Not in profile.
```

</details>

---

## Finding

Questions were authored by AI models with no access to the CHODE profile — only the repository README. Across 3 repos with independently authored questions, CHODE scored **0%** vs baseline **58%** (Δ **-58pp**). The gap did not replicate on independently authored questions. This warrants further investigation into authorship bias in the primary benchmark.

Full result file: `benchmarks/results/independent-question-test-20260418-105358.md`
