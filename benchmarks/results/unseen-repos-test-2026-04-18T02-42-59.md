# CHODE Unseen Repos Benchmark

**Date:** 2026-04-18  
**Repos:** ruff, zulip, appwrite, pocketbase, caddy *(none were in the original 9-repo training set)*  
**Models:** gpt-4o (`openai/gpt-4o`), gemini-flash (`google/gemini-2.5-flash`)  
**Modes:** baseline (no profile, no repo name) vs CHODE (profile injected)  
**Scoring:** 0–3 per question (0=miss, 1=partial, 2=all must terms, 3=must+good terms)  

## Score Summary

| Repo | Model | Baseline | CHODE | Δ |
|---|---|---|---|---|
| ruff | gpt-4o | 0/12 (0%) | 12/12 (100%) | +12 |
| ruff | gemini-flash | 8/12 (67%) | 12/12 (100%) | +4 |
| zulip | gpt-4o | 0/12 (0%) | 12/12 (100%) | +12 |
| zulip | gemini-flash | 1/12 (8%) | 12/12 (100%) | +11 |
| appwrite | gpt-4o | 2/12 (17%) | 12/12 (100%) | +10 |
| appwrite | gemini-flash | 2/12 (17%) | 12/12 (100%) | +10 |
| pocketbase | gpt-4o | 0/12 (0%) | 12/12 (100%) | +12 |
| pocketbase | gemini-flash | 0/12 (0%) | 9/12 (75%) | +9 |
| caddy | gpt-4o | 0/12 (0%) | 9/12 (75%) | +9 |
| caddy | gemini-flash | 0/12 (0%) | 9/12 (75%) | +9 |

## Aggregate by Repo (both models combined)

| Repo | Baseline% | CHODE% | Δ% |
|---|---|---|---|
| ruff | 33% | 100% | +67% |
| zulip | 4% | 100% | +96% |
| appwrite | 17% | 100% | +83% |
| pocketbase | 0% | 88% | +88% |
| caddy | 0% | 75% | +75% |

**Overall — Baseline: 11% | CHODE: 93% | Δ: +82%**

## Per-Question Breakdown

### ruff

| Q | Question (truncated) | Must terms | gpt-4o base | gpt-4o chode | gemini-flash base | gemini-flash chode |
|---|---|---|--- | --- | --- | ---|
| Q1 | What two programming languages is this project prima… | `rust, python` | 0 | 3 | 1 | 3 |
| Q2 | What configuration file format does this project use? | `toml` | 0 | 3 | 3 | 3 |
| Q3 | How much faster is this linter claimed to be compare… | `10, 100` | 0 ★ | 3 | 1 ★ | 3 |
| Q4 | If you see stack overflows in the playground, what b… | `release` | 0 ★ | 3 | 3 ★ | 3 |

★ = stump question (likely wrong without profile)

<details><summary>CHODE profile (306 tok)</summary>

```
---CHODE v2 @ 742aa29---

---DNA---
@STACK rust python
@CI github-actions
@PKG cargo pip
@CONFIG toml
@PACKAGES crates/(4705) playground/(46) python/(14) fuzz/(6)
@STRUCT crates/(9.4k) scripts/(87) playground/(77) python/(19) changelogs/(14) fuzz/(10)

---CONTEXT---
@PURPOSE Docs | Playground extremely fast Python linter and code formatter, written in Rust. Linting CPython codebase from scratch. ⚡️ 10-100x faster than existing linters (like…
@CONVENTIONS All changes must be tested. If you're not testing your changes, you're not done. Look to see if your tests could go in existing file before adding new file for your tests. Get your tests to pass. If…
@SETUP Install NPM dependencies with `npm ci --ignore-scripts`, and run development server with `npm start --workspace ruff-playground` or `npm start --workspace ty-playground`. You may need to restart…
@ENV Ruff Formatter exposes small set of configuration options, some of which are also supported by Black (like line width), some of which are unique to Ruff (like quote, indentation style and formatting…
@GOTCHAS ### Stack overflows If you see stack overflows in playground, build WASM module in release mode: `npm run --workspace ty-playground build:wasm`.

```

</details>

### zulip

