import { hkDate } from "@/emails/_components/format";
import {
  FactsGroup,
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import {
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/fixtures";

export type FooterPlaceholdersProps = {
  custodianName?: string;
  shopAddress?: string;
  complaintsContact?: string;
};

/**
 * Outside production, a value Legal has not set prints as a marked bracket
 * and the letter still goes. In production the act that would print one is
 * refused by name instead, and nothing is written.
 */
export default function FooterPlaceholdersEmail({
  custodianName,
  shopAddress,
  complaintsContact,
}: FooterPlaceholdersProps) {
  const { batchId, courier, estimatedBack, grader, graderOrder, shopName } =
    previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={{
        complaintsContact,
        custodianName,
        shopAddress,
        shopName,
      }}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Your cards are on their way to ${grader}`}
      lead={`Batch ${batchId} left ${shopName} on ${hkDate(previewSubmission.batchShipDay)}, insured, by courier. ${grader}’s clock starts when it arrives; your submission page shows its stages as they happen.`}
      preheader="Staging copy: the footer prints what nobody has set yet, in brackets."
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
        The footer below names each value nobody has set, in brackets. This
        letter still goes outside production; in production the act that would
        print one is refused by name and nothing is written.
      </Note>
    </GradingLetter>
  );
}

FooterPlaceholdersEmail.PreviewProps = {} satisfies FooterPlaceholdersProps;
