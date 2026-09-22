import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  type GradingLocaleProps,
  formatGradingDay,
  formatGradingMoney,
} from "./grading-copy";
import type { GradingMoney } from "./types";

/** One rung of the ladder, with the day it falls on. */
type GradingLadderRung = {
  id: string;
  label: string;
  /** The day this rung falls on. */
  on: number;
  /** What the rung means, in the consumer's words. */
  line?: string;
  /** The storage fee a card a month, where the rung carries one. */
  fee?: GradingMoney;
  /** The day the notice was posted, once it was. */
  postedOn?: number;
  /** The days the posted notice gives from its posting day. */
  noticeLine?: string;
  passed?: boolean;
};

type GradingUncollectedLadderCopy = {
  title: string;
  readyLabel: string;
  cardsHeldLabel: string;
  passedLabel: string;
  postedLabel: string;
};

type GradingUncollectedLadderProps = GradingLocaleProps & {
  copy: GradingUncollectedLadderCopy;
  rungs: readonly GradingLadderRung[];
  /** The day the cards became ready to collect. */
  readyOn: number;
  /** The cards the shop holds, counted by the consumer. */
  cardsHeld: number;
  /** Moving a slab into a vault case instead. */
  vaultLine?: string;
  className?: string;
};

/**
 * What happens to cards nobody collects, read before it does: the reminder
 * rungs, the day storage starts, and the notice, each with the day it falls
 * on. A rung already reached reads as passed. The block counts nothing.
 */
function GradingUncollectedLadder({
  copy,
  rungs,
  readyOn,
  cardsHeld,
  vaultLine,
  locale = "en",
  timeZone,
  className,
}: GradingUncollectedLadderProps) {
  const when = { locale, timeZone };

  return (
    <Card className={className} data-slot="grading-uncollected-ladder">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack gap="sm" hAlign="stretch">
          <Text data-slot="grading-uncollected-ladder-ready" size="sm" tone="secondary">
            {`${copy.readyLabel} ${formatGradingDay(readyOn, when)}`}
          </Text>
          <Text data-slot="grading-uncollected-ladder-held" size="sm" tone="secondary">
            {`${copy.cardsHeldLabel} ${cardsHeld}`}
          </Text>
          <List>
            {rungs.map((rung, index) => (
              <ListItem
                data-slot="grading-uncollected-ladder-rung"
                data-passed={rung.passed || undefined}
                divider={index < rungs.length - 1}
                key={rung.id}
              >
                <VStack gap="none" hAlign="stretch">
                  <HStack gap="sm" hAlign="space-between" vAlign="center">
                    <HStack gap="xs" vAlign="center">
                      <StatusIndicator
                        variant={rung.passed ? "brand" : "default"}
                      />
                      <Text size="sm" weight="medium">
                        {rung.label}
                      </Text>
                    </HStack>
                    <Text size="sm" tone="secondary">
                      {formatGradingDay(rung.on, when)}
                    </Text>
                  </HStack>
                  {rung.passed ? (
                    <Text size="xs" tone="secondary">
                      {copy.passedLabel}
                    </Text>
                  ) : null}
                  {rung.line ? (
                    <Text size="sm" tone="secondary">
                      {rung.line}
                    </Text>
                  ) : null}
                  {rung.fee ? (
                    <Text size="sm" tone="warning">
                      {formatGradingMoney(rung.fee, locale)}
                    </Text>
                  ) : null}
                  {rung.postedOn ? (
                    <Text
                      data-slot="grading-uncollected-ladder-posted"
                      size="sm"
                      tone="secondary"
                    >
                      {`${copy.postedLabel} ${formatGradingDay(rung.postedOn, when)}`}
                    </Text>
                  ) : null}
                  {rung.noticeLine ? (
                    <Text size="sm" tone="secondary">
                      {rung.noticeLine}
                    </Text>
                  ) : null}
                </VStack>
              </ListItem>
            ))}
          </List>
          {vaultLine ? (
            <Text data-slot="grading-uncollected-ladder-vault" size="sm" tone="secondary">
              {vaultLine}
            </Text>
          ) : null}
        </VStack>
      </CardContent>
    </Card>
  );
}

export type {
  GradingLadderRung,
  GradingUncollectedLadderCopy,
  GradingUncollectedLadderProps,
};
export { GradingUncollectedLadder };
