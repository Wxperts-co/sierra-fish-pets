import { CartItem, Product } from "@/types";

// Non-continental US states / territories / military codes
const NON_CONTINENTAL_US_STATES = new Set([
  "AK", "HI", "PR", "VI", "GU", "AS", "MP", "AA", "AE", "AP"
]);

const NON_CONTINENTAL_FULL_NAMES = new Set([
  "alaska", "hawaii", "puerto rico", "virgin islands", "guam", "american samoa", "northern mariana islands"
]);

/**
 * Checks if a product is an AquaDREAM tank (drop-shipped directly from manufacturer).
 * AquaDREAM tanks receive FREE SHIPPING, but are NOT eligible for store pickup.
 */
export function isAquaDreamProduct(product: Product): boolean {
  const brand = (product.brand || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());

  return (
    brand.includes("aquadream") ||
    name.includes("aquadream") ||
    tags.some((t) => t.includes("aquadream"))
  );
}

/**
 * Checks if a product is a Fish Tank System or Filter.
 * Fish Tank Systems & Filters receive FREE SHIPPING.
 */
export function isFilterProduct(product: Product): boolean {
  const name = (product.name || "").toLowerCase();
  const subcat = (product.subcategorySlug || "").toLowerCase();
  const cat = (product.categorySlug || "").toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());

  return (
    subcat.includes("filter") ||
    cat.includes("filter") ||
    name.includes("filter") ||
    name.includes("filtration") ||
    tags.some((t) => t.includes("filter"))
  );
}

/**
 * Checks if a product is a Fish Tank / Aquarium or UNS Tank/Stand/Lid (Category 150-160).
 * These items are PICK UP IN STORE ONLY (cannot be shipped to home), UNLESS it is an AquaDREAM tank.
 */
export function isPickupOnlyProduct(product: Product): boolean {
  // AquaDREAM tanks drop-ship direct from manufacturer, so they are NOT pickup only.
  if (isAquaDreamProduct(product)) return false;

  const brand = (product.brand || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const subcat = (product.subcategorySlug || "").toLowerCase();
  const cat = (product.categorySlug || "").toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());

  // Check Category 150-160 UNS Tanks, Stands & Lids
  const isUNSOrCategory150_160 =
    brand.includes("uns") ||
    name.includes("uns ") ||
    tags.some((t) => t.includes("uns") || t.includes("150") || t.includes("160") || t.includes("category-150") || t.includes("category-160")) ||
    cat.includes("150") ||
    cat.includes("160");

  // Check Fish Tanks
  const isFishTank =
    name.includes("fish tank") ||
    name.includes("aquarium tank") ||
    name.includes("rimless tank") ||
    subcat.includes("fish-tank") ||
    subcat.includes("aquarium") ||
    tags.some((t) => t.includes("fish tank") || t.includes("aquarium tank"));

  return isUNSOrCategory150_160 || isFishTank;
}

/**
 * Checks if a product is a Live Plant.
 * Live Plants require 2nd Day Shipping (0.25 lbs each, 6"x2"x2").
 */
export function isLivePlantProduct(product: Product): boolean {
  const name = (product.name || "").toLowerCase();
  const subcat = (product.subcategorySlug || "").toLowerCase();
  const cat = (product.categorySlug || "").toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());

  return (
    subcat.includes("plant") ||
    cat.includes("plant") ||
    name.includes("plant") ||
    tags.some((t) => t.includes("live plant") || t.includes("plant"))
  );
}

/**
 * Validates whether a shipping address is within the Continental United States.
 */
export function validateContinentalUSAddress(address?: {
  state?: string;
  country?: string;
  zipCode?: string;
}): { isValid: boolean; errorMsg?: string } {
  if (!address) return { isValid: true };

  const country = (address.country || "").trim().toLowerCase();
  const state = (address.state || "").trim().toUpperCase();

  // Allow standard US country names
  const isUS =
    country === "" ||
    country === "united states" ||
    country === "us" ||
    country === "usa" ||
    country === "united states of america";

  if (!isUS) {
    return {
      isValid: false,
      errorMsg: "Shipping is currently only available within the Continental United States.",
    };
  }

  if (NON_CONTINENTAL_US_STATES.has(state) || NON_CONTINENTAL_FULL_NAMES.has(state.toLowerCase())) {
    return {
      isValid: false,
      errorMsg: `Shipping to ${state} is not available. We only ship to the Continental US (48 states).`,
    };
  }

  return { isValid: true };
}

