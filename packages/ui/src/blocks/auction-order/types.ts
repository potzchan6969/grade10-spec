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
  };
  className?: string;
};

type AuctionAddressFormValues = {
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
};

type AuctionAddressFormCopy = {
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
};

type AuctionAddressFormProps = {
  copy: AuctionAddressFormCopy;
  initialValues?: Partial<AuctionAddressFormValues>;
  errors?: Partial<Record<keyof AuctionAddressFormValues, ReactNode>>;
  pending?: boolean;
  onConfirm: (values: AuctionAddressFormValues) => void;
  onCancel: () => void;
  className?: string;
};

export type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
  AuctionAddressFormValues,
  AuctionOrderDetailCopy,
  AuctionOrderDetailProps,
  AuctionOrderEmptyProps,
  AuctionOrderListProps,
  AuctionOrderRowCopy,
  AuctionOrderRowProps,
};
