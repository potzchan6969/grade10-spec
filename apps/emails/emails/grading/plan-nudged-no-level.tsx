import { hkDate, money } from "@/emails/_components/format";
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

export type PlanNudgedNoLevelProps = {
  plannedAt?: string;
  keptUntil?: string;
};

/** The same letter for a list kept before a level is picked: no estimate. */
export default function PlanNudgedNoLevelEmail({
  plannedAt = previewSubmission.plannedAt,
  keptUntil = previewSubmission.keptUntil,
}: PlanNudgedNoLevelProps) {
  const { cardCount } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Book the drop-off" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Still here: ${cardCount} cards`}
      lead={`You planned this submission on ${hkDate(plannedAt)} and no drop-off is booked yet. The list is kept until ${hkDate(keptUntil)}; nothing is paid until you hand the cards in.`}
      preheader={`Your list is kept until ${hkDate(keptUntil)}. Book the drop-off when you are ready.`}
      submission={{ ...previewSubmissionLine, grader: null, level: null }}
    >
      <FactsGroup
        facts={[
          {
            label: "Cards",
            value: `${cardCount} · declared ${money(previewSubmission.declaredTotalMinor)} in total`,
          },
          { label: "Kept until", value: hkDate(keptUntil) },
        ]}
      />
      <Note>
        Book the drop-off from the page when you are ready. The list, the values
        and the level can change until the cards are checked in.
      </Note>
      <Note>
        Booked in one sitting? Then this email is not sent: the drop-off
        confirmation carries the link instead.
      </Note>
    </GradingLetter>
  );
}

PlanNudgedNoLevelEmail.PreviewProps = {
  plannedAt: previewSubmission.plannedAt,
  keptUntil: previewSubmission.keptUntil,
} satisfies PlanNudgedNoLevelProps;
