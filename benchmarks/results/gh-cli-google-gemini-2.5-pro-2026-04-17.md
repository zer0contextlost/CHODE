# CHODE Benchmark — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** gh-cli
**Profile size:** ~451 tokens
**Questions parsed:** 12/12 (missing: Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30)
**Auto-scored:** 12/12 questions → 32/36 (89% of auto-scorable)
**Stump questions (8):** 22/24 (92% — answers require reading profile)
**Manual scoring needed:** 0 questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each `__(manual)_` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | go | 3 _(auto)_ |
| Q2 | CLI framework | Objective | cobra | 3 _(auto)_ |
| Q3 | gRPC usage | Objective | Yes, it is listed in the `@STACK` line. | 1 _(auto)_ |
| Q4 | Test command | Objective | make test | 3 _(auto)_ |
| Q5 | Entry point | Navigational | cmd/gen-docs/main.go | 3 _(auto)_ |
| Q6 | Largest package | Navigational | The `pkg` package, with 688 files. | 3 _(auto)_ |
| Q7 | Comment convention | Domain | godoc comments | 3 _(auto)_ |
| Q8 | Banned punctuation | Domain | The em dash (—). | 3 _(auto)_ |
| Q9 | Acceptance test type | Domain | blackbox* tests | 3 _(auto)_ |
| Q10 | Test framework | Domain | The `go-internal/testscript` package. | 3 _(auto)_ |
| Q11 | CI system | Objective | github-actions | 3 _(auto)_ |
| Q12 | Primary purpose | Objective | `gh` is GitHub on command line. | 1 _(auto)_ |

**Total: __/36** _(fill in manual scores above, add to auto total of 32)_

---

## Raw Model Response

```
Q1:
go

Q2:
cobra

Q3:
Yes, it is listed in the `@STACK` line.

Q4:
make test

Q5:
cmd/gen-docs/main.go

Q6:
The `pkg` package, with 688 files.

Q7:
godoc comments

Q8:
The em dash (—).

Q9:
blackbox* tests

Q10:
The `go-internal/testscript` package.

Q11:
github-actions

Q12:
`gh` is GitHub on command line.
```
