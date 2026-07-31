(function () {
  const fullKitAudiences = ["kids", "adult", "women", "baby"];
  const shirtAudiences = ["kids", "adult", "women", "baby"];
  const configurations = [
    { key: "plain_customisable", label: "Plain", factory: "custom" },
    { key: "pre_applied_player", label: "Player", factory: "player" }
  ];

  const branchLabels = {};
  const branches = {};

  const customPersonalisation = [
    "<li><strong>Personalisation:</strong> Add an optional name and number using the product options. KFK supports up to 13 letters for the name and up to 2 digits for the number.</li>",
    "<li><strong>Personalisation:</strong> Custom name-and-number printing is available from the product options. KFK supports up to 13 letters for the name and up to 2 digits for the number.</li>",
    "<li><strong>Personalisation:</strong> You can choose an optional name and number before checkout. KFK supports up to 13 letters for the name and up to 2 digits for the number.</li>",
    "<li><strong>Personalisation:</strong> Name-and-number personalisation can be added if required. KFK supports up to 13 letters for the name and up to 2 digits for the number.</li>",
    "<li><strong>Personalisation:</strong> Select the product options to add a custom name and number. KFK supports up to 13 letters for the name and up to 2 digits for the number.</li>"
  ];

  const customOrderNotes = [
    "<li>Check all spelling and number choices carefully before placing a personalised order.</li>",
    "<li>Review the name spelling and number before checkout if personalisation is selected.</li>",
    "<li>Personalised orders should be checked carefully, as the entered name and number will be used for printing.</li>",
    "<li>Make sure the selected name and number are correct before submitting the order.</li>",
    "<li>Use the product options carefully if adding personalisation.</li>"
  ];

  const playerPrint = [
    "<li><strong>Player print:</strong> The {player_name} name and number {player_number} print is already applied to this product.</li>",
    "<li><strong>Player print:</strong> This product is supplied with {player_name} name and number {player_number} already applied.</li>",
    "<li><strong>Player print:</strong> {player_name} {player_number} is the pre-applied print included with this product.</li>",
    "<li><strong>Player print:</strong> The shirt already has {player_name} name and number {player_number} applied to the back.</li>",
    "<li><strong>Player print:</strong> This is the {player_name} {player_number} version, supplied with the print already included.</li>"
  ];

  const playerOrderNotes = [
    "<li>This product already includes the {player_name} name and number {player_number} print.</li>",
    "<li>The supplied player print is already set on this version.</li>",
    "<li>Choose another customisable product if you need a different player name or number.</li>",
    "<li>The printed name and number are fixed for this product.</li>",
    "<li>This version is supplied as shown with the confirmed player print.</li>"
  ];

  function branch(variants) {
    return { variants };
  }

  function createVariants(openings, keyLines, beforeLines) {
    return openings.map((opening, index) => ({
      opening,
      keyDetail: keyLines[index],
      beforeOrder: beforeLines[index]
    }));
  }

  function audienceCopy(audience) {
    const map = {
      kids: {
        label: "kids",
        buyer: "young supporters",
        owner: "young {team} supporters"
      },
      adult: {
        label: "adult",
        buyer: "adult buyers",
        owner: "{team} supporters"
      },
      women: {
        label: "women's",
        buyer: "women",
        owner: "{team} supporters"
      },
      baby: {
        label: "baby",
        buyer: "babies",
        owner: "little {team} supporters"
      }
    };
    return map[audience] || map.kids;
  }

  function fullKitBeforeOrder(withSocks, index) {
    const inclusionLine = withSocks
      ? "<li>This listing includes the shirt, matching shorts and matching socks.</li>"
      : "<li>This product includes the shirt and matching shorts. Socks are not included.</li>";

    return [inclusionLine, customOrderNotes[index]];
  }

  function playerFullKitBeforeOrder(withSocks, index) {
    const inclusionLine = withSocks
      ? "<li>This listing includes the shirt, matching shorts and matching socks.</li>"
      : "<li>This product includes the shirt and matching shorts. Socks are not included.</li>";

    return [playerOrderNotes[index], "<li>A different name or number cannot be added to this product.</li>", inclusionLine];
  }

  function shirtOnlyBeforeOrder(index) {
    return [
      "<li>This is a single-item product. Shorts and socks are not included.</li>",
      customOrderNotes[index]
    ];
  }

  function playerShirtOnlyBeforeOrder(index) {
    return [
      playerOrderNotes[index],
      "<li>A different name or number cannot be added to this product.</li>",
      "<li>This is a single-item product. Shorts and socks are not included.</li>"
    ];
  }

  function customFullKit(audience, withSocks) {
    const copy = audienceCopy(audience);
    const includedKitItems = withSocks
      ? "a {sleeve_label} shirt, matching shorts and matching socks"
      : "a {sleeve_label} shirt and matching shorts";
    const openings = [
      "{product_name} is supplied with " + includedKitItems + ".",
      "This {team} {season} " + copy.label + " {kit_type_label} kit includes " + includedKitItems + ".",
      "{product_name} brings together " + includedKitItems + ".",
      "The {team} {season} " + copy.label + " {kit_type_label} kit is supplied with " + includedKitItems + ".",
      "This " + copy.label + " {kit_type_label} kit for {team} includes " + includedKitItems + "."
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => fullKitBeforeOrder(withSocks, index))));
  }

  function playerFullKit(audience, withSocks) {
    const copy = audienceCopy(audience);
    const openings = [
      "{product_name} is supplied with {player_name} {player_number} already applied to the shirt.",
      "This {team} {season} " + copy.label + " {kit_type_label} kit is supplied with {player_name} {player_number} already applied to the shirt.",
      "{product_name} comes with {player_name} {player_number} already applied to the shirt.",
      "The {team} {season} " + copy.label + " {kit_type_label} kit includes {player_name} {player_number} already applied to the shirt.",
      "This " + copy.label + " {kit_type_label} kit for {team} is supplied as the fixed {player_name} {player_number} version."
    ];

    return branch(createVariants(openings, playerPrint, playerPrint.map((_, index) => playerFullKitBeforeOrder(withSocks, index))));
  }

  function customShirtOnly(audience) {
    const copy = audienceCopy(audience);
    const openings = [
      "{product_name} is supplied as a {sleeve_label} {product_item_label}.",
      "This {team} {season} " + copy.label + " {kit_type_label} {product_item_label} is supplied as a standalone item.",
      "{product_name} is offered as a standalone {product_item_label}.",
      "The {team} {season} " + copy.label + " {kit_type_label} {product_item_label} is supplied as a single item.",
      "This " + copy.label + " {kit_type_label} {product_item_label} for {team} is available on its own."
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => shirtOnlyBeforeOrder(index))));
  }

  function playerShirtOnly(audience) {
    const copy = audienceCopy(audience);
    const openings = [
      "{product_name} is supplied with {player_name} {player_number} already applied to the back.",
      "This {team} {season} " + copy.label + " {kit_type_label} {product_item_label} is supplied with {player_name} {player_number} already applied to the back.",
      "{product_name} is the {player_name} {player_number} version, with the print already applied to the back.",
      "The {team} {season} " + copy.label + " {kit_type_label} {product_item_label} comes with {player_name} {player_number} already applied to the back.",
      "This " + copy.label + " {kit_type_label} {product_item_label} for {team} is supplied as the fixed {player_name} {player_number} version."
    ];

    return branch(createVariants(openings, playerPrint, playerPrint.map((_, index) => playerShirtOnlyBeforeOrder(index))));
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
