import { Text } from "@grade10/design-system/components/display/text";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
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
          <RadioList
            aria-label={copy.title}
            className="[&_[data-slot=radio-list-items]]:grid [&_[data-slot=radio-list-items]]:w-full [&_[data-slot=radio-list-items]]:gap-2 lg:[&_[data-slot=radio-list-items]]:grid-cols-3"
            onValueChange={(value) => {
              if (value) {
                onSelect(value);
              }
            }}
            value={selectedId ?? ""}
          >
            {list.map((service) => (
              <RadioCard
                description={service.description}
                key={service.id}
                title={service.name}
                value={service.id}
              >
                {service.durationLabel ? (
                  <Text as="span" size="xs" tone="muted">
                    {service.durationLabel}
                  </Text>
                ) : null}
              </RadioCard>
            ))}
          </RadioList>
        )}
      </AsyncRegion>
    </VStack>
  );
}

export type { BookingServicePickerCopy, BookingServicePickerProps };
export { BookingServicePicker };
