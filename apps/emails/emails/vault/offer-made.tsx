import { hkDate, hkDateTime, money } from "@/emails/_components/format";
import {
  FactsGroup,
  Note,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type OfferMadeProps = {
  valuedMinor?: number;
  principalMinor?: number;
  termDays?: number;
  interestMinor?: number;
  totalMinor?: number;
  lateDayMinor?: number;
  expiresAt?: string;
  /** The visit still ahead, which the offer leaves standing; null for none. */
  visitAt?: string | null;
};

export default function OfferMadeEmail({
  valuedMinor = previewCase.offerValuedMinor,
  principalMinor = previewCase.offerPrincipalMinor,
  termDays = previewCase.offerTermDays,
  interestMinor = previewCase.offerInterestMinor,
  totalMinor = previewCase.offerTotalMinor,
  lateDayMinor = previewCase.offerLateDayMinor,
  expiresAt = previewCase.offerExpiresAt,
  visitAt = previewCase.visitAt,
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
      heading="Your offer is ready"
      lead={`We have valued ${itemTitle} at ${money(valuedMinor)} and can lend against it. Here are the terms; answer from your case page or at the counter.`}
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
      <Note>
        Accepting starts nothing: no interest runs until the money reaches you.
        Declining keeps your request open, and we can make another offer.
        {visitAt
          ? ` Your visit on ${hkDateTime(visitAt)} stands either way — bring the item.`
          : ""}
      </Note>
    </VaultLetter>
  );
}

OfferMadeEmail.PreviewProps = {
  valuedMinor: previewCase.offerValuedMinor,
  principalMinor: previewCase.offerPrincipalMinor,
  termDays: previewCase.offerTermDays,
  interestMinor: previewCase.offerInterestMinor,
  totalMinor: previewCase.offerTotalMinor,
  lateDayMinor: previewCase.offerLateDayMinor,
  expiresAt: previewCase.offerExpiresAt,
  visitAt: previewCase.visitAt,
} satisfies OfferMadeProps;
