import { hkDate } from "@/emails/_components/format";
import {
  FactsGroup,
  ItemLetter,
  Note,
} from "@/emails/vault/_components/item-letter";
import { footerLines } from "@/emails/vault/fixtures";
import { previewItem, previewItemLine } from "@/emails/vault/item-fixtures";

export type RetrievalRequestedProps = {
  requestedAt?: string;
};

export default function RetrievalRequestedEmail({
  requestedAt = previewItem.requestedAt,
}: RetrievalRequestedProps) {
  const { itemTitle } = previewItem;

  return (
    <ItemLetter
      cta={{ href: previewItem.url, label: "See your item" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `You asked for ${itemTitle} back from the vault.`,
      }}
      heading="Retrieval request received"
      itemLine={previewItemLine}
      lead={`We have your request to take ${itemTitle} out of the vault. It shows as Retrieval Pending until we approve it.`}
      preheader={`We have your request for ${itemTitle}. It is awaiting approval.`}
    >
      <FactsGroup
        facts={[
          { label: "Requested on", value: hkDate(requestedAt) },
          { label: "Pickup at", value: previewItem.shopName },
        ]}
      />
      <Note>
        While it is pending the item cannot be listed or requested again.
      </Note>
    </ItemLetter>
  );
}

RetrievalRequestedEmail.PreviewProps = {
  requestedAt: previewItem.requestedAt,
} satisfies RetrievalRequestedProps;
