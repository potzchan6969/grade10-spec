/**
 * Shared column tracks so the header and every line keep one width per column.
 *
 * The design-system Table is flex-per-row, so an amount cell sized per row
 * would put each line's money at a different edge. One grid with subgrid rows
 * sizes every amount column to its widest value — Subtotal, Qty and Total are
 * `auto` tracks — and Items takes what is left, never below a readable width.
 *
 * A line rendered alone (outside the table) keeps the same template so it
 * still lays out; inside the table it switches to subgrid.
 */
const ORDER_TABLE_COLUMN_TRACKS =
  "grid-cols-[minmax(18rem,1fr)_auto_auto_auto]";

const ORDER_TABLE_LAYOUT = {
  table: `grid ${ORDER_TABLE_COLUMN_TRACKS}`,
  row: [
    "grid",
    ORDER_TABLE_COLUMN_TRACKS,
    "[[data-slot=order-details-order-table]_&]:col-span-full [[data-slot=order-details-order-table]_&]:grid-cols-subgrid",
  ].join(" "),
  body: "contents",
} as const;

export { ORDER_TABLE_LAYOUT };
