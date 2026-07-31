import {
  CryptoPaymentCheckoutDialog,
  CryptoPaymentConfirmationDialog,
  FiatPaymentCheckoutDialog,
  PaymentDialog,
  PaymentOutcomeDialog,
  PaymentPlanActivatedDialog,
  type PaymentPriceState,
  PaymentProcessingDialog,
} from "@acetrader/pred-spec-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

const price: PaymentPriceState = {
  status: "ready",
  amount: "49.00",
  currency: "USDC",
  cycleLabel: "/ every 30 days",
  supportingText: "Subscription",
};
const openOnly = { onOpenChange: () => undefined, open: true };
const onPromoApply = fn();
const onPrimaryAction = fn();
const onPromoRemove = fn();
const onDialogChange = fn();
const onProcessingChange = fn();
const onOutcomePrimary = fn();
const onOutcomeSecondary = fn();

function CryptoDemo() {
  const [token, setToken] = useState<"USDC" | "USDT">("USDC");
  const [promo, setPromo] = useState("");
  return (
    <CryptoPaymentCheckoutDialog
      {...openOnly}
      details={[
        { label: "Chain", value: "Arbitrum" },
        { label: "Pay with", value: "0x1234…5678" },
        {
          helpText: "Add funds to continue.",
          label: "Available balance",
          tone: "warning",
          value: "12.00 USDC",
        },
      ]}
      onTokenChange={setToken}
      price={{ ...price, currency: token }}
      primaryAction={{ label: "Pay with Wallet", onAction: onPrimaryAction }}
      promo={{
        onApply: onPromoApply,
        onValueChange: setPromo,
        status: "entry",
        value: promo,
      }}
      termsNotice={
        <>
          By continuing, you agree to the <a href="/terms">Terms of Service</a>.
        </>
      }
      title="Subscribe to Evaluation"
      tokens={[
        { id: "USDC", label: "USDC" },
        { id: "USDT", label: "USDT" },
      ]}
      selectedToken={token}
    />
  );
}

const meta = {
  component: CryptoPaymentCheckoutDialog,
  title: "Payments/Dialogs",
} satisfies Meta<typeof CryptoPaymentCheckoutDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CryptoCheckout: Story = {
  render: () => <CryptoDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "USDT" }));
    expect(canvas.getByRole("tab", { name: "USDT" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Promo code" }),
      "SAVE20",
    );
    expect(canvas.getByRole("textbox", { name: "Promo code" })).toHaveValue(
      "SAVE20",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Apply" }));
    expect(onPromoApply).toHaveBeenCalledTimes(1);
    await userEvent.click(
      canvas.getByRole("button", { name: "Pay with Wallet" }),
    );
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  },
};

function DialogLifecycleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)} type="button">
        Open payment dialog
      </button>
      <PaymentDialog
        description="A controlled dialog lifecycle fixture."
        onOpenChange={(nextOpen) => {
          onDialogChange(nextOpen);
          setOpen(nextOpen);
        }}
        open={open}
        title="Payment details"
      >
        <button type="button">First action</button>
        <button type="button">Last action</button>
      </PaymentDialog>
    </div>
  );
}

