import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { formatMinMaximumMessage, formatUsd, formatUsdNumeric } from "./format-usd";

type ListingManualBidControlsCopy = {
  bidAmountLabel?: string;
  maximumLabel: string;
  minimumMaximum?: string;
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
      defaultValue={formatUsdNumeric(minBidMinor)}
      label={hideLabel ? undefined : (copy.bidAmountLabel ?? "Place a bid")}
      message={message}
      prefix="US$"
    />
  );
}

type ListingAutoBidControlsProps = {
  copy: Pick<ListingManualBidControlsCopy, "maximumLabel" | "minimumMaximum">;
  minMaximumMinor: number;
  incrementMinor: number;
  viewerMaximumMinor?: number;
  defaultMaximumMinor: number;
  hideLabel?: boolean;
};

function ListingAutoBidControls({
  copy,
  minMaximumMinor,
  incrementMinor,
  viewerMaximumMinor,
  defaultMaximumMinor,
  hideLabel = false,
}: ListingAutoBidControlsProps) {
  const message = hideLabel
    ? formatMinMaximumMessage(
        minMaximumMinor,
        incrementMinor,
        viewerMaximumMinor,
      )
    : copy.minimumMaximum != null
      ? copy.minimumMaximum.replace("{amount}", formatUsd(minMaximumMinor))
      : formatMinMaximumMessage(
          minMaximumMinor,
          incrementMinor,
          viewerMaximumMinor,
        );

  return (
    <TextInput
      aria-label={copy.maximumLabel}
      className="min-w-0 flex-1"
      defaultValue={formatUsdNumeric(defaultMaximumMinor)}
      inputMode="decimal"
      label={hideLabel ? undefined : copy.maximumLabel}
      message={message}
      min={minMaximumMinor / 100}
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
