import {
	CryptoPaymentCheckoutDialog,
	CryptoPaymentConfirmationDialog,
	FiatPaymentCheckoutDialog,
	PaymentOutcomeDialog,
	PaymentPlanActivatedDialog,
	type PaymentPriceState,
	PaymentProcessingDialog,
} from "@acetrader/pred-spec-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const price: PaymentPriceState = {
	status: "ready",
	amount: "49.00",
	currency: "USDC",
	cycleLabel: "/ every 30 days",
	supportingText: "Subscription",
};
const openOnly = { onOpenChange: () => undefined, open: true };

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
			primaryAction={{ label: "Pay with Wallet", onAction: () => undefined }}
			promo={{
				onApply: () => undefined,
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
