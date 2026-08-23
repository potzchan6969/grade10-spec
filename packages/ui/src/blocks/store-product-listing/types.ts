import type { ReactNode } from "react";
import type { AsyncAction, AsyncState } from "../shared/async";

/**
 * One product tile's content: what differs between one product and the next.
 * Every value is display-ready — `price` is a formatted string, not a number
 * and a currency, because formatting needs locale, currency display rules,
 * and the store's rounding policy, three things this package is forbidden to
 * know.
 *
 * What every tile says the same way — what the cart control is called, what a
 * sold-out or discounted product is badged with — is the list's copy, supplied
 * once rather than restated per product.
 */
type ProductSummary = {
  id: string;
  /** The product's own name, and the name a screen reader reads the tile as. */
  name: string;
  /** `cardProps` slot — consumer-assembled badges, in order. */
  badges?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** Current or discounted price, already formatted. */
  price: ReactNode;
  /** Strikethrough original price. Its presence shows the discount treatment. */
  originalPrice?: ReactNode;
  soldOut?: boolean;
  inCart?: boolean;
  cartCount?: ReactNode;
};

/**
 * One option within a filter group. `count` is display-ready for the same
 * reason a price is — a consumer wanting `1.2k` should not have to fight a
 * formatter here. Omit it and no count is rendered.
 */
type FilterOption = {
  id: string;
  label: ReactNode;
  count?: ReactNode;
  disabled?: boolean;
};

type FilterGroup = {
  id: string;
  label: ReactNode;
  options: readonly FilterOption[];
  /** Shown after the options. Omit it and no expand affordance is rendered. */
  expandLabel?: ReactNode;
};

/**
 * Selected option IDs keyed by group ID. Keyed rather than flat so option IDs
 * only have to be unique within their own group, which keeps a namespacing
 * rule out of every consumer's adapter.
 */
type FilterSelection = Readonly<Record<string, readonly string[]>>;

/** One chip in the list header's applied-filter bar. */
type AppliedFilter = {
  groupId: string;
  optionId: string;
  label: ReactNode;
};

type SortOption = {
  id: string;
  label: ReactNode;
};

/** One utility link below the product filter. */
type UtilityLink = {
  label: ReactNode;
  href: string;
};

export type {
  AppliedFilter,
  AsyncAction,
  AsyncState,
  FilterGroup,
  FilterOption,
  FilterSelection,
  ProductSummary,
  SortOption,
  UtilityLink,
};
