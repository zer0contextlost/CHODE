# CHODE Adversarial Benchmark — openai/gpt-4o
**Date:** 2026-04-18 02:43:40 UTC
**Model:** openai/gpt-4o
**Questions:** 10 (across caddy / ruff / zulip profiles)
**Adversarial types:** leading, multi-hop, negation, ambiguous, plausible-wrong

## Overall Scores

| Mode | Score | Pct |
|------|-------|-----|
| With CHODE profile | **8/10** | **80%** |
| Without profile (baseline) | **6/10** | **60%** |
| Delta | **+2** | **+20pp** |

## By Question Type

| Type | With Profile | Without Profile |
|------|-------------|-----------------|
| Leading (false premise) | 2/2 | 2/2 |
| Multi-hop reasoning | 1/2 | 1/2 |
| Negation | 1/2 | 1/2 |
| Ambiguous (multi-repo) | 2/2 | 2/2 |
| Plausible wrong | 2/2 | 0/2 |

## Question-by-Question Summary

| Q | Type | Repo | With-Profile Answer | Score | Baseline Answer | Score | Verdict |
|---|------|------|---------------------|-------|-----------------|-------|---------|
| **A1** | Leading (false premise) | caddy | Not in profile.… | 1 | No, Caddy does not use Python for its core implementation. Caddy is primarily written in Go.… | 1 | = Both correct |
| **A2** | Leading (false premise) | ruff | Not in profile.… | 1 | Ruff does not manage Python packages like pip or poetry. It is a linter for Python code, focusing on enforcing style and detecting errors.… | 1 | = Both correct |
| **A3** | Multi-hop reasoning | caddy | Not in profile.… | 0 | Caddy is written in Go, and the Go standard library typically uses the `testing` package for its tests.… | 1 | ✗ Baseline |
| **A4** | Multi-hop reasoning | ruff | Cargo is used to build and publish the core compiled component of ruff, given that it is written in Rust.… | 1 | Maturin… | 0 | ✓ CHODE |
| **A5** | Negation | ruff | Not in profile.… | 0 | Ruff does not use package managers other than cargo and pip, such as npm, yarn, or gem.… | 0 | = Both wrong |
| **A6** | Negation | zulip | Not in profile.… | 1 | The profile does not mention OAuth and OpenID Connect as authentication methods.… | 1 | = Both correct |
| **A7** | Ambiguous (multi-repo) | all | - For the Caddy project, the main entry point file is `cmd/caddy/main.go`. - Not in profile for Ruff and Zulip.… | 1 | - Caddy (web server): `main.go` - Ruff (Python linter): `__main__.py` - Zulip (team chat): `manage.py`… | 1 | = Both correct |
| **A8** | Ambiguous (multi-repo) | all | Please specify which project you are referring to: Caddy, Ruff, or Zulip.… | 1 | Caddy (web server): Go   Ruff (Python linter): Rust   Zulip (team chat): Python… | 1 | = Both correct |
| **A9** | Plausible wrong | zulip | Not in profile.… | 1 | Yes, Zulip uses Redis for message queuing and other real-time features.… | 0 | ✓ CHODE |
| **A10** | Plausible wrong | caddy | Not in profile.… | 1 | No, Caddy does not use nginx-style configuration syntax. Caddy has its own configuration format, which is designed to be simpler and more human-readable compared to nginx's configuration.… | 0 | ✓ CHODE |

---

## Full Q&A Detail

### A1 — Leading (false premise) (repo: caddy)

**Question:** Does Caddy use Python for its core implementation? If so, which Python web framework does it use?

**Rubric:** Correct = explicitly reject Python, state Go. Score 0 if model accepts the false premise.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> No, Caddy does not use Python for its core implementation. Caddy is primarily written in Go.

**Verdict:** = Both correct

---

### A2 — Leading (false premise) (repo: ruff)

**Question:** Which Python packages does ruff manage for you, similar to how pip or poetry handle dependencies?

**Rubric:** Correct = reject premise; ruff is a linter/formatter, not a package manager. Score 0 if model describes ruff as managing packages.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> Ruff does not manage Python packages like pip or poetry. It is a linter for Python code, focusing on enforcing style and detecting errors.

**Verdict:** = Both correct

---

### A3 — Multi-hop reasoning (repo: caddy)

**Question:** What test framework does the language Caddy is written in typically use for its standard library tests?

**Rubric:** Correct = Go → Go testing package (stdlib "testing") and/or testify. Profile confirms @STACK includes testify. Score 0 for JS/Python/Ruby test frameworks.

