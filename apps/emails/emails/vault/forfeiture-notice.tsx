import { hkDate, money } from "@/emails/_components/format";
import { HowToPay } from "@/emails/vault/_components/how-to-pay";
import { NoticeClause } from "@/emails/vault/_components/notice-clause";
import { VaultLetter } from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
  previewHowToPay,
} from "@/emails/vault/fixtures";

export type ForfeitureNoticeProps = {
  clause?: string;
  payBy?: string;
  outstandingMinor?: number;
  lateDayMinor?: number;
};

export default function ForfeitureNoticeEmail({
  clause = previewCase.noticeClause,
  payBy = previewCase.noticePayBy,
  outstandingMinor = previewCase.noticeOutstandingMinor,
  lateDayMinor = previewCase.noticeLateDayMinor,
}: ForfeitureNoticeProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Settle this loan" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: `Your loan on ${itemTitle} is overdue.`,
      }}
      heading={`We may take ${itemTitle} to settle this loan`}
      lead={[
        `This notice acts under ${clause}.`,
        `Your loan on ${itemTitle} is overdue and ${money(outstandingMinor)} is outstanding today. Pay in full before ${hkDate(payBy)} and the item stays yours to collect.`,
      ]}
      preheader={`Final notice: pay by ${hkDate(payBy)} or we may take ${itemTitle}.`}
    >
      <NoticeClause
        itemTitle={itemTitle}
        lateDayMinor={lateDayMinor}
        outstandingMinor={outstandingMinor}
        payBy={payBy}
      />
      <HowToPay {...previewHowToPay} outstandingMinor={outstandingMinor} />
    </VaultLetter>
  );
}

ForfeitureNoticeEmail.PreviewProps = {
  clause: previewCase.noticeClause,
  payBy: previewCase.noticePayBy,
  outstandingMinor: previewCase.noticeOutstandingMinor,
  lateDayMinor: previewCase.noticeLateDayMinor,
} satisfies ForfeitureNoticeProps;
