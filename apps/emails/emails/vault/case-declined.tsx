import { Note, VaultLetter } from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type CaseDeclinedProps = {
  reason?: string;
};

export default function CaseDeclinedEmail({
  reason = previewCase.declineReason,
}: CaseDeclinedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `We could not take ${itemTitle} into the vault.`,
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="We are not able to take this item"
      lead={`After looking at ${itemTitle} we are not able to take it into the vault. Nothing has been signed and nothing is owed.`}
      preheader={`We could not take ${itemTitle}. Nothing has been signed and nothing is owed.`}
    >
      <Note>Why: {reason}.</Note>
    </VaultLetter>
  );
}

CaseDeclinedEmail.PreviewProps = {
  reason: previewCase.declineReason,
} satisfies CaseDeclinedProps;
