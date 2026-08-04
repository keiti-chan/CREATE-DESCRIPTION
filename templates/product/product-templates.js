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
    "<li><strong>Player print:</strong> The {player_name} name and number {player_number} print is already applied to this product.</li>",
    "<li><strong>Player print:</strong> This product is supplied with {player_name} name and number {player_number} already applied.</li>",
    "<li><strong>Player print:</strong> {player_name} {player_number} is the pre-applied print included with this product.</li>",
    "<li><strong>Player print:</strong> The shirt already has {player_name} name and number {player_number} applied to the back.</li>",
    "<li><strong>Player print:</strong> This is the {player_name} {player_number} version, supplied with the print already included.</li>"
  ];

  const playerOrderNotes = [
    "<li>Additional name-and-number personalisation is not available on this product.</li>",
    "<li>A different name or number cannot be added to this fixed-print version.</li>",
    "<li>The player name and number are set for this listing and cannot be changed.</li>",
    "<li>This product is supplied with a fixed player print; other name-and-number options are not available.</li>",
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

    return [playerOrderNotes[index], inclusionLine];
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
      "<li>This is a single-item product. Shorts and socks are not included.</li>"
    ];
  }

  function customFullKit(audience, withSocks) {
    const copy = audienceCopy(audience);
    const includedKitItems = withSocks
      ? "a {sleeve_label} shirt, matching shorts and matching socks"
      : "a {sleeve_label} shirt and matching shorts";
    const noSocksNote = withSocks ? "" : " Socks are not included.";
    const openings = [
      "{product_name} is supplied with " + includedKitItems + "." + noSocksNote,
      "This {team} {season} {audience_opening_label} {kit_type_label} Kit includes " + includedKitItems + "." + noSocksNote,
      "{product_name} brings together " + includedKitItems + "." + noSocksNote,
      "The {team} {season} {audience_opening_label} {kit_type_label} Kit is supplied with " + includedKitItems + "." + noSocksNote,
      "This {audience_opening_label} {kit_type_label} Kit for {team} includes " + includedKitItems + "." + noSocksNote
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => fullKitBeforeOrder(withSocks, index))));
  }

  function playerFullKit(audience, withSocks) {
    const copy = audienceCopy(audience);
    const noSocksNote = withSocks ? "" : " Socks are not included.";
    const openings = [
      "{product_name} is supplied with {player_name} {player_number} already applied to the shirt." + noSocksNote,
      "This {team} {season} {audience_opening_label} {kit_type_label} Kit is supplied with {player_name} {player_number} already applied to the shirt." + noSocksNote,
      "{product_name} comes with {player_name} {player_number} already applied to the shirt." + noSocksNote,
      "The {team} {season} {audience_opening_label} {kit_type_label} Kit includes {player_name} {player_number} already applied to the shirt." + noSocksNote,
      "This {audience_opening_label} {kit_type_label} Kit for {team} is supplied as the fixed {player_name} {player_number} version." + noSocksNote
    ];

    return branch(createVariants(openings, playerPrint, playerPrint.map((_, index) => playerFullKitBeforeOrder(withSocks, index))));
  }

  function customShirtOnly(audience) {
    const copy = audienceCopy(audience);
    const shirtOnlyNote = " Shorts and socks are not included.";
    const openings = [
      "{product_name} is supplied as a {sleeve_label} {product_item_label}." + shirtOnlyNote,
      "This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied as a standalone item." + shirtOnlyNote,
      "{product_name} is offered as a standalone {product_item_label}." + shirtOnlyNote,
      "The {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied as a single item." + shirtOnlyNote,
      "This {audience_opening_label} {kit_type_label} {product_item_label} for {team} is available on its own." + shirtOnlyNote
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => shirtOnlyBeforeOrder(index))));
  }

  function playerShirtOnly(audience) {
    const copy = audienceCopy(audience);
    const shirtOnlyNote = " Shorts and socks are not included.";
    const openings = [
      "{product_name} is supplied with {player_name} {player_number} already applied to the back." + shirtOnlyNote,
      "This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied with {player_name} {player_number} already applied to the back." + shirtOnlyNote,
      "{product_name} is the {player_name} {player_number} version, with the print already applied to the back." + shirtOnlyNote,
      "The {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} comes with {player_name} {player_number} already applied to the back." + shirtOnlyNote,
      "This {audience_opening_label} {kit_type_label} {product_item_label} for {team} is supplied as the fixed {player_name} {player_number} version." + shirtOnlyNote
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
