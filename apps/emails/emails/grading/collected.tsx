import { CardLines } from "@/emails/grading/_components/card-lines";
import { hkDateTime, money } from "@/emails/grading/_components/format";
import {
  FactsGroup,
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import {
  previewFooter,
  previewHandedBackCards,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/_components/preview-submission";

export type CollectedProps = {
  collectedAt?: string;
};

export default function CollectedEmail({
  collectedAt = previewSubmission.collectedAt,
}: CollectedProps) {
  const { paidMethod, settledMinor, settledPosReference, shopName } =
    previewSubmission;

  return (
    <GradingLetter
      attachments={["your signed hand-back receipt"]}
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="Collected: your cards are back with you"
      lead={`You collected 3 slabs and 1 raw card at ${shopName} on ${hkDateTime(collectedAt)}. The signed hand-back receipt is attached, and your submission page keeps the grades, the certs and the slab photographs.`}
      preheader={`3 slabs and 1 card handed back, ${money(settledMinor)} settled.`}
      submission={previewSubmissionLine}
    >
      <CardLines cards={previewHandedBackCards} />
      <FactsGroup
        facts={[
          {
            label: "Settled",
            value: `${money(settledMinor)} · ${paidMethod.toLowerCase()}`,
            subtext: `POS ${settledPosReference} · the upcharge on the card that moved up a level`,
          },
          {
            label: "Refunded",
            value: "Nothing",
            subtext: "an ungraded card is charged the grader’s fee either way",
          },
        ]}
      />
      <Note>
        Want a slab back with us? The vault stores it free, and can lend against
        it after a valuation. Selling instead? The grade and the cert carry
        straight into an auction listing.
      </Note>
    </GradingLetter>
  );
}

CollectedEmail.PreviewProps = {
  collectedAt: previewSubmission.collectedAt,
} satisfies CollectedProps;
