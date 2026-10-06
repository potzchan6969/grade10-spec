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
import { cn } from "@grade10/design-system/lib/utils";
import { MapPin } from "@phosphor-icons/react";
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
    <div
      className={cn("rounded-2xl border border-border px-5 py-5", className)}
      data-slot="booking-manage-card"
    >
      <div
        className={
          live
            ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-start lg:gap-10"
            : undefined
        }
      >
        <VStack gap="md" hAlign="stretch">
          <HStack gap="sm" vAlign="center">
            <Text as="h2" size="lg" weight="medium">
              {record.service}
            </Text>
            <BookingStateBadge
              label={copy.state[record.state]}
              state={record.state}
            />
          </HStack>
          <VStack gap="none" hAlign="stretch">
            <Text as="span" size="xs" tone="secondary">
              {copy.location}
            </Text>
            <HStack gap="xs" vAlign="start">
              <span className="mt-0.5 shrink-0 text-primary">
                <MapPin aria-hidden size={16} />
              </span>
              <VStack gap="none" hAlign="start">
                <Text as="span" weight="medium">
                  {record.location}
                </Text>
                <Text as="span" size="sm" tone="secondary">
                  {record.address}
                </Text>
              </VStack>
            </HStack>
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
        </VStack>
        {live ? (
          <VStack className="lg:pt-1" gap="sm" hAlign="stretch">
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
              variant="ghost"
            >
              {copy.cancel}
            </Button>
          </VStack>
        ) : null}
      </div>
      {confirming ? (
        <Dialog onOpenChange={setConfirming} open>
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
      ) : null}
    </div>
  );
}

export type { BookingManageCardCopy, BookingManageCardProps };
export { BookingManageCard };
