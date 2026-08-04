const form = document.querySelector("#factForm");
const bundleForm = document.querySelector("#bundleForm");
const generateBtn = document.querySelector("#generateBtn");
const loadSampleBtn = document.querySelector("#loadSampleBtn");
const nextVariantBtn = document.querySelector("#nextVariantBtn");
const copyBtn = document.querySelector("#copyBtn");
const branchBadge = document.querySelector("#branchBadge");
const qaBadge = document.querySelector("#qaBadge");
const preview = document.querySelector("#descriptionPreview");
const htmlOutput = document.querySelector("#htmlOutput");
const auditOutput = document.querySelector("#auditOutput");
const productNameInput = form.elements.product_name;
const mainColourShirtInput = form.elements.main_colour_shirt;
const mainColourShortsInput = form.elements.main_colour_shorts;
const mainColourSocksInput = form.elements.main_colour_socks;
const badgeStatusSelect = form.elements.badge_status;
const badgeLeagueField = document.querySelector("#badgeLeagueField");
const badgeLeagueInput = form.elements.badge_league;
const mainColourShortsField = document.querySelector("#mainColourShortsField");
const mainColourSocksField = document.querySelector("#mainColourSocksField");
const imageColourFileInput = document.querySelector("#imageColourFile");
const clearImageColourBtn = document.querySelector("#clearImageColourBtn");
const imageColourWorkspace = document.querySelector("#imageColourWorkspace");
const imageColourCanvas = document.querySelector("#imageColourCanvas");
const imageColourInstruction = document.querySelector("#imageColourInstruction");
const imageColourStatus = document.querySelector("#imageColourStatus");
const imageColourPalette = document.querySelector("#imageColourPalette");
const imageColourPaletteButtons = document.querySelector("#imageColourPaletteButtons");
const imageColourConfirm = document.querySelector("#imageColourConfirm");
const confirmColoursGenerateBtn = document.querySelector("#confirmColoursGenerateBtn");
const imageColourReviewNote = document.querySelector("#imageColourReviewNote");
const imageColourConfirmationInput = form.elements.image_colour_confirmation;
const productAudienceSelect = document.querySelector("#productAudienceSelect");
const adultAudienceOption = productAudienceSelect.querySelector('option[value="adult"]');
const productKindSelect = document.querySelector("#productKindSelect");
const productKitTypeSelect = document.querySelector("#productKitTypeSelect");
const productOtherKitType = document.querySelector("#productOtherKitType");
const productSocksSelect = document.querySelector("#productSocksSelect");
const productPrintSelect = document.querySelector("#productPrintSelect");
const productPrintFields = document.querySelector("#productPrintFields");
const productPrintName = document.querySelector("#productPrintName");
const productPrintNumber = document.querySelector("#productPrintNumber");
const bundleItemTheme = document.querySelector("#bundleItemTheme");
const bundleItemSeason = document.querySelector("#bundleItemSeason");
const bundleProductSelect = document.querySelector("#bundleProductSelect");
const bundleKitTypeSelect = document.querySelector("#bundleKitTypeSelect");
const bundleSocksSelect = document.querySelector("#bundleSocksSelect");
const bundlePrintSelect = document.querySelector("#bundlePrintSelect");
const bundlePrintFields = document.querySelector("#bundlePrintFields");
const bundlePrintName = document.querySelector("#bundlePrintName");
const bundlePrintNumber = document.querySelector("#bundlePrintNumber");
const bundleItemAnother = document.querySelector("#bundleItemAnother");
const addBundleItemBtn = document.querySelector("#addBundleItemBtn");
const bundleItemsSummaryEl = document.querySelector("#bundleItemsSummary");
const bundleItemsList = document.querySelector("#bundleItemsList");
const templateLibrary = window.DESCRIPTION_TEMPLATE_LIBRARY;
const nationalTeams = window.NATIONAL_TEAMS || [];
const footballClubs = window.FOOTBALL_CLUBS || [];

let variantOffset = 0;
let generateTimer = null;
let activeMode = "product";
let bundleItems = [];
let isPrintInferredFromProductName = false;
const imageColourState = {
  objectUrl: "",
  imageLoaded: false,
  activeTarget: "shirt",
  suggestions: {
    shirt: null,
    shorts: null,
    socks: null
  },
  palette: [],
  confirmed: false
};

const fixedKfkFacts = Object.freeze({
  version_style: "fan_version",
  material: "polyester",
  badge_price_gbp: 3.99
});

const defaultFacts = {
  site: "KFK",
  ...fixedKfkFacts,
  size_guide_tab_status: "confirmed_present",
  size_guide_location: "product_tab",
  verification_status: "verified",
  fact_status: "ready_for_generation",
  source_notes: "Generated from simplified KFK description form."
};

const allowedTags = new Set(["P", "H3", "UL", "LI", "STRONG", "A"]);
const forbiddenTerms = [
  "official",
  "authentic",
  "genuine",
  "licensed",
  "premium",
  "same as players wear",
  "supporter style",
  "true to size",
  "breathable",
  "moisture-wicking",
  "guaranteed fit"
];

function getFacts() {
  syncProductSelectionFields();
  const data = new FormData(form);
  const facts = { ...defaultFacts };
  for (const [key, value] of data.entries()) {
    facts[key] = typeof value === "string" ? value.trim() : value;
  }

  Object.assign(facts, fixedKfkFacts);
  facts.badge_status = facts.badge_status === "available" ? "available" : "unavailable";
  facts.badge_league = facts.badge_status === "available" ? String(facts.badge_league || "").trim() : "";

  applyAnotherValue(facts, "kit_type");
  applyAnotherValue(facts, "sleeve_length");
  applyAnotherValue(facts, "included_items");
  applyAnotherValue(facts, "socks_status");
  applyAnotherValue(facts, "audience");
  applyAnotherValue(facts, "product_type");
  normaliseAudience(facts);
  normaliseProductType(facts);
  applyProductTypeRules(facts);
  applyDerivedSizeFacts(facts);

  if (facts.listing_configuration === "plain_customisable") {
    facts.personalisation_status = "available";
    facts.pre_applied_name = "";
    facts.pre_applied_number = "";
    facts.print_price_included = "not_applicable";
  } else {
    facts.personalisation_status = "unavailable";
    facts.print_price_included = "yes";
  }

  return facts;
}

