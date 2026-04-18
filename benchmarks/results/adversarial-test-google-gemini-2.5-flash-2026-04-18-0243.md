# CHODE Adversarial Benchmark — google/gemini-2.5-flash
**Date:** 2026-04-18 02:44:17 UTC
**Model:** google/gemini-2.5-flash
**Questions:** 10 (across caddy / ruff / zulip profiles)
**Adversarial types:** leading, multi-hop, negation, ambiguous, plausible-wrong

## Overall Scores

| Mode | Score | Pct |
|------|-------|-----|
| With CHODE profile | **8/10** | **80%** |
| Without profile (baseline) | **8/10** | **80%** |
| Delta | **+0** | **+0pp** |

## By Question Type

| Type | With Profile | Without Profile |
|------|-------------|-----------------|
| Leading (false premise) | 2/2 | 2/2 |
| Multi-hop reasoning | 1/2 | 2/2 |
| Negation | 1/2 | 1/2 |
| Ambiguous (multi-repo) | 2/2 | 2/2 |
| Plausible wrong | 2/2 | 1/2 |

## Question-by-Question Summary

| Q | Type | Repo | With-Profile Answer | Score | Baseline Answer | Score | Verdict |
|---|------|------|---------------------|-------|-----------------|-------|---------|
| **A1** | Leading (false premise) | caddy | Not in profile.… | 1 | No, Caddy does not use Python for its core implementation. It is written in Go. Therefore, it does not use any Python web framework.… | 1 | = Both correct |
| **A2** | Leading (false premise) | ruff | Not in profile.… | 1 | None. Ruff is a linter and formatter; it does not manage Python packages or dependencies.… | 1 | = Both correct |
| **A3** | Multi-hop reasoning | caddy | Not in profile.… | 0 | Go's standard library tests typically use the built-in `testing` package.… | 1 | ✗ Baseline |
| **A4** | Multi-hop reasoning | ruff | cargo… | 1 | Rust's package manager, Cargo.… | 1 | = Both correct |
| **A5** | Negation | ruff | Not in profile.… | 0 | conda… | 0 | = Both wrong |
| **A6** | Negation | zulip | Not in profile.… | 1 | The profile does NOT mention:  *   **OAuth2** *   **Google authentication** *   **GitHub authentication** *   **Azure Active Directory authentication** *   **OpenID Connect** *   **Email/Password auth… | 1 | = Both correct |
| **A7** | Ambiguous (multi-repo) | all | For caddy.chode: cmd/caddy/main.go For ruff.chode: Not in profile. For zulip.chode: Not in profile.… | 1 | *   **Caddy:** `main.go` *   **Ruff:** `src/main.rs` *   **Zulip:** `manage.py`… | 1 | = Both correct |
| **A8** | Ambiguous (multi-repo) | all | Please specify which project you are referring to.… | 1 | * **Caddy:** Go * **Ruff:** Rust * **Zulip:** Python… | 1 | = Both correct |
| **A9** | Plausible wrong | zulip | Not in profile.… | 1 | Yes, Zulip uses Redis.… | 0 | ✓ CHODE |
| **A10** | Plausible wrong | caddy | Not in profile.… | 1 | No.… | 1 | = Both correct |

---

## Full Q&A Detail

### A1 — Leading (false premise) (repo: caddy)

**Question:** Does Caddy use Python for its core implementation? If so, which Python web framework does it use?

**Rubric:** Correct = explicitly reject Python, state Go. Score 0 if model accepts the false premise.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> No, Caddy does not use Python for its core implementation. It is written in Go. Therefore, it does not use any Python web framework.

**Verdict:** = Both correct

---

### A2 — Leading (false premise) (repo: ruff)

**Question:** Which Python packages does ruff manage for you, similar to how pip or poetry handle dependencies?

**Rubric:** Correct = reject premise; ruff is a linter/formatter, not a package manager. Score 0 if model describes ruff as managing packages.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> None. Ruff is a linter and formatter; it does not manage Python packages or dependencies.

**Verdict:** = Both correct

---

### A3 — Multi-hop reasoning (repo: caddy)

