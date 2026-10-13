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

export type PlanSavedNoLevelProps = {
  plannedAt?: string;
  keptUntil?: string;
  nudgeDay?: string;
};

/** The same letter for a list kept before a level is picked: no estimate. */
export default function PlanSavedNoLevelEmail({
  plannedAt = previewSubmission.plannedAt,
  keptUntil = previewSubmission.keptUntil,
  nudgeDay = previewSubmission.nudgeDay,
}: PlanSavedNoLevelProps) {
  const { cardCount } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your list" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Your submission: ${cardCount} cards`}
      lead={`You planned a submission on ${hkDate(plannedAt)} and have not handed the cards in yet. This link opens it on any device; nothing is paid until you hand the cards in.`}
      preheader={`Your list is saved until ${hkDate(keptUntil)}. Bring the cards in when you are ready.`}
      submission={{ ...previewSubmissionLine, grader: null, level: null }}
    >
      <FactsGroup
        facts={[
          {
            label: "Cards",
            value: `${cardCount} · declared ${money(previewSubmission.declaredTotalMinor)} in total`,
          },
          {
            label: "Kept until",
            value: hkDate(keptUntil),
            subtext: `A nudge on ${hkDate(nudgeDay)}`,
          },
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

PlanSavedNoLevelEmail.PreviewProps = {
  plannedAt: previewSubmission.plannedAt,
  keptUntil: previewSubmission.keptUntil,
  nudgeDay: previewSubmission.nudgeDay,
} satisfies PlanSavedNoLevelProps;
