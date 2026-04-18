# CHODE Peer Review Follow-up Round 2 — 2026-04-18T02-52-41

Models: GPT-4o, GPT-4o-mini, Gemini 2.5 Flash, Gemini 2.5 Pro, Mistral Large, Llama 4 Maverick

Each model received: (1) full RESEARCH.md paper, (2) its own original criticisms, (3) empirical benchmark answers to those criticisms.

---

## GPT-4o

### Updated Assessment

1. **Resolved Criticisms:**

   - **Strict Scoring Penalty:** The semantic equivalence scoring confirmed that the strict scoring method is not materially penalizing correct answers. The negligible delta between strict and semantic scores supports the robustness of the 90% CHODE benchmark figure.

   - **Generalization to Unseen Repositories:** The new benchmarks on five previously untested repositories demonstrate that CHODE generalizes well, maintaining a 93% accuracy rate. This addresses concerns about potential overfitting to the original benchmark set.

   - **Context Position Effects:** The test showing no significant recency bias when profiles are placed at the start versus the end of the context window resolves concerns about context position effects.

   - **Multi-Repo Concatenation:** The successful attribution across multiple concatenated profiles without cross-contamination confirms that CHODE profiles can be used in multi-repo contexts without interference.

   - **Profile Scalability Limits:** The scalability tests with up to 13 profiles and ~4,636 tokens showing zero interference address concerns about CHODE's scalability and potential cross-contamination.

   - **Density Collapse Hypothesis:** The density level tests confirm that the default profile size is the minimum sufficient representation, supporting the hypothesis that more information can degrade retrieval.

   - **Adversarial/Misleading Queries:** The adversarial query tests demonstrate that CHODE does not degrade robustness under adversarial questioning, and in some cases, it corrects plausible-wrong assumptions better than baseline.

2. **Open Criticisms:**

   - **Diversity of Repositories:** While the new tests included some additional repositories, there is still a need for more diverse and unconventional projects, such as monorepos, embedded systems, or pure configuration repositories, to fully validate CHODE's applicability across all types of projects.

   - **Dynamic Environments:** The impact of CHODE profiles in dynamic environments where repositories frequently change remains unexplored. Understanding how profiles handle frequent updates and structural changes would be beneficial.

3. **Confidence in Core Claims:**

   - **90% Benchmark Accuracy:** Confidence in this claim is strengthened by the consistent performance across both the original and new repositories.

   - **Self-Profiling Degrades Below Baseline:** The evidence remains compelling, with clear demonstrations of self-profiling's inefficiencies compared to CHODE.

   - **Structure Beats Volume:** The additional tests reinforce the claim that structured extraction outperforms raw volume, particularly in terms of retrieval accuracy and efficiency.

4. **Recommendations Before Submitting to arXiv:**

   - **Expand Repository Diversity:** Include tests on more unconventional repositories, such as monorepos or embedded systems, to further validate CHODE's versatility.

   - **Evaluate Dynamic Environments:** Conduct tests to assess how CHODE profiles perform in repositories that undergo frequent changes, focusing on profile staleness and update mechanisms.

   - **Clarify Limitations:** Emphasize the limitations related to well-documented frameworks and dynamic environments more prominently in the paper to provide a balanced view of CHODE's capabilities.

---

## GPT-4o-mini

1. **Resolved Criticisms:**
   - **Generalization to Unseen Repositories:** The empirical results demonstrate that CHODE profiles generalize well to previously unseen repositories, achieving a 93% accuracy on five new repositories. This addresses the concern about the findings not being broadly applicable.
   - **Context Position Effects:** The experiments showed no strong recency bias, indicating that the position of the CHODE profile in the context does not significantly affect performance. This resolves the concern about how context placement might influence results.
   - **Multi-repo Concatenation and Scalability Limits:** The tests confirmed that multiple CHODE profiles can be concatenated without interference, and the performance remains robust even at maximum stress with 13 profiles. This alleviates concerns about cross-contamination and scalability.

2. **Remaining Open Criticisms:**
   - **Sample Size and Diversity:** While the new results are promising, the overall diversity of the repositories evaluated still appears limited. Including a broader range of repository types, especially those that are unconventional or poorly documented, would strengthen the findings.
   - **User Experience and Integration:** There is still insufficient exploration of how developers interact with CHODE profiles in practice and how CHODE could integrate into existing workflows. This remains a gap in understanding the practical utility of the tool.
   - **Longitudinal Analysis:** The report does not address how CHODE profiles might evolve over time as repositories change. A longitudinal study could provide insights into the stability and relevance of the generated profiles.

