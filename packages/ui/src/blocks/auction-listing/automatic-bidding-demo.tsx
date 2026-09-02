import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { NumberInput } from "@grade10/design-system/components/forms/number-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { type FormEvent, useState } from "react";
import { ListingBidPanel } from "./listing-bid-panel";

type AutomaticBiddingListingDemoMode =
  | "first"
  | "leading"
  | "overtaken"
  | "accepted-not-leading";

const copy = {
  automaticExplanation:
    "We’ll bid automatically only as needed, up to your maximum.",
  holdExplanation:
    "Your card hold covers the maximum. You may pay less if the auction ends below it.",
  maximumLabel: "Maximum amount",
  placeTitle: "Set your automatic maximum",
  raiseTitle: "Raise your automatic maximum",
  placeAction: "Set Maximum",
  raiseAction: "Raise Maximum",
  cancel: "Cancel",
  confirmation: (amount: string) =>
    `Your card hold covers ${amount}. You may pay less if the auction ends below your maximum.`,
};

type AutomaticMaximumFormProps = {
  currentBid: string;
  currentMaximum?: string;
  onCancel: () => void;
  onSubmit: (maximum: string) => void;
  raising: boolean;
};

function AutomaticMaximumForm({
  currentBid,
  currentMaximum,
  onCancel,
  onSubmit,
  raising,
}: AutomaticMaximumFormProps) {
  const [maximum, setMaximum] = useState("");
  const title = raising ? copy.raiseTitle : copy.placeTitle;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!maximum) return;
    onSubmit(formatAmount(maximum));
  }

  return (
    <form data-slot="automatic-maximum-form" onSubmit={submit}>
      <VStack className="w-full" gap="md">
        <VStack gap="xs">
          <Text as="h3" size="lg" weight="bold">
            {title}
          </Text>
          <Text size="sm" tone="secondary">
            Current bid: {currentBid}
          </Text>
          {currentMaximum ? (
            <Text size="sm" tone="secondary">
              Your maximum: {currentMaximum}
            </Text>
          ) : null}
        </VStack>
        <NumberInput
          label={copy.maximumLabel}
          min={1}
          onChange={(event) => setMaximum(event.target.value)}
          required
          value={maximum}
        />
        <Text size="sm" tone="secondary">
          {copy.automaticExplanation}
        </Text>
        <Text size="sm" tone="secondary">
          {copy.holdExplanation}
        </Text>
        <HStack gap="sm">
          <Button disabled={!maximum} type="submit">
            {raising ? copy.raiseAction : copy.placeAction}
          </Button>
          <Button onClick={onCancel} type="button" variant="ghost">
            {copy.cancel}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}

function AcceptedNotLeadingStanding() {
  return (
    <HStack className="w-full" gap="sm" hAlign="space-between" vAlign="center">
      <Text size="sm">Accepted — not leading</Text>
      <Badge variant="default">Accepted</Badge>
    </HStack>
  );
}

function formatAmount(value: string) {
  const amount = Number(value);
  return `HK$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function AutomaticBiddingListingDemo({
  mode,
}: {
  mode: AutomaticBiddingListingDemoMode;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<string>();
  const isFirstMaximum = mode === "first";
  const currentBid =
    mode === "first"
      ? "HK$1,200.00"
      : mode === "overtaken"
        ? "HK$8,250.00"
        : "HK$4,800.00";
  const currentMaximum = isFirstMaximum ? undefined : "HK$8,000.00";
  const [committedMaximum, setCommittedMaximum] = useState(currentMaximum);
  const hasCommittedMaximum = committedMaximum != null;
  const standing =
    mode === "overtaken" ? (
      <HStack
        className="w-full"
        gap="sm"
        hAlign="space-between"
        vAlign="center"
      >
        <Text size="sm">Your maximum is unchanged</Text>
        <Badge variant="warning">Outbid</Badge>
      </HStack>
    ) : mode === "accepted-not-leading" ? (
      <AcceptedNotLeadingStanding />
    ) : mode === "leading" ? (
      <HStack
        className="w-full"
        gap="sm"
        hAlign="space-between"
        vAlign="center"
      >
        <Text size="sm">Your maximum is working for you</Text>
        <Badge variant="success">Leading</Badge>
      </HStack>
    ) : undefined;

  const actions = confirmation ? (
    <VStack className="w-full" gap="sm">
      <Text size="sm" tone="success">
        {confirmation}
      </Text>
      <Button
        onClick={() => {
          setConfirmation(undefined);
          setFormOpen(true);
        }}
        type="button"
        variant="secondary"
      >
        {copy.raiseAction}
      </Button>
    </VStack>
  ) : formOpen ? (
    <AutomaticMaximumForm
      currentBid={currentBid}
      currentMaximum={committedMaximum}
      onCancel={() => setFormOpen(false)}
      onSubmit={(maximum) => {
        setCommittedMaximum(maximum);
        setConfirmation(copy.confirmation(maximum));
        setFormOpen(false);
      }}
      raising={hasCommittedMaximum}
    />
  ) : (
    <Button className="w-full" onClick={() => setFormOpen(true)}>
      {!hasCommittedMaximum ? "Place Bid" : copy.raiseAction}
    </Button>
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <ListingBidPanel
        bidActions={actions}
        copy={{
          ends: "Ends",
          maximum: "Your maximum",
          price: "Current bid",
        }}
        kicker="Listing 12 · September Slabs"
        maximum={committedMaximum}
        price={currentBid}
        priceHint="The current bid is separate from your private maximum."
        remaining="13D 11H 33M 47S"
        standing={standing}
        title="1999 Charizard, PSA 10"
      />
    </div>
  );
}

export type { AutomaticBiddingListingDemoMode };
export { AutomaticBiddingListingDemo };
