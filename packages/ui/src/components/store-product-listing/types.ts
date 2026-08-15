import type { ReactNode } from "react";

/**
 * A visual boundary's async condition. Each region of a surface carries its
 * own, so a failed result set cannot erase a filter panel that resolved.
 *
 * `empty` and `error` each carry their own message and optional action because
 * the consumer — not this package — decides whether nothing matched a filter
 * or the catalog is genuinely empty, what to offer in each case, and what to
 * call it. Retry is an `action` rather than a bare callback for that last
 * reason: a bare callback would force a built-in English label.
 */
type AsyncAction = { label: ReactNode; onAction: () => void };

type AsyncState<T> =
  | { status: "loading" }
  | { status: "empty"; message: ReactNode; action?: AsyncAction }
  | { status: "error"; message: ReactNode; action?: AsyncAction }
  | { status: "ready"; data: T };

/**
 * One product tile's content. Every value is display-ready: `price` is a
 * formatted string, not a number and a currency, because formatting needs
 * locale, currency display rules, and the store's rounding policy — three
 * things this package is forbidden to know.
 */
type ProductSummary = {
  id: string;
  name: ReactNode;
  category: ReactNode;
  description?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** Current or discounted price, already formatted. */
  price: ReactNode;
  /** Strikethrough original price. Its presence shows the discount treatment. */
  originalPrice?: ReactNode;
  discountLabel?: ReactNode;
  soldOut?: boolean;
  /** Swaps the add action for a quantity stepper. The consumer owns it. */
  addedToCart?: boolean;
  quantity?: number;
  actionLabel?: ReactNode;
  /** Accessible name for the tile when it is activatable. */
  ariaLabel?: string;
  wishlistLabel?: string;
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

type SortOption = { id: string; label: ReactNode };

export type {
  AsyncAction,
  AsyncState,
  FilterGroup,
  FilterOption,
  FilterSelection,
  ProductSummary,
  SortOption,
};
