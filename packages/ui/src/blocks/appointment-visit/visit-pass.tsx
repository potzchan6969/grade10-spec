import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { AuthenticatorQr } from "../auth-two-factor/authenticator-qr";
import { FactCard } from "../page-blocks/fact-card";

type VisitPassCopy = {
  title: string;
  codeLabel: string;
  /** The QR's alternative text, naming the code. */
  qrAlt: string;
  /** What the visit is, under the code. */
  line?: string;
  note?: string;
};

type VisitPassProps = {
  copy: VisitPassCopy;
  /** The visit code the QR carries. */
  code: string;
};

/**
 * The pass: the visit code as a QR and as text, what the visit is, and the
 * counter once called. The QR carries the code itself, so a pass scanned at
 * any shop finds the visit and opens nothing else.
 */
function VisitPass({ copy, code }: VisitPassProps) {
  return (
    <FactCard
      copy={{ title: copy.title }}
      lead={<AuthenticatorQr altText={copy.qrAlt} value={code} />}
      slot="visit-pass"
    >
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
