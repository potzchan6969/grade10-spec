import {
  hkDate,
  hkDateTime,
  hkDay,
  hkDayTime,
} from "@/emails/_components/format";
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

export type DropoffMovedProps = {
  visitAt?: string;
  movedVisitAt?: string;
};

export default function DropoffMovedEmail({
  visitAt = previewSubmission.visitAt,
  movedVisitAt = previewSubmission.movedVisitAt,
}: DropoffMovedProps) {
  const {
    batchCutOff,
    batchShipDay,
    cardCount,
    estimatedBack,
    shopAddress,
    shopName,
  } = previewSubmission;

  return (
    <GradingLetter
      attachments={["a calendar file"]}
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Drop-off moved: ${hkDateTime(movedVisitAt)}`}
      lead={`Your drop-off has moved from ${hkDateTime(visitAt)} to ${hkDateTime(movedVisitAt)}. Everything else stands: the same ${cardCount} cards, the same list, the same fee at the counter.`}
      preheader={`Now ${hkDateTime(movedVisitAt)} at ${shopName}.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          { label: "New visit", value: hkDateTime(movedVisitAt) },
          { label: "Where", value: shopName, subtext: shopAddress },
          {
            label: "Your cards leave",
            value: hkDay(batchShipDay),
            subtext: `Handed in by ${hkDayTime(batchCutOff)}`,
          },
          { label: "Estimated back", value: hkDate(estimatedBack) },
        ]}
      />
      <Note>
        Move or cancel again from the page, any time before the visit starts. We
        remind you the day before.
      </Note>
    </GradingLetter>
  );
}

DropoffMovedEmail.PreviewProps = {
  visitAt: previewSubmission.visitAt,
  movedVisitAt: previewSubmission.movedVisitAt,
} satisfies DropoffMovedProps;
