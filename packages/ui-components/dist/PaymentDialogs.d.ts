import { type ReactNode } from "react";
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
/** A controlled, app-neutral modal with local focus containment. */
export declare function PaymentDialog({ open, onOpenChange, children, title, description, dismissible, footer, className, }: PaymentDialogProps): import("react").JSX.Element | null;
export type PaymentPriceState = {
    status: "loading";
} | {
    status: "ready";
    amount: string;
    currency: string;
    cycleLabel?: string;
    supportingText?: string;
    tooltip?: ReactNode;
};
export type PaymentPriceSummaryProps = {
    state: PaymentPriceState;
};
export declare function PaymentPriceSummary({ state }: PaymentPriceSummaryProps): import("react").JSX.Element;
export type PaymentPromoCodeState = {
    status: "entry";
    value: string;
    onValueChange: (value: string) => void;
    onApply: () => void;
    applying?: boolean;
    disabled?: boolean;
    error?: string;
    applyLabel?: string;
    placeholder?: string;
} | {
    status: "applied";
    code: string;
    savingsLabel: string;
    onRemove: () => void;
    disabled?: boolean;
    removeLabel?: string;
};
export type PaymentPromoCodeFieldProps = {
    state: PaymentPromoCodeState;
};
export declare function PaymentPromoCodeField({ state }: PaymentPromoCodeFieldProps): import("react").JSX.Element;
export type PaymentDetail = {
    id?: string;
    label: ReactNode;
    value?: ReactNode;
    leadingVisual?: ReactNode;
    tone?: "default" | "success" | "warning" | "error";
    loading?: boolean;
    helpText?: ReactNode;
};
export type PaymentDetailsListProps = {
    details: readonly PaymentDetail[];
};
export declare function PaymentDetailsList({ details }: PaymentDetailsListProps): import("react").JSX.Element;
export type PaymentTermsNoticeProps = {
    children: ReactNode;
};
export declare function PaymentTermsNotice({ children }: PaymentTermsNoticeProps): import("react").JSX.Element;
export type PaymentTimelineStep = {
    id: string;
    label: ReactNode;
    description?: ReactNode;
    status: "complete" | "current" | "upcoming";
};
export type PaymentTimelineProps = {
    steps: readonly PaymentTimelineStep[];
};
export declare function PaymentTimeline({ steps }: PaymentTimelineProps): import("react").JSX.Element;
export type PaymentTokenOption<Id extends string> = {
    id: Id;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    ariaLabel?: string;
};
export type CryptoPaymentCheckoutDialogProps<TokenId extends string> = Omit<PaymentDialogProps, "children" | "footer"> & {
    tokens?: readonly PaymentTokenOption<TokenId>[];
    selectedToken?: TokenId;
    onTokenChange?: (token: TokenId) => void;
    price: PaymentPriceState;
    details: readonly PaymentDetail[];
    promo?: PaymentPromoCodeState;
    primaryAction: PaymentAction;
    termsNotice?: ReactNode;
};
export declare function CryptoPaymentCheckoutDialog<TokenId extends string>({ tokens, selectedToken, onTokenChange, price, details, promo, primaryAction, termsNotice, ...dialog }: CryptoPaymentCheckoutDialogProps<TokenId>): import("react").JSX.Element;
export type FiatPaymentCheckoutDialogProps = Omit<PaymentDialogProps, "children" | "footer"> & {
    introduction?: ReactNode;
    price: PaymentPriceState;
    promo?: PaymentPromoCodeState;
    primaryAction: PaymentAction;
    termsNotice?: ReactNode;
};
export declare function FiatPaymentCheckoutDialog({ introduction, price, promo, primaryAction, termsNotice, ...dialog }: FiatPaymentCheckoutDialogProps): import("react").JSX.Element;
export type CryptoPaymentConfirmationDialogProps = Omit<PaymentDialogProps, "children"> & {
    summary: {
        label: ReactNode;
        amount: ReactNode;
        icon?: ReactNode;
    };
    steps: readonly PaymentTimelineStep[];
};
export declare function CryptoPaymentConfirmationDialog({ summary, steps, ...dialog }: CryptoPaymentConfirmationDialogProps): import("react").JSX.Element;
export type PaymentProcessingDialogProps = Omit<PaymentDialogProps, "children" | "dismissible"> & {
    message: ReactNode;
    progressLabel?: string;
};
export declare function PaymentProcessingDialog({ message, progressLabel, ...dialog }: PaymentProcessingDialogProps): import("react").JSX.Element;
export type PaymentOutcomeDialogProps = Omit<PaymentDialogProps, "children" | "footer"> & {
    outcome: "success" | "failure";
    message: ReactNode;
    transaction?: {
        href: string;
        label: string;
    };
    primaryAction?: PaymentAction;
    secondaryAction?: PaymentAction;
};
export declare function PaymentOutcomeDialog({ outcome, message, transaction, primaryAction, secondaryAction, ...dialog }: PaymentOutcomeDialogProps): import("react").JSX.Element;
export type PaymentPlanActivatedDialogProps = Omit<PaymentDialogProps, "children" | "footer"> & {
    intro?: ReactNode;
    steps: readonly PaymentTimelineStep[];
    details: readonly PaymentDetail[];
    transaction?: {
        href: string;
        label: string;
    };
    primaryAction: PaymentAction;
    secondaryAction?: PaymentAction;
};
export declare function PaymentPlanActivatedDialog({ intro, steps, details, transaction, primaryAction, secondaryAction, ...dialog }: PaymentPlanActivatedDialogProps): import("react").JSX.Element;
//# sourceMappingURL=PaymentDialogs.d.ts.map