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

export type CaseExpiredProps = {
  submittedAt?: string;
};

export default function CaseExpiredEmail({
  submittedAt = previewCase.expiredSubmittedAt,
}: CaseExpiredProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Start again" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "Your vault request has expired.",
      }}
      heading="This request timed out"
      lead={`Your request for ${itemTitle} expired because it was not taken further within 30 days of being sent in. Start a new one whenever you like — nothing was signed and nothing is owed.`}
      preheader="Your request was not taken further in time, so it expired. Nothing is owed."
    >
      <FactsGroup
        facts={[{ label: "Sent in on", value: hkDate(submittedAt) }]}
      />
    </VaultLetter>
  );
}

CaseExpiredEmail.PreviewProps = {
  submittedAt: previewCase.expiredSubmittedAt,
} satisfies CaseExpiredProps;
