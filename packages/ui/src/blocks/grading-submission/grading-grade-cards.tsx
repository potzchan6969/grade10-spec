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
import type { GradingCardOutcome, GradingPhoto } from "./types";

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
  /** The photograph taken at hand-back, where the collector's slab has
   * one — `GradingCardRecord`'s own `slabPhotograph` slot, modelled the
   * same way here so a collected card reads it whichever block draws it. */
  slabPhotograph?: GradingPhoto;
  /** The card's own payout, once made, or its reversal once reversed —
   * `GradingCardRecord`'s own `outcomeLine` carries the same fact while
   * the cards are still with the shop; a card that never comes back keeps
   * this line once the submission is collected
   * (`grade10-site-grading-submission-lifecycle-SC-41`, `SC-43`). */
  payoutLine?: string;
};

type GradingGradeCardsCopy = {
  title: string;
  ungradedTitle: string;
  graderLabel: string;
  certificateLabel: string;
  lookupLabel: string;
  ungradedCodeLabel: string;
};

type GradingGradeCardsProps = {
  copy: GradingGradeCardsCopy;
  cards: readonly GradingGradeCard[];
  className?: string;
};

/**
 * One card a card, once the grades are in: the grade in the grader's words,
 * the grader and the certificate. A card returned ungraded shows no grade and
 * is drawn apart, with the grader's code and note.
 *
 * Both readings are the one `GradeCard`: a graded card leads with the grade,
 * an ungraded one with the grader's code, and everything either of them says
 * about the card itself is written once.
 */
function GradingGradeCards({ copy, cards, className }: GradingGradeCardsProps) {
  const graded = cards.filter((card) => card.ungraded == null);
  const ungraded = cards.filter((card) => card.ungraded != null);

  return (
    <VStack className={className} data-slot="grading-grade-cards" gap="md">
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      {graded.map((card) => (
        <GradeCard card={card} copy={copy} key={card.id} />
      ))}
      {ungraded.length > 0 ? (
        <VStack
          data-slot="grading-grade-cards-ungraded"
          gap="sm"
          hAlign="stretch"
        >
          <Text as="h3" tone="error" weight="medium">
            {copy.ungradedTitle}
          </Text>
          {ungraded.map((card) => (
            <GradeCard card={card} copy={copy} key={card.id} />
          ))}
        </VStack>
      ) : null}
    </VStack>
  );
}

function GradeCard({
  card,
  copy,
}: {
  card: GradingGradeCard;
  copy: GradingGradeCardsCopy;
}) {
  const { ungraded } = card;

  return (
    <Card
      data-slot={
        ungraded ? "grading-grade-card-ungraded" : "grading-grade-card"
      }
    >
      <CardContent>
        <VStack gap="xs" hAlign="stretch">
          <HStack gap="sm" hAlign="space-between" vAlign="start">
            {ungraded ? (
              <Text weight="medium">{card.name}</Text>
            ) : (
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
            )}
            {card.outcomeLabel && card.outcome ? (
              <Badge
                data-slot="grading-grade-card-badge"
                variant={outcomeTone(card.outcome)}
              >
                {card.outcomeLabel}
              </Badge>
            ) : null}
          </HStack>
          {ungraded ? (
            <>
              <Text face="mono" size="sm" tone="error">
                {`${copy.ungradedCodeLabel}: ${ungraded.code}`}
              </Text>
              <Text size="sm" tone="secondary">
                {ungraded.note}
              </Text>
            </>
          ) : (
            <Text weight="medium">{card.name}</Text>
          )}
          <Text size="sm" tone="secondary">
            {`${copy.graderLabel}: ${card.grader}`}
          </Text>
          {!ungraded && card.payoutLine ? (
            <Text data-slot="grading-grade-card-payout" size="sm">
              {card.payoutLine}
            </Text>
          ) : null}
          {!ungraded && card.certificate ? (
            <HStack gap="sm" vAlign="center">
              <Text face="mono" size="sm">
                {`${copy.certificateLabel}: ${card.certificate}`}
              </Text>
              {card.lookupHref ? (
                <Link href={card.lookupHref}>{copy.lookupLabel}</Link>
              ) : null}
            </HStack>
          ) : null}
          {!ungraded && card.slabPhotograph ? (
            <img
              alt={card.slabPhotograph.alt}
              className="size-20 rounded-lg object-cover"
              data-slot="grading-grade-card-slab"
              src={card.slabPhotograph.src}
            />
          ) : null}
        </VStack>
      </CardContent>
    </Card>
  );
}

export type { GradingGradeCard, GradingGradeCardsCopy, GradingGradeCardsProps };
export { GradingGradeCards };
