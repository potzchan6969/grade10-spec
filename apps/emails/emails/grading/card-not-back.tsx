import { hkDay, money } from "@/emails/_components/format";
import { CardLines } from "@/emails/grading/_components/card-lines";
import {
  FactsGroup,
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import {
  previewFooter,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/fixtures";

/**
 * One card that did not come back with the box: held by the grader, not
 * returned, or damaged. Held names the day the grader holds it until;
 * neither other outcome names one.
 */
export type NotBackCard = {
  card: string;
  intakeId: string;
  outcome: "held" | "not_returned" | "damaged";
  heldUntil?: string;
  declaredMinor: number;
  feeMinor: number;
};

export type CardNotBackProps = {
  cards?: NotBackCard[];
};

const OUTCOME_LABEL: Record<NotBackCard["outcome"], string> = {
  held: "Held by the grader",
  not_returned: "Not returned",
  damaged: "Damaged",
};

function detailOf(card: NotBackCard): string {
  const intake = `Intake ${card.intakeId}`;
  return card.outcome === "held" && card.heldUntil
    ? `${intake} · held until ${hkDay(card.heldUntil)}`
    : intake;
}

function noteOf(card: NotBackCard): string {
  return `We settle ${money(card.declaredMinor)} · refund ${money(card.feeMinor)}`;
}

const DEFAULT_CARDS: NotBackCard[] = [
  {
    card: previewSubmission.notReturnedCard,
    intakeId: previewSubmission.notReturnedIntakeId,
    outcome: "not_returned",
    declaredMinor: previewSubmission.notReturnedDeclaredMinor,
    feeMinor: previewSubmission.notReturnedFeeMinor,
  },
];

/**
 * A card not back with the box: held, not returned, or damaged, one line
 * each. Held, not returned and damaged are one message, never three — a
 * held card is the only one that names a day.
 */
export default function CardNotBackEmail({
  cards = DEFAULT_CARDS,
}: CardNotBackProps) {
  const { batchId, grader, paidMethod, settlementDays } = previewSubmission;
  const heading =
    cards.length === 1
      ? `One card did not come back: ${cards[0]?.card}`
      : `${cards.length} cards did not come back`;
  const lead =
    cards.length === 1
      ? `Batch ${batchId} came back this morning and ${cards[0]?.card} (intake ${cards[0]?.intakeId}) is not with it. We are sorry.`
      : `Batch ${batchId} came back this morning and ${cards.length} of your cards are not with it. We are sorry.`;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={heading}
      lead={lead}
      preheader={`We settle each at its declared value and refund its fee within ${settlementDays} days.`}
      submission={previewSubmissionLine}
    >
      <CardLines
        cards={cards.map((card) => ({
          mark: OUTCOME_LABEL[card.outcome],
          name: card.card,
          detail: detailOf(card),
          note: noteOf(card),
        }))}
      />
      <FactsGroup
        facts={[
          {
            label: "By",
            value: `Within ${settlementDays} days`,
            subtext: `To the ${paidMethod.toLowerCase()} you paid with, or at the counter`,
          },
          {
            label: "The other cards",
            value: "Ready to collect now",
            subtext: "with the pickup code on your page",
          },
        ]}
      />
      <Note>
        We claim from {grader} or the courier ourselves; you do not wait for
        that. If a card turns up, we tell you the same day and you choose: the
        card back, or the settlement stands.
      </Note>
    </GradingLetter>
  );
}

CardNotBackEmail.PreviewProps = {
  cards: DEFAULT_CARDS,
} satisfies CardNotBackProps;
