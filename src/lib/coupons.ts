/**
 * coupons.ts
 *
 * Defines all discount rules and coupon codes for Frizly Crunch.
 *
 * QUANTITY-BASED AUTO-DISCOUNTS (Launching Offer):
 *   1 pack  → 5% off
 *   2 packs → 10% off
 *   3+ packs → 15% off
 *
 * EXCLUSIVE CODES (20% off, single-use per code):
 *   RAMYA20A  — Exclusive coupon #1 for Ramya
 *   RAMYA20B  — Exclusive coupon #2 for Ramya
 *   RAMYA20C  — Exclusive coupon #3 for Ramya
 */

export interface DiscountResult {
  /** Discount percentage (0–100) */
  discountPercent: number;
  /** Discount amount in ₹ */
  discountAmount: number;
  /** Final price after discount */
  finalTotal: number;
  /** Label shown to user */
  label: string;
  /** Type of discount applied */
  type: 'auto' | 'coupon' | 'none';
}

// ---------------------------------------------------------------------------
// Quantity-based auto-discount tiers (Launching Offer)
// ---------------------------------------------------------------------------
export const LAUNCH_TIERS = [
  { minPacks: 3, percent: 15 },
  { minPacks: 2, percent: 10 },
  { minPacks: 1, percent: 5 },
];

/** Returns the auto-discount percent based on total number of packs in cart */
export function getAutoDiscount(totalPacks: number): number {
  for (const tier of LAUNCH_TIERS) {
    if (totalPacks >= tier.minPacks) return tier.percent;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Exclusive coupon codes
// ---------------------------------------------------------------------------
export const EXCLUSIVE_COUPONS: Record<string, { percent: number; description: string }> = {
  RAMYA20A: { percent: 20, description: 'Exclusive 20% off – Code #1' },
  RAMYA20B: { percent: 20, description: 'Exclusive 20% off – Code #2' },
  RAMYA20C: { percent: 20, description: 'Exclusive 20% off – Code #3' },
};

// ---------------------------------------------------------------------------
// Core function: apply coupon to an order
// ---------------------------------------------------------------------------
/**
 * Applies a coupon code if provided, otherwise applies the auto quantity discount.
 * Coupon code discount supersedes the auto discount (best discount wins).
 */
export function applyDiscount(
  couponCode: string | null | undefined,
  totalPacks: number,
  subtotal: number
): DiscountResult & { couponValid: boolean; couponError?: string } {
  let discountPercent = 0;
  let type: 'auto' | 'coupon' | 'none' = 'none';
  let label = '';
  let couponValid = true;
  let couponError: string | undefined;

  // 1. Try coupon code first
  if (couponCode) {
    const code = couponCode.toUpperCase().trim();
    const coupon = EXCLUSIVE_COUPONS[code];
    if (coupon) {
      discountPercent = coupon.percent;
      type = 'coupon';
      label = `🎟️ Coupon "${code}" — ${coupon.percent}% off`;
    } else {
      couponValid = false;
      couponError = 'Invalid coupon code';
    }
  }

  // 2. Fall back to auto quantity discount (or take whichever is better)
  const autoPercent = getAutoDiscount(totalPacks);
  if (autoPercent > discountPercent) {
    discountPercent = autoPercent;
    type = 'auto';
    const tierLabel =
      totalPacks >= 3 ? '3+ packs → 15% off' :
      totalPacks === 2 ? '2 packs → 10% off' :
      '1 pack → 5% off';
    label = `🎉 Launching Offer: ${tierLabel}`;
    // If coupon was invalid but auto applies, don't show coupon error
    if (!couponValid) {
      couponError = 'Invalid coupon code — Launching Offer applied instead';
    }
  }

  if (discountPercent === 0) {
    type = 'none';
    label = '';
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  return {
    discountPercent,
    discountAmount,
    finalTotal,
    label,
    type,
    couponValid: couponCode ? (EXCLUSIVE_COUPONS[couponCode.toUpperCase().trim()] !== undefined) : true,
    couponError,
  };
}