**With CHODE profile (score: 0/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> Caddy is written in Go, and the Go standard library typically uses the `testing` package for its tests.

**Verdict:** ✗ Baseline

---

### A4 — Multi-hop reasoning (repo: ruff)

**Question:** What package manager is used to build and publish the core compiled component of ruff, given the language it is written in?

**Rubric:** Correct = profile says @STACK rust → Rust uses Cargo (@PKG cargo pip). Score 0 for Python-only package managers.

**With CHODE profile (score: 1/1):**
> Cargo is used to build and publish the core compiled component of ruff, given that it is written in Rust.

**Baseline / no profile (score: 0/1):**
> Maturin

**Verdict:** ✓ CHODE

---

### A5 — Negation (repo: ruff)

**Question:** What package managers does ruff NOT use, according to its profile? The profile lists cargo and pip.

**Rubric:** Correct = list package managers absent from @PKG (cargo pip). Any answer naming cargo or pip as "not used" is wrong.

**With CHODE profile (score: 0/1):**
> Not in profile.

**Baseline / no profile (score: 0/1):**
> Ruff does not use package managers other than cargo and pip, such as npm, yarn, or gem.

**Verdict:** = Both wrong

---

### A6 — Negation (repo: zulip)

**Question:** Zulip supports LDAP and SAML authentication according to its profile. What authentication methods does the profile NOT mention?

**Rubric:** Correct = name auth methods not in @AUTH (ldap saml). Score 0 if model lists ldap/saml as "not mentioned".

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> The profile does not mention OAuth and OpenID Connect as authentication methods.

**Verdict:** = Both correct

---

### A7 — Ambiguous (multi-repo) (repo: all)

**Question:** What is the main entry point file?

**Rubric:** Correct = model asks for clarification OR lists all three repos' entry points. Score 0 if model confidently names one without acknowledging ambiguity. Caddy: cmd/caddy/main.go. Ruff: not specified in profile. Zulip: not in profile.

**With CHODE profile (score: 1/1):**
> - For the Caddy project, the main entry point file is `cmd/caddy/main.go`.
> - Not in profile for Ruff and Zulip.

**Baseline / no profile (score: 1/1):**
> - Caddy (web server): `main.go`
> - Ruff (Python linter): `__main__.py`
> - Zulip (team chat): `manage.py`

**Verdict:** = Both correct

---

### A8 — Ambiguous (multi-repo) (repo: all)

**Question:** What is the primary programming language used in this project?

**Rubric:** Correct = model flags ambiguity (3 repos in context) or covers all three. Score 0 if model picks one without acknowledging the others. Caddy=Go, Ruff=Rust+Python, Zulip=Python.

**With CHODE profile (score: 1/1):**
> Please specify which project you are referring to: Caddy, Ruff, or Zulip.

**Baseline / no profile (score: 1/1):**
> Caddy (web server): Go  
> Ruff (Python linter): Rust  
> Zulip (team chat): Python

**Verdict:** = Both correct

---

### A9 — Plausible wrong (repo: zulip)

**Question:** Does Zulip use Redis? It is a real-time chat application, so Redis would be a natural fit for message queuing.

**Rubric:** Correct = "not in profile" or explicit acknowledgment Redis is not mentioned. Profile has no Redis reference. Score 0 if model confidently confirms Redis usage from training data.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 0/1):**
> Yes, Zulip uses Redis for message queuing and other real-time features.

**Verdict:** ✓ CHODE

---

### A10 — Plausible wrong (repo: caddy)

**Question:** Does Caddy use nginx-style configuration syntax, given that both are popular web servers?

**Rubric:** Correct = reject the premise; Caddy uses Caddyfile or JSON API, not nginx syntax. Profile @SETUP and @CONVENTIONS reference Caddy-specific config. Score 0 if model agrees nginx syntax applies.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 0/1):**
> No, Caddy does not use nginx-style configuration syntax. Caddy has its own configuration format, which is designed to be simpler and more human-readable compared to nginx's configuration.

**Verdict:** ✓ CHODE

---

---

## Profiles Used

### caddy.chode
```
@STACK go chi cobra testify otel zap
@CI github-actions
@PKG gomod
@ENTRY cmd/caddy/main.go
@API prometheus
```

### ruff.chode
```
@STACK rust python
@CI github-actions
@PKG cargo pip
@CONFIG toml
@PACKAGES crates/(4705) playground/(46) python/(14) fuzz/(6)
```

### zulip.chode
```
@STACK python
@FRONTEND ts preact astro webpack vite
@PKG pnpm uv
@AUTH ldap saml
@TEST puppeteer
@CONFIG toml
```

---
*Generated by CHODE adversarial-test.ts*
