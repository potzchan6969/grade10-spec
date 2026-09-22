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

export type DropoffMissedProps = {
  visitAt?: string;
};

export default function DropoffMissedEmail({
  visitAt = previewSubmission.visitAt,
}: DropoffMissedProps) {
  const { cardCount, feeTotalMinor, shopName, weeksBack } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Book another drop-off" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="We missed you at the counter"
      lead={`The drop-off on ${hkDateTime(visitAt)} at ${shopName} has closed. We close the visit, not your list: the cards, the values and the level are exactly as you left them.`}
      preheader="The visit closed. Your list and your estimate are kept — book another drop-off."
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          { label: "Visit closed", value: hkDateTime(visitAt) },
          {
            label: "Your list",
            value: `${cardCount} cards, kept`,
            subtext: `Estimate ${money(feeTotalMinor)} at the counter · back in about ${weeksBack} weeks`,
          },
        ]}
      />
      <Note>
        Book another drop-off from the page and bring the same cards. Nothing
        was paid, and nothing is owed for the visit you missed.
      </Note>
    </GradingLetter>
  );
}

DropoffMissedEmail.PreviewProps = {
  visitAt: previewSubmission.visitAt,
} satisfies DropoffMissedProps;
