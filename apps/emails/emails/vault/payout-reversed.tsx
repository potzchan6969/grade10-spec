import { money } from "@/emails/_components/format";
import { HowToPay } from "@/emails/vault/_components/how-to-pay";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
  previewHowToPay,
} from "@/emails/vault/fixtures";

export type PayoutReversedProps = {
  amountMinor?: number;
  balanceAfterMinor?: number;
};

export default function PayoutReversedEmail({
  amountMinor = previewCase.reversedPayoutMinor,
  balanceAfterMinor = previewCase.reversedPayoutBalanceAfterMinor,
}: PayoutReversedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See what you owe" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: "A payout record on your vault case was taken back.",
      }}
      heading="A payout record was taken back"
      lead={`We have taken back a payout of ${money(amountMinor)} recorded against ${itemTitle}, because it recorded a transfer that did not happen. What you owe has changed; the balance below is the current one.`}
      preheader={`${money(amountMinor)} taken back. ${money(balanceAfterMinor)} is now outstanding.`}
    >
      <FactsGroup
        facts={[
          { label: "Taken back", value: money(amountMinor) },
          { label: "You now owe", value: money(balanceAfterMinor) },
        ]}
      />
      {balanceAfterMinor > 0 ? (
        <HowToPay {...previewHowToPay} outstandingMinor={balanceAfterMinor} />
      ) : null}
    </VaultLetter>
  );
}

PayoutReversedEmail.PreviewProps = {
  amountMinor: previewCase.reversedPayoutMinor,
  balanceAfterMinor: previewCase.reversedPayoutBalanceAfterMinor,
} satisfies PayoutReversedProps;
