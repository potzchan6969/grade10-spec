import { hkDateTime, money } from "@/emails/grading/_components/format";
import {
  FactsGroup,
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import {
  previewFooter,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/_components/preview-submission";

export type DropoffCancelledProps = {
  visitAt?: string;
};

export default function DropoffCancelledEmail({
  visitAt = previewSubmission.visitAt,
}: DropoffCancelledProps) {
  const { cardCount, feeTotalMinor, shopName } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Book another drop-off" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="Your drop-off is cancelled"
      lead={`The visit on ${hkDateTime(visitAt)} at ${shopName} is closed. Nothing was paid, and your list is exactly as it was.`}
      preheader="The visit is closed. Your list and your estimate stay as they were."
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          { label: "Visit closed", value: hkDateTime(visitAt) },
          {
            label: "Your list",
            value: `${cardCount} cards, kept`,
            subtext: `Estimate ${money(feeTotalMinor)} at the counter`,
          },
        ]}
      />
      <Note>
        Book another drop-off from the page whenever you are ready. The list,
        the values and the level can change until the cards are checked in.
      </Note>
    </GradingLetter>
  );
}

DropoffCancelledEmail.PreviewProps = {
  visitAt: previewSubmission.visitAt,
} satisfies DropoffCancelledProps;