function hasStandaloneKeyword(value, keyword) {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escapedKeyword}($|[^a-z0-9])`, "i").test(value);
}

function selectProductKitType(value) {
  const hasOption = [...productKitTypeSelect.options].some((option) => option.value === value);
  if (hasOption) productKitTypeSelect.value = value;
}

function findFootballTeam(productName) {
  const matches = [...nationalTeams, ...footballClubs].flatMap((team) => team.aliases
    .filter((alias) => hasStandaloneKeyword(productName, alias))
    .map((alias) => ({ name: team.name, alias })));

  matches.sort((left, right) => right.alias.length - left.alias.length);
  return matches[0] || null;
}

function inferProductSelectionFromName() {
  const productName = productNameInput.value.trim();
  if (!productName) return;

  const seasonMatch = productName.match(/\b20\d{2}\/\d{2}\b/);
  if (seasonMatch) form.elements.season.value = seasonMatch[0];

  const matchedTeam = findFootballTeam(productName);
  if (matchedTeam) form.elements.team.value = matchedTeam.name;

  const audienceMatch = [
    ["baby", "baby"],
    ["women's", "women"],
    ["womens", "women"],
    ["women", "women"],
    ["men's", "men"],
    ["mens", "men"],
    ["men", "men"],
    ["male", "men"],
    ["man", "men"],
    ["kids", "kids"],
    ["kid", "kids"],
    ["adult", "adult"]
  ].find(([keyword]) => hasStandaloneKeyword(productName, keyword));
  if (audienceMatch) productAudienceSelect.value = audienceMatch[1];

  const kitTypeMatch = [
    ["special edition", "special_edition"],
    ["pre match", "pre_match"],
    ["pre-match", "pre_match"],
    ["goalkeeper", "goalkeeper"],
    ["training", "training"],
    ["fourth", "fourth"],
    ["fifth", "fifth"],
    ["third", "third"],
    ["away", "away"],
    ["home", "home"],
    ["retro", "retro"]
  ].find(([keyword]) => hasStandaloneKeyword(productName, keyword));
  if (kitTypeMatch) selectProductKitType(kitTypeMatch[1]);

  const hasLongSleeve = hasStandaloneKeyword(productName, "long sleeve") || hasStandaloneKeyword(productName, "long-sleeve");
  const hasKit = hasStandaloneKeyword(productName, "football kit") || hasStandaloneKeyword(productName, "kit");
  const hasShirt = hasStandaloneKeyword(productName, "football shirt") || hasStandaloneKeyword(productName, "shirt");
  const hasSuit = hasStandaloneKeyword(productName, "suit");

  if (hasSuit) productKindSelect.value = "Suit";
  else if (hasLongSleeve && hasKit) productKindSelect.value = "Long Sleeve Kit";
  else if (hasLongSleeve && hasShirt) productKindSelect.value = "Long Sleeve Shirt";
  else if (hasKit) productKindSelect.value = "Kit";
  else if (hasShirt) productKindSelect.value = "Shirt";

  if (hasStandaloneKeyword(productName, "with socks")) productSocksSelect.value = "included";
  if (hasStandaloneKeyword(productName, "no socks") || hasStandaloneKeyword(productName, "without socks")) productSocksSelect.value = "unavailable";

  const playerPrintMatch = productName.match(/(?:^|[^a-z])([A-Z]{2,})\s+(\d{1,2})(?=$|[^a-z0-9])/);
  if (playerPrintMatch) {
    productPrintSelect.value = "pre_applied_player";
    productPrintName.value = playerPrintMatch[1];
    productPrintNumber.value = playerPrintMatch[2];
    isPrintInferredFromProductName = true;
  } else if (isPrintInferredFromProductName) {
    productPrintSelect.value = "plain_customisable";
    productPrintName.value = "";
    productPrintNumber.value = "";
    isPrintInferredFromProductName = false;
  }

  syncProductSelectionFields();
}

function syncProductSelectionFields() {
  let isKit = productKindSelect.value === "Kit" || productKindSelect.value === "Long Sleeve Kit";
  let isLongSleeve = productKindSelect.value === "Long Sleeve Shirt" || productKindSelect.value === "Long Sleeve Kit";
  let isSuit = productKindSelect.value === "Suit";
  const isPrinted = productPrintSelect.value === "pre_applied_player";
  const usesOtherKitType = productKitTypeSelect.value === "other";

  if (productAudienceSelect.value === "baby" && !isSuit) {
    productKindSelect.value = "Suit";
    isKit = false;
    isLongSleeve = false;
    isSuit = true;
  }

  if (isSuit) {
    productAudienceSelect.value = "baby";
  }

  adultAudienceOption.disabled = !isKit;
  adultAudienceOption.textContent = isKit ? "Adult" : "Adult (kits only)";

  form.elements.audience.value = productAudienceSelect.value;
  form.elements.product_type.value = isKit ? "full_kit" : "shirt_only";
  form.elements.kit_type.value = usesOtherKitType ? productOtherKitType.value.trim() || "unknown" : productKitTypeSelect.value;
  form.elements.sleeve_length.value = isSuit ? "baby_suit" : isLongSleeve ? "long_sleeve" : "short_sleeve";
  form.elements.listing_configuration.value = productPrintSelect.value;

  if (isKit) {
    form.elements.socks_status.value = productSocksSelect.value;
    form.elements.included_items.value = productSocksSelect.value === "included" ? "shirt_shorts_and_socks" : "shirt_and_shorts";
  } else {
    form.elements.socks_status.value = "not_applicable";
    form.elements.included_items.value = "shirt_only";
  }

  productSocksSelect.classList.toggle("hidden", !isKit);
  productOtherKitType.classList.toggle("visible", usesOtherKitType);
  productOtherKitType.required = usesOtherKitType;
  productPrintFields.classList.toggle("visible", isPrinted);
  productPrintName.required = isPrinted;
  productPrintNumber.required = isPrinted;

  if (!isPrinted) {
    productPrintName.value = "";
    productPrintNumber.value = "";
  }

  const usesShortsColour = isKit;
  mainColourShortsInput.disabled = !usesShortsColour;
  mainColourShortsField.classList.toggle("disabled", !usesShortsColour);
  mainColourShortsField.title = usesShortsColour ? "" : "Shorts colour applies to kits only.";
  if (!usesShortsColour) mainColourShortsInput.value = "";

  const usesSocksColour = isKit && productSocksSelect.value === "included";
  mainColourSocksInput.disabled = !usesSocksColour;
  mainColourSocksField.classList.toggle("disabled", !usesSocksColour);
  mainColourSocksField.title = usesSocksColour ? "" : "Socks colour applies to kits with socks only.";
  if (!usesSocksColour) mainColourSocksInput.value = "";

  syncBadgeField();
  updateImageColourAssistantUi();
}

function syncBadgeField() {
  const isAvailable = badgeStatusSelect.value === "available";
  badgeLeagueField.classList.toggle("hidden", !isAvailable);
  badgeLeagueInput.required = isAvailable;
  if (!isAvailable) badgeLeagueInput.value = "";
}

const imageColourReference = [
  { label: "White", rgb: [255, 255, 255] },
  { label: "Black", rgb: [20, 20, 20] },
  { label: "Red", rgb: [205, 35, 45] },
  { label: "Blue", rgb: [35, 85, 180] },
  { label: "Light blue", rgb: [120, 190, 225] },
  { label: "Navy", rgb: [25, 45, 100] },
  { label: "Green", rgb: [40, 145, 75] },
  { label: "Yellow", rgb: [235, 195, 35] },
  { label: "Orange", rgb: [230, 115, 35] },
  { label: "Pink", rgb: [225, 95, 145] },
  { label: "Purple", rgb: [125, 65, 160] },
  { label: "Grey", rgb: [135, 140, 145] },
  { label: "Brown", rgb: [125, 75, 45] },
  { label: "Beige", rgb: [215, 185, 135] },
  { label: "Claret", rgb: [115, 25, 45] },
  { label: "Multi-colour", rgb: [120, 120, 120] }
];

function currentImageColourTargets() {
  const isKit = productKindSelect.value === "Kit" || productKindSelect.value === "Long Sleeve Kit";
  const targets = [
    { key: "shirt", label: "shirt", input: mainColourShirtInput }
  ];

  if (isKit) {
    targets.push({ key: "shorts", label: "shorts", input: mainColourShortsInput });
    if (productSocksSelect.value === "included") {
      targets.push({ key: "socks", label: "socks", input: mainColourSocksInput });
    }
  }

  return targets;
}

function imageColourTarget(key) {
  return currentImageColourTargets().find((target) => target.key === key) || null;
}

function imageColourRow(key) {
  return document.querySelector(`[data-colour-target="${key}"]`);
}

function imageColourSuggestionValue(key) {
  return document.querySelector(`#${key}ColourSuggestion`);
}

function imageColourUseButton(key) {
  return document.querySelector(`[data-use-colour-suggestion="${key}"]`);
}

