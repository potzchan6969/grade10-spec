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

export type PlanSavedProps = {
  plannedAt?: string;
  keptUntil?: string;
  nudgeDay?: string;
};

export default function PlanSavedEmail({
  plannedAt = previewSubmission.plannedAt,
  keptUntil = previewSubmission.keptUntil,
  nudgeDay = previewSubmission.nudgeDay,
}: PlanSavedProps) {
  const { cardCount, grader, level, weeksBack } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your list" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Your submission: ${cardCount} cards for ${grader} ${level}`}
      lead={`You planned a submission on ${hkDate(plannedAt)} and have not handed the cards in yet. This link opens it on any device; nothing is paid until you hand the cards in.`}
      preheader={`Your list is saved until ${hkDate(keptUntil)}. Bring the cards in when you are ready.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          {
            label: "Cards",
            value: `${cardCount} · declared ${money(previewSubmission.declaredTotalMinor)} in total`,
          },
          {
            label: "Estimate",
            value: `${money(previewSubmission.feeTotalMinor)} at the counter`,
            subtext: `Back in about ${weeksBack} weeks from the day your cards leave`,
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

PlanSavedEmail.PreviewProps = {
  plannedAt: previewSubmission.plannedAt,
  keptUntil: previewSubmission.keptUntil,
  nudgeDay: previewSubmission.nudgeDay,
} satisfies PlanSavedProps;
