(function () {
  const productTemplates = window.PRODUCT_DESCRIPTION_TEMPLATES || {};
  const bundleTemplates = window.BUNDLE_DESCRIPTION_TEMPLATES || {};

  window.DESCRIPTION_TEMPLATE_LIBRARY = {
    branchLabels: productTemplates.branchLabels || {},
    branches: productTemplates.branches || {},
    bundle: {
      label: bundleTemplates.label || "Bundle description",
      branchLabels: bundleTemplates.branchLabels || {},
      branches: bundleTemplates.branches || {},
      variants: bundleTemplates.variants || []
    }
  };
})();
