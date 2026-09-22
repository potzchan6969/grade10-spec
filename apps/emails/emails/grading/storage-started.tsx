import { hkDate, money, moneyRate } from "@/emails/grading/_components/format";
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
} from "@/emails/grading/_components/preview-submission";

export type StorageStartedProps = {
  storageStartsAt?: string;
};

export default function StorageStartedEmail({
  storageStartsAt = previewSubmission.storageStartsAt,
}: StorageStartedProps) {
  const {
    noticeDay,
    openingHours,
    pickupCode,
    pickupItems,
    readyAt,
    reminderDays,
    shopName,
    storageRateMinor,
    upchargeMinor,
  } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="Your graded cards: a storage fee from today"
      lead={`Your 3 slabs and 1 card have been ready at ${shopName} since ${hkDate(readyAt)}, and we reminded you on ${hkDate(reminderDays[0])} and ${hkDate(reminderDays[1])}. From today, ${hkDate(storageStartsAt)}, a storage fee of ${moneyRate(storageRateMinor)} a card a month accrues, as the submission agreement says. It is due before collection.`}
      preheader={`${moneyRate(storageRateMinor)} a card a month from today, due before collection.`}
      submission={previewSubmissionLine}
    >
      <PickupBlock
        code={pickupCode}
        items={pickupItems}
        open={openingHours}
        toSettle={`${money(upchargeMinor)} · plus the storage fee to the day you collect`}
        where={shopName}
      />
      <FactsGroup
        facts={[
          {
            label: `On ${hkDate(noticeDay)}`,
            value: "Written notice",
            subtext: "if the cards are still here",
          },
        ]}
      />
      <Note>
        Rather keep them with us on purpose? Say so: a vault case stores a slab
        free, with the identity check and the custody agreement at the counter,
        and no storage fee.
      </Note>
    </GradingLetter>
  );
}

StorageStartedEmail.PreviewProps = {
  storageStartsAt: previewSubmission.storageStartsAt,
} satisfies StorageStartedProps;
