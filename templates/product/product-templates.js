(function () {
  const fullKitAudiences = ["kids", "men", "adult", "women", "baby"];
  const shirtAudiences = ["kids", "men", "adult", "women", "baby"];
  const configurations = [
    { key: "plain_customisable", label: "Plain", factory: "custom" },
    { key: "pre_applied_player", label: "Player", factory: "player" }
  ];

  const branchLabels = {};
  const branches = {};

  const customPersonalisation = [
    "<li><strong>Name &amp; number:</strong> Not printed as standard. Personalisation can be added using the product options&mdash;names up to 13 letters and numbers up to 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> The shirt is supplied without a name or number. Add personalisation through the product options&mdash;up to 13 letters and 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> No name or number is applied as standard. You can add personalisation through the product options, with names up to 13 letters and numbers up to 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> Personalisation is not printed as standard. Use the product options to add a name of up to 13 letters and a number of up to 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> Choose the product options if you want to add a name and number&mdash;up to 13 letters and 2 digits.</li>"
  ];

  const customOrderNotes = [
    "<li>Personalised items can't be returned for a change of mind, so please double-check the spelling and number before ordering.</li>",
    "<li>Once a name and number are printed, the item can't be returned for a change of mind&mdash;please check the spelling carefully before ordering.</li>",
    "<li>Please check the spelling and number carefully before ordering. Personalised items can't be returned for a change of mind.</li>",
    "<li>Personalised orders can't be returned for a change of mind. Please check the spelling and number before adding to basket.</li>",
    "<li>Double-check the spelling and number before ordering. Personalised items can't be returned for a change of mind.</li>"
  ];

  const playerPrint = [
    "<li><strong>Player print:</strong> {player_name} name and number {player_number} are already applied to the back and included in this listing.</li>",
    "<li><strong>Player print:</strong> This listing is supplied with {player_name} name and number {player_number} already applied to the back.</li>",
    "<li><strong>Player print:</strong> {player_name} {player_number} is the pre-applied back print included in this listing.</li>",
    "<li><strong>Player print:</strong> The shirt already has {player_name} name and number {player_number} applied to the back.</li>",
    "<li><strong>Player print:</strong> This is the {player_name} {player_number} version, supplied with the back print already included.</li>"
  ];

  const playerPrintConfirmations = [
    "<li>{player_name} name and number {player_number} are already applied to the back, so no name or number needs to be entered.</li>",
    "<li>The {player_name} {player_number} print is already applied to the back; no player details need to be entered at checkout.</li>",
    "<li>This fixed {player_name} {player_number} version arrives with the player print already applied to the back.</li>",
    "<li>{player_name} {player_number} is already on the back of the shirt, so there is no name or number to add.</li>",
    "<li>The shirt is supplied with {player_name} name and number {player_number} already on the back.</li>"
  ];

  const playerOrderNotes = [
    "<li>Additional name-and-number personalisation is not available on this listing.</li>",
    "<li>A different name or number cannot be added to this fixed-print listing.</li>",
    "<li>The player name and number are set for this listing and cannot be changed.</li>",
    "<li>This listing is supplied with a fixed player print; other name-and-number options are not available.</li>",
    "<li>Choose a customisable listing if you need another player name or number.</li>"
  ];

  const materialNotes = [
    "The fabric is designed to be lightweight and quick-drying. Exact fibre composition and fabric feel may vary slightly between production batches.",
    "The fabric is made from polyester and designed to be lightweight and quick-drying. Fibre composition and fabric feel may vary slightly between batches.",
    "Polyester fabric is designed to be lightweight and quick-drying. Minor differences in fibre composition and feel may occur between production runs.",
    "The fabric is designed to be lightweight and quick to dry. Exact fibre composition and fabric feel can vary slightly from batch to batch."
  ];

  const sizingWarnings = {
    kids: [
      "Check your child's measurements against the Size Guide rather than ordering by age alone.",
      "Measure your child and compare with the Size Guide before choosing a size.",
      "Please use the measurements in the Size Guide rather than relying on age alone."
    ],
    adult: [
      "Check your measurements against the Size Guide before choosing a size.",
      "Compare your measurements with the Size Guide before ordering.",
      "Please use the measurements in the Size Guide rather than relying on your usual size."
    ],
    men: [
      "Check your measurements against the Size Guide before choosing a size.",
      "Compare your measurements with the Size Guide before ordering.",
      "Please use the measurements in the Size Guide rather than relying on your usual size."
    ],
    women: [
      "Check your measurements against the Size Guide before choosing a size.",
      "Compare your measurements with the Size Guide before ordering.",
      "Please use the measurements in the Size Guide rather than relying on your usual size."
    ],
    baby: [
      "Check the measurements in the Size Guide before choosing a baby size.",
      "Compare your baby's measurements with the Size Guide before ordering.",
      "Please use the Size Guide measurements rather than relying on age alone."
    ],
    generic: [
      "Check the measurements in the Size Guide before choosing a size.",
      "Compare the measurements with the Size Guide before ordering.",
      "Please use the Size Guide measurements rather than relying on age alone."
    ]
  };

  function branch(variants) {
    return { variants };
  }

  function createVariants(openings, keyLines, beforeLines) {
    return openings.map((opening, index) => ({
      opening: Array.isArray(opening) ? opening[0] : opening,
      openingSecondary: Array.isArray(opening) ? opening[1] : "",
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
      men: {
        label: "men's",
        buyer: "men",
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
    const noSocksLine = "<li>This listing includes the shirt and matching shorts. Socks are not included.</li>";
    return withSocks ? [customOrderNotes[index]] : [noSocksLine, customOrderNotes[index]];
  }

  function playerFullKitBeforeOrder(withSocks, index) {
    const noSocksLine = "<li>This listing includes the shirt and matching shorts. Socks are not included.</li>";
    return withSocks
      ? [playerPrintConfirmations[index], playerOrderNotes[index]]
      : [playerPrintConfirmations[index], noSocksLine, playerOrderNotes[index]];
  }

  function shirtOnlyBeforeOrder(index) {
    return [
      "<li>This is a single-item product. Shorts and socks are not included.</li>",
      customOrderNotes[index]
    ];
  }

  function playerShirtOnlyBeforeOrder(index) {
    return [
      playerPrintConfirmations[index],
      playerOrderNotes[index],
      "<li>This is a single-item product. Shorts and socks are not included.</li>"
    ];
  }

  function customFullKit(audience, withSocks) {
    const includedKitItems = withSocks
      ? "a {sleeve_label} shirt, matching shorts and matching socks"
      : "a {sleeve_label} shirt and matching shorts";
    const noSocksNote = withSocks ? "" : " Socks are not included.";
    const openings = [
      ["{product_name} is supplied with " + includedKitItems + "." + noSocksNote, "It is not printed as standard, so an optional name and number can be added using the product options."],
      ["This {team} {season} {audience_opening_label} {kit_type_label} Kit includes " + includedKitItems + "." + noSocksNote, "The shirt is supplied without a name or number unless you add personalisation using the product options."],
      ["{product_name} brings together " + includedKitItems + "." + noSocksNote, "Optional name-and-number personalisation can be added using the product options."],
      ["The {team} {season} {audience_opening_label} {kit_type_label} Kit is supplied with " + includedKitItems + "." + noSocksNote, "No name or number is applied as standard; personalisation can be added using the product options."],
      ["This {audience_opening_label} {kit_type_label} Kit for {team} includes " + includedKitItems + "." + noSocksNote, "Choose the product options if you would like to add an optional name and number."]
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => fullKitBeforeOrder(withSocks, index))));
  }

  function playerFullKit(audience, withSocks) {
    const includedKitItems = withSocks
      ? "a {sleeve_label} shirt, matching shorts and matching socks"
      : "a {sleeve_label} shirt and matching shorts";
    const noSocksNote = withSocks ? "" : " Socks are not included.";
    const openings = [
      ["{product_name} is supplied with {player_name} name and number {player_number} already applied to the back, plus " + includedKitItems + "." + noSocksNote, "The fixed player print is already applied, so no name or number needs to be entered for this listing."],
      ["This {team} {season} {audience_opening_label} {kit_type_label} Kit is supplied with {player_name} name and number {player_number} already applied to the back, plus " + includedKitItems + "." + noSocksNote, "The player details are already set for this listing, so there is no name or number to enter at checkout."],
      ["{product_name} comes with {player_name} name and number {player_number} already applied to the back, together with " + includedKitItems + "." + noSocksNote, "This is the fixed {player_name} {player_number} version; additional name-and-number personalisation is not available."],
      ["The {team} {season} {audience_opening_label} {kit_type_label} Kit includes {player_name} name and number {player_number} already applied to the back, plus " + includedKitItems + "." + noSocksNote, "The player print is ready on the shirt, so no name or number needs to be entered for this listing."],
      ["This {audience_opening_label} {kit_type_label} Kit for {team} is supplied as the fixed {player_name} {player_number} version with " + includedKitItems + "." + noSocksNote, "The player print is already applied to the back before checkout."]
    ];

    return branch(createVariants(openings, playerPrint, playerPrint.map((_, index) => playerFullKitBeforeOrder(withSocks, index))));
  }

  function customShirtOnly(audience) {
    const shirtOnlyNote = " Shorts and socks are not included.";
    const openings = [
      ["{product_name} is supplied as a {sleeve_label} {product_item_label}." + shirtOnlyNote, "It is not printed as standard, so an optional name and number can be added using the product options."],
      ["This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied as a standalone item." + shirtOnlyNote, "The shirt is supplied without a name or number unless you add personalisation using the product options."],
      ["{product_name} is offered as a standalone {product_item_label}." + shirtOnlyNote, "Optional name-and-number personalisation can be added using the product options."],
      ["The {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied as a single item." + shirtOnlyNote, "No name or number is applied as standard; personalisation can be added using the product options."],
      ["This {audience_opening_label} {kit_type_label} {product_item_label} for {team} is available on its own." + shirtOnlyNote, "Choose the product options if you would like to add an optional name and number."]
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => shirtOnlyBeforeOrder(index))));
  }

  function playerShirtOnly(audience) {
    const shirtOnlyNote = " Shorts and socks are not included.";
    const openings = [
      ["{product_name} is supplied with {player_name} name and number {player_number} already applied to the back." + shirtOnlyNote, "The fixed player print is already applied, so no name or number needs to be entered for this listing."],
      ["This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied with {player_name} name and number {player_number} already applied to the back." + shirtOnlyNote, "The player details are already set for this listing, so there is no name or number to enter at checkout."],
      ["{product_name} is the {player_name} {player_number} version, with the print already applied to the back." + shirtOnlyNote, "This is the fixed {player_name} {player_number} version; additional name-and-number personalisation is not available."],
      ["The {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} comes with {player_name} name and number {player_number} already applied to the back." + shirtOnlyNote, "The player print is ready on the shirt, so no name or number needs to be entered for this listing."],
      ["This {audience_opening_label} {kit_type_label} {product_item_label} for {team} is supplied as the fixed {player_name} {player_number} version." + shirtOnlyNote, "The player print is already applied to the back before checkout."]
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
    branches,
    copyRules: {
      materialNotes,
      sizingWarnings
    }
  };
})();
