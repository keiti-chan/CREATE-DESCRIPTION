(function () {
  const fullKitAudiences = ["kids", "women", "baby"];
  const shirtAudiences = ["kids", "adult", "women", "baby"];
  const configurations = [
    { key: "plain_customisable", label: "Plain", factory: "custom" },
    { key: "pre_applied_player", label: "Player", factory: "player" }
  ];

  const branchLabels = {};
  const branches = {};

  const customPersonalisation =
    "<li><strong>Personalisation:</strong> Add an optional name and number using the product options.</li>";

  const customOrderNote =
    "<li>If you add personalisation, check the spelling carefully. Names can contain up to 13 letters and numbers up to 2 digits.</li>";

  const playerPrint =
    "<li><strong>Player print:</strong> {player_name} name and number {player_number} are already applied to the back of the shirt.</li>";

  const playerOrderNotes = [
    "<li>This listing already includes the {player_name} name and number {player_number}.</li>",
    "<li>Additional name-and-number personalisation is not available on this product.</li>"
  ];

  function branch(opening, keyDetail, beforeOrder) {
    return {
      variants: [{ opening, keyDetail, beforeOrder }]
    };
  }

  function fullKitBeforeOrder(withSocks) {
    const inclusionLine = withSocks
      ? "<li>This listing includes the shirt, matching shorts and matching socks.</li>"
      : "<li>This listing includes the shirt and matching shorts. Socks are not included.</li>";

    return [inclusionLine, customOrderNote];
  }

  function playerFullKitBeforeOrder(withSocks) {
    const inclusionLine = withSocks
      ? "<li>This listing includes the shirt, matching shorts and matching socks.</li>"
      : "<li>This listing includes the shirt and matching shorts. Socks are not included.</li>";

    return [...playerOrderNotes, inclusionLine];
  }

  function shirtOnlyBeforeOrder() {
    return [
      "<li>This is a shirt-only product. Shorts and socks are not included.</li>",
      customOrderNote
    ];
  }

  function playerShirtOnlyBeforeOrder() {
    return [
      ...playerOrderNotes,
      "<li>This is a shirt-only product. Shorts and socks are not included.</li>"
    ];
  }

  function customFullKit(audience, withSocks) {
    const opening = withSocks
      ? "The {product_name} comes with a {sleeve_label} shirt, matching shorts and matching socks."
      : "The {product_name} comes with a {sleeve_label} shirt and matching shorts. Socks are not included.";

    return branch(opening, customPersonalisation, fullKitBeforeOrder(withSocks));
  }

  function playerFullKit(audience, withSocks) {
    const opening = withSocks
      ? "The {product_name} comes with a {sleeve_label} shirt, matching shorts and matching socks. The {player_name} name and number {player_number} are already applied to the back of the shirt."
      : "The {product_name} comes with a {sleeve_label} shirt and matching shorts. Socks are not included. The {player_name} name and number {player_number} are already applied to the back of the shirt.";

    return branch(opening, playerPrint, playerFullKitBeforeOrder(withSocks));
  }

  function customShirtOnly(audience) {
    return branch(
      "The {product_name} is a {sleeve_label} shirt-only listing. Shorts and socks are not included.",
      customPersonalisation,
      shirtOnlyBeforeOrder()
    );
  }

  function playerShirtOnly(audience) {
    return branch(
      "The {product_name} is a {sleeve_label} shirt-only listing. The {player_name} name and number {player_number} are already applied to the back of the shirt.",
      playerPrint,
      playerShirtOnlyBeforeOrder()
    );
  }

  function addBranch(key, label, config, factory) {
    branchLabels[key] = label;
    branches[key] = factory;
  }

  fullKitAudiences.forEach((audience) => {
    configurations.forEach((config) => {
      const labelPrefix = config.label + " " + audience;
      addBranch(`${config.key}_${audience}_full_kit_without_socks`, `${labelPrefix} full kit - no socks`, config, config.factory === "custom" ? customFullKit(audience, false) : playerFullKit(audience, false));
      addBranch(`${config.key}_${audience}_full_kit_with_socks`, `${labelPrefix} full kit - with socks`, config, config.factory === "custom" ? customFullKit(audience, true) : playerFullKit(audience, true));
    });
  });

  shirtAudiences.forEach((audience) => {
    configurations.forEach((config) => {
      const labelPrefix = config.label + " " + audience;
      addBranch(`${config.key}_${audience}_shirt_only`, `${labelPrefix} shirt only`, config, config.factory === "custom" ? customShirtOnly(audience) : playerShirtOnly(audience));
    });
  });

  window.PRODUCT_DESCRIPTION_TEMPLATES = {
    branchLabels,
    branches
  };
})();
