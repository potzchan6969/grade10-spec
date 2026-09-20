/** Letter kinds used as `utm_campaign`. */
export type AuctionEmailCampaign =
  | "bidding_opens_in_24h"
  | "bidding_has_opened"
  | "bidding_closes_in_24h"
  | "extended_bidding"
  | "new_bid"
  | "outbid"
  | "lot_closed_didnt_win"
  | "lot_watched_sold"
  | "lot_watched_ended"
  | "auction_won"
  | "setup_reminder"
  | "setup_overdue"
  | "payment_reminder"
  | "payment_overdue"
  | "payment_received"
  | "payment_received_partial"
  | "shipped"
  | "delivered"
  | "order_cancelled";

/** Control that produced the click — `utm_content`. */
export type AuctionEmailLinkContent =
  | "logo"
  | "cta"
  | "secondary_cta"
  | "lot_image"
  | "lot_title"
  | "manage_alerts";

const UTM_SOURCE = "email";
const UTM_MEDIUM = "auction_notification";

/**
 * Append Grade10 auction-email campaign tags without changing the path.
 * Base URLs from the sender should not already carry these params.
 */
export function withAuctionEmailCampaignTags(
  url: string,
  campaign: AuctionEmailCampaign,
  content: AuctionEmailLinkContent,
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
