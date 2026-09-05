import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import type { LocaleProps } from "./booking-copy";
import { BookingStateBadge } from "./booking-state-badge";
import { formatBookingWhen } from "./booking-when";
import type { BookingRecord, BookingRecordState } from "./types";

type BookingListCopy = {
  upcomingHeading: string;
  pastHeading: string;
  emptyTitle: string;
  emptyDescription?: string;
  open: string;
  state: Record<BookingRecordState, string>;
};

type BookingListProps = LocaleProps & {
  copy: BookingListCopy;
  records: AsyncState<readonly BookingRecord[]>;
  /** The instant that separates upcoming from past. */
  now: number;
  /** Zone labels by IANA name, where the consumer has them. */
  timeZoneLabels?: Readonly<Record<string, string>>;
  onOpen: (bookingId: string) => void;
  className?: string;
};

/** Upcoming visits soonest first, then past or closed ones latest first. */
function BookingList({
  copy,
  records,
  now,
  timeZoneLabels,
  locale,
  onOpen,
  className,
}: BookingListProps) {
  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="booking-list"
      gap="lg"
      hAlign="stretch"
    >
      <AsyncRegion slot="booking-list" state={records}>
        {(list) => {
          if (list.length === 0) {
            return (
              <EmptyState
                data-slot="booking-list-empty"
                description={copy.emptyDescription}
                title={copy.emptyTitle}
              />
            );
          }
          const { upcoming, past } = split(list, now);
          return (
            <>
              {upcoming.length > 0 ? (
                <Section
                  copy={copy}
                  heading={copy.upcomingHeading}
                  locale={locale}
                  onOpen={onOpen}
                  records={upcoming}
                  slot="booking-list-upcoming"
                  timeZoneLabels={timeZoneLabels}
                />
              ) : null}
              {past.length > 0 ? (
                <Section
                  copy={copy}
                  heading={copy.pastHeading}
                  locale={locale}
                  onOpen={onOpen}
                  records={past}
                  slot="booking-list-past"
                  timeZoneLabels={timeZoneLabels}
                />
              ) : null}
            </>
          );
        }}
      </AsyncRegion>
    </VStack>
  );
}

function split(list: readonly BookingRecord[], now: number) {
  const upcoming = list
    .filter((record) => record.state === "booked" && record.end > now)
    .sort((a, b) => a.start - b.start);
  const past = list
    .filter((record) => !(record.state === "booked" && record.end > now))
    .sort((a, b) => b.start - a.start);
  return { upcoming, past };
}

function Section({
  heading,
  records,
  copy,
  locale,
  timeZoneLabels,
  slot,
  onOpen,
}: LocaleProps & {
  heading: string;
  records: readonly BookingRecord[];
  copy: BookingListCopy;
  timeZoneLabels?: Readonly<Record<string, string>>;
  slot: string;
  onOpen: (bookingId: string) => void;
}) {
  return (
    <VStack data-slot={slot} gap="sm" hAlign="stretch">
      <Text as="h2" size="lg" weight="medium">
        {heading}
      </Text>
      {records.map((record) => (
        <HStack
          className="w-full rounded-2xl border border-border bg-card p-4"
          data-slot="booking-list-item"
          hAlign="space-between"
          key={record.id}
          vAlign="center"
        >
          <VStack gap="xs" hAlign="start">
            <HStack gap="sm" vAlign="center">
              <Text as="span" weight="medium">
                {record.service}
              </Text>
              <BookingStateBadge
                label={copy.state[record.state]}
                state={record.state}
              />
            </HStack>
            <Text as="span" size="sm" tone="secondary">
              {record.location}
            </Text>
            <Text as="span" size="sm">
              {formatBookingWhen({
                start: record.start,
                end: record.end,
                timeZone: record.timeZone,
                timeZoneLabel: timeZoneLabels?.[record.timeZone],
                locale,
              })}
            </Text>
          </VStack>
          <Button
            onClick={() => onOpen(record.id)}
            size="sm"
            type="button"
            variant="outline"
          >
            {copy.open}
          </Button>
        </HStack>
      ))}
    </VStack>
  );
}

export type { BookingListCopy, BookingListProps };
export { BookingList };
