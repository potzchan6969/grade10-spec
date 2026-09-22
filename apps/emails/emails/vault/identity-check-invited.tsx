import { hkDateTime } from "@/emails/vault/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type IdentityCheckInvitedProps = {
  visitAt?: string;
  verifyUrl?: string;
};

export default function IdentityCheckInvitedEmail({
  visitAt = previewCase.visitAt,
  verifyUrl = previewCase.verifyUrl,
}: IdentityCheckInvitedProps) {
  const { itemTitle, shopAddress, shopName } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: verifyUrl, label: "Verify my ID" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "You have a vault visit booked with us.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="One step before you come in"
      lead={`Before we can take ${itemTitle} into the vault we need to check your ID. It takes a couple of minutes on your phone. If you would rather do it at the counter, bring your ID to your visit instead.`}
      preheader={`Verify before ${hkDateTime(visitAt)} and your visit takes less time.`}
    >
      <FactsGroup
        facts={[
          { label: "Your visit", value: hkDateTime(visitAt) },
          { label: "Where", value: shopName, subtext: shopAddress },
          { label: "Bring", value: "A photo ID, either way" },
        ]}
      />
    </VaultLetter>
  );
}

IdentityCheckInvitedEmail.PreviewProps = {
  visitAt: previewCase.visitAt,
  verifyUrl: previewCase.verifyUrl,
} satisfies IdentityCheckInvitedProps;
