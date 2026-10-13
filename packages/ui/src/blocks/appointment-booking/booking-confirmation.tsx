import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { MapPin } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { LocaleProps } from "./booking-copy";
import { formatBookingWhen } from "./booking-when";
import type { BookingAnswerLine, BookingRecord } from "./types";

type BookingConfirmationCopy = {
  title: string;
  body: string;
  service: string;
  location: string;
  when: string;
  beforeYouCome: string;
  answers: string;
  manage: string;
  calendar: string;
};

type BookingConfirmationProps = LocaleProps & {
  copy: BookingConfirmationCopy;
  record: BookingRecord;
  /** The service's description: what to know before coming. */
  description?: ReactNode;
  /** What the collector told the desk, under the labels it was asked by. */
  answers?: readonly BookingAnswerLine[];
  /** The private link that manages the visit. */
  manageHref: string;
  /** The calendar file, when the consumer serves one. */
  calendarHref?: string;
  timeZoneLabel?: string;
  className?: string;
};

/** What was booked, where, when, what to know before coming, what the
 * collector told us, and the link that manages it. */
function BookingConfirmation({
  copy,
  record,
  description,
  answers = [],
  manageHref,
  calendarHref,
  timeZoneLabel,
  locale,
  className,
}: BookingConfirmationProps) {
  return (
    <VStack
      className={cn("rounded-2xl border border-border px-4 py-5", className)}
      data-slot="booking-confirmation"
      gap="md"
      hAlign="stretch"
    >
      <VStack gap="xs" hAlign="stretch">
        <Text as="h2" size="lg" weight="medium">
          {copy.title}
        </Text>
        <Text as="p" size="sm" tone="secondary">
          {copy.body}
        </Text>
      </VStack>
      <Fact label={copy.service} value={record.service} />
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
      <Fact
        label={copy.when}
        value={formatBookingWhen({
          start: record.start,
          end: record.end,
          timeZone: record.timeZone,
          timeZoneLabel,
          locale,
        })}
      />
      {description ? (
        <Fact label={copy.beforeYouCome} value={description} />
      ) : null}
      {answers.length > 0 ? (
        <VStack data-slot="booking-answers" gap="xs" hAlign="stretch">
          <Text as="span" size="xs" tone="secondary">
            {copy.answers}
          </Text>
          {answers.map((line) => (
            <Fact
              key={line.key}
              label={line.label}
              value={
                typeof line.answer === "string"
                  ? line.answer
                  : line.answer.join(", ")
              }
            />
          ))}
        </VStack>
      ) : null}
      <VStack gap="sm" hAlign="stretch">
        {calendarHref ? (
          <Link data-slot="booking-calendar-link" href={calendarHref}>
            {copy.calendar}
          </Link>
        ) : null}
        <Link data-slot="booking-manage-link" href={manageHref}>
          {copy.manage}
        </Link>
      </VStack>
    </VStack>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <VStack gap="none" hAlign="stretch">
      <Text as="span" size="xs" tone="secondary">
        {label}
      </Text>
      <Text as="span" weight="medium">
        {value}
      </Text>
    </VStack>
  );
}

export type { BookingConfirmationCopy, BookingConfirmationProps };
export { BookingConfirmation };
