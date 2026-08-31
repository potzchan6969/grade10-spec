import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { formatUsd } from "./format-usd";

type ListingManualBidControlsCopy = {
  bidAmountLabel?: string;
  maximumLabel: string;
};

type ListingManualBidControlsProps = {
  copy: ListingManualBidControlsCopy;
  minBidMinor: number;
  incrementMinor: number;
  hideLabel?: boolean;
};

function ListingManualBidControls({
  copy,
  minBidMinor,
  incrementMinor,
  hideLabel = false,
}: ListingManualBidControlsProps) {
  const message = hideLabel
    ? `Min. bid: ${formatUsd(minBidMinor)} (current + ${formatUsd(incrementMinor)})`
    : undefined;

  return (
    <TextInput
      aria-label={copy.bidAmountLabel ?? "Bid amount"}
      className="min-w-0 flex-1"
      defaultValue={formatUsd(minBidMinor).replace("US$", "")}
      label={hideLabel ? undefined : (copy.bidAmountLabel ?? "Place a bid")}
      message={message}
      prefix="US$"
    />
  );
}

type ListingAutoBidControlsProps = {
  copy: Pick<ListingManualBidControlsCopy, "maximumLabel">;
  suggestedMaxMinor: number;
};

function ListingAutoBidControls({
  copy,
  suggestedMaxMinor,
}: ListingAutoBidControlsProps) {
  return (
    <TextInput
      aria-label={copy.maximumLabel}
      defaultValue={formatUsd(suggestedMaxMinor).replace("US$", "")}
      label={copy.maximumLabel}
      prefix="US$"
    />
  );
}

export type {
  ListingAutoBidControlsProps,
  ListingManualBidControlsCopy,
  ListingManualBidControlsProps,
};
export { ListingAutoBidControls, ListingManualBidControls };
