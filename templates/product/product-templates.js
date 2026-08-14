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
    "<li><strong>Name &amp; number:</strong> Not printed as standard. Personalisation can be added using the product options - names up to 13 letters and numbers up to 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> The shirt is supplied without a name or number. Add personalisation through the product options - up to 13 letters and 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> No name or number is applied as standard. You can add personalisation through the product options, with names up to 13 letters and numbers up to 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> Personalisation is not printed as standard. Use the product options to add a name of up to 13 letters and a number of up to 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> Choose the product options if you want to add a name and number - up to 13 letters and 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> Add a name and number in the product options if required. Names can have up to 13 letters and numbers up to 2 digits.</li>",
    "<li><strong>Name &amp; number:</strong> The shirt is supplied plain. Optional personalisation is available in the product options, with up to 13 letters and 2 digits.</li>"
  ];
  const customOrderNotes = [
    "<li>Personalised items can't be returned for a change of mind, so please double-check the spelling and number before ordering.</li>",
    "<li>Once a name and number are printed, the item can't be returned for a change of mind - please check the spelling carefully before ordering.</li>",
    "<li>Please check the spelling and number carefully before ordering. Personalised items can't be returned for a change of mind.</li>",
    "<li>Personalised orders can't be returned for a change of mind. Please check the spelling and number before adding to basket.</li>",
    "<li>Double-check the spelling and number before ordering. Personalised items can't be returned for a change of mind.</li>",
    "<li>Check the name and number before you place a personalised order. Printed items can't be returned for a change of mind.</li>",
    "<li>Before ordering, check the spelling and number carefully. Personalised items can't be returned if you change your mind.</li>"
  ];
  const playerPrint = [
    "<li><strong>Player print:</strong> {player_name} name and number {player_number} are already applied to the back and included in this listing.</li>",
    "<li><strong>Player print:</strong> This listing is supplied with {player_name} name and number {player_number} already applied to the back.</li>",
    "<li><strong>Player print:</strong> {player_name} {player_number} is the pre-applied back print included in this listing.</li>",
    "<li><strong>Player print:</strong> The shirt already has {player_name} name and number {player_number} applied to the back.</li>",
    "<li><strong>Player print:</strong> This is the {player_name} {player_number} version, supplied with the back print already included.</li>",
    "<li><strong>Player print:</strong> The fixed {player_name} name and number {player_number} back print is included in this listing.</li>",
    "<li><strong>Player print:</strong> {player_name} {player_number} is already applied to the back of the shirt for this listing.</li>"
  ];
  const playerPrintConfirmations = [
    "<li>{player_name} name and number {player_number} are already applied to the back, so no name or number needs to be entered.</li>",
    "<li>The {player_name} {player_number} print is already applied to the back; no player details need to be entered at checkout.</li>",
    "<li>This fixed {player_name} {player_number} version arrives with the player print already applied to the back.</li>",
    "<li>{player_name} {player_number} is already on the back of the shirt, so there is no name or number to add.</li>",
    "<li>The shirt is supplied with {player_name} name and number {player_number} already on the back.</li>",
    "<li>The fixed {player_name} {player_number} print is already included on the back of the shirt.</li>",
    "<li>{player_name} name and number {player_number} are set for this listing and already applied to the back.</li>"
  ];
  const playerOrderNotes = [
    "<li>Additional name-and-number personalisation is not available on this listing.</li>",
    "<li>A different name or number cannot be added to this fixed-print listing.</li>",
    "<li>The player name and number are set for this listing and cannot be changed.</li>",
    "<li>This listing is supplied with a fixed player print; other name-and-number options are not available.</li>",
    "<li>Choose a customisable listing if you need another player name or number.</li>",
    "<li>This fixed-print listing cannot be changed to a different player name or number.</li>",
    "<li>A different name or number is not available for this pre-applied player-print listing.</li>"
  ];
  const materialNotes = [
    "The fabric is designed to be lightweight and quick-drying. Exact fibre composition and fabric feel may vary slightly between production batches.",
    "The fabric is made from polyester and designed to be lightweight and quick-drying. Fibre composition and fabric feel may vary slightly between batches.",
    "Polyester fabric is designed to be lightweight and quick-drying. Minor differences in fibre composition and feel may occur between production runs.",
    "The fabric is designed to be lightweight and quick to dry. Exact fibre composition and fabric feel can vary slightly from batch to batch."
  ];
  const sizingWarnings = {
    kids: ["Check your child's measurements against the Size Guide rather than ordering by age alone.", "Measure your child and compare with the Size Guide before choosing a size.", "Please use the measurements in the Size Guide rather than relying on age alone."],
    adult: ["Check your measurements against the Size Guide before choosing a size.", "Compare your measurements with the Size Guide before ordering.", "Please use the measurements in the Size Guide rather than relying on your usual size."],
    men: ["Check your measurements against the Size Guide before choosing a size.", "Compare your measurements with the Size Guide before ordering.", "Please use the measurements in the Size Guide rather than relying on your usual size."],
    women: ["Check your measurements against the Size Guide before choosing a size.", "Compare your measurements with the Size Guide before ordering.", "Please use the measurements in the Size Guide rather than relying on your usual size."],
    baby: ["Check the measurements in the Size Guide before choosing a baby size.", "Compare your baby's measurements with the Size Guide before ordering.", "Please use the Size Guide measurements rather than relying on age alone."],
    generic: ["Check the measurements in the Size Guide before choosing a size.", "Compare the measurements with the Size Guide before ordering.", "Please use the Size Guide measurements rather than relying on age alone."]
  };

  function approvedCopy(pool, index, label) {
    const value = pool[index];
    if (!value) throw new Error(`Missing approved ${label} copy for plan ${index + 1}.`);
    return value;
  }

  function plainPlan(plan, kind, withSocks) {
    const noSocks = kind === "kit" && !withSocks;
    const keyDetail = approvedCopy(customPersonalisation, plan.copyIndex, "plain personalisation");
    const changeOfMind = approvedCopy(customOrderNotes, plan.copyIndex, "plain order-note");
    return {
      ...plan,
      detailPlacement: "options",
      keyDetail,
      beforeOrder: kind === "shirt"
        ? ["<li>This is a single-item product. Shorts and socks are not included.</li>", changeOfMind]
        : noSocks
          ? ["<li>This listing includes the shirt and matching shorts. Socks are not included.</li>", changeOfMind]
          : [changeOfMind]
    };
  }

  function playerPlan(plan, kind, withSocks) {
    const noSocks = kind === "kit" && !withSocks;
    const keyDetail = approvedCopy(playerPrint, plan.copyIndex, "player-print");
    const confirmation = approvedCopy(playerPrintConfirmations, plan.copyIndex, "player confirmation");
    const fixedPrint = approvedCopy(playerOrderNotes, plan.copyIndex, "player order-note");
    return {
      ...plan,
      detailPlacement: "details",
      keyDetail,
      beforeOrder: kind === "shirt"
        ? [confirmation, fixedPrint, "<li>This is a single-item product. Shorts and socks are not included.</li>"]
        : noSocks
          ? [confirmation, "<li>This listing includes the shirt and matching shorts. Socks are not included.</li>", fixedPrint]
          : [confirmation, fixedPrint]
    };
  }

  function fullKitPlans(type, withSocks) {
    const items = withSocks ? "a {sleeve_label} shirt, matching shorts and matching socks" : "a {sleeve_label} shirt and matching shorts";
    const noSocks = withSocks ? "" : " Socks are not included.";
    const isPlayer = type === "player";
    const fixed = isPlayer ? "the fixed {player_name} {player_number} version" : "supplied plain, with no name or number applied";
    const configurationSentence = isPlayer
      ? "The player print is already applied to the back and cannot be changed."
      : "Personalisation can be selected in the product options.";
    const wrap = isPlayer ? playerPlan : plainPlan;
    const plans = [
      { angle: isPlayer ? "player_print_first" : "contents_first", headingFamily: isPlayer ? "buyer" : "direct", detailsOrder: isPlayer ? "key_first" : "standard", copyIndex: 0, opening: isPlayer ? "{product_name} is supplied with {player_name} name and number {player_number} already applied to the back, plus " + items + "." + noSocks : "{product_name} is supplied with " + items + "." + noSocks, openingSecondary: isPlayer ? "The fixed player print is already applied, so no name or number needs to be entered for this listing." : "It is not printed as standard, so an optional name and number can be added using the product options." },
      { angle: isPlayer ? "contents_first" : "personalisation_first", headingFamily: isPlayer ? "direct" : "buyer", detailsOrder: isPlayer ? "standard" : "identity", copyIndex: 1, opening: isPlayer ? "This {team} {season} {audience_opening_label} {kit_type_label} Kit includes " + items + "." + noSocks : "The {team} {season} {audience_opening_label} {kit_type_label} Kit is supplied without a name or number as standard. Personalisation can be added using the product options.", openingSecondary: isPlayer ? "{player_name} name and number {player_number} are already applied to the back for this fixed-print listing." : "Your order includes " + items + "." + noSocks },
      { angle: isPlayer ? "ordering_expectation_first" : "kit_identity_first", headingFamily: "buyer", detailsOrder: isPlayer ? "key_first" : "identity", copyIndex: 2, opening: isPlayer ? "{player_name} name and number {player_number} are already applied to the back of this {team} {season} {audience_opening_label} {kit_type_label} Kit." : "This {team} {season} {audience_opening_label} {kit_type_label} Kit brings together " + items + "." + noSocks, openingSecondary: isPlayer ? "It is supplied with " + items + "." + noSocks + " A different name or number cannot be added." : "Choose the product options if you would like to add an optional name and number." },
      { angle: withSocks ? "ordering_expectation_first" : "no_socks_first", headingFamily: "direct", detailsOrder: "identity", copyIndex: 3, opening: withSocks ? "This {audience_opening_label} {kit_type_label} Kit for {team} is " + fixed + " and supplied as a full kit with " + items + "." : "This {audience_opening_label} {kit_type_label} Kit for {team} is " + fixed + ", supplied with a shirt and matching shorts. Socks are not included.", openingSecondary: isPlayer ? "The player print is already applied to the back before checkout." : "No name or number is applied as standard; personalisation can be added using the product options." },
      { angle: "sleeve_first", headingFamily: "buyer", detailsOrder: "sleeve_first", copyIndex: 4, opening: "The {sleeve_label} shirt is supplied with matching shorts" + (withSocks ? " and matching socks" : "") + " as part of this {team} {season} {audience_opening_label} {kit_type_label} Kit." + noSocks, openingSecondary: isPlayer ? "It is " + fixed + ", with the player print already applied to the back." : "Optional name-and-number personalisation can be added using the product options." },
      { angle: "size_first", headingFamily: "direct", detailsOrder: "size_first", sizingPlacement: "first", copyIndex: 5, opening: "Available in {visible_size_range}, this {team} {season} {audience_opening_label} {kit_type_label} Kit is supplied with " + items + "." + noSocks, openingSecondary: isPlayer ? "It is " + fixed + ", with the back print already applied." : "Add an optional name and number using the product options if required." },
      { angle: isPlayer ? "kit_identity_first" : "configuration_first", headingFamily: "buyer", detailsOrder: "kit_first", copyIndex: 6, opening: "This {team} {season} {audience_opening_label} {kit_type_label} Kit is " + fixed + ". It includes " + items + "." + noSocks, openingSecondary: configurationSentence },
      { angle: "visual_first", headingFamily: "direct", detailsOrder: "colours_first", requiresColours: true, copyIndex: 0, opening: "{main_colours_opening_intro}. This {team} {season} {audience_opening_label} {kit_type_label} Kit is supplied with " + items + "." + noSocks, openingSecondary: isPlayer ? "The shirt already has {player_name} name and number {player_number} applied to the back." : "No name or number is applied as standard; personalisation can be added using the product options." }
    ];
    return plans.map((plan) => wrap(plan, "kit", withSocks));
  }

  function shirtPlans(type) {
    const isPlayer = type === "player";
    const fixed = "the fixed {player_name} {player_number} version";
    const wrap = isPlayer ? playerPlan : plainPlan;
    const plans = [
      { angle: isPlayer ? "player_print_first" : "shirt_only_first", headingFamily: isPlayer ? "buyer" : "direct", detailsOrder: isPlayer ? "key_first" : "standard", copyIndex: 0, opening: isPlayer ? "{product_name} is supplied with {player_name} name and number {player_number} already applied to the back. Shorts and socks are not included." : "{product_name} is supplied as a {sleeve_label} {product_item_label}. Shorts and socks are not included.", openingSecondary: isPlayer ? "The fixed player print is already applied, so no name or number needs to be entered for this listing." : "It is not printed as standard, so an optional name and number can be added using the product options." },
      { angle: isPlayer ? "shirt_only_first" : "personalisation_first", headingFamily: isPlayer ? "direct" : "buyer", detailsOrder: isPlayer ? "standard" : "identity", copyIndex: 1, opening: isPlayer ? "This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied as a standalone item. Shorts and socks are not included." : "The {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied without a name or number as standard. Personalisation can be added using the product options.", openingSecondary: isPlayer ? "It comes with {player_name} name and number {player_number} already applied to the back." : "It is a standalone {product_item_label}. Shorts and socks are not included." },
      { angle: isPlayer ? "ordering_expectation_first" : "kit_identity_first", headingFamily: "buyer", detailsOrder: isPlayer ? "key_first" : "identity", copyIndex: 2, opening: isPlayer ? "{player_name} name and number {player_number} are already applied to the back of this {team} {season} {audience_opening_label} {kit_type_label} {product_item_label}." : "This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied as a standalone item. Shorts and socks are not included.", openingSecondary: isPlayer ? "This is a single-item listing; shorts and socks are not included, and a different name or number cannot be added." : "Choose the product options if you would like to add an optional name and number." },
      { angle: "shirt_only_expectation_first", headingFamily: "direct", detailsOrder: "identity", copyIndex: 3, opening: "This {audience_opening_label} {kit_type_label} {product_item_label} for {team} is supplied on its own. Shorts and socks are not included.", openingSecondary: isPlayer ? "The fixed {player_name} {player_number} print is already applied to the back of the shirt." : "No name or number is applied as standard; personalisation can be added using the product options." },
      { angle: "sleeve_first", headingFamily: "buyer", detailsOrder: "sleeve_first", copyIndex: 4, opening: "This {team} {season} {audience_opening_label} {kit_type_label} listing is supplied as a {sleeve_label} {product_item_label}. Shorts and socks are not included.", openingSecondary: isPlayer ? "It is " + fixed + ", with the player print already applied." : "Optional name-and-number personalisation can be added using the product options." },
      { angle: "size_first", headingFamily: "direct", detailsOrder: "size_first", sizingPlacement: "first", copyIndex: 5, opening: "Available in {visible_size_range}, this {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied on its own. Shorts and socks are not included.", openingSecondary: isPlayer ? "The fixed {player_name} name and number {player_number} are already applied to the back." : "Add an optional name and number using the product options if required." },
      { angle: isPlayer ? "kit_identity_first" : "configuration_first", headingFamily: "buyer", detailsOrder: "kit_first", copyIndex: 6, opening: isPlayer ? "This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is " + fixed + ". Shorts and socks are not included." : "This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied plain, with no name or number applied. Shorts and socks are not included.", openingSecondary: isPlayer ? "The player name and number are already applied to the back and cannot be changed." : "Personalisation can be selected in the product options." },
      { angle: "visual_first", headingFamily: "direct", detailsOrder: "colours_first", requiresColours: true, copyIndex: 0, opening: "The main shirt colour is {main_shirt_colour}. This {team} {season} {audience_opening_label} {kit_type_label} {product_item_label} is supplied on its own. Shorts and socks are not included.", openingSecondary: isPlayer ? "The shirt already has {player_name} name and number {player_number} applied to the back." : "No name or number is applied as standard; personalisation can be added using the product options." }
    ];
    return plans.map((plan) => wrap(plan, "shirt", false));
  }

  function addBranch(key, label, variants) {
    branchLabels[key] = label;
    branches[key] = { variants };
  }

  fullKitAudiences.forEach((audience) => configurations.forEach((config) => {
    const label = `${config.label} ${audience}`;
    const type = config.factory === "custom" ? "plain" : "player";
    addBranch(`${config.key}_${audience}_full_kit_without_socks`, `${label} full kit - no socks`, fullKitPlans(type, false));
    addBranch(`${config.key}_${audience}_full_kit_with_socks`, `${label} full kit - with socks`, fullKitPlans(type, true));
  }));
  shirtAudiences.forEach((audience) => configurations.forEach((config) => {
    const label = `${config.label} ${audience}`;
    const type = config.factory === "custom" ? "plain" : "player";
    addBranch(`${config.key}_${audience}_shirt_only`, `${label} shirt only`, shirtPlans(type));
  }));

  window.PRODUCT_DESCRIPTION_TEMPLATES = { branchLabels, branches, copyRules: { materialNotes, sizingWarnings } };
})();
