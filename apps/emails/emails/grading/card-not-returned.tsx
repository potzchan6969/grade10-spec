import { money } from "@/emails/grading/_components/format";
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

export type CardNotReturnedProps = {
  card?: string;
  intakeId?: string;
};

export default function CardNotReturnedEmail({
  card = previewSubmission.notReturnedCard,
  intakeId = previewSubmission.notReturnedIntakeId,
}: CardNotReturnedProps) {
  const {
    batchId,
    cardCount,
    grader,
    notReturnedDeclaredMinor,
    notReturnedFeeMinor,
    paidMethod,
    settlementDays,
  } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`One card did not come back: ${card}`}
      lead={`Batch ${batchId} came back this morning with ${cardCount - 1} of your ${cardCount} cards. ${card} (intake ${intakeId}) is not in it, and ${grader} cannot account for it. We are sorry.`}
      preheader={`We settle ${card} at its declared value and refund its fee within ${settlementDays} days.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          {
            label: "We settle",
            value: money(notReturnedDeclaredMinor),
            subtext: "its declared value",
          },
          {
            label: "We refund",
            value: money(notReturnedFeeMinor),
            subtext: "its fee",
          },
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
        We claim from the grader or the courier ourselves; you do not wait for
        that. If the card turns up, we tell you the same day and you choose: the
        card back, or the settlement stands.
      </Note>
    </GradingLetter>
  );
}

CardNotReturnedEmail.PreviewProps = {
  card: previewSubmission.notReturnedCard,
  intakeId: previewSubmission.notReturnedIntakeId,
} satisfies CardNotReturnedProps;
