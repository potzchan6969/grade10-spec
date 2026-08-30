import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { formatUsd } from "../format-usd";
import { LOT, stateMeta } from "../fixtures";
import type { BiddingState } from "../types";

type ManualBidControlsProps = {
  state: BiddingState;
  hideLabel?: boolean;
};

function ManualBidControls({ state, hideLabel = false }: ManualBidControlsProps) {
  const meta = stateMeta(state);
  const min = meta.hasBids
    ? meta.currentBidMinor + LOT.incrementMinor
    : LOT.startingBidMinor;
  const message = hideLabel
    ? `Min. bid: ${formatUsd(min)} (current + ${formatUsd(LOT.incrementMinor)})`
    : undefined;

  return (
    <TextInput
      aria-label="Bid amount"
      className="min-w-0 flex-1"
      defaultValue={formatUsd(min).replace("US$", "")}
      label={hideLabel ? undefined : "Place a bid"}
      message={message}
      prefix="US$"
    />
  );
}

type AutoBidControlsProps = {
  state: BiddingState;
};

function AutoBidControls({ state }: AutoBidControlsProps) {
  const meta = stateMeta(state);
  const suggested =
    state === "live-auto-overtaken"
      ? meta.currentBidMinor + LOT.incrementMinor
      : (LOT.viewerMaximumMinor ?? 800_000);

  return (
    <TextInput
      aria-label="Maximum bid"
      defaultValue={formatUsd(suggested).replace("US$", "")}
      label="Your maximum"
      prefix="US$"
    />
  );
}

export { AutoBidControls, ManualBidControls };
