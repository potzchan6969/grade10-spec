import type { InputStatus } from "@grade10/design-system/components/forms/input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import {
  currencyExponent,
  formatMoney,
  formatMoneyNumeric,
  formatMoneyPrefix,
} from "../../lib/format-money";

type ListingManualBidControlsCopy = {
  bidAmountLabel?: string;
  maximumLabel: string;
  minimumMaximum?: string;
};

type ListingManualBidControlsProps = {
  copy: ListingManualBidControlsCopy;
  minBidMinor: number;
  incrementMinor: number;
  currency: string;
  locale?: string;
  hideLabel?: boolean;
};

function ListingManualBidControls({
  copy,
  minBidMinor,
  incrementMinor,
  currency,
  locale,
  hideLabel = false,
}: ListingManualBidControlsProps) {
  const message = hideLabel
    ? `Min. bid: ${formatMoney(minBidMinor, currency, { locale })} (current + ${formatMoney(incrementMinor, currency, { locale })})`
    : undefined;

  return (
    <TextInput
      aria-label={copy.bidAmountLabel ?? "Bid amount"}
      className="min-w-0 flex-1"
      defaultValue={formatMoneyNumeric(minBidMinor, currency, locale)}
      label={hideLabel ? undefined : (copy.bidAmountLabel ?? "Place a bid")}
      message={message}
      prefix={formatMoneyPrefix(currency, { locale })}
    />
  );
}

type ListingAutoBidControlsProps = {
  copy: Pick<ListingManualBidControlsCopy, "maximumLabel">;
  minMaximumMinor: number;
  currency: string;
  locale?: string;
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
  currency,
  locale,
  value,
  onValueChange,
  onBlur,
  status = "default",
  message,
  hideLabel = false,
}: ListingAutoBidControlsProps) {
  const exponent = currencyExponent(currency);

  return (
    <TextInput
      aria-label={copy.maximumLabel}
      className="min-w-0 flex-1"
      inputMode="decimal"
      label={hideLabel ? undefined : copy.maximumLabel}
      message={message}
      min={minMaximumMinor / 10 ** exponent}
      onBlur={onBlur}
      onChange={(event) => onValueChange(event.target.value)}
      prefix={formatMoneyPrefix(currency, { locale })}
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
