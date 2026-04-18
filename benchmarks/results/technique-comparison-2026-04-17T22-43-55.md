# CHODE Technique Comparison Benchmark
**Date:** 2026-04-17  
**Repos:** caddy, ruff, zulip, pixijs  
**Models:** gemini-flash, gpt-4o  

## What this tests

Four strategies for giving an AI model context about a repo:

| Technique | How | Approx tokens |
|---|---|---|
| Baseline | No context — training knowledge only | ~300 |
| README-only | Paste raw README as context | varies (~500–2000) |
| LLM summary | Model summarizes README first, then answers from summary | ~500 (2 API calls) |
| **CHODE** | Structured .chode profile generated offline | **~350–500** |

## Score Summary

| Repo | Model | Baseline | README | LLM Summary | **CHODE** |
|---|---|---|---|---|---|
| caddy | gemini-flash | 25% | 0% | 0% | **75%** |
| caddy | gpt-4o | 0% | 0% | 0% | **100%** |
| ruff | gemini-flash | 25% | 58% | 33% | **92%** |
| ruff | gpt-4o | 33% | 33% | 58% | **100%** |
| zulip | gemini-flash | 25% | 0% | 25% | **100%** |
| zulip | gpt-4o | 0% | 0% | 25% | **100%** |
| pixijs | gemini-flash | 0% | 25% | 33% | **75%** |
| pixijs | gpt-4o | 0% | 25% | 25% | **75%** |

**Aggregate (all repos × models):**
| Technique | Score | Avg input tokens |
|---|---|---|
| Baseline | 14% | ~300 |
| README-only | 18% | ~2956 |
| LLM Summary | 25% | ~437 (×2 API calls) |
| **CHODE** | **90%** | **~406** |

## Per-Question Detail

### caddy (~3237 tok README | ~327 tok CHODE)

| Q | Must contain | gemini-flash base | gpt-4o base | gemini-flash readme | gpt-4o readme | gemini-flash sum | gpt-4o sum | gemini-flash chode | gpt-4o chode | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| Q1 | `cmd/caddy/main.go` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @ENTRY — exact path, tests precision |
| Q2 | `chi` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | @STACK — one word, easy to miss in raw README |
| Q3 | `prometheus` | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @API — specific integration |
| Q4 | `early return, indent` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @CONVENTIONS — tests compression quality |

### ruff (~6329 tok README | ~455 tok CHODE)

| Q | Must contain | gemini-flash base | gpt-4o base | gemini-flash readme | gpt-4o readme | gemini-flash sum | gpt-4o sum | gemini-flash chode | gpt-4o chode | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| Q1 | `rust, python` | 1 | 1 | 3 | 0 | 3 | 3 | 3 | 3 | @STACK |
| Q2 | `cargo, pip` | 1 | 1 | 1 | 1 | 1 | 1 | 3 | 3 | @PKG |
| Q3 | `10, 100` | 1 | 0 | 3 | 3 | 0 | 3 | 3 | 3 | @PURPOSE — key marketing claim |
| Q4 | `test` | 0 | 2 | 0 | 0 | 0 | 0 | 2 | 3 | @CONVENTIONS — testing requirement |

### zulip (~1210 tok README | ~587 tok CHODE)

| Q | Must contain | gemini-flash base | gpt-4o base | gemini-flash readme | gpt-4o readme | gemini-flash sum | gpt-4o sum | gemini-flash chode | gpt-4o chode | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| Q1 | `ldap, saml` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @AUTH |
| Q2 | `preact` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @FRONTEND — specific choice, often confused with React |
| Q3 | `python` | 3 | 0 | 0 | 0 | 3 | 3 | 3 | 3 | @STACK |
| Q4 | `pnpm, uv` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @PKG |

### pixijs (~1046 tok README | ~255 tok CHODE)

| Q | Must contain | gemini-flash base | gpt-4o base | gemini-flash readme | gpt-4o readme | gemini-flash sum | gpt-4o sum | gemini-flash chode | gpt-4o chode | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| Q1 | `jest` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @TEST |
| Q2 | `plugin, event` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | @PATTERNS |
| Q3 | `npm` | 0 | 0 | 3 | 3 | 3 | 3 | 3 | 3 | @PKG |
| Q4 | `typescript, ts` | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | @STACK — profile uses "ts" abbreviation |

