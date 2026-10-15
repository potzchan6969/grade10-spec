import type { ReactNode } from "react";
import type { OrderDetailsPaymentBrand } from "../store-order-detail/types";

type AuctionWinnerOrderStep =
  | "address"
  | "invoice"
  | "payment"
  | "shipping"
  | "completed";

type AuctionWinnerOrderCopy = {
  orderProgress: string;
  orderSummary: string;
  invoice: string;
  invoicePdf: string;
  paymentMethod: string;
  view: string;
  winningBid: string;
  bank: string;
  bankDetailsClose: string;
  bankDetailsQrAlt: string;
};

/** `pending` draws the press busy; `failed` is the refusal shown beside it. */
type AuctionWinnerOrderAction = {
  label: string;
  onPress: () => void;
  pending?: boolean;
  failed?: string;
};

/** A description keeps its line breaks and stacks under the title; `role` overrides the Alert's own. */
type AuctionWinnerOrderAlert = {
  title: string;
  description?: string;
  /** Inline folds a description into the title row; omit and a description forces block. */
  layout?: "block" | "inline";
  status: "default" | "warning" | "success" | "error";
  role?: "alert" | "status";
  action?: AuctionWinnerOrderAction;
};

/**
 * A PDF the winner opens: a URL to follow, or a press the consumer handles.
 * `pending` draws the link busy — spinner for the PDF icon, presses swallowed;
 * `failed` toasts once per value.
 */
type AuctionWinnerOrderPdf = {
  href?: string;
  onOpen?: () => void;
  ariaLabel?: string;
  pending?: boolean;
  failed?: string;
};

type AuctionWinnerOrderLine = {
  label: string;
  value: string;
  muted?: boolean;
  tooltip?: string;
  /** Under the value, muted: the quoted amount in the other currency. */
  subtext?: string;
};

type AuctionSettlementCurrency = "USD" | "HKD";

type AuctionPaymentRail = "fps" | "hk_local" | "swift";

type AuctionWinnerOrderPaymentChoice = {
  value: "card" | AuctionPaymentRail;
  label: string;
  feeRange: string;
  unavailable?: string;
};

type AuctionWinnerOrderBankDetails = {
  rail: AuctionPaymentRail;
  title: string;
  rows: readonly { label: string; value: string }[];
  qrSrc?: string;
  note?: string;
};

type AuctionWinnerOrderProps = {
  copy: AuctionWinnerOrderCopy;
  title: string;
  badge: {
    label: string;
    variant: "default" | "warning" | "error" | "outline";
  };
  /** Null for an order with no progress, such as Cancelled or Refunded. */
  progress: {
    current: AuctionWinnerOrderStep | "done";
    steps: Record<
      AuctionWinnerOrderStep,
      { label: string; description?: string }
    >;
    tracking?: { code: string; href?: string };
  } | null;
  /** The one alert under progress on a phone and under the lot from `lg`. */
  note?: { title: string; icon?: "hourglass" };
  lot: {
    title: string;
    winningBid: string;
    imageSrc?: string;
    href?: string;
    onOpen?: () => void;
    ariaLabel: string;
  };
  /** Under the lot, in order. */
  alerts?: readonly AuctionWinnerOrderAlert[];
  summary: {
    lines: readonly AuctionWinnerOrderLine[];
    /** Swaps the summary between each row's `value` and its `subtext` behind a two-option control labelled `primary`/`secondary`; without it, a `subtext` renders under its value. */
    currencyToggle?: { primary: string; secondary: string; ariaLabel?: string };
    total: Omit<AuctionWinnerOrderLine, "tooltip"> | null;
    convertedTotal?: Omit<AuctionWinnerOrderLine, "tooltip">;
    convertedFee?: Omit<AuctionWinnerOrderLine, "tooltip">;
    invoicePdf?: AuctionWinnerOrderPdf;
    refund?: { title: string; onView?: () => void };
    alert?: AuctionWinnerOrderAlert;
    /** `loading` spins the primary and disables both; `disabled` only disables. */
    pay?: AuctionWinnerOrderAction & {
      loading?: boolean;
      disabled?: boolean;
      secondary?: AuctionWinnerOrderAction;
      deadline?: string;
    };
  };
  paymentMethod?:
    | { kind: "card"; brand: OrderDetailsPaymentBrand; masked?: string }
    | { kind: "bank"; label: string; bankName?: string }
    | { kind: "text"; label: string };
  receipts?: readonly (AuctionWinnerOrderPdf & { label: string })[];
  /** Omitted where the order shows no address, such as Cancelled. */
  delivery?: {
    label: string;
    value?: string;
    alert?: AuctionWinnerOrderAlert;
    /** `failed` toasts once per value, like the PDF links. */
    confirm?: AuctionWinnerOrderAction & { deadline?: string };
  };
  billing?: { label: string; value: string };
  settlementCurrency?: {
    label: string;
    options: readonly {
      value: AuctionSettlementCurrency;
      label: string;
    }[];
    value: AuctionSettlementCurrency | null;
    onChange: (value: AuctionSettlementCurrency) => void;
  };
  paymentChoices?: {
    label: string;
    byCurrency: Record<
      AuctionSettlementCurrency,
      readonly AuctionWinnerOrderPaymentChoice[]
    >;
    value: AuctionWinnerOrderPaymentChoice["value"] | null;
    onChange: (value: AuctionWinnerOrderPaymentChoice["value"]) => void;
    none?: string;
  };
  bankDetails?: AuctionWinnerOrderBankDetails;
};

type AuctionAddressKind = "personal" | "company";

type AuctionAddressFormValues = {
  addressKind: AuctionAddressKind;
  firstName: string;
  lastName: string;
  phone: string;
  /** Calling country for the phone field — soft readiness. */
  phoneCountry: string;
  company: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  apartment: string;
  state: string;
  postalCode: string;
};

type AuctionAddressFormCopy = {
  personal: string;
  companyKind: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  apartment: string;
  state: string;
  postalCode: string;
  optional: string;
  confirm: string;
  cancel: string;
  phonePlaceholder?: string;
  countrySearchPlaceholder?: string;
};

type AuctionAddressFormProps = {
  copy: AuctionAddressFormCopy;
  initialValues?: Partial<AuctionAddressFormValues>;
  errors?: Partial<Record<keyof AuctionAddressFormValues, ReactNode>>;
  pending?: boolean;
  /** A refused confirm, shown above the actions. */
  failed?: string;
  onConfirm: (values: AuctionAddressFormValues) => void;
  onCancel: () => void;
  className?: string;
  /** When false, Confirm / Cancel are omitted — parent supplies actions. */
  showActions?: boolean;
  /** Form element id for an external submit button's `form` attribute. */
  formId?: string;
  /** Replace the country TextInput (e.g. setup's Country/Region Select). */
  renderCountry?: (args: {
    value: string;
    onChange: (value: string) => void;
    error?: ReactNode;
    required: boolean;
    label: ReactNode;
  }) => ReactNode;
};

export type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
  AuctionAddressFormValues,
  AuctionAddressKind,
  AuctionPaymentRail,
  AuctionSettlementCurrency,
  AuctionWinnerOrderAction,
  AuctionWinnerOrderAlert,
  AuctionWinnerOrderBankDetails,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderLine,
  AuctionWinnerOrderPaymentChoice,
  AuctionWinnerOrderPdf,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
};
