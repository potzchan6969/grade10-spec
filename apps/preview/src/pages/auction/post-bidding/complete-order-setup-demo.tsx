import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useState } from "react";
import { fn } from "storybook/test";
import {
  WINNER_ORDER_SAVED_ADDRESSES,
  type WinnerOrderSavedAddress,
  type WinnerOrderSettlementCurrency,
  WinnerOrderSetupDialog,
  type WinnerOrderSetupResult,
} from "./winner-order-setup-dialog";

type CompleteOrderSetupDemoProps = {
  savedAddresses?: readonly WinnerOrderSavedAddress[];
  initialNewAddressOpen?: boolean;
  initialStep?: 1 | 2 | 3;
  settlementCurrencies?: WinnerOrderSettlementCurrency[];
  cardFeePercentages?: Partial<Record<WinnerOrderSettlementCurrency, number>>;
  onConfirm?: (result: WinnerOrderSetupResult) => void;
};

function CompleteOrderSetupDemo({
  savedAddresses = WINNER_ORDER_SAVED_ADDRESSES,
  initialNewAddressOpen = false,
  initialStep = 1,
  settlementCurrencies,
  cardFeePercentages,
  onConfirm = fn(),
}: CompleteOrderSetupDemoProps) {
  const [open, setOpen] = useState(true);
  const [confirmed, setConfirmed] = useState<WinnerOrderSetupResult | null>(
    null,
  );

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Complete Order Setup
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the stepped setup dialog Winner Order opens from
          Awaiting Setup. Page wiring lives under My Auctions / Winner Order /
          Setup. Delivery → Payment → Billing; the address book caps at five
          saved addresses.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
        {confirmed ? (
          <Text className="whitespace-pre-line" size="sm">
            Confirmed delivery:{"\n"}
            {confirmed.delivery}
            {"\n\n"}Settlement: {confirmed.settlementCurrency}
            {"\n"}Payment: {confirmed.paymentMethod}
            {"\n"}Billing:{"\n"}
            {confirmed.billing}
          </Text>
        ) : null}
      </VStack>

      <WinnerOrderSetupDialog
        initialNewAddressOpen={initialNewAddressOpen}
        initialStep={initialStep}
        onConfirm={(result) => {
          setConfirmed(result);
          onConfirm(result);
        }}
        onOpenChange={setOpen}
        open={open}
        savedAddresses={savedAddresses}
        cardFeePercentages={cardFeePercentages}
        settlementCurrencies={settlementCurrencies}
      />
    </div>
  );
}

export type { CompleteOrderSetupDemoProps };
export { CompleteOrderSetupDemo };
