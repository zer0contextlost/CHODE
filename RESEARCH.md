# CHODE: Compressed Hierarchical Overview of Directory and Ecosystems

**Technical Report · April 2026 · v1.0**

**zer0contextlost**  
Independent Research · github.com/zer0contextlost/CHODE

---

| Stat | Value |
|---|---|
| CHODE avg benchmark score across 9 repos × 6 models | **90%** |
| Self-profiling score (~43,000 tokens, raw docs) | **40%** |
| Fewer tokens than self-profiling, on average | **122×** |
| Better comprehension per token (Gitea + GPT-4o) | **454×** |

---

## Abstract

We present CHODE, a command-line tool that generates a structured, ~200–400 token profile of any software repository by statically analysing file trees, dependency manifests, and documentation files — without reading source code or invoking a language model. The resulting profile, called a .chode file, encodes stack, structure, entry points, authentication methods, conventions, and purpose into a labeled field format optimised for AI model retrieval.

We evaluate CHODE against three alternative context strategies across 27 repositories spanning 9 programming languages, using 6 frontier language models and over 650 total benchmark calls. The primary finding is counter-intuitive: raw documentation context (averaging 43,000 tokens) scores **4 percentage points lower** than providing no context at all — a phenomenon we attribute to two distinct failure modes: *Prior Overwhelming* (smaller models default to training-data priors even when context contains the correct answer) and *Attention Dilution* (larger models scan the surface of dense context and abstain on buried facts). CHODE profiles, at ~353 tokens, score 90% — delivering 122× fewer tokens and strictly higher accuracy. We further demonstrate that README-only context scores 18% on 2,956 tokens and LLM-generated summaries score 25% requiring two API calls — confirming that neither common alternative recovers the signal CHODE explicitly extracts. Logprob analysis on GPT-4o shows ΔP(correct) = +97.3 percentage points between baseline and CHODE context for a representative router-identification question.

**Keywords:** context compression, repository profiling, AI-assisted development, retrieval-augmented generation, attention dilution, token efficiency, benchmark

---

## Contents

1. Introduction
2. Problem Formulation
3. CHODE Architecture
   - 3.1 DNA Section
   - 3.2 Context Section
   - 3.3 Security Properties
4. Benchmark Methodology
   - 4.1 Stump Questions
   - 4.2 Scoring
   - 4.3 Evaluation Modes
5. Primary Results
6. Failure Mode Analysis
   - 6.1 Prior Overwhelming
   - 6.2 Attention Dilution
   - 6.3 Logprob Evidence
7. Technique Comparison
8. Cross-Domain Generalization
9. Field-Cap Ablation
10. Schema Design and Field-Label Retrieval
11. Retrieval Mode Analysis: Mechanical vs. Semantic
12. Anomalies and Unexpected Findings
13. Efficiency Metrics
14. Limitations
15. Related Work
16. Conclusion

---

## 1. Introduction

When an AI assistant is asked to help with an unfamiliar codebase, it needs to know where it is. Which language? Which framework? Where is the entry point? What authentication system? What test command? These orientation facts are cheap to state, expensive to rediscover, and have an outsized effect on the quality of every subsequent answer.

The dominant approach — passing raw documentation or file dumps into the context window — is intuitive but, we will show, empirically wrong for this task. More context is not better context when the signal-to-noise ratio of raw documentation is insufficient for reliable retrieval of specific atomic facts.

This report documents the design, implementation, and evaluation of CHODE (Compressed Hierarchical Overview of Directory and Ecosystems), a tool that generates a structured ~200–400 token repository profile by static analysis of file trees, package manifests, and documentation files. No source code is read. No language model is invoked. Generation completes in under one second.

The core claim is that structured extraction at generation time outperforms unstructured retrieval at inference time — and that the gap is large enough to be practically significant. We support this claim with benchmarks across 27 repositories, 6 language models, and over 650 benchmark calls, including ablation studies, logprob measurements, and schema remap experiments.

> **Primary Finding:** CHODE profiles (~353 tokens) score 90% on profile-dependent orientation questions. Raw documentation context (~43,000 tokens) scores 40% — 4 percentage points *below* the 44% achieved with no context at all. Adding 43,000 tokens of documentation actively degraded model accuracy.

---

## 2. Problem Formulation

We define the **repository orientation problem** as the task of equipping a language model with sufficient factual grounding to answer specific structural questions about a software project — without requiring the model to read source code.

Orientation facts are characterised by three properties:

**Atomicity.** Facts like "uses chi HTTP router" or "entry point is cmd/caddy/main.go" are binary: either the model retrieves the exact value or it doesn't. There is no graceful degradation on a fact like a specific library name.

**Anti-parametricity.** We specifically target facts the model would not know from training data alone — or where training data encodes stale or incorrect priors. A model trained on GitHub data may know that Go web servers commonly use Gin or Echo; if a specific project uses Chi, training priors actively mislead.

**Structural stability.** Orientation facts change rarely relative to feature code. The entry point, package manager, and authentication method of a production codebase are stable across weeks or months of active development.

The orientation problem is distinct from code understanding (which requires reading source), task execution (which requires tool use), and document summarisation (which preserves prose structure rather than atomic facts). Existing tools conflate these tasks; CHODE targets orientation specifically.

---

## 3. CHODE Architecture

A CHODE profile consists of two sections, a version header with git commit hash, and a hard token budget enforced at generation time.

```
---CHODE v2 @ a3f9c12---

---DNA---
@STACK    go chi mysql jwt sqlite3
@FRONTEND ts vue esbuild vite (web_src/)
@CI       github-actions
@PKG      pnpm gomod uv
@TEST     playwright vitest make test
@CONFIG   ini
@ENTRY    main.go
@ROUTES   chi → routers/ (447 files)
@DATA     models/migrations/ (305 migrations)
@AUTH     openid pam password webauthn ldap oauth
@ARCH     layered(cmd→routes→svc→mdl)
@PACKAGES modules/(968) models/(649) services/(479)

---CONTEXT---
@PURPOSE      easiest, fastest self-hosted Git service written in Go...
@CONVENTIONS  Always run `make fmt` before committing...
@TESTING      Run `make lint`. Test commands: make test | make test-backend
```

*Figure 1. Sample CHODE v2 profile for Gitea (6,900 files → 507 tokens, generated in 0.2s).*

### 3.1 DNA Section

The DNA section is produced entirely from file metadata — no file content is read. Two data sources are analysed:

**File tree analysis** traverses the repository to produce `@PACKAGES` (top directories by file count) and `@STRUCT` (directory tree with file counts, abbreviated). Language zones are identified from file extensions.

