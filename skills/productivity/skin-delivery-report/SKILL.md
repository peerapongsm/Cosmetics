---
name: skin-delivery-report
description: Evaluate topical skin-delivery research PDFs against a 15-criterion presentation rubric and render a Thai HTML suitability report with evidence citations and weighted scores. Use for paper selection and critical appraisal in Principles of Topical Skin Delivery.
---

# Skin delivery report

Produce one evidence-based HTML report per paper using the bundled, approved layout. Default to Thai prose with English technical terms. This is assignment suitability, not a validated research-quality scale or a clinical recommendation.

## Workflow

1. Identify the main PDF, supplied supplements, and requested output path. Default to `paper_<first-author>_suitability_report.html`. Do not overwrite an existing report. Ask only when the source or intended paper is ambiguous.
2. Extract once: `markitdown "paper.pdf" -o "paper.md"`. Reuse that extraction while the source is unchanged. If markitdown fails, record the failure and use available PDF extraction. Read Methods and Results in full, plus Introduction, Discussion, tables and supplied supplements. Inspect relevant figure pages visually using available PDF/browser tools; extracted text alone cannot verify axes, units, panel labels or captions. State any inaccessible evidence.
3. Read [rubric.md](references/rubric.md) and [report-format.md](references/report-format.md). Build a compact working evidence list: claim, source locator, reported value/units, interpretation, missing information or contradiction. Reuse it throughout the report; do not repeatedly re-read the whole PDF. Inspect source passages again when uncertainty requires it.
4. Write `report.json` following the format. Score each criterion from evidence, with explicit reasoning. Keep reported findings separate from interpretation. Use “ไม่พบข้อมูลใน paper” for information not found in the reviewed material; missing reporting is not proof an experiment was not performed. Never reuse the example paper's claims, numbers, score, date or verdict for a different paper.
5. Run `node "<skill-dir>/scripts/render.cjs" "report.json" "output.html"`. The renderer owns weights, score calculations, rubric labels, overview, detailed evaluation, navigation and responsive CSS. Do not read or regenerate its implementation or template during ordinary use. Content sections use short semantic HTML fragments; no CSS, JavaScript or page scaffolding.
6. Check important numerical claims and source locators against the paper, including figure/text contradictions. Verify that conclusions match target-site evidence, controls and score reasoning. Open the output at approximately 390px and 1280px: check readable Thai, mobile table cards, desktop tables, navigation and overflow. If browser tools are unavailable, report visual verification as unperformed. Deliver the HTML path and material evidence gaps; retain JSON for later edits.

When working in this repository's report collection (`reports/catalog.json` and `scripts/build-collection.cjs` exist), save new reports under `reports/` with a unique lowercase hyphenated HTML filename. Add the title, authors and paper publication date to the catalog, then run `node scripts/build-collection.cjs` from the repository root. This ranks cards from report scores and adds return navigation. Never replace the collection's `index.html` with an individual report. See [report-format.md](references/report-format.md#collection-registration) for catalog fields. In other workspaces, keep the standalone workflow above.

## Evidence discipline

- Cite section/page/figure/table locators for substantive assessments. Do not invent citations, units, sample sizes or missing methods. Do not transfer release conditions into permeation methods.
- Keep author claims, observed measurements, calculations and reviewer hypotheses distinct. Mark general critique: “Interpretation based on skin-delivery principles, not directly reported by the authors.”
- Receptor permeation is not skin-layer deposition; cell activity is not efficacy after topical delivery; physical stability is not chemical stability; pathway expression is not causal mechanism.
- When sources conflict, report both and their locations. Do not silently repair figures, equations or units. Identify figure estimates as approximate and avoid unsupported derived parameters.
- Outside sources cannot fill gaps as though reported by this paper. Follow the host's research requirements; identify any external source separately and distinguish it from paper evidence. Otherwise list needed references as “ให้ไปหาข้อมูล external เสริม”.

## Keep context small

Load only this skill, the two short references and the current paper's evidence. The full [example JSON](assets/example-wang.json) is for regression checks or a targeted formatting question, not default context. Reuse the renderer for every paper. Reassess only affected evidence when revising a report. No dependency on other skills or model-specific tools; a model needs file access, Node.js, PDF extraction and visual inspection capability.

To check the renderer after modifying it: `node "<skill-dir>/scripts/check.cjs"`. This checks mechanics, not scientific correctness. Token savings and equivalent analytical quality across models must be measured with actual runs, not assumed.
