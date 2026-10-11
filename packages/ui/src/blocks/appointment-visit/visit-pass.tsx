import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard } from "../page-blocks/fact-card";

type VisitPassCopy = {
  title: string;
  codeLabel: string;
  /** What the visit is, under the code. */
  line?: string;
  note?: string;
};

type VisitPassProps = {
  copy: VisitPassCopy;
  /** The visit code staff find the visit with. */
  code: string;
};

/**
 * The pass: the visit code as large text, what the visit is, and the counter
 * once called. Staff at any shop find the visit with the code.
 */
function VisitPass({ copy, code }: VisitPassProps) {
  return (
    <FactCard copy={{ title: copy.title }} slot="visit-pass">
      <VStack gap="xs">
        <Text as="span" size="xs" tone="secondary">
          {copy.codeLabel}
        </Text>
        <Text as="span" face="mono" size="display" weight="bold">
          {code}
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
