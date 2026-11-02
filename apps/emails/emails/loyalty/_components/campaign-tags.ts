/** Letter kinds used as `utm_campaign`. */
export type LoyaltyEmailCampaign = "points_expiring" | "gold_tier_ending";

/** Control that produced the click — `utm_content`. */
export type LoyaltyEmailLinkContent = "logo" | "cta";

const UTM_SOURCE = "email";
const UTM_MEDIUM = "loyalty_notification";

/**
 * Append Grade10 loyalty-email campaign tags without changing the path.
 * Base URLs from the sender should not already carry these params.
 */
export function withLoyaltyEmailCampaignTags(
  url: string,
  campaign: LoyaltyEmailCampaign,
  content: LoyaltyEmailLinkContent,
): string {
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: campaign,
    utm_content: content,
  });
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}${params.toString()}`;
}
