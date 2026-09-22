import { hkDate, money } from "@/emails/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type LoanRepaidProps = {
  repaidAt?: string;
  totalMinor?: number;
};

export default function LoanRepaidEmail({
  repaidAt = previewCase.loanRepaidAt,
  totalMinor = previewCase.loanRepaidTotalMinor,
}: LoanRepaidProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Book your collection" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: `Your loan on ${itemTitle} is repaid.`,
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="Nothing left to pay"
      lead={`Your loan on ${itemTitle} is fully repaid. Book a time to come and collect it whenever suits you — we hand it back in person, against a signed receipt.`}
      preheader={`${itemTitle} is repaid in full. Book a time to collect it.`}
    >
      <FactsGroup
        facts={[
          { label: "Repaid in total", value: money(totalMinor) },
          { label: "Settled on", value: hkDate(repaidAt) },
          { label: "You now owe", value: money(0) },
        ]}
      />
    </VaultLetter>
  );
}

LoanRepaidEmail.PreviewProps = {
  repaidAt: previewCase.loanRepaidAt,
  totalMinor: previewCase.loanRepaidTotalMinor,
} satisfies LoanRepaidProps;
