import { CardLines } from "@/emails/grading/_components/card-lines";
import { hkDateTime, money } from "@/emails/_components/format";
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

export type CardWithdrawnProps = {
  card?: string;
  intakeId?: string;
  withdrawnAt?: string;
};

/** The hand-back receipt for one card pulled before its batch closed. */
export default function CardWithdrawnEmail({
  card = previewSubmission.withdrawnCard,
  intakeId = previewSubmission.withdrawnIntakeId,
  withdrawnAt = previewSubmission.batchCutOff,
}: CardWithdrawnProps) {
  const {
    cardCount,
    feePerCardMinor,
    feeTotalMinor,
    paidMethod,
    shopName,
    withdrawnFeeMinor,
  } = previewSubmission;

  return (
    <GradingLetter
      attachments={["your signed hand-back receipt"]}
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Withdrawn: ${card} is back with you`}
      lead={`You collected ${card} at ${shopName} on ${hkDateTime(withdrawnAt)}, before its batch closed. Its fee came back at the till, and the rest of the submission goes on as it was.`}
      preheader={`${card} handed back, ${money(withdrawnFeeMinor)} refunded.`}
      submission={previewSubmissionLine}
    >
      <CardLines
        cards={[
          {
            mark: "—",
            name: card,
            detail: `Intake ${intakeId} · withdrawn before the batch closed`,
            note: `Fee refunded, ${money(withdrawnFeeMinor)}`,
          },
        ]}
      />
      <FactsGroup
        facts={[
          {
            label: "Refunded",
            value: `${money(withdrawnFeeMinor)} · ${paidMethod.toLowerCase()}`,
            subtext: "the way you paid, at the till",
          },
          {
            label: "Still going",
            value: `${cardCount - 1} cards`,
            subtext: `Estimate now ${money(feeTotalMinor - feePerCardMinor)} — already paid`,
          },
        ]}
      />
      <Note>
        The cards that go on leave with their batch as planned. We email you
        when they are on their way and the moment the grades are in.
      </Note>
    </GradingLetter>
  );
}

CardWithdrawnEmail.PreviewProps = {
  card: previewSubmission.withdrawnCard,
  intakeId: previewSubmission.withdrawnIntakeId,
  withdrawnAt: previewSubmission.batchCutOff,
} satisfies CardWithdrawnProps;
