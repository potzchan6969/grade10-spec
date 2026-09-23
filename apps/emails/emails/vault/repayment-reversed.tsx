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

export type RepaymentReversedProps = {
  amountMinor?: number;
  balanceAfterMinor?: number;
};

export default function RepaymentReversedEmail({
  amountMinor = previewCase.reversedRepaymentMinor,
  balanceAfterMinor = previewCase.reversedRepaymentBalanceAfterMinor,
}: RepaymentReversedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See what you owe" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: "A payment record on your vault case was taken back.",
      }}
      heading="A payment record was taken back"
      lead={`We have taken back a payment of ${money(amountMinor)} recorded against your loan on ${itemTitle}, because it recorded money we had not received. What you owe has changed; the balance below is the current one.`}
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

RepaymentReversedEmail.PreviewProps = {
  amountMinor: previewCase.reversedRepaymentMinor,
  balanceAfterMinor: previewCase.reversedRepaymentBalanceAfterMinor,
} satisfies RepaymentReversedProps;
