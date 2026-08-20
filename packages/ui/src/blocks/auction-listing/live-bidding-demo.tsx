import { Badge } from "@grade10/design-system/components/display/badge";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useState } from "react";
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
  if (!lead) return "Live — waiting for the first bid.";
  if (lead.bidder === YOU) return `${YOU} bid ${lead.amount} — you lead.`;
  const youHaveBid = bids.some((bid) => bid.bidder === YOU);
  if (youHaveBid) {
    return `${lead.bidder} bid ${lead.amount} — you're outbid.`;
  }
  return `${lead.bidder} bid ${lead.amount}.`;
}

/** Steps a live lot through rival bids so the panel's price, history, and standing update in place. */
export function LiveBiddingDemo() {
  const [step, setStep] = useState(0);
  const bids = SCRIPT.slice(0, step);
  const lead = bids.at(-1);

  return (
    <VStack gap="md">
      <VStack gap="sm">
        <Text size="sm" tone="secondary">
          Watching as {YOU}
        </Text>
        <Text>{captionOf(bids)}</Text>
        <HStack gap="sm">
          <Button
            disabled={step >= SCRIPT.length}
            onClick={() => setStep((current) => current + 1)}
            size="sm"
          >
            Next bid
          </Button>
          <Button
            disabled={step === 0}
            onClick={() => setStep(0)}
            size="sm"
            variant="outline"
          >
            Reset
          </Button>
        </HStack>
      </VStack>
      <ListingBidPanel
        actions={<LiveActions />}
        bidCount={`${bids.length} bid${bids.length === 1 ? "" : "s"}`}
        deadline="1 Sep 2026, 18:00 UTC"
        endsLabel="Ends"
        extensionLabel="Extended bidding interval"
        extensionValue="30 minutes"
        hideHistoryLabel="Hide bid history"
        history={historyOf(bids)}
        kicker="Listing 12 · September Slabs"
        price={lead?.amount ?? "No bids yet"}
        priceHint="Buyer's premium is added at invoice."
        priceLabel="Current bid"
        remaining="13D 11H 33M 47S"
        showHistoryLabel="Show bid history"
        standing={standingOf(bids)}
        title="1999 Charizard, PSA 10"
      />
    </VStack>
  );
}
