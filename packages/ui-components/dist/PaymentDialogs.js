import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useRef } from "react";
import { Button } from "./Button.js";
import { Skeleton } from "./Skeleton.js";
function getFocusable(container) {
    return Array.from(container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute("aria-hidden"));
}
/** A controlled, app-neutral modal with local focus containment. */
export function PaymentDialog({ open, onOpenChange, children, title, description, dismissible = true, footer, className, }) {
    const dialogRef = useRef(null);
    const previousFocus = useRef(null);
    const titleId = useId();
    const descriptionId = useId();
    useEffect(() => {
        if (!open)
            return;
        previousFocus.current = document.activeElement;
        const timer = window.setTimeout(() => {
            getFocusable(dialogRef.current ?? document.body)[0]?.focus();
        }, 0);
        return () => {
            window.clearTimeout(timer);
            previousFocus.current?.focus();
        };
    }, [open]);
    if (!open)
        return null;
    return (_jsxs("div", { className: "at-payment-dialog-backdrop", children: [dismissible && (_jsx("button", { "aria-label": "Close dialog", className: "at-payment-dialog-backdrop__dismiss", onClick: () => onOpenChange(false), type: "button" })), _jsxs("div", { "aria-describedby": description ? descriptionId : undefined, "aria-labelledby": title ? titleId : undefined, "aria-modal": "true", className: ["at-payment-dialog", className].filter(Boolean).join(" "), onKeyDown: (event) => {
                    if (event.key === "Escape" && dismissible)
                        onOpenChange(false);
                    if (event.key !== "Tab" || !dialogRef.current)
                        return;
                    const focusable = getFocusable(dialogRef.current);
                    if (!focusable.length)
                        return;
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (event.shiftKey && document.activeElement === first) {
                        event.preventDefault();
                        last.focus();
                    }
                    else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first.focus();
                    }
                }, ref: dialogRef, role: "dialog", children: [(title || dismissible) && (_jsxs("header", { className: "at-payment-dialog__header", children: [title && _jsx("h2", { id: titleId, children: title }), dismissible && (_jsx("button", { "aria-label": "Close dialog", className: "at-payment-dialog__close", onClick: () => onOpenChange(false), type: "button", children: "\u00D7" }))] })), description && (_jsx("p", { className: "at-payment-dialog__description", id: descriptionId, children: description })), _jsx("div", { className: "at-payment-dialog__body", children: children }), footer && (_jsx("footer", { className: "at-payment-dialog__footer", children: footer }))] })] }));
}
export function PaymentPriceSummary({ state }) {
    return (_jsx("section", { className: "at-payment-price-summary", "aria-live": "polite", children: state.status === "loading" ? (_jsx(Skeleton, { className: "at-payment-price-summary__skeleton", shape: "line" })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "at-payment-price-summary__amount", children: [state.amount, " ", _jsx("span", { children: state.currency }), state.cycleLabel && _jsx("small", { children: state.cycleLabel })] }), state.supportingText && (_jsxs("p", { children: [state.supportingText, state.tooltip && (_jsx("span", { className: "at-payment-price-summary__tooltip", title: typeof state.tooltip === "string"
                                ? state.tooltip
                                : undefined, children: state.tooltip }))] }))] })) }));
}
export function PaymentPromoCodeField({ state }) {
    if (state.status === "applied")
        return (_jsxs("div", { className: "at-payment-promo", "data-state": "applied", children: [_jsxs("span", { children: [state.code, " applied"] }), _jsx("strong", { children: state.savingsLabel }), _jsx("button", { disabled: state.disabled, onClick: state.onRemove, type: "button", children: state.removeLabel ?? "Remove" })] }));
    const invalid = Boolean(state.error);
    return (_jsxs("div", { className: "at-payment-promo", "data-state": "entry", children: [_jsxs("div", { children: [_jsx("input", { "aria-invalid": invalid || undefined, "aria-label": "Promo code", disabled: state.disabled || state.applying, onChange: (event) => state.onValueChange(event.target.value), onKeyDown: (event) => {
                            if (event.key === "Enter" && state.value.trim())
                                state.onApply();
                        }, placeholder: state.placeholder ?? "Promo code", value: state.value }), _jsx(Button, { disabled: state.disabled || state.applying || !state.value.trim(), onClick: state.onApply, size: "small", variant: "secondary", children: state.applying ? "Applying…" : (state.applyLabel ?? "Apply") })] }), state.error && _jsx("p", { role: "alert", children: state.error })] }));
}
export function PaymentDetailsList({ details }) {
    return (_jsx("dl", { className: "at-payment-details-list", children: details.map((detail) => (_jsxs("div", { "data-tone": detail.tone ?? "default", children: [_jsx("dt", { children: detail.label }), _jsxs("dd", { children: [detail.loading ? (_jsx(Skeleton, { shape: "text" })) : (_jsxs(_Fragment, { children: [detail.leadingVisual, detail.value] })), detail.helpText && _jsx("small", { children: detail.helpText })] })] }, detail.id ?? String(detail.label)))) }));
}
export function PaymentTermsNotice({ children }) {
    return _jsx("p", { className: "at-payment-terms", children: children });
}
export function PaymentTimeline({ steps }) {
    return (_jsx("ol", { className: "at-payment-timeline", children: steps.map((step) => (_jsxs("li", { "data-status": step.status, children: [_jsx("span", { "aria-hidden": "true", children: step.status === "complete"
                        ? "✓"
                        : step.status === "current"
                            ? "•"
                            : "○" }), _jsxs("div", { children: [_jsx("strong", { children: step.label }), step.description && _jsx("p", { children: step.description })] })] }, step.id))) }));
}
export function CryptoPaymentCheckoutDialog({ tokens, selectedToken, onTokenChange, price, details, promo, primaryAction, termsNotice, ...dialog }) {
    return (_jsx(PaymentDialog, { ...dialog, footer: _jsxs("div", { className: "at-payment-footer-stack", children: [_jsx(PaymentActionButton, { action: primaryAction }), termsNotice && (_jsx(PaymentTermsNotice, { children: termsNotice }))] }), children: _jsxs("div", { className: "at-payment-checkout", children: [tokens && (_jsx("div", { "aria-label": "Payment token", className: "at-payment-token-tabs", role: "tablist", children: tokens.map((token) => (_jsxs("button", { "aria-label": token.ariaLabel, "aria-selected": token.id === selectedToken, disabled: token.disabled, onClick: () => onTokenChange?.(token.id), role: "tab", type: "button", children: [token.icon, token.label] }, token.id))) })), _jsx(PaymentPriceSummary, { state: price }), _jsx(PaymentDetailsList, { details: details }), promo && _jsx(PaymentPromoCodeField, { state: promo })] }) }));
}
export function FiatPaymentCheckoutDialog({ introduction, price, promo, primaryAction, termsNotice, ...dialog }) {
    return (_jsx(PaymentDialog, { ...dialog, footer: _jsxs("div", { className: "at-payment-footer-stack", children: [_jsx(PaymentActionButton, { action: primaryAction }), termsNotice && (_jsx(PaymentTermsNotice, { children: termsNotice }))] }), children: _jsxs("div", { className: "at-payment-checkout", children: [introduction && (_jsx("p", { className: "at-payment-checkout__introduction", children: introduction })), _jsx(PaymentPriceSummary, { state: price }), promo && _jsx(PaymentPromoCodeField, { state: promo })] }) }));
}
function PaymentActionButton({ action }) {
    return (_jsxs(Button, { disabled: action.disabled || action.loading, onClick: action.onAction, variant: action.variant === "secondary" ? "secondary" : "primary", children: [action.leadingVisual, action.loading ? "Loading…" : action.label] }));
}
export function CryptoPaymentConfirmationDialog({ summary, steps, ...dialog }) {
    return (_jsx(PaymentDialog, { ...dialog, children: _jsxs("div", { className: "at-payment-confirmation", children: [_jsxs("div", { className: "at-payment-confirmation__summary", children: [summary.icon, _jsx("span", { children: summary.label }), _jsx("strong", { children: summary.amount })] }), _jsx("p", { children: "Confirm in your wallet to continue:" }), _jsx(PaymentTimeline, { steps: steps })] }) }));
}
export function PaymentProcessingDialog({ message, progressLabel = "Processing", ...dialog }) {
    return (_jsx(PaymentDialog, { ...dialog, dismissible: false, children: _jsxs("div", { className: "at-payment-processing", children: [_jsx("span", { "aria-hidden": "true", className: "at-payment-processing__spinner" }), _jsx("h3", { children: progressLabel }), _jsx("p", { children: message })] }) }));
}
export function PaymentOutcomeDialog({ outcome, message, transaction, primaryAction, secondaryAction, ...dialog }) {
    return (_jsx(PaymentDialog, { ...dialog, footer: (primaryAction || secondaryAction) && (_jsxs("div", { className: "at-payment-action-row", children: [secondaryAction && (_jsx(PaymentActionButton, { action: { ...secondaryAction, variant: "secondary" } })), primaryAction && _jsx(PaymentActionButton, { action: primaryAction })] })), children: _jsxs("div", { className: "at-payment-outcome", "data-outcome": outcome, children: [_jsx("span", { "aria-hidden": "true", children: outcome === "success" ? "✓" : "!" }), _jsx("p", { children: message }), transaction && (_jsx("a", { href: transaction.href, rel: "noreferrer", target: "_blank", children: transaction.label }))] }) }));
}
export function PaymentPlanActivatedDialog({ intro, steps, details, transaction, primaryAction, secondaryAction, ...dialog }) {
    return (_jsx(PaymentDialog, { ...dialog, footer: _jsxs("div", { className: "at-payment-action-row", children: [secondaryAction && (_jsx(PaymentActionButton, { action: { ...secondaryAction, variant: "secondary" } })), _jsx(PaymentActionButton, { action: primaryAction })] }), children: _jsxs("div", { className: "at-payment-activated", children: [intro && _jsx("p", { children: intro }), _jsx(PaymentTimeline, { steps: steps }), _jsx(PaymentDetailsList, { details: details }), transaction && (_jsx("a", { href: transaction.href, rel: "noreferrer", target: "_blank", children: transaction.label }))] }) }));
}
