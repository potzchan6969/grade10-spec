import { hkDate, money, moneyRate } from "@/emails/_components/format";
import {
  FactsGroup,
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import { PickupBlock } from "@/emails/grading/_components/pickup-block";
import {
  previewFooter,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/fixtures";

export type UncollectedReminderProps = {
  /** Which rung this reminder is — the same letter goes out at each. */
  rungDays?: number;
  nextRungDays?: number;
};

export default function UncollectedReminderEmail({
  rungDays = 30,
  nextRungDays = 60,
}: UncollectedReminderProps) {
  const {
    noticeDay,
    openingHours,
    pickupCode,
    pickupItems,
    readyAt,
    shopName,
    storageRateMinor,
    storageStartsAt,
    upchargeMinor,
  } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="Your graded cards are still with us"
      lead={`Your 3 slabs and 1 card have been ready at ${shopName} since ${hkDate(readyAt)}. A reminder, nothing more: they are safe, and the code below still works.`}
      preheader={`Pickup code ${pickupCode}. A reminder at ${rungDays} days — it costs nothing.`}
      submission={previewSubmissionLine}
    >
      <PickupBlock
        code={pickupCode}
        items={pickupItems}
        open={openingHours}
        toSettle={money(upchargeMinor)}
        where={shopName}
      />
      <FactsGroup
        facts={[
          {
            label: `From ${hkDate(storageStartsAt)}`,
            value: `Storage fee ${moneyRate(storageRateMinor)} a card a month`,
            subtext: "due before collection",
          },
          {
            label: `On ${hkDate(noticeDay)}`,
            value: "Written notice",
            subtext:
              "after it the cards may be sold under Cap. 456, the proceeds less fees held for you",
          },
        ]}
      />
      <Note>
        Another reminder comes at {nextRungDays} days. Reminders never cost
        anything.
      </Note>
    </GradingLetter>
  );
}

UncollectedReminderEmail.PreviewProps = {
  rungDays: 30,
  nextRungDays: 60,
} satisfies UncollectedReminderProps;
