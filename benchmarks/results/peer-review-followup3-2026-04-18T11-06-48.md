# CHODE Peer Review Follow-up Round 3 — 2026-04-18T11-06-48

Models: GPT-4o, GPT-4o-mini, Gemini 2.5 Flash, Gemini 2.5 Pro, Mistral Large, Llama 4 Maverick

Focus: §16.4 item 9 executed — independent question authorship (9 repos, round-robin design).

Each model received: (1) full updated RESEARCH.md, (2) its own round-2 verdict, (3) item 9 empirical results.

---

## GPT-4o

### Round 3 Review

1. **Item 9 Finding and Authorship Bias Concern:**

   - **Resolution of Authorship Bias Concern:** The item 9 finding effectively addresses the authorship bias concern. The results clearly demonstrate that independently authored questions targeted README-level specifics, which CHODE does not aim to extract. The interpretation that this reflects an extraction scope boundary rather than a general accuracy failure is valid. CHODE's design is focused on structural orientation, not installation specifics, which aligns with the observed results.

2. **Revision of Claims:**

   - **Framing of 90% Accuracy:** The paper's claim of 90% accuracy remains defensible for within-scope retrieval tasks. The independently authored questions highlight a different task domain — installation specifics — which CHODE does not target. It is important to clarify in the paper that the 90% accuracy applies to structural orientation tasks, and that CHODE is not designed to handle README-level specifics. This distinction should be emphasized to prevent misinterpretation of the scope and applicability of the accuracy claim.

3. **Remaining Open Items Before arXiv Submission:**

   - **Expand Repository Diversity:** Conduct tests on more unconventional repositories, such as monorepos, embedded systems, or pure configuration repositories, to further validate CHODE's versatility across diverse project types.

   - **Evaluate Dynamic Environments:** Assess how CHODE profiles perform in repositories that undergo frequent changes, focusing on profile staleness and update mechanisms. This will provide insights into CHODE's applicability in dynamic development environments.

   - **Clarify Limitations:** More prominently emphasize the limitations related to well-documented frameworks and dynamic environments in the paper. This will provide a balanced view of CHODE's capabilities and ensure readers understand the contexts in which CHODE is most effective.

These steps will strengthen the paper's claims and ensure clarity regarding CHODE's scope and limitations before submission to arXiv.

---

## GPT-4o-mini

1. **Does the item 9 finding resolve the authorship bias concern?**  
   Yes, the item 9 finding does resolve the authorship bias concern. The authorship test demonstrates that independently authored questions predominantly target README-level specifics, which fall outside CHODE's extraction scope focused on structural and architectural orientation. This interpretation holds up and does not undermine the paper's core claims, as it clarifies that the 90% benchmark accuracy reflects the retrieval of relevant orientation facts, not general documentation details.

2. **Do any claims need to be revised?**  
   The framing of the 90% accuracy claim remains defensible, as it is based on within-scope retrieval of structural orientation facts. However, the paper should explicitly acknowledge the limitations of CHODE in addressing README-specific queries and clarify that the 2% score in the independent question authorship test does not reflect a failure of CHODE but rather the intentional design choice to focus on structural facts. This distinction should be made clearer in the discussion to avoid misinterpretation.

3. **What remains genuinely open before arXiv submission?**  
   - **Expand Repository Diversity:** Include additional unconventional or poorly documented repositories in the evaluation to better understand the limitations and strengths of CHODE.
   - **Conduct User Experience Research:** Gather qualitative data on how developers interact with CHODE profiles to identify usability issues and potential enhancements.
   - **Address Longitudinal Aspects:** Consider conducting a preliminary longitudinal study to assess how CHODE profiles maintain relevance and accuracy over time as repositories evolve.

---

## Gemini 2.5 Flash

Here's my Round 3 verdict:

1.  **Does the item 9 finding resolve the authorship bias concern?**
    Yes, the item 9 finding largely resolves the authorship bias concern, but it reframes it. The extraction scope boundary interpretation holds up. It doesn't undermine the paper's core claims; instead, it clarifies the *scope* within which those claims are valid. The finding demonstrates that CHODE is highly effective for its *intended purpose* (structural/architectural orientation) but not for arbitrary README-level details. This is a crucial distinction, not a failure.

