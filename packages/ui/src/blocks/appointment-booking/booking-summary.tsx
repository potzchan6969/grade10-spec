import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { MapPin } from "@phosphor-icons/react";
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
    <VStack
      className={cn("rounded-2xl border border-border px-4 py-4", className)}
      data-slot="booking-summary"
      gap="sm"
      hAlign="stretch"
    >
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      {service ? <Row label={copy.service} value={service} /> : null}
      {location ? (
        <VStack data-slot="booking-summary-row" gap="none" hAlign="stretch">
          <Text as="span" size="xs" tone="secondary">
            {copy.location}
          </Text>
          <HStack gap="xs" vAlign="start">
            <span className="mt-0.5 shrink-0 text-primary">
              <MapPin aria-hidden size={16} />
            </span>
            <VStack gap="none" hAlign="start">
              <Text as="span" weight="medium">
                {location}
              </Text>
              {address ? (
                <Text as="span" size="sm" tone="secondary">
                  {address}
                </Text>
              ) : null}
            </VStack>
          </HStack>
        </VStack>
      ) : null}
      {when ? <Row label={copy.when} value={when} /> : null}
    </VStack>
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
