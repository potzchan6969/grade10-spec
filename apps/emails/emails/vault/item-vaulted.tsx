import { hkDate } from "@/emails/_components/format";
import { FactsGroup, ItemLetter } from "@/emails/vault/_components/item-letter";
import { footerLines } from "@/emails/vault/fixtures";
import { previewItem, previewItemLine } from "@/emails/vault/item-fixtures";

export type ItemVaultedProps = {
  vaultedAt?: string;
};

export default function ItemVaultedEmail({
  vaultedAt = previewItem.vaultedAt,
}: ItemVaultedProps) {
  const { itemTitle } = previewItem;

  return (
    <ItemLetter
      cta={{ href: previewItem.url, label: "See your item" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `${itemTitle} is now in our vault.`,
      }}
      heading="Safely stored"
      itemLine={previewItemLine}
      lead={`${itemTitle} is now in our vault.`}
      preheader={`${itemTitle} is safely stored.`}
    >
      <FactsGroup
        facts={[
          { label: "Vault Storage ID", value: previewItem.vaultId },
          { label: "In the vault since", value: hkDate(vaultedAt) },
        ]}
      />
    </ItemLetter>
  );
}

ItemVaultedEmail.PreviewProps = {
  vaultedAt: previewItem.vaultedAt,
} satisfies ItemVaultedProps;
