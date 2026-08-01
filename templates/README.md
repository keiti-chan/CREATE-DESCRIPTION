# Template Structure

The app loads templates through normal browser scripts, so `index.html` can be
opened directly without a build step.

- `product/product-templates.js` contains product description branches.
- `bundle/bundle-templates.js` contains bundle templates.
- `template-registry.js` combines both families into
  `window.DESCRIPTION_TEMPLATE_LIBRARY` for `app.js`.

## Product templates

Use one strong, canonical version per meaningful product configuration. Do not
add alternate wording merely to create variation; the product facts provide the
useful differences between listings.

Create a new branch only when customer-facing behaviour changes, for example:

- full kit versus shirt only;
- socks included versus unavailable;
- plain customisable versus fixed player print; or
- a separately approved audience, product family or era.

Keep each sentence tied to a verified fact or a genuine order safeguard.
`verified_design_detail` is optional and is handled by `app.js`; leave it blank
when it is not confirmed.

For KFK no-socks products, list only received items under **What’s Included**.
State `Socks are not included` in the opening and **Before You Order**.

For fixed player-print products, give each mention a different job:

- **What’s Included:** identifies the printed shirt the buyer receives.
- **Player print:** confirms that configuration is included in the listing.
- **Before You Order:** makes clear that another name or number cannot be added.

## Bundle templates

Bundle copy is currently retained separately and still has its own variation
behaviour. Do not change it as part of product-template work unless the bundle
rules have been separately reviewed.
