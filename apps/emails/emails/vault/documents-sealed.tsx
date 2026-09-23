import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type DocumentsSealedProps = {
  packetId?: string;
  attachments?: string[];
};

export default function DocumentsSealedEmail({
  packetId = previewCase.packetId,
  attachments = ["the loan agreement", "the intake receipt"],
}: DocumentsSealedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      attachments={attachments}
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: `You signed documents for ${itemTitle}.`,
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="Your copies of what you signed"
      lead={`The documents you signed for ${itemTitle} are attached, each with its certificate of completion. They are also on your case whenever you need them.`}
      preheader={`Your signed documents for ${itemTitle}.`}
    >
      <FactsGroup facts={[{ label: "Packet", value: packetId }]} />
    </VaultLetter>
  );
}

DocumentsSealedEmail.PreviewProps = {
  packetId: previewCase.packetId,
  attachments: ["the loan agreement", "the intake receipt"],
} satisfies DocumentsSealedProps;
