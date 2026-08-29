import { Badge } from "@grade10/design-system/components/display/badge";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FlowContainer } from "../shared/flow-container";
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
  { bidder: "Bidder 1", amount: "HK$1,250.00", at: "21 Aug 2026, 11:02 UTC" },
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
  if (bids.length === 0) return null;
  const newestFirst = [...bids].reverse().slice(0, 3);
  return (
    <List aria-label="Bid history">
      {newestFirst.map((bid) => (
        <ListItem
          className="t-bid-reveal p-0 py-1"
          divider={false}
          key={`${bid.bidder}-${bid.amount}`}
        >
          <HStack className="w-full" gap="sm" hAlign="space-between">
            <Text size="xs" tone="secondary">
              {bid.bidder}
            </Text>
            <Text
              className="text-right tabular-nums"
              size="xs"
              tone="secondary"
            >
              {bid.amount}
            </Text>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
}

function captionOf(bids: readonly ScriptBid[]): string {
  const lead = bids.at(-1);
  if (!lead) return "Starting bid";
  const standing =
    lead.bidder === YOU
      ? "Your bid · Highest Bid"
      : bids.some((bid) => bid.bidder === YOU)
        ? "Your bid · Outbid"
        : "Current bid";
  return `${standing} · ${lead.amount}`;
}

function panelFor({ bids, watching }: DemoState) {
  const lead = bids.at(-1);
  return (
    <ListingBidPanel
      copy={{
        price: lead ? "Current bid" : "Starting bid",
        ends: "Ends",
        extension: "Extended bidding",
        extensionTooltip: "Extended bidding rules",
        maximum: "Your maximum",
      }}
      actions={<LiveActions />}
      bidCount={`${bids.length} ${bids.length === 1 ? "Bid" : "Bids"}`}
      deadline="1 Sep 2026, 18:00 UTC"
      extensionValue="30 minutes"
      extensionTooltip="Bids placed in the final 30 minutes extend the auction by 30 minutes."
      history={historyOf(bids)}
      kicker="Listing 12 · September Slabs"
      price={lead?.amount ?? "HK$1,200.00"}
      priceHint="Buyer's premium is added at invoice."
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
  return (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          The sequence covers a bidder moving from no participation to leading,
          then being outbid, then leading again. Each transition must replace
          the price, bid count, history, watch state, and standing together so a
          stale status cannot encourage the wrong next action.
        </p>
      }
    >
      {(bids) => panelFor(bids)}
    </FlowContainer>
  );
}
