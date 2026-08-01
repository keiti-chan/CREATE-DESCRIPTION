# CREATE-DESCRIPTION

A small, static description builder for KFK 2026/27 football-kit listings. It
turns verified product facts into consistent, customer-facing HTML and a
readable audit result.

It is a drafting and checking tool. It does not publish to WooCommerce, verify
supplier claims, or replace human approval.

## Start here

There is nothing to install. Open [`index.html`](./index.html) in a browser.

1. Stay in **Product** mode for individual products.
2. Enter only confirmed facts: product identity, contents, socks status, sizes
   and the correct print configuration.
3. Add a verified design detail only when the image or approved record supports
   it. Leave it blank when unsure.
4. Select **Generate**.
5. Check the Preview, HTML and Audit tabs before copying the HTML into a
   human-review workflow.

The **Load sample** button is for testing the builder only. Do not use sample
facts as evidence for a real product.

## What the builder checks

- full kit versus shirt-only contents;
- socks included, unavailable or not applicable;
- plain customisable versus fixed player-print listings;
- visible size range and Size Guide wording;
- required player name and number for fixed-print products; and
- unsupported claims and unsafe HTML.

For KFK no-socks products, **What’s Included** lists only the shirt and
matching shorts. `Socks are not included` appears in the opening and **Before
You Order**, where customers are most likely to need the warning.

## Product copy approach

Product descriptions use one clear pattern for each meaningful configuration:

1. Plain full kit, socks included
2. Plain full kit, no socks
3. Player-print full kit, socks included
4. Player-print full kit, no socks
5. Plain shirt only
6. Player-print shirt only

The copy changes with real facts such as the product name, included pieces,
size range, player print and optional verified design detail. It does not rotate
phrases simply to make similar listings look different.

Women’s and baby inputs are available in the form, but their broader KFK rollout
and product-fact validation are separate work. Do not treat an available input
as approval to publish a listing.

## Before approving a real description

Use this short check:

- The product name, team, season and product type match the listing.
- The included items and socks status match the final product configuration.
- The visible size range matches the selectable sizes and the Size Guide is
  present on the product page.
- A fixed player listing has the exact name and number, and offers no additional
  name-and-number personalisation.
- Optional visual wording is genuinely verified.
- The Audit tab has no blockers.

## Project structure

```text
index.html                         App layout and fact-input form
styles.css                         Interface styling
app.js                             Fact normalisation, branch selection, HTML rendering and audit
templates/product/                 Product copy patterns
templates/bundle/                  Existing bundle copy patterns
templates/template-registry.js     Makes both template families available to the app
```

See [`templates/README.md`](./templates/README.md) before changing template
copy or adding a branch.

## Scope and ownership

Keep detailed sizing, delivery, returns, care and general personalisation policy
in their approved site components rather than repeating them in each
description. The KFK content knowledge base remains the source of truth for
claim safety and publishing approval.

Bundles remain in the prototype, but bundle content is intentionally outside
the current product-template rewrite.
