import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { formatGradingMoney, type GradingLocaleProps } from "./grading-copy";
import type { GradingMoney } from "./types";

/** One card as it will be handed in. */
type GradingReviewCard = {
  id: string;
  name: string;
  setLine: string;
  minimumGrade?: string;
  declaredValue: GradingMoney;
  /** The cover this card carries, where the level carries cover. */
  cover?: GradingMoney;
};

/** What the grader would charge if it moved one card up a level. */
type GradingUpchargeWarning = {
  cardId: string;
  /** The card the warning is about, in the consumer's words. */
  cardLine: string;
  /** The level the grader would move it to. */
  level: string;
  /** The difference due before collection. */
  difference: GradingMoney;
  /** What the higher level costs a card now. */
  higherLevelFee: GradingMoney;
};

type GradingReviewCopy = {
  title: string;
  scheduleTitle: string;
  declaredTotalLabel: string;
  feeLabel: string;
  coverLabel: string;
  minimumGradeLabel: string;
  warningTitle: string;
  /** Leads the level the grader would move a card to. */
  warningLevelLabel: string;
  warningDifferenceLabel: string;
  warningHigherFeeLabel: string;
  goodToKnowTitle: string;
  consent: string;
  book: string;
  saveForLater: string;
  edit: string;
};

/** The collection statement and the booking, given together or not at all. */
type GradingReviewBooking =
  | {
      consented: boolean;
      onConsent: (consented: boolean) => void;
      onBook: () => void;
    }
  | { consented?: never; onConsent?: never; onBook?: never };

type GradingReviewProps = GradingLocaleProps &
  GradingReviewBooking & {
    copy: GradingReviewCopy;
    /** The header line: the cards, the grader, the level and the weeks. */
    summary: string;
    schedule: readonly GradingReviewCard[];
    totals: { declared: GradingMoney; fee: GradingMoney; cover?: GradingMoney };
    warnings?: readonly GradingUpchargeWarning[];
    goodToKnow: readonly string[];
    pending?: boolean;
    /** The refusal the shop gave, in its words. */
    error?: string;
    onEdit: () => void;
    onSaveForLater: () => void;
    className?: string;
  };

/**
 * The last page before the drop-off is booked: every card as it will be handed
 * in, the totals, what a card moved up a level would cost, and the lines to
 * know before agreeing.
 *
 * Nothing is booked before the collection statement is ticked, and neither
 * booking nor saving is offered while the review reads as pending: both
 * controls are disabled rather than removed, so the page does not move under
 * the collector while the shop answers.
 *
 * Given no booking, the review offers neither the statement nor Book, and its
 * save act reads `copy.saveForLater`, whatever the caller names it.
 */
function GradingReview({
  copy,
  summary,
  schedule,
  totals,
  warnings,
  goodToKnow,
  consented,
  pending = false,
  error,
  onEdit,
  onConsent,
  onBook,
  onSaveForLater,
  locale = "en",
  className,
}: GradingReviewProps) {
  return (
    <VStack className={className} data-slot="grading-review" gap="md">
      <Card>
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <HStack gap="sm" hAlign="space-between" vAlign="center">
            <Text data-slot="grading-review-summary" size="sm">
              {summary}
            </Text>
            <Button onClick={onEdit} size="sm" variant="secondary">
              {copy.edit}
            </Button>
          </HStack>
        </CardContent>
      </Card>

      <VStack data-slot="grading-review-schedule" gap="sm" hAlign="stretch">
        <Text as="h3" size="lg" weight="medium">
          {copy.scheduleTitle}
        </Text>
        <List>
          {schedule.map((card, index) => (
            <ListItem
              data-slot="grading-review-card"
              description={card.setLine}
              divider={index < schedule.length - 1}
              key={card.id}
            >
              <VStack gap="none" hAlign="stretch">
                <Text weight="medium">{card.name}</Text>
                <Text size="sm" tone="secondary">
                  {formatGradingMoney(card.declaredValue, locale)}
                </Text>
                {card.cover ? (
                  <Text size="sm" tone="secondary">
                    {`${copy.coverLabel}: ${formatGradingMoney(card.cover, locale)}`}
                  </Text>
                ) : null}
                {card.minimumGrade ? (
                  <Text
                    data-slot="grading-review-minimum-grade"
                    size="sm"
                    tone="secondary"
                  >
                    {`${copy.minimumGradeLabel}: ${card.minimumGrade}`}
                  </Text>
                ) : null}
              </VStack>
            </ListItem>
          ))}
        </List>
      </VStack>

      <VStack data-slot="grading-review-totals" gap="xs" hAlign="stretch">
        <Text size="sm">
          {`${copy.declaredTotalLabel}: ${formatGradingMoney(totals.declared, locale)}`}
        </Text>
        <Text size="sm">
          {`${copy.feeLabel}: ${formatGradingMoney(totals.fee, locale)}`}
        </Text>
        {totals.cover ? (
          <Text data-slot="grading-review-total-cover" size="sm">
            {`${copy.coverLabel}: ${formatGradingMoney(totals.cover, locale)}`}
          </Text>
        ) : null}
      </VStack>

      {warnings && warnings.length > 0 ? (
        <VStack data-slot="grading-review-warnings" gap="sm" hAlign="stretch">
          <Text as="h3" weight="medium">
            {copy.warningTitle}
          </Text>
          {warnings.map((warning) => (
            <Card data-slot="grading-review-warning" key={warning.cardId}>
              <CardContent>
                <VStack gap="none" hAlign="stretch">
                  <Text size="sm" weight="medium">
                    {warning.cardLine}
                  </Text>
                  <Text size="sm" tone="secondary">
                    {`${copy.warningLevelLabel}: ${warning.level}`}
                  </Text>
                  <Text size="sm" tone="warning">
                    {`${copy.warningDifferenceLabel}: ${formatGradingMoney(warning.difference, locale)}`}
                  </Text>
                  <Text size="sm" tone="secondary">
                    {`${copy.warningHigherFeeLabel}: ${formatGradingMoney(warning.higherLevelFee, locale)}`}
                  </Text>
                </VStack>
              </CardContent>
            </Card>
          ))}
        </VStack>
      ) : null}

      <VStack data-slot="grading-review-good-to-know" gap="xs" hAlign="stretch">
        <Text as="h3" weight="medium">
          {copy.goodToKnowTitle}
        </Text>
        <List>
          {goodToKnow.map((line, index) => (
            <ListItem divider={index < goodToKnow.length - 1} key={line}>
              <Text size="sm" tone="secondary">
                {line}
              </Text>
            </ListItem>
          ))}
        </List>
      </VStack>

      {onConsent ? (
        <CheckboxListInput
          checked={consented === true}
          data-slot="grading-review-consent"
          onCheckedChange={(next) => onConsent(next)}
        >
          {copy.consent}
        </CheckboxListInput>
      ) : null}

      {error ? (
        <Text data-slot="grading-review-error" size="sm" tone="error">
          {error}
        </Text>
      ) : null}

      <VStack gap="sm" hAlign="stretch">
        {onBook ? (
          <Button
            data-slot="grading-review-book"
            disabled={consented !== true || pending}
            loading={pending}
            onClick={onBook}
          >
            {copy.book}
          </Button>
        ) : null}
        <Button
          data-slot="grading-review-save"
          disabled={pending}
          onClick={onSaveForLater}
          variant="secondary"
        >
          {copy.saveForLater}
        </Button>
      </VStack>
    </VStack>
  );
}

export type {
  GradingReviewCard,
  GradingReviewCopy,
  GradingReviewProps,
  GradingUpchargeWarning,
};
export { GradingReview };
