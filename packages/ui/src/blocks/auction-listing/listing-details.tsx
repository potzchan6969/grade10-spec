import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type ListingDetailsSection = {
  heading: ReactNode;
  body: ReactNode;
};

type ListingDetailsFact = {
  label: ReactNode;
  value: ReactNode;
};

type ListingDetailsProps = {
  heading: ReactNode;
  body: ReactNode;
  facts?: readonly ListingDetailsFact[];
  sections?: readonly ListingDetailsSection[];
  className?: string;
};

/**
 * Full-width column under the product photo and buy box: description, facts,
 * and extra text sections. All copy is display-ready.
 */
function ListingDetails({
  heading,
  body,
  facts,
  sections,
  className,
}: ListingDetailsProps) {
  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="listing-details"
      gap="md"
    >
      <VStack gap="sm">
        <Text as="h3" size="lg" weight="medium">
          {heading}
        </Text>
        <Text as="p">{body}</Text>
      </VStack>
      {facts && facts.length > 0 ? (
        <VStack gap="sm">
          {facts.map((fact) => (
            <HStack
              className="w-full"
              gap="sm"
              hAlign="space-between"
              key={String(fact.label)}
              wrap
            >
              <Text size="sm" tone="secondary">
                {fact.label}
              </Text>
              <Text size="sm">{fact.value}</Text>
            </HStack>
          ))}
        </VStack>
      ) : null}
      {sections?.map((section) => (
        <VStack gap="sm" key={String(section.heading)}>
          <Text weight="medium">{section.heading}</Text>
          <Text as="p" tone="secondary">
            {section.body}
          </Text>
        </VStack>
      ))}
    </VStack>
  );
}

export type { ListingDetailsFact, ListingDetailsProps, ListingDetailsSection };
export { ListingDetails };
