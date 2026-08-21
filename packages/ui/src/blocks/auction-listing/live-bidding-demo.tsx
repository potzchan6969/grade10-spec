import { Badge } from "@grade10/design-system/components/display/badge";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { DemoFlow } from "../shared/demo-flow";
import { LiveActions } from "./fixtures";
import { ListingBidPanel } from "./listing-bid-panel";

const YOU = "You";

type ScriptBid = {
  bidder: string;
  amount: string;
};

/**
 * A live ledger told as a sequence of bids. You are signed in as "You";
 * everyone else is a rival. Each step is one new leading bid.
 */
const SCRIPT: readonly ScriptBid[] = [
  { bidder: "Bidder 2", amount: "HK$1,200.00" },
  { bidder: YOU, amount: "HK$1,300.00" },
  { bidder: "Bidder 3", amount: "HK$1,400.00" },
  { bidder: YOU, amount: "HK$1,500.00" },
  { bidder: "Bidder 2", amount: "HK$1,600.00" },
];

function standingOf(bids: readonly ScriptBid[]) {
  const yours = bids.findLast((bid) => bid.bidder === YOU);
  if (!yours) return undefined;
  const lead = bids.at(-1);
  if (lead?.bidder === YOU) {
    return (
      <HStack gap="sm" vAlign="center">
        <Badge variant="success">You're the highest bidder</Badge>
        <Text size="sm" tone="secondary">
          {yours.amount} as {YOU}
        </Text>
      </HStack>
    );
  }
  return (
    <HStack gap="sm" vAlign="center">
      <Badge variant="warning">You've been outbid</Badge>
      <Text size="sm" tone="secondary">
        Your bid {yours.amount}
      </Text>
    </HStack>
  );
}

function historyOf(bids: readonly ScriptBid[]) {
  if (bids.length === 0) {
    return <Text tone="secondary">No bids yet.</Text>;
  }
  const newestFirst = [...bids].reverse();
  return (
    <List aria-label="Bid history">
      {newestFirst.map((bid, index) => (
        <ListItem
          description={index === 0 ? "leading" : "outbid"}
          divider={index < newestFirst.length - 1}
          key={`${bid.bidder}-${bid.amount}`}
        >
          {bid.bidder} · {bid.amount}
        </ListItem>
      ))}
    </List>
  );
}

function captionOf(bids: readonly ScriptBid[]): string {
  const lead = bids.at(-1);
  if (!lead) return "Waiting";
  return `${lead.bidder} · ${lead.amount}`;
}

function panelFor(bids: readonly ScriptBid[]) {
  const lead = bids.at(-1);
  return (
    <ListingBidPanel
      actions={<LiveActions />}
      bidCount={`${bids.length} bid${bids.length === 1 ? "" : "s"}`}
      copy={{
        price: "Current bid",
        ends: "Ends",
        extension: "Extended bidding interval",
      }}
      deadline="1 Sep 2026, 18:00 UTC"
      extensionValue="30 minutes"
      history={historyOf(bids)}
      kicker="Listing 12 · September Slabs"
      price={lead?.amount ?? "No bids yet"}
      priceHint="Buyer's premium is added at invoice."
      remaining="13D 11H 33M 47S"
      standing={standingOf(bids)}
      title="1999 Charizard, PSA 10"
    />
  );
}

const CASES: ReadonlyArray<readonly [string, readonly ScriptBid[]]> = [
  ["Waiting", []],
  ...SCRIPT.map((_, index) => {
    const bids = SCRIPT.slice(0, index + 1);
    return [captionOf(bids), bids] as const;
  }),
];

/** Steps a live lot through rival bids so the panel's price, history, and standing update in place. */
export function LiveBiddingDemo() {
  return <DemoFlow cases={CASES}>{(bids) => panelFor(bids)}</DemoFlow>;
}
