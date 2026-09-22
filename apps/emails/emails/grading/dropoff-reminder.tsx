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

export type DropoffReminderProps = {
  visitAt?: string;
};

export default function DropoffReminderEmail({
  visitAt = previewSubmission.visitAt,
}: DropoffReminderProps) {
  const { cardCount, feeTotalMinor, shopAddress, shopName, visitMinutes } =
    previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Tomorrow: your drop-off at ${hkDateTime(visitAt)}`}
      lead={`A reminder for the visit tomorrow. It takes about ${visitMinutes} minutes: we check each card against your list with you, you sign on our iPad, and you pay ${money(feeTotalMinor)} at the counter.`}
      preheader={`Bring the ${cardCount} cards, each in a sleeve, to ${shopName}.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          { label: "When", value: hkDateTime(visitAt) },
          { label: "Where", value: shopName, subtext: shopAddress },
          {
            label: "Bring",
            value: `${cardCount} cards, each in a sleeve`,
            subtext:
              "Penny sleeves are fine. No toploaders taped shut, and nothing you want back.",
          },
        ]}
      />
      <Note>
        Move or cancel from the page any time before the visit starts. Miss it
        and we close the visit, not your list.
      </Note>
    </GradingLetter>
  );
}

DropoffReminderEmail.PreviewProps = {
  visitAt: previewSubmission.visitAt,
} satisfies DropoffReminderProps;