3. **Confidence in Core Claims:**
   - (a) **90% Benchmark Accuracy:** Confidence in this claim has increased due to the empirical evidence from unseen repositories supporting the benchmark accuracy.
   - (b) **Self-Profiling Degrades Below Baseline:** Confidence in this claim remains strong, as the new data supports the assertion that raw documentation context can degrade model performance.
   - (c) **Structure Beats Volume:** Confidence in this claim is reinforced by the results showing that structured profiles significantly outperform raw documentation in accuracy and efficiency.

4. **Actionable Items Before Submitting to arXiv:**
   - **Expand Repository Diversity:** Include additional unconventional or poorly documented repositories in the evaluation to better understand the limitations and strengths of CHODE.
   - **Conduct User Experience Research:** Gather qualitative data on how developers interact with CHODE profiles to identify usability issues and potential enhancements.
   - **Address Longitudinal Aspects:** Consider conducting a preliminary longitudinal study to assess how CHODE profiles maintain relevance and accuracy over time as repositories evolve.

---

## Gemini 2.5 Flash

Here is my updated assessment based on the empirical responses:

## Updated Assessment

### 1. Resolved Criticisms

*   **Strict scoring penalizes semantically correct answers:** **Resolved.** The semantic equivalence scoring demonstrated a negligible difference (+5 points across thousands of answers), confirming that the strict scoring method is a robust measure of profile fidelity and does not unfairly penalize genuinely correct answers.
*   **Generalization to unseen repositories undemonstrated:** **Resolved.** The benchmark across five new, unseen repositories yielded an aggregate CHODE score of 93%, which is consistent with the original 90% finding. This strongly supports the claim of cross-domain generalization.
*   **Context position effects untested:** **Resolved.** The position sensitivity test showed no significant or consistent impact of profile placement (start vs. end) on accuracy, indicating robustness to context position.
*   **Multi-repo concatenation may cause cross-contamination:** **Resolved.** The multi-repo context tests, extended to 13 concatenated profiles, demonstrated zero interference and perfect attribution accuracy for both models. This confirms that CHODE profiles can be safely used in multi-repo contexts.
*   **Profile scalability limits unquantified:** **Resolved.** The profile stacking experiment clearly showed that CHODE's labeled field format scales effectively to at least 13 concurrent profiles (~4,636 tokens) without degradation in performance or cross-contamination.
*   **Density collapse hypothesis underexplored:** **Resolved.** The density ablation experiment on Gitea provided strong empirical evidence for the "minimum sufficient profile" concept. The sharp step function between Minimal and Standard profiles, and the lack of further accuracy gains at higher densities, supports the claim that excessive information, even structured, can be detrimental or at least provide no benefit.
*   **Adversarial/misleading queries untested:** **Resolved.** The adversarial query robustness test demonstrated that CHODE does not degrade robustness and, in the case of "plausible-wrong" assumptions, actively improves accuracy by correcting model priors.

### 2. Remaining Open Criticisms

*   **Unconventional repository benchmark:** This remains **open** as it is listed as "Planned." While the generalization to unseen repos is strong, the specific stress cases of monorepos, repos without READMEs, custom build scripts, embedded systems, and pure configuration repos could reveal new generator-level limitations or failure modes not covered by the current set.
*   **Independent question authorship:** This remains **open** as it is listed as "Planned." While the semantic scoring addressed the "strictness" aspect, the potential for unconscious tuning of questions to the CHODE output format (researcher bias) is a distinct concern that only independent question authorship can address.

### 3. Change in Confidence in Core Claims

My confidence in the core claims has **significantly increased**.

*   **(a) 90% benchmark accuracy:** The consistent performance across new, unseen repositories (93%) and the robustness to scoring methodology (semantic vs. strict) strongly reinforce the 90% accuracy claim.
*   **(b) Self-profiling degrades below baseline:** The original finding of self-profiling degradation is robust and has been further elucidated by the density collapse hypothesis and the micro-scale replication of this effect.
*   **(c) Structure beats volume:** This claim is overwhelmingly supported by the new data, particularly the density ablation and the multi-repo tests, which demonstrate that targeted, structured information is far more effective than raw volume.

### 4. Actionable Items Before Submitting to arXiv

1.  **Complete "Unconventional repository benchmark":** This is crucial for demonstrating the generator's robustness and identifying edge cases beyond typical application repositories.
2.  **Complete "Independent question authorship":** This will provide the final validation against potential researcher bias in question design, strengthening the objectivity of the benchmark.
3.  **Integrate "Footnotes" into the main text or appendix:** The current "Footnotes" section contains critical methodological details (e.g., OpenRouter usage, logprob API, peer review process) that are too important to be relegated to footnotes. They should be explicitly referenced and expanded upon within the relevant sections of the main body or moved to a dedicated appendix for better visibility and academic rigor.

---

## Gemini 2.5 Pro

