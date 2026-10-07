import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
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
import { cn } from "@grade10/design-system/lib/utils";
import { CalendarBlank, MapPin } from "@phosphor-icons/react";
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
    <Card
      className={cn("gap-3", className)}
      data-slot="booking-manage-card"
    >
      <CardHeader className="items-center">
        <CardTitle className="text-base leading-snug">
          {record.service}
        </CardTitle>
        <CardAction>
          <BookingStateBadge
            label={copy.state[record.state]}
            state={record.state}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <VStack gap="xs" hAlign="stretch">
          <HStack className="min-w-0" gap="sm" vAlign="start">
            <span
              aria-hidden
              className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-secondary-foreground"
            >
              <CalendarBlank size={16} weight="regular" />
            </span>
            <Text as="span" size="sm" weight="medium">
              {formatBookingWhen({
                start: record.start,
                end: record.end,
                timeZone: record.timeZone,
                timeZoneLabel,
                locale,
              })}
            </Text>
          </HStack>
          <HStack className="min-w-0" gap="sm" vAlign="start">
            <span
              aria-hidden
              className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-secondary-foreground"
            >
              <MapPin size={16} weight="regular" />
            </span>
            <VStack className="min-w-0" gap="none" hAlign="start">
              <Text
                as="span"
                className="text-secondary-foreground"
                size="sm"
                weight="medium"
              >
                {record.location}
              </Text>
              <Text
                as="span"
                className="text-pretty text-secondary-foreground"
                size="xs"
              >
                {record.address}
              </Text>
            </VStack>
          </HStack>
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
      </CardContent>
      {live ? (
        <CardFooter className="flex-col items-stretch justify-start gap-2 border-border bg-transparent sm:flex-row sm:items-center">
          <Button
            className="w-full sm:w-auto"
            disabled={pending}
            onClick={onMove}
            size="md"
            type="button"
            variant="outline"
          >
            {copy.move}
          </Button>
          <Button
            className="w-full sm:w-auto"
            disabled={pending}
            onClick={() => setConfirming(true)}
            size="md"
            type="button"
            variant="ghost"
          >
            {copy.cancel}
          </Button>
        </CardFooter>
      ) : null}
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
    </Card>
  );
}

export type { BookingManageCardCopy, BookingManageCardProps };
export { BookingManageCard };
