import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { cn } from "@grade10/design-system/lib/utils";
import { type ReactNode, useId } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import { INK_2, STEP_HEADING } from "./booking-look";
import { BookingOption } from "./booking-option";
import type { BookingLocation } from "./types";

type BookingLocationPickerCopy = { title: string };

type BookingLocationPickerProps = {
  copy: BookingLocationPickerCopy;
  locations: AsyncState<readonly BookingLocation[]>;
  selectedId?: string;
  onSelect: (locationId: string) => void;
  /** The line under the title: `3 shops run Grading drop-off.` */
  description?: ReactNode;
  className?: string;
};

/** The shops offering the picked service: today's hours, the earliest free
 * time and the address on each. One shop is still a card. */
function BookingLocationPicker({
  copy,
  locations,
  selectedId,
  onSelect,
  description,
  className,
}: BookingLocationPickerProps) {
  const headingId = useId();
  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      data-slot="booking-location-picker"
    >
      <div className="flex flex-col gap-1">
        <h2 className={STEP_HEADING} id={headingId}>
          {copy.title}
        </h2>
        {description ? (
          <p className={cn("m-0 text-sm leading-5", INK_2)}>{description}</p>
        ) : null}
      </div>
      <AsyncRegion slot="booking-locations" state={locations}>
        {(list) => (
          <RadioList
            aria-labelledby={headingId}
            className="[&_[data-slot=radio-list-items]]:grid [&_[data-slot=radio-list-items]]:grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] [&_[data-slot=radio-list-items]]:items-stretch [&_[data-slot=radio-list-items]]:gap-3"
            onValueChange={(value) => {
              if (value) onSelect(String(value));
            }}
            value={selectedId ?? ""}
          >
            {list.map((location) => (
              <BookingOption
                clock={location.hours}
                key={location.id}
                onRepick={() => onSelect(location.id)}
                picked={location.id === selectedId}
                title={location.name}
                value={location.id}
              >
                {location.earliest ? (
                  <span className="text-sm leading-5 font-semibold tabular-nums">
                    {location.earliest}
                  </span>
                ) : null}
                {location.address ? (
                  <span className="text-[13px] leading-[18px] text-secondary-foreground">
                    {location.address}
                  </span>
                ) : null}
              </BookingOption>
            ))}
          </RadioList>
        )}
      </AsyncRegion>
    </div>
  );
}

export type { BookingLocationPickerCopy, BookingLocationPickerProps };
export { BookingLocationPicker };
