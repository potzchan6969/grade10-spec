import { hkDate, money } from "@/emails/vault/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type OfferMadeProps = {
  principalMinor?: number;
  termDays?: number;
  interestMinor?: number;
  totalMinor?: number;
  lateDayMinor?: number;
  expiresAt?: string;
};

export default function OfferMadeEmail({
  principalMinor = previewCase.offerPrincipalMinor,
  termDays = previewCase.offerTermDays,
  interestMinor = previewCase.offerInterestMinor,
  totalMinor = previewCase.offerTotalMinor,
  lateDayMinor = previewCase.offerLateDayMinor,
  expiresAt = previewCase.offerExpiresAt,
}: OfferMadeProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Review the offer" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: "We have an offer ready on your vault case.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="Your offer is ready"
      lead={`We can lend you ${money(principalMinor)} against ${itemTitle}. The terms are below, and the offer stands until it expires.`}
      preheader={`${money(principalMinor)} against ${itemTitle}, open until ${hkDate(expiresAt)}.`}
    >
      <FactsGroup
        facts={[
          { label: "We lend you", value: money(principalMinor) },
          { label: "Term", value: `${termDays} days` },
          { label: "Interest for the term", value: money(interestMinor) },
          { label: "You repay in total", value: money(totalMinor) },
          { label: "Each day late adds", value: money(lateDayMinor) },
          { label: "Open until", value: hkDate(expiresAt) },
        ]}
      />
    </VaultLetter>
  );
}

OfferMadeEmail.PreviewProps = {
  principalMinor: previewCase.offerPrincipalMinor,
  termDays: previewCase.offerTermDays,
  interestMinor: previewCase.offerInterestMinor,
  totalMinor: previewCase.offerTotalMinor,
  lateDayMinor: previewCase.offerLateDayMinor,
  expiresAt: previewCase.offerExpiresAt,
} satisfies OfferMadeProps;
