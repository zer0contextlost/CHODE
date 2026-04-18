# Contributing to CHODE

Thanks for your interest. CHODE is a small, focused tool — contributions that keep it simple are more welcome than contributions that expand scope.

## What's in scope

- Bug fixes in the generator (`src/`)
- New field extractors that follow the existing DNA/CONTEXT schema
- Benchmark additions (new repos, new models, new question types)
- Documentation improvements

## What's out of scope

- Adding LLM calls to the generator (CHODE must remain offline and zero-API)
- Changing the output format in ways that break existing `.chode` consumers
- Features that require network access at generation time

## Getting started

```bash
git clone https://github.com/zer0contextlost/CHODE
cd CHODE
npm install
npm run build
```

Run against any repo:
```bash
node dist/index.js /path/to/repo
```

Run the test suite:
```bash
npm test
```

## Submitting changes

- Open an issue first for anything non-trivial
- Keep PRs focused — one thing per PR
- If you're adding a new extractor, include at least one benchmark result showing it improves retrieval

## Benchmark contributions

New benchmark scripts go in `benchmarks/`. Results go in `benchmarks/results/` with a timestamp in the filename. See existing scripts for the pattern.