export interface ShippingAndTaxResult {
  shippingCost: number;
  taxAmount: number;
  taxRate: number; // e.g. 0.105 for 10.5%
  hasLivePlants: boolean;
  hasPickupOnlyItems: boolean;
  hasDropShipOnlyItems: boolean;
  canFulfillViaShipping: boolean;
  canFulfillViaPickup: boolean;
  shippingTierLabel: string;
}

/**
 * Calculates Shipping Cost and Sales Tax for a cart.
 *
 * Freight Rates (for items requiring paid standard shipping):
 * - $0.00 – $74.99: $9.99
 * - $75.00 – $124.99: $14.99
 * - $125.00+: FREE SHIPPING
 *
 * Free shipping overrides:
 * - All AquaDREAM tanks (Drop-ship direct)
 * - All Fish Tank Systems & Filters
 *
 * Tax Rate: 10.5% for Renton, WA (or store pickup)
 */
export function calculateCartShippingAndTax(
  items: CartItem[],
  fulfillmentMethod: "shipping" | "pickup" = "shipping",
  address?: { state?: string; city?: string; zipCode?: string; country?: string }
): ShippingAndTaxResult {
  let hasLivePlants = false;
  let hasPickupOnlyItems = false;
  let hasDropShipOnlyItems = false;

  let totalSubtotal = 0;
  let shippableSubtotalNeedingFreight = 0;

  items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    totalSubtotal += itemTotal;

    if (isLivePlantProduct(item.product)) {
      hasLivePlants = true;
    }

    if (isAquaDreamProduct(item.product)) {
      hasDropShipOnlyItems = true;
    }

    if (isPickupOnlyProduct(item.product)) {
      hasPickupOnlyItems = true;
    }

    // Determine if this product needs standard freight charge
    const isFreeShippingItem = isAquaDreamProduct(item.product) || isFilterProduct(item.product);
    if (!isFreeShippingItem && !isPickupOnlyProduct(item.product)) {
      shippableSubtotalNeedingFreight += itemTotal;
    }
  });

  const canFulfillViaShipping = !hasPickupOnlyItems;
  const canFulfillViaPickup = !hasDropShipOnlyItems;

  // Calculate Shipping Cost
  let shippingCost = 0;
  let shippingTierLabel = "Free Shipping";

  if (fulfillmentMethod === "pickup") {
    shippingCost = 0;
    shippingTierLabel = "Store Pickup (Free)";
  } else {
    // If entire cart qualifies for free shipping
    if (shippableSubtotalNeedingFreight <= 0) {
      shippingCost = 0;
      shippingTierLabel = "FREE SHIPPING";
    } else if (totalSubtotal >= 125) {
      shippingCost = 0;
      shippingTierLabel = "FREE SHIPPING ($125+ Order)";
    } else if (totalSubtotal >= 75) {
      shippingCost = 14.99;
      shippingTierLabel = "$14.99 Tiered Shipping ($75-$124.99)";
    } else {
      shippingCost = 9.99;
      shippingTierLabel = "$9.99 Tiered Shipping ($0-$74.99)";
    }
  }

  // Tax Rate Calculation (10.5% for Renton, WA or In-Store Pickup)
  let taxRate = 0.105; // Default 10.5% rate for Renton WA store
  const stateUpper = (address?.state || "").toUpperCase();
  const cityLower = (address?.city || "").toLowerCase();
  const zip = (address?.zipCode || "").trim();

  const isRentonOrWA =
    fulfillmentMethod === "pickup" ||
    stateUpper === "WA" ||
    stateUpper === "WASHINGTON" ||
    cityLower.includes("renton") ||
    zip.startsWith("9805");

  if (isRentonOrWA) {
    taxRate = 0.105; // 10.5%
  } else {
    taxRate = 0.105; // Standard default rate
  }

  const taxAmount = Number((totalSubtotal * taxRate).toFixed(2));

  return {
    shippingCost,
    taxAmount,
    taxRate,
    hasLivePlants,
    hasPickupOnlyItems,
    hasDropShipOnlyItems,
    canFulfillViaShipping,
    canFulfillViaPickup,
    shippingTierLabel,
  };
}
