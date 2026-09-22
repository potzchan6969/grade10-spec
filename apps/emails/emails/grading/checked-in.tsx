import {
  hkDate,
  hkDateTime,
  hkDayTime,
  money,
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

export type CheckedInProps = {
  paidAt?: string;
};

export default function CheckedInEmail({
  paidAt = previewSubmission.paidAt,
}: CheckedInProps) {
  const {
    batchCutOff,
    batchShipDay,
    cardCount,
    estimatedBack,
    feeTotalMinor,
    grader,
    level,
    paidMethod,
    posReference,
    submissionId,
  } = previewSubmission;

  return (
    <GradingLetter
      attachments={["the intake receipt", "your signed submission agreement"]}
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Checked in: ${cardCount} cards for ${grader} ${level}`}
      lead={[
        `Thanks for coming in. Your cards are sealed in our intake bag and leave for ${grader} with the batch that closes ${hkDateTime(batchCutOff)} and ships ${hkDate(batchShipDay)}.`,
        "This email is your intake receipt, with the POS reference; the receipt and your signed submission agreement are attached.",
      ]}
      preheader={`${cardCount} cards taken in, ${money(feeTotalMinor)} paid. Estimated back ${hkDate(estimatedBack)}.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          {
            label: "Paid",
            value: `${money(feeTotalMinor)} · ${paidMethod.toLowerCase()}`,
            subtext: `POS ${posReference} · ${hkDateTime(paidAt)}`,
          },
          {
            label: "Cards",
            value: `${cardCount} · intake ${submissionId}-1 to -${cardCount}`,
          },
          { label: "Estimated back at the shop", value: hkDate(estimatedBack) },
          {
            label: "Includes",
            value: "the grader’s fee and insured shipping both ways",
          },
        ]}
      />
      <Note>
        Photographs of each card, front and back, taken at the counter with you,
        are on your submission page.
      </Note>
      <Note>
        Changed your mind? Until the batch closes on {hkDayTime(batchCutOff)} we
        can pull a card: message us, then collect it at the counter and its fee
        comes back at the till.
      </Note>
      <Note>
        We email you when the cards are on their way, the moment the grades are
        in, and when they are ready to collect. Nothing to do until then. The
        estimate runs from the day the batch leaves; the grader’s own clock
        starts when it arrives.
      </Note>
      <Note>
        Keep this in your account: sign in with this email, no password, and
        every submission lists there.
      </Note>
    </GradingLetter>
  );
}

CheckedInEmail.PreviewProps = {
  paidAt: previewSubmission.paidAt,
} satisfies CheckedInProps;
