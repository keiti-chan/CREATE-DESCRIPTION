(function () {
  const branchLabels = {
    mixed_bundle: "Mixed bundle",
    kit_bundle_with_socks: "Kit bundle - with socks",
    kit_bundle_no_socks: "Kit bundle - no socks",
    shirt_bundle: "Shirt bundle",
    printed_bundle: "Printed bundle"
  };

  function branch(variants) {
    return { variants };
  }

  window.BUNDLE_DESCRIPTION_TEMPLATES = {
    label: "Bundle description",
    branchLabels,
    branches: {
      mixed_bundle: branch([
        {
          opening: "{bundle_name} is a grouped football-kit bundle for the {season} range, built from the selected {bundle_theme} items below.",
          keyDetail: "<li><strong>Bundle format:</strong> Multiple item types are supplied together in one listing.</li>",
          beforeOrder: [
            "<li>Check each included item before ordering, as bundle contents can differ from single-product listings.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This bundle brings the chosen {bundle_theme} items together without needing separate product pages.",
          keyDetail: "<li><strong>Selection:</strong> The bundle may include a mix of kits, shirts or related items.</li>",
          beforeOrder: [
            "<li>The What's Included list is the source of truth for this bundle.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "{bundle_name} combines the selected items into one clear {season} bundle.",
          keyDetail: "<li><strong>Bundle type:</strong> A mixed selection is included under a single product.</li>",
          beforeOrder: [
            "<li>Compare the contents with any separate shirt or kit listings before placing the order.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "Choose {bundle_name} when you want the listed {bundle_theme} items supplied together.",
          keyDetail: "<li><strong>Order format:</strong> The selected items are packed as one bundle order.</li>",
          beforeOrder: [
            "<li>Review the item list carefully so the bundle matches what you need.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This {season} bundle is designed for buyers who want more than one confirmed {bundle_theme} item in the same listing.",
          keyDetail: "<li><strong>Bundle details:</strong> Contents are based only on the items added to this bundle.</li>",
          beforeOrder: [
            "<li>Only the listed items are included; anything not shown in the list should not be assumed.</li>",
            "{bundle_personalisation_line}"
          ]
        }
      ]),

      kit_bundle_with_socks: branch([
        {
          opening: "{bundle_name} is a kit bundle with socks included on the selected kit items.",
          keyDetail: "<li><strong>Socks:</strong> Items marked With Socks include socks for that kit selection.</li>",
          beforeOrder: [
            "<li>Check each kit item before ordering, as socks apply only where With Socks is shown.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This {bundle_theme} bundle groups kit options that include socks where stated in the item list.",
          keyDetail: "<li><strong>Kit format:</strong> The listed kits are supplied as selected, including the socks option shown.</li>",
          beforeOrder: [
            "<li>Use the item names to confirm which kits include socks.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "{bundle_name} brings together selected kit items from the {season} range, with socks included where marked.",
          keyDetail: "<li><strong>Included socks:</strong> With Socks applies to the matching kit item only.</li>",
          beforeOrder: [
            "<li>Review the socks option on every selected kit before checkout.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "Choose this bundle when you want the selected {bundle_theme} kits supplied with socks where shown.",
          keyDetail: "<li><strong>Bundle type:</strong> Kit selections are grouped into one order.</li>",
          beforeOrder: [
            "<li>Socks are included only for items that state With Socks.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This kit bundle keeps the selected {bundle_theme} options together, including socks on the relevant items.",
          keyDetail: "<li><strong>Order detail:</strong> Each kit follows the socks option shown in its item name.</li>",
          beforeOrder: [
            "<li>Check the What's Included list carefully if socks are important for your order.</li>",
            "{bundle_personalisation_line}"
          ]
        }
      ]),

      kit_bundle_no_socks: branch([
        {
          opening: "{bundle_name} is a kit bundle using the selected No Socks options.",
          keyDetail: "<li><strong>Socks:</strong> Items marked No Socks do not include socks.</li>",
          beforeOrder: [
            "<li>Check the item list carefully before ordering, especially if socks are required.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This {bundle_theme} bundle groups kit selections that are supplied without socks where stated.",
          keyDetail: "<li><strong>Kit format:</strong> No Socks means socks are not supplied with that kit item.</li>",
          beforeOrder: [
            "<li>If socks are needed, choose an item that specifically states With Socks.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "{bundle_name} brings together selected kit items from the {season} range without socks on the listed No Socks options.",
          keyDetail: "<li><strong>Bundle type:</strong> Kit selections are grouped into one order.</li>",
          beforeOrder: [
            "<li>Socks are not included for items marked No Socks.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "Choose this bundle when you want the listed {bundle_theme} kit selections without socks.",
          keyDetail: "<li><strong>Order detail:</strong> Each kit follows the socks option shown in its item name.</li>",
          beforeOrder: [
            "<li>Review each selected item before checkout to confirm the socks option.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This kit bundle keeps the selected {bundle_theme} items together while clearly marking the No Socks options.",
          keyDetail: "<li><strong>Socks note:</strong> No Socks applies to the matching kit item only.</li>",
          beforeOrder: [
            "<li>Only items listed with With Socks include socks.</li>",
            "{bundle_personalisation_line}"
          ]
        }
      ]),

      shirt_bundle: branch([
        {
          opening: "{bundle_name} brings together selected shirts from the {season} range.",
          keyDetail: "<li><strong>Shirt bundle:</strong> This listing is focused on shirt items rather than full kits.</li>",
          beforeOrder: [
            "<li>Shorts and socks are not included unless they are listed as separate bundle items.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This {bundle_theme} bundle is made for buyers who want multiple shirt options together.",
          keyDetail: "<li><strong>Selection:</strong> The bundle can include different shirt types such as home, away, third or goalkeeper.</li>",
          beforeOrder: [
            "<li>Check the listed shirt type before ordering, especially long sleeve or goalkeeper selections.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "{bundle_name} groups the chosen {bundle_theme} shirt items into one listing.",
          keyDetail: "<li><strong>Bundle format:</strong> Shirt selections are supplied together in one order.</li>",
          beforeOrder: [
            "<li>Only the shirt items shown in What's Included are supplied.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "Choose {bundle_name} when you want the selected shirts supplied as a single bundle.",
          keyDetail: "<li><strong>Shirt details:</strong> The included versions are defined by the item list above.</li>",
          beforeOrder: [
            "<li>Review the included shirts before checkout so the bundle matches the versions you want.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This shirt bundle keeps the selected {bundle_theme} versions together for the {season} range.",
          keyDetail: "<li><strong>Order format:</strong> The listed shirts are grouped under one product.</li>",
          beforeOrder: [
            "<li>Do not assume shorts or socks are included unless they appear in the item list.</li>",
            "{bundle_personalisation_line}"
          ]
        }
      ]),

      printed_bundle: branch([
        {
          opening: "{bundle_name} includes selected items with the player name and number shown in the item list.",
          keyDetail: "<li><strong>Printed items:</strong> Player print details are part of the relevant selected items.</li>",
          beforeOrder: [
            "<li>Check every player name and number carefully before ordering.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This {bundle_theme} bundle includes item selections that already show the required player print details.",
          keyDetail: "<li><strong>Print detail:</strong> Any shown name and number applies to that specific item.</li>",
          beforeOrder: [
            "<li>A different name or number is not added to items that already show fixed print details.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "{bundle_name} groups selected items with fixed player print details where shown.",
          keyDetail: "<li><strong>Printed bundle:</strong> The item list identifies which products carry a name and number.</li>",
          beforeOrder: [
            "<li>Review the printed details on each item before checkout.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "Choose this bundle when you want the selected {bundle_theme} items with the listed player prints already defined.",
          keyDetail: "<li><strong>Included print:</strong> Names and numbers shown in the item list are treated as fixed details.</li>",
          beforeOrder: [
            "<li>Make sure the player name and number match what you want before placing the order.</li>",
            "{bundle_personalisation_line}"
          ]
        },
        {
          opening: "This printed bundle keeps the chosen items together with the stated player name and number details.",
          keyDetail: "<li><strong>Order detail:</strong> Printed information is controlled by the selected item names.</li>",
          beforeOrder: [
            "<li>Printed names and numbers are part of the selected item details shown above.</li>",
            "{bundle_personalisation_line}"
          ]
        }
      ])
    }
  };
})();
