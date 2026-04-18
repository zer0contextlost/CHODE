# CHODE Benchmark — Full Three-Way Comparison
**Date:** 2026-04-17  |  **Repos:** 9  |  **Models:** 6  |  **Modes:** baseline / CHODE / self-profile

> **Baseline:** model answers from training knowledge only (no profile, no repo name given)
> **CHODE:** model answers with pre-computed ~160–570 token compressed profile
> **Self-profile:** model reads raw repo files (file tree + docs + manifests), builds its own profile, then answers

## gitea

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 11/36 (31%) | 36/36 (100%) | 16/36 (44%) | ~507 tok | 94,505 tok |
| gemini-pro | 7/36 (19%) | 36/36 (100%) | 13/36 (36%) | ~507 tok | 110,150 tok |
| gemini-flash | 5/36 (14%) | 30/36 (83%) | 12/36 (33%) | ~507 tok | 110,150 tok |
| gpt-4o | 9/36 (25%) | 36/36 (100%) | 13/36 (36%) | ~507 tok | 82,918 tok |
| gpt-4o-mini | 7/36 (19%) | 36/36 (100%) | 10/36 (28%) | ~507 tok | 82,918 tok |
| llama-maverick | 5/36 (14%) | 36/36 (100%) | 14/36 (39%) | ~507 tok | 80,364 tok |

## fastapi

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 18/36 (50%) | 30/36 (83%) | 22/36 (61%) | ~211 tok | 41,016 tok |
| gemini-pro | 21/36 (58%) | 33/36 (92%) | 29/36 (81%) | ~211 tok | 53,528 tok |
| gemini-flash | 15/36 (42%) | 32/36 (89%) | 23/36 (64%) | ~211 tok | 53,529 tok |
| gpt-4o | 14/36 (39%) | 27/36 (75%) | 10/36 (28%) | ~211 tok | 36,216 tok |
| gpt-4o-mini | 15/36 (42%) | 33/36 (92%) | 7/36 (19%) | ~211 tok | 36,216 tok |
| llama-maverick | 12/36 (33%) | 32/36 (89%) | 19/36 (53%) | ~211 tok | 34,896 tok |

## rails

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 2/36 (6%) | 35/36 (97%) | 16/36 (44%) | ~548 tok | 88,094 tok |
| gemini-pro | 17/36 (47%) | 35/36 (97%) | 12/36 (33%) | ~548 tok | 104,065 tok |
| gemini-flash | 17/36 (47%) | 32/36 (89%) | 26/36 (72%) | ~548 tok | 104,065 tok |
| gpt-4o | 17/36 (47%) | 32/36 (89%) | 10/36 (28%) | ~548 tok | 80,532 tok |
| gpt-4o-mini | 12/36 (33%) | 33/36 (92%) | 5/36 (14%) | ~548 tok | 80,532 tok |
| llama-maverick | 17/36 (47%) | 35/36 (97%) | 6/36 (17%) | ~548 tok | 79,024 tok |

## nextjs

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 4/36 (11%) | 26/36 (72%) | 6/36 (17%) | ~567 tok | 53,261 tok |
| gemini-pro | 13/36 (36%) | 28/36 (78%) | 10/36 (28%) | ~567 tok | 64,143 tok |
| gemini-flash | 11/36 (31%) | 28/36 (78%) | 9/36 (25%) | ~567 tok | 64,143 tok |
| gpt-4o | 0/36 (0%) | 30/36 (83%) | 6/36 (17%) | ~567 tok | 49,390 tok |
| gpt-4o-mini | 10/36 (28%) | 27/36 (75%) | 8/36 (22%) | ~567 tok | 49,390 tok |
| llama-maverick | 14/36 (39%) | 28/36 (78%) | 6/36 (17%) | ~567 tok | 45,763 tok |

