import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard } from "../page-blocks/fact-card";

type VisitPassCopy = {
  title: string;
  nameLabel: string;
  /** What the visit is, under the name. */
  line?: string;
  note?: string;
};

type VisitPassProps = {
  copy: VisitPassCopy;
  /** Who the visit is booked for. */
  name: string;
};

/**
 * The pass: who the visit is booked for as large text, what the visit is,
 * and the counter once called. Staff at any shop find the visit by the
 * collector's phone, email or name.
 */
function VisitPass({ copy, name }: VisitPassProps) {
  return (
    <FactCard copy={{ title: copy.title }} slot="visit-pass">
      <VStack gap="xs">
        <Text as="span" size="xs" tone="secondary">
          {copy.nameLabel}
        </Text>
        <Text as="span" size="display" weight="bold">
          {name}
        </Text>
        {copy.line ? (
          <Text as="span" size="sm">
            {copy.line}
          </Text>
        ) : null}
        {copy.note ? (
          <Text as="span" size="sm" tone="secondary">
            {copy.note}
          </Text>
        ) : null}
      </VStack>
    </FactCard>
  );
}

export type { VisitPassCopy, VisitPassProps };
export { VisitPass };
