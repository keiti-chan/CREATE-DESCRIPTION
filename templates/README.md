# Template Structure

The app loads templates through normal browser scripts so `index.html` can still be opened directly.

- `product/product-templates.js` contains product description branches.
- `bundle/bundle-templates.js` contains Bundle tab templates.
- `template-registry.js` combines everything into `window.DESCRIPTION_TEMPLATE_LIBRARY` for `app.js`.

Every supported product branch has seven base plans plus one conditional
visual-first plan. Each plan is a complete, self-contained object: its angle,
heading family, detail placement, detail order, opening, key detail and order
notes travel together. Do not use parallel arrays indexed by variant position.

Visual-first plans must set `requiresColours: true`, so they are never selected
unless the team has entered a confirmed main shirt colour. Player-print plans
must use `detailPlacement: "details"`; plain customisable plans use
`detailPlacement: "options"`. Every plan must be manually approved,
semantically equivalent and selected deterministically.
