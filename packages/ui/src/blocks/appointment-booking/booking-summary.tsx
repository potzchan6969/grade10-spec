import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";
import type { LocaleProps } from "./booking-copy";
import { formatBookingWhen } from "./booking-when";

type BookingSummaryCopy = {
  title: string;
  service: string;
  location: string;
  when: string;
};

type BookingSummaryProps = LocaleProps & {
  copy: BookingSummaryCopy;
  service?: ReactNode;
  location?: ReactNode;
  address?: ReactNode;
  start?: number;
  end?: number;
  timeZone?: string;
  timeZoneLabel?: string;
  className?: string;
};

/** The choice so far. A row renders once its value is known. */
function BookingSummary({
  copy,
  service,
  location,
  address,
  start,
  end,
  timeZone,
  timeZoneLabel,
  locale,
  className,
}: BookingSummaryProps) {
  const when =
    start !== undefined && end !== undefined && timeZone !== undefined
      ? formatBookingWhen({ start, end, timeZone, timeZoneLabel, locale })
      : undefined;
  return (
    <Card className={className} data-slot="booking-summary">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack gap="sm" hAlign="stretch">
          {service ? <Row label={copy.service} value={service} /> : null}
          {location ? (
            <Row
              label={copy.location}
              value={
                <>
                  {location}
                  {address ? (
                    <Text as="span" size="sm" tone="secondary">
                      {address}
                    </Text>
                  ) : null}
                </>
              }
            />
          ) : null}
          {when ? <Row label={copy.when} value={when} /> : null}
        </VStack>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <VStack data-slot="booking-summary-row" gap="none" hAlign="stretch">
      <Text as="span" size="xs" tone="secondary">
        {label}
      </Text>
      <Text as="span" weight="medium">
        {value}
      </Text>
    </VStack>
  );
}

export type { BookingSummaryCopy, BookingSummaryProps };
export { BookingSummary };
