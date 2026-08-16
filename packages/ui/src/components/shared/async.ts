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

export type { AsyncAction, AsyncState };