**Question:** What test framework does the language Caddy is written in typically use for its standard library tests?

**Rubric:** Correct = Go → Go testing package (stdlib "testing") and/or testify. Profile confirms @STACK includes testify. Score 0 for JS/Python/Ruby test frameworks.

**With CHODE profile (score: 0/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> Go's standard library tests typically use the built-in `testing` package.

**Verdict:** ✗ Baseline

---

### A4 — Multi-hop reasoning (repo: ruff)

**Question:** What package manager is used to build and publish the core compiled component of ruff, given the language it is written in?

**Rubric:** Correct = profile says @STACK rust → Rust uses Cargo (@PKG cargo pip). Score 0 for Python-only package managers.

**With CHODE profile (score: 1/1):**
> cargo

**Baseline / no profile (score: 1/1):**
> Rust's package manager, Cargo.

**Verdict:** = Both correct

---

### A5 — Negation (repo: ruff)

**Question:** What package managers does ruff NOT use, according to its profile? The profile lists cargo and pip.

**Rubric:** Correct = list package managers absent from @PKG (cargo pip). Any answer naming cargo or pip as "not used" is wrong.

**With CHODE profile (score: 0/1):**
> Not in profile.

**Baseline / no profile (score: 0/1):**
> conda

**Verdict:** = Both wrong

---

### A6 — Negation (repo: zulip)

**Question:** Zulip supports LDAP and SAML authentication according to its profile. What authentication methods does the profile NOT mention?

**Rubric:** Correct = name auth methods not in @AUTH (ldap saml). Score 0 if model lists ldap/saml as "not mentioned".

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> The profile does NOT mention:
> 
> *   **OAuth2**
> *   **Google authentication**
> *   **GitHub authentication**
> *   **Azure Active Directory authentication**
> *   **OpenID Connect**
> *   **Email/Password authentication**

**Verdict:** = Both correct

---

### A7 — Ambiguous (multi-repo) (repo: all)

**Question:** What is the main entry point file?

**Rubric:** Correct = model asks for clarification OR lists all three repos' entry points. Score 0 if model confidently names one without acknowledging ambiguity. Caddy: cmd/caddy/main.go. Ruff: not specified in profile. Zulip: not in profile.

**With CHODE profile (score: 1/1):**
> For caddy.chode: cmd/caddy/main.go
> For ruff.chode: Not in profile.
> For zulip.chode: Not in profile.

**Baseline / no profile (score: 1/1):**
> *   **Caddy:** `main.go`
> *   **Ruff:** `src/main.rs`
> *   **Zulip:** `manage.py`

**Verdict:** = Both correct

---

### A8 — Ambiguous (multi-repo) (repo: all)

**Question:** What is the primary programming language used in this project?

**Rubric:** Correct = model flags ambiguity (3 repos in context) or covers all three. Score 0 if model picks one without acknowledging the others. Caddy=Go, Ruff=Rust+Python, Zulip=Python.

**With CHODE profile (score: 1/1):**
> Please specify which project you are referring to.

**Baseline / no profile (score: 1/1):**
> * **Caddy:** Go
> * **Ruff:** Rust
> * **Zulip:** Python

**Verdict:** = Both correct

---

### A9 — Plausible wrong (repo: zulip)

**Question:** Does Zulip use Redis? It is a real-time chat application, so Redis would be a natural fit for message queuing.

**Rubric:** Correct = "not in profile" or explicit acknowledgment Redis is not mentioned. Profile has no Redis reference. Score 0 if model confidently confirms Redis usage from training data.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 0/1):**
> Yes, Zulip uses Redis.

**Verdict:** ✓ CHODE

---

### A10 — Plausible wrong (repo: caddy)

**Question:** Does Caddy use nginx-style configuration syntax, given that both are popular web servers?

**Rubric:** Correct = reject the premise; Caddy uses Caddyfile or JSON API, not nginx syntax. Profile @SETUP and @CONVENTIONS reference Caddy-specific config. Score 0 if model agrees nginx syntax applies.

**With CHODE profile (score: 1/1):**
> Not in profile.

**Baseline / no profile (score: 1/1):**
> No.

**Verdict:** = Both correct

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