## django

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 20/36 (56%) | 30/36 (83%) | 12/36 (33%) | ~160 tok | 53,252 tok |
| gemini-pro | 14/36 (39%) | 33/36 (92%) | 14/36 (39%) | ~160 tok | 59,751 tok |
| gemini-flash | 21/36 (58%) | 32/36 (89%) | 12/36 (33%) | ~160 tok | 59,751 tok |
| gpt-4o | 14/36 (39%) | 33/36 (92%) | 7/36 (19%) | ~160 tok | 45,928 tok |
| gpt-4o-mini | 16/36 (44%) | 29/36 (81%) | 11/36 (31%) | ~160 tok | 45,928 tok |
| llama-maverick | 17/36 (47%) | 27/36 (75%) | 13/36 (36%) | ~160 tok | 42,578 tok |

## laravel

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 19/36 (53%) | 32/36 (89%) | 18/36 (50%) | ~237 tok | 4,692 tok |
| gemini-pro | 23/36 (64%) | 32/36 (89%) | 17/36 (47%) | ~237 tok | 4,924 tok |
| gemini-flash | 13/36 (36%) | 31/36 (86%) | 16/36 (44%) | ~237 tok | 4,924 tok |
| gpt-4o | 10/36 (28%) | 32/36 (89%) | 14/36 (39%) | ~237 tok | 4,378 tok |
| gpt-4o-mini | 10/36 (28%) | 32/36 (89%) | 10/36 (28%) | ~237 tok | 4,378 tok |
| llama-maverick | 10/36 (28%) | 32/36 (89%) | 13/36 (36%) | ~237 tok | 4,201 tok |

## phoenix

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 30/36 (83%) | 32/36 (89%) | 17/36 (47%) | ~306 tok | 17,610 tok |
| gemini-pro | 29/36 (81%) | 32/36 (89%) | 19/36 (53%) | ~306 tok | 19,045 tok |
| gemini-flash | 23/36 (64%) | 30/36 (83%) | 22/36 (61%) | ~306 tok | 19,045 tok |
| gpt-4o | 25/36 (69%) | 33/36 (92%) | 9/36 (25%) | ~306 tok | 14,726 tok |
| gpt-4o-mini | 19/36 (53%) | 30/36 (83%) | 15/36 (42%) | ~306 tok | 14,726 tok |
| llama-maverick | 23/36 (64%) | 30/36 (83%) | 17/36 (47%) | ~306 tok | 14,710 tok |

## ripgrep

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 29/36 (81%) | 35/36 (97%) | 24/36 (67%) | ~189 tok | 13,503 tok |
| gemini-pro | 28/36 (78%) | 35/36 (97%) | 25/36 (69%) | ~189 tok | 13,909 tok |
| gemini-flash | 30/36 (83%) | 35/36 (97%) | 23/36 (64%) | ~189 tok | 13,908 tok |
| gpt-4o | 25/36 (69%) | 36/36 (100%) | 21/36 (58%) | ~189 tok | 11,423 tok |
| gpt-4o-mini | 23/36 (64%) | 35/36 (97%) | 26/36 (72%) | ~189 tok | 11,423 tok |
| llama-maverick | 26/36 (72%) | 35/36 (97%) | 18/36 (50%) | ~189 tok | 11,440 tok |

## gh-cli

| Model | Baseline | CHODE | Self-profile | CHODE profile | Self input |
|---|---|---|---|---|---|
| mistral-large | 19/36 (53%) | 34/36 (94%) | 19/36 (53%) | ~451 tok | 23,268 tok |
| gemini-pro | 8/36 (22%) | 32/36 (89%) | 14/36 (39%) | ~451 tok | 26,607 tok |
| gemini-flash | 16/36 (44%) | 34/36 (94%) | 20/36 (56%) | ~451 tok | 26,607 tok |
| gpt-4o | 12/36 (33%) | 34/36 (94%) | 11/36 (31%) | ~451 tok | 20,945 tok |
| gpt-4o-mini | 13/36 (36%) | 34/36 (94%) | 8/36 (22%) | ~451 tok | 20,945 tok |
| llama-maverick | 16/36 (44%) | 34/36 (94%) | 14/36 (39%) | ~451 tok | 19,802 tok |

## Summary

| Mode | Avg score | Avg input tokens |
|---|---|---|
| Baseline | 44% | ~300 (questions only) |
| **CHODE** | **90%** | **~353 (profile)** |
| Self-profile | 40% | ~43,095 (raw docs) |
