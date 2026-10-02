import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Info, Plus } from "@phosphor-icons/react";
import {
  VaultCaseCard,
  type VaultCasesCard,
  type VaultCasesChip,
  type VaultCasesIcon,
  type VaultCasesTone,
} from "./vault-case-card";

type VaultCasesCopy = {
  /** The start action's label. */
  start: string;
  /** The list's heading, read beside the count. */
  yourCases: string;
  /** How to bring several items at once. */
  severalItems: string;
};

type VaultCasesProps = {
  copy: VaultCasesCopy;
  /** The collector's cases, in the order the home reads them. */
  cases: readonly VaultCasesCard[];
  onOpen: (caseId: string) => void;
  onStartRequest: () => void;
};

/**
 * The vault home with cases: the way in, the cases under their count, one
 * card each, and how to bring several items.
 */
function VaultCases({ copy, cases, onOpen, onStartRequest }: VaultCasesProps) {
  return (
    <VStack gap="lg">
      <Button
        className="w-full"
        leading={<Plus aria-hidden weight="bold" />}
        onClick={onStartRequest}
      >
        {copy.start}
      </Button>
      <VStack gap="sm">
        <Text as="h3" size="lg" weight="medium">
          {copy.yourCases}{" "}
          <Text as="span" size="sm" tone="secondary" weight="regular">
            {cases.length}
          </Text>
        </Text>
        {cases.map((card) => (
          <VaultCaseCard card={card} key={card.id} onOpen={onOpen} />
        ))}
      </VStack>
      <Alert
        dismissible={false}
        icon={<Info aria-hidden size={16} weight="bold" />}
        layout="inline"
        role="note"
        status="default"
        title={copy.severalItems}
      />
    </VStack>
  );
}

export type {
  VaultCasesCard,
  VaultCasesChip,
  VaultCasesCopy,
  VaultCasesIcon,
  VaultCasesProps,
  VaultCasesTone,
};
export { VaultCases };