function rgbToHex(rgb) {
  return `#${rgb.map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function mapRgbToImageColour(rgb) {
  const [red, green, blue] = rgb;
  let best = imageColourReference[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  imageColourReference.forEach((reference) => {
    const distance = ((red - reference.rgb[0]) ** 2)
      + ((green - reference.rgb[1]) ** 2)
      + ((blue - reference.rgb[2]) ** 2);
    if (distance < bestDistance) {
      best = reference;
      bestDistance = distance;
    }
  });

  return {
    label: best.label,
    rgb: [red, green, blue]
  };
}

function averageCanvasColour(x, y, radius = 10) {
  const context = imageColourCanvas.getContext("2d");
  if (!context || !imageColourCanvas.width || !imageColourCanvas.height) return null;

  const left = Math.max(0, Math.floor(x - radius));
  const top = Math.max(0, Math.floor(y - radius));
  const right = Math.min(imageColourCanvas.width, Math.ceil(x + radius));
  const bottom = Math.min(imageColourCanvas.height, Math.ceil(y + radius));
  const pixels = context.getImageData(left, top, Math.max(1, right - left), Math.max(1, bottom - top)).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 120) continue;
    red += pixels[index];
    green += pixels[index + 1];
    blue += pixels[index + 2];
    count += 1;
  }

  if (!count) return null;
  return mapRgbToImageColour([
    Math.round(red / count),
    Math.round(green / count),
    Math.round(blue / count)
  ]);
}

function buildImageColourPalette() {
  const context = imageColourCanvas.getContext("2d");
  if (!context || !imageColourCanvas.width || !imageColourCanvas.height) return [];

  const pixels = context.getImageData(0, 0, imageColourCanvas.width, imageColourCanvas.height).data;
  const step = Math.max(1, Math.ceil(Math.sqrt((imageColourCanvas.width * imageColourCanvas.height) / 12000)));
  const buckets = new Map();

  for (let y = 0; y < imageColourCanvas.height; y += step) {
    for (let x = 0; x < imageColourCanvas.width; x += step) {
      const index = ((y * imageColourCanvas.width) + x) * 4;
      if (pixels[index + 3] < 120) continue;

      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      if (red > 248 && green > 248 && blue > 248) continue;

      const bucketRgb = [
        Math.min(255, Math.round(red / 32) * 32),
        Math.min(255, Math.round(green / 32) * 32),
        Math.min(255, Math.round(blue / 32) * 32)
      ];
      const key = bucketRgb.join(",");
      const bucket = buckets.get(key) || { count: 0, red: 0, green: 0, blue: 0 };
      bucket.count += 1;
      bucket.red += red;
      bucket.green += green;
      bucket.blue += blue;
      buckets.set(key, bucket);
    }
  }

  const grouped = new Map();
  [...buckets.values()].forEach((bucket) => {
    const rgb = [
      Math.round(bucket.red / bucket.count),
      Math.round(bucket.green / bucket.count),
      Math.round(bucket.blue / bucket.count)
    ];
    const mapped = mapRgbToImageColour(rgb);
    const existing = grouped.get(mapped.label) || { label: mapped.label, count: 0, red: 0, green: 0, blue: 0 };
    existing.count += bucket.count;
    existing.red += mapped.rgb[0] * bucket.count;
    existing.green += mapped.rgb[1] * bucket.count;
    existing.blue += mapped.rgb[2] * bucket.count;
    grouped.set(mapped.label, existing);
  });

  return [...grouped.values()]
    .sort((left, right) => right.count - left.count)
    .slice(0, 8)
    .map((item) => ({
      label: item.label,
      rgb: [
        Math.round(item.red / item.count),
        Math.round(item.green / item.count),
        Math.round(item.blue / item.count)
      ]
    }));
}

function updateImageColourConfirmation(status) {
  imageColourState.confirmed = status === "confirmed";
  imageColourConfirmationInput.value = status;
  imageColourConfirm.checked = imageColourState.confirmed;
}

function markImageColoursForReview() {
  if (!imageColourState.imageLoaded) return;
  updateImageColourConfirmation("pending_review");
  updateImageColourAssistantUi();
}

function setActiveImageColourTarget(key) {
  if (!imageColourTarget(key)) return;
  imageColourState.activeTarget = key;
  imageColourInstruction.textContent = `Click the main ${key} colour in the image. The result will be a suggestion for review.`;
  updateImageColourAssistantUi();
}

function setImageColourSuggestion(key, suggestion) {
  if (!imageColourTarget(key) || !suggestion) return;
  imageColourState.suggestions[key] = suggestion;
  markImageColoursForReview();
  updateImageColourAssistantUi();
}

function renderImageColourPalette() {
  imageColourPaletteButtons.replaceChildren();
  imageColourPalette.classList.toggle("hidden", !imageColourState.palette.length);

  imageColourState.palette.forEach((colour) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-button";
    button.title = `Use ${colour.label} as a suggestion for the selected garment`;

    const swatch = document.createElement("span");
    swatch.className = "palette-swatch";
    swatch.style.backgroundColor = rgbToHex(colour.rgb);

    const label = document.createElement("span");
    label.textContent = colour.label;
    button.append(swatch, label);
    button.addEventListener("click", () => setImageColourSuggestion(imageColourState.activeTarget, colour));
    imageColourPaletteButtons.append(button);
  });
}

function updateImageColourAssistantUi() {
  const hasImage = imageColourState.imageLoaded;
  imageColourWorkspace.classList.toggle("hidden", !hasImage);
  clearImageColourBtn.disabled = !hasImage;
  imageColourConfirm.disabled = !hasImage;
  confirmColoursGenerateBtn.disabled = !hasImage || imageColourState.confirmed || !imageColourConfirm.checked;

  const targets = currentImageColourTargets();
  if (!targets.some((target) => target.key === imageColourState.activeTarget)) {
    imageColourState.activeTarget = targets[0]?.key || "shirt";
  }

  ["shirt", "shorts", "socks"].forEach((key) => {
    const row = imageColourRow(key);
    const visible = hasImage && targets.some((target) => target.key === key);
    const suggestion = imageColourState.suggestions[key];
    row.classList.toggle("hidden", !visible);
    row.classList.toggle("active", visible && imageColourState.activeTarget === key);
    imageColourSuggestionValue(key).textContent = suggestion
      ? `${suggestion.label} (${rgbToHex(suggestion.rgb)})`
      : "Not sampled";
    imageColourUseButton(key).disabled = !visible || !suggestion;
  });

  if (!hasImage) {
    setBadge(imageColourStatus, "Not used", "neutral");
    imageColourReviewNote.textContent = "Upload an image to begin. You can also enter colours manually.";
    return;
  }

  if (imageColourState.confirmed) {
    setBadge(imageColourStatus, "Confirmed", "pass");
    imageColourReviewNote.textContent = "Colours confirmed from the current editable fields. Generate uses these final values.";
  } else {
    setBadge(imageColourStatus, "Review needed", "review");
    imageColourReviewNote.textContent = "Review or edit the colour fields, tick the confirmation box, then use Confirm colours & Generate. Clear the image to return to manual generation.";
  }

  renderImageColourPalette();
}

function resetImageColourAssistant({ clearFile = false } = {}) {
  if (imageColourState.objectUrl) URL.revokeObjectURL(imageColourState.objectUrl);
  imageColourState.objectUrl = "";
  imageColourState.imageLoaded = false;
  imageColourState.activeTarget = "shirt";
  imageColourState.suggestions = { shirt: null, shorts: null, socks: null };
  imageColourState.palette = [];
  updateImageColourConfirmation("not_used");
  imageColourCanvas.width = 1;
  imageColourCanvas.height = 1;
  imageColourCanvas.getContext("2d")?.clearRect(0, 0, 1, 1);
  if (clearFile) imageColourFileInput.value = "";
  updateImageColourAssistantUi();
}

function drawImageForColourAssistant(image) {
  const maxWidth = 720;
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  imageColourCanvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  imageColourCanvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = imageColourCanvas.getContext("2d");
  if (!context) return false;
  context.clearRect(0, 0, imageColourCanvas.width, imageColourCanvas.height);
  context.drawImage(image, 0, 0, imageColourCanvas.width, imageColourCanvas.height);
  return true;
}

function handleImageColourFileChange() {
  const file = imageColourFileInput.files?.[0];
  resetImageColourAssistant();
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    imageColourReviewNote.textContent = "Please choose an image file. The image colour assistant does not upload files.";
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  imageColourState.objectUrl = objectUrl;
  const image = new Image();
  image.onload = () => {
    if (!drawImageForColourAssistant(image)) {
      resetImageColourAssistant({ clearFile: true });
      imageColourReviewNote.textContent = "This image could not be prepared for colour sampling. Enter the colours manually.";
      return;
    }

    imageColourState.imageLoaded = true;
    imageColourState.activeTarget = currentImageColourTargets()[0]?.key || "shirt";
    imageColourState.palette = buildImageColourPalette();
    updateImageColourConfirmation("pending_review");
    imageColourInstruction.textContent = `Click the main ${imageColourState.activeTarget} colour in the image. The result will be a suggestion for review.`;
    updateImageColourAssistantUi();
  };
  image.onerror = () => {
    resetImageColourAssistant({ clearFile: true });
    imageColourReviewNote.textContent = "This image could not be read. Enter the colours manually.";
  };
  image.src = objectUrl;
}

function handleImageColourCanvasClick(event) {
  if (!imageColourState.imageLoaded) return;
  const bounds = imageColourCanvas.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * imageColourCanvas.width;
  const y = ((event.clientY - bounds.top) / bounds.height) * imageColourCanvas.height;
  const suggestion = averageCanvasColour(x, y);
  if (suggestion) setImageColourSuggestion(imageColourState.activeTarget, suggestion);
}

function useImageColourSuggestion(key) {
  const target = imageColourTarget(key);
  const suggestion = imageColourState.suggestions[key];
  if (!target || !suggestion) return;
  target.input.value = suggestion.label;
  target.input.dispatchEvent(new Event("input", { bubbles: true }));
}

function confirmImageColoursAndGenerate() {
  if (!imageColourState.imageLoaded || !imageColourConfirm.checked) return;
  updateImageColourConfirmation("confirmed");
  updateImageColourAssistantUi();
  scheduleGenerate();
}

function syncProductControlsFromFacts(facts) {
  productAudienceSelect.value = facts.audience || "kids";
  productKindSelect.value = facts.product_type === "full_kit" ? facts.sleeve_length === "long_sleeve" ? "Long Sleeve Kit" : "Kit" : facts.sleeve_length === "baby_suit" ? "Suit" : facts.sleeve_length === "long_sleeve" ? "Long Sleeve Shirt" : "Shirt";
  const supportedKitType = [...productKitTypeSelect.options].some((option) => option.value === facts.kit_type);
  productKitTypeSelect.value = supportedKitType ? facts.kit_type : "other";
  productOtherKitType.value = supportedKitType ? "" : facts.kit_type || "";
  productSocksSelect.value = facts.socks_status === "included" ? "included" : "unavailable";
  productPrintSelect.value = facts.listing_configuration || "plain_customisable";
  productPrintName.value = facts.pre_applied_name || "";
  productPrintNumber.value = facts.pre_applied_number || "";
  mainColourShirtInput.value = facts.main_colour_shirt || "";
  mainColourShortsInput.value = facts.main_colour_shorts || "";
  mainColourSocksInput.value = facts.main_colour_socks || "";
  badgeStatusSelect.value = facts.badge_status === "available" ? "available" : "unavailable";
  badgeLeagueInput.value = facts.badge_league || "";
  syncProductSelectionFields();
}

function getBundleFacts() {
  const data = new FormData(bundleForm);
  const facts = { ...defaultFacts, product_type: "bundle" };
  for (const [key, value] of data.entries()) {
    facts[key] = typeof value === "string" ? value.trim() : value;
  }

  facts.audience = "buyers";
  facts.bundle_items_list = splitBundleItems(facts.bundle_items);
  facts.bundle_theme = bundleThemeSummary(facts.bundle_items_list);
  facts.season = bundleSeasonSummary(facts.bundle_items_list);
  facts.bundle_size_range = "Varies by item";
  facts.personalisation_status = "unavailable";

  facts.visible_size_range = "Varies by item";
  facts.size_profile = "bundle_mixed";

  return facts;
}

function applyDerivedSizeFacts(facts) {
  if (facts.audience === "women") {
    facts.visible_size_range = "Women sizes S–2XL";
    facts.size_profile = "women_s_2xl";
    return;
  }

  if (facts.audience === "baby") {
    facts.visible_size_range = "Baby sizes 9 and 12 (3–24 months)";
    facts.size_profile = "baby_9_12";
    return;
  }

  if (facts.audience === "adult") {
    facts.visible_size_range = "Adult sizes S-XXL";
    facts.size_profile = "adult_s_2xl";
    return;
  }

  if (facts.audience === "men") {
    facts.visible_size_range = "Men sizes S-XXL";
    facts.size_profile = "adult_s_2xl";
    return;
  }

  if (facts.audience === "kids") {
    facts.visible_size_range = "Kids sizes 16-28, suggested ages 3-13";
    facts.size_profile = "kids_16_28";
    return;
  }

  facts.visible_size_range = "";
  facts.size_profile = "unknown";
}

function applyAnotherValue(facts, fieldName) {
  if (facts[fieldName] !== "another") return;
  const customValue = facts[`${fieldName}_another`];
  facts[fieldName] = customValue || "unknown";
}

function splitBundleItems(value) {
  return String(value || "")
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function syncBundleItemsInput() {
  bundleForm.elements.bundle_items.value = bundleItems.join("\n");
}

function renderBundleItemsList() {
  syncBundleItemsInput();
  const countText = bundleItems.length === 1 ? "1 item added" : `${bundleItems.length} items added`;
  bundleItemsSummaryEl.textContent = bundleItems.length ? `Added items: ${countText}` : "Added items: 0";
  bundleItemsList.innerHTML = "";

  if (!bundleItems.length) {
    const emptyState = document.createElement("span");
    emptyState.className = "bundle-items-empty";
    emptyState.textContent = "No bundle items added yet.";
    bundleItemsList.append(emptyState);
    return;
  }

  bundleItems.forEach((item, index) => {
    const chip = document.createElement("span");
    chip.className = "bundle-item-chip";
    chip.textContent = formatBundleItemForChip(item);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remove ${formatBundleItemForChip(item)}`);
    removeButton.textContent = "x";
    removeButton.addEventListener("click", () => {
      bundleItems.splice(index, 1);
      renderBundleItemsList();
      variantOffset = 0;
      scheduleGenerate();
    });

    chip.append(removeButton);
    bundleItemsList.append(chip);
  });
}