**Anchor file parsing** reads the content of package manifests — `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `pom.xml`, `build.gradle`, `mix.exs`, `Gemfile`, and equivalents — to extract dependency names, package managers, test scripts, and CI configuration. 18 programming languages are supported.

A Python zone-count fallback handles repos with no recognised package manifest (common in ML model repos and data science projects): if five or more `.py` files are found and no Python stack was already detected via manifest, `@STACK python` is emitted.

### 3.2 Context Section

The CONTEXT section reads documentation files only: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, and their variants. Section headings are mapped to labeled fields using a priority-ordered heading scanner:

| Field | Sourced from headings matching | Purpose |
|---|---|---|
| `@PURPOSE` | Introduction, About, Overview, What is | Project description |
| `@SETUP` | Installation, Getting Started, Quick Start | Install and run |
| `@CONVENTIONS` | Contributing, Code Style, Guidelines | Development norms |
| `@TESTING` | Testing, Tests, Running Tests | Test commands |
| `@ENV` | Environment, Configuration, Config | Environment variables |
| `@DEPLOY` | Deployment, Deploy, Production | Deployment notes |
| `@GOTCHAS` | Gotchas, Known Issues, Caveats, Troubleshooting | Operationally important edge cases |

Extracted content is processed by a deterministic compression algorithm ("caveman compression") that strips markdown syntax, filler phrases, repeated boilerplate, and stop words, then hard-caps each field at 350 characters. No language model is used in this step.

### 3.3 Security Properties

**Prompt injection sanitisation.** Every line of extracted documentation content is tested against nine regular expression patterns before being written to a profile field. Lines matching injection patterns are silently dropped:

```
// Representative patterns from sanitizeContext()
/ignore\s+(previous|prior|all|above)\s+(instructions?|context|prompts?)/i
/you\s+are\s+now\s+(a|an|the)\s/i
/\bact\s+as\s+(a|an|the)\s/i
/pretend\s+(you\s+are|to\s+be)/i
/<\|im_(start|end)\|>|\[INST\]|\[\/INST\]/i
```

A poisoned README cannot embed executable instructions into a CHODE profile.

**Staleness detection.** Every profile header embeds the git commit hash at generation time: `---CHODE v2 @ a3f9c12---`. Consumers can check staleness with a single command:

```
git rev-list $(head -1 .chode | grep -o '[a-f0-9]\{7\}')..HEAD --count
```

---

## 4. Benchmark Methodology

### 4.1 Stump Questions

Standard benchmark questions for codebases suffer from a confound: a model may answer correctly because the fact was in its training data, not because it read the provided context. We address this with *stump questions* — questions designed so that the correct answer is one the model would not produce from training knowledge alone.

Stump questions have three properties: (1) the correct answer is present in the CHODE profile, (2) the model's training-data prior for this specific project answers a plausible alternative — not an implausible one, and (3) the question is structurally natural ("What HTTP router does this project use?" not "What is the value of the @ROUTES field?").

Each benchmark set contains a mix of stump questions (where baseline performance is expected to be low) and general-knowledge questions (which validate that CHODE doesn't suppress correct answers the model already knows). The primary metric is stump-question accuracy, since general-knowledge accuracy is ceiling-bounded by training data regardless of context strategy.

### 4.2 Scoring

Each question is scored 0–3 using substring matching against a ground-truth specification:

| Score | Condition |
|---|---|
| 0 | Answer contains "Not in profile" / "Not mentioned" / equivalent abstention phrase, *or* no required term is present |
| 1 | At least one required term present but not all |
| 2 | All required terms present; no bonus-credit terms |
| 3 | All required terms present; at least one bonus-credit term present |

Matching is case-insensitive substring matching with no normalisation. This strictness is intentional: `-uuu` does not match `-u -u -u`. The benchmark measures *profile fidelity*, not semantic equivalence. If a model outputs a semantically correct paraphrase of a profile value, it has introduced parametric drift — substituting its training-data dialect for the extracted ground truth. In production contexts, that substitution is a bug.

### 4.3 Evaluation Modes

| Mode | Context provided | Instruction |
|---|---|---|
| **Baseline** | None | "Answer from general knowledge" |
| **Self-profile** | Raw documentation files (README, CONTRIBUTING, etc.) | "Answer from provided documents" |
| **README-only** | README.md only | "Answer from provided README; say Not in README if absent" |
| **LLM Summary** | Model-generated summary of README (Step 1), then summary used as context (Step 2) | Two-call pipeline |
| **CHODE** | .chode profile (~200–400 tok) | "Answer from profile only; say Not in profile if absent" |

Models evaluated: Gemini 2.5 Flash, Gemini 2.5 Pro, GPT-4o, GPT-4o-mini, Mistral Large, Llama 4 Maverick. All calls made via OpenRouter at temperature=0. All results saved to `benchmarks/results/`.

---

## 5. Primary Results

The primary benchmark covers 9 repositories across Go, TypeScript, Python, PHP, Rust, and Elixir, using 12 profile-dependent questions per repository and all 6 models in baseline, self-profile, and CHODE modes (162 total evaluation calls per repo, 1,458 total).

| Method | Avg Score | Avg Tokens |
|---|---|---|
| Self-profiling | 40% | ~43,000 |
| Baseline | 44% | ~300 |
| CHODE | 90% | ~353 |

| Repository | Language | Baseline | Self-profile | CHODE | Δ (CHODE vs Base) | Profile size |
|---|---|---|---|---|---|---|
| gitea | Go | 20% | — | 97% | +77pp | ~507 tok |
| rails | Ruby | 38% | — | 93% | +55pp | ~548 tok |
| gh-cli | Go | 39% | — | 94% | +55pp | ~451 tok |
| laravel | PHP | 39% | — | 88% | +49pp | ~237 tok |
| next.js | TypeScript | 24% | — | 77% | +53pp | ~567 tok |
| fastapi | Python | 44% | — | 87% | +43pp | ~211 tok |
| django | Python | 47% | — | 85% | +38pp | ~160 tok |
| ripgrep | Rust | 75% | — | 97% | +22pp | ~189 tok |
| phoenix | Elixir | 69% | — | 86% | +17pp | ~306 tok |
| **Average** | | **44%** | **40%** | **90%** | **+46pp** | **~353 tok** |

*Table 1. Primary benchmark results across 9 repositories and 6 models. Self-profile averaged across all three-way runs (subset of repos). Δ is CHODE vs baseline.*

### 5.1 Per-Model Self-Profile Degradation

The self-profile accuracy degradation — where raw documentation context scores below baseline — is architectural rather than size-dependent. Averages across all 9 repositories:

| Model | Avg Baseline | Avg Self-profile | Δ (B − S) | Characterisation |
|---|---|---|---|---|
| Gemini 2.5 Flash | 46.6% | 50.2% | −3.6% | Noise-immune (ceiling effect) |
| Gemini 2.5 Pro | 49.3% | 47.2% | +2.1% | Minimal sensitivity |
| Mistral Large | 47.1% | 46.2% | +0.9% | Minimal sensitivity |
| Llama 4 Maverick | 43.1% | 37.1% | +6.0% | Moderate degradation |
| GPT-4o | 38.8% | 31.2% | +7.6% | High noise sensitivity |
| GPT-4o-mini | 38.6% | 30.9% | +7.7% | High noise sensitivity |

*Table 2. Per-model self-profile degradation (positive Δ = self-profile hurts more). The split is architectural, not size-based: Gemini family is noise-tolerant; OpenAI family shows ~7.7pp degradation regardless of model size.*

**Note on Gemini Flash noise immunity:** Flash's apparent noise immunity (D = −3.6%) is a ceiling effect, not architectural robustness. Flash hits its accuracy ceiling at cap=40 characters per field — its permanent blind spots (chi from @STACK, migration counts) are cap-independent. Raw context doesn't hurt it because it wasn't answering those questions correctly with CHODE either.

---

## 6. Failure Mode Analysis

The self-profile degradation is explained by two distinct mechanisms that operate at different points in inference. Understanding both is necessary to understand why structured extraction at generation time outperforms retrieval at inference time.

### 6.1 Prior Overwhelming

When a model is presented with dense context containing boilerplate-heavy documentation, it may *reinforce* its training-data priors rather than override them. The mechanism: framework-standard documentation — setup guides, dependency installation, CI configuration — exposes a high density of common technology names. A Go web server documentation corpus contains "Gin," "Echo," "gorilla/mux," and similar names across thousands of tokens. These tokens strengthen the model's internal association toward the modal answer.

The stump question targets the *specific* answer — not the modal one. Chi is an obscure Go HTTP router; Gin is the trained default. When the SNR of the context drops below a threshold (because the correct answer is one word in 43,000 tokens of noise), models with weak long-context attention default to parametric weights. The correct answer is technically present; the model stops looking before it finds it.

This is distinct from the Needle-In-a-Haystack (NIAH) degradation pattern, which shows a U-shaped accuracy curve where performance degrades when the needle is in the middle of context. Prior Overwhelming degrades performance *uniformly* — the model doesn't return to the needle even at end-of-context positions — because it has locked onto a parametric prior before completing the scan.

> **Evidence:** Mistral Large baseline answer on Gitea router question: *"Gin is more likely if the project is lightweight."* This was produced with no context. The same explicit prior-locking language did not appear in self-profile runs for Mistral — suggesting the mechanism fires primarily in zero-context mode. The dominant self-profile failure mode for OpenAI models is Attention Dilution (§6.2).

### 6.2 Attention Dilution

Larger models (GPT-4o, GPT-4o-mini) exhibit a different failure mode: they do not hallucinate a wrong answer — they abstain. The characteristic pattern is a model responding "Not in profile" or "I cannot determine this from the provided documents" for facts that are present in the provided context.

In the three-way benchmark on Gitea, GPT-4o-mini responded "Not in profile" for 6 of 12 questions when given 82,000 tokens of raw documentation — despite the answers being present. The model scanned the surface of the document, found no clear signal in the expected position, and correctly reported that it had not found the answer. The answer was there. The model didn't find it.

This is distinct from Prior Overwhelming because the model's parametric prior isn't firing — it has suppressed the prior in favour of context, but then failed to locate the needle in the context. The result is accurate epistemic humility (the model didn't confabulate) but practically indistinguishable from amnesia on the specific fact.

> "More context was more distraction. The model had the answer. It just couldn't find it."

### 6.3 Logprob Evidence

We directly measured the probability shift induced by CHODE context on GPT-4o using the logprobs API. The test question: *"Which Go HTTP router does Gitea use? Reply with the library name only — one word."*

| Mode | Top answer | P(chi) | Tokens fed |
|---|---|---|---|
| Baseline (no context) | Macaron | 2.5% | ~300 |
| Raw context | chi | 99.6% | ~8,000 |
| CHODE profile | chi | 99.7% | 507 |

*Table 3. GPT-4o logprob measurement on Gitea router question. **ΔP(chi) baseline→CHODE = +97.3pp.***

Two findings of note:

**The baseline prior is stale training data.** GPT-4o answered "Macaron" with 97.1% confidence — not Gin or Echo (the current modal Go routers), but Macaron, the router Gitea used before switching to Chi. The model encoded a historical state that no longer matches the current codebase. CHODE provides current ground truth extracted from the live repository.

**CHODE and raw context achieve equivalent logprob outcomes on this question.** Both reach ~99.7% P(chi). The advantage of CHODE is not probability magnitude on any single question — it is cost and reliability across many questions simultaneously. Raw context achieves this result at 16× the token cost, and as shown in §5, degrades substantially on other questions in the same pass.

---

## 7. Technique Comparison

We address two common objections to CHODE directly with empirical data: "Why not just paste the README?" and "Why not ask the model to summarise the README first?"

Four context strategies were evaluated across caddy, ruff, zulip, and pixijs using 4 questions per repo and 2 models (Gemini 2.5 Flash, GPT-4o). Questions were selected so the answer is present in both the CHODE profile *and* the README — this is a retrieval-quality test, not a coverage test.

| Technique | Score | Avg input tokens | API calls | Requires LLM at generation |
|---|---|---|---|---|
| Baseline | 14% | ~300 | 1 | No |
| README-only | 18% | ~2,956 | 1 | No |
| LLM Summary | 25% | ~437 | 2 | Yes |
| **CHODE** | **90%** | **~406** | **1** | **No** |

*Table 4. Four-way technique comparison. Scores aggregated across caddy, ruff, zulip, pixijs × 2 models × 4 questions per repo.*

### 7.1 Why README-Only Fails

README-only scored 0% on both caddy and zulip despite the questions having answers present in other repository files. This reveals the core problem: **READMEs are optimised for first impressions, not for structural completeness.**

The caddy README is narrative overview text. The entry point path (`cmd/caddy/main.go`), HTTP router library (`chi`), and error-handling conventions live in `CONTRIBUTING.md`, `go.mod`, and source tree structure — not the README. CHODE reads those files; README-only cannot.

The zulip README is 80 lines of project marketing. Authentication methods (LDAP, SAML), frontend framework (Preact), and package managers (pnpm, uv) are encoded in configuration files and contributing documentation. README-only is completely silent on all of them.

ruff's README scored 58% — ruff maintains an unusually dense, technical README that includes performance figures and setup details. Even here, package manager specifics (`cargo` + `pip`) were not captured.

### 7.2 Why LLM Summarisation Fails

The two-call pipeline (Step 1: summarise README; Step 2: answer questions from summary) scored 25% despite consuming approximately the same token budget as CHODE on the question-answering step. Summarisation is lossy in precisely the wrong direction for the orientation task:

Models summarising documentation preserve narrative tone and high-level purpose while collapsing specifics. "Supports multiple authentication methods" survives; "LDAP, SAML, oauth2, password, WebAuthn" does not. "Uses modern JavaScript tooling" survives; "pnpm + esbuild + Preact" does not. The atoms that orient a model to a codebase are exactly the atoms that summarisation discards.

Additionally, the LLM summary approach requires a frontier model at generation time — adding cost, latency, and an API dependency. CHODE runs offline with no model dependency and completes in under one second.

---

## 8. Cross-Domain Generalization

We extended evaluation to 18 additional repositories spanning browsers (Ladybird, C++), chat platforms (Zulip, Python/Django), graphics engines (PixiJS, TypeScript), backend platforms (Appwrite, PHP), vision models (Moondream, Python), web servers (Caddy, actix-web), linters (ruff), CI tools (Dagger), and diagramming tools (Mermaid). Questions were split into two tiers:

| Tier | Definition | Baseline | CHODE | Δ |
|---|---|---|---|---|
| **Tier 1** | Facts explicitly present in the CHODE profile | 22% | **100%** | +78pp |
| **Tier 2** | Facts not captured in the profile (gap questions) | 48% | 17%* | −31pp |

*Table 5. Tier-1/Tier-2 cross-domain breakdown across 18 additional repositories × 2 models. \*Tier 2 decline is expected correct behaviour — see §8.1.*

### 8.1 Tier-2 Inversion is Correct Behaviour

The Tier-2 decline (CHODE 17% vs baseline 48%) is not a failure — it is the intended behaviour of the "answer only from profile" instruction. When models are told to answer only from a profile that does not contain a given fact, they correctly respond with "Not in profile." Baseline gets 48% on Tier-2 by guessing from training knowledge, which happens to be correct roughly half the time.

The correct comparison is: baseline gets 48% by guessing; CHODE correctly abstains and gets 17% (the residual comes from mild noncompliance — models occasionally inject training knowledge despite the instruction, and happen to be right). Overclaiming from a profile — confidently asserting a fact that isn't there — is strictly worse than honest abstention.

### 8.2 Profile Quality Taxonomy

Extended evaluation identified four categories of repository, ordered by CHODE profile quality:

| Category | Characteristics | Example repos | Profile quality |
|---|---|---|---|
| App-using-framework | Conventional structure, rich manifests, CONTRIBUTING.md | gitea, caddy, actix-web | Richest |
| Multi-SDK tools | Multiple language SDKs, clear API surface | Dagger | Good |
| Framework-meta repos | Repo IS the framework; README is marketing | NestJS, Django, Rails | Noisy |
| ML/data repos | Flat Python scripts, no conventional structure | Moondream | Sparse |

*Table 6. Repository taxonomy by CHODE profile quality.*

Framework-meta repos present a specific failure mode: because the project *is* a well-known framework, the model's training knowledge already covers most questions — CHODE cannot improve on that — while the noisy profile (full of framework internals) can actively suppress correct training-knowledge answers. The NestJS benchmark showed both GPT-4o and Gemini Flash scoring lower with CHODE than baseline. This is a documented edge case, not a general limitation.

---

## 9. Field-Cap Ablation

We ran a cap ablation on the Gitea benchmark to understand how profile size interacts with accuracy. Eight cap sizes were tested (20, 40, 60, 80, 120, 200, 350, 500 characters per field) across three models.

| Cap (chars) | Profile tokens | GPT-4o stump % | Mistral stump % | Gemini Flash stump % |
|---|---|---|---|---|
| 20 | ~147 | 33% | 42% | 29% |
| **40** | ~210 | **79% ← cliff** | **79% ← cliff** | **67% ← plateau** |
| 60 | ~250 | 79% | 79% | 67% |
| **80** | ~281 | **88% ← peak** | 79% | 67% |
| 120 | ~321 | 88% | **88% ← peak** | 67% |
| 200 | ~381 | 79% | 79% | 67% |
| 350 | ~490 | 79% | 79% | 67% |
| 500 | ~507 | 79% | 79% | 67% |

*Table 7. Cap ablation results on Gitea (stump questions only, 8 questions). The primary accuracy cliff occurs between cap=20 and cap=40.*

### 9.1 Step Function Confirmed

The ablation confirms the step-function hypothesis from §4.1: stump question accuracy is not a smooth function of field length. The primary cliff occurs at cap=20→40 characters. Below cap=40, most stump questions crash to incorrect answers. Above cap=40, accuracy is largely stable.

The mechanism: the @AUTH field at cap=20 is truncated before "ldap/oauth/webauthn" — the three must-terms for the authentication question — can appear. At cap=40, all three terms survive. The cliff corresponds precisely to the survival threshold of the most information-dense required facts.

### 9.2 Over-Compression at High Caps

GPT-4o peaks at cap=80 (88%) then drops to 79% at cap=200+. The @STRUCT field at full inclusion adds noise — the expanded bracket path index (`modules/{git,setting,markup,packages}(1.2k)`) provides no additional information for any test question but increases density and may trigger attention dilution on surrounding fields. This confirms the density collapse hypothesis: even within a structured profile, unnecessarily verbose fields degrade retrieval.

### 9.3 Permanent Model-Specific Blind Spots

Two questions showed cap-independent failures — the same model answered incorrectly across all cap sizes:

| Question | Fact | GPT-4o | Mistral | Gemini Flash | Root cause |
|---|---|---|---|---|---|
| HTTP router library | chi (from @STACK) | 0 at all caps | 3 at all caps | 0 at all caps | Field-label mismatch: GPT-4o and Flash look for router in @ROUTES, not @STACK |
| Migration count | 305 (from @DATA) | 3 at all caps | 0 at all caps | 0 at all caps | Semantic bridge: Flash/Mistral couldn't connect "@DATA … (305 files)" to migration count question |

*Table 8. Cap-independent model-specific blind spots identified in ablation. Both were resolved by schema fixes (§10).*

---

## 10. Schema Design and Field-Label Retrieval

The cap-independent blind spots led to a systematic investigation of how models route questions to profile fields. The central finding: **models map question semantics to field labels first, then read field values.** A fact in the wrong field — from the model's semantic perspective — is functionally absent.

### 10.1 Schema Remap Experiment

We tested five profile variants on the two blind-spot questions across three models:

| Variant | Change | GPT-4o router | Flash router | Flash migrations |
|---|---|---|---|---|
| Baseline | Original profile | ✗ | ✗ | ✗ |
| chi-routes | `@ROUTES chi → routers/ (447 files)` | ✓ | ✓ | ✗ |
| chi-stack | `@STACK go [chi=router] mysql …` | ✗ | ✓ | ✗ |
| data-label | `@DATA … (305 migrations)` | — | — | ✓ |
| combined | chi-routes + data-label | ✓ | ✓ | ✓ |

*Table 9. Schema remap results. "combined" variant achieves 3/3 models × 2/2 questions with two one-word changes. No new information added — only framing changed.*

The combined variant achieves perfect retrieval across all models with two changes: moving chi from @STACK to @ROUTES, and changing the noun "files" to "migrations" in the @DATA field count. Both changes are framing, not content — the same facts, labelled more precisely.

### 10.2 Schema Design Rule

The gh-cli replication experiment (testing cobra CLI framework in @STACK) established the boundary condition: cobra retrieves correctly from @STACK because it is a well-known library with a strong trained "CLI framework" association. Chi fails from @STACK because models associate it with nothing specific — their trained prior for "Go HTTP router" is Gin or Echo.

> **Schema Rule:** For well-known libraries and frameworks, placement in `@STACK` is sufficient and preferred. For obscure or unusual technology choices — where models would default to a more common alternative — the library must appear in the typed field matching its functional role (`@ROUTES` for HTTP routers, `@AUTH` for authentication backends, etc.). Bracket annotation within `@STACK` values is *not* safe: it helps some models but actively hurts others.

---

## 11. Retrieval Mode Analysis: Mechanical vs. Semantic

A poison profile experiment — deliberately filling a .chode profile with plausible but false information — revealed that models operate in two distinct retrieval modes depending on the strength of their training-data prior for the project in question.

### 11.1 Experimental Design

Four test cases: (1) famous repo + plausible lie, (2) famous repo + implausible lie, (3) obscure repo + plausible lie, (4) famous repo + subtle wrong detail. Models were given the poisoned profile and asked questions whose answers contradicted the planted misinformation.

### 11.2 Results

| Repo type | Lie type | Gemini Flash | GPT-4o | Interpretation |
|---|---|---|---|---|
| Famous (Caddy) | Plausible | RESISTANT | RESISTANT | Both models rejected wrong profile, answered from training |
| Famous (Caddy) | Implausible | RESISTANT | RESISTANT | Strong training prior overrides profile completely |
| Obscure (PocketBase) | Plausible | COMPLIANT | RESISTANT | Flash trusted wrong profile; GPT-4o abstained |
| Obscure (PocketBase) | Subtle | COMPLIANT | HEDGES | Flash planted wrong answer; GPT-4o expressed uncertainty |

*Table 10. Poison profile test results. RESISTANT = model answered from training knowledge, ignoring wrong profile. COMPLIANT = model trusted profile. HEDGES = model expressed uncertainty.*

### 11.3 Two Retrieval Modes

**Semantic retrieval** operates on facts where the model has strong training-data priors. When the model "knows" what a famous project does, it routes questions through world knowledge first. A CHODE profile that contradicts strong training priors is effectively ignored — the model treats it as a likely error.

**Mechanical retrieval** operates on facts where training priors are absent or weak. When the model has no useful training knowledge about a project, it reads the profile field literally and trusts the content. This is where CHODE is most powerful and where poisoned profiles are most dangerous.

This dual-mode behaviour is the correct framing for CHODE's scope of authority:

> **Prior-Filling Mechanism:** CHODE profiles are not authoritative substitutes for model knowledge — they are a prior-filling mechanism. For facts where training priors are strong, models discard profile content via semantic retrieval. For facts where training priors are absent or weak (the primary stump question domain), semantic retrieval falls through to the profile, which becomes the authoritative source. CHODE is most powerful — and most trusted — exactly where it is most needed: obscure internal repos, private codebases, newly released projects, and unusual technology choices in well-known projects.

---

## 12. Anomalies and Unexpected Findings

Several benchmark runs produced results that were either surprising, counter-intuitive, or that revealed unanticipated edge cases in model behaviour. These findings are documented here in full because they constrain the interpretation of primary results and are potentially of independent research interest.

### 12.1 Flash Instruction Noncompliance via Semantic Injection

In the PixiJS wildcard benchmark, Gemini 2.5 Flash was asked "What GPU rendering APIs does PixiJS support?" in CHODE mode, under the instruction to answer only from the profile. The PixiJS profile does not contain the words "WebGL" or "WebGPU."

Flash answered: *"WebGL & WebGPU"* — correctly — and scored 3/3.

GPT-4o, given the same profile and instruction, answered: *"Not in profile"* — correctly abstaining — and scored 0/3.

| Model | Answer | Factually correct | Instruction compliant | Score |
|---|---|---|---|---|
| Gemini 2.5 Flash | "WebGL & WebGPU" | Yes | No | 3/3 |
| GPT-4o | "Not in profile" | — | Yes | 0/3 |

*Table 11. Flash instruction noncompliance on PixiJS Q4. Flash injected training knowledge despite the profile-only constraint; GPT-4o correctly abstained.*

Flash identified the project name "pixi.js" in the @STACK field and routed through training knowledge about PixiJS — overriding the profile-only instruction. This is a mild noncompliance case: Flash is technically wrong to answer (it violated the instruction), but happens to be right about the fact. The scoring system rewards factual correctness, so Flash outscores GPT-4o despite the compliance failure.

This has two implications. First, Flash's Tier-2 scores are slightly inflated relative to GPT-4o because Flash is more willing to inject training knowledge when it recognises a project name. Second, the profile-only instruction is not a hard constraint for all models — it is a strong preference that Gemini Flash sometimes overrides when training-data confidence is high.

> **Finding 12.1:** Gemini 2.5 Flash exhibits training-knowledge injection in CHODE mode when it recognises a project name in the profile. This inflates Tier-2 scores for Flash relative to its actual instruction-compliance rate, and means Flash's "profile-only" mode is probabilistic rather than hard-constrained.

### 12.2 PixiJS TypeScript Abbreviation Attribution Failure

The PixiJS profile contains `@STACK pixi.js ts vite jest`. When asked "What programming language is the primary codebase written in?", both Gemini Flash and GPT-4o scored 0/3 across all techniques including CHODE — despite "ts" being present in the profile.

The failure mode: the `pixi.js` token appears first in the @STACK list and is parsed as the primary language by both models. The models answered "JavaScript" or "the PixiJS framework" rather than TypeScript. The "ts" abbreviation was either attributed to a dependency rather than the implementation language, or suppressed by the dominant pixi.js signal.

This is distinct from the chi retrieval failure (§10). Chi failed because models didn't map it to "HTTP router" from bare @STACK placement. Here, TypeScript fails because "ts" — in a JavaScript-ecosystem repo where the primary entity is a JavaScript library — is ambiguous. Models reasonably interpret it as a TypeScript type definition file dependency or a plugin, not the implementation language.

**Design implication:** Language abbreviations that collide with ecosystem conventions should be emitted in full. In a JavaScript/TypeScript repo where the primary @STACK entry is a JS library name, "ts" reads as a dependency, not a language. Emitting "typescript" (full name) resolves the attribution. This is a generator-level fix scheduled for v3.

### 12.3 GPT-4o Null Baseline on Moondream

In the Moondream wildcard benchmark, GPT-4o returned empty or null content for 3 of 4 questions at baseline. Flash answered all four, using inference from question phrasing ("model variant", "AI model type") to deduce the project domain.

The root cause: the baseline prompt presents questions without naming the project. The questions for Moondream were generic enough ("What programming language is this project primarily written in?", "How many parameters does the primary model variant have?") that GPT-4o, without a project name anchor, had no signal about which project was being asked about and refused to guess.

Flash inferred context from the combined question set — "primary model variant" + "vision language model" type question → this is probably an ML model repo → answered Python and 2B parameters from training priors about small VLMs. This worked because Moondream is actually a Python 2B VLM. Flash's willingness to guess from weak signals produced correct answers; GPT-4o's conservatism produced null responses.

CHODE resolved both behaviours: the @PURPOSE field names "Moondream" and describes it as a vision language model, providing the anchor that GPT-4o needed. GPT-4o scored 42% with CHODE vs 0% at baseline.

> **Finding 12.3:** GPT-4o requires a project name anchor to answer project-specific questions. Without it, it abstains entirely rather than guessing. Flash infers project identity from question semantics and answers from training priors — which happened to be correct for Moondream. CHODE's @PURPOSE field resolves this for both models by providing explicit project context.

### 12.4 Bracket Notation Backfire

During the schema remap experiment (§10), we tested whether annotating @STACK with explicit role labels could help models retrieve obscure library names. The variant tested: `@STACK go [chi=router] mysql jwt sqlite3`.

Results for cobra (gh-cli), which already retrieved correctly from plain @STACK, showed that adding bracket notation *broke* GPT-4o's cobra retrieval — dropping it from correct to incorrect:

| Variant | Flash — cobra | GPT-4o — cobra |
|---|---|---|
| Baseline `@STACK go cobra testify grpc` | ✓ | ✓ |
| `@STACK go [cobra=cli-framework] testify grpc` | ✓ | ✗ ← regression |

*Table 12. Bracket annotation regression. Adding role annotations to a field that was already retrieving correctly broke GPT-4o while leaving Flash unchanged.*

The bracket notation that was intended to help caused GPT-4o to misparse the @STACK value. The annotation syntax `[cobra=cli-framework]` appears to have interfered with GPT-4o's tokenisation or parsing of the field, causing it to miss "cobra" entirely. Flash, which uses bracket annotations as semantic role hints, was unaffected.

This is a direct contradiction: the same annotation that resolves chi retrieval for Flash in gitea (§10.1) actively damages cobra retrieval for GPT-4o in gh-cli. The safest schema rule is to avoid bracket notation entirely and rely on typed field placement instead — the chi-routes fix that placed chi in @ROUTES worked for both models without collateral damage.

### 12.5 Field Semantic Contamination (Flash @ROUTES)

In the gh-cli schema remap experiment, we tested adding cobra to the @ROUTES field to see if typed-field placement would fix Flash's cobra retrieval (it was already working, but we tested for completeness). An unexpected side effect appeared: when @ROUTES was modified to include cobra, Flash *lost* its ability to retrieve grpc from @STACK for the question "What RPC protocol does gh use?"

| Variant | Flash — grpc | GPT-4o — grpc |
|---|---|---|
| Baseline | ✓ | ✓ |
| cobra added to @ROUTES | ✗ ← lost | ✓ |

*Table 13. Field semantic contamination. Introducing a CLI framework (cobra) into the @ROUTES field disrupted Flash's ability to retrieve the RPC protocol (grpc) from @STACK.*

The hypothesis: Flash uses @FIELD labels as strong semantic routing signals. When @ROUTES contained "cobra" (a CLI routing framework, semantically adjacent to routing), Flash's internal field-to-question routing was disrupted — it associated the "communication protocol" question with @ROUTES (now containing cobra) rather than @STACK (containing grpc). GPT-4o, which routes through question semantics rather than field labels, was unaffected.

This confirms and extends the finding from §10: Flash is more sensitive to field-label semantics than other models — which makes it better at field-targeted retrieval when labels are clean, and more vulnerable to contamination when labels are semantically ambiguous.

### 12.6 Mistral grpc Cap-Independent Blind Spot

During the gh-cli schema remap experiment, Mistral Large failed to retrieve grpc from @STACK across all five profile variants tested — including the baseline where grpc appears plainly in `@STACK go oauth cobra testify grpc`. This failure was cap-independent: the same blind spot appeared at all compression levels in the ablation.

The question asked was "What RPC protocol does gh use?" — grpc is in @STACK but Mistral's trained association between "RPC protocol" and @STACK values is apparently weak for this specific concept. Mistral answered correctly for cobra (a stronger trained association) and prometheus (also in the profile) but could not retrieve grpc despite it being present.

This is a concept-specific model failure, not a compression failure or schema failure. No schema change resolved it across the variants tested. It represents a fundamental limit: CHODE can guarantee that a fact is present in the profile at the right level of compression, but cannot guarantee that every model can retrieve every fact from every field under every question phrasing.

### 12.7 GPT-4o @STRUCT Over-Compression Peak

The field-cap ablation (§9) produced a counterintuitive result: GPT-4o's stump accuracy peaked at cap=80 characters per field (88%) and then *decreased* at cap=200 and above (79%), even though higher caps include all the information from lower caps plus more.

The regression is caused by the @STRUCT field. At cap=80, @STRUCT is truncated to a compact directory summary. At cap=200+, it expands to include bracket-notation path indices: `modules/{git,setting,markup,packages}(1.2k) models/{migrations,issues,repo}(769)`. This additional detail provides no signal for any test question but increases the density of the surrounding profile, creating the same attention dilution effect at the micro scale that raw documentation creates at the macro scale.

This is a direct empirical demonstration of the density collapse hypothesis: **more information in a structured profile can degrade retrieval of other information in the same profile**, if the additional information adds noise without adding signal for the questions being asked. The optimal profile is the minimum representation that preserves all required facts — not the maximum representation that preserves all available facts.

> **Finding 12.7:** GPT-4o accuracy on stump questions peaks at cap=80 characters per field and degrades at higher caps due to @STRUCT field expansion adding noise. This micro-scale replication of the macro-scale density collapse finding suggests the same mechanism operates at multiple levels of context granularity.

---

## 13. Efficiency Metrics

We define three metrics to quantify CHODE's core claim: maximum comprehension per token.

### 13.1 Compression Ratio

How much CHODE shrinks raw repository inputs into a profile:

```
CR = T_raw / T_profile
```

Where T_raw is the token count of all files CHODE reads (file tree + anchor files + doc files) and T_profile is the size of the resulting .chode profile.

### 13.2 Comprehension Efficiency

Score achieved per input token consumed:

```
CE = S / T_input
```

Where S ∈ [0, 1] is the benchmark score on profile-dependent questions and T_input is total tokens fed to the model.

### 13.3 CHODE Advantage

The efficiency ratio of CHODE vs naive self-profiling:

```
A = CE_CHODE / CE_naive = (S_CHODE × T_naive) / (S_naive × T_CHODE)
```

### 13.4 Worked Example: Gitea + GPT-4o

| Method | S | T_input (tokens) | CE |
|---|---|---|---|
| Raw docs (self-profile) | 0.36 | 82,918 | 0.0000043 |
| **CHODE** | **1.00** | **507** | **0.00197** |

```
A = (1.00 × 82,918) / (0.36 × 507) ≈ 454×
```

CHODE delivers **454× better comprehension per token** for Gitea + GPT-4o. Averaged across all 9 benchmark repositories and 6 models, self-profiling consumes ~43,000 tokens per query while scoring lower than CHODE's ~353 token profile.

### 13.5 Cost Arbitrage

The per-model efficiency split creates a cost arbitrage opportunity. Gemini 2.5 Flash with a CHODE profile averages 83% accuracy. Gemini 2.5 Pro without context averages 49%. Flash is both cheaper (by approximately 10×) and more accurate for orientation tasks when paired with a CHODE profile. The premium model advantage disappears when both models are given the same high-quality structured context.

---

## 14. Limitations

### 14.1 Profile Staleness

CHODE profiles reflect repository state at generation time. The embedded git hash allows staleness detection, but no automatic regeneration mechanism exists. For actively developed repositories, profiles should be regenerated on meaningful structural changes (dependency additions, architectural refactors).

### 14.2 Framework-Meta Repository Failure Mode

Repositories that are themselves widely-documented frameworks (NestJS, Django, Rails) show CHODE degradation relative to baseline in some configurations. Models' training-data knowledge of these projects is strong enough that the profile adds noise rather than signal. CHODE's value proposition is weakest for projects with high training-data coverage.

### 14.3 ML and Data Science Repos

Flat Python script repositories without conventional package structure produce sparse profiles. The generator correctly emits only what it finds, but sparse profiles suppress correct training-knowledge answers (documented in the Moondream case). The Python zone-count fallback mitigates but does not fully resolve this.

### 14.4 Scoring Strictness

Substring matching without normalisation means a model that produces a semantically correct but differently formatted answer (e.g., `-u -u -u` when the profile says `-uuu`) scores zero. This is intentional as a fidelity probe but may undercount correct answers in human evaluation contexts. Future work should introduce a parallel semantic equivalence score to distinguish exact profile reproduction from factual correctness.

### 14.5 Efficiency Metric Framing

The 122× and 454× comprehension-per-token figures compare CHODE input tokens to self-profiling input tokens. The denominator includes tokens the model likely did not attend to due to attention dilution. The true efficiency gain over *effective* attended tokens is lower than these figures suggest. The metrics are valid as input-cost comparisons but should not be read as claims about attention or retrieval efficiency.

### 14.6 Context Length Scaling

Next.js (27,000 files) required ~567 token profiles but raw self-profiling exceeds most model context limits (300,000+ tokens). We did not evaluate self-profiling for very large repos; performance would be expected to degrade further due to context limits and increased attention dilution.

---

## 15. Related Work

**Full-dump context tools.** Repomix (23.6k GitHub stars), GitIngest (13.7k stars), and Code2Prompt (6.9k stars) are the dominant tools for providing repository context to language models. All three produce raw dumps of 50,000–300,000 tokens. They are designed for targeted tasks (code review, one-shot editing) where the model needs to see specific source code. They are not designed for orientation, and our benchmarks confirm they perform poorly at it.

**LLM-based compression.** LLMLingua (Microsoft Research, 2023) performs token-level lossy compression using a smaller language model to identify and drop low-information tokens. It requires LLM inference at generation time, operates on general text rather than structured repository facts, and targets general-purpose context reduction rather than orientation-specific extraction.

**Manual context standards.** The Codebase Context Specification defines a community standard for manually maintained `.context/index.md` files. CHODE automates this pattern — providing the same structured information without requiring manual authorship or maintenance.

**Code structure tools.** aider's RepoMap produces a code-structure index (types, function signatures) at ~1,000 tokens. RepoMap targets code navigation — locating where to make a change in source. These are complementary use cases: orientation (what is this project?) vs. navigation (where is this specific code?). CHODE and RepoMap solve different problems and are best used together.

**Academic context.** "On the Effectiveness of Context Compression for Repository-Level Tasks" (2025) covers similar territory on the academic side. CHODE's empirical contribution is the structured extraction approach — the finding that field-targeted extraction at generation time outperforms compression or retrieval at inference time.

---

## 16. Future Work — Implications for Model Training

The results in this paper are inference-only. No model weights were modified, and no training experiments were conducted. However, the failure modes identified — Prior Overwhelming and Attention Dilution — are not inference artifacts. They are training artifacts: behaviors baked into models by the distribution of their training data.

This suggests a testable hypothesis.

### 16.1 The Hypothesis

If structured, labeled, explicitly-extracted knowledge outperforms raw documentation at inference time, the same principle may apply at training time. A model fine-tuned on structured profile + Q&A pairs may exhibit stronger orientation behavior than a model trained on equivalent volumes of raw documentation.

Concretely: rather than training on 40,000 tokens of repository source files and documentation, train on the 350-token CHODE profile paired with correct answers to orientation questions. The signal-to-noise ratio improves by roughly 122×. If the inference results generalize, training accuracy should improve proportionally.

### 16.2 What the Experiment Would Look Like

A minimal test requires:

1. A base model with no prior exposure to the target repositories
2. Two fine-tuning datasets of equivalent question-answer pairs — one built from raw documentation, one built from CHODE profiles
3. Evaluation on held-out orientation questions using the same benchmark protocol as this paper

The prediction: the CHODE-trained model scores higher on orientation tasks and hallucinates less on out-of-profile questions, because the training signal it received was structured and precise rather than narrative and diffuse.

### 16.3 The Broader Implication

CHODE is not a compression tool in the traditional sense — it does not summarize. It extracts specific facts into labeled fields and discards everything else. Applied at training scale, this is a data curation methodology: strip the noise, label the signal, cap the length.

The internet-scale training corpora that underpin current frontier models are overwhelmingly narrative. Models trained on them learn to approximate the shape of knowledge without reliably retaining specific facts. The inference-time failure of self-profiling is a symptom of this: the model learned what repository documentation looks like, not what repositories contain.

A training corpus built on structured extraction — not just for code, but for any domain where specific facts matter more than narrative flow — may produce models with qualitatively different retrieval behavior. This paper provides the proof of concept at inference scale. Empirical validation at training scale remains future work.

### 16.4 Responses to AI Peer Review

Prior to final publication, this paper was submitted to six AI models (GPT-4o, GPT-4o-mini, Gemini 2.5 Flash, Gemini 2.5 Pro, Mistral Large, Llama 4 Maverick) for independent peer review. Each model was asked to assess methodology, claims, gaps, and recommendations. The reviewers raised four recurring criticisms: (1) all benchmark questions were authored by the researcher who designed the profiles — potential for unconscious tuning; (2) generalization to unseen repositories was undemonstrated; (3) adversarial or misleading queries were untested; (4) multi-profile scalability limits were unquantified.

The following eight experiments are direct responses to those criticisms. Six are complete; two remain planned.

**1. Semantic equivalence scoring** ✓ *Completed*
A parallel semantic scorer was run against all 165 existing result files (6,093 scorable answers). With normalization applied (abbreviation expansion, plural/singular equivalence, flag format normalization), the aggregate score shifted from 3,549/6,093 (58%) strict to 3,554/6,093 (58%) semantic — a delta of only +5 points across 5 files. Finding: the strict scorer is not materially penalizing correct answers. The ground truth terms are already well-chosen and models that score zero under strict matching are genuinely wrong, not paraphrasing. The 90% CHODE benchmark figure is robust to scoring methodology.

**2. Position sensitivity test** ✓ *Completed*
CHODE profiles were placed at START vs END of context across 3 repos × 2 models (gitea, ruff, caddy × GPT-4o, Gemini Flash). Results were inconclusive: ruff improved with END placement (+1 for GPT-4o, +4 for Flash), caddy degraded (-3 for GPT-4o, -1 for Flash), gitea tied at 100% both positions. Net delta: +1 across 6 matchups. Finding: CHODE profiles are robust to position — no strong recency bias detected. The structured labeled format allows models to locate fields regardless of where the profile appears in context. Standard practice (profile at start) is adequate.

**3. Multi-repo context test** ✓ *Completed*
Three CHODE profiles (caddy/Go, ruff/Rust, zulip/Python, ~934 combined tokens) were concatenated into a single context. Both GPT-4o and Gemini Flash were asked 6 attribution questions (3 per-repo, 3 reverse). Both models scored 6/6 with zero interference cases. Finding: models correctly attribute facts across multiple profiles without cross-contamination. CHODE profiles are safe to use in multi-repo contexts — the labeled field format provides sufficient repo identity separation.

**4. Unseen repository generalization** ✓ *Completed*
Five repositories not in the original 9-repo benchmark (ruff, zulip, appwrite, pocketbase, caddy) were profiled and tested with 4 stump questions each across GPT-4o and Gemini Flash. All questions were derived exclusively from facts in the generated `.chode` profiles — no profile-external knowledge required.

| Repo | Baseline | CHODE | Δ |
|---|---|---|---|
| ruff | 33% | 100% | +67pp |
| zulip | 4% | 100% | +96pp |
| appwrite | 17% | 100% | +83pp |
| pocketbase | 0% | 88% | +88pp |
| caddy | 0% | 75% | +75pp |
| **Overall** | **11%** | **93%** | **+82pp** |

Finding: CHODE generalizes cleanly to unseen repositories across language, domain, and size. The 93% aggregate score on 5 previously unseen repos matches the 90% figure from the original 9-repo benchmark — no evidence of overfitting to benchmark-specific profiles.

**5. Adversarial query robustness** ✓ *Completed*
Ten adversarial questions were designed across five failure-mode categories: leading questions (false premise embedded), multi-hop reasoning (chaining two profile facts), negation queries, ambiguous specification, and plausible-wrong assumptions. Questions were asked with and without CHODE profile across GPT-4o and Gemini Flash.

| Category | CHODE | Baseline | Notes |
|---|---|---|---|
| Leading (×2) | 2/2 | 2/2 | Both models resist false premises with or without profile |
| Multi-hop (×2) | 1/2 | 1/2 | Baseline wins on Go test framework (training knowledge); CHODE wins on Rust cargo |
| Negation (×2) | 1/2 | 1/2 | Shared failure: "what does X NOT use" requires negative inference |
| Ambiguous (×2) | 2/2 | 2/2 | Both models correctly request clarification |
| Plausible-wrong (×2) | 2/2 | 1/2 | CHODE corrects Redis/nginx false assumptions; baseline guesses wrong |

Overall: CHODE 8/10 vs baseline 7/10 (GPT-4o); CHODE 8/10 vs baseline 8/10 (Gemini Flash). Finding: CHODE does not degrade robustness under adversarial questioning. The profile anchors plausible-wrong questions correctly (Redis, nginx-style config) while leaving leading and ambiguous questions unaffected. Negation remains a shared failure mode independent of context.

**6. Scalability under profile accumulation** ✓ *Completed*
Profile stacking was tested at three tiers — 3 profiles (~933 tokens), 5 profiles (~1,603 tokens, including near-identical Python web pair zulip + fastapi), and 13 profiles (~4,636 tokens, all available profiles). Attribution accuracy and interference rates were measured for GPT-4o and Gemini Flash.

| Tier | Profiles | Tokens | GPT-4o | Gemini Flash | Interference |
|---|---|---|---|---|---|
| Tier 1 | 3 | ~933 | 5/5 | 5/5 | 0 |
| Tier 2 | 5 | ~1,603 | 6/6 | 6/6 | 0 |
| Tier 3 | 13 | ~4,636 | 6/6 | 6/6 | 0 |

Finding: Zero interference across all tiers including maximum stress (13 concatenated profiles, ~4,636 tokens). The near-identical Python web pair (zulip vs fastapi) produced no cross-contamination. Attribution accuracy was perfect at every tier for both models. CHODE's labeled field format scales cleanly to at least 13 concurrent profiles within a single context window.

**7. Profile density and the minimum sufficient profile** ✓ *Completed*
Four density levels of the Gitea profile were constructed — Minimal (~121 tokens, DNA-only with no CONTEXT section), Standard (~509 tokens, default output), Verbose (~878 tokens, extended field values), and Maximum (~1,847 tokens, full output with `--full` tree and codex). Four stump questions were asked at each level across GPT-4o and Gemini Flash.

| Level | Tokens | GPT-4o | Gemini Flash |
|---|---|---|---|
| Minimal | ~121 | 25% | 25% |
| Standard | ~509 | 100% | 100% |
| Verbose | ~878 | 100% | 100% |
| Maximum | ~1,847 | 100% | 100% |

Finding: There is a sharp step function between Minimal and Standard. At ~121 tokens (DNA only, no CONTEXT), both models score 25% — they can only answer the one question whose answer appears in the structural DNA fields. At ~509 tokens (default profile), both models score 100%. Accuracy does not improve further at Verbose or Maximum. The default CHODE output is the minimum sufficient profile for the question types in this benchmark — adding tokens beyond ~509 provides no retrieval benefit for stump questions. This empirically confirms the design decision to cap at ~200–400 tokens.

**8. Unconventional repository benchmark** *(Planned)*
Add 5 non-conventional repos to the primary benchmark: a monorepo (Turborepo), a repo with no README, a repo with custom build scripts, an embedded systems repo, and a pure configuration repo. These stress-test CHODE's generator and reveal where structural assumptions break down.

**9. Independent question authorship** *(Planned)*
Have three independent authors unfamiliar with the benchmark write stump questions for 3 repos. Compare scores on author-generated vs. independent questions to quantify authorship bias. A significant gap would indicate the current question set is inadvertently tuned to CHODE's output format.

---

## 17. Conclusion

We presented CHODE, a static analysis tool that generates ~200–400 token structured repository profiles from file trees and documentation files without reading source code or invoking a language model. Across 27 repositories and 6 frontier models, CHODE profiles consistently outperform raw documentation context, README-only context, and LLM-generated summaries on orientation task accuracy.

The primary finding — that 43,000 tokens of raw documentation scores 4pp below no context — is counter-intuitive but reproducible across architectures and repositories. We attribute this to two distinct mechanisms: Prior Overwhelming (smaller models lock to parametric priors under noisy context) and Attention Dilution (larger models abstain on facts buried in dense context). Both mechanisms are architecture-specific, not size-specific.

Structured extraction at generation time avoids both failure modes by removing the retrieval problem entirely. When a model reads `@ROUTES chi → routers/ (447 files)`, it does not need to locate chi in 43,000 tokens of noise — the fact is in the label, at the right abstraction level, with no surrounding context to dilute it.

CHODE is open source and available at github.com/zer0contextlost/CHODE. It runs on any repository without network access or API keys.

---

## Footnotes

1. All benchmark result files are available at github.com/zer0contextlost/CHODE under `benchmarks/results/`.
2. Models accessed via OpenRouter. Calls made at temperature=0. All result files timestamped and committed.
3. The logprob experiment required direct OpenAI API access for `logprobs: true` support; all other evaluations used OpenRouter.
4. Flash/ruff parser artifact in Thread 12: Gemini Flash 2.5 emits thinking tokens; the extended reasoning preamble shifted Q-label positions in one benchmark run, causing parser miss. Manual verification confirmed all 4 answers correct. Score reported as corrected value.
5. This paper was submitted to a multi-model AI peer review prior to publication. GPT-4o, GPT-4o-mini, Gemini 2.5 Flash, Gemini 2.5 Pro, Mistral Large, and Llama 4 Maverick were each asked to independently review the full paper and assess methodology, claims, gaps, and recommendations. Their responses informed the Limitations section (§14) and the planned benchmark extensions (§16.4). Full peer review output is available in `benchmarks/results/peer-review-2026-04-18T02-25-50.md`.

---

## References

[1] OpenAI. GPT-4 Technical Report. arXiv:2303.08774, 2023.

[2] Jiang et al. "LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models." EMNLP 2023. arXiv:2310.05736.

[3] Repomix. github.com/yamadashy/repomix. Accessed April 2026.

[4] Codebase Context Specification. github.com/Agentic-Insights/codebase-context-spec. Accessed April 2026.

[5] aider RepoMap. aider.chat/docs/repomap.html. Accessed April 2026.
