import { Badge } from "@grade10/design-system/components/display/badge";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { DemoFlow } from "../shared/demo-flow";
import { LiveActions, WatchingAction, WatchOnlyActions } from "./fixtures";
import { ListingBidPanel } from "./listing-bid-panel";

const YOU = "You";

type DemoState = {
  bids: readonly ScriptBid[];
  watching: boolean;
};

type ScriptBid = {
  bidder: string;
  amount: string;
  at: string;
};

/**
 * A live ledger told as a sequence of bids. You are signed in as "You";
 * everyone else is a rival. Each step is one new leading bid.
 */
const SCRIPT: readonly ScriptBid[] = [
  { bidder: "Bidder 2", amount: "HK$1,200.00", at: "21 Aug 2026, 11:00 UTC" },
  { bidder: YOU, amount: "HK$1,300.00", at: "21 Aug 2026, 11:04 UTC" },
  { bidder: "Bidder 3", amount: "HK$1,400.00", at: "21 Aug 2026, 11:08 UTC" },
  { bidder: YOU, amount: "HK$1,500.00", at: "21 Aug 2026, 11:12 UTC" },
  { bidder: "Bidder 2", amount: "HK$1,600.00", at: "21 Aug 2026, 11:16 UTC" },
];

function standingOf(bids: readonly ScriptBid[]) {
  const yours = bids.findLast((bid) => bid.bidder === YOU);
  if (!yours) return undefined;
  const lead = bids.at(-1);
  if (lead?.bidder === YOU) {
    return (
      <HStack
        className="w-full"
        gap="sm"
        hAlign="space-between"
        vAlign="center"
      >
        <VStack gap="xs">
          <Text size="sm">Your bid: {yours.amount}</Text>
          <Text size="xs" tone="secondary">
            {yours.at}
          </Text>
        </VStack>
        <Badge variant="success">Highest Bid</Badge>
      </HStack>
    );
  }
  return (
    <HStack className="w-full" gap="sm" hAlign="space-between" vAlign="center">
      <VStack gap="xs">
        <Text size="sm">Your bid: {yours.amount}</Text>
        <Text size="xs" tone="secondary">
          {yours.at}
        </Text>
      </VStack>
      <Badge variant="warning">Outbid</Badge>
    </HStack>
  );
}

function historyOf(bids: readonly ScriptBid[]) {
  if (bids.length === 0) {
    return <Text tone="secondary">No bids yet.</Text>;
  }
  const newestFirst = [...bids].reverse().slice(0, 3);
  return (
    <List aria-label="Bid history">
      {newestFirst.map((bid) => (
        <ListItem
          className="p-0 py-1"
          divider={false}
          key={`${bid.bidder}-${bid.amount}`}
        >
          <Text size="xs" tone="secondary">
            {bid.bidder} · {bid.amount}
          </Text>
        </ListItem>
      ))}
    </List>
  );
}

function captionOf(bids: readonly ScriptBid[]): string {
  const lead = bids.at(-1);
  if (!lead) return "Starting bid";
  if (lead.bidder === YOU) return "Your bid · Highest Bid";
  if (bids.some((bid) => bid.bidder === YOU)) return "Your bid · Outbid";
  return "Current bid";
}

function panelFor({ bids, watching }: DemoState) {
  const lead = bids.at(-1);
  return (
    <ListingBidPanel
      actions={<LiveActions />}
      bidCount={`${bids.length} ${bids.length === 1 ? "Bid" : "Bids"}`}
      deadline="1 Sep 2026, 18:00 UTC"
      endsLabel="Ends"
      extensionLabel="Extended bidding"
      extensionValue="30 minutes"
      extensionTooltip="Bids placed in the final 30 minutes extend the auction by 30 minutes."
      extensionTooltipLabel="Extended bidding rules"
      history={historyOf(bids)}
      kicker="Listing 12 · September Slabs"
      price={lead?.amount ?? "HK$1,200.00"}
      priceHint="Buyer's premium is added at invoice."
      priceLabel={lead ? "Current bid" : "Starting bid"}
      remaining="13D 11H 33M 47S"
      standing={standingOf(bids)}
      title="1999 Charizard, PSA 10"
      watchAction={watching ? <WatchingAction /> : <WatchOnlyActions />}
      watching={watching}
    />
  );
}

const CASES: ReadonlyArray<readonly [string, DemoState]> = [
  [captionOf([]), { bids: [], watching: false }],
  ...SCRIPT.map((_, index) => {
    const bids = SCRIPT.slice(0, index + 1);
    return [captionOf(bids), { bids, watching: bids.length > 0 }] as const;
  }),
];

/** Steps a live lot through rival bids so the panel's price, history, and standing update in place. */
export function LiveBiddingDemo() {
  return <DemoFlow cases={CASES}>{(bids) => panelFor(bids)}</DemoFlow>;
}
