import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import {
  formatHkd,
  formatUsd,
  PAYOUT_METHOD,
  type VaultPayoutRequest,
  WITHDRAWAL_PROCESSING_DAYS,
} from "../vault-content";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Text tone="secondary">{label}</Text>
      {children}
    </div>
  );
}

/**
 * The right-side drawer a withdrawal row's chevron opens — the request's
 * status, date, amount and destination, with the HKD conversion when the
 * request pays out in HKD.
 */
function WithdrawalDetails({
  request,
  open,
  onOpenChange,
}: {
  request: VaultPayoutRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Withdrawal</DrawerTitle>
          <DrawerDescription>
            To {PAYOUT_METHOD.bankName} {PAYOUT_METHOD.maskedAccount}
          </DrawerDescription>
        </DrawerHeader>
        {request ? (
          <DrawerBody>
            <DetailRow label="Status">
              <Badge size="sm">{request.status}</Badge>
            </DetailRow>
            <DetailRow label="Requested">
              <Text weight="medium">{request.requestedAt}</Text>
            </DetailRow>
            <DetailRow label="Amount">
              <Text className="tabular-nums" weight="medium">
                {formatUsd(request.amountUsd)}
              </Text>
            </DetailRow>
            {request.currency === "HKD" && request.convertedHkd != null ? (
              <DetailRow label="Converts to">
                <Text className="tabular-nums" weight="medium">
                  {formatHkd(request.convertedHkd)}
                </Text>
              </DetailRow>
            ) : null}
            <DetailRow label="Processing time">
              <Text weight="medium">{WITHDRAWAL_PROCESSING_DAYS}</Text>
            </DetailRow>
            <DetailRow label="Destination">
              <Text weight="medium">
                {PAYOUT_METHOD.bankName} {PAYOUT_METHOD.maskedAccount}
              </Text>
            </DetailRow>
          </DrawerBody>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export { WithdrawalDetails };
