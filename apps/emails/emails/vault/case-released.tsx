import { hkDate } from "@/emails/vault/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type CaseReleasedProps = {
  releasedAt?: string;
};

export default function CaseReleasedEmail({
  releasedAt = previewCase.releasedAt,
}: CaseReleasedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `${itemTitle} has been released back to you.`,
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="The item is back with you"
      lead={`${itemTitle} has left our custody and been handed back to you. Nothing is outstanding.`}
      preheader={`${itemTitle} is back with you. Nothing is outstanding.`}
    >
      <FactsGroup
        facts={[{ label: "Released on", value: hkDate(releasedAt) }]}
      />
    </VaultLetter>
  );
}

CaseReleasedEmail.PreviewProps = {
  releasedAt: previewCase.releasedAt,
} satisfies CaseReleasedProps;
