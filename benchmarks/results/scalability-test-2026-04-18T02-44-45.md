# CHODE Scalability Stress Test

**Date:** 2026-04-18  
**Models:** gpt-4o (`openai/gpt-4o`), gemini-flash (`google/gemini-2.5-flash`)  
**Tiers:** 3 (3 profiles, 5 profiles, 13 profiles)  
**Questions per tier:** 6 (3 per-repo + 3 reverse attribution)  
**Near-identical stress:** zulip vs fastapi (both Python web projects) in Tiers 2 and 3

## What This Tests

Attribution accuracy is measured across three tiers of profile count. As more profiles are packed into the context window, models must work harder to keep repo-specific facts correctly attributed. The near-identical stress scenario (zulip and fastapi both being Python web projects) is the hardest case: the model must use fine-grained semantic signals — "team chat with topic threading" vs "API framework using type hints and Starlette" — rather than just language labels.

## Scalability Summary

| Tier | Profiles | Token Count | gpt-4o Score | gemini-flash Score | gpt-4o Interference | gemini-flash Interference |
|---|---|---|---|---|---|---|
| Tier 1 (3 profiles) | 3 | ~933 | **5/5** | **5/5** | 0 | 0 |
| Tier 2 (5 profiles) | 5 | ~1603 | **6/6** | **6/6** | 0 | 0 |
| Tier 3 (all profiles) | 13 | ~4636 | **6/6** | **6/6** | 0 | 0 |

## Accuracy vs Profile Count

### gpt-4o

| Tier | Profiles | Score | Accuracy |
|---|---|---|---|
| Tier 1 (3 profiles) | 3 | 5/5 | 100% ██████████ |
| Tier 2 (5 profiles) | 5 | 6/6 | 100% ██████████ |
| Tier 3 (all profiles) | 13 | 6/6 | 100% ██████████ |

**Trend:** Accuracy unchanged by 0pp from Tier 1 → Tier 3

### gemini-flash

| Tier | Profiles | Score | Accuracy |
|---|---|---|---|
| Tier 1 (3 profiles) | 3 | 5/5 | 100% ██████████ |
| Tier 2 (5 profiles) | 5 | 6/6 | 100% ██████████ |
| Tier 3 (all profiles) | 13 | 6/6 | 100% ██████████ |

**Trend:** Accuracy unchanged by 0pp from Tier 1 → Tier 3

## Near-Identical Pair Analysis (zulip vs fastapi)

Both zulip and fastapi are Python web projects. A model that cannot distinguish them will confuse their purposes and fail near-identical questions.

**Tier 1 (3 profiles):** N/A (fastapi not in context)

**Tier 2 (5 profiles):**

| Q | Question | gpt-4o | gemini-flash |
|---|---|---|---|
| Q3 | zulip → team chat (NOT a web API framework like fastapi) | PASS | PASS |
| Q5 | API framework → fastapi (not zulip) | PASS | PASS |
| Q6 | starlette → fastapi (not zulip, which is Django-based) | PASS | PASS |

**Tier 3 (all profiles):**

| Q | Question | gpt-4o | gemini-flash |
|---|---|---|---|
| Q3 | zulip → team chat (NOT a web API framework like fastapi) | PASS | PASS |
| Q5 | API framework → fastapi (not zulip) | PASS | PASS |
| Q6 | starlette → fastapi (not zulip, which is Django-based) | PASS | PASS |

## Per-Tier Detailed Results

### Tier 1 (3 profiles)

**Profiles:** caddy, ruff, zulip  
**Description:** Baseline — 3 distinct-language repos (Go, Rust, Python)  
**Context size:** ~933 tokens  

#### Question Breakdown

| Q | What's Tested | Expected | gpt-4o | gemini-flash |
|---|---|---|---|---|
| Q1 | caddy → Go | `go` | ✓ | ✓ |
| Q2 | ruff → Rust | `rust` | ✓ | ✓ |
| Q3 | zulip → Python | `python` | ✓ | ✓ |
| Q4 | Go → caddy | `caddy` | ✓ | ✓ |
| Q5 | Rust → ruff | `ruff` | ✓ | ✓ |

#### Model Answers

##### gpt-4o

**Q1 ✓** — *caddy → Go*
> Go

**Q2 ✓** — *ruff → Rust*
> Rust

**Q3 ✓** — *zulip → Python*
> Python