export const DialogLifecycle: Story = {
  render: () => <DialogLifecycleDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open payment dialog" });
    await userEvent.click(opener);
    const dialog = canvas.getByRole("dialog", { name: "Payment details" });
    const close = within(dialog).getByRole("button", { name: "Close dialog" });
    await waitFor(() => expect(close).toHaveFocus());
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    expect(
      within(dialog).getByRole("button", { name: "Last action" }),
    ).toHaveFocus();
    await userEvent.keyboard("[Tab]");
    expect(close).toHaveFocus();
    await userEvent.keyboard("[Escape]");
    await waitFor(() =>
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(opener).toHaveFocus();

    await userEvent.click(opener);
    await userEvent.click(
      within(canvas.getByRole("dialog", { name: "Payment details" })).getByRole(
        "button",
        { name: "Close dialog" },
      ),
    );
    await waitFor(() =>
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    await userEvent.click(opener);
    const backdropDismiss = canvasElement.querySelector<HTMLButtonElement>(
      ".at-payment-dialog-backdrop__dismiss",
    );
    if (!backdropDismiss)
      throw new Error("Dismissible backdrop was not rendered.");
    await userEvent.click(backdropDismiss);
    await waitFor(() =>
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(onDialogChange).toHaveBeenCalledWith(false);
  },
};

export const ProcessingIsNotDismissible: Story = {
  render: () => (
    <PaymentProcessingDialog
      message="Payment is processing."
      onOpenChange={onProcessingChange}
      open
      title="Processing"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole("dialog", { name: "Processing" });
    const spinnerAnimation = dialog
      .querySelector(".at-payment-processing__spinner")
      ?.getAnimations()[0];
    expect(spinnerAnimation?.playState).toBe("running");
    const spinnerTime = Number(spinnerAnimation?.currentTime ?? 0);
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    expect(Number(spinnerAnimation?.currentTime ?? 0)).toBeGreaterThan(
      spinnerTime,
    );
    await userEvent.click(dialog);
    await userEvent.keyboard("[Escape]");
    expect(
      canvas.getByRole("dialog", { name: "Processing" }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
    expect(onProcessingChange).not.toHaveBeenCalled();
  },
};

function PromoStateDemo() {
  const [value, setValue] = useState("SAVE20");
  const [applied, setApplied] = useState(false);
  return (
    <FiatPaymentCheckoutDialog
      {...openOnly}
      price={price}
      primaryAction={{ label: "Continue", onAction: () => undefined }}
      promo={
        applied
          ? {
              code: "SAVE20",
              onRemove: () => {
                onPromoRemove();
                setApplied(false);
              },
              savingsLabel: "20% off",
              status: "applied",
            }
          : {
              onApply: () => {
                onPromoApply();
                setApplied(true);
              },
              onValueChange: setValue,
              status: "entry",
              value,
            }
      }
      title="Promo state"
    />
  );
}

export const PromoEntryAndRemoval: Story = {
  render: () => <PromoStateDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Promo code" });
    input.focus();
    await userEvent.keyboard("[Enter]");
    expect(onPromoApply).toHaveBeenCalled();
    expect(canvas.getByText("SAVE20 applied")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    expect(onPromoRemove).toHaveBeenCalledTimes(1);
    expect(
      canvas.getByRole("textbox", { name: "Promo code" }),
    ).toBeInTheDocument();
  },
};

const onDisabledPromoApply = fn();
export const PromoErrorAndDisabled: Story = {
  render: () => (
    <FiatPaymentCheckoutDialog
      {...openOnly}
      price={price}
      primaryAction={{
        disabled: true,
        label: "Continue",
        onAction: () => undefined,
      }}
      promo={{
        applying: true,
        error: "This code has expired.",
        onApply: onDisabledPromoApply,
        onValueChange: () => undefined,
        status: "entry",
        value: "EXPIRED",
      }}
      title="Promo error"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "This code has expired.",
    );
    expect(canvas.getByRole("textbox", { name: "Promo code" })).toBeDisabled();
    const apply = canvas.getByRole("button", { name: "Applying…" });
    expect(apply).toBeDisabled();
    // The design-system Button also sets `pointer-events: none` when disabled,
    // which the default check treats as an invalid interaction rather than as
    // the non-event this asserts.
    await userEvent
      .setup({ pointerEventsCheck: 0 })
      .click(apply)
      .catch(() => undefined);
    expect(onDisabledPromoApply).not.toHaveBeenCalled();
    expect(canvas.getByRole("button", { name: "Continue" })).toBeDisabled();
  },
};

export const OutcomeActions: Story = {
  render: () => (
    <PaymentOutcomeDialog
      {...openOnly}
      message="Subscription completed."
      outcome="success"
      primaryAction={{ label: "Start Trading", onAction: onOutcomePrimary }}
      secondaryAction={{ label: "Close", onAction: onOutcomeSecondary }}
      title="Plan subscribed"
      transaction={{
        href: "https://example.com/transaction",
        label: "View transaction",
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "Start Trading" }),
    );
    expect(onOutcomeSecondary).toHaveBeenCalledTimes(1);
    expect(onOutcomePrimary).toHaveBeenCalledTimes(1);
    expect(
      canvas.getByRole("link", { name: "View transaction" }),
    ).toHaveAttribute("href", "https://example.com/transaction");
  },
};
export const CryptoLoading: Story = {
  render: () => (
    <CryptoPaymentCheckoutDialog
      {...openOnly}
      details={[{ label: "Available balance", loading: true }]}
      price={{ status: "loading" }}
      primaryAction={{
        disabled: true,
        label: "Preparing Transaction…",
        onAction: () => undefined,
      }}
      title="Subscribe to Evaluation"
    />
  ),
};
export const CryptoLockedToken: Story = {
  render: () => (
    <CryptoPaymentCheckoutDialog
      {...openOnly}
      details={[{ label: "Chain", value: "Ethereum" }]}
      price={{ ...price, currency: "$MEME" }}
      primaryAction={{ label: "Switch to Ethereum", onAction: () => undefined }}
      title="Buy Instant Fund"
    />
  ),
};
export const FiatCheckout: Story = {
  render: () => (
    <FiatPaymentCheckoutDialog
      {...openOnly}
      introduction="You’ll be directed to our secure payment provider to complete payment."
      price={{ ...price, currency: "USD" }}
      primaryAction={{
        label: "Continue with Paytiko",
        onAction: () => undefined,
      }}
      promo={{
        code: "WELCOME",
        onRemove: () => undefined,
        savingsLabel: "20% off for 3 cycles",
        status: "applied",
      }}
      termsNotice="By continuing, you agree to the terms."
      title="Subscribe to Evaluation"
    />
  ),
};
export const FiatFreePromo: Story = {
  render: () => (
    <FiatPaymentCheckoutDialog
      {...openOnly}
      introduction="Your promo covers this plan — no payment required."
      price={{ status: "ready", amount: "0.00", currency: "USD" }}
      primaryAction={{ label: "Activate Plan", onAction: () => undefined }}
      title="Subscribe to Evaluation"
    />
  ),
};
export const CryptoConfirmation: Story = {
  render: () => (
    <CryptoPaymentConfirmationDialog
      {...openOnly}
      steps={[
        {
          id: "approve",
          label: "Approve max. token spending",
          status: "complete",
        },
        {
          description: "Waiting for signature",
          id: "subscribe",
          label: "Enable subscription",
          status: "current",
        },
        { id: "complete", label: "Process transaction", status: "upcoming" },
      ]}
      summary={{ amount: "49.00 USDC", label: "Evaluation subscription" }}
      title="Confirm Transaction"
    />
  ),
};
export const FiatProcessing: Story = {
  render: () => (
    <PaymentProcessingDialog
      {...openOnly}
      message={
        <>
          Please stay on this page.
          <br />
          We are confirming payment details.
        </>
      }
      progressLabel="Processing Your Payment"
      title=""
    />
  ),
};
export const OutcomeSuccess: Story = {
  render: () => (
    <PaymentOutcomeDialog
      {...openOnly}
      message="Subscription completed successfully."
      outcome="success"
      primaryAction={{ label: "Start Trading", onAction: () => undefined }}
      secondaryAction={{ label: "Close", onAction: () => undefined }}
      title="Plan Subscribed"
      transaction={{
        href: "https://example.com/transaction",
        label: "View Transaction",
      }}
    />
  ),
};
export const OutcomeFailure: Story = {
  render: () => (
    <PaymentOutcomeDialog
      {...openOnly}
      message="Transaction wasn’t completed. A gas fee may still apply."
      outcome="failure"
      primaryAction={{ label: "Try Again", onAction: () => undefined }}
      secondaryAction={{ label: "Close", onAction: () => undefined }}
      title="Plan Subscription Failed"
    />
  ),
};
export const PlanActivated: Story = {
  render: () => (
    <PaymentPlanActivatedDialog
      {...openOnly}
      details={[
        { label: "Plan begins", value: "Jul 28, 2026" },
        { label: "Next renewal", value: "Aug 27, 2026" },
      ]}
      intro="Your path to funded trading starts now:"
      primaryAction={{ label: "Start Trading", onAction: () => undefined }}
      secondaryAction={{ label: "View Eligibility", onAction: () => undefined }}
      steps={[
        {
          description: "$50,000 simulated USD added to account",
          id: "subscribed",
          label: "Subscribed AceTrader",
          status: "complete",
        },
        {
          description: "Don't breach Max Loss Limit.",
          id: "eligibility",
          label: "Complete Eligibility Targets",
          status: "current",
        },
        { id: "graduate", label: "Graduate to Trade Fund", status: "upcoming" },
      ]}
      title="Evaluation Activated 🎉"
    />
  ),
};
