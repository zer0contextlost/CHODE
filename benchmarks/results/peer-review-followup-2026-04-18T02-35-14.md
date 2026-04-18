# CHODE Peer Review Follow-up — 2026-04-18T02-35-14

---

## GPT-4o

1. The semantic scoring results indicate that the strict scoring methodology is not significantly penalizing correct answers, as the delta was minimal (+5 points across 5 files). This suggests that the original scoring was largely accurate, and models scoring zero were indeed incorrect rather than suffering from paraphrasing issues. However, the semantic scorer's improvements were limited to self-profile mode, leaving room to explore other contexts where semantic scoring might reveal discrepancies.

2. The position test results are inconclusive due to the lack of consistent patterns. While some models showed minor variations based on the profile's position, these changes were not uniform across repositories or models. This suggests that position sensitivity might be model-specific or context-dependent rather than a universal trait. Further investigation into specific contexts or model architectures might yield more definitive insights.

3. The 6/6 multi-repo attribution result demonstrates that CHODE profiles can be effectively used in multi-repo contexts without causing cross-contamination. This supports the practical utility of CHODE in scenarios where multiple repositories are involved, confirming its robustness in handling complex attribution tasks.

4. The next benchmark should focus on exploring the semantic scoring in different contexts beyond self-profile mode, potentially revealing areas where semantic scoring might provide more substantial improvements. Additionally, examining model-specific factors that contribute to position sensitivity could offer deeper insights into optimizing CHODE's deployment across various models and contexts.

---

## GPT-4o-mini

1. The semantic scoring results indicate that the strict scorer is not materially penalizing correct answers, which addresses my concern about the robustness of the 90% benchmark figure. However, it remains unresolved whether the slight increase in semantic scores indicates a significant improvement in model understanding or simply reflects minor variations in phrasing.

2. The position sensitivity test results are inconclusive. While there are some variations in performance, particularly with the gemini-flash model on the ruff repo, the net delta of +1 does not provide strong evidence for a recency bias. More extensive testing across additional repos and models may be necessary to draw definitive conclusions.

3. The 6/6 multi-repo attribution result strengthens the case for CHODE's practical utility, demonstrating that models can accurately attribute facts across multiple profiles without interference. This suggests that CHODE profiles are indeed viable for complex, multi-repo contexts.

4. The next benchmark should focus on evaluating the models' performance in real-world scenarios, such as their ability to handle noisy or incomplete data within CHODE profiles. This would provide insights into the robustness and reliability of CHODE in practical applications.

---

## Gemini 2.5 Flash

Here's a direct follow-up review:

1.  **Semantic Scoring:** The semantic scoring result largely addresses the concern about strict matching penalizing valid paraphrases. The minimal delta (+5 points) strongly suggests the original strict scoring was not a significant source of underestimation. What remains unresolved is the *nature* of the "genuinely wrong" answers. While not paraphrases, understanding *why* models fail these 42% of cases (e.g., hallucination, misinterpretation, inability to extract) would be valuable.

2.  **Position Test:** The position test result is indeed inconclusive regarding a consistent recency bias. The mixed deltas (+1, -3, +4, -1) across models and repos prevent drawing a general conclusion. It suggests that for some specific model/repo combinations, position *can* matter, but it's not a universal effect. This doesn't invalidate CHODE but indicates that optimal profile placement might be context-dependent and not easily generalized.

3.  **Multi-Repo Attribution:** The 6/6 multi-repo attribution significantly strengthens the case for CHODE's practical utility. This result directly addresses the concern about potential cross-contamination or difficulty in distinguishing facts from multiple sources. It demonstrates that models can effectively isolate and attribute information from distinct CHODE profiles, making multi-repo applications feasible and robust.

4.  **Next Benchmark:** The next benchmark should focus on **CHODE profile size and density**. Test how increasing the token count or information density within a *single* CHODE profile (e.g., adding more detailed flags, commands, or common issues) impacts accuracy. This would explore the upper limits of a CHODE profile's effectiveness before models begin to struggle with information overload or extraction.

---

## Gemini 2.5 Pro

Here is the follow-up review.

---

1.  **Semantic Scoring

---

## Mistral Large

1. **Semantic scoring**: The +5-point delta confirms the strict scorer isn’t artificially deflating scores, but this only validates *existing* results. The core issue—whether CHODE’s 90% benchmark generalizes beyond its curated test set—remains unresolved. The semantic scorer still operates within the same narrow evaluation framework; it doesn’t test robustness to *unseen* repos, edge cases, or adversarial queries.

2. **Position test**: Inconclusive, but not reassuring. The lack of consistent bias doesn’t rule out *situational* sensitivity (e.g., long contexts, ambiguous queries). The delta of -3 for caddy/gpt-4o suggests position *can* matter, just not predictably. This warrants deeper testing with varied context lengths and query types.

3. **Multi-repo attribution**: 6/6 is a weak signal. The test is too small (6 questions) and lacks stress cases (e.g., overlapping concepts, conflicting facts). It doesn’t prove scalability or resilience to interference. Practical utility hinges on performance with *dozens* of profiles and noisy queries—this test doesn’t address that.

4. **Next benchmark**: Test *generalization*:
   - **Unseen repos**: Evaluate CHODE on 10+ new codebases (not in the original 165) with zero-shot queries.
   - **Adversarial queries**: Test robustness to ambiguous, multi-hop, or misleading questions (e.g., "Does this repo use X, given it uses Y?").
   - **Scalability**: Measure accuracy with 5+ profiles in context, including near-identical repos (e.g., two Python web frameworks).

---

## Llama 4 Maverick

Here's a follow-up review:

1. The semantic scoring result partially addresses my scoring concern by showing that strict matching isn't overly penalizing correct answers. However, the +5 point delta across only 5 files suggests that the scorer is still not fully capturing semantic equivalence. To be more convincing, I would have liked to see a more substantial sample size and a breakdown of the types of paraphrasing that were or weren't captured.

2. The position test result is indeed inconclusive due to the mixed deltas across repos and models. However, it hints that the models might be sensitive to context ordering, and the variability in results could be worth exploring further.

3. The 6/6 multi-repo attribution result is a positive finding, suggesting that CHODE profiles can be used in multi-repo contexts without significant interference. This increases my confidence in CHODE's practical utility, but I'd like to see more comprehensive testing with a larger number of profiles and more diverse attribution questions.

4. The next benchmark should test the robustness of CHODE to adversarial or distracting context. For example, inserting irrelevant or misleading information near the CHODE profile and evaluating the models' ability to maintain accurate attribution. This would help assess CHODE's resilience to real-world context variability.

---

