import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import { ChoiceCard } from "./choice-card";
import type { BookingLocation } from "./types";

type BookingLocationPickerCopy = { title: string };

type BookingLocationPickerProps = {
  copy: BookingLocationPickerCopy;
  locations: AsyncState<readonly BookingLocation[]>;
  selectedId?: string;
  onSelect: (locationId: string) => void;
  className?: string;
};

/** The shops offering the picked service, one card each, reported by id. */
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
          <VStack gap="sm" hAlign="stretch">
            {list.map((location) => (
              <ChoiceCard
                description={location.address}
                key={location.id}
                onSelect={() => onSelect(location.id)}
                selected={location.id === selectedId}
                slot="booking-location"
                title={location.name}
              />
            ))}
          </VStack>
        )}
      </AsyncRegion>
    </VStack>
  );
}

export type { BookingLocationPickerCopy, BookingLocationPickerProps };
export { BookingLocationPicker };
