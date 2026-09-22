import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Divider } from "@grade10/design-system/components/display/divider";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { type GradingLocaleProps, formatGradingMoney } from "./grading-copy";
import type { GradingMoney } from "./types";

/** One money line: its label, its figure, and the note that dresses it. */
type GradingMoneyLine = {
  label: string;
  amount: GradingMoney;
  /** The method, the route, the reference or the rate, as the consumer words it. */
  note?: string;
};

/**
 * The lines a submission can carry, in the order the block draws them. Only
 * the ones given are drawn, and none is worked out here.
 */
type GradingMoneyLines = {
  /** The cards times the fee a card, with its total. */
  fee?: GradingMoneyLine;
  cover?: GradingMoneyLine;
  paid?: GradingMoneyLine;
  movedUp?: GradingMoneyLine;
  waived?: GradingMoneyLine;
  storage?: GradingMoneyLine;
  refunded?: GradingMoneyLine;
  paidOut?: GradingMoneyLine;
  settled?: GradingMoneyLine;
  /** What the collector settles at the counter before collection. */
  due?: GradingMoneyLine;
};

const LINE_ORDER = [
  "fee",
  "cover",
  "paid",
  "movedUp",
  "waived",
  "storage",
  "refunded",
  "paidOut",
  "settled",
  "due",
] as const satisfies readonly (keyof GradingMoneyLines)[];

type GradingMoneyBlockCopy = {
  title: string;
  /** The settle lead, where something is due. */
  lead?: string;
  includes?: string;
  footnote?: string;
};

type GradingMoneyBlockProps = GradingLocaleProps & {
  copy: GradingMoneyBlockCopy;
  lines: GradingMoneyLines;
  className?: string;
};

/**
 * One place for the money lines: the fee, the cover, what was paid and how,
 * what moved up, what was waived, storage, what was refunded or paid out, what
 * was settled, and what is due at the counter.
 *
 * Where something is due the block opens with the settle lead, so what the
 * collector must pay reads first. Every figure and every word is the one it
 * was given: the block totals, prices and converts nothing.
 */
function GradingMoneyBlock({
  copy,
  lines,
  locale = "en",
  className,
}: GradingMoneyBlockProps) {
  const due = lines.due;

  return (
    <Card className={className} data-slot="grading-money-block">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack gap="sm" hAlign="stretch">
          {due && copy.lead ? (
            <Text data-slot="grading-money-block-lead" tone="warning" weight="medium">
              {copy.lead}
            </Text>
          ) : null}
          {LINE_ORDER.map((key) => {
            const line = lines[key];
            if (!line) return null;
            return (
              <VStack
                data-slot={`grading-money-block-${key}`}
                gap="none"
                hAlign="stretch"
                key={key}
              >
                <HStack gap="sm" hAlign="space-between" vAlign="center">
                  <Text size="sm" tone={key === "due" ? "warning" : "primary"}>
                    {line.label}
                  </Text>
                  <Text
                    size="sm"
                    tone={key === "due" ? "warning" : "primary"}
                    weight="medium"
                  >
                    {formatGradingMoney(line.amount, locale)}
                  </Text>
                </HStack>
                {line.note ? (
                  <Text size="xs" tone="secondary">
                    {line.note}
                  </Text>
                ) : null}
              </VStack>
            );
          })}
          {copy.includes || copy.footnote ? <Divider /> : null}
          {copy.includes ? (
            <Text data-slot="grading-money-block-includes" size="sm" tone="secondary">
              {copy.includes}
            </Text>
          ) : null}
          {copy.footnote ? (
            <Text data-slot="grading-money-block-footnote" size="xs" tone="secondary">
              {copy.footnote}
            </Text>
          ) : null}
        </VStack>
      </CardContent>
    </Card>
  );
}

export type {
  GradingMoneyBlockCopy,
  GradingMoneyBlockProps,
  GradingMoneyLine,
  GradingMoneyLines,
};
export { GradingMoneyBlock };
