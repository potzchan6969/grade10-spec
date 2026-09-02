/** Per-listing extension settings in seconds, aligned with grade10-site/auction/auction. */
export type ListingExtensionPolicy = {
  windowSeconds: number;
  durationSeconds: number;
  capSeconds?: number;
};

export const DEFAULT_LISTING_EXTENSION_POLICY: ListingExtensionPolicy = {
  windowSeconds: 1800,
  durationSeconds: 1800,
};

/** Alternate demo policy: 5-minute window, 15-minute duration. */
export const SHORT_WINDOW_EXTENSION_POLICY: ListingExtensionPolicy = {
  windowSeconds: 300,
  durationSeconds: 900,
};

export function extensionPolicyToMs(policy: ListingExtensionPolicy): {
  windowMs: number;
  durationMs: number;
} {
  return {
    windowMs: policy.windowSeconds * 1000,
    durationMs: policy.durationSeconds * 1000,
  };
}

export function formatExtensionMinutes(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

/** English stand-in for `auctionListing.autoExtendedTooltip` in demos and preview. */
export function formatAutoExtendedTooltip(
  policy: ListingExtensionPolicy,
): string {
  const windowLabel = formatExtensionMinutes(policy.windowSeconds);
  const durationLabel = formatExtensionMinutes(policy.durationSeconds);
  return `A bid in the last ${windowLabel} adds ${durationLabel} to the close. Repeats until ${durationLabel} pass with no bids, up to the listing cap.`;
}

/** English stand-in for `auctionListing.extendedBiddingRules` in demos. */
export function formatExtendedBiddingRules(
  policy: ListingExtensionPolicy,
): string {
  const windowLabel = formatExtensionMinutes(policy.windowSeconds);
  const durationLabel = formatExtensionMinutes(policy.durationSeconds);
  return `If a bid is placed during the final ${windowLabel}, the auction extends by ${durationLabel}. Extensions continue until no bid is placed in the final window.`;
}

export function formatExtensionDurationValue(
  policy: ListingExtensionPolicy,
): string {
  return formatExtensionMinutes(policy.durationSeconds);
}

export function shouldExtendCloseAt(
  closesAtMs: number,
  policy: ListingExtensionPolicy,
  nowMs = Date.now(),
): boolean {
  const { windowMs } = extensionPolicyToMs(policy);
  const remainingMs = closesAtMs - nowMs;
  return remainingMs > 0 && remainingMs <= windowMs;
}

export function extendRecordedCloseAt(
  policy: ListingExtensionPolicy,
  nowMs = Date.now(),
): number {
  const { durationMs } = extensionPolicyToMs(policy);
  return nowMs + durationMs;
}
