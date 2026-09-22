import { Alert } from "@grade10/design-system/components/display/alert";
import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { SegmentedControl } from "@grade10/design-system/components/forms/segmented-control";
import { SegmentedControlItem } from "@grade10/design-system/components/forms/segmented-control-item";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { type GradingLocaleProps, formatGradingMoney } from "./grading-copy";
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
 * A closed level reports nothing and reads the line that closes it. Every
 * figure is given: the picker computes no estimate and no ceiling of its own.
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

  return (
    <VStack className={className} data-slot="grading-level-picker" gap="md">
      <Text as="h2" size="lg" weight="medium">
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
        <Text data-slot="grading-level-picker-figures" size="sm" tone="secondary">
          {figuresLine}
        </Text>
      ) : null}
      <VStack gap="sm" hAlign="stretch">
        {levels.map((level) => (
          <LevelCard
            copy={copy}
            key={level.id}
            level={level}
            locale={locale}
            onSelect={onSelectLevel}
            selected={level.id === selectedLevelId}
          />
        ))}
      </VStack>
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
  onSelect,
  selected,
}: {
  copy: GradingLevelPickerCopy;
  level: GradingPickerLevel;
  locale: GradingLocaleProps["locale"];
  onSelect: (levelId: string) => void;
  selected: boolean;
}) {
  const closed = level.state === "closed";

  return (
    <button
      aria-pressed={closed ? undefined : selected}
      className={cn(
        "w-full rounded-2xl border p-4 text-left",
        closed
          ? "cursor-not-allowed border-border bg-muted opacity-50"
          : "cursor-pointer border-border bg-card hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && !closed && "border-primary",
      )}
      data-slot="grading-level-picker-level"
      data-state={level.state}
      disabled={closed}
      onClick={() => {
        if (!closed) onSelect(level.id);
      }}
      type="button"
    >
      <VStack gap="xs" hAlign="stretch">
        <HStack gap="sm" hAlign="space-between" vAlign="center">
          <Text weight="medium">{level.name}</Text>
          {closed ? (
            <Text size="xs" tone="secondary">
              {copy.unavailable}
            </Text>
          ) : (
            <Text size="sm" weight="medium">
              {formatGradingMoney(level.feePerCard, locale)}
            </Text>
          )}
        </HStack>
        {level.state === "open" ? (
          <>
            <Text size="sm" tone="secondary">
              {formatGradingMoney(level.ceiling, locale)}
            </Text>
            {level.coverLine ? (
              <Text
                data-slot="grading-level-picker-cover"
                size="sm"
                tone="secondary"
              >
                {level.coverLine}
              </Text>
            ) : null}
            <Text size="sm" tone="secondary">
              {level.weeks}
            </Text>
          </>
        ) : (
          <Text
            data-slot="grading-level-picker-closed"
            size="sm"
            tone="secondary"
          >
            {level.closedLine}
          </Text>
        )}
      </VStack>
    </button>
  );
}

export type {
  GradingEstimate,
  GradingLevelPickerCopy,
  GradingLevelPickerProps,
  GradingPickerLevel,
};
export { GradingLevelPicker };
