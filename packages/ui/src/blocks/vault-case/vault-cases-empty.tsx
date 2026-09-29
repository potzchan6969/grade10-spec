import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { EmptyPanel } from "../page-blocks/empty-panel";

/** One How it works step: a stable id, its title and its line. */
type VaultCasesEmptyStep = { id: string; title: string; body: string };

type VaultCasesEmptyCopy = {
  intro: string;
  /** The start action's label. */
  start: string;
  /** How it works' heading. */
  howItWorks: string;
  steps: readonly VaultCasesEmptyStep[];
  emptyTitle: string;
  emptyBody: string;
  /** How many unsent requests a collector may hold. */
  draftCap: string;
};

type VaultCasesEmptyProps = {
  copy: VaultCasesEmptyCopy;
  onStartRequest: () => void;
  className?: string;
};

/**
 * The vault home with no case yet: the intro and the way in, how the vault
 * works, the empty panel, and how many requests may wait unsent.
 */
function VaultCasesEmpty({
  copy,
  onStartRequest,
  className,
}: VaultCasesEmptyProps) {
  return (
    <VStack className={cn(className)} gap="lg">
      <VStack gap="sm">
        <Text tone="secondary">{copy.intro}</Text>
        <HStack>
          <Button onClick={onStartRequest}>{copy.start}</Button>
        </HStack>
      </VStack>
      <VStack gap="sm">
        <Text as="h3" size="lg" weight="medium">
          {copy.howItWorks}
        </Text>
        {copy.steps.map((step) => (
          <VStack gap="none" key={step.id}>
            <Text weight="medium">{step.title}</Text>
            <Text size="sm" tone="secondary">
              {step.body}
            </Text>
          </VStack>
        ))}
      </VStack>
      <EmptyPanel
        copy={{ title: copy.emptyTitle, description: copy.emptyBody }}
      />
      <Text size="sm" tone="secondary">
        {copy.draftCap}
      </Text>
    </VStack>
  );
}

export type { VaultCasesEmptyCopy, VaultCasesEmptyProps, VaultCasesEmptyStep };
export { VaultCasesEmpty };
