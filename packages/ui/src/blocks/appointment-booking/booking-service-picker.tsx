import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import { ChoiceCard } from "./choice-card";
import type { BookingService } from "./types";

type BookingServicePickerCopy = { title: string };

type BookingServicePickerProps = {
  copy: BookingServicePickerCopy;
  services: AsyncState<readonly BookingService[]>;
  selectedId?: string;
  onSelect: (serviceId: string) => void;
  className?: string;
};

/** Every customer-bookable service, one card each, reported by id. */
function BookingServicePicker({
  copy,
  services,
  selectedId,
  onSelect,
  className,
}: BookingServicePickerProps) {
  return (
    <VStack className={className} data-slot="booking-service-picker" gap="md">
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      <AsyncRegion slot="booking-services" state={services}>
        {(list) => (
          <VStack gap="sm" hAlign="stretch">
            {list.map((service) => (
              <ChoiceCard
                description={service.description}
                key={service.id}
                meta={service.durationLabel}
                onSelect={() => onSelect(service.id)}
                selected={service.id === selectedId}
                slot="booking-service"
                title={service.name}
              />
            ))}
          </VStack>
        )}
      </AsyncRegion>
    </VStack>
  );
}

export type { BookingServicePickerCopy, BookingServicePickerProps };
export { BookingServicePicker };
