import { type ReactNode, useEffect, useId, useRef } from "react";

import { Button } from "./Button.js";
import { Skeleton } from "./Skeleton.js";

export type PaymentAction = {
	label: string;
	onAction: () => void;
	variant?: "primary" | "secondary";
	disabled?: boolean;
	loading?: boolean;
	leadingVisual?: ReactNode;
};

export type PaymentDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	dismissible?: boolean;
	footer?: ReactNode;
	className?: string;
};

function getFocusable(container: HTMLElement) {
	return Array.from(
		container.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
		),
	).filter((element) => !element.hasAttribute("aria-hidden"));
}

/** A controlled, app-neutral modal with local focus containment. */
export function PaymentDialog({
	open,
	onOpenChange,
	children,
	title,
	description,
	dismissible = true,
	footer,
	className,
}: PaymentDialogProps) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const previousFocus = useRef<HTMLElement | null>(null);
	const titleId = useId();
	const descriptionId = useId();

	useEffect(() => {
		if (!open) return;
		previousFocus.current = document.activeElement as HTMLElement | null;
		const timer = window.setTimeout(() => {
			getFocusable(dialogRef.current ?? document.body)[0]?.focus();
		}, 0);
		return () => {
			window.clearTimeout(timer);
			previousFocus.current?.focus();
		};
	}, [open]);

	if (!open) return null;
	return (
		<div className="at-payment-dialog-backdrop">
			{dismissible && (
				<button
					aria-label="Close dialog"
					className="at-payment-dialog-backdrop__dismiss"
					onClick={() => onOpenChange(false)}
					type="button"
				/>
			)}
			<div
				aria-describedby={description ? descriptionId : undefined}
				aria-labelledby={title ? titleId : undefined}
				aria-modal="true"
				className={["at-payment-dialog", className].filter(Boolean).join(" ")}
				onKeyDown={(event) => {
					if (event.key === "Escape" && dismissible) onOpenChange(false);
					if (event.key !== "Tab" || !dialogRef.current) return;
					const focusable = getFocusable(dialogRef.current);
					if (!focusable.length) return;
					const first = focusable[0];
					const last = focusable[focusable.length - 1];
					if (event.shiftKey && document.activeElement === first) {
						event.preventDefault();
						last.focus();
					} else if (!event.shiftKey && document.activeElement === last) {
						event.preventDefault();
						first.focus();
					}
				}}
				ref={dialogRef}
				role="dialog"
			>
				{(title || dismissible) && (
					<header className="at-payment-dialog__header">
						{title && <h2 id={titleId}>{title}</h2>}
						{dismissible && (
							<button
								aria-label="Close dialog"
								className="at-payment-dialog__close"
								onClick={() => onOpenChange(false)}
								type="button"
							>
								×
							</button>
						)}
					</header>
				)}
				{description && (
					<p className="at-payment-dialog__description" id={descriptionId}>
						{description}
					</p>
				)}
				<div className="at-payment-dialog__body">{children}</div>
				{footer && (
					<footer className="at-payment-dialog__footer">{footer}</footer>
				)}
			</div>
		</div>
	);
}

export type PaymentPriceState =
	| { status: "loading" }
	| {
			status: "ready";
			amount: string;
			currency: string;
			cycleLabel?: string;
			supportingText?: string;
			tooltip?: ReactNode;
	  };

export type PaymentPriceSummaryProps = { state: PaymentPriceState };

export function PaymentPriceSummary({ state }: PaymentPriceSummaryProps) {
	return (
		<section className="at-payment-price-summary" aria-live="polite">
			{state.status === "loading" ? (
				<Skeleton className="at-payment-price-summary__skeleton" shape="line" />
			) : (
				<>
					<div className="at-payment-price-summary__amount">
						{state.amount} <span>{state.currency}</span>
						{state.cycleLabel && <small>{state.cycleLabel}</small>}
					</div>
					{state.supportingText && (
						<p>
							{state.supportingText}
							{state.tooltip && (
								<span
									className="at-payment-price-summary__tooltip"
									title={
										typeof state.tooltip === "string"
											? state.tooltip
											: undefined
									}
								>
									{state.tooltip}
								</span>
							)}
						</p>
					)}
				</>
			)}
		</section>
	);
}

export type PaymentPromoCodeState =
	| {
			status: "entry";
			value: string;
			onValueChange: (value: string) => void;
			onApply: () => void;
			applying?: boolean;
			disabled?: boolean;
			error?: string;
			applyLabel?: string;
			placeholder?: string;
	  }
	| {
			status: "applied";
			code: string;
			savingsLabel: string;
			onRemove: () => void;
			disabled?: boolean;
			removeLabel?: string;
	  };

export type PaymentPromoCodeFieldProps = { state: PaymentPromoCodeState };

