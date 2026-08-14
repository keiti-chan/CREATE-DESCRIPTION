# Template Structure

The app loads templates through normal browser scripts so `index.html` can still be opened directly.

- `product/product-templates.js` contains product description branches.
- `bundle/bundle-templates.js` contains Bundle tab templates.
- `template-registry.js` combines everything into `window.DESCRIPTION_TEMPLATE_LIBRARY` for `app.js`.

Keep at least five variants for each supported product branch. A variant must
declare its fact-led `angle` and one approved complete `headingFamily`; do not
create variants by merely swapping synonyms. Visual-first variants must set
`requiresColours: true`, so they are never selected unless the team has entered
a confirmed main shirt colour. Smaller wording pools are acceptable for
controlled facts, but every variant must be manually approved, semantically
equivalent and selected deterministically.