**Q4 ✓** — *Go → caddy*
> Caddy

**Q5 ✓** — *Rust → ruff*
> Ruff

##### gemini-flash

**Q1 ✓** — *caddy → Go*
> go

**Q2 ✓** — *ruff → Rust*
> rust

**Q3 ✓** — *zulip → Python*
> python

**Q4 ✓** — *Go → caddy*
> CADDY

**Q5 ✓** — *Rust → ruff*
> RUFF

### Tier 2 (5 profiles)

**Profiles:** caddy, ruff, zulip, fastapi, mermaid  
**Description:** Medium load — includes near-identical Python web pair (zulip + fastapi)  
**Context size:** ~1603 tokens  

#### Question Breakdown

| Q | What's Tested | Expected | gpt-4o | gemini-flash |
|---|---|---|---|---|
| Q1 | caddy → Go | `go` | ✓ | ✓ |
| Q2 | ruff → Rust | `rust` | ✓ | ✓ |
| Q3 🔥 | zulip → team chat (NOT a web API framework like fastapi) | `chat` | ✓ | ✓ |
| Q4 | Go → caddy | `caddy` | ✓ | ✓ |
| Q5 🔥 | API framework → fastapi (not zulip) | `fastapi` | ✓ | ✓ |
| Q6 🔥 | starlette → fastapi (not zulip, which is Django-based) | `fastapi` | ✓ | ✓ |

#### Model Answers

##### gpt-4o

**Q1 ✓** — *caddy → Go*
> In the caddy repository, what is the primary programming language?
> Go

**Q2 ✓** — *ruff → Rust*
> In the ruff repository, what language is the tool itself written in?
> Rust

**Q3 🔥 ✓** — *zulip → team chat (NOT a web API framework like fastapi)*
> In the zulip repository, what is the primary use case — is it a web framework for building APIs or a team chat application?
> Team chat application

**Q4 ✓** — *Go → caddy*
> Which of the repositories in context (caddy, ruff, zulip, fastapi, mermaid) uses Go as its primary language? List all that apply.
> Caddy

**Q5 🔥 ✓** — *API framework → fastapi (not zulip)*
> Of the repositories in context (caddy, ruff, zulip, fastapi, mermaid), which one is a Python web framework for building REST APIs (not a chat application)?
> FastAPI

**Q6 🔥 ✓** — *starlette → fastapi (not zulip, which is Django-based)*
> Of zulip and fastapi, which one uses Starlette as a core dependency?
> FastAPI

##### gemini-flash

**Q1 ✓** — *caddy → Go*
> go

**Q2 ✓** — *ruff → Rust*
> Rust

**Q3 🔥 ✓** — *zulip → team chat (NOT a web API framework like fastapi)*
> team chat application

**Q4 ✓** — *Go → caddy*
> CADDY

**Q5 🔥 ✓** — *API framework → fastapi (not zulip)*
> FASTAPI

**Q6 🔥 ✓** — *starlette → fastapi (not zulip, which is Django-based)*
> FASTAPI

### Tier 3 (all profiles)

**Profiles:** caddy, ruff, zulip, appwrite, dagger, ladybird, mermaid, moondream, pocketbase, fastapi, gh-cli, gitea, ripgrep  
**Description:** Maximum stress — all available profiles in one context window  
**Context size:** ~4636 tokens  

#### Question Breakdown

| Q | What's Tested | Expected | gpt-4o | gemini-flash |
|---|---|---|---|---|
| Q1 | caddy → Go | `go` | ✓ | ✓ |
| Q2 | ruff → Rust | `rust` | ✓ | ✓ |
| Q3 🔥 | zulip → team chat (NOT a web API framework like fastapi) | `chat` | ✓ | ✓ |
| Q4 | Go → caddy + dagger + pocketbase + gh-cli + gitea | `caddy` | ✓ | ✓ |
| Q5 🔥 | API framework → fastapi (not zulip) | `fastapi` | ✓ | ✓ |
| Q6 🔥 | starlette → fastapi (not zulip, which is Django-based) | `fastapi` | ✓ | ✓ |

#### Model Answers

##### gpt-4o

**Q1 ✓** — *caddy → Go*
> go

**Q2 ✓** — *ruff → Rust*
> rust

**Q3 🔥 ✓** — *zulip → team chat (NOT a web API framework like fastapi)*
> team chat application

