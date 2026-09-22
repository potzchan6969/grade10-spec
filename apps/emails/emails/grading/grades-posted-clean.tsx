import { CardLines } from "@/emails/grading/_components/card-lines";
import { hkDate } from "@/emails/grading/_components/format";
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

export type GradesPostedCleanProps = {
  gradesPostedAt?: string;
  backAtShopBy?: string;
};

/** Nothing to settle and no ungraded card: neither paragraph is written. */
export default function GradesPostedCleanEmail({
  gradesPostedAt = previewSubmission.gradesPostedAt,
  backAtShopBy = previewSubmission.readyAt,
}: GradesPostedCleanProps) {
  const { grader, submissionId } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "See the grades" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Grades are in: a ${grader} 10 and three 9s`}
      lead={`${grader} posted the grades on ${hkDate(gradesPostedAt)}. Here they are, card by card.`}
      preheader={`A ${grader} 10 and three 9s. Nothing to settle.`}
      submission={previewSubmissionLine}
    >
      <CardLines
        cards={[
          {
            mark: "10",
            name: "Umbreon VMAX (Alternate Art)",
            detail: `${grader} 10 GEM MT · cert 98765433`,
          },
          {
            mark: "9",
            name: "Pikachu VMAX",
            detail: `${grader} 9 MINT · cert 98765434`,
          },
          {
            mark: "9",
            name: "Lugia V (Alternate Art)",
            detail: `${grader} 9 MINT · cert 98765435`,
          },
          {
            mark: "9",
            name: "Charizard V",
            detail: `${grader} 9 MINT · cert 98765436`,
          },
        ]}
      />
      <Note>
        The cards are on their way back to us. We email you again once they are
        checked in at the shop, by about {hkDate(backAtShopBy)}.
      </Note>
      <Note>
        A grade is {grader}’s decision, not ours. If you want a second look, a
        review is a new submission at {grader}’s review fee; ask at the counter.
      </Note>
      <FactsGroup
        facts={[
          {
            label: "To settle",
            value: "Nothing",
            subtext: "Come and collect once we email you the pickup code",
          },
          { label: "Reference", value: submissionId },
        ]}
      />
    </GradingLetter>
  );
}

GradesPostedCleanEmail.PreviewProps = {
  gradesPostedAt: previewSubmission.gradesPostedAt,
  backAtShopBy: previewSubmission.readyAt,
} satisfies GradesPostedCleanProps;
