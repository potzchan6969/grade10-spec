import { hkDate } from "@/emails/_components/format";
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

export type BatchShippedProps = {
  shippedOn?: string;
};

export default function BatchShippedEmail({
  shippedOn = previewSubmission.batchShipDay,
}: BatchShippedProps) {
  const { batchId, courier, estimatedBack, grader, graderOrder, shopName } =
    previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Your cards are on their way to ${grader}`}
      lead={`Batch ${batchId} left ${shopName} on ${hkDate(shippedOn)}, insured, by courier. ${grader}’s clock starts when it arrives; your submission page shows its stages as they happen.`}
      preheader={`Insured and on the way. Estimated back at the shop ${hkDate(estimatedBack)}.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          { label: "Courier", value: courier },
          { label: `${grader} order`, value: graderOrder },
          { label: "Estimated back at the shop", value: hkDate(estimatedBack) },
        ]}
      />
      <Note>
        Nothing to do. We read the grader’s status most days and email you the
        moment the grades post. Past the estimate, we email you the new date the
        day we set it.
      </Note>
    </GradingLetter>
  );
}

BatchShippedEmail.PreviewProps = {
  shippedOn: previewSubmission.batchShipDay,
} satisfies BatchShippedProps;
