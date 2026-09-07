# Evaluation rubric

Adapted from this project's approved paper-analysis prompt. Evaluate suitability for a Principles of Topical Skin Delivery presentation. Complexity and novelty alone do not justify high scores.

## Criteria, in required order

| # | Criterion | Weight | Evaluate |
|---|---|---|---|
| 1 | Original Research | 2 | Original experiments, Methods and Results. |
| 2 | API / Active Ingredient Clarity | 2 | Identity, target skin layer, reported solubility, molecular weight, lipophilicity and stability. |
| 3 | Skin Delivery Problem | 10 | Explicit delivery limitation; list degradation or other secondary problems separately. |
| 4 | Mechanism of Action & Target Site | 8 | Reported biological mechanism and intended site; lower score for missing evidence and identify research needed. |
| 5 | Skin Barrier Analysis | 10 | Relevant physical/biological barriers and connection to the API. |
| 6 | Novel Delivery System | 2 | Advanced carrier type and actual distinguishing properties. |
| 7 | Mechanistic Fit Between API Problem and Delivery System | 8 | API problem → system property → expected delivery mechanism versus measured evidence. |
| 8 | Skin Permeation Study | 20 | Presence and adequacy of the permeation experiment, using the checklist below. |
| 9 | Release Study | 15 | Presence, conditions, controls, kinetics and relationship to permeation. |
| 10 | Control / Comparator Quality | 7 | Free active, matched vehicle, blank carrier, conventional/commercial/reference system as relevant; can effects be attributed to the carrier? |
| 11 | Quantitative Skin Delivery Parameters | 5 | Cumulative amount, Jss, permeability coefficient, lag time, enhancement, retention/deposition and layer distribution; relevance to objective. |
| 12 | Experimental Design Quality | 7 | Variables, formulations, controls, independent replicates, statistics, characterization, stability, safety and mechanism tests. |
| 13 | Critique Potential | 2 | Meaningful strengths, limitations, missing experiments and overinterpretation; high critique potential does not mean high experimental quality. |
| 14 | Alternative Approach Potential | 1 | Plausible alternatives tied to specific limitations, with benefits and tradeoffs. |
| 15 | Cosmetic / Topical Application Suitability | 1 | Supported delivery benefit, safety, irritation, stability, excipients, manufacture, scale, cost, acceptability and practical/regulatory gaps. |

Weights total 100. Runtime names and weights live in [criteria.json](criteria.json). Do not modify weights per paper.

Criterion labels: ≥90 ดีมาก; ≥75 ดี; ≥60 พอใช้; ≥40 ค่อนข้างอ่อน; ≥20 อ่อน; otherwise แทบไม่มี. Every score needs an evidence-based justification; these bands are guidance, not an automatic missing-item counter.

Overall = Σ(score × weight) / 100, displayed to two decimals. Overall bands differ: ≥90 เหมาะมาก ควรเลือก; ≥80 เหมาะมาก มีประเด็นวิจารณ์ดี; ≥70 เหมาะ ใช้ได้ แต่มีบางจุดต้องหา reference เพิ่ม; ≥60 พอใช้ ต้องระวังบาง limitation; ≥50 ไม่ค่อยแนะนำ เว้นแต่มีเหตุผลเฉพาะ; otherwise ไม่แนะนำสำหรับ assignment นี้. Apply thresholds to the displayed two-decimal overall score so its label agrees with the display.

Colors are a third scale: ≥85 green, ≥70 yellow, ≥55 orange, otherwise red. Renderer calculates all three scales.

## Required deep review

- **Research question/design:** objective, independent/dependent variables, controls, formulation comparisons, replicates, statistics, characterization, stability, safety; do experiments answer the question and support the conclusion?
- **Permeation:** cell, skin/model and preparation, receptor medium/volume, area, sink, temperature, dose and dose/area, occlusion, sampling/replacement, duration, n, analysis, validation, integrity and statistics. Classify each: เหมาะสม / พอใช้ / ควรตั้งคำถาม / ข้อมูลไม่พอ. Do not assume that omitted reporting means omitted execution.
- **Release:** membrane, medium, sink, temperature, sampling, profile, kinetics, analysis, comparator, membrane limitations and relationship to permeation. If absent, say so and explain its score impact.
- **Data:** parameters versus objective, comparator adequacy, statistical versus practical meaning, alternative vehicle/excipient explanations, unit/figure/equation consistency and justified calculations. Do not calculate flux or enhancement from incompatible units or unsupported assumptions.
- **Strengths:** 3–6; what was done well → why → effect on credibility.
- **Limitations:** 3–8 consequential points; limitation → importance → effect on conclusion → improvement.
- **Alternatives:** 1–3; principle, limitation addressed, advantages, drawbacks and whether better for this objective. Proposals are not experimental findings.
- **Topical application:** potential advantages, practical concerns, evidence gaps and overall applicability. Avoid converting laboratory proof of concept into product efficacy/safety claims.
- **Presentation:** main critique, figures/tables worth presenting, most important and most questionable experiment, specific supplementary/external sources needed.
- **Final verdict:** ควรเลือก / เลือกได้ / ควรเลือกเฉพาะถ้า… / ไม่แนะนำ, with 3–5 concise reasons. Distinguish suitability for critique from methodological completeness.
