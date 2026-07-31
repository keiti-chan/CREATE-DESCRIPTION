# Template Structure

The app loads templates through normal browser scripts so `index.html` can still be opened directly.

- `product/product-templates.js` contains product description branches.
- `bundle/bundle-templates.js` contains Bundle tab templates.
- `template-registry.js` combines everything into `window.DESCRIPTION_TEMPLATE_LIBRARY` for `app.js`.

When adding templates, keep at least five variants for each supported branch.
