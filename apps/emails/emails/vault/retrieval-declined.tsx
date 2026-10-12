import { ItemLetter } from "@/emails/vault/_components/item-letter";
import { footerLines } from "@/emails/vault/fixtures";
import { previewItem, previewItemLine } from "@/emails/vault/item-fixtures";

export type RetrievalDeclinedProps = {
  reason?: string;
};

export default function RetrievalDeclinedEmail({
  reason = previewItem.declineReason,
}: RetrievalDeclinedProps) {
  const { itemTitle } = previewItem;

  return (
    <ItemLetter
      afterPoints={[
        `Why: ${reason}.`,
        "You can request retrieval again, or list the item, from its page.",
      ]}
      block={{
        lotTitle: itemTitle,
        listingUrl: previewItem.url,
        primaryImageUrl: previewItem.imageUrl,
        lotSubtext: "Still in the vault",
      }}
      cta={{ href: previewItem.url, label: "See your item" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `We could not approve your request to take ${itemTitle} out of the vault.`,
      }}
      heading="We could not approve this retrieval"
      itemLine={previewItemLine}
      lead={`We are not able to approve your request. ${itemTitle} is still safe in the vault and nothing has changed.`}
      preheader={`We could not approve your request for ${itemTitle}. It is still in the vault.`}
    />
  );
}

RetrievalDeclinedEmail.PreviewProps = {
  reason: previewItem.declineReason,
} satisfies RetrievalDeclinedProps;
