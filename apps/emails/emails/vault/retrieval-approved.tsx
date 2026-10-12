import { hkDate, hkDateTime, hkTime } from "@/emails/_components/format";
import {
  FactsGroup,
  ItemLetter,
  Note,
} from "@/emails/vault/_components/item-letter";
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
      cta={{ href: previewItem.url, label: "See your item" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `We approved your request to take ${itemTitle} out of the vault.`,
      }}
      heading="Your retrieval is approved"
      itemLine={previewItemLine}
      lead={`We approved your request. ${itemTitle} will be ready for you to collect in store.`}
      preheader={`Collect ${itemTitle} on ${hkDate(pickupFrom)}.`}
    >
      <FactsGroup
        facts={[
          {
            label: "Item",
            value: itemTitle,
            subtext: `${previewItem.grade} · Cert ${previewItem.cert}`,
          },
          {
            label: "Collect on",
            value: `${hkDateTime(pickupFrom)} to ${hkTime(pickupUntil)}`,
          },
          {
            label: "Where",
            value: previewItem.shopName,
            subtext: previewItem.shopAddress,
          },
          { label: "Open", value: previewItem.openingHours },
        ]}
      />
      <Note>Bring ID that matches your account.</Note>
    </ItemLetter>
  );
}

RetrievalApprovedEmail.PreviewProps = {
  pickupFrom: previewItem.pickupFrom,
  pickupUntil: previewItem.pickupUntil,
} satisfies RetrievalApprovedProps;
