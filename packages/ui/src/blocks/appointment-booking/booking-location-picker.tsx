import { Text } from "@grade10/design-system/components/display/text";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import type { BookingLocation } from "./types";

type BookingLocationPickerCopy = { title: string };

type BookingLocationPickerProps = {
  copy: BookingLocationPickerCopy;
  locations: AsyncState<readonly BookingLocation[]>;
  selectedId?: string;
  onSelect: (locationId: string) => void;
  className?: string;
};

/** The shops offering the picked service. One shop is still a radio card. */
function BookingLocationPicker({
  copy,
  locations,
  selectedId,
  onSelect,
  className,
}: BookingLocationPickerProps) {
  return (
    <VStack className={className} data-slot="booking-location-picker" gap="md">
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      <AsyncRegion slot="booking-locations" state={locations}>
        {(list) => (
          <RadioList
            aria-label={copy.title}
            className="max-w-xl"
            onValueChange={(value) => {
              if (value) {
                onSelect(value);
              }
            }}
            value={selectedId}
          >
            {list.map((location) => (
              <RadioCard
                description={location.address}
                key={location.id}
                title={location.name}
                value={location.id}
              />
            ))}
          </RadioList>
        )}
      </AsyncRegion>
    </VStack>
  );
}

export type { BookingLocationPickerCopy, BookingLocationPickerProps };
export { BookingLocationPicker };