function selectedBundleItem() {
  if (bundleProductSelect.value === "another") {
    return bundleItemAnother.value.trim();
  }

  const theme = bundleItemTheme.value.trim();
  const season = bundleItemSeason.value.trim();
  const kitType = bundleKitTypeSelect.value.trim();
  const product = bundleProductSelect.value.trim();
  const socks = usesBundleSocks() ? ` ${bundleSocksSelect.value.trim()}` : "";
  const print = bundlePrintSelect.value === "Printed"
    ? ` ${bundlePrintName.value.trim()} ${bundlePrintNumber.value.trim()}`.trimEnd()
    : "";

  return `${theme} ${season} ${kitType} ${product}${socks}${print}`.replace(/\s+/g, " ").trim();
}

function addSelectedBundleItem() {
  const item = selectedBundleItem();
  if (!item) return;
  if (bundleProductSelect.value !== "another" && (!bundleItemTheme.value.trim() || !bundleItemSeason.value.trim())) {
    if (!bundleItemTheme.value.trim()) bundleItemTheme.focus();
    else bundleItemSeason.focus();
    return;
  }
  if (bundlePrintSelect.value === "Printed" && (!bundlePrintName.value.trim() || !bundlePrintNumber.value.trim())) {
    if (!bundlePrintName.value.trim()) bundlePrintName.focus();
    else bundlePrintNumber.focus();
    return;
  }

  if (!bundleItems.some((existingItem) => existingItem.toLowerCase() === item.toLowerCase())) {
    bundleItems.push(item);
  }

  if (bundleProductSelect.value === "another") {
    bundleItemAnother.value = "";
  }
  if (bundlePrintSelect.value === "Printed") {
    bundlePrintName.value = "";
    bundlePrintNumber.value = "";
  }

  renderBundleItemsList();
  variantOffset = 0;
  scheduleGenerate();
}

function syncBundleItemControls() {
  const isAnother = bundleProductSelect.value === "another";
  const usesStructuredItem = !isAnother;
  const usesSocks = usesBundleSocks();
  const usesPrint = usesStructuredItem && bundlePrintSelect.value === "Printed";

  bundleKitTypeSelect.classList.toggle("hidden", !usesStructuredItem);
  bundleItemTheme.classList.toggle("hidden", !usesStructuredItem);
  bundleItemSeason.classList.toggle("hidden", !usesStructuredItem);
  bundleSocksSelect.classList.toggle("hidden", !usesSocks);
  bundlePrintSelect.classList.toggle("hidden", !usesStructuredItem);
  bundlePrintFields.classList.toggle("visible", usesPrint);
  bundlePrintName.required = usesPrint;
  bundlePrintNumber.required = usesPrint;
  bundleItemAnother.classList.toggle("visible", isAnother);
  bundleItemAnother.required = isAnother;
  if (!isAnother) bundleItemAnother.value = "";
  if (!usesPrint) {
    bundlePrintName.value = "";
    bundlePrintNumber.value = "";
  }
}

function usesBundleSocks() {
  return bundleProductSelect.value === "Kit" || bundleProductSelect.value === "Adult Kit";
}

function normaliseAudience(facts) {
  const value = String(facts.audience || "").trim().toLowerCase();
  const menAliases = new Set(["men", "mens", "men's", "man", "male"]);
  const adultAliases = new Set(["adult", "adults"]);
  const womenAliases = new Set(["women", "womens", "women's", "woman", "female", "ladies"]);
  const babyAliases = new Set(["baby", "infant", "toddler"]);
  const kidsAliases = new Set(["kids", "kid", "children", "child", "youth", "junior", "boys", "girls"]);

  if (womenAliases.has(value)) {
    facts.audience = "women";
    return;
  }

  if (babyAliases.has(value)) {
    facts.audience = "baby";
    return;
  }

  if (menAliases.has(value)) {
    facts.audience = "men";
    return;
  }

  if (adultAliases.has(value)) {
    facts.audience = "adult";
    return;
  }

  if (kidsAliases.has(value)) {
    facts.audience = "kids";
  }
}

function normaliseProductType(facts) {
  const value = String(facts.product_type || "").trim().toLowerCase();
  if (["shirt", "shirt only", "shirt-only", "football shirt"].includes(value)) {
    facts.product_type = "shirt_only";
  }
}

function applyProductTypeRules(facts) {
  if (facts.product_type !== "shirt_only") return;
  facts.included_items = "shirt_only";
  facts.socks_status = "not_applicable";
}

