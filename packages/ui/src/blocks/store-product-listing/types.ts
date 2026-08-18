import type { ReactNode } from "react";
import type { AsyncAction, AsyncState } from "../shared/async";

/**
 * One product tile's content. Every value is display-ready: `price` is a
 * formatted string, not a number and a currency, because formatting needs
 * locale, currency display rules, and the store's rounding policy — three
 * things this package is forbidden to know.
 */
type ProductSummary = {
  id: string;
  name: ReactNode;
  /** Metadata badges such as collection, series, and region. */
  tags?: readonly ReactNode[];
  imageSrc?: string;
  imageAlt?: string;
  /** Current or discounted price, already formatted. */
  price: ReactNode;
  /** Strikethrough original price. Its presence shows the discount treatment. */
  originalPrice?: ReactNode;
  discountLabel?: ReactNode;
  soldOut?: boolean;
  /** Shows the quantity on the cart button. The consumer owns it. */
  addedToCart?: boolean;
  quantity?: number;
  actionLabel?: ReactNode;
  /** Accessible name for the tile when it is activatable. */
  ariaLabel?: string;
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
};

/**
 * Selected option IDs keyed by group ID. Keyed rather than flat so option IDs
 * only have to be unique within their own group, which keeps a namespacing
 * rule out of every consumer's adapter.
 */
type FilterSelection = Readonly<Record<string, readonly string[]>>;

type SortOption = {
  id: string;
  label: ReactNode;
  /** When this option is already selected, a further activation reports
   * `toggleId` instead of `id`. The header rotates `trailing` 180° while
   * `sortValue` equals `toggleId`. */
  toggleId?: string;
  trailing?: ReactNode;
};

/** One collection row in the sidebar menu. */
type CollectionOption = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
};

/** One utility link below the collection menu. */
type UtilityLink = {
  label: ReactNode;
  href: string;
};

export type {
  AsyncAction,
  AsyncState,
  CollectionOption,
  FilterGroup,
  FilterOption,
  FilterSelection,
  ProductSummary,
  SortOption,
  UtilityLink,
};
