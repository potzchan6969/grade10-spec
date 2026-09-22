import { money } from "@/emails/vault/_components/format";
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

export type RepaymentRecordedProps = {
  amountMinor?: number;
  balanceAfterMinor?: number;
};

export default function RepaymentRecordedEmail({
  amountMinor = previewCase.repaymentMinor,
  balanceAfterMinor = previewCase.repaymentBalanceAfterMinor,
}: RepaymentRecordedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See what is left" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: "We have recorded a payment against your vault case.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="Payment received"
      lead={`We have recorded ${money(amountMinor)} against your loan on ${itemTitle}.`}
      preheader={`${money(amountMinor)} recorded. ${money(balanceAfterMinor)} left to pay.`}
    >
      <FactsGroup
        facts={[
          { label: "We recorded", value: money(amountMinor) },
          { label: "Left to pay", value: money(balanceAfterMinor) },
        ]}
      />
      {balanceAfterMinor > 0 ? (
        <HowToPay {...previewHowToPay} outstandingMinor={balanceAfterMinor} />
      ) : null}
    </VaultLetter>
  );
}

RepaymentRecordedEmail.PreviewProps = {
  amountMinor: previewCase.repaymentMinor,
  balanceAfterMinor: previewCase.repaymentBalanceAfterMinor,
} satisfies RepaymentRecordedProps;
