import { hkDate } from "@/emails/_components/format";
import { ItemLetter, Note } from "@/emails/vault/_components/item-letter";

import {
  previewItem,
  previewItemFooterLines,
  previewItemLine,
} from "@/emails/vault/item-fixtures";

export type RetrievalRequestedProps = {
  requestedAt?: string;
};

export default function RetrievalRequestedEmail({
  requestedAt = previewItem.requestedAt,
}: RetrievalRequestedProps) {
  const { itemTitle } = previewItem;

  return (
    <ItemLetter
      block={{
        lotTitle: itemTitle,
        listingUrl: previewItem.url,
        primaryImageUrl: previewItem.imageUrl,
        lotSubtext: "Retrieval Pending",
        highlight: { label: "Requested on", value: hkDate(requestedAt) },
        details: [
          {
            label: "Pickup at",
            value: previewItem.shopName,
            subtext: previewItem.shopAddress,
          },
        ],
      }}
      cta={{ href: previewItem.url, label: "See your item" }}
      footer={{
        lines: [...previewItemFooterLines],
        whyYouGotThis: `You asked for ${itemTitle} back from the vault.`,
      }}
      heading="Retrieval request received"
      itemLine={previewItemLine}
      lead={`We have your request to take ${itemTitle} out of the vault. It shows as Retrieval Pending until we approve it.`}
      points={[
        "We review your request.",
        "We confirm your pickup window once the item is released from storage.",
        "You collect it in store with ID that matches your account.",
      ]}
      preheader={`We have your request for ${itemTitle}. It is awaiting approval.`}
    >
      <Note>
        While it is pending the item cannot be listed or requested again.
      </Note>
    </ItemLetter>
  );
}

RetrievalRequestedEmail.PreviewProps = {
  requestedAt: previewItem.requestedAt,
} satisfies RetrievalRequestedProps;
