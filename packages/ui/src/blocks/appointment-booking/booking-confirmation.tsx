import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { LocaleProps } from "./booking-copy";
import { formatBookingWhen } from "./booking-when";
import type { BookingRecord } from "./types";

type BookingConfirmationCopy = {
  title: string;
  body: string;
  service: string;
  location: string;
  when: string;
  manage: string;
  calendar: string;
};

type BookingConfirmationProps = LocaleProps & {
  copy: BookingConfirmationCopy;
  record: BookingRecord;
  /** The private link that manages the visit. */
  manageHref: string;
  /** The calendar file, when the consumer serves one. */
  calendarHref?: string;
  timeZoneLabel?: string;
  className?: string;
};

/** What was booked, where, when, and the link that manages it. */
function BookingConfirmation({
  copy,
  record,
  manageHref,
  calendarHref,
  timeZoneLabel,
  locale,
  className,
}: BookingConfirmationProps) {
  return (
    <Card className={className} data-slot="booking-confirmation">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.body}</CardDescription>
      </CardHeader>
      <CardContent>
        <VStack gap="md" hAlign="stretch">
          <Fact label={copy.service} value={record.service} />
          <Fact
            label={copy.location}
            value={
              <>
                {record.location}
                <Text as="span" size="sm" tone="secondary">
                  {record.address}
                </Text>
              </>
            }
          />
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
          <HStack gap="md" vAlign="center">
            <Link data-slot="booking-manage-link" href={manageHref}>
              {copy.manage}
            </Link>
            {calendarHref ? (
              <Link data-slot="booking-calendar-link" href={calendarHref}>
                {copy.calendar}
              </Link>
            ) : null}
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
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
