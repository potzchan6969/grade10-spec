import { hkDateTime } from "@/emails/_components/format";
import { VaultLetter } from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type VisitMissedProps = {
  visitAt?: string;
};

export default function VisitMissedEmail({
  visitAt = previewCase.visitAt,
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
      greeting={`Hi ${previewCase.collectorName},`}
      heading="We missed you"
      lead={`Your visit for ${itemTitle} on ${hkDateTime(visitAt)} passed without us seeing you. ${itemTitle} is still with you, and nothing about your case has changed — book another time whenever suits you.`}
      preheader={`${hkDateTime(visitAt)} passed without us seeing you. Book another time whenever suits you.`}
    />
  );
}

VisitMissedEmail.PreviewProps = {
  visitAt: previewCase.visitAt,
} satisfies VisitMissedProps;
