# Report input

Write UTF-8 JSON. Paths in commands are relative to the calling workspace; `<skill-dir>` is the folder containing SKILL.md. Node.js uses only built-in modules; no npm installation or build step.

Required top-level fields:

- `title`: browser title, e.g. author/year and report type; plain text.
- `paperTitle`: actual paper title; plain text.
- `metadata`: authors, journal, year, DOI if reported; HTML fragment.
- `summaryCaution`: short case-specific qualification beside the calculated score; plain text.
- `criteria`: exactly 15 objects in rubric order. Each contains numeric `score` (0–100) and nonempty plain-text `reported`, `assessment`, `interesting`, `caution`, `missing`, `evidence`. Do not supply weights, names or precomputed overall scores. When there is no identified gap, say so rather than leaving `missing` empty.
- `sections`: object containing all 12 keys below; each value is a nonempty semantic HTML fragment.
- `footer`: source identity and actual verification scope; HTML fragment. Never claim a check that was not performed.

The renderer generates the cover, navigation, score overview, 15 detailed evaluations, fixed section headings, formula, overall label and CSS. It escapes plain-text fields. Do not escape them in JSON beyond normal JSON quoting.

## Content sections

| Key | Content |
|---|---|
| `summary` | 1–2 paragraphs; what the paper does, API/system, main strength/weakness, choice rationale. Add an evidence-scope note, supplied/missing supplements, actual review date and interpretation disclaimer. |
| `logic` | Six flow cards: API, problem, barrier, system, expected mechanism, observed evidence; assess strength of the chain. |
| `design` | Research question, then design review table. |
| `permeation` | Full method review table; parameter, paper condition, assessment, critique. |
| `release` | Presence, critique, conditions table and score impact; absent study still needs explicit discussion. |
| `data` | Parameters, reported values, interpretation/gaps, meaningful contradictions and alternative explanations. |
| `strengths` | 3–6 cards. |
| `critique` | 3–8 limitation cards. |
| `alternatives` | 1–3 rows; alternative, why it may help, advantages, limitations, better than current system? |
| `topical` | Four cards: advantages, concerns, gaps, applicability. |
| `presentation` | Main critique, figures/tables, experiment priorities and references to obtain. |
| `verdict` | Recommendation, 3–5 reasons, `<p class="big {{scoreColor}}" style="font-size:38px">Overall Score: {{score}}%</p><p>{{overallMeaning}}</p>`. |

## Fragment vocabulary

Use only `p strong em br div article h3 ul li table thead tbody tr th td a`. Attributes: `class`, `scope="row|col"`, `data-label`, DOI-only `href` (or `#top`), and the verdict's exact `style="font-size:38px"`. No scripts, images, IDs, event handlers, arbitrary links or custom CSS. Source locators can be plain bracketed text. Escape literal `&`, `<`, `>` and quotes in HTML text/attributes. Close and nest all tags correctly; `<br>` is void.

Use existing classes: `note`, `evidence`, `meta`, `cards`, `card`, `flow`, `table-wrap`. Patterns:

```html
<div class="note"><strong>ขอบเขตหลักฐาน:</strong> …</div>
<div class="cards"><article class="card"><h3>…</h3><p>… [§2.6; Fig. 1]</p></article></div>
<div class="flow"><div class="card"><h3>1 · API</h3><p>…</p></div></div>
<div class="table-wrap"><table><thead><tr><th scope="col">Parameter</th><th scope="col">Assessment</th></tr></thead><tbody><tr><th scope="row" data-label="Parameter">…</th><td data-label="Assessment">…</td></tr></tbody></table></div>
```

Every body table cell needs `data-label` matching its column heading: mobile renders labeled cards, while desktop renders tables. Use JSON escaping for the attribute quotes. Never include the outer page or section wrapper.

Available placeholders inside fragments: `{{score}}`, `{{scoreColor}}`, `{{overallMeaning}}`, `{{criterion1Score}}` through `{{criterion15Score}}`, and `{{criterion1Contribution}}` through `{{criterion15Contribution}}`. Contributions are weighted percentage points. Use these when repeating scores; do not hard-code them in prose.

## Run and revise

```sh
node "<skill-dir>/scripts/render.cjs" report.json report.html
node "<skill-dir>/scripts/check.cjs"
```

The output must not already exist; use a new filename for a revision. Edits belong in JSON, followed by rendering again. The renderer validates input shape and permitted markup; the author still verifies evidence, completeness and browser appearance. The bundled example is a reproduction fixture, not the expected answer for a new paper. Read it only for a targeted example, not as default context.

## Collection registration

In the Cosmetics collection repository, render to `reports/<unique-paper-slug>.html` and append a record to `reports/catalog.json`:

```json
{
  "file": "paper-author-year.html",
  "title": "Actual paper title",
  "authors": ["First Author", "Second Author"],
  "publicationDate": "2024-01-30"
}
```

Use the publication date reported by the paper or verified publisher metadata. Preserve known precision: `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`; use `null` if unknown. Do not substitute the analysis date, acceptance date or an invented day/month. Do not add a score to the catalog: the collection builder reads it from the report and checks cover/final-score consistency.

Run `node scripts/build-collection.cjs` from the repository root after registration or score changes. It adds return navigation and generates the ranked collection index. Verify the new card opens the correct report and “All reports” returns to the collection. No separate collection tools are needed for standalone reports outside this repository.