2.  **Do any claims need to be revised?**
    The framing of 90% accuracy is still defensible, but the paper needs to explicitly and prominently state that this 90% applies *specifically to structural/architectural orientation facts*. The "Primary Finding" in the Abstract and Section 1 Introduction should be updated to include this crucial qualifier. The 2% score on independently authored questions highlights the *boundary* of CHODE's utility, not a contradiction of its efficacy within its defined scope.

3.  **What remains genuinely open before arXiv submission?**
    *   **Unconventional Repository Benchmark:** Item 8 in §16.4 (monorepo, no README, custom build, embedded, pure config). This is the last planned empirical validation.
    *   **Semantic Equivalence Scoring for Out-of-Scope Questions:** While the in-scope semantic scoring showed minimal delta, it would be valuable to see if the 2% CHODE score on independently authored questions changes significantly with a more lenient semantic scorer. This could reveal if CHODE *partially* answers these questions in a semantically correct but strictly unmatched way.
    *   **Long-Term Maintenance/Evolution Strategy:** Briefly address how the CHODE schema itself will evolve. As new frameworks or architectural patterns emerge, how will the tool adapt to maintain its relevance and accuracy without requiring constant manual updates?

---

## Gemini 2.5 Pro

### Round 3 Verdict

**1. Does the item 9 finding resolve the authorship bias concern?**

Yes, completely. The finding resolves the concern by demonstrating its premise: questions authored without knowledge of the CHODE profile target information outside its extraction scope. The author's "extraction

---

## Mistral Large

### **1. Does the Item 9 Finding Resolve Authorship Bias?**
**Yes, but with a critical framing requirement.**
The extraction scope boundary interpretation holds up. The 2% CHODE score on independently authored questions is not evidence of bias—it’s evidence of *design intent*. CHODE was never intended to answer README-level specifics (install commands, port numbers, license strings). The 90% benchmark measures *structural orientation* (stacks, routes, auth methods, entry points), which is explicitly what CHODE extracts. The independently authored questions measure *installation/configuration specifics*, which CHODE deliberately omits.

**Key distinction:**
- **Not a failure of CHODE** → A failure of *question selection* for this test.
- **Not a bias in the original benchmark** → The original stump questions were designed to align with CHODE’s extraction scope.

**Action required:**
The paper must **explicitly scope the 90% claim** in the abstract and conclusion:
> *"CHODE achieves 90% accuracy on structural orientation tasks (stacks, routes, entry points, auth methods). It is not designed for installation/configuration specifics (port numbers, install commands, license strings), where it scores 2% on independently authored questions."*

---

### **2. Do Any Claims Need Revision?**
**No revisions to core claims, but one critical clarification:**
The 90% accuracy claim is defensible **only if scoped to structural orientation**. The paper already does this in §2 ("Problem Formulation"), but the abstract and conclusion must mirror this scope. The independently authored question test does not undermine the 90% figure—it *complements* it by defining the boundary of CHODE’s utility.

**No changes needed to:**
- Self-profiling degradation (40% vs. 44%)
- Structure beats volume (90% vs. 40%)
- Efficiency metrics (122× fewer tokens)

---

### **3. What Remains Open Before arXiv Submission?**
**Three actionable items:**

#### **1. Add a "Scope of Authority" Section (New §14.6)**
**Content:**
- Explicitly define CHODE’s intended use cases (structural orientation) vs. out-of-scope tasks (installation/configuration).
- Include the independently authored question results as a **feature**, not a bug:
  > *"CHODE’s 2% score on README-level questions is by design. It prioritizes architectural facts over narrative details, avoiding the attention dilution that degrades raw documentation context."*
- Add a table contrasting in-scope vs. out-of-scope questions (example below).

| **In-Scope (Structural Orientation)** | **Out-of-Scope (README-Level)** |
|---------------------------------------|----------------------------------|
| HTTP router (chi, gin)                | Default port number              |
| Entry point (`main.go`)               | `brew install` command           |
| Auth methods (LDAP, OAuth)            | License type (MIT, GPL)          |
| Test command (`make test`)            | `npm run dev` script             |

