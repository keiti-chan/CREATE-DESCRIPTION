# CREATE-DESCRIPTION - Agent Instructions

## Purpose and scope

This repository is a small static browser tool for preparing KFK football-product-description drafts and a readable fact audit. It does **not** publish to WooCommerce, verify supplier facts, or replace human approval.

Before changing product-copy logic, read `README.md`, `templates/README.md`, `app.js`, and the relevant template module. Use the fact-first Description Engine workflow for any copy, template, or audit change.

## Content safety - non-negotiable

- Generate copy only from confirmed product facts. If a critical fact is missing or conflicts, preserve or add an audit block/review state; never make up a fallback fact.
- Do not invent claims about authenticity, licensing, fit, exact fibre composition, performance, care, delivery, returns, personalisation, included items, or badges.
- Use British English and an ASCII hyphen (`-`), not an em dash.
- Keep generated HTML limited to the existing approved tags and patterns. Do not add JSON-LD or global site policy copy to a product description.
- Keep prices out of generated descriptions. Badge price is controlled by WooCommerce product options, not this tool.
- The product title alone is not evidence of included items. Product selection and confirmed facts decide the copy.

## Confirmed KFK rules

- `Fan version` and `Polyester` are fixed facts. Do not turn these into unsupported claims such as exact percentages, breathability, authenticity, or match-spec quality.
- For a full kit without socks, list only the supplied items in the inclusion section. State that socks are not included in the opening and the final order note.
- Shirt-only products must not show or describe shorts colours. Make clear that shorts and socks are not included.
- A Baby Bodysuit is one item. Never infer matching shorts or socks because a legacy title says "Baby Football Kit".
- Plain products may show name-and-number personalisation as an option. A fixed-player product must show the confirmed print as a product detail, must not offer a different print, and omits the options section when no badge is available.
- Show a sleeve-badge line only when the product is confirmed as badge-available and its league label has been supplied. Use the existing canonical league mappings; do not create duplicate badge names.

## Diversity without fact drift

- Keep the approved fact-led plans: seven base plans plus the colour-led visual plan only when a confirmed shirt colour exists.
- A plan must differ by buyer angle and information order, not only swapped words. The facts, inclusions, policies, and required warnings must remain semantically identical.
- Keep each plan self-contained. Do not reintroduce parallel arrays or use modulo/fallback text that silently repeats or omits a required line.
- Preserve the approved heading families and section order for each plan unless the change is intentionally reviewed as a new plan.

## Implementation expectations

- This is a dependency-free static tool. Do not add a framework, build system, or external service without explicit approval.
- When changing a supported product configuration, update all relevant layers together: UI fields, normalisation/detection, templates, audit rules, documentation, and browser tests.
- Do not change Bundle mode as a side effect of Product mode work; it remains a separate prototype.
- Use `apply_patch` for source edits. Preserve unrelated working-tree changes.

## Verification and handoff

- Run `git diff --check` after edits.
- Test the affected flow in a local browser, then regression-test at least: a standard kids kit, a no-socks kit, a shirt-only item, a fixed-player item, and badge available/unavailable behaviour when relevant.
- Confirm generated HTML is readable, the audit passes for confirmed sample facts, and browser console errors are absent.
- Update `README.md` and `templates/README.md` when branch behaviour, inputs, copy rules, or testing expectations change.
- Do not update WooCommerce or live listings from this repository. A human must approve the final output and perform the publishing workflow.
