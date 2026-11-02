import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { Bank, CheckCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  formatHkd,
  formatUsd,
  WITHDRAWAL_PROCESSING_DAYS,
} from "../../vault-content";

type PayoutMethod = {
  bankName: string;
  accountHolder: string;
  maskedAccount: string;
};

type CashOutStep = "amount" | "bank-details" | "review" | "submitted";

/**
 * Withdrawal — the stepped payout request: amount (with `Max` and
 * the minimum named), first-time bank details when no account is on file,
 * a review that states the approval and the working days before submit,
 * then the submitted beat. Grade10 approves every request; nothing leaves
 * the wallet until then.
 */
function WithdrawalDialog({
  availableUsd,
  minWithdrawalUsd,
  hkdPerUsd,
  payoutMethod,
  open,
  onOpenChange,
  onSubmit,
}: {
  availableUsd: number;
  minWithdrawalUsd: number;
  /** Reference conversion for HKD withdrawals. */
  hkdPerUsd: number;
  /** Saved destination; undefined on a collector's first payout. */
  payoutMethod?: PayoutMethod;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (amountUsd: number, currency: "USD" | "HKD") => void;
}) {
  const [step, setStep] = useState<CashOutStep>("amount");
  const [amountInput, setAmountInput] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    if (open) {
      setStep("amount");
      setAmountInput("");
    }
  }, [open]);

  const [currency, setCurrency] = useState<"USD" | "HKD">("HKD");
  const amount = Number(amountInput) || 0;
  const amountValid = amount >= minWithdrawalUsd && amount <= availableUsd;
  const convertedHkd = Math.round(amount * hkdPerUsd);
  const bankDetailsValid =
    accountHolder.trim() !== "" &&
    bankName.trim() !== "" &&
    accountNumber.trim() !== "";

  const destination: PayoutMethod = payoutMethod ?? {
    bankName,
    accountHolder,
    maskedAccount: `••• ${accountNumber.slice(-4)}`,
  };

  const next = () => {
    if (step === "amount") {
      setStep(payoutMethod ? "review" : "bank-details");
    } else if (step === "bank-details") {
      setStep("review");
    } else if (step === "review") {
      onSubmit?.(amount, currency);
      setStep("submitted");
    }
  };

  const TITLE: Record<CashOutStep, string> = {
    amount: "Withdraw",
    "bank-details": "Payout Bank Details",
    review: "Review Withdraw",
    submitted: "Request Submitted",
  };

  const SUBTEXT: Record<CashOutStep, string> = {
    amount: `Available to withdraw: ${formatUsd(availableUsd)}`,
    "bank-details":
      "In your verified name and saved to your profile — where incentives go on your first withdrawal.",
    review: `Grade10 reviews every request — paid by bank transfer within ${WITHDRAWAL_PROCESSING_DAYS} once approved.`,
    submitted: "We’ll email you once Grade10 approves the payout.",
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{TITLE[step]}</DialogTitle>
          <DialogSubtext>{SUBTEXT[step]}</DialogSubtext>
        </DialogHeader>
        <DialogBody className="gap-6" tabIndex={0}>
          <DialogDescription className="sr-only">
            {SUBTEXT[step]}
          </DialogDescription>

          {step === "amount" ? (
            <VStack gap="sm" hAlign="start">
              <div className="flex w-full items-end gap-3">
                <TextInput
                  aria-label="Withdrawal amount"
                  className="w-full font-heading text-2xl font-medium tabular-nums"
                  inputMode="decimal"
                  prefix="US$"
                  value={amountInput}
                  onChange={(event) =>
                    setAmountInput(event.target.value.replace(/[^0-9.]/g, ""))
                  }
                />
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setAmountInput(String(availableUsd))}
                >
                  Max
                </Button>
              </div>
              <div className="flex w-full items-center gap-2">
                {(["HKD", "USD"] as const).map((code) => (
                  <Button
                    aria-pressed={currency === code}
                    key={code}
                    size="sm"
                    type="button"
                    variant={currency === code ? "default" : "outline"}
                    onClick={() => setCurrency(code)}
                  >
                    {code}
                  </Button>
                ))}
                <Text size="sm" tone="secondary">
                  {currency === "HKD"
                    ? `≈ ${formatHkd(convertedHkd)}`
                    : "USD and overseas withdrawals are handled manually by our team"}
                </Text>
              </div>
              <Text size="sm" tone="secondary">
                Minimum {formatUsd(minWithdrawalUsd)} · One withdrawal every 7
                days
              </Text>
            </VStack>
          ) : null}

          {step === "bank-details" ? (
            <VStack gap="md" hAlign="start">
              <TextInput
                label="Account holder name"
                value={accountHolder}
                onChange={(event) => setAccountHolder(event.target.value)}
              />
              <TextInput
                label="Bank name"
                message={
                  currency === "USD"
                    ? "Include SWIFT details for overseas banks"
                    : "Hong Kong bank accounts only for now"
                }
                value={bankName}
                onChange={(event) => setBankName(event.target.value)}
              />
              <TextInput
                label="Account number"
                inputMode="numeric"
                value={accountNumber}
                onChange={(event) =>
                  setAccountNumber(event.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </VStack>
          ) : null}

          {step === "review" ? (
            <VStack gap="md" hAlign="start">
              <div className="flex w-full items-baseline justify-between">
                <Text size="sm" tone="secondary">
                  Amount
                </Text>
                <span className="font-heading text-3xl font-medium tracking-tight tabular-nums">
                  {formatUsd(amount)}
                  {currency === "HKD" ? (
                    <span className="text-lg text-secondary-foreground">
                      {" "}
                      ≈ {formatHkd(convertedHkd)}
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="flex w-full items-center gap-4 rounded-(--radius-2xl) border border-border bg-background-subtle p-4">
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground"
                >
                  <Bank size={20} weight="regular" />
                </span>
                <VStack className="min-w-0" gap="xs" hAlign="start">
                  <Text as="span" weight="medium">
                    {destination.bankName} {destination.maskedAccount}
                  </Text>
                  <Text
                    as="span"
                    className="text-secondary-foreground"
                    size="sm"
                  >
                    {destination.accountHolder}
                  </Text>
                </VStack>
              </div>
              <div className="flex w-full items-center justify-between">
                <Text size="sm" tone="secondary">
                  {currency === "USD" ? "Handled by" : "Processing time"}
                </Text>
                <Text size="sm" weight="medium">
                  {currency === "USD"
                    ? "Our team manually"
                    : `Within ${WITHDRAWAL_PROCESSING_DAYS} of approval`}
                </Text>
              </div>
            </VStack>
          ) : null}

          {step === "submitted" ? (
            <VStack gap="sm" hAlign="center">
              <span className="text-success">
                <CheckCircle aria-hidden size={48} weight="fill" />
              </span>
              <Text weight="medium">
                Withdrawal of {formatHkd(amount)} requested
              </Text>
              <Text className="text-center text-secondary-foreground" size="sm">
                Your request shows Pending on the portfolio until Grade10
                approves it.
              </Text>
              <Badge variant="outline">Pending</Badge>
            </VStack>
          ) : null}
        </DialogBody>
        <DialogFooter>
          {step === "submitted" ? (
            <DialogClose
              render={
                <Button className="w-full sm:w-auto" size="md" type="button" />
              }
            >
              Done
            </DialogClose>
          ) : (
            <>
              {step === "amount" ? (
                <DialogClose
                  render={
                    <Button
                      className="w-full sm:w-auto"
                      size="md"
                      type="button"
                      variant="outline"
                    />
                  }
                >
                  Cancel
                </DialogClose>
              ) : (
                <Button
                  className="w-full sm:w-auto"
                  size="md"
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setStep(
                      step === "review" && !payoutMethod
                        ? "bank-details"
                        : "amount",
                    )
                  }
                >
                  Back
                </Button>
              )}
              <Button
                className="w-full sm:w-auto"
                disabled={
                  (step === "amount" && !amountValid) ||
                  (step === "bank-details" && !bankDetailsValid)
                }
                size="md"
                type="button"
                onClick={next}
              >
                {step === "review" ? "Submit Request" : "Continue"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { PayoutMethod };
export { WithdrawalDialog };