export function PaymentPromoCodeField({ state }: PaymentPromoCodeFieldProps) {
	if (state.status === "applied")
		return (
			<div className="at-payment-promo" data-state="applied">
				<span>{state.code} applied</span>
				<strong>{state.savingsLabel}</strong>
				<button
					disabled={state.disabled}
					onClick={state.onRemove}
					type="button"
				>
					{state.removeLabel ?? "Remove"}
				</button>
			</div>
		);
	const invalid = Boolean(state.error);
	return (
		<div className="at-payment-promo" data-state="entry">
			<div>
				<input
					aria-invalid={invalid || undefined}
					aria-label="Promo code"
					disabled={state.disabled || state.applying}
					onChange={(event) => state.onValueChange(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && state.value.trim()) state.onApply();
					}}
					placeholder={state.placeholder ?? "Promo code"}
					value={state.value}
				/>
				<Button
					disabled={state.disabled || state.applying || !state.value.trim()}
					onClick={state.onApply}
					size="small"
					variant="secondary"
				>
					{state.applying ? "Applying…" : (state.applyLabel ?? "Apply")}
				</Button>
			</div>
			{state.error && <p role="alert">{state.error}</p>}
		</div>
	);
}

export type PaymentDetail = {
	id?: string;
	label: ReactNode;
	value?: ReactNode;
	leadingVisual?: ReactNode;
	tone?: "default" | "success" | "warning" | "error";
	loading?: boolean;
	helpText?: ReactNode;
};
export type PaymentDetailsListProps = { details: readonly PaymentDetail[] };
export function PaymentDetailsList({ details }: PaymentDetailsListProps) {
	return (
		<dl className="at-payment-details-list">
			{details.map((detail) => (
				<div
					data-tone={detail.tone ?? "default"}
					key={detail.id ?? String(detail.label)}
				>
					<dt>{detail.label}</dt>
					<dd>
						{detail.loading ? (
							<Skeleton shape="text" />
						) : (
							<>
								{detail.leadingVisual}
								{detail.value}
							</>
						)}
						{detail.helpText && <small>{detail.helpText}</small>}
					</dd>
				</div>
			))}
		</dl>
	);
}

export type PaymentTermsNoticeProps = { children: ReactNode };
export function PaymentTermsNotice({ children }: PaymentTermsNoticeProps) {
	return <p className="at-payment-terms">{children}</p>;
}

export type PaymentTimelineStep = {
	id: string;
	label: ReactNode;
	description?: ReactNode;
	status: "complete" | "current" | "upcoming";
};
export type PaymentTimelineProps = { steps: readonly PaymentTimelineStep[] };
export function PaymentTimeline({ steps }: PaymentTimelineProps) {
	return (
		<ol className="at-payment-timeline">
			{steps.map((step) => (
				<li data-status={step.status} key={step.id}>
					<span aria-hidden="true">
						{step.status === "complete"
							? "✓"
							: step.status === "current"
								? "•"
								: "○"}
					</span>
					<div>
						<strong>{step.label}</strong>
						{step.description && <p>{step.description}</p>}
					</div>
				</li>
			))}
		</ol>
	);
}

export type PaymentTokenOption<Id extends string> = {
	id: Id;
	label: ReactNode;
	icon?: ReactNode;
	disabled?: boolean;
	ariaLabel?: string;
};
export type CryptoPaymentCheckoutDialogProps<TokenId extends string> = Omit<
	PaymentDialogProps,
	"children" | "footer"
> & {
	tokens?: readonly PaymentTokenOption<TokenId>[];
	selectedToken?: TokenId;
	onTokenChange?: (token: TokenId) => void;
	price: PaymentPriceState;
	details: readonly PaymentDetail[];
	promo?: PaymentPromoCodeState;
	primaryAction: PaymentAction;
	termsNotice?: ReactNode;
};
export function CryptoPaymentCheckoutDialog<TokenId extends string>({
	tokens,
	selectedToken,
	onTokenChange,
	price,
	details,
	promo,
	primaryAction,
	termsNotice,
	...dialog
}: CryptoPaymentCheckoutDialogProps<TokenId>) {
	return (
		<PaymentDialog
			{...dialog}
			footer={
				<div className="at-payment-footer-stack">
					<PaymentActionButton action={primaryAction} />
					{termsNotice && (
						<PaymentTermsNotice>{termsNotice}</PaymentTermsNotice>
					)}
				</div>
			}
		>
			<div className="at-payment-checkout">
				{tokens && (
					<div
						aria-label="Payment token"
						className="at-payment-token-tabs"
						role="tablist"
					>
						{tokens.map((token) => (
							<button
								aria-label={token.ariaLabel}
								aria-selected={token.id === selectedToken}
								disabled={token.disabled}
								key={token.id}
								onClick={() => onTokenChange?.(token.id)}
								role="tab"
								type="button"
							>
								{token.icon}
								{token.label}
							</button>
						))}
					</div>
				)}
				<PaymentPriceSummary state={price} />
				<PaymentDetailsList details={details} />
				{promo && <PaymentPromoCodeField state={promo} />}
			</div>
		</PaymentDialog>
	);
}

export type FiatPaymentCheckoutDialogProps = Omit<
	PaymentDialogProps,
	"children" | "footer"
