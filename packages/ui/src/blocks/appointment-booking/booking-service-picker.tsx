import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { cn } from "@grade10/design-system/lib/utils";
import { CreditCard } from "@phosphor-icons/react";
import { type ReactNode, useId } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import { ClockLine } from "./booking-clock-line";
import { INK_2, SMALL_LINES, STEP_HEADING } from "./booking-look";
import type { BookingService } from "./types";

type BookingServicePickerCopy = { title: string };

type BookingServicePickerProps = {
  copy: BookingServicePickerCopy;
  services: AsyncState<readonly BookingService[]>;
  selectedId?: string;
  onSelect: (serviceId: string) => void;
  /**
   * `step` heads the step (`What do you need?`); `group` heads one group of
   * services under it (`Grading`), quieter and one level down.
   */
  heading?: "step" | "group";
  /** A line under the cards, e.g. where to go with more than 100 cards. */
  footer?: ReactNode;
  className?: string;
};

/** Every customer-bookable service, one card each, reported by id. */
function BookingServicePicker({
  copy,
  services,
  selectedId,
  onSelect,
  heading = "step",
  footer,
  className,
}: BookingServicePickerProps) {
  const headingId = useId();
  const Heading = heading === "group" ? "h3" : "h2";
  return (
    <div
      className={cn(
        "flex flex-col",
        heading === "group" ? "gap-2.5" : "gap-4",
        className,
      )}
      data-slot="booking-service-picker"
    >
      <Heading
        className={
          heading === "group"
            ? cn("m-0 text-sm leading-5 font-semibold", INK_2)
            : STEP_HEADING
        }
        id={headingId}
      >
        {copy.title}
      </Heading>
      <AsyncRegion slot="booking-services" state={services}>
        {(list) => (
          <RadioList
            aria-labelledby={headingId}
            className="[&_[data-slot=radio-list-items]]:grid [&_[data-slot=radio-list-items]]:grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] [&_[data-slot=radio-list-items]]:items-stretch [&_[data-slot=radio-list-items]]:gap-3"
            onValueChange={(value) => {
              if (value) onSelect(String(value));
            }}
            value={selectedId ?? ""}
          >
            {list.map((service) => (
              <RadioCard
                description={
                  service.durationLabel ? (
                    <ClockLine>{service.durationLabel}</ClockLine>
                  ) : undefined
                }
                key={service.id}
                onClick={() => {
                  if (service.id === selectedId) onSelect(service.id);
                }}
                title={service.name}
                value={service.id}
              >
                <ServiceLines service={service} />
              </RadioCard>
            ))}
          </RadioList>
        )}
      </AsyncRegion>
      {footer ? (
        <p className={cn("m-0 text-sm leading-5", INK_2)}>{footer}</p>
      ) : null}
    </div>
  );
}

function ServiceLines({ service }: { service: BookingService }) {
  const notes = service.notes ?? [];
  const fit = service.fit ?? (notes.length === 0 ? service.description : null);
  return (
    <>
      {fit ? <span className="text-sm leading-5">{fit}</span> : null}
      {service.charge ? (
        <span
          className="inline-flex h-6.5 items-center gap-1.5 self-start rounded-full bg-primary-muted px-2.5 text-[13px] font-bold text-(--orange-700) tabular-nums"
          data-slot="booking-service-charge"
        >
          <CreditCard aria-hidden size={14} />
          {service.charge}
        </span>
      ) : null}
      {notes.length > 0 ? (
        <span
          className={cn(
            "mt-1 self-stretch border-t border-border pt-2.5",
            SMALL_LINES,
          )}
        >
          {notes.map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional and never reorder
            <span key={index}>{line}</span>
          ))}
        </span>
      ) : null}
    </>
  );
}

export type { BookingServicePickerCopy, BookingServicePickerProps };
export { BookingServicePicker };
