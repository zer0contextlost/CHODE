# CHODE Schema Remap Experiment
**Date:** 2026-04-17  
**Repo:** gitea  
**Blind spots tested:** Q2 (chi router), Q8 (305 migrations)  
**Hypothesis:** Model-specific blind spots are field-mapping failures — wrong label → wrong retrieval

## Variants

| Variant | Change |
|---|---|
| baseline | Original gitea.chode (no changes) |
| chi-routes | @ROUTES chi → routers/ (447 files) |
| chi-stack | @STACK go [chi=router] mysql ... |
| data-label | @DATA models/migrations/ (305 migrations) |
| combined | chi-routes + data-label combined |

## Profile Diffs

```diff
# chi-routes
- @ROUTES chi → routers/ (447 files)
+ @ROUTES chi → chi → routers/ (447 files)
# chi-stack
- @STACK go chi mysql jwt pq sqlite3 mssql python
+ @STACK go [chi=router] mysql jwt pq sqlite3 mssql python
# data-label
# combined
- @ROUTES chi → routers/ (447 files)
+ @ROUTES chi → chi → routers/ (447 files)
```

## Results — Q2 (chi)

| Model | baseline | chi-routes | chi-stack | data-label | combined |
|---|--- | --- | --- | --- | ---|
| gemini-flash | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| gpt-4o | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| mistral-large | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |

## Results — Q8 (305 migrations)

| Model | baseline | chi-routes | chi-stack | data-label | combined |
|---|--- | --- | --- | --- | ---|
| gemini-flash | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| gpt-4o | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| mistral-large | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |

## Raw Answers

### gemini-flash

**baseline**  
- Q2: chi  
- Q8: 305 migrations  

**chi-routes**  
- Q2: chi  
- Q8: 305  

**chi-stack**  
- Q2: chi  
- Q8: 305 migrations  

**data-label**  
- Q2: chi  
- Q8: 305 migrations  

**combined**  
- Q2: chi  
- Q8: 305  

### gpt-4o

**baseline**  
- Q2: chi  
- Q8: 305 migrations  

**chi-routes**  
- Q2: chi  
- Q8: 305 migrations  

**chi-stack**  
- Q2: chi  
- Q8: 305 migrations  

**data-label**  
- Q2: chi  
- Q8: 305 migrations  

**combined**  
- Q2: chi  
- Q8: 305 migrations  

### mistral-large

**baseline**  
- Q2: chi  
- Q8: 305  

**chi-routes**  
- Q2: chi  
- Q8: 305  

**chi-stack**  
- Q2: chi  
- Q8: 305  

**data-label**  
- Q2: chi  
- Q8: 305  

**combined**  
- Q2: chi  
- Q8: 305  

## Analysis

### Predictions
- chi-routes should unlock GPT-4o and Flash for Q2 (both attend to @ROUTES over @STACK)
- chi-stack may partially help if bracket notation signals router role
- data-label should unlock Flash and Mistral for Q8 (reframe count as migration count explicitly)
- combined variant should show additive gains

### Findings
**Q2 (chi) unlocks:**
- No models unlocked

**Q8 (305) unlocks:**
- No models unlocked

