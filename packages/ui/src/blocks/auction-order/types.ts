import type { ReactNode } from "react";

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

type AuctionOrderDetailCopy = {
  orderInformation: string;
  collectionMethod: string;
  orderStatus: string;
  lots: string;
  orderNumber: string;
  auction: string;
  currency: string;
  date: string;
  invoiceStatus: string;
  winningBid: string;
  payNow: string;
  contactUs: string;
};

type AuctionOrderDetailProps = {
  copy: AuctionOrderDetailCopy;
  orderNumber: ReactNode;
  auction: ReactNode;
  currency: ReactNode;
  date: ReactNode;
  orderStatus: ReactNode;
  invoiceStatus: ReactNode;
  collectionMethod?: ReactNode;
  statusTimeline: readonly {
    status: ReactNode;
    reachedAt: ReactNode;
  }[];
  /** Optional consumer-owned status or guidance card shown beside the order. */
  notice?: ReactNode;
  lot: {
    title: ReactNode;
    winningBid: ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    onViewLot?: () => void;
  };
  invoice?: {
    lines: readonly { label: ReactNode; value: ReactNode }[];
    onPayNow?: () => void;
    onContact?: () => void;
  };
  className?: string;
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
  AuctionOrderDetailCopy,
  AuctionOrderDetailProps,
  AuctionOrderEmptyProps,
  AuctionOrderListProps,
  AuctionOrderRowCopy,
  AuctionOrderRowProps,
};
