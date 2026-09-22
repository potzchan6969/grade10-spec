import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { outcomeTone } from "./grading-card-record";
import type { GradingLocaleProps } from "./grading-copy";
import type { GradingCardOutcome } from "./types";

/** One card once the grader's reading is in. Every word is the grader's. */
type GradingGradeCard = {
  id: string;
  name: string;
  /** The grade the grader issued, where it issued one. */
  grade?: string;
  /** The grader's word for that grade. */
  gradeLabel?: string;
  grader: string;
  certificate?: string;
  lookupHref?: string;
  /** The outcome and its word, where the card carries a badge. */
  outcome?: GradingCardOutcome;
  outcomeLabel?: string;
  /** What the grader said about a card it returned raw. */
  ungraded?: { code: string; note: string };
};

type GradingGradeCardsCopy = {
  title: string;
  ungradedTitle: string;
  graderLabel: string;
  certificateLabel: string;
  lookupLabel: string;
  ungradedCodeLabel: string;
};

type GradingGradeCardsProps = GradingLocaleProps & {
  copy: GradingGradeCardsCopy;
  cards: readonly GradingGradeCard[];
  className?: string;
};

/**
 * One card a card, once the grades are in: the grade in the grader's words,
 * the grader and the certificate. A card returned ungraded shows no grade and
 * is drawn apart, with the grader's code and note.
 */
function GradingGradeCards({
  copy,
  cards,
  className,
}: GradingGradeCardsProps) {
  const graded = cards.filter((card) => card.ungraded == null);
  const ungraded = cards.filter((card) => card.ungraded != null);

  return (
    <VStack className={className} data-slot="grading-grade-cards" gap="md">
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      {graded.map((card) => (
        <Card data-slot="grading-grade-card" key={card.id}>
          <CardContent>
            <VStack gap="xs" hAlign="stretch">
              <HStack gap="sm" hAlign="space-between" vAlign="start">
                <VStack gap="none" hAlign="stretch">
                  {card.grade ? (
                    <Text
                      data-slot="grading-grade-card-grade"
                      size="display"
                      weight="bold"
                    >
                      {card.grade}
                    </Text>
                  ) : null}
                  {card.gradeLabel ? (
                    <Text size="sm" tone="secondary">
                      {card.gradeLabel}
                    </Text>
                  ) : null}
                </VStack>
                {card.outcomeLabel && card.outcome ? (
                  <Badge
                    data-slot="grading-grade-card-badge"
                    variant={outcomeTone(card.outcome)}
                  >
                    {card.outcomeLabel}
                  </Badge>
                ) : null}
              </HStack>
              <Text weight="medium">{card.name}</Text>
              <Text size="sm" tone="secondary">
                {`${copy.graderLabel}: ${card.grader}`}
              </Text>
              {card.certificate ? (
                <HStack gap="sm" vAlign="center">
                  <Text face="mono" size="sm">
                    {`${copy.certificateLabel}: ${card.certificate}`}
                  </Text>
                  {card.lookupHref ? (
                    <Link href={card.lookupHref}>{copy.lookupLabel}</Link>
                  ) : null}
                </HStack>
              ) : null}
            </VStack>
          </CardContent>
        </Card>
      ))}
      {ungraded.length > 0 ? (
        <VStack data-slot="grading-grade-cards-ungraded" gap="sm" hAlign="stretch">
          <Text as="h3" tone="error" weight="medium">
            {copy.ungradedTitle}
          </Text>
          {ungraded.map((card) => (
            <Card data-slot="grading-grade-card-ungraded" key={card.id}>
              <CardContent>
                <VStack gap="xs" hAlign="stretch">
                  <HStack gap="sm" hAlign="space-between" vAlign="start">
                    <Text weight="medium">{card.name}</Text>
                    {card.outcomeLabel && card.outcome ? (
                      <Badge variant={outcomeTone(card.outcome)}>
                        {card.outcomeLabel}
                      </Badge>
                    ) : null}
                  </HStack>
                  <Text face="mono" size="sm" tone="error">
                    {`${copy.ungradedCodeLabel}: ${card.ungraded?.code}`}
                  </Text>
                  <Text size="sm" tone="secondary">
                    {card.ungraded?.note}
                  </Text>
                  <Text size="sm" tone="secondary">
                    {`${copy.graderLabel}: ${card.grader}`}
                  </Text>
                </VStack>
              </CardContent>
            </Card>
          ))}
        </VStack>
      ) : null}
    </VStack>
  );
}

export type {
  GradingGradeCard,
  GradingGradeCardsCopy,
  GradingGradeCardsProps,
};
export { GradingGradeCards };
