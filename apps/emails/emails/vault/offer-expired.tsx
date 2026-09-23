import { hkDate } from "@/emails/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type OfferExpiredProps = {
  expiresAt?: string;
};

export default function OfferExpiredEmail({
  expiresAt = previewCase.offerExpiresAt,
}: OfferExpiredProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "The offer on your vault case has expired.",
      }}
      heading="That offer has run out"
      lead={`Nobody accepted the offer on ${itemTitle} before it expired, so it is closed. ${itemTitle} and your case are untouched, and we can write you another offer whenever you want one.`}
      preheader={`The offer expired ${hkDate(expiresAt)}. Your item and your case are untouched.`}
    >
      <FactsGroup facts={[{ label: "Expired on", value: hkDate(expiresAt) }]} />
    </VaultLetter>
  );
}

OfferExpiredEmail.PreviewProps = {
  expiresAt: previewCase.offerExpiresAt,
} satisfies OfferExpiredProps;
