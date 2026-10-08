import type { ReactNode } from "react";
import type { OrderDetailsPaymentBrand } from "../store-order-detail/types";

type AuctionOrderRowCopy = {
  viewLot: string;
  nextAction: string;
};

type AuctionOrderRowProps = {
  copy: AuctionOrderRowCopy;
  title: ReactNode;
  auction: ReactNode;
  winningBid: ReactNode;
  status: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  lotHref?: string;
  onViewLot?: () => void;
  onAction: () => void;
  className?: string;
};

type AuctionOrderEmptyProps = {
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

type AuctionOrderListProps = {
  items: readonly AuctionOrderRowProps[];
  empty: AuctionOrderEmptyProps;
  className?: string;
};

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
};

type AuctionWinnerOrderAction = { label: string; onPress: () => void };

/** A description keeps its line breaks and stacks under the title; `role` overrides the Alert's own. */
type AuctionWinnerOrderAlert = {
  title: string;
  description?: string;
  status: "default" | "warning" | "success" | "error";
  role?: "alert" | "status";
  action?: AuctionWinnerOrderAction;
};

/** A PDF the winner opens: a URL to follow, or a press the consumer handles. */
type AuctionWinnerOrderPdf = {
  href?: string;
  onOpen?: () => void;
  ariaLabel?: string;
};

type AuctionWinnerOrderLine = {
  label: string;
  value: string;
  muted?: boolean;
  tooltip?: string;
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
    total: Omit<AuctionWinnerOrderLine, "tooltip"> | null;
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
    confirm?: AuctionWinnerOrderAction & { deadline?: string };
  };
  billing?: { label: string; value: string };
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
  AuctionOrderEmptyProps,
  AuctionOrderListProps,
  AuctionOrderRowCopy,
  AuctionOrderRowProps,
  AuctionWinnerOrderAction,
  AuctionWinnerOrderAlert,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderLine,
  AuctionWinnerOrderPdf,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
};
