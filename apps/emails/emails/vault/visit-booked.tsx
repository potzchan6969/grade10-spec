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

export type VisitBookedProps = {
  visitAt?: string;
  visitMinutes?: number;
};

export default function VisitBookedEmail({
  visitAt = previewCase.visitAt,
  visitMinutes = previewCase.visitMinutes,
}: VisitBookedProps) {
  const { itemTitle, shopAddress, shopName } = previewCase;

  return (
    <VaultLetter
      attachments={["a calendar file"]}
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "You booked a vault visit with us.",
      }}
      heading="We'll see you soon"
      lead={`Your visit for ${itemTitle} is booked for ${hkDateTime(visitAt)}. Bring the item and a photo ID — we check your ID before anything is signed, either from the link we send you or at the counter.`}
      preheader={`${hkDateTime(visitAt)} at ${shopName}. Bring ${itemTitle} and a photo ID.`}
    >
      <FactsGroup
        facts={[
          { label: "Your visit", value: hkDateTime(visitAt) },
          { label: "Where", value: shopName, subtext: shopAddress },
          { label: "Bring", value: `${itemTitle} and a photo ID` },
          { label: "Takes about", value: `${visitMinutes} minutes` },
        ]}
      />
    </VaultLetter>
  );
}

VisitBookedEmail.PreviewProps = {
  visitAt: previewCase.visitAt,
  visitMinutes: previewCase.visitMinutes,
} satisfies VisitBookedProps;