| Q | Question (truncated) | Must terms | gpt-4o base | gpt-4o chode | gemini-flash base | gemini-flash chode |
|---|---|---|--- | --- | --- | ---|
| Q1 | What two authentication protocols does this project … | `ldap, saml` | 0 ★ | 3 | 1 ★ | 3 |
| Q2 | What frontend JavaScript framework/library is used i… | `preact` | 0 ★ | 3 | 0 ★ | 3 |
| Q3 | What is the approximate test coverage percentage the… | `98` | 0 ★ | 3 | 0 ★ | 3 |
| Q4 | What two package managers does this project use (one… | `pnpm, uv` | 0 ★ | 3 | 0 ★ | 3 |

★ = stump question (likely wrong without profile)

<details><summary>CHODE profile (360 tok)</summary>

```
---CHODE v2 @ d6df533---

---DNA---
@STACK python
@FRONTEND ts preact astro webpack vite (web/src/)
@CI github-actions
@PKG pnpm uv
@TEST puppeteer
@CONFIG toml
@ROUTES zilencer/urls.py
@DATA zilencer/models.py
@AUTH ldap saml
@PACKAGES zerver/(1655) web/(459) zilencer/(98) corporate/(92) analytics/(43)
@STRUCT zerver/(3.0k) corporate/(1.9k) web/(1.5k) starlight_help/(504)…
@MIDDLEWARE zerver/

---CONTEXT---
@PURPOSE Zulip is open-source organized team chat app with unique topic-based threading that combines best of email and chat to make remote work productive and delightful. Fortune 500 companies, leading open…
@CONVENTIONS Zulip is team chat application used by thousands of organizations, built to last for many years. It is developed by vibrant open-source community, with maintainers who have consistently emphasized…
@SETUP Contributing code. Check out our guide for new contributors to get started. We have invested in making Zulip’s code highly readable, thoughtfully tested, and easy to modify. Beyond that, we have…
@TESTING Zulip server takes pride in its ~98% test coverage. All server changes must include nice tests that follow our testing philosophy. ### Before Submitting: ```bash ./tools/test-js-with-node #…
@GOTCHAS ### Treating Known Issues as Acceptable common failure mode is discovering problem during verification and then noting it as known limitation than fixing it. At Zulip, there is no category of…

```

</details>

### appwrite

| Q | Question (truncated) | Must terms | gpt-4o base | gpt-4o chode | gemini-flash base | gemini-flash chode |
|---|---|---|--- | --- | --- | ---|
| Q1 | What code style standard is enforced for formatting … | `psr-12` *(+pint)* | 0 ★ | 3 | 0 ★ | 3 |
| Q2 | What convention must `resourceType` values follow in… | `plural` | 0 ★ | 3 | 0 ★ | 3 |
| Q3 | What command do you run to execute the full test suite? | `docker, appwrite, test` | 1 ★ | 3 | 1 ★ | 3 |
| Q4 | What two authentication methods does this project su… | `2fa, oauth` | 1 | 3 | 1 | 3 |

★ = stump question (likely wrong without profile)

<details><summary>CHODE profile (394 tok)</summary>

```
---CHODE v2---

---DNA---
@STACK php queue phpunit
@FRONTEND ts astro
@CI github-actions
@PKG npm composer
@CONFIG ini
@ROUTES app/controllers/ (13 files)
@AUTH 2fa oauth
@PACKAGES src/(952) app/(89)
@STRUCT src/{Appwrite,Utopia,Executor}(953) app/{config,views,controllers,init,assets}(568)
@PATTERNS plugin

---CONTEXT---
@PURPOSE Appwrite Appwrite is open-source, all-in-one development platform. Use built-in backend infrastructure and web hosting, all from single place. English | 简体中文 Appwrite is open-source development platform for building web, mobile, and AI applications. It brings together backend infrastructure and web hosting in one place, so teams can…
@CONVENTIONS PSR-12 formatting enforced by Pint. PSR-4 autoloading. `resourceType` values are always plural: `'functions'`, `'sites'`, `'deployments'`. When updating documents, pass only changed attributes as sparse Document: ```php // correct $dbForProject->updateDocument('users', $user->getId(), new Document([ 'name' => $name, ])); //…
@SETUP easiest way to get started with Appwrite is by signing up for Appwrite Cloud. While Appwrite Cloud is in public beta, you can build with Appwrite completely free, and we won't collect your credit card information.
@TESTING To run all tests manually, use Appwrite Docker CLI from your terminal: ```bash docker compose exec appwrite test ``` To run unit tests use: ```bash docker compose exec appwrite test /usr/src/code/tests/unit ``` To run end-2-end tests use: ```bash docker compose exec appwrite test /usr/src/code/tests/e2e ``` To run end-2-end tests for…

```

</details>

### pocketbase

| Q | Question (truncated) | Must terms | gpt-4o base | gpt-4o chode | gemini-flash base | gemini-flash chode |
|---|---|---|--- | --- | --- | ---|
| Q1 | What two authentication/security libraries does this… | `jwt, oauth2` | 0 ★ | 3 | 0 ★ | 0 |
| Q2 | How many database migrations are included in this pr… | `7` | 0 ★ | 3 | 0 ★ | 3 |
| Q3 | What command do you run to start the server after do… | `pocketbase, serve` | 0 ★ | 3 | 0 ★ | 3 |
| Q4 | What make targets are used to run tests? | `make test` *(+test-report)* | 0 ★ | 3 | 0 ★ | 3 |

★ = stump question (likely wrong without profile)

<details><summary>CHODE profile (186 tok)</summary>

```
---CHODE v2 @ 58f605e---

---DNA---
@STACK go jwt cobra oauth2
@CI github-actions
@PKG gomod
@TEST make test make test-report
@ENTRY ui/src/main.js
@DATA migrations/ (7 migrations)
@AUTH oauth
@PACKAGES core/(132) apis/(73) ui/(48) plugins/(19) forms/(8)
@STRUCT ui/(314) tools/(185) core/(132) apis/(73) plugins/(19) forms/(8) migrations/(7) mails/(5) cmd/(3)
@PATTERNS plugin

---CONTEXT---
@PURPOSE ### Use as standalone app You could download prebuilt executable for your platform from Releases page. Once downloaded, extract archive and run `./pocketbase serve` in extracted directory. prebuilt executables are based on `examples/base/main.go` file and comes with JS VM plugin enabled by default which allows to extend PocketBase with…

```

</details>

### caddy

| Q | Question (truncated) | Must terms | gpt-4o base | gpt-4o chode | gemini-flash base | gemini-flash chode |
|---|---|---|--- | --- | --- | ---|
| Q1 | What observability/metrics API does this project exp… | `prometheus` | 0 ★ | 3 | 0 ★ | 3 |
| Q2 | What is the entry point file for this project? | `cmd/caddy/main.go` | 0 ★ | 3 | 0 ★ | 3 |
| Q3 | Name three internal Go packages (libraries) this pro… | `chi, cobra, zap` *(+testify, otel)* | 0 ★ | 0 | 0 ★ | 0 |
| Q4 | What Go package manager / module system does this pr… | `gomod` | 0 | 3 | 0 | 3 |

★ = stump question (likely wrong without profile)

<details><summary>CHODE profile (236 tok)</summary>

```
---CHODE v2 @ 4430756---

---DNA---
@STACK go chi cobra testify otel zap
@CI github-actions
@PKG gomod
@ENTRY cmd/caddy/main.go
@API prometheus
@PACKAGES modules/(199) caddyconfig/(33) caddytest/(20) cmd/(13) internal/(10)
@STRUCT caddytest/(258) modules/{caddyhttp,caddytls,caddypki,logging,metrics,caddyevents}(207) caddyconfig/(51) cmd/(14)…

---CONTEXT---
@PURPOSE Caddy is most often used as HTTPS server, but it is suitable for any long-running Go program. First and foremost, it is platform to run Go applications. Caddy "apps" are Go programs that are…
@CONVENTIONS ### Go Idioms Follow Go Code Review Comments: Error flow: Early return, indent error handling—not else blocks ```go if err != nil { return err } // normal code ``` Naming:…
@SETUP simplest, cross-platform way to get started is to download Caddy from GitHub Releases and place executable file in your PATH. See our online documentation for other install instructions.

```

</details>

