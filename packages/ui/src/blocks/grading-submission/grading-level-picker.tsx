import { Alert } from "@grade10/design-system/components/display/alert";
import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { SegmentedControl } from "@grade10/design-system/components/forms/segmented-control";
import { SegmentedControlItem } from "@grade10/design-system/components/forms/segmented-control-item";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useId } from "react";
import { formatGradingMoney, type GradingLocaleProps } from "./grading-copy";
import type { GradingGrader, GradingMoney } from "./types";

/** One level the collector can leave the list on, or cannot. A closed level
 * carries the words that close it; the picker works out nothing. */
type GradingPickerLevel =
  | {
      id: string;
      name: string;
      state: "open";
      ceiling: GradingMoney;
      feePerCard: GradingMoney;
      /** The cover line where the level carries one. */
      coverLine?: string;
      weeks: string;
    }
  | {
      id: string;
      name: string;
      state: "closed";
      /** Why it is shut: the card declared above its ceiling, or the count. */
      closedLine: string;
    };

/** The estimate the consumer worked out for the level in hand. */
type GradingEstimate = {
  /** `4 cards × HK$250` as the consumer words it. */
  feeLine: string;
  /** The cover a card, where the level carries cover. */
  coverLine?: string;
  total: GradingMoney;
  weeks: string;
  /** What the total covers, as the consumer words it. */
  includes?: string;
  /** When it is paid: at the counter once every card is checked. */
  footnote?: string;
};

type GradingLevelPickerCopy = {
  title: string;
  graderLabel: string;
  /** Leads the highest declared value the levels are read against. */
  highestDeclaredLabel: string;
  estimateTitle: string;
  totalLabel: string;
  /** Read by a level that reports no pick. */
  unavailable: string;
};

type GradingLevelPickerProps = GradingLocaleProps & {
  copy: GradingLevelPickerCopy;
  graders: readonly GradingGrader[];
  selectedGraderId: string;
  levels: readonly GradingPickerLevel[];
  selectedLevelId?: string;
  highestDeclared: GradingMoney;
  /** Said about a grader whose figures are examples. */
  figuresLine?: string;
  /** Where every level is closed: what to do instead. */
  counterLine?: string;
  estimate?: GradingEstimate;
  /** A card moved up a level is charged the difference before collection. */
  upchargeNotice?: string;
  onSelectGrader: (graderId: string) => void;
  onSelectLevel: (levelId: string) => void;
  className?: string;
};

/**
 * The grader, then that grader's levels, then the estimate the pick carries.
 *
 * The levels are a `RadioList` of `RadioCard`s: one pick at a time, announced
 * as one of n, and a closed level is a disabled option rather than a control
 * that reports nothing. Every figure is given: the picker computes no estimate
 * and no ceiling of its own.
 */
