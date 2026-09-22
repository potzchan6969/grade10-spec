import { hkDate, money } from "@/emails/_components/format";
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

export type NoticePostedProps = {
  noticeDay?: string;
  noticeDays?: number;
};

export default function NoticePostedEmail({
  noticeDay = previewSubmission.noticeDay,
  noticeDays = 30,
}: NoticePostedProps) {
  const {
    noticeEndsAt,
    pickupCode,
    readyAt,
    shopName,
    storageToDateMinor,
    upchargeMinor,
    whatsapp,
  } = previewSubmission;

  return (
    <GradingLetter
      cta={{ href: previewSubmission.url, label: "Open your submission" }}
      footer={previewFooter}
      greeting={`Hi ${previewSubmission.collectorName},`}
      heading="Written notice: collect your graded cards"
      lead={`This is the written notice the submission agreement provides for. Your 3 slabs and 1 card have been ready at ${shopName} since ${hkDate(readyAt)}. Collect them, with what is due, within ${noticeDays} days of this notice, posted ${hkDate(noticeDay)}.`}
      preheader={`Collect within ${noticeDays} days of ${hkDate(noticeDay)}, with what is due.`}
      submission={previewSubmissionLine}
    >
      <FactsGroup
        facts={[
          {
            label: "Due today",
            value: `${money(upchargeMinor)} upcharge`,
            subtext: `${money(storageToDateMinor)} storage to date`,
          },
          { label: "Pickup code", value: pickupCode },
          {
            label: `After ${hkDate(noticeEndsAt)}`,
            value:
              "The cards may be sold under the Disposal of Uncollected Goods Ordinance (Cap. 456)",
            subtext: "the proceeds less our fees are held for you",
          },
        ]}
      />
      <Note>
        The same notice goes by registered post to the address you gave at
        signing.
      </Note>
      <Note>
        Anything unclear, WhatsApp the shop on {whatsapp} and we will find a way
        to get the cards back to you.
      </Note>
    </GradingLetter>
  );
}

NoticePostedEmail.PreviewProps = {
  noticeDay: previewSubmission.noticeDay,
  noticeDays: 30,
} satisfies NoticePostedProps;
