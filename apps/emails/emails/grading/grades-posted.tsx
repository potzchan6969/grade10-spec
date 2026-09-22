import {
  CardLines,
  type CardLine,
} from "@/emails/grading/_components/card-lines";
import { hkDate, money, moneyRate } from "@/emails/_components/format";
import {
  FactsGroup,
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import {
  previewFooter,
  previewGradedCards,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/fixtures";

export type GradesPostedProps = {
  gradesPostedAt?: string;
  backAtShopBy?: string;
  cards?: CardLine[];
};

export default function GradesPostedEmail({
  gradesPostedAt = previewSubmission.gradesPostedAt,
  backAtShopBy = previewSubmission.readyAt,
  cards = previewGradedCards,
}: GradesPostedProps) {
  const {
    grader,
    submissionId,
    upchargeCard,
    upchargeCeilingMinor,
    upchargeFromLevel,
    upchargeMinor,
    upchargeToLevel,
    upchargeValueMinor,
  } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "See the grades" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading={`Grades are in: a ${grader} 10, two 9s, and one returned ungraded`}
      lead={`${grader} posted the grades on ${hkDate(gradesPostedAt)}. Here they are, card by card.`}
      preheader={`A ${grader} 10, two 9s and one raw card. ${money(upchargeMinor)} to settle before you collect.`}
      submission={previewSubmissionLine}
    >
      <CardLines cards={cards} />
      <Note>
        One thing to settle: {upchargeCard} came back worth about{" "}
        {moneyRate(upchargeValueMinor)}, above the {upchargeFromLevel} level’s{" "}
        {moneyRate(upchargeCeilingMinor)}, so {grader} moved it to{" "}
        {upchargeToLevel}. The difference, {money(upchargeMinor)}, is due before
        you collect.
      </Note>
      <Note>
        Charizard V comes back raw with {grader}’s note. The grader charges its
        fee whether or not it encapsulates, so nothing is refunded for it.
      </Note>
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
            label: "How to settle it",
            value: "At the counter, when you collect",
            subtext: "Card, cash or FPS at the till; nothing to do now",
          },
          { label: "Reference", value: submissionId },
        ]}
      />
      <Note>The hand-back receipt is signed once it is settled.</Note>
    </GradingLetter>
  );
}

GradesPostedEmail.PreviewProps = {
  gradesPostedAt: previewSubmission.gradesPostedAt,
  backAtShopBy: previewSubmission.readyAt,
} satisfies GradesPostedProps;