**Q4 ✓** — *Go → caddy + dagger + pocketbase + gh-cli + gitea*
> caddy, dagger, pocketbase, gh-cli, gitea

**Q5 🔥 ✓** — *API framework → fastapi (not zulip)*
> fastapi

**Q6 🔥 ✓** — *starlette → fastapi (not zulip, which is Django-based)*
> fastapi

##### gemini-flash

**Q1 ✓** — *caddy → Go*
> go

**Q2 ✓** — *ruff → Rust*
> Rust

**Q3 🔥 ✓** — *zulip → team chat (NOT a web API framework like fastapi)*
> a team chat application

**Q4 ✓** — *Go → caddy + dagger + pocketbase + gh-cli + gitea*
> CADDY, DAGGER, POCKETBASE, GH-CLI, GITEA

**Q5 🔥 ✓** — *API framework → fastapi (not zulip)*
> FASTAPI

**Q6 🔥 ✓** — *starlette → fastapi (not zulip, which is Django-based)*
> FASTAPI

## Combined Contexts (sent verbatim per tier)

<details>
<summary>Tier 1 (3 profiles) — context</summary>

```
--- REPOSITORY: CADDY ---
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
--- END CADDY ---

--- REPOSITORY: RUFF ---
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
--- END RUFF ---

--- REPOSITORY: ZULIP ---
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
--- END ZULIP ---
```

</details>

<details>
<summary>Tier 2 (5 profiles) — context</summary>

