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
} from "@/emails/grading/fixtures";

export type DropoffDetachedProps = {
  visitAt?: string;
};

export default function DropoffDetachedEmail({
  visitAt = previewSubmission.visitAt,
}: DropoffDetachedProps) {
  const { cardCount, feeTotalMinor, shopName } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Book another drop-off" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="Your drop-off needs booking again"
      lead={`Your submission shared the visit on ${hkDateTime(visitAt)} at ${shopName}, and the submission that owned it has closed the visit. Yours is not booked any more.`}
      preheader="The shared visit closed. Your list is kept — book another drop-off."
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
        Book another drop-off from the page and bring the same cards. Nothing
        was paid, and the list, the values and the level are as they were.
      </Note>
    </GradingLetter>
  );
}

DropoffDetachedEmail.PreviewProps = {
  visitAt: previewSubmission.visitAt,
} satisfies DropoffDetachedProps;
