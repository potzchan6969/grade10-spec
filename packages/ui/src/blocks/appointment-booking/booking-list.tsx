import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { formatLocalDay } from "../../lib/format-datetime";
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

/** Upcoming visits soonest first, grouped by day, then past latest first. */
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
                  groupByDay
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
  groupByDay = false,
}: LocaleProps & {
  heading: string;
  records: readonly BookingRecord[];
  copy: BookingListCopy;
  timeZoneLabels?: Readonly<Record<string, string>>;
  slot: string;
  onOpen: (bookingId: string) => void;
  groupByDay?: boolean;
}) {
  const groups: { day?: string; records: readonly BookingRecord[] }[] =
    groupByDay ? groupRecords(records, locale) : [{ records }];
  return (
    <VStack data-slot={slot} gap="sm" hAlign="stretch">
      <Text as="h2" size="lg" weight="medium">
        {heading}
      </Text>
      {groups.map((group) => (
        <VStack gap="sm" hAlign="stretch" key={group.day ?? heading}>
          {group.day ? (
            <Text as="h3" size="sm" weight="medium">
              {group.day}
            </Text>
          ) : null}
          {group.records.map((record) => (
            <div
              className="grid w-full grid-cols-1 gap-2 border-b border-border py-4 last:border-b-0 sm:grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,1fr)_minmax(14rem,1.4fr)_auto] sm:items-center sm:gap-6"
              data-slot="booking-list-item"
              key={record.id}
            >
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
              <Button
                className="justify-self-start sm:justify-self-end"
                onClick={() => onOpen(record.id)}
                size="sm"
                type="button"
                variant="ghost"
              >
                {copy.open}
              </Button>
            </div>
          ))}
        </VStack>
      ))}
    </VStack>
  );
}

function groupRecords(
  records: readonly BookingRecord[],
  locale: LocaleProps["locale"],
) {
  const groups: { day: string; records: BookingRecord[] }[] = [];
  for (const record of records) {
    const day = formatLocalDay(record.start, {
      locale,
      timeZone: record.timeZone,
    });
    const last = groups.at(-1);
    if (last && last.day === day) {
      last.records.push(record);
    } else {
      groups.push({ day, records: [record] });
    }
  }
  return groups;
}

export type { BookingListCopy, BookingListProps };
export { BookingList };