> & {
	introduction?: ReactNode;
	price: PaymentPriceState;
	promo?: PaymentPromoCodeState;
	primaryAction: PaymentAction;
	termsNotice?: ReactNode;
};
export function FiatPaymentCheckoutDialog({
	introduction,
	price,
	promo,
	primaryAction,
	termsNotice,
	...dialog
}: FiatPaymentCheckoutDialogProps) {
	return (
		<PaymentDialog
			{...dialog}
			footer={
				<div className="at-payment-footer-stack">
					<PaymentActionButton action={primaryAction} />
					{termsNotice && (
						<PaymentTermsNotice>{termsNotice}</PaymentTermsNotice>
					)}
				</div>
			}
		>
			<div className="at-payment-checkout">
				{introduction && (
					<p className="at-payment-checkout__introduction">{introduction}</p>
				)}
				<PaymentPriceSummary state={price} />
				{promo && <PaymentPromoCodeField state={promo} />}
			</div>
		</PaymentDialog>
	);
}

function PaymentActionButton({ action }: { action: PaymentAction }) {
	return (
		<Button
			disabled={action.disabled || action.loading}
			onClick={action.onAction}
			variant={action.variant === "secondary" ? "secondary" : "primary"}
		>
			{action.leadingVisual}
			{action.loading ? "Loading…" : action.label}
		</Button>
	);
}

export type CryptoPaymentConfirmationDialogProps = Omit<
	PaymentDialogProps,
	"children"
> & {
	summary: { label: ReactNode; amount: ReactNode; icon?: ReactNode };
	steps: readonly PaymentTimelineStep[];
};
export function CryptoPaymentConfirmationDialog({
	summary,
	steps,
	...dialog
}: CryptoPaymentConfirmationDialogProps) {
	return (
		<PaymentDialog {...dialog}>
			<div className="at-payment-confirmation">
				<div className="at-payment-confirmation__summary">
					{summary.icon}
					<span>{summary.label}</span>
					<strong>{summary.amount}</strong>
				</div>
				<p>Confirm in your wallet to continue:</p>
				<PaymentTimeline steps={steps} />
			</div>
		</PaymentDialog>
	);
}

export type PaymentProcessingDialogProps = Omit<
	PaymentDialogProps,
	"children" | "dismissible"
> & { message: ReactNode; progressLabel?: string };
export function PaymentProcessingDialog({
	message,
	progressLabel = "Processing",
	...dialog
}: PaymentProcessingDialogProps) {
	return (
		<PaymentDialog {...dialog} dismissible={false}>
			<div className="at-payment-processing">
				<span aria-hidden="true" className="at-payment-processing__spinner" />
				<h3>{progressLabel}</h3>
				<p>{message}</p>
			</div>
		</PaymentDialog>
	);
}

export type PaymentOutcomeDialogProps = Omit<
	PaymentDialogProps,
	"children" | "footer"
> & {
	outcome: "success" | "failure";
	message: ReactNode;
	transaction?: { href: string; label: string };
	primaryAction?: PaymentAction;
	secondaryAction?: PaymentAction;
};
export function PaymentOutcomeDialog({
	outcome,
	message,
	transaction,
	primaryAction,
	secondaryAction,
	...dialog
}: PaymentOutcomeDialogProps) {
	return (
		<PaymentDialog
			{...dialog}
			footer={
				(primaryAction || secondaryAction) && (
					<div className="at-payment-action-row">
						{secondaryAction && (
							<PaymentActionButton
								action={{ ...secondaryAction, variant: "secondary" }}
							/>
						)}
						{primaryAction && <PaymentActionButton action={primaryAction} />}
					</div>
				)
			}
		>
			<div className="at-payment-outcome" data-outcome={outcome}>
				<span aria-hidden="true">{outcome === "success" ? "✓" : "!"}</span>
				<p>{message}</p>
				{transaction && (
					<a href={transaction.href} rel="noreferrer" target="_blank">
						{transaction.label}
					</a>
				)}
			</div>
		</PaymentDialog>
	);
}

export type PaymentPlanActivatedDialogProps = Omit<
	PaymentDialogProps,
	"children" | "footer"
> & {
	intro?: ReactNode;
	steps: readonly PaymentTimelineStep[];
	details: readonly PaymentDetail[];
	transaction?: { href: string; label: string };
	primaryAction: PaymentAction;
	secondaryAction?: PaymentAction;
};
export function PaymentPlanActivatedDialog({
	intro,
	steps,
	details,
	transaction,
	primaryAction,
	secondaryAction,
	...dialog
}: PaymentPlanActivatedDialogProps) {
	return (
		<PaymentDialog
			{...dialog}
			footer={
				<div className="at-payment-action-row">
					{secondaryAction && (
						<PaymentActionButton
							action={{ ...secondaryAction, variant: "secondary" }}
						/>
					)}
					<PaymentActionButton action={primaryAction} />
				</div>
			}
		>
			<div className="at-payment-activated">
				{intro && <p>{intro}</p>}
				<PaymentTimeline steps={steps} />
				<PaymentDetailsList details={details} />
				{transaction && (
					<a href={transaction.href} rel="noreferrer" target="_blank">
						{transaction.label}
					</a>
				)}
			</div>
		</PaymentDialog>
	);
}