#### **2. Report Self-Profiling Token Variance (Update §13.5)**
**Action:**
- Add min/max/median token counts for self-profiling across all 27 repos.
- Explicitly note which repos exceed model context limits (e.g., Next.js at 300K+ tokens).
- Example update to §13.5:
  > *"Self-profiling consumes **43,000 tokens on average** (min: 12K, max: 312K, median: 38K). Repos exceeding 128K tokens (e.g., Next.js) are truncated by model context limits, artificially deflating self-profile scores."*

#### **3. Add Unconventional Repo Benchmark (New §8.3)**
**Action:**
- Test 5 unconventional repos (monorepo, no README, custom build, embedded, config-only).
- Report results in a new table with a disclaimer:
  > *"CHODE is optimized for app-using-framework repos. Performance on unconventional structures (e.g., monorepos, embedded systems) may degrade due to sparse manifests or non-standard layouts."*
- Example repos:
  - **Monorepo:** Turborepo (TypeScript)
  - **No README:** Private/internal tool (e.g., `github.com/zer0contextlost/CHODE` before this paper)
  - **Custom build:** Zig project (no `package.json`/`go.mod`)
  - **Embedded:** Zephyr RTOS (C)
  - **Config-only:** NixOS modules (Nix)

---

### **Final Verdict**
**The paper is ready for arXiv submission after:**
1. Adding §14.6 (Scope of Authority) with the in-scope/out-of-scope table.
2. Updating §13.5 with self-profiling token variance.
3. Adding §8.3 (Unconventional Repo Benchmark).

**No revisions to core claims are needed.** The independently authored question test *strengthens* the paper by defining CHODE’s boundaries. The 90% accuracy claim is robust when properly scoped.

---

## Llama 4 Maverick

### Review of CHODE Paper Update

#### 1. Does the item 9 finding resolve the authorship bias concern?

The item 9 finding provides strong evidence that the original authorship bias concern is valid but misframed. The independently authored questions target README-level specifics that CHODE is not designed to extract. This confirms the extraction scope boundary interpretation: CHODE's 90% accuracy figure measures within-scope retrieval of structural/architectural orientation facts (stacks, packages, routes, middleware, patterns), while the 2% score on independently authored questions measures out-of-scope retrieval.

The finding resolves the authorship bias concern by demonstrating that:
- The original benchmark questions were not cherry-picked to favour CHODE's extraction scope.
- Independently authored questions, derived from README content, fall outside CHODE's intended scope.

However, it also highlights a need for clearer scope delineation in the paper.

#### 2. Do any claims need to be revised?

Yes, the paper's framing of CHODE's accuracy and capabilities requires revision to reflect the extraction scope boundary clearly. The current 90% accuracy figure is valid but only within the specific scope of structural/architectural orientation facts. The paper should be updated to:
- Clearly state CHODE's extraction scope and what it is designed to achieve.
- Avoid implying that CHODE is a general-purpose repository context tool.
- Acknowledge that CHODE deliberately does not extract certain types of information (e.g., installation commands, specific file paths).

The core claims about CHODE's performance within its scope remain valid, but the paper needs to be more precise about what that scope is.

#### 3. What remains genuinely open before arXiv submission?

Three actionable items remain:
1. **Clarify CHODE's extraction scope and limitations** in the introduction and abstract. Make it explicit that CHODE targets structural/architectural orientation facts and not general repository context or README-level specifics.
2. **Update the benchmark section** to include the results from independently authored questions as a separate "out-of-scope" evaluation. This demonstrates awareness of CHODE's boundaries and provides a more comprehensive picture.
3. **Discuss the implications of the dual retrieval modes** (semantic retrieval vs. mechanical retrieval) and how they relate to CHODE's performance. This adds nuance to the discussion and pre-empts potential misinterpretations about CHODE's "authority" on certain types of questions.

By addressing these points, the paper will be significantly strengthened and better positioned for arXiv submission.

---

