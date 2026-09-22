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

export type CardDamagedProps = {
  card?: string;
  intakeId?: string;
};

/** The same letter as a card not returned, naming damage instead. */
export default function CardDamagedEmail({
  card = previewSubmission.notReturnedCard,
  intakeId = previewSubmission.notReturnedIntakeId,
}: CardDamagedProps) {
  const {
    batchId,
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
      heading={`One card came back damaged: ${card}`}
      lead={`Batch ${batchId} came back this morning and ${card} (intake ${intakeId}) is damaged. We photographed it at the counter when you handed it in, and it did not come back that way from ${grader}. We are sorry.`}
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
            label: "The card itself",
            value: "Yours, at the counter",
            subtext: "collect it with the others, or leave it with us",
          },
        ]}
      />
      <Note>
        We claim from the grader or the courier ourselves; you do not wait for
        that.
      </Note>
    </GradingLetter>
  );
}

CardDamagedEmail.PreviewProps = {
  card: previewSubmission.notReturnedCard,
  intakeId: previewSubmission.notReturnedIntakeId,
} satisfies CardDamagedProps;
