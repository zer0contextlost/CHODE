# Noise Floor Test — Forced Choice (Gitea Router)
**Date:** 2026-04-17  
**Question:** Which HTTP router library does the Gitea project use for its backend?  
**Correct answer:** chi  

| Model | Baseline | CHODE | Raw context | Answer order |
|:---|:---|:---|:---|:---|
| gemini-flash | GIN ✗ (prior) | CHI ✓ | CHI ✓ | echo > gorilla/mux > gin > chi |
| gemini-pro | CHI ✓ | CHI ✓ | CHI ✓ | gorilla/mux > gin > echo > chi |
| mistral-large | CHI ✓ | CHI ✓ | CHI ✓ | chi > gorilla/mux > gin > echo |
| gpt-4o | CHI ✓ | CHI ✓ | CHI ✓ | chi > echo > gorilla/mux > gin |
| gpt-4o-mini | GIN ✗ (prior) | CHI ✓ | CHI ✓ | gin > gorilla/mux > echo > chi |
| llama-maverick | CHI ✓ | CHI ✓ | CHI ✓ | gorilla/mux > chi > gin > echo |

### Raw answers

**gemini-flash**  
- Baseline: `gin`  
- CHODE: `chi`  
- Raw: `chi`  

**gemini-pro**  
- Baseline: `chi`  
- CHODE: `chi`  
- Raw: `chi`  

**mistral-large**  
- Baseline: `chi`  
- CHODE: `chi`  
- Raw: `chi`  

**gpt-4o**  
- Baseline: `chi`  
- CHODE: `chi`  
- Raw: `chi`  

**gpt-4o-mini**  
- Baseline: `gin`  
- CHODE: `chi`  
- Raw: `chi`  

**llama-maverick**  
- Baseline: `chi`  
- CHODE: `chi`  
- Raw: `2. chi`  
