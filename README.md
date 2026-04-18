# CHODE

> *"I fully understand that what I know is based on what I didn't understand."*

**Compressed Hierarchical Overview of Directory and Ecosystems**

A CLI tool that generates a compressed, token-efficient profile of any software repository — giving AI assistants maximum repo comprehension for minimum context cost.

```
chode /path/to/repo
```

Produces a `.chode` file (~200–400 tokens) containing everything an AI needs to understand a codebase: stack, structure, entry points, architecture, conventions, and purpose — extracted from the repo itself in under a second.

---

## Why

When you drop a codebase into an AI assistant, you have two bad options:

1. **Paste raw files** — expensive, slow, hits context limits, buries the signal in noise
2. **Describe it yourself** — tedious, inconsistent, misses things

CHODE is option 3: a pre-computed, standardized repo fingerprint that loads instantly and tells the model exactly what it needs to know.

---

## Sample Output

```
---CHODE v2 @ a3f9c12---

---DNA---
@STACK go chi mysql jwt sqlite3
@FRONTEND ts vue esbuild vite (web_src/)
@CI github-actions
@PKG pnpm gomod uv
@TEST playwright vitest make test
@CONFIG ini
@ENTRY main.go
@ROUTES chi → routers/ (447 files)
@DATA models/migrations/ (305 migrations)
@AUTH openid pam password webauthn ldap oauth
@API azure aws minio prometheus
@ARCH layered(cmd→routes→svc→mdl)
@PACKAGES modules/(968) models/(649) services/(479) routers/(445)
@STRUCT modules/{git,setting,markup,packages}(1.2k) models/{migrations,issues,repo}(769)

---CONTEXT---
@PURPOSE easiest, fastest, most painless way of setting up self-hosted Git service. Written in Go, works across all platforms and architectures...
@CONVENTIONS Always run `make fmt` before committing to conform to Gitea's styleguide.
@TESTING Run `make lint` before submitting. Test commands: make test | make test-backend | make test-frontend
```

*Gitea — 6,900 files → 507 tokens in 0.2s*

The header embeds the git commit hash at generation time. Check staleness with:
```bash
git rev-list <hash>..HEAD --count
```

---

## Benchmark

CHODE profiles were tested against 9 real-world repos × 6 models (Mistral Large, Gemini 2.5 Pro/Flash, GPT-4o/mini, Llama 4 Maverick) using 12 profile-dependent questions per repo.

| Mode | Avg score | Avg input tokens |
|---|---|---|
| Baseline (training knowledge only) | 44% | ~300 |
| Self-profile (model reads raw docs) | 40% | ~43,000 |
| **CHODE** | **90%** | **~353** |

**CHODE scores 90% using 122× fewer tokens than self-profiling — and self-profiling scores *lower* than baseline.** Models given 40k+ tokens of raw files still miss the specific structural facts that CHODE explicitly extracts. For large repos like Next.js (27k files), self-profiling requires 300k+ tokens and exceeds most model context limits entirely.

### By repo

| Repo | Baseline | CHODE | Delta | Profile size |
|---|---|---|---|---|
| gitea | 20% | 97% | +77pp | ~507 tok |
| rails | 38% | 93% | +55pp | ~548 tok |
| gh-cli | 39% | 94% | +55pp | ~451 tok |
| laravel | 39% | 88% | +49pp | ~237 tok |
| next.js | 24% | 77% | +53pp | ~567 tok |
| fastapi | 44% | 87% | +43pp | ~211 tok |
| django | 47% | 85% | +38pp | ~160 tok |
| ripgrep | 75% | 97% | +22pp | ~189 tok |
| phoenix | 69% | 86% | +17pp | ~306 tok |

### Cross-domain generalization

Tested across 18 additional repos spanning Go, Rust, Python, TypeScript, Java, Kotlin, PHP, and C++ — browsers, chat apps, linters, web servers, AI models, graphics engines. Questions split into two tiers:

| Tier | What it tests | Baseline | CHODE |
|---|---|---|---|
| Tier 1 — facts in the profile | Profile retrieval accuracy | 22% | **100%** |
| Tier 2 — facts not in the profile | Hallucination resistance | 48% | 17%\* |

\*Models correctly say "Not in profile" for Tier 2 — the right behavior. Baseline gets 48% by guessing from training knowledge; CHODE gets 17% because it instructs the model to answer only from the profile, which doesn't contain those facts.

Full benchmark data in [`benchmarks/results/`](benchmarks/results/).

### Technique comparison

Four strategies for giving an AI model context about a repo — same questions, same repos, same models:

| Technique | Score | Avg tokens | Notes |
|---|---|---|---|
| Baseline (no context) | 14% | ~300 | Training knowledge only |
| README-only | 18% | ~2,956 | 7× more tokens, still fails |
| LLM summary | 25% | ~437 | Requires 2 API calls; summarization discards specific facts |
| **CHODE** | **90%** | **~406** | Structured profile, offline, no LLM |

README-only fails because READMEs are marketing copy — the entry point, router library, auth backends, and package managers live in config files and CONTRIBUTING.md, not the README. LLM summarization is lossy in exactly the wrong way: it keeps the narrative and drops the specific names. CHODE wins because it reads the right files and asks the right questions at extraction time.

---

## Efficiency Metrics

CHODE's core claim is **maximum input-cost efficiency per orientation task**. We quantify this with three metrics.

### Compression Ratio

How much CHODE shrinks raw repository inputs into a profile:

$$CR = \frac{T_{raw}}{T_{profile}}$$

Where $T_{raw}$ is the token count of all files CHODE reads (file tree + anchor files + doc files) and $T_{profile}$ is the size of the resulting `.chode` profile.

### Input-Cost Efficiency

Score achieved per input token consumed:

$$CE = \frac{S}{T_{input}}$$

Where $S \in [0, 1]$ is the benchmark score on profile-dependent questions and $T_{input}$ is total tokens fed to the model.

### CHODE Advantage

The efficiency ratio of CHODE vs naive self-profiling (feeding raw docs to the model directly):

$$A = \frac{CE_{CHODE}}{CE_{naive}} = \frac{S_{CHODE} \cdot T_{naive}}{S_{naive} \cdot T_{CHODE}}$$

### Worked example — Gitea + GPT-4o

| | $S$ | $T_{input}$ | $CE$ |
|---|---|---|---|
| Naive (raw docs) | 0.36 | 82,918 tok | 0.0000043 |
| **CHODE** | **1.00** | **507 tok** | **0.00197** |

$$A = \frac{1.00 \times 82{,}918}{0.36 \times 507} \approx \mathbf{454\times}$$

