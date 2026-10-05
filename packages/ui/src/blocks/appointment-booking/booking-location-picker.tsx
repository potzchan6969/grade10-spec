import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Check, MapPin } from "@phosphor-icons/react";
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

/** The shops offering the picked service. One shop is a fact row. */
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
        {(list) => {
          const only = list.length === 1 ? list[0] : undefined;
          if (only) {
            return (
              <ShopFact
                location={only}
                onSelect={() => onSelect(only.id)}
                selected={only.id === selectedId}
              />
            );
          }
          return (
            <div className="grid gap-3 sm:grid-cols-2">
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
            </div>
          );
        }}
      </AsyncRegion>
    </VStack>
  );
}

function ShopFact({
  location,
  selected,
  onSelect,
}: {
  location: BookingLocation;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected ? "border-primary bg-muted/30" : "border-border",
      )}
      data-slot="booking-location"
      onClick={onSelect}
      type="button"
    >
      <HStack className="w-full" hAlign="space-between" vAlign="start">
        <HStack gap="sm" vAlign="start">
          <span className="mt-0.5 shrink-0 text-primary">
            <MapPin aria-hidden size={20} />
          </span>
          <VStack gap="xs" hAlign="start">
            <Text as="span" weight="medium">
              {location.name}
            </Text>
            <Text as="span" size="sm" tone="secondary">
              {location.address}
            </Text>
          </VStack>
        </HStack>
        {selected ? <Check aria-hidden size={20} /> : null}
      </HStack>
    </button>
  );
}

export type { BookingLocationPickerCopy, BookingLocationPickerProps };
export { BookingLocationPicker };