Updated assessment follows.

### 1. Which criticisms are now resolved?

The majority of my initial methodological concerns are now resolved by the new empirical data.

*   **Generalization to unseen repositories:** Resolved. The 93% aggregate score on 5 previously unseen repositories is statistically identical

---

## Mistral Large

### **1. Resolved Criticisms**

**a. Generalization to unseen repositories**
- **Resolved.** The 5-repo unseen benchmark (ruff, zulip, appwrite, pocketbase, caddy) shows 93% accuracy—matching the original 90% figure. No evidence of overfitting to the original 9 repos. The claim that CHODE generalizes to new repositories is now empirically supported.

**b. Multi-repo context and interference**
- **Resolved.** The 13-profile concatenation test (~4,636 tokens) shows zero interference across GPT-4o and Gemini Flash. The labeled field format provides sufficient repo identity separation. CHODE scales cleanly to multi-repo contexts.

**c. Context position effects**
- **Resolved.** The START vs. END test shows negligible impact (+1 net delta across 6 matchups). The paper’s standard practice (profile at start) is validated.

**d. Adversarial query robustness**
- **Resolved.** The 10-question adversarial test shows CHODE does not degrade robustness. The profile anchors plausible-wrong questions correctly (e.g., Redis/nginx assumptions) while leaving other adversarial types unaffected. The claim that CHODE is robust to misleading queries is now supported.

**e. Density collapse and minimum sufficient profile**
- **Resolved.** The 4-tier density test (121 → 1,847 tokens) confirms a sharp step function at ~509 tokens. The default profile is the minimum sufficient representation for orientation tasks. The "density collapse" hypothesis is now empirically demonstrated at the micro scale.

**f. Semantic equivalence scoring**
- **Resolved.** The +5-point delta across 6,093 answers confirms the strict scorer is not materially penalizing correct answers. The 90% benchmark figure is robust to scoring methodology.

---

### **2. Open Criticisms**

**a. Selection bias in repositories**
- **Partially addressed, but not fully resolved.**
  - The unseen repo test (5 repos) is a good start, but all are still "conventional" (app-using-framework or multi-SDK tools). The paper still lacks:
    - A monorepo (e.g., Turborepo)
    - A repo with no README (e.g., a private/internal tool)
    - A repo with custom build scripts (e.g., no `package.json`/`go.mod`)
    - An embedded systems repo (e.g., Zephyr RTOS)
    - A pure configuration repo (e.g., NixOS modules)
  - The "ML/data repos" category remains underpowered (n=1 in original benchmark, n=0 in unseen test).
  - **Actionable gap:** Add 5 unconventional repos to the primary benchmark and report results. Explicitly state CHODE’s limitations for non-conventional structures.

**b. Question leakage and training priors**
- **Not addressed.**
  - The stump questions are still designed by the author, who knows the profiles. There’s no independent question authorship test.
  - The "private repo" suggestion was not tested. Synthetic stump questions (e.g., "Does this repo use library X?" where X is fake) were not run.
  - **Actionable gap:** Have 3 independent authors write stump questions for 3 repos. Compare scores to author-written questions to quantify leakage.

**c. Token counting variance**
- **Not addressed.**
  - The "~43,000 tokens" for self-profiling is still an average with no variance reported. Some repos (e.g., Next.js) likely exceed model context limits, which would artificially deflate self-profile scores.
  - **Actionable gap:** Report min/max/median token counts for self-profiling across all repos. Explicitly note which repos exceed context limits.

**d. Efficiency metric framing**
- **Partially addressed, but still misleading.**
  - The paper now clarifies "122× fewer *input* tokens," but the "454× better comprehension per token" claim still implies a linear relationship that doesn’t hold. The denominator (self-profile tokens) includes tokens the model likely didn’t attend to due to attention dilution.
  - **Actionable gap:** Replace "comprehension per token" with "input cost efficiency" and add a caveat: *"This metric compares input token counts, not effective attended tokens. The true efficiency gain is lower due to attention dilution in raw context."*

---

### **3. Confidence in Core Claims**

**a. 90% benchmark accuracy**
- **Confidence: High.**
  - The 90% figure is now replicated across:
    - Original 9-repo benchmark (6 models)
    - 5-repo unseen benchmark (2 models)
    - 4-tier density test (2 models)
  - The semantic equivalence scoring confirms the strict scorer isn’t inflating results.
  - **Remaining caveat:** The 90% figure holds for "app-using-framework" repos. Performance on unconventional repos is untested.

**b. Self-profiling degrades below baseline (40% vs. 44%)**
- **Confidence: Very high.**
  - The degradation is now explained by two distinct mechanisms (Prior Overwhelming, Attention Dilution) and replicated across models and repos.
  - The logprob evidence (§6.3) shows the effect is real, not an artifact of scoring.
  - **No remaining caveats.**

