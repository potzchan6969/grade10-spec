import type { BidMode, BiddingState } from "./types";
import { stateMeta } from "./fixtures";

export function bidModeForState(state: BiddingState): BidMode {
  if (state === "live-manual") return "manual";
  if (state === "live-auto-leading" || state === "live-auto-overtaken") {
    return "auto";
  }
  return "manual";
}

export function auctionHeaderLabel(state: BiddingState): string {
  const meta = stateMeta(state);
  if (meta.opens) return "Opens soon";
  if (meta.closed) return "Auction closed";
  return "Live Auction";
}
