import { hkDate, money, moneyRate } from "@/emails/_components/format";
import {
  GradingLetter,
  Note,
} from "@/emails/grading/_components/grading-letter";
import { PickupBlock } from "@/emails/grading/_components/pickup-block";
import {
  previewFooter,
  previewSubmission,
  previewSubmissionLine,
} from "@/emails/grading/fixtures";

export type ReadyBelowThresholdProps = {
  readyAt?: string;
};

/** Declared below the ID threshold: the code and the name release the cards. */
export default function ReadyBelowThresholdEmail({
  readyAt = previewSubmission.readyAt,
}: ReadyBelowThresholdProps) {
  const {
    grader,
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
        bring="nothing — the code and your name release the cards"
        code={pickupCode}
        items={pickupItems}
        open={openingHours}
        toSettle={`${money(upchargeMinor)} · at the counter, card, cash or FPS`}
        where={`${shopName} · ${shopAddress}`}
      />
      <Note>
        Rather keep a slab with us? Say so at the counter: it can go straight
        into the vault, free, or you can borrow against it after a valuation.
      </Note>
      <Note>
        Not collected within 30 days? We remind you on {hkDate(reminderDays[0])}
        , and again on {hkDate(reminderDays[1])}. From {hkDate(storageStartsAt)}{" "}
        a storage fee of {moneyRate(storageRateMinor)} a card a month accrues,
        due before collection; written notice follows on {hkDate(noticeDay)}. We
        do not ship slabs back.
      </Note>
      <Note>
        Someone else collecting for you? Name them on your submission page
        first; they bring the code.
      </Note>
    </GradingLetter>
  );
}

ReadyBelowThresholdEmail.PreviewProps = {
  readyAt: previewSubmission.readyAt,
} satisfies ReadyBelowThresholdProps;
