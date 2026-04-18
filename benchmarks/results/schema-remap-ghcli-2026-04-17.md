# CHODE Schema Remap — gh-cli Replication
**Date:** 2026-04-17  
**Repo:** gh-cli  
**Hypothesis:** Field-label retrieval failure replicates: cobra in @STACK not retrieved by GPT-4o when asked "what CLI framework?"  
**Control question:** Qgrpc — grpc is also in @STACK; if retrieved, @STACK IS read, failure is question-label mismatch not @STACK ignorance

## Variants

| Variant | Change |
|---|---|
| baseline | Original gh-cli.chode |
| cobra-routes | @ROUTES cobra → api/ (24 files) |
| cobra-commands | New field: @COMMANDS cobra |
| cobra-stack | @STACK go [cobra=cli-framework] oauth … |
| combined | @COMMANDS cobra (same as cobra-commands) |

## Results — Qcobra (CLI command framework)

| Model | baseline | cobra-routes | cobra-commands | cobra-stack | combined |
|---|--- | --- | --- | --- | ---|
| gemini-flash | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| gpt-4o | 3 ✓ | 3 ✓ | 3 ✓ | 0 ✗ | 3 ✓ |
| mistral-large | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |

## Results — Qtestscript (Acceptance test framework)

| Model | baseline | cobra-routes | cobra-commands | cobra-stack | combined |
|---|--- | --- | --- | --- | ---|
| gemini-flash | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| gpt-4o | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| mistral-large | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |

## Results — Qgrpc (RPC protocol)

| Model | baseline | cobra-routes | cobra-commands | cobra-stack | combined |
|---|--- | --- | --- | --- | ---|
| gemini-flash | 3 ✓ | 0 ✗ | 0 ✗ | 3 ✓ | 0 ✗ |
| gpt-4o | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ | 3 ✓ |
| mistral-large | 0 ✗ | 0 ✗ | 0 ✗ | 0 ✗ | 0 ✗ |

## Raw Answers

### gemini-flash

**baseline**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: grpc  

**cobra-routes**  
- Qcobra: cobra  
- Qtestscript: `go-internal/testscript` package  
- Qgrpc: Not in profile.  

**cobra-commands**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript package  
- Qgrpc: Not in profile.  

**cobra-stack**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: grpc  

**combined**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript package  
- Qgrpc: Not in profile.  

### gpt-4o

**baseline**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: grpc  

**cobra-routes**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: grpc  

**cobra-commands**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: grpc  

**cobra-stack**  
- Qcobra: cli-framework  
- Qtestscript: go-internal/testscript  
- Qgrpc: grpc  

**combined**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: grpc  

### mistral-large

**baseline**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: Not in profile  

**cobra-routes**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: Not in profile  

**cobra-commands**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: Not in profile  

**cobra-stack**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: Not in profile  

**combined**  
- Qcobra: cobra  
- Qtestscript: go-internal/testscript  
- Qgrpc: Not in profile  

## Analysis

### Control question (Qgrpc)
If grpc (also in @STACK) is retrieved correctly in baseline, it proves models DO read @STACK — the cobra failure (if any) is question-semantic mismatch, not @STACK ignorance.

### Replication verdict
- **gemini-flash**: cobra baseline=✓  grpc baseline=✓
- **gpt-4o**: cobra baseline=✓  grpc baseline=✓
- **mistral-large**: cobra baseline=✓  grpc baseline=✗
