import { hkDate } from "@/emails/vault/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type CaseExpiredUnbookedProps = {
  submittedAt?: string;
};

export default function CaseExpiredUnbookedEmail({
  submittedAt = previewCase.unbookedSubmittedAt,
}: CaseExpiredUnbookedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Start again" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "Your vault request has expired.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="This request timed out"
      lead={`Your request for ${itemTitle} expired because no visit was ever booked for it. Start a new one whenever you like — nothing was signed and nothing is owed.`}
      preheader="No visit was ever booked, so your request expired. Nothing is owed."
    >
      <FactsGroup
        facts={[{ label: "Sent in on", value: hkDate(submittedAt) }]}
      />
    </VaultLetter>
  );
}

CaseExpiredUnbookedEmail.PreviewProps = {
  submittedAt: previewCase.unbookedSubmittedAt,
} satisfies CaseExpiredUnbookedProps;
