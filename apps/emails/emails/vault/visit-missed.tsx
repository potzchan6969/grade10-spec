import { hkDateTime } from "@/emails/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type VisitMissedProps = {
  visitAt?: string;
  /** False on a missed pickup: the item is in our custody, not the collector's. */
  itemWithYou?: boolean;
};

export default function VisitMissedEmail({
  visitAt = previewCase.visitAt,
  itemWithYou = true,
}: VisitMissedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Book another time" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "Your vault visit passed without us seeing you.",
      }}
      heading="We missed you"
      lead={
        itemWithYou
          ? `Your visit for ${itemTitle} passed without us seeing you. ${itemTitle} is still with you, and nothing about your case has changed — book another time whenever suits you.`
          : `Your visit for ${itemTitle} passed without us seeing you. Nothing about your case has changed — book another time whenever suits you.`
      }
      preheader={`${hkDateTime(visitAt)} passed without us seeing you. Book another time whenever suits you.`}
    >
      <FactsGroup
        facts={[{ label: "Your visit was", value: hkDateTime(visitAt) }]}
      />
    </VaultLetter>
  );
}

VisitMissedEmail.PreviewProps = {
  visitAt: previewCase.visitAt,
  itemWithYou: true,
} satisfies VisitMissedProps;
