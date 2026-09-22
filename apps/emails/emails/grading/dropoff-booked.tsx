import {
  hkDate,
  hkDateTime,
  hkDay,
  hkDayTime,
  money,
} from "@/emails/grading/_components/format";
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

export type DropoffBookedProps = {
  visitAt?: string;
};

export default function DropoffBookedEmail({
  visitAt = previewSubmission.visitAt,
}: DropoffBookedProps) {
  const {
    batchCutOff,
    batchShipDay,
    cardCount,
    estimatedBack,
    feeTotalMinor,
    shopAddress,
    shopName,
    visitMinutes,
  } = previewSubmission;

  return (
    <GradingLetter
      attachments={["a calendar file"]}
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Drop-off booked: ${hkDateTime(visitAt)}`}
      lead={`Bring the ${cardCount} cards to ${shopName} on ${hkDateTime(visitAt)}. The visit takes about ${visitMinutes} minutes: we check each card with you, you sign the submission agreement on our iPad, and you pay ${money(feeTotalMinor)} at the counter.`}
      preheader={`${hkDateTime(visitAt)} at ${shopName}. Bring the ${cardCount} cards, each in a sleeve.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          { label: "Where", value: shopName, subtext: shopAddress },
          { label: "Bring", value: `${cardCount} cards, each in a sleeve` },
          {
            label: "Your cards leave",
            value: hkDay(batchShipDay),
            subtext: `Handed in by ${hkDayTime(batchCutOff)}`,
          },
          { label: "Estimated back", value: hkDate(estimatedBack) },
        ]}
      />
      <Note>
        This link opens your submission on any device: the list, the values and
        the level can change until the cards are checked in. Move or cancel the
        visit from the page, any time before it starts. We remind you the day
        before.
      </Note>
      <Note>
        Missed it? The visit closes, the list stays; book another drop-off from
        the page.
      </Note>
    </GradingLetter>
  );
}

DropoffBookedEmail.PreviewProps = {
  visitAt: previewSubmission.visitAt,
} satisfies DropoffBookedProps;
