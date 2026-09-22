import { hkDate } from "@/emails/grading/_components/format";
import {
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import {
  previewFooter,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/fixtures";

export type PlanExpiredProps = {
  plannedAt?: string;
  keptDays?: number;
};

export default function PlanExpiredEmail({
  plannedAt = previewSubmission.plannedAt,
  keptDays = 30,
}: PlanExpiredProps) {
  const { cardCount, grader, level } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.startUrl, label: "Start a submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="Your submission list has expired"
      lead={`You planned ${cardCount} cards for ${grader} ${level} on ${hkDate(plannedAt)} and no drop-off was booked in ${keptDays} days, so the list has expired.`}
      preheader="Nothing was paid and nothing is owed. Start again whenever you are ready."
      submission={previewSubmissionLine}
    >
      <Note>Nothing was paid and nothing is owed.</Note>
      <Note>
        Prices and references move, so we do not keep an old list. Start again
        from the price sheet whenever you are ready; it takes a few minutes.
      </Note>
    </GradingLetter>
  );
}

PlanExpiredEmail.PreviewProps = {
  plannedAt: previewSubmission.plannedAt,
  keptDays: 30,
} satisfies PlanExpiredProps;
