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

export type CaseNoShowProps = {
  visitAt?: string;
};

export default function CaseNoShowEmail({
  visitAt = previewCase.noShowVisitAt,
}: CaseNoShowProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Start again" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "You missed your vault visit.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="We did not see you"
      lead={`Your visit for ${itemTitle} passed without us seeing you, so this request has been closed. Start a new one whenever you like — nothing was signed and nothing is owed.`}
      preheader="Your request has closed after a missed visit. Nothing is owed."
    >
      <FactsGroup
        facts={[{ label: "Booked visit", value: hkDateTime(visitAt) }]}
      />
    </VaultLetter>
  );
}

CaseNoShowEmail.PreviewProps = {
  visitAt: previewCase.noShowVisitAt,
} satisfies CaseNoShowProps;
