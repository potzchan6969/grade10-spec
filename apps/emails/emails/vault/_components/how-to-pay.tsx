import { money } from "@/emails/_components/format";
import { FactsGroup } from "@/emails/vault/_components/vault-letter";

export type HowToPayProps = {
  payee: string;
  fpsId: string;
  bankAccount: string;
  /** The case's own reference, used as the transfer reference. */
  reference: string;
  /** What is still outstanding, shown as the recorded-against-the-day line's amount. */
  outstandingMinor?: number;
};

/**
 * The block a live loan shows, carried into a money letter so a borrower can
 * pay without opening the case: the FPS id, the account under the lender's
 * registered name, the case reference as the transfer reference, card or
 * cash at the counter, and that a payment is recorded against the day it
 * reaches us.
 */
export function HowToPay({
  payee,
  fpsId,
  bankAccount,
  reference,
  outstandingMinor,
}: HowToPayProps) {
  return (
    <FactsGroup
      facts={[
        { label: "FPS ID", value: fpsId },
        {
          label: "Bank account",
          value: bankAccount,
          subtext: `Under ${payee}`,
        },
        {
          label: "Reference",
          value: reference,
          subtext: "Use this as the transfer reference",
        },
        {
          label: "At the counter",
          value: "Card or cash",
          subtext:
            outstandingMinor === undefined
              ? "Recorded against the day it reaches us"
              : `Recorded against the day it reaches us · ${money(outstandingMinor)} outstanding today`,
        },
      ]}
      heading="How to pay"
    />
  );
}
