import { Separator } from "@grade10/design-system/components/display/separator";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Storefront } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { formatLocalDay, formatLocalTime } from "../../lib/format-datetime";
import type { LocaleProps } from "./booking-copy";

type BookingSummaryCopy = {
  title: string;
  service: string;
  location: string;
  when: string;
};

type BookingSummaryProps = LocaleProps & {
  copy: BookingSummaryCopy;
  service?: ReactNode;
  /** Control beside the service — typically a change-service action. */
  serviceAction?: ReactNode;
  location?: ReactNode;
  address?: ReactNode;
  start?: number;
  end?: number;
  /** Control beside the booked time — typically a change-date action. */
  whenAction?: ReactNode;
  timeZone?: string;
  timeZoneLabel?: string;
  className?: string;
};

/** The choice so far. A row renders once its value is known. */
function BookingSummary({
  copy,
  service,
  serviceAction,
  location,
  address,
  start,
  whenAction,
  timeZone,
  locale = "en",
  className,
}: BookingSummaryProps) {
  const when =
    start !== undefined && timeZone !== undefined ? (
      <span className="whitespace-nowrap">
        {`${formatLocalDay(start, { locale, timeZone })}, ${formatLocalTime(start, { locale, timeZone })}`}
      </span>
    ) : undefined;
  return (
    <VStack
      className={cn("rounded-2xl border border-border px-4 py-4", className)}
      data-slot="booking-summary"
      gap="md"
      hAlign="stretch"
    >
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      {service ? (
        <Row action={serviceAction} label={copy.service} value={service} />
      ) : null}
      {service && location ? <Separator /> : null}
      {location ? (
        <Row
          label={copy.location}
          value={
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
              <span className="col-start-1 row-start-1 flex size-4 items-center self-center text-primary">
                <Storefront aria-hidden size={16} />
              </span>
              <span className="col-start-2 row-start-1">{location}</span>
              {address ? (
                <Text
                  as="span"
                  className="col-start-2 row-start-2 font-normal text-secondary-foreground"
                  size="sm"
                >
                  {address}
                </Text>
              ) : null}
            </div>
          }
        />
      ) : null}
      {(service || location) && when ? <Separator /> : null}
      {when ? <Row action={whenAction} label={copy.when} value={when} /> : null}
    </VStack>
  );
}

function Row({
  action,
  label,
  value,
}: {
  action?: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <VStack data-slot="booking-summary-row" gap="xs" hAlign="stretch">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-2">
        <Text as="span" size="xs" tone="secondary">
          {label}
        </Text>
        {action}
      </div>
      <div className="min-w-0 font-medium">{value}</div>
    </VStack>
  );
}

export type { BookingSummaryCopy, BookingSummaryProps };
export { BookingSummary };
