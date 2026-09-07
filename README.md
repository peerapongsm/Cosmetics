# Cosmetics paper appraisal

[index.html](index.html) is the report collection, ranked by suitability score from highest to lowest. Each card opens a full analysis. The original approved report is now [Wang 2024](reports/wang-2024.html).

## Add a report

1. Render the analysis to a unique HTML filename under `reports/` using the skill below.
2. Add its metadata to [reports/catalog.json](reports/catalog.json): `file` (lowercase HTML basename), `title`, `authors` (array), and `publicationDate` (`YYYY-MM-DD`, `YYYY-MM`, `YYYY`, or `null` when unknown). Use the paper's publication date, not the report creation date. Wang's date is its online publication date, 30 January 2024, reported on page 1 of the paper.
3. Run `node scripts/build-collection.cjs`. This rebuilds `index.html`, sorts cards by the scores read from the reports, and adds an “All reports” link to each report. Scores tied at the same percentage sort by paper title. Do not manually edit the generated index; edit [scripts/collection.html](scripts/collection.html) for layout changes.

Open `index.html` directly or serve this directory with any static host. No browser JavaScript, dependencies or server are required. Run `node scripts/check-collection.cjs` to verify ranking, dates, score consistency and catalog validation.

## Reusable skills

- [skin-delivery-report](skills/productivity/skin-delivery-report/SKILL.md) — Evaluate topical skin-delivery papers with evidence citations, 15 weighted criteria and a reusable Thai HTML layout.

Use the skill with a host that supports SKILL.md discovery, or give any file-capable model this prompt:

> Read `skills/productivity/skin-delivery-report/SKILL.md` and follow its workflow to evaluate `path/to/paper.pdf`. Create `reports/paper-author.html` and add it to the collection. Use Thai prose and the bundled renderer.

In Codex, install/copy the skill folder into the host's skills directory to enable `$skin-delivery-report`. Repository packaging alone does not globally install it. In Claude Code, install this directory as a local plugin to expose its registered skill. Models without terminal/file access can draft the input JSON, but rendering and PDF verification require a capable host or a human.

Requirements: Node.js, `markitdown` for PDF-to-Markdown extraction, and a PDF viewer or browser for figure and layout inspection. Caveman, Ponytail and Pordee are not runtime dependencies of the portable skill.

Run the mechanical regression check:

```sh
node skills/productivity/skin-delivery-report/scripts/check.cjs
```

Reproduce the supplied paper into a new file:

```sh
node skills/productivity/skin-delivery-report/scripts/render.cjs skills/productivity/skin-delivery-report/assets/example-wang.json reproduced-report.html
```

Token savings come from reusing the layout and scoring code, keeping references short, and extracting a paper once. No cross-model savings or analytical-equivalence benchmark has been established.

Verification: the example reproduces the approved 68.00% report content, with the overall band explanation generated from the rubric. Mechanical checks cover scoring boundaries, required evidence fields, markup restrictions and navigation. Chrome checks at 390px and 1280px confirmed mobile cards, desktop tables and no page-width overflow. The bundled Python skill validator could not run because its PyYAML dependency is missing; frontmatter, local documentation links and plugin paths were checked separately. The scientific analysis was preserved, not independently re-appraised during packaging.
