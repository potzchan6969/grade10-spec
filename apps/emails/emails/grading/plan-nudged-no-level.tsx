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
      cta={{ href: previewSubmission.url, label: "Open your list" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Still here: ${cardCount} cards`}
      lead={`You planned this submission on ${hkDate(plannedAt)} and the cards have not been handed in yet. The list is kept until ${hkDate(keptUntil)}; nothing is paid until you hand the cards in.`}
      preheader={`Your list is kept until ${hkDate(keptUntil)}. Bring the cards in when you are ready.`}
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
        Bring the cards to the shop when you are ready; the desk checks them in
        against this list. The list, the values and the level can change until
        then.
      </Note>
    </GradingLetter>
  );
}

PlanNudgedNoLevelEmail.PreviewProps = {
  plannedAt: previewSubmission.plannedAt,
  keptUntil: previewSubmission.keptUntil,
} satisfies PlanNudgedNoLevelProps;