function esc(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleCaseToken(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function shirtLabel(facts) {
  if (facts.sleeve_length === "baby_suit") return "baby suit";
  if (facts.sleeve_length === "long_sleeve") return "long-sleeve";
  if (facts.sleeve_length === "short_sleeve") return "short-sleeve";
  if (facts.sleeve_length && facts.sleeve_length !== "unknown") {
    return facts.sleeve_length.replaceAll("_", "-").toLowerCase();
  }
  return "football";
}

function sleeveLengthLabel(facts) {
  if (facts.sleeve_length === "short_sleeve") return "Short sleeve";
  if (facts.sleeve_length === "long_sleeve") return "Long sleeve";
  return "";
}

function productItemLabel(facts) {
  if (facts.sleeve_length === "baby_suit") return "baby suit";
  if (facts.sleeve_length === "long_sleeve") return "long-sleeve shirt";
  return "football shirt";
}

function sentenceStart(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function displayName(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text === text.toUpperCase()) {
    return text.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
  }
  return text;
}

function displayDesignDetail(value) {
  return String(value || "")
    .replace(/\s*(shown|seen|confirmed)\s+in\s+the\s+(approved|verified|checked)?\s*product\s+image\.?/i, "")
    .replace(/\s*based\s+on\s+the\s+(approved|verified|checked)?\s*product\s+image\.?/i, "")
    .trim();
}

function pick(list, facts, salt = 0) {
  const seed = [
    facts.product_name,
    facts.team,
    facts.season,
    facts.kit_type,
    facts.included_items,
    facts.socks_status,
    facts.listing_configuration
  ].join("|");
  const base = stableHash(seed || "kfk");
  return list[(base + variantOffset + salt) % list.length];
}

function pickBranchVariant(branch, facts) {
  const branchConfig = templateLibrary.branches[branch];
  if (!branchConfig) return null;
  return pick(branchConfig.variants, facts, 1);
}

function stableHash(text) {
  return String(text).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function titleCasePhrase(value) {
  return String(value || "").replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function openingAudienceLabel(value) {
  const labels = {
    kids: "Kids",
    men: "Men",
    adult: "Adult",
    women: "Women",
    baby: "Baby"
  };
  return labels[value] || "";
}

function interpolate(template, facts, { titleCaseProductLabels = false } = {}) {
  const sleeveLabel = titleCaseProductLabels ? titleCasePhrase(shirtLabel(facts)) : shirtLabel(facts);
  const productItem = titleCaseProductLabels ? titleCasePhrase(productItemLabel(facts)) : productItemLabel(facts);

  return template
    .replaceAll("{product_name}", esc(facts.product_name))
    .replaceAll("{team}", esc(facts.team))
    .replaceAll("{season}", esc(facts.season))
    .replaceAll("{kit_type_label}", esc(titleCaseToken(facts.kit_type)))
    .replaceAll("{sleeve_label}", esc(sleeveLabel))
    .replaceAll("{product_item_label}", esc(productItem))
    .replaceAll("{sock_phrase}", facts.socks_status === "included" ? " and socks" : "")
    .replaceAll("{player_name}", esc(displayName(facts.pre_applied_name)))
    .replaceAll("{player_number}", esc(facts.pre_applied_number))
    .replaceAll("{bundle_name}", esc(facts.bundle_name))
    .replaceAll("{bundle_theme}", esc(facts.bundle_theme))
    .replaceAll("{audience_label}", esc(audienceLabel(facts.audience)))
    .replaceAll("{audience_opening_label}", esc(openingAudienceLabel(facts.audience)))
    .replaceAll("{bundle_items_summary}", esc(bundleItemsSummary(facts.bundle_items_list)))
    .replaceAll("{bundle_personalisation_line}", bundlePersonalisationLine(facts));
}

function audienceLabel(value) {
  if (value === "kids") return "kids";
  if (value === "men") return "men";
  if (value === "adult") return "adult buyers";
  if (value === "women") return "women";
  if (value === "baby") return "babies";
  if (value === "family") return "families";
  return value || "buyers";
}

function bundleItemsSummary(items) {
  if (!items || !items.length) return "";
  const formattedItems = items.map(formatBundleItemForOutput);
  if (formattedItems.length === 1) return formattedItems[0];
  if (formattedItems.length === 2) return `${formattedItems[0]} and ${formattedItems[1]}`;
  return `${formattedItems.slice(0, -1).join(", ")} and ${formattedItems[formattedItems.length - 1]}`;
}

function bundleThemeSummary(items) {
  const themes = uniqueItemParts(items, "theme");
  if (!themes.length) return "selected-team";
  if (themes.length === 1) return themes[0];
  return "multi-team";
}

function bundleSeasonSummary(items) {
  const seasons = uniqueItemParts(items, "season");
  if (!seasons.length) return "selected-season";
  if (seasons.length === 1) return seasons[0];
  return "mixed-season";
}

function uniqueItemParts(items, part) {
  const values = [];
  items.forEach((item) => {
    const match = parseBundleItemParts(item);
    if (!match) return;
    const value = part === "theme" ? match.theme : match.season;
    if (value && !values.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
      values.push(value);
    }
  });
  return values;
}

function parseBundleItemParts(item) {
  const raw = String(item || "").trim();
  const match = raw.match(/^(.+?)\s+(\d{2,4}\/\d{2})\s+(Home|Away|Third|Goalkeeper)\s+(.+)$/i);
  if (!match) return null;
  return {
    theme: match[1],
    season: match[2],
    kitType: match[3],
    detail: match[4]
  };
}

function formatBundleItemForChip(item) {
  const raw = String(item || "").trim();
  const parts = parseBundleItemParts(raw);
  if (!parts) return raw;
  return `${parts.theme} ${parts.kitType} ${parts.detail}`.replace(/\s+/g, " ").trim();
}

function formatBundleItemForOutput(item) {
  const raw = String(item || "").trim();
  const parts = parseBundleItemParts(raw);
  const outputRaw = parts ? `${parts.theme} ${parts.kitType} ${parts.detail}` : raw;
  const printMatch = outputRaw.match(/^(.*?)(?:\s+([A-Z][A-Z.'-]*(?:\s+[A-Z][A-Z.'-]*)*)\s+(\d{1,2}))$/);
  const hasPrint = Boolean(printMatch && /\b(Kit|Shirt)\b/i.test(printMatch[1]));
  const base = hasPrint ? printMatch[1].trim() : outputRaw;
  const print = hasPrint ? `${printMatch[2]} ${printMatch[3]}` : "";
  const readableBase = base
    .replace(/\bWith Socks\b/g, "with socks")
    .replace(/\bNo Socks\b/g, "without socks")
    .replace(/\b(Home|Away|Third|Goalkeeper) Adult Kit\b/g, "$1 adult kit")
    .replace(/\b(Home|Away|Third|Goalkeeper) Long Sleeve Shirt\b/g, "$1 long sleeve shirt")
    .replace(/\b(Home|Away|Third|Goalkeeper) Kit\b/g, "$1 kit")
    .replace(/\b(Home|Away|Third|Goalkeeper) Shirt\b/g, "$1 shirt");

  return print ? `${readableBase} - ${print}` : readableBase;
}

function bundlePersonalisationLine(facts) {
  if (bundleHasPrintedItem(facts)) {
    return "<li>Any player names and numbers shown in the included-item list are already part of the selected bundle items.</li>";
  }
  if (facts.personalisation_status === "available") {
    return "<li>Personalisation can be selected where the bundle options allow it; check all entered names and numbers before checkout.</li>";
  }
  if (facts.personalisation_status === "varies") {
    return "<li>Personalisation may vary by item, so check the available bundle options before ordering.</li>";
  }
  return "<li>This bundle is supplied according to the selected item list shown above.</li>";
}

function bundleHasPrintedItem(facts) {
  return Array.isArray(facts.bundle_items_list) && facts.bundle_items_list.some((item) => /\b[A-Z]{2,}\s+\d{1,2}\b/.test(item));
}

function detectBundleBranch(facts) {
  if (!Array.isArray(facts.bundle_items_list)) return "mixed_bundle";
  const items = facts.bundle_items_list.map((item) => item.toLowerCase());
  const hasPrinted = bundleHasPrintedItem(facts);
  const hasKit = items.some((item) => item.includes(" kit"));
  const hasShirt = items.some((item) => item.includes("shirt"));
  const hasWithSocks = items.some((item) => item.includes("with socks"));
  const hasNoSocks = items.some((item) => item.includes("no socks"));

  if (hasPrinted) return "printed_bundle";
  if (hasKit && hasShirt) return "mixed_bundle";
  if (hasKit && hasWithSocks) return "kit_bundle_with_socks";
  if (hasKit && hasNoSocks) return "kit_bundle_no_socks";
  if (hasShirt) return "shirt_bundle";
  return "mixed_bundle";
}

function detectBranch(facts) {
  if (facts.site !== "KFK") return null;

  if (facts.product_type === "shirt_only" && facts.included_items === "shirt_only" && facts.socks_status === "not_applicable") {
    return `${facts.listing_configuration}_${facts.audience}_shirt_only`;
  }

  if (facts.product_type === "full_kit" && ["kids", "men", "adult", "women", "baby"].includes(facts.audience)) {
    if (facts.included_items === "shirt_and_shorts" && facts.socks_status === "unavailable") {
      if (facts.listing_configuration === "plain_customisable") {
        return `plain_customisable_${facts.audience}_full_kit_without_socks`;
      }
      if (facts.listing_configuration === "pre_applied_player") {
        return `pre_applied_player_${facts.audience}_full_kit_without_socks`;
      }
    }

    if (facts.included_items === "shirt_shorts_and_socks" && facts.socks_status === "included") {
      if (facts.listing_configuration === "plain_customisable") {
        return `plain_customisable_${facts.audience}_full_kit_with_socks`;
      }
      if (facts.listing_configuration === "pre_applied_player") {
        return `pre_applied_player_${facts.audience}_full_kit_with_socks`;
      }
    }
  }

  return null;
}

function productNameConflict(facts) {
  const productName = String(facts.product_name || "").toLowerCase();
  const saysFootballKit = /\bfootball\s+kit\b/.test(productName);
  const saysShirt = /\b(?:football\s+)?shirt\b/.test(productName);

  if (saysFootballKit && facts.product_type !== "full_kit") {
    return "Product name says Football Kit, but Product selection is a single item. Confirm whether this should be Kit or Shirt.";
  }

  if (saysShirt && facts.product_type === "full_kit") {
    return "Product name says Shirt, but Product selection is Kit. Confirm whether the listing includes shorts and socks.";
  }

  return "";
}

function validateFacts(facts, branch) {
  const blockers = [];
  const reviewFlags = [];

  const required = [
    "product_name",
    "team",
    "season",
    "audience",
    "product_type",
    "kit_type",
    "sleeve_length",
    "included_items",
    "socks_status",
    "visible_size_range",
    "size_profile",
    "listing_configuration",
    "personalisation_status",
    "badge_status",
    "verification_status",
    "fact_status"
  ];

  required.forEach((field) => {
    if (!facts[field] || facts[field] === "unknown") {
      blockers.push(`${field} is required and cannot be unknown.`);
    }
  });

  if (!["available", "unavailable"].includes(facts.badge_status)) {
    blockers.push("badge_status must be available or unavailable.");
  }

  if (facts.badge_status === "available" && !facts.badge_league) {
    blockers.push("badge_league is required when badge_status is available.");
  }

  if (facts.version_style !== "fan_version") {
    blockers.push("KFK products must use the fixed fan version.");
  }

  if (facts.material !== "polyester") {
    blockers.push("KFK products must use the fixed polyester material value.");
  }

  if (Number(facts.badge_price_gbp) !== 3.99) {
    blockers.push("The fixed sleeve badge price must be £3.99.");
  }

  if (facts.verification_status === "conflict" || facts.verification_status === "unverified") {
    blockers.push(`verification_status is ${facts.verification_status}.`);
  }

  if (facts.fact_status !== "ready_for_generation") {
    blockers.push("fact_status must be ready_for_generation.");
  }

  const identityConflict = productNameConflict(facts);
  if (identityConflict) {
    blockers.push(identityConflict);
  }

  if (facts.product_type === "full_kit" && facts.included_items === "unknown") {
    blockers.push("Full-kit inclusions cannot be unknown.");
  }

  if (facts.product_type === "full_kit" && facts.socks_status === "unknown") {
    blockers.push("Socks status cannot be unknown for a full kit.");
  }

  if (facts.product_type === "shirt_only") {
    if (facts.included_items !== "shirt_only") {
      blockers.push("Shirt-only products must use included_items shirt_only.");
    }
    if (facts.socks_status !== "not_applicable") {
      blockers.push("Shirt-only products must use socks_status not_applicable.");
    }
    if (facts.audience === "adult") {
      blockers.push("Adult is reserved for generic adult kits. Choose Men or Women for a shirt-only product.");
    }
  }

  if (facts.audience === "kids" && facts.size_profile !== "kids_16_28") {
    blockers.push("Kids listings must use size_profile kids_16_28.");
  }

  if (facts.audience === "adult" && facts.size_profile !== "adult_s_2xl") {
    blockers.push("Adult listings must use size_profile adult_s_2xl.");
  }

  if (facts.audience === "men" && facts.size_profile !== "adult_s_2xl") {
    blockers.push("Men listings must use size_profile adult_s_2xl.");
  }

  if (facts.audience === "women" && facts.size_profile !== "women_s_2xl") {
    blockers.push("Women listings must use size_profile women_s_2xl.");
  }

  if (facts.audience === "baby" && facts.size_profile !== "baby_9_12") {
    blockers.push("Baby listings must use size_profile baby_9_12.");
  }

  if (facts.size_profile === "kids_16_28" && !facts.visible_size_range.toLowerCase().includes("kids sizes 16-28")) {
    blockers.push("visible_size_range must match Kids sizes 16-28 for size_profile kids_16_28.");
  }

  if (facts.size_profile === "adult_s_2xl" && !["adult sizes s-xxl", "men sizes s-xxl"].some((label) => facts.visible_size_range.toLowerCase().includes(label))) {
    blockers.push("visible_size_range must match Adult sizes S-XXL or Men sizes S-XXL for size_profile adult_s_2xl.");
  }

  if (facts.size_profile === "women_s_2xl" && !facts.visible_size_range.toLowerCase().includes("women sizes s–2xl")) {
    blockers.push("visible_size_range must match Women sizes S–2XL for size_profile women_s_2xl.");
  }

  if (facts.size_profile === "baby_9_12" && !facts.visible_size_range.toLowerCase().includes("baby sizes 9 and 12 (3–24 months)")) {
    blockers.push("visible_size_range must match Baby sizes 9 and 12 (3–24 months) for size_profile baby_9_12.");
  }

  if (facts.listing_configuration === "plain_customisable") {
    if (facts.personalisation_status !== "available") {
      blockers.push("Plain customisable listings must have personalisation_status available.");
    }
    if (facts.pre_applied_name || facts.pre_applied_number) {
      blockers.push("Plain customisable listings must not include a pre-applied player name or number.");
    }
    if (facts.print_price_included !== "not_applicable") {
      blockers.push("Plain customisable listings must use print_price_included not_applicable.");
    }
  }

  if (facts.listing_configuration === "pre_applied_player") {
    if (facts.personalisation_status !== "unavailable") {
      blockers.push("Pre-applied player listings must have personalisation_status unavailable.");
    }
    if (!facts.pre_applied_name || !facts.pre_applied_number) {
      blockers.push("Pre-applied player listings require pre_applied_name and pre_applied_number.");
    }
    if (facts.print_price_included !== "yes") {
      blockers.push("Pre-applied player listings must use print_price_included yes.");
    }
  }

  if (!branch) {
    blockers.push("No approved description branch matches these facts.");
  }

  if (facts.size_guide_tab_status !== "confirmed_present") {
    reviewFlags.push("Size guide is not confirmed; output can only be draft/review.");
  }

  if (facts.size_guide_location === "site_page" && !facts.size_guide_url) {
    reviewFlags.push("Size guide location is site_page but size_guide_url is blank.");
  }

  if (!facts.source_notes) {
    reviewFlags.push("source_notes is blank; add the human validation/evidence note before approval.");
  }

  if (facts.product_type === "full_kit" && facts.socks_status === "included" && !String(facts.main_colour_socks || "").trim()) {
    reviewFlags.push("Socks are included but the socks colour is blank; confirm it or leave it omitted if it cannot be verified.");
  }

  if (imageColourState.imageLoaded && facts.image_colour_confirmation !== "confirmed") {
    blockers.push("Image colour suggestions are awaiting team confirmation. Review the editable colour fields and click Confirm colours & Generate, or clear the image before generating.");
  }

  return { blockers, reviewFlags };
}

function sizeGuideSentence(facts) {
  if (facts.size_guide_tab_status !== "confirmed_present") return "";
  if (facts.size_guide_location === "product_tab") {
    return " Check the Size Guide tab for measurements.";
  }
  if (facts.size_guide_location === "site_page") {
    return " Check our Size Chart for measurements.";
  }
  return "";
}

function includedItemsHtml(facts) {
  const itemLabel = sentenceStart(productItemLabel(facts));
  const shirtText = facts.listing_configuration === "pre_applied_player"
    ? `${esc(itemLabel)} with ${esc(displayName(facts.pre_applied_name))} name and number ${esc(facts.pre_applied_number)} already applied to the back`
    : esc(itemLabel);

  if (facts.product_type === "shirt_only") {
    return `<li>${shirtText}</li>`;
  }

  const items = [
    `<li>${shirtText}</li>`,
    "<li>Matching shorts</li>"
  ];

  if (facts.socks_status === "included") {
    items.push("<li>Matching socks</li>");
  }

  return items.join("\n");
}

function mainColoursLine(facts) {
  const colours = [];
  const shirtColour = String(facts.main_colour_shirt || "").trim();
  const shortsColour = facts.product_type === "full_kit"
    ? String(facts.main_colour_shorts || "").trim()
    : "";
  const socksColour = facts.product_type === "full_kit" && facts.socks_status === "included"
    ? String(facts.main_colour_socks || "").trim()
    : "";

  if (shirtColour) colours.push(`${sentenceStart(shirtColour)} shirt`);
  if (shortsColour) colours.push(`${sentenceStart(shortsColour)} shorts`);
  if (socksColour) colours.push(`${sentenceStart(socksColour)} socks`);
  if (!colours.length) return "";

  return `<li><strong>Main colours:</strong> ${esc(colours.join("; "))}. Exact shades may vary slightly between screens and production batches. Please use the product photos as your guide.</li>`;
}

function materialLine(facts) {
  const notes = templateLibrary.copyRules?.materialNotes || [];
  const note = notes.length
    ? pick(notes, facts, 4)
    : "The fabric is designed to be lightweight and quick-drying. Exact fibre composition and fabric feel may vary slightly between production batches.";

  return `<li><strong>Material:</strong> Polyester. ${esc(note)}</li>`;
}

function badgeLine(facts) {
  if (facts.badge_status !== "available") return "";

  const price = Number(facts.badge_price_gbp || fixedKfkFacts.badge_price_gbp).toFixed(2);
  return `<li><strong>Sleeve badge:</strong> An optional ${esc(facts.badge_league)} sleeve badge can be added for &pound;${price}. Select it in the product options if required. It is not included in the base kit.</li>`;
}

function sizingWarningLine(facts) {
  const warningGroups = templateLibrary.copyRules?.sizingWarnings || {};
  const pool = warningGroups[facts.audience] || warningGroups.generic || [];
  if (!pool.length) return "";
  return `<li>${esc(pick(pool, facts, 7))}</li>`;
}

function insertSizingWarning(lines, facts) {
  const sizingLine = sizingWarningLine(facts);
  if (!sizingLine) return lines;
  if (!lines.length) return [sizingLine];
  return [lines[0], sizingLine, ...lines.slice(1)];
}

function renderDescription(facts, branch) {
  const template = pickBranchVariant(branch, facts);
  const opening = interpolate(template.opening, facts, { titleCaseProductLabels: true });

  const sizeLine = `<li><strong>Sizes:</strong> ${esc(facts.visible_size_range)}.${sizeGuideSentence(facts)}</li>`;
  const kitLine = facts.product_type === "full_kit"
    ? `<li><strong>Kit type:</strong> ${esc(titleCaseToken(facts.kit_type))} kit.</li>`
    : `<li><strong>Product type:</strong> ${esc(titleCaseToken(facts.kit_type))} ${esc(productItemLabel(facts))}.</li>`;
  const sleeveLabel = sleeveLengthLabel(facts);
  const sleeveLine = sleeveLabel ? `<li><strong>Sleeve length:</strong> ${esc(sleeveLabel)}.</li>` : "";
  const optionLines = [
    interpolate(template.keyDetail, facts),
    badgeLine(facts)
  ].filter(Boolean);
  const beforeOrderLines = template.beforeOrder
    .map((line) => interpolate(line, facts))
    .filter(Boolean);
  const beforeOrder = insertSizingWarning(beforeOrderLines, facts).join("\n");
  const productDetails = [
    "<li><strong>Version:</strong> Fan version.</li>",
    kitLine,
    mainColoursLine(facts),
    sizeLine,
    sleeveLine,
    materialLine(facts)
  ].filter(Boolean);

  return [
    `<p>${opening}</p>`,
    "",
    "<h3>What's Included</h3>",
    "<ul>",
    includedItemsHtml(facts),
    "</ul>",
    "",
    "<h3>Product Details</h3>",
    "<ul>",
    productDetails.join("\n"),
    "</ul>",
    "",
    "<h3>Options You Can Add</h3>",
    "<ul>",
    optionLines.join("\n"),
    "</ul>",
    "",
    "<h3>Before You Order</h3>",
    "<ul>",
    beforeOrder,
    "</ul>"
  ].join("\n");
}

function renderBundleDescription(facts) {
  const bundleBranch = detectBundleBranch(facts);
  const branchConfig = templateLibrary.bundle.branches[bundleBranch] || templateLibrary.bundle.branches.mixed_bundle;
  const template = pick(branchConfig.variants, facts, 1);
  let opening = interpolate(template.opening, facts);

  const itemsHtml = facts.bundle_items_list.map((item) => `<li>${esc(formatBundleItemForOutput(item))}</li>`).join("\n");
  const keyDetail = interpolate(template.keyDetail, facts);
  const beforeOrder = template.beforeOrder.map((line) => interpolate(line, facts)).join("\n");

  return [
    `<p>${opening}</p>`,
    "",
    "<h3>What's Included</h3>",
    "<ul>",
    itemsHtml,
    "</ul>",
    "",
    "<h3>Key Buying Details</h3>",
    "<ul>",
    `<li><strong>Sizes:</strong> ${esc(facts.visible_size_range)}.${sizeGuideSentence(facts)}</li>`,
    keyDetail,
    "</ul>",
    "",
    "<h3>Before You Order</h3>",
    "<ul>",
    beforeOrder,
    "</ul>"
  ].join("\n");
}

function validateBundleFacts(facts) {
  const blockers = [];
  const reviewFlags = [];
  const required = ["bundle_name"];

  required.forEach((field) => {
    if (!facts[field] || facts[field] === "unknown") {
      blockers.push(`${field} is required and cannot be unknown.`);
    }
  });

  if (facts.bundle_items_list.length < 2) {
    blockers.push("Bundle descriptions need at least two included items.");
  }

  if (!facts.source_notes) {
    reviewFlags.push("source_notes is blank; add the human validation/evidence note before approval.");
  }

  return { blockers, reviewFlags };
}

function auditDescription(html, facts, blockers, reviewFlags, resolvedBranch = null) {
  if (!html) {
    const qaStatus = blockers.length ? "block" : reviewFlags.length ? "review" : "pass";
    return {
      qa_status: qaStatus,
      product_ref: facts.product_name,
      site: facts.site,
      branch: detectBranch(facts),
      checks_run: [
        "fact_consistency",
        "configuration_logic"
      ],
      blockers,
      review_flags: reviewFlags,
      recommended_actions: recommendedActions(qaStatus, blockers, reviewFlags),
      generated_at: new Date().toISOString(),
      generator_version: "test_project_rule_builder_0.2.0"
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="root">${html}</div>`, "text/html");
  const tags = [...doc.querySelectorAll("#root *")].map((node) => node.tagName);
  const badTags = tags.filter((tag) => !allowedTags.has(tag));
  const text = doc.querySelector("#root").textContent.toLowerCase();
  const sectionText = (headingText) => {
    const heading = [...doc.querySelectorAll("#root h3")]
      .find((node) => node.textContent.trim().toLowerCase() === headingText);
    return heading?.nextElementSibling?.textContent.toLowerCase() || "";
  };
  const openingText = doc.querySelector("#root > p")?.textContent.toLowerCase() || "";
  const includedText = sectionText("what's included");
  const beforeOrderText = sectionText("before you order");
  const unsupported = forbiddenTerms.filter((term) => text.includes(term));

  if (badTags.length) {
    blockers.push(`HTML contains prohibited tag(s): ${[...new Set(badTags)].join(", ")}.`);
  }

  if (unsupported.length) {
    blockers.push(`Description contains unsupported claim term(s): ${unsupported.join(", ")}.`);
  }

  if (facts.product_type !== "bundle") {
    if (!text.includes("version: fan version")) {
      blockers.push("Product descriptions must identify the fixed fan version.");
    }
    if (!text.includes("material: polyester")) {
      blockers.push("Product descriptions must identify the fixed polyester material.");
    }
    if (facts.badge_status === "available" && (!facts.badge_league || !text.includes(facts.badge_league.toLowerCase()) || !text.includes("sleeve badge") || !text.includes("3.99"))) {
      blockers.push("Available badge products must show the entered league badge option and £3.99 price.");
    }
    if (facts.badge_status === "unavailable" && text.includes("sleeve badge")) {
      blockers.push("Unavailable badge products must not show the badge option.");
    }
    if (facts.product_type === "shirt_only" && sectionText("product details").includes("shorts")) {
      blockers.push("Shirt-only products must not show a shorts colour in Product Details.");
    }
  }

  if (facts.socks_status === "unavailable") {
    if (facts.site === "KFK") {
      if (includedText.includes("socks")) {
        blockers.push("KFK no-socks products must list only received items under What's Included.");
      }
      if (!openingText.includes("socks are not included") || !beforeOrderText.includes("socks are not included")) {
        blockers.push("KFK no-socks products must state that socks are not included in the opening and Before You Order.");
      }
    } else if (!text.includes("socks are not included")) {
      blockers.push("No-socks product must state that socks are not included.");
    }
  }

  if (facts.product_type === "shirt_only" && !text.includes("shorts and socks are not included")) {
    blockers.push("Shirt-only product must state that shorts and socks are not included.");
  }

  if (facts.listing_configuration === "pre_applied_player" && text.includes("add a custom name")) {
    blockers.push("Pre-applied player product must not invite customer-entered name/number personalisation.");
  }

  const qaStatus = blockers.length ? "block" : reviewFlags.length ? "review" : "pass";

  return {
    qa_status: qaStatus,
    product_ref: facts.product_name,
    site: facts.site,
    branch: resolvedBranch || detectBranch(facts),
    checks_run: [
      "fact_consistency",
      "html_structure",
      "configuration_logic",
      "global_component_duplication",
      "unsupported_claims"
    ],
    blockers,
    review_flags: reviewFlags,
    recommended_actions: recommendedActions(qaStatus, blockers, reviewFlags),
    generated_at: new Date().toISOString(),
    generator_version: "test_project_rule_builder_0.2.0"
  };
}

function recommendedActions(status, blockers, reviewFlags) {
  if (status === "pass") return ["Send HTML for human approval before WooCommerce update."];
  if (status === "review") return reviewFlags.map((flag) => `Review: ${flag}`);
  return blockers.map((blocker) => `Fix before generation: ${blocker}`);
}

function toYamlish(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return value.map((item) => `${pad}- ${item}`).join("\n");
  }
  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, item]) => {
      if (Array.isArray(item)) {
        return `${pad}${key}:\n${toYamlish(item, indent + 2)}`;
      }
      return `${pad}${key}: ${item}`;
    }).join("\n");
  }
  return String(value);
}

function setBadge(element, text, status) {
  element.textContent = text;
  element.className = `badge ${status}`;
}

function generate() {
  if (activeMode === "bundle") {
    generateBundle();
    return;
  }

  const facts = getFacts();

  const branch = detectBranch(facts);
  const validation = validateFacts(facts, branch);
  let html = "";
  let audit;

  if (validation.blockers.length) {
    audit = auditDescription("", facts, [...validation.blockers], [...validation.reviewFlags]);
    preview.className = "description-preview empty";
    preview.textContent = "BLOCK: fix the audit issues before generating customer-facing HTML.";
    htmlOutput.value = "";
  } else {
    html = renderDescription(facts, branch);
    audit = auditDescription(html, facts, [...validation.blockers], [...validation.reviewFlags]);
    preview.className = "description-preview";
    preview.innerHTML = html;
    htmlOutput.value = html;
  }

  setBadge(branchBadge, branch ? templateLibrary.branchLabels[branch] : "No approved branch", branch ? "pass" : "block");
  setBadge(qaBadge, audit.qa_status, audit.qa_status);
  auditOutput.textContent = toYamlish(audit);
}

function generateBundle() {
  const facts = getBundleFacts();
  const validation = validateBundleFacts(facts);
  const bundleBranch = detectBundleBranch(facts);
  let html = "";
  let audit;

  if (validation.blockers.length) {
    audit = auditDescription("", facts, [...validation.blockers], [...validation.reviewFlags], bundleBranch);
    preview.className = "description-preview empty";
    preview.textContent = "BLOCK: fix the audit issues before generating customer-facing HTML.";
    htmlOutput.value = "";
  } else {
    html = renderBundleDescription(facts);
    audit = auditDescription(html, facts, [...validation.blockers], [...validation.reviewFlags], bundleBranch);
    preview.className = "description-preview";
    preview.innerHTML = html;
    htmlOutput.value = html;
  }

  const bundleLabel = templateLibrary.bundle.branchLabels[bundleBranch] || templateLibrary.bundle.label;
  setBadge(branchBadge, bundleLabel, validation.blockers.length ? "block" : "pass");
  setBadge(qaBadge, audit.qa_status, audit.qa_status);
  auditOutput.textContent = toYamlish(audit);
}

function scheduleGenerate({ advanceVariant = false } = {}) {
  if (generateTimer) window.clearTimeout(generateTimer);
  if (advanceVariant) variantOffset += 1;
  syncProductTypeDefaults();
  syncAnotherInputs();

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  preview.className = "description-preview empty";
  preview.textContent = "Generating description...";

  generateTimer = window.setTimeout(() => {
    try {
      generate();
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      preview.className = "description-preview empty";
      preview.textContent = `ERROR: ${message}`;
      htmlOutput.value = "";
      auditOutput.textContent = toYamlish({
        qa_status: "block",
        error: message,
        generated_at: new Date().toISOString()
      });
      setBadge(qaBadge, "block", "block");
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate";
      generateTimer = null;
    }
  }, 500);
}

function loadSample() {
  if (activeMode === "bundle") {
    loadBundleSample();
    return;
  }

  const sample = {
    product_name: "Inter Miami Home Kids Football Kit 2026/27",
    team: "Inter Miami",
    season: "2026/27",
    main_colour_shirt: "Pink",
    main_colour_shorts: "Black",
    main_colour_socks: "",
    badge_status: "unavailable",
    badge_league: "",
    audience: "kids",
    product_type: "full_kit",
    kit_type: "home",
    sleeve_length: "short_sleeve",
    included_items: "shirt_and_shorts",
    socks_status: "unavailable",
    listing_configuration: "plain_customisable",
    pre_applied_name: "",
    pre_applied_number: ""
  };

  Object.entries(sample).forEach(([name, value]) => {
    const field = form.elements[name];
    if (field) field.value = value;
  });
  syncProductControlsFromFacts(sample);
  variantOffset = 0;
  generate();
}

function loadBundleSample() {
  const sample = {
    bundle_name: "Inter Miami Kids Bundle 2026/27",
    bundle_items: "Inter Miami 2026/27 Home Kit With Socks\nInter Miami 2026/27 Away Kit With Socks"
  };

  Object.entries(sample).forEach(([name, value]) => {
    const field = bundleForm.elements[name];
    if (field) field.value = value;
  });
  bundleItems = splitBundleItems(sample.bundle_items);
  bundleItemTheme.value = "Inter Miami";
  bundleItemSeason.value = "2026/27";
  renderBundleItemsList();
  variantOffset = 0;
  generate();
}

function syncAnotherInputs() {
  document.querySelectorAll("#factForm select, #bundleForm select").forEach((select) => {
    const input = select.form.elements[`${select.name}_another`];
    if (!input) return;
    const isAnother = select.value === "another";
    input.classList.toggle("visible", isAnother);
    input.required = isAnother;
    if (!isAnother) input.value = "";
  });
}

function setMode(mode) {
  activeMode = mode;
  form.classList.toggle("hidden", mode !== "product");
  bundleForm.classList.toggle("hidden", mode !== "bundle");
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  variantOffset = 0;
  setBadge(branchBadge, mode === "bundle" ? "Bundle mode" : "No branch yet", "neutral");
  setBadge(qaBadge, "not run", "neutral");
  preview.className = "description-preview empty";
  preview.textContent = "Generate a description to preview it here.";
  htmlOutput.value = "";
  auditOutput.textContent = "qa_status: not_run";
  syncAnotherInputs();
  syncProductSelectionFields();
}

function syncProductTypeDefaults() {
  syncProductSelectionFields();
  const productType = form.elements.product_type.value;
  if (productType === "shirt_only") {
    form.elements.included_items.value = "shirt_only";
    form.elements.socks_status.value = "not_applicable";
  }
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.view}View`).classList.add("active");
  });
});

document.querySelectorAll(".mode-tab").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

generateBtn.addEventListener("click", () => scheduleGenerate({ advanceVariant: true }));
loadSampleBtn.addEventListener("click", loadSample);
nextVariantBtn.addEventListener("click", () => {
  scheduleGenerate({ advanceVariant: true });
});
imageColourFileInput.addEventListener("change", handleImageColourFileChange);
clearImageColourBtn.addEventListener("click", () => resetImageColourAssistant({ clearFile: true }));
imageColourCanvas.addEventListener("click", handleImageColourCanvasClick);
document.querySelectorAll("[data-colour-target-select]").forEach((button) => {
  button.addEventListener("click", () => setActiveImageColourTarget(button.dataset.colourTargetSelect));
});
document.querySelectorAll("[data-use-colour-suggestion]").forEach((button) => {
  button.addEventListener("click", () => useImageColourSuggestion(button.dataset.useColourSuggestion));
});
imageColourConfirm.addEventListener("change", () => {
  if (!imageColourState.imageLoaded) return;
  const isChecked = imageColourConfirm.checked;
  imageColourState.confirmed = false;
  imageColourConfirmationInput.value = "pending_review";
  imageColourConfirm.checked = isChecked;
  updateImageColourAssistantUi();
});
confirmColoursGenerateBtn.addEventListener("click", confirmImageColoursAndGenerate);
productNameInput.addEventListener("input", () => {
  inferProductSelectionFromName();
  markImageColoursForReview();
  variantOffset = 0;
  scheduleGenerate();
});
[mainColourShirtInput, mainColourShortsInput, mainColourSocksInput, badgeLeagueInput].forEach((field) => {
  field.addEventListener("input", () => {
    if (field !== badgeLeagueInput) markImageColoursForReview();
    variantOffset = 0;
    scheduleGenerate();
  });
});
productOtherKitType.addEventListener("input", () => {
  syncProductSelectionFields();
  variantOffset = 0;
  scheduleGenerate();
});
[productPrintName, productPrintNumber].forEach((field) => {
  field.addEventListener("input", () => {
    isPrintInferredFromProductName = false;
  });
