import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { type ReactNode, useState } from "react";
import type { LocaleProps } from "./booking-copy";
import { BookingStateBadge } from "./booking-state-badge";
import { formatBookingWhen } from "./booking-when";
import type { BookingRecord, BookingRecordState } from "./types";

type BookingManageCardCopy = {
  service: string;
  location: string;
  when: string;
  state: Record<BookingRecordState, string>;
  move: string;
  cancel: string;
  cancelTitle: string;
  cancelBody: string;
  cancelConfirm: string;
  cancelKeep: string;
};

type BookingManageCardProps = LocaleProps & {
  copy: BookingManageCardCopy;
  record: BookingRecord;
  timeZoneLabel?: string;
  pending?: boolean;
  error?: ReactNode;
  onMove: () => void;
  onCancel: () => void;
  className?: string;
};

/**
 * One booking. While it is live the card offers a move and a cancel, and
 * reports the cancel only after the collector confirms it; a closed booking
 * shows its state and offers nothing.
 */
function BookingManageCard({
  copy,
  record,
  timeZoneLabel,
  locale,
  pending = false,
  error,
  onMove,
  onCancel,
  className,
}: BookingManageCardProps) {
  const [confirming, setConfirming] = useState(false);
  const live = record.state === "booked";

  function confirmCancel() {
    setConfirming(false);
    onCancel();
  }

  return (
    <Card className={className} data-slot="booking-manage-card">
      <CardHeader>
        <CardTitle>{record.service}</CardTitle>
        <BookingStateBadge
          label={copy.state[record.state]}
          state={record.state}
        />
      </CardHeader>
      <CardContent>
        <VStack gap="md" hAlign="stretch">
          <VStack gap="none" hAlign="stretch">
            <Text as="span" size="xs" tone="secondary">
              {copy.location}
            </Text>
            <Text as="span" weight="medium">
              {record.location}
            </Text>
            <Text as="span" size="sm" tone="secondary">
              {record.address}
            </Text>
          </VStack>
          <VStack gap="none" hAlign="stretch">
            <Text as="span" size="xs" tone="secondary">
              {copy.when}
            </Text>
            <Text as="span" weight="medium">
              {formatBookingWhen({
                start: record.start,
                end: record.end,
                timeZone: record.timeZone,
                timeZoneLabel,
                locale,
              })}
            </Text>
          </VStack>
          {error ? (
            <Text
              as="p"
              data-slot="booking-manage-error"
              size="sm"
              tone="error"
            >
              {error}
            </Text>
          ) : null}
          {live ? (
            <HStack gap="sm">
              <Button
                disabled={pending}
                onClick={onMove}
                size="md"
                type="button"
                variant="secondary"
              >
                {copy.move}
              </Button>
              <Button
                disabled={pending}
                onClick={() => setConfirming(true)}
                size="md"
                type="button"
                variant="outline"
              >
                {copy.cancel}
              </Button>
            </HStack>
          ) : null}
        </VStack>
      </CardContent>
      <Dialog onOpenChange={setConfirming} open={confirming}>
        <DialogContent showCloseButton={false}>
          <DialogHeader showCloseButton={false}>
            <DialogTitle>{copy.cancelTitle}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>{copy.cancelBody}</DialogDescription>
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={() => setConfirming(false)}
              size="md"
              type="button"
              variant="outline"
            >
              {copy.cancelKeep}
            </Button>
            <Button
              loading={pending}
              onClick={confirmCancel}
              size="md"
              type="button"
              variant="destructive"
            >
              {copy.cancelConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export type { BookingManageCardCopy, BookingManageCardProps };
export { BookingManageCard };
