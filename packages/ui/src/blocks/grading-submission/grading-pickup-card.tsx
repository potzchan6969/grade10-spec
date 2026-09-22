import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { formatGradingMoney, type GradingLocaleProps } from "./grading-copy";
import type { GradingMoney } from "./types";

type GradingPickupCardCopy = {
  title: string;
  codeLabel: string;
  itemsLabel: string;
  whereLabel: string;
  openLabel: string;
  dueLabel: string;
  /** Read where nothing is due. */
  nothingDue: string;
  bringLabel: string;
  /** Read where the code alone releases the cards. */
  bringNothing: string;
};

type GradingPickupCardProps = GradingLocaleProps & {
  copy: GradingPickupCardCopy;
  /** The code the counter reads back. */
  code: string;
  /** The slabs and the raw cards to be collected, in the consumer's words. */
  items: string;
  where: { shop: string; address: string };
  /** The hours, in the zone the consumer gave. */
  open: string;
  /** One figure and the line that dresses it; the lines behind it are
   * `GradingMoneyBlock`'s. */
  due?: { total: GradingMoney; line: string };
  /** Who must bring an identity document, where the shop asks for one. */
  bring?: string;
  className?: string;
};

/**
 * What the collector reads when the cards are ready: the code, the items,
 * where and when, what is due as one figure, and whether to bring an ID.
 * It totals nothing.
 */
function GradingPickupCard({
  copy,
  code,
  items,
  where,
  open,
  due,
  bring,
  locale = "en",
  className,
}: GradingPickupCardProps) {
  return (
    <Card className={className} data-slot="grading-pickup-card">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack gap="md" hAlign="stretch">
          <VStack gap="none" hAlign="stretch">
            <Text size="xs" tone="secondary">
              {copy.codeLabel}
            </Text>
            <Text
              data-slot="grading-pickup-card-code"
              face="mono"
              size="display"
              weight="bold"
            >
              {code}
            </Text>
          </VStack>
          <Fact label={copy.itemsLabel} slot="items" value={items} />
          <Fact
            label={copy.whereLabel}
            slot="where"
            value={`${where.shop}, ${where.address}`}
          />
          <Fact label={copy.openLabel} slot="open" value={open} />
          <VStack
            data-slot="grading-pickup-card-due"
            gap="none"
            hAlign="stretch"
          >
            <Text size="xs" tone="secondary">
              {copy.dueLabel}
            </Text>
            {due ? (
              <>
                <Text tone="warning" weight="medium">
                  {formatGradingMoney(due.total, locale)}
                </Text>
                <Text size="sm" tone="secondary">
                  {due.line}
                </Text>
              </>
            ) : (
              <Text weight="medium">{copy.nothingDue}</Text>
            )}
          </VStack>
          <Fact
            label={copy.bringLabel}
            slot="bring"
            value={bring ?? copy.bringNothing}
          />
        </VStack>
      </CardContent>
    </Card>
  );
}

function Fact({
  label,
  slot,
  value,
}: {
  label: string;
  slot: string;
  value: string;
}) {
  return (
    <VStack
      data-slot={`grading-pickup-card-${slot}`}
      gap="none"
      hAlign="stretch"
    >
      <Text size="xs" tone="secondary">
        {label}
      </Text>
      <Text weight="medium">{value}</Text>
    </VStack>
  );
}

export type { GradingPickupCardCopy, GradingPickupCardProps };
export { GradingPickupCard };
