import { hkDate, hkDateTime, hkTime } from "@/emails/_components/format";
import { ItemLetter } from "@/emails/vault/_components/item-letter";
import { footerLines } from "@/emails/vault/fixtures";
import { previewItem, previewItemLine } from "@/emails/vault/item-fixtures";

export type RetrievalApprovedProps = {
  pickupFrom?: string;
  pickupUntil?: string;
};

export default function RetrievalApprovedEmail({
  pickupFrom = previewItem.pickupFrom,
  pickupUntil = previewItem.pickupUntil,
}: RetrievalApprovedProps) {
  const { itemTitle } = previewItem;

  return (
    <ItemLetter
      block={{
        lotTitle: itemTitle,
        listingUrl: previewItem.url,
        primaryImageUrl: previewItem.imageUrl,
        lotSubtext: `${previewItem.grade} · Cert ${previewItem.cert}`,
        highlight: {
          label: "Collect on",
          value: `${hkDateTime(pickupFrom)} to ${hkTime(pickupUntil)}`,
        },
        details: [
          {
            label: "Where",
            value: previewItem.shopName,
            subtext: previewItem.shopAddress,
          },
          { label: "Open", value: previewItem.openingHours },
        ],
      }}
      cta={{ href: previewItem.url, label: "See your item" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `We approved your request to take ${itemTitle} out of the vault.`,
      }}
      heading="Your retrieval is approved"
      itemLine={previewItemLine}
      lead={`We approved your request. ${itemTitle} will be ready for you to collect in store.`}
      points={["Bring ID that matches your account."]}
      preheader={`Collect ${itemTitle} on ${hkDate(pickupFrom)}.`}
    />
  );
}

RetrievalApprovedEmail.PreviewProps = {
  pickupFrom: previewItem.pickupFrom,
  pickupUntil: previewItem.pickupUntil,
} satisfies RetrievalApprovedProps;
