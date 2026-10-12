import { VaultLetter } from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type CaseCancelledProps = Record<string, never>;

export default function CaseCancelledEmail() {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Start again" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `Your vault case for ${itemTitle} was cancelled.`,
      }}
      heading="This case has been called off"
      lead={`Your case for ${itemTitle} has been cancelled. Nothing is owed, and you can start a new one whenever you like.`}
      preheader={`Your case for ${itemTitle} was cancelled. Nothing is owed.`}
    />
  );
}

CaseCancelledEmail.PreviewProps = {} satisfies CaseCancelledProps;
