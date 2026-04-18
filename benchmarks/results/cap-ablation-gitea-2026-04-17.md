# CHODE Field-Cap Ablation Study
**Date:** 2026-04-17  
**Repo:** gitea  
**Caps tested:** 20, 40, 60, 80, 120, 200, 350, 500 chars  
**Questions:** 12 total, 8 stump

## Field Truncation by Cap

| Cap | Fields truncated | ~Tokens |
|---|---|---|
| 20 | @STACK, @FRONTEND, @TEST, @DATA, @ENTITIES, @AUTH, @API, @ARCH, @PACKAGES, @STRUCT, @PATTERNS, @PURPOSE, @CONVENTIONS, @TESTING | ~147 |
| 40 | @TEST, @ENTITIES, @AUTH, @ARCH, @PACKAGES, @STRUCT, @PATTERNS, @PURPOSE, @CONVENTIONS, @TESTING | ~210 |
| 60 | @TEST, @ENTITIES, @PACKAGES, @STRUCT, @PURPOSE, @CONVENTIONS, @TESTING | ~250 |
| 80 | @TEST, @ENTITIES, @STRUCT, @PURPOSE, @CONVENTIONS, @TESTING | ~281 |
| 120 | @STRUCT, @PURPOSE, @TESTING | ~321 |
| 200 | @STRUCT, @PURPOSE, @TESTING | ~381 |
| 350 | @STRUCT | ~490 |
| 500 | (none) | ~507 |

## Overall Score by Cap

| Cap | Tokens | gemini-flash |
|---|---|---|
| 20 | ~147 | 19/36 (53%) |
| 40 | ~210 | 28/36 (78%) |
| 60 | ~250 | 28/36 (78%) |
| 80 | ~281 | 28/36 (78%) |
| 120 | ~321 | 28/36 (78%) |
| 200 | ~381 | 28/36 (78%) |
| 350 | ~490 | 28/36 (78%) |
| 500 | ~507 | 28/36 (78%) |

## Stump Score by Cap

| Cap | gemini-flash |
|---|---|
| 20 | 7/24 (29%) |
| 40 | 16/24 (67%) |
| 60 | 16/24 (67%) |
| 80 | 16/24 (67%) |
| 120 | 16/24 (67%) |
| 200 | 16/24 (67%) |
| 350 | 16/24 (67%) |
| 500 | 16/24 (67%) |

## Per-Question Scores (Stump Questions)

### gemini-flash

| Q | Topic | cap=20 | cap=40 | cap=60 | cap=80 | cap=120 | cap=200 | cap=350 | cap=500 |
|---|---|--- | --- | --- | --- | --- | --- | --- | ---|
| Q2 | Go HTTP router | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | *(must: chi)*
| Q4 | Config format | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | *(must: ini)*
| Q7 | Middleware location | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | *(must: routers/common)*
| Q8 | Migration count | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | *(must: 305)*
| Q9 | Auth methods | 0 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | *(must: ldap, oauth, webauthn)*
| Q10 | Architectural layers | 1 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | *(must: cmd, routes, svc, mdl)*
| Q11 | External integrations | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | *(must: azure, aws, github)*
| Q12 | Pre-commit requirement | 0 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | *(must: make fmt)*

## Step Function Analysis

Fields and the cap at which they get truncated:

- **cap=20**: @STACK, @FRONTEND, @TEST, @DATA, @ENTITIES, @AUTH, @API, @ARCH, @PACKAGES, @STRUCT, @PATTERNS, @PURPOSE, @CONVENTIONS, @TESTING begin truncating
- **cap=40**: @TEST, @ENTITIES, @AUTH, @ARCH, @PACKAGES, @STRUCT, @PATTERNS, @PURPOSE, @CONVENTIONS, @TESTING begin truncating
- **cap=60**: @TEST, @ENTITIES, @PACKAGES, @STRUCT, @PURPOSE, @CONVENTIONS, @TESTING begin truncating
- **cap=80**: @TEST, @ENTITIES, @STRUCT, @PURPOSE, @CONVENTIONS, @TESTING begin truncating
- **cap=120**: @STRUCT, @PURPOSE, @TESTING begin truncating
- **cap=200**: @STRUCT, @PURPOSE, @TESTING begin truncating
- **cap=350**: @STRUCT begin truncating

