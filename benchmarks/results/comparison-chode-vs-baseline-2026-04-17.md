# CHODE Benchmark — CHODE vs Baseline Comparison
**Date:** 2026-04-17  |  **Repos:** 9  |  **Models:** 6  |  **Questions:** 12 per repo (profile-dependent stump questions)

> All scores are auto-scored. Each question is scored 0-3; 36/36 = 100%.
> Baseline = model answers from training knowledge only (no profile).
> CHODE = model answers with ~160–570 token compressed profile.

## Summary

| | Baseline | CHODE | Delta |
|---|---|---|---|
| **All repos/models** | 854/1944 (44%) | 1741/1944 (90%) | +46pp |

## gitea

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 11/36 (31%) | 36/36 (100%) | +69pp | ~507 tok |
| gemini-pro | 7/36 (19%) | 36/36 (100%) | +81pp | ~507 tok |
| gemini-flash | 5/36 (14%) | 30/36 (83%) | +69pp | ~507 tok |
| gpt-4o | 9/36 (25%) | 36/36 (100%) | +75pp | ~507 tok |
| gpt-4o-mini | 7/36 (19%) | 36/36 (100%) | +81pp | ~507 tok |
| llama-maverick | 5/36 (14%) | 36/36 (100%) | +86pp | ~507 tok |

## fastapi

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 18/36 (50%) | 30/36 (83%) | +33pp | ~211 tok |
| gemini-pro | 21/36 (58%) | 33/36 (92%) | +34pp | ~211 tok |
| gemini-flash | 15/36 (42%) | 32/36 (89%) | +47pp | ~211 tok |
| gpt-4o | 14/36 (39%) | 27/36 (75%) | +36pp | ~211 tok |
| gpt-4o-mini | 15/36 (42%) | 33/36 (92%) | +50pp | ~211 tok |
| llama-maverick | 12/36 (33%) | 32/36 (89%) | +56pp | ~211 tok |

## rails

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 2/36 (6%) | 35/36 (97%) | +91pp | ~548 tok |
| gemini-pro | 17/36 (47%) | 35/36 (97%) | +50pp | ~548 tok |
| gemini-flash | 17/36 (47%) | 32/36 (89%) | +42pp | ~548 tok |
| gpt-4o | 17/36 (47%) | 32/36 (89%) | +42pp | ~548 tok |
| gpt-4o-mini | 12/36 (33%) | 33/36 (92%) | +59pp | ~548 tok |
| llama-maverick | 17/36 (47%) | 35/36 (97%) | +50pp | ~548 tok |

## nextjs

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 4/36 (11%) | 26/36 (72%) | +61pp | ~567 tok |
| gemini-pro | 13/36 (36%) | 28/36 (78%) | +42pp | ~567 tok |
| gemini-flash | 11/36 (31%) | 28/36 (78%) | +47pp | ~567 tok |
| gpt-4o | 0/36 (0%) | 30/36 (83%) | +83pp | ~567 tok |
| gpt-4o-mini | 10/36 (28%) | 27/36 (75%) | +47pp | ~567 tok |
| llama-maverick | 14/36 (39%) | 28/36 (78%) | +39pp | ~567 tok |

## django

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 20/36 (56%) | 30/36 (83%) | +27pp | ~160 tok |
| gemini-pro | 14/36 (39%) | 33/36 (92%) | +53pp | ~160 tok |
| gemini-flash | 21/36 (58%) | 32/36 (89%) | +31pp | ~160 tok |
| gpt-4o | 14/36 (39%) | 33/36 (92%) | +53pp | ~160 tok |
| gpt-4o-mini | 16/36 (44%) | 29/36 (81%) | +37pp | ~160 tok |
| llama-maverick | 17/36 (47%) | 27/36 (75%) | +28pp | ~160 tok |

## laravel

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 19/36 (53%) | 32/36 (89%) | +36pp | ~237 tok |
| gemini-pro | 23/36 (64%) | 32/36 (89%) | +25pp | ~237 tok |
| gemini-flash | 13/36 (36%) | 31/36 (86%) | +50pp | ~237 tok |
| gpt-4o | 10/36 (28%) | 32/36 (89%) | +61pp | ~237 tok |
| gpt-4o-mini | 10/36 (28%) | 32/36 (89%) | +61pp | ~237 tok |
| llama-maverick | 10/36 (28%) | 32/36 (89%) | +61pp | ~237 tok |

## phoenix

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 30/36 (83%) | 32/36 (89%) | +6pp | ~306 tok |
| gemini-pro | 29/36 (81%) | 32/36 (89%) | +8pp | ~306 tok |
| gemini-flash | 23/36 (64%) | 30/36 (83%) | +19pp | ~306 tok |
| gpt-4o | 25/36 (69%) | 33/36 (92%) | +23pp | ~306 tok |
| gpt-4o-mini | 19/36 (53%) | 30/36 (83%) | +30pp | ~306 tok |
| llama-maverick | 23/36 (64%) | 30/36 (83%) | +19pp | ~306 tok |

## ripgrep

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 29/36 (81%) | 35/36 (97%) | +16pp | ~189 tok |
| gemini-pro | 28/36 (78%) | 35/36 (97%) | +19pp | ~189 tok |
| gemini-flash | 30/36 (83%) | 35/36 (97%) | +14pp | ~189 tok |
| gpt-4o | 25/36 (69%) | 36/36 (100%) | +31pp | ~189 tok |
| gpt-4o-mini | 23/36 (64%) | 35/36 (97%) | +33pp | ~189 tok |
| llama-maverick | 26/36 (72%) | 35/36 (97%) | +25pp | ~189 tok |

## gh-cli

| Model | Baseline | CHODE | Δ | Profile tokens |
|---|---|---|---|---|
| mistral-large | 19/36 (53%) | 34/36 (94%) | +41pp | ~451 tok |
| gemini-pro | 8/36 (22%) | 32/36 (89%) | +67pp | ~451 tok |
| gemini-flash | 16/36 (44%) | 34/36 (94%) | +50pp | ~451 tok |
| gpt-4o | 12/36 (33%) | 34/36 (94%) | +61pp | ~451 tok |
| gpt-4o-mini | 13/36 (36%) | 34/36 (94%) | +58pp | ~451 tok |
| llama-maverick | 16/36 (44%) | 34/36 (94%) | +50pp | ~451 tok |