**c. Structure beats volume**
- **Confidence: High.**
  - The 90% vs. 40% delta is robust.
  - The schema remap experiment (§10) shows structure (field labels) is the key, not just compression.
  - The density collapse test (§12.7) shows that even within a structured profile, unnecessary tokens degrade retrieval.
  - **Remaining caveat:** This claim is specific to *orientation tasks*. For code navigation or bug fixing, raw context is still necessary. The paper should explicitly scope the claim.

---

### **4. Actionable Items Before arXiv Submission**

1. **Add 5 unconventional repos to the primary benchmark.**
   - Include: a monorepo (Turborepo), a repo with no README, a repo with custom build scripts, an embedded systems repo, and a pure configuration repo.
   - Report results in a new table (e.g., "Unconventional Repo Benchmark").
   - Explicitly state: *"CHODE is optimized for app-using-framework repos. Performance on unconventional structures may vary."*

2. **Replace "comprehension per token" with "input cost efficiency."**
   - Add a caveat in §13: *"This metric compares input token counts, not effective attended tokens. The true efficiency gain is lower due to attention dilution in raw context."*
   - Remove the "454×" claim from the abstract and highlight table. Keep it in the body with the caveat.

3. **Report min/max/median token counts for self-profiling.**
   - Add

---

## Llama 4 Maverick

## Updated Assessment

### 1. Resolved Criticisms

The following criticisms are now resolved with empirical evidence:

1. **Strict scoring penalizes semantically correct answers**: The semantic equivalence scoring experiment showed a delta of only +5 points across 6,093 answers. This demonstrates that the strict scoring methodology is not materially penalizing correct answers, and the 90% CHODE benchmark figure is robust to scoring methodology.

2. **Generalization to unseen repositories undemonstrated**: The additional benchmark on 5 previously unseen repositories (ruff, zulip, appwrite, pocketbase, caddy) showed a 93% average score, matching the original 90% figure. This indicates that CHODE generalizes well to new repositories.

3. **Context position effects untested**: The experiment placing CHODE profiles at START vs END of context showed no strong recency bias, with a net delta of +1 across 6 matchups. This suggests that the standard practice of placing the profile at the start is adequate.

4. **Multi-repo concatenation may cause cross-contamination**: The concatenation experiment with up to 13 profiles (~4,636 tokens) showed zero interference cases across both GPT-4o and Gemini Flash. This demonstrates that CHODE profiles are safe to use in multi-repo contexts.

5. **Profile scalability limits unquantified**: The scalability test across three tiers (3, 5, and 13 profiles) confirmed that CHODE's labeled field format scales cleanly without interference.

6. **Density collapse hypothesis underexplored**: The density level experiment on the Gitea profile showed a sharp step function at ~509 tokens (default profile), with no additional retrieval benefit from adding more tokens. This confirms that the default CHODE output is the minimum sufficient profile.

7. **Adversarial/misleading queries untested**: The adversarial query test across 10 questions and 5 types showed that CHODE does not degrade robustness under adversarial questioning and actually improves performance on plausible-wrong assumptions.

### 2. Remaining Open Criticisms

1. **Unconventional repository benchmark**: The author plans to add 5 non-conventional repos to the primary benchmark. This remains open but is a planned experiment.

2. **Independent question authorship**: The author plans to have three independent authors write stump questions for 3 repos to quantify authorship bias. This remains open but is a planned experiment.

### 3. Confidence in Core Claims

1. **90% benchmark accuracy**: My confidence has increased. The additional benchmarks on unseen repositories and the semantic equivalence scoring experiment support this claim.

2. **Self-profiling degrades below baseline**: My confidence has increased. The evidence from multiple repositories and models consistently shows that raw documentation context scores lower than or equal to baseline, supporting this claim.

3. **Structure beats volume**: My confidence has increased significantly. The experiments on CHODE vs. raw documentation, README-only, and LLM summaries consistently demonstrate that structured extraction outperforms unstructured retrieval.

### 4. Recommendations Before arXiv Submission

1. **Complete the planned unconventional repository benchmark**: Add the 5 non-conventional repos to the primary benchmark to further stress-test CHODE's generator and reveal any structural assumptions that break down.

2. **Conduct the independent question authorship experiment**: Have three independent authors write stump questions for 3 repos to quantify any authorship bias in the current question set.

3. **Consider adding a discussion on the implications of the density collapse hypothesis**: While the experiment confirmed the hypothesis, a more detailed discussion on its implications for future work, especially in training data curation, would strengthen the paper.

These recommendations address the remaining open criticisms and provide additional context for the research findings.

---

