import { hkDate, money, moneyRate } from "@/emails/grading/_components/format";
import {
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import { PickupBlock } from "@/emails/grading/_components/pickup-block";
import {
  previewFooter,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/_components/preview-submission";

export type ReadyProps = {
  readyAt?: string;
};

export default function ReadyEmail({
  readyAt = previewSubmission.readyAt,
}: ReadyProps) {
  const {
    grader,
    idThresholdMinor,
    noticeDay,
    openingHours,
    pickupCode,
    pickupItems,
    reminderDays,
    shopAddress,
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
      heading="Ready to collect: 3 slabs and 1 card"
      lead={`Checked against ${grader}’s manifest on ${hkDate(readyAt)}. Come any time we are open and show the code below; no booking needed.`}
      preheader={`Pickup code ${pickupCode} · ${money(upchargeMinor)} to settle at the counter.`}
      submission={previewSubmissionLine}
    >
      <PickupBlock
        bring={`an ID matching the name: your declared total is above ${moneyRate(idThresholdMinor)}. Nothing is kept`}
        code={pickupCode}
        items={pickupItems}
        open={openingHours}
        toSettle={`${money(upchargeMinor)} · at the counter, card, cash or FPS`}
        where={`${shopName} · ${shopAddress}`}
      />
      <Note>
        Rather keep a slab with us? Say so at the counter: it can go straight
        into the vault, free, or you can borrow against it after a valuation.
        The other cards come home with you.
      </Note>
      <Note>
        Not collected within 30 days? We remind you on {hkDate(reminderDays[0])}
        , and again on {hkDate(reminderDays[1])}. From {hkDate(storageStartsAt)}{" "}
        a storage fee of {moneyRate(storageRateMinor)} a card a month accrues,
        due before collection; written notice follows on {hkDate(noticeDay)},
        and after it the cards may be sold under Cap. 456, the proceeds less
        fees held for you. We do not ship slabs back.
      </Note>
      <Note>
        Someone else collecting for you? Name them on your submission page
        first; they bring the code and an ID in their name. Your declared total
        is above {moneyRate(idThresholdMinor)}, so we glance at an ID either
        way; nothing is kept.
      </Note>
    </GradingLetter>
  );
}

ReadyEmail.PreviewProps = {
  readyAt: previewSubmission.readyAt,
} satisfies ReadyProps;