function GradingLevelPicker({
  copy,
  graders,
  selectedGraderId,
  levels,
  selectedLevelId,
  highestDeclared,
  figuresLine,
  counterLine,
  estimate,
  upchargeNotice,
  onSelectGrader,
  onSelectLevel,
  locale = "en",
  className,
}: GradingLevelPickerProps) {
  const everyLevelClosed = levels.every((level) => level.state === "closed");
  const titleId = useId();

  return (
    <VStack className={className} data-slot="grading-level-picker" gap="md">
      <Text as="h2" id={titleId} size="lg" weight="medium">
        {copy.title}
      </Text>
      <VStack gap="sm" hAlign="stretch">
        <Text size="xs" tone="secondary">
          {copy.graderLabel}
        </Text>
        <SegmentedControl
          data-slot="grading-level-picker-graders"
          onValueChange={(next) => {
            const picked = next.at(0);
            if (typeof picked === "string") onSelectGrader(picked);
          }}
          value={[selectedGraderId]}
        >
          {graders.map((grader) => (
            <SegmentedControlItem key={grader.id} value={grader.id}>
              {grader.name}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </VStack>
      <Text data-slot="grading-level-picker-highest" size="sm" tone="secondary">
        {`${copy.highestDeclaredLabel} ${formatGradingMoney(highestDeclared, locale)}`}
      </Text>
      {figuresLine ? (
        <Text
          data-slot="grading-level-picker-figures"
          size="sm"
          tone="secondary"
        >
          {figuresLine}
        </Text>
      ) : null}
      <RadioList
        aria-labelledby={titleId}
        onValueChange={(next) => {
          if (typeof next === "string") onSelectLevel(next);
        }}
        value={selectedLevelId ?? null}
      >
        {levels.map((level) => (
          <LevelCard copy={copy} key={level.id} level={level} locale={locale} />
        ))}
      </RadioList>
      {everyLevelClosed && counterLine ? (
        <Text data-slot="grading-level-picker-counter" size="sm" tone="warning">
          {counterLine}
        </Text>
      ) : null}
      {estimate ? (
        <Card data-slot="grading-level-picker-estimate">
          <CardContent>
            <VStack gap="xs" hAlign="stretch">
              <Text size="xs" tone="secondary">
                {copy.estimateTitle}
              </Text>
              <Text size="display" weight="bold">
                {formatGradingMoney(estimate.total, locale)}
              </Text>
              <Text size="sm" tone="secondary">
                {estimate.feeLine}
              </Text>
              {estimate.coverLine ? (
                <Text
                  data-slot="grading-level-picker-estimate-cover"
                  size="sm"
                  tone="secondary"
                >
                  {estimate.coverLine}
                </Text>
              ) : null}
              <Text size="sm" tone="secondary">
                {estimate.weeks}
              </Text>
              {estimate.includes ? (
                <Text
                  data-slot="grading-level-picker-estimate-includes"
                  size="sm"
                  tone="secondary"
                >
                  {estimate.includes}
                </Text>
              ) : null}
              {estimate.footnote ? (
                <Text
                  data-slot="grading-level-picker-estimate-footnote"
                  size="xs"
                  tone="secondary"
                >
                  {estimate.footnote}
                </Text>
              ) : null}
            </VStack>
          </CardContent>
        </Card>
      ) : null}
      {upchargeNotice ? (
        <Alert
          data-slot="grading-level-picker-upcharge"
          dismissible={false}
          status="warning"
          title={upchargeNotice}
        />
      ) : null}
    </VStack>
  );
}

function LevelCard({
  copy,
  level,
  locale,
}: {
  copy: GradingLevelPickerCopy;
  level: GradingPickerLevel;
  locale: GradingLocaleProps["locale"];
}) {
  return (
    <RadioCard
      disabled={level.state === "closed"}
      title={
        <span className="flex w-full items-baseline justify-between gap-2">
          <Text as="span" weight="medium">
            {level.name}
          </Text>
          {level.state === "closed" ? (
            <Text as="span" size="xs" tone="secondary">
              {copy.unavailable}
            </Text>
          ) : (
            <Text as="span" size="sm" weight="medium">
              {formatGradingMoney(level.feePerCard, locale)}
            </Text>
          )}
        </span>
      }
      value={level.id}
    >
      {level.state === "open" ? (
        <>
          <Text as="span" size="sm" tone="secondary">
            {formatGradingMoney(level.ceiling, locale)}
          </Text>
          {level.coverLine ? (
            <Text
              as="span"
              data-slot="grading-level-picker-cover"
              size="sm"
              tone="secondary"
            >
              {level.coverLine}
            </Text>
          ) : null}
          <Text as="span" size="sm" tone="secondary">
            {level.weeks}
          </Text>
        </>
      ) : (
        <Text
          as="span"
          data-slot="grading-level-picker-closed"
          size="sm"
          tone="secondary"
        >
          {level.closedLine}
        </Text>
      )}
    </RadioCard>
  );
}

export type {
  GradingEstimate,
  GradingLevelPickerCopy,
  GradingLevelPickerProps,
  GradingPickerLevel,
};
export { GradingLevelPicker };