```
--- REPOSITORY: CADDY ---
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
--- END CADDY ---

--- REPOSITORY: RUFF ---
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
--- END RUFF ---

--- REPOSITORY: ZULIP ---
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
--- END ZULIP ---

--- REPOSITORY: FASTAPI ---
---CHODE v2---

---DNA---
@STACK python starlette pydantic
@CI github-actions
@PKG uv
@CONFIG toml
@ENTRY fastapi/applications.py
@ROUTES fastapi/routing.py
@PACKAGES docs_src/(455) fastapi/(48)
@STRUCT docs_src/(457) scripts/(70) fastapi/(53)
@PATTERNS event-driven middleware-chain

---CONTEXT---
@PURPOSE FastAPI framework, high performance, easy to learn, fast to code, ready for production --- Documentation: Source Code: --- FastAPI is modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints. key features are: Fast: high performance, on par with NodeJS…
@SETUP Create and activate virtual environment and then install FastAPI: ```console $ pip install "fastapi[standard]" ---> 100% ``` Note: Make sure you put `"fastapi[standard]"` in quotes to ensure it works in all terminals.
--- END FASTAPI ---

--- REPOSITORY: MERMAID ---
---CHODE v2---

---DNA---
@STACK ts express jest playwright vite vitest vue
@CI github-actions
@PKG pnpm
@TEST cypress jest playwright vitest
@CONFIG docker-compose yaml
@ENTRY packages/parser/src/index.ts
@PACKAGES packages/(623) cypress/(80)
@STRUCT packages/(823) cypress/(164) demos/(34) img/(11) scripts/(8)

---CONTEXT---
@PURPOSE --> Mermaid is JavaScript-based diagramming and charting tool that uses Markdown-inspired text definitions and renderer to create and modify complex diagrams. main purpose of Mermaid is to help documentation catch up with development. > Doc-Rot is Catch-22 that Mermaid helps to solve. Diagramming and documentation costs precious developer time…
@CONVENTIONS Community leaders will follow these Community Impact Guidelines in determining consequences for any action they deem in violation of this Code of Conduct: ### 1. Correction Community Impact: Use of inappropriate language or other behavior deemed unprofessional or unwelcome in community. Consequence: private, written warning from community…
@SETUP To utilize these utilities, import them from `utils.ts` file into your shape creation script. These helpers will streamline process of building and customizing SVG shapes, ensuring consistent results across your projects. ```typescript import { labelHelper, updateNodeBounds, insertPolygonShape, getNodeClasses, createPathFromPoints,…
@TESTING To ensure robustness of flowchart shapes, there are implementation of comprehensive Cypress test cases in `newShapes.spec.ts` file. These tests cover various aspects such as: Shapes: Testing new shapes like `bowTieRect`, `waveRectangle`, `trapezoidalPentagon`, etc. Looks: Verifying shapes under different visual styles (`classic` and `handDrawn`).…
--- END MERMAID ---
```

</details>

<details>
<summary>Tier 3 (all profiles) — context</summary>

```
--- REPOSITORY: CADDY ---
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
--- END CADDY ---

--- REPOSITORY: RUFF ---
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
--- END RUFF ---

--- REPOSITORY: ZULIP ---
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
--- END ZULIP ---

--- REPOSITORY: APPWRITE ---
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
--- END APPWRITE ---

--- REPOSITORY: DAGGER ---
---CHODE v2---

---DNA---
@STACK go python php phpunit java vertx mockito elixir jason
@FRONTEND ts react rollup
@CI github-actions
@PKG gomod
@TEST mocha mix test pytest
@ENTRY cmd/init/main.go
@PACKAGES sdk/(585) internal/(491) core/(338) engine/(196) dagql/(113)
@STRUCT sdk/(1.5k) core/{integration,schema,sdk,prompts,docs,workspace}(651) internal/{buildkit,fsutil,testutil,cloud}(524) engine/(220) dagql/(210) toolchains/(206) modules/{evals,gha,evaluator,doug,metrics,alpine}(167) cmd/{codegen,engine,dnsname,dialstdio,introspect,dump-id}(133) util/(49) skills/(24) network/(9) hack/(7) version/(6)
@PATTERNS strategy(buildkit) plugin
@MIDDLEWARE internal/testutil/

---CONTEXT---
@PURPOSE best way to find good contribution is to use Dagger for something. Then write down what problems you encounter. Could be as simple as question you had, that docs didn't answer. Or bug in tool, or missing feature. Then pick item that you're comfortable with in terms of difficulty, and give it try. 🙂 You can ask questions along way, we're always…
@CONVENTIONS General guidelines when making technical decisions: Aim for best developer experience, in way that is idiomatic to language. It should feel as natural as possible to its users. Try to keep consistency with stable SDKs, unless where it contradicts with previous point which is more important. Try to keep SDK as thin as possible to reduce maintenance…
@ENV There should be `README.md` file with instructions for installation, usage and for setting up local environment with everything needed to develop. This may include how to run tests, code linting and code generation (codegen).
@TESTING Add tests as you develop. Increasing coverage is harder later. When codegen component is done, easy win is to port integration tests from Go SDK. Replicating those exact pipelines will allow boost in performance when running all SDK tests, by getting cached results from API.
@GOTCHAS Naming: Directive names use camelCase (`myFeature`), pragma names match (`+myFeature`) Field tags: Core types use `` `field:"true" doc:"..."` `` for GraphQL exposure Array handling: Use `ast.ChildValueList` for list values in directives Optional fields: Use `default:""` or `default:"[]"` in resolver struct tags Pragma parsing: Uses regex…
--- END DAGGER ---

--- REPOSITORY: LADYBIRD ---
---CHODE v2---

---DNA---
@STACK rust cpp
@CI github-actions
@PKG cargo pip
@CONFIG ini
@PACKAGES Libraries/(3927) AK/(196) UI/(102) Meta/(84) Services/(55)
@STRUCT Libraries/(4.6k) Meta/(257) AK/(200) UI/(190) Services/{WebContent,RequestServer,WebWorker,WebDriver,ImageDecoder}(71) Base/(66) Documentation/(37) Utilities/(7)

---CONTEXT---
@PURPOSE Ladybird is truly independent web browser, using novel engine based on web standards. > [!IMPORTANT] > Ladybird is in pre-alpha state, and only suitable for use by developers >
@CONVENTIONS After parsing and style computation, longhand properties are stored as `StyleValue` pointers in `ComputedProperties`. Any shorthands have been expanded out, and so we do not need to store them directly. These longhands then need to be converted to more usable form. To do this, add getter to `ComputedProperties` with same name as property. It…
@SETUP Build Instructions Advanced Build Instructions Troubleshooting Testing Profiling Build
@ENV Clangd will look for configuration information in files named `.clangd` in each of parent directories of file being edited. Ladybird source code repository has top-level `.clangd` configuration file in root directory. One of configuration stanzas in that file specifies location for compilation database. Depending on your build configuration (e.g.,…
@TESTING When possible, please include tests when fixing bugs or adding new features. If changes you’re making have relevant Web Platform Tests (WPT) tests — especially if changes cause Ladybird to pass any WPT tests it hadn’t yet been passing — you should consider importing those tests into your Ladybird clone, and then commit imported tests along with…
@GOTCHAS GitHub project contains git notes for each commit that includes e.g. link to pull request from which commit originated and reviewer information. These are updated automatically, but require additional step locally to be able to see notes in `git log`: ```bash git config --add remote.upstream.fetch '+refs/notes/*:refs/notes/*' ``` > [!NOTE] >…
--- END LADYBIRD ---

--- REPOSITORY: MERMAID ---
---CHODE v2---

---DNA---
@STACK ts express jest playwright vite vitest vue
@CI github-actions
@PKG pnpm
@TEST cypress jest playwright vitest
@CONFIG docker-compose yaml
@ENTRY packages/parser/src/index.ts
@PACKAGES packages/(623) cypress/(80)
@STRUCT packages/(823) cypress/(164) demos/(34) img/(11) scripts/(8)

---CONTEXT---
@PURPOSE --> Mermaid is JavaScript-based diagramming and charting tool that uses Markdown-inspired text definitions and renderer to create and modify complex diagrams. main purpose of Mermaid is to help documentation catch up with development. > Doc-Rot is Catch-22 that Mermaid helps to solve. Diagramming and documentation costs precious developer time…
@CONVENTIONS Community leaders will follow these Community Impact Guidelines in determining consequences for any action they deem in violation of this Code of Conduct: ### 1. Correction Community Impact: Use of inappropriate language or other behavior deemed unprofessional or unwelcome in community. Consequence: private, written warning from community…
@SETUP To utilize these utilities, import them from `utils.ts` file into your shape creation script. These helpers will streamline process of building and customizing SVG shapes, ensuring consistent results across your projects. ```typescript import { labelHelper, updateNodeBounds, insertPolygonShape, getNodeClasses, createPathFromPoints,…
@TESTING To ensure robustness of flowchart shapes, there are implementation of comprehensive Cypress test cases in `newShapes.spec.ts` file. These tests cover various aspects such as: Shapes: Testing new shapes like `bowTieRect`, `waveRectangle`, `trapezoidalPentagon`, etc. Looks: Verifying shapes under different visual styles (`classic` and `handDrawn`).…
--- END MERMAID ---

--- REPOSITORY: MOONDREAM ---
---CHODE v2 @ 9fe3ad7---

---DNA---
@STACK python
@CI github-actions
@PACKAGES moondream/(29) recipes/(9)
@STRUCT moondream/(31) recipes/(23)

---CONTEXT---
@PURPOSE Moondream is highly efficient open-source vision language model that combines powerful image understanding capabilities with remarkably small footprint. It's designed to be versatile and accessible, capable of running on wide range of devices and platforms. project offers two model variants: Moondream 2B: primary model with 2 billion…
--- END MOONDREAM ---

--- REPOSITORY: POCKETBASE ---
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
--- END POCKETBASE ---

--- REPOSITORY: FASTAPI ---
---CHODE v2---

---DNA---
@STACK python starlette pydantic
@CI github-actions
@PKG uv
@CONFIG toml
@ENTRY fastapi/applications.py
@ROUTES fastapi/routing.py
@PACKAGES docs_src/(455) fastapi/(48)
@STRUCT docs_src/(457) scripts/(70) fastapi/(53)
@PATTERNS event-driven middleware-chain

---CONTEXT---
@PURPOSE FastAPI framework, high performance, easy to learn, fast to code, ready for production --- Documentation: Source Code: --- FastAPI is modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints. key features are: Fast: high performance, on par with NodeJS…
@SETUP Create and activate virtual environment and then install FastAPI: ```console $ pip install "fastapi[standard]" ---> 100% ``` Note: Make sure you put `"fastapi[standard]"` in quotes to ensure it works in all terminals.
--- END FASTAPI ---

--- REPOSITORY: GH-CLI ---
---CHODE v2---

---DNA---
@STACK go oauth cobra testify grpc
@CI github-actions
@PKG gomod
@TEST make test
@ENTRY cmd/gen-docs/main.go
@ROUTES api/ (24 files)
@PACKAGES pkg/(688) internal/(104) api/(24) git/(8) context/(3)
@STRUCT pkg/{cmd,cmdutil,iostreams,search,extensions,httpmock}(782) acceptance/(114) internal/{codespaces,skills,licenses,config,prompter,docs}(110) api/(24) git/(18) script/(15) context/(3)
@PATTERNS factory plugin

---CONTEXT---
@PURPOSE `gh` is GitHub on command line. It brings pull requests, issues, and other GitHub concepts to terminal next to where you are already working with `git` and your code. GitHub CLI is supported for users on GitHub.com, GitHub Enterprise Cloud, and GitHub Enterprise Server 2.20+ with support for macOS, Windows, and Linux.
@CONVENTIONS Add godoc comments to all exported functions, types, and constants Avoid unnecessary code comments — only comment when why isn't obvious from code Do not comment to restate what code does Never use em dashes (—) in code, comments, or documentation; use regular dashes (-) or rewrite sentence instead
@SETUP ### macOS Homebrew Precompiled binaries on releases page For additional macOS packages and installers, see community-supported docs ### Linux & Unix Debian, Raspberry Pi, Ubuntu Amazon Linux, CentOS, Fedora, openSUSE, RHEL, SUSE Precompiled binaries on releases page For additional Linux & Unix packages and installers, see community-supported…
@TESTING acceptance tests are blackbox* tests that are expected to interact with resources on real GitHub instance. They are built on top of `go-internal/testscript` package, which provides framework for building tests for command line tools. *Note: they aren't strictly blackbox because `exec gh` commands delegate to binary set up by `testscript` that…
--- END GH-CLI ---

--- REPOSITORY: GITEA ---
---CHODE v2---

---DNA---
@STACK go chi mysql jwt pq sqlite3 mssql python
@FRONTEND ts vue esbuild vite (web_src/)
@CI github-actions
@PKG pnpm gomod uv
@TEST @playwright/test vitest make test make test-backend make test-frontend make test-check make test-sqlite
@CONFIG ini
@ENTRY main.go
@ROUTES chi → routers/ (447 files)
@DATA models/migrations/ (305 migrations)
@ENTITIES models/ → actions activities admin asymkey auth avatars dbfs git issues organization packages perm
@AUTH openid pam password webauthn ldap oauth smtp db oauth2 sspi
@API azure aws github-api minio prometheus
@ARCH layered(cmd→routes→svc→mdl) strategy(auth)
@PACKAGES modules/(968) models/(649) services/(479) routers/(445) cmd/(52)
@STRUCT modules/{git,setting,markup,packages,structs,indexer}(1.2k) models/{migrations,fixtures,issues,repo,actions,db}(769) templates/{repo,user,package,admin,org,shared}(574) routers/{web,api,private,common,install,utils}(484) services/{repository,auth,pull,context,mailer,convert}(481) web_src/{js,css,svg,fomantic}(376) cmd/(52) contrib/{gitea-monitoring-mixin,ide,backport,legal,init,launchd}(27) docker/(11) tools/(11)
@PATTERNS strategy(auth) repository middleware-chain
@MIDDLEWARE routers/common/

---CONTEXT---
@PURPOSE goal of this project is to make easiest, fastest, and most painless way of setting up self-hosted Git service. As Gitea is written in Go, it works across all platforms and architectures that are supported by Go, including Linux, macOS, and Windows on x86, amd64, ARM and PowerPC architectures. This project has been forked from Gogs since November…
@CONVENTIONS You should always run `make fmt` before committing to conform to Gitea's styleguide.
@TESTING Before submitting pull request, run all tests to make sure your changes don't cause regression elsewhere. Here's how to run test suite: code lint | | | |:-------------------- |:--------------------------------------------------------------------------- | |``make lint`` | lint everything (not needed if you only change front- or backend) |…
--- END GITEA ---

--- REPOSITORY: RIPGREP ---
---CHODE v2---

---DNA---
@STACK rust anyhow log serde_json
@CI github-actions
@PKG cargo
@ENTRY crates/core/main.rs
@PACKAGES crates/(88) fuzz/(1) pkg/(1)
@STRUCT crates/(136) benchsuite/(30) fuzz/(5) ci/(4) pkg/{windows,brew}(3)

---CONTEXT---
@PURPOSE ripgrep (rg) ------------ ripgrep is line-oriented search tool that recursively searches current directory for regex pattern. By default, ripgrep will respect gitignore rules and skip hidden files/directories and binary files. (To disable all automatic filtering by default, use `rg -uuu`.) ripgrep has first class support on Windows, macOS and…
@SETUP This crate relies on `cargo-fuzz` component. To install this component, run following from `fuzz` directory: ```bash cargo install cargo-fuzz ```
--- END RIPGREP ---
```

</details>

