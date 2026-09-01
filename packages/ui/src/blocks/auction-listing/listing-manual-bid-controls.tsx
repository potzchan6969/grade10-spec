import type { InputStatus } from "@grade10/design-system/components/forms/input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { formatUsd, formatUsdNumeric } from "./format-usd";

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
  copy: Pick<ListingManualBidControlsCopy, "maximumLabel">;
  minMaximumMinor: number;
  value: string;
  onValueChange: (value: string) => void;
  onBlur: () => void;
  status?: InputStatus;
  message?: string;
  hideLabel?: boolean;
};

function ListingAutoBidControls({
  copy,
  minMaximumMinor,
  value,
  onValueChange,
  onBlur,
  status = "default",
  message,
  hideLabel = false,
}: ListingAutoBidControlsProps) {
  return (
    <TextInput
      aria-label={copy.maximumLabel}
      className="min-w-0 flex-1"
      inputMode="decimal"
      label={hideLabel ? undefined : copy.maximumLabel}
      message={message}
      min={minMaximumMinor / 100}
      onBlur={onBlur}
      onChange={(event) => onValueChange(event.target.value)}
      prefix="US$"
      status={status}
      value={value}
    />
  );
}

export type {
  ListingAutoBidControlsProps,
  ListingManualBidControlsCopy,
  ListingManualBidControlsProps,
};
export { ListingAutoBidControls, ListingManualBidControls };
