import { hkDate, money } from "@/emails/_components/format";
import {
  FactsGroup,
  Note,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type ForfeitedProps = {
  settledMinor?: number;
  at?: string;
};

export default function ForfeitedEmail({
  settledMinor = previewCase.forfeitedSettledMinor,
  at = previewCase.forfeitedAt,
}: ForfeitedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: `The loan on ${itemTitle} was not repaid by its due date.`,
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="The item has passed to us"
      lead={`The loan on ${itemTitle} was not repaid by its due date, so under the agreement you signed the item has passed to us and the loan is settled. Nothing further is owed.`}
      preheader={`${itemTitle} has been forfeited. The loan is settled; nothing further is owed.`}
    >
      <FactsGroup
        facts={[
          { label: "Settled the loan at", value: money(settledMinor) },
          { label: "Taken on", value: hkDate(at) },
          { label: "You now owe", value: money(0) },
        ]}
      />
      <Note>No further reminders follow.</Note>
    </VaultLetter>
  );
}

ForfeitedEmail.PreviewProps = {
  settledMinor: previewCase.forfeitedSettledMinor,
  at: previewCase.forfeitedAt,
} satisfies ForfeitedProps;