CHODE delivers **454× better input-cost efficiency** for this repo — meaning 454× more accuracy per input token paid. (Note: this compares input token counts. Due to attention dilution, the model likely didn't attend to most of the 82,918 raw-doc tokens — the true attended-token efficiency gain is higher still.) Averaged across all 9 benchmark repos and 6 models, self-profiling consumes ~43,000 tokens per query while scoring *lower* than CHODE's ~353 token profile — because models get overwhelmed by raw file dumps and still miss the specific facts CHODE explicitly extracts.

---

## Install

```bash
git clone https://github.com/zer0contextlost/CHODE
cd CHODE
npm install
npm install -g .
```

Then use `chode` from anywhere:

```bash
chode /path/to/repo
```

---

## Usage

```bash
# Profile a repo (writes .chode to repo root)
chode /path/to/repo

# Check if existing .chode is still accurate (exit 0 = clean, exit 1 = drift)
chode /path/to/repo --verify

# Force regeneration even if nothing changed
chode /path/to/repo --force

# Include full file tree and codex (larger profile, more detail)
chode /path/to/repo --full

# Auto-commit .chode after generation
chode /path/to/repo --commit

# Output to stdout instead of writing a file
chode /path/to/repo --stdout
```

Then pass the `.chode` content to any AI:

```
Here is the repo profile:
[paste .chode contents]

Question: Where would I add a new API endpoint?
```

---

## How it works

CHODE reads two categories of files:

**Structural (DNA section)** — no content read, just filenames and paths:
- File tree → `@PACKAGES`, `@STRUCT` (top directories by file count)
- Anchor files (`package.json`, `go.mod`, `Cargo.toml`, etc.) → `@STACK`, `@PKG`, `@TEST`

**Semantic (CONTEXT section)** — doc files only (`README.md`, `CONTRIBUTING.md`, etc.):
- Section headings mapped to fields: `@PURPOSE`, `@SETUP`, `@CONVENTIONS`, `@TESTING`, `@ENV`
- Caveman compression removes filler words, markdown noise, boilerplate phrases
- Hard cap of 350 chars per field keeps the profile lean

No source code is read. No LLM is invoked during generation. It runs entirely offline.

---

## Trust & Security

**Staleness** is the primary risk. Profiles don't auto-update — they reflect the repo at generation time. The git commit hash in the header lets you detect drift:

```bash
git rev-list $(head -1 .chode | grep -o '[a-f0-9]\{7\}')..HEAD --count
```

**Prompt injection** — CHODE sanitizes all README and doc content before writing context fields, stripping lines that match injection patterns (`ignore previous instructions`, `act as`, etc.). A poisoned README cannot embed instructions into a generated profile.

**Profile authority** — CHODE profiles are a *prior-filling mechanism*, not an authority override. Benchmark testing shows that for well-known projects, AI models route semantic questions through training knowledge and will ignore a wrong profile value rather than assert a contradiction. For obscure repos with no training data, models trust the profile fully. This means CHODE is most powerful — and most trusted — exactly where it's most needed.

---

## Format

```
---CHODE v2---

---DNA---
@STACK    primary languages and frameworks
@FRONTEND frontend stack and asset location
@CI       CI system
@PKG      package managers
@TEST     test frameworks and commands
@CONFIG   configuration format
@ENTRY    main entry point file
@ROUTES   HTTP routes location and file count
@DATA     database migrations / schema location
@ENTITIES domain model directory structure
@AUTH     authentication methods
@API      external service integrations
@ARCH     architectural pattern
@PACKAGES top packages by file count
@STRUCT   directory tree summary

---CONTEXT---
@PURPOSE  what the project does
@SETUP    how to install and run
@CONVENTIONS coding style and commit rules
@TESTING  how to run tests
@ENV      environment variables
@DEPLOY   deployment notes
@GOTCHAS  known issues and caveats
```

---

## Supported languages

TypeScript · JavaScript · Go · Rust · Python · Ruby · PHP · Java · Kotlin · Elixir · C/C++ · C# · Dart · Scala · Swift · YAML · JSON · Markdown

---

## Development

```bash
git clone https://github.com/zer0contextlost/CHODE
npm install
node --experimental-strip-types src/index.ts /path/to/repo
```

Run benchmarks:

```bash
# CHODE mode
node --experimental-strip-types benchmarks/benchmark.ts \
  --provider openrouter --model openai/gpt-4o --key $OPENROUTER_API_KEY \
  --chode benchmarks/gitea/.chode

# Baseline mode (no profile)
node --experimental-strip-types benchmarks/benchmark.ts \
  --provider openrouter --model openai/gpt-4o --key $OPENROUTER_API_KEY \
  --chode benchmarks/gitea/.chode --baseline
```

---

## License

MIT

## Inspiration

Inspired by [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee.

Shoutout to the Twitch streamers who kept me company and inspired me to build in public, follow my instincts, learn the systems, and question everything: [ThePrimeagen](https://twitch.tv/ThePrimeagen), [AdamLearnsLive](https://twitch.tv/AdamLearnsLive), [midnight_simon](https://twitch.tv/midnight_simon), and [CohhCarnage](https://twitch.tv/CohhCarnage).
