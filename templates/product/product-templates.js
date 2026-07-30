(function () {
  const branchLabels = {
    plain_customisable_kids_full_kit_without_socks: "Plain kids full kit - no socks",
    plain_customisable_kids_full_kit_with_socks: "Plain kids full kit - with socks",
    pre_applied_player_kids_full_kit_without_socks: "Player kids full kit - no socks",
    pre_applied_player_kids_full_kit_with_socks: "Player kids full kit - with socks",
    plain_customisable_kids_shirt_only: "Plain kids shirt only",
    pre_applied_player_kids_shirt_only: "Player kids shirt only",
    plain_customisable_adult_shirt_only: "Plain adult shirt only",
    pre_applied_player_adult_shirt_only: "Player adult shirt only"
  };

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
      "<li>This is a shirt-only product. Shorts and socks are not included.</li>",
      customOrderNotes[index]
    ];
  }

  function playerShirtOnlyBeforeOrder(index) {
    return [
      playerOrderNotes[index],
      "<li>A different name or number cannot be added to this product.</li>",
      "<li>This is a shirt-only product. Shorts and socks are not included.</li>"
    ];
  }

  function customFullKit(withSocks) {
    const sockText = withSocks ? "with matching socks included" : "without socks included";
    const openings = [
      "{product_name} is a {season} {kit_type_label} kids football kit for {team}, supplied with the {sleeve_label} shirt and matching shorts " + sockText + ".",
      "This {team} {season} kids {kit_type_label} kit includes the {sleeve_label} shirt and matching shorts" + (withSocks ? ", plus matching socks." : ". Socks are not included."),
      "{product_name} gives young {team} supporters the {season} {kit_type_label} shirt and matching shorts" + (withSocks ? ", completed with matching socks." : ", with socks left out of this product."),
      "The {team} {season} kids {kit_type_label} kit is supplied as a clear set with the {sleeve_label} shirt and matching shorts" + (withSocks ? ", including socks." : ". Socks are not included."),
      "This kids {kit_type_label} kit for {team} covers the main {season} set: shirt and matching shorts" + (withSocks ? ", with socks included." : ", without socks.")
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => fullKitBeforeOrder(withSocks, index))));
  }

  function playerFullKit(withSocks) {
    const openings = [
      "{product_name} is a {season} {kit_type_label} kids football kit for {team}, supplied with {player_name} name and number {player_number} already applied.",
      "This {team} {season} kids {kit_type_label} kit comes with the {player_name} {player_number} print already included.",
      "{product_name} gives young {team} supporters the {season} {kit_type_label} kit with {player_name} {player_number} already printed.",
      "The {team} {season} kids {kit_type_label} kit is supplied with the confirmed {player_name} name and number {player_number} print.",
      "This kids {kit_type_label} kit for {team} includes the shirt, matching shorts" + (withSocks ? " and socks" : "") + " with {player_name} {player_number} already applied to the shirt."
    ];

    return branch(createVariants(openings, playerPrint, playerPrint.map((_, index) => playerFullKitBeforeOrder(withSocks, index))));
  }

  function customShirtOnly(isAdult) {
    const audience = isAdult ? "adult" : "kids";
    const openings = [
      "{product_name} is a {season} {kit_type_label} " + audience + " football shirt for {team}. Shorts and socks are not included.",
      "This {team} {season} " + audience + " {kit_type_label} shirt is supplied on its own, with the {sleeve_label} shirt as the included item.",
      "{product_name} is the " + audience + " shirt-only version of the {team} {season} {kit_type_label} kit.",
      "The {team} {season} " + audience + " {kit_type_label} shirt is available here as a single shirt product.",
      "This {season} {team} " + audience + " {kit_type_label} shirt is for buyers who only need the shirt."
    ];

    return branch(createVariants(openings, customPersonalisation, customPersonalisation.map((_, index) => shirtOnlyBeforeOrder(index))));
  }

  function playerShirtOnly(isAdult) {
    const audience = isAdult ? "adult" : "kids";
    const openings = [
      "{product_name} is a {season} {kit_type_label} " + audience + " football shirt for {team}, supplied with {player_name} name and number {player_number} already applied.",
      "This {team} {season} " + audience + " {kit_type_label} shirt comes with the {player_name} {player_number} print already included.",
      "{product_name} is the " + audience + " shirt-only {player_name} {player_number} version for {team}.",
      "The {team} {season} " + audience + " {kit_type_label} shirt is supplied with the confirmed {player_name} {player_number} print.",
      "This {season} {team} " + audience + " {kit_type_label} shirt is supplied as the fixed {player_name} {player_number} version."
    ];

    return branch(createVariants(openings, playerPrint, playerPrint.map((_, index) => playerShirtOnlyBeforeOrder(index))));
  }

  window.PRODUCT_DESCRIPTION_TEMPLATES = {
    branchLabels,
    branches: {
      plain_customisable_kids_full_kit_without_socks: customFullKit(false),
      plain_customisable_kids_full_kit_with_socks: customFullKit(true),
      pre_applied_player_kids_full_kit_without_socks: playerFullKit(false),
      pre_applied_player_kids_full_kit_with_socks: playerFullKit(true),
      plain_customisable_kids_shirt_only: customShirtOnly(false),
      pre_applied_player_kids_shirt_only: playerShirtOnly(false),
      plain_customisable_adult_shirt_only: customShirtOnly(true),
      pre_applied_player_adult_shirt_only: playerShirtOnly(true)
    }
  };
})();
