import { hkDate, hkDay } from "@/emails/grading/_components/format";
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

export type BatchReestimatedProps = {
  estimatedBack?: string;
  reestimatedBack?: string;
};

export default function BatchReestimatedEmail({
  estimatedBack = previewSubmission.estimatedBack,
  reestimatedBack = previewSubmission.reestimatedBack,
}: BatchReestimatedProps) {
  const { batchId, grader, graderStage, graderStageSince } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`${grader} is running late with your cards`}
      lead={`Batch ${batchId} is past the estimate we gave you, ${hkDate(estimatedBack)}. ${grader} reports the stage as ${graderStage}; the new estimate is ${hkDate(reestimatedBack)}.`}
      preheader={`New estimate: ${hkDate(reestimatedBack)}. Nothing changes at the counter.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          {
            label: `${grader} stage`,
            value: graderStage,
            subtext: `Since ${hkDay(graderStageSince)}`,
          },
          { label: "Was", value: hkDate(estimatedBack) },
          { label: "Now", value: hkDate(reestimatedBack) },
        ]}
      />
      <Note>
        Nothing to do, and nothing changes at the counter. We email you again
        the moment the grades post, or if the date moves again.
      </Note>
    </GradingLetter>
  );
}

BatchReestimatedEmail.PreviewProps = {
  estimatedBack: previewSubmission.estimatedBack,
  reestimatedBack: previewSubmission.reestimatedBack,
} satisfies BatchReestimatedProps;
