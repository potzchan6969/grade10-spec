import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { type GradingLocaleProps, formatGradingMoney } from "./grading-copy";
import type {
  GradingCardOutcome,
  GradingMoney,
  GradingPhoto,
  GradingTone,
} from "./types";

/**
 * The one map from a card's outcome to the tone its badge reads in. The
 * consumer supplies the outcome and its words and never a tone, so the same
 * outcome is dressed the same way on every page that draws it.
 */
const OUTCOME_TONE: Readonly<Record<GradingCardOutcome, GradingTone>> = {
  listed: "outline",
  "handed-in": "outline",
  refused: "error",
  withdrawn: "default",
  graded: "success",
  "moved-up": "warning",
  ungraded: "error",
  "minimum-not-met": "warning",
  held: "warning",
  "not-returned": "error",
  damaged: "error",
  collected: "default",
  vaulted: "default",
};

function outcomeTone(outcome: GradingCardOutcome): GradingTone {
  return OUTCOME_TONE[outcome];
}

/** One card as the shop recorded it. */
type GradingRecordCard = {
  id: string;
  name: string;
  setLine: string;
  declaredValue: GradingMoney;
  minimumGrade?: string;
  /** Issued at the counter; a card still listed has none. */
  intakeId?: string;
  outcome: GradingCardOutcome;
  /** The badge's word, in the collector's language. */
  outcomeLabel: string;
  /** What the card reads beside its badge. */
  outcomeLine: string;
  certificate?: string;
  /** Where the grader looks the certificate up. */
  lookupHref?: string;
  photographs?: { front: GradingPhoto; back: GradingPhoto };
  slabPhotograph?: GradingPhoto;
};

type GradingCardRecordCopy = {
  title: string;
  intakeIdLabel: string;
  declaredValueLabel: string;
  minimumGradeLabel: string;
  certificateLabel: string;
  lookupLabel: string;
};

type GradingCardRecordProps = GradingLocaleProps & {
  copy: GradingCardRecordCopy;
  cards: readonly GradingRecordCard[];
  className?: string;
};

/**
 * The read-only list the submission page carries once the cards are with the
 * shop: the intake id, the photograph pair, and each card's outcome as a badge
 * with its line in the collector's words. It draws no control that changes a
 * card.
 */
function GradingCardRecord({
  copy,
  cards,
  locale = "en",
  className,
}: GradingCardRecordProps) {
  return (
    <VStack className={className} data-slot="grading-card-record" gap="md">
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      {cards.map((card) => (
        <Card data-slot="grading-card-record-card" key={card.id}>
          <CardContent>
            <VStack gap="sm" hAlign="stretch">
              <HStack gap="sm" hAlign="space-between" vAlign="start">
                <VStack gap="none" hAlign="stretch">
                  <Text weight="medium">{card.name}</Text>
                  <Text size="sm" tone="secondary">
                    {card.minimumGrade
                      ? `${card.setLine} · ${copy.minimumGradeLabel}: ${card.minimumGrade}`
                      : card.setLine}
                  </Text>
                </VStack>
                <Badge
                  data-slot="grading-card-record-outcome"
                  variant={outcomeTone(card.outcome)}
                >
                  {card.outcomeLabel}
                </Badge>
              </HStack>
              <Text data-slot="grading-card-record-line" size="sm">
                {card.outcomeLine}
              </Text>
              <Text size="sm" tone="secondary">
                {`${copy.declaredValueLabel}: ${formatGradingMoney(card.declaredValue, locale)}`}
              </Text>
              {card.intakeId ? (
                <Text
                  data-slot="grading-card-record-intake"
                  face="mono"
                  size="sm"
                >
                  {`${copy.intakeIdLabel}: ${card.intakeId}`}
                </Text>
              ) : null}
              {card.certificate ? (
                <HStack
                  data-slot="grading-card-record-certificate"
                  gap="sm"
                  vAlign="center"
                >
                  <Text face="mono" size="sm">
                    {`${copy.certificateLabel}: ${card.certificate}`}
                  </Text>
                  {card.lookupHref ? (
                    <Link href={card.lookupHref}>{copy.lookupLabel}</Link>
                  ) : null}
                </HStack>
              ) : null}
              {card.photographs ? (
                <HStack
                  data-slot="grading-card-record-photographs"
                  gap="sm"
                  vAlign="center"
                >
                  <img
                    alt={card.photographs.front.alt}
                    className="size-20 rounded-lg object-cover"
                    src={card.photographs.front.src}
                  />
                  <img
                    alt={card.photographs.back.alt}
                    className="size-20 rounded-lg object-cover"
                    src={card.photographs.back.src}
                  />
                </HStack>
              ) : null}
              {card.slabPhotograph ? (
                <img
                  alt={card.slabPhotograph.alt}
                  className="size-20 rounded-lg object-cover"
                  data-slot="grading-card-record-slab"
                  src={card.slabPhotograph.src}
                />
              ) : null}
            </VStack>
          </CardContent>
        </Card>
      ))}
    </VStack>
  );
}

export type {
  GradingCardRecordCopy,
  GradingCardRecordProps,
  GradingRecordCard,
};
export { GradingCardRecord, outcomeTone };
