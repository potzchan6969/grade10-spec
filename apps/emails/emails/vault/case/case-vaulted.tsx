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

export type CaseVaultedProps = {
  vaultedAt?: string;
};

export default function CaseVaultedEmail({
  vaultedAt = previewCase.vaultedAt,
}: CaseVaultedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `${itemTitle} is now in our vault.`,
      }}
      heading="Safely stored"
      lead={`${itemTitle} is now in our vault, and your signed documents are on your case.`}
      preheader={`${itemTitle} is safely stored.`}
    >
      <FactsGroup
        facts={[{ label: "In the vault since", value: hkDate(vaultedAt) }]}
      />
    </VaultLetter>
  );
}

CaseVaultedEmail.PreviewProps = {
  vaultedAt: previewCase.vaultedAt,
} satisfies CaseVaultedProps;
