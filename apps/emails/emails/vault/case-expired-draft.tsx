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

export type CaseExpiredDraftProps = {
  keptUntil?: string;
};

export default function CaseExpiredDraftEmail({
  keptUntil = previewCase.draftKeptUntil,
}: CaseExpiredDraftProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Start again" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "Your vault request has expired.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="This request timed out"
      lead={`Your request for ${itemTitle} expired because it sat unfinished. Start a new one whenever you like — nothing was signed and nothing is owed.`}
      preheader="Your request timed out unfinished. Nothing was signed and nothing is owed."
    >
      <FactsGroup facts={[{ label: "Kept until", value: hkDate(keptUntil) }]} />
    </VaultLetter>
  );
}

CaseExpiredDraftEmail.PreviewProps = {
  keptUntil: previewCase.draftKeptUntil,
} satisfies CaseExpiredDraftProps;
