/**
 * Shared column tracks so the header and every line keep one width per column.
 *
 * The design-system Table is flex-per-row, so an amount wider than the Figma
 * column would be clipped. One grid with subgrid rows keeps Figma's widths
 * (Subtotal 88px, Qty 56px, Total 83px) and, from `sm` up, lets an amount
 * column grow to its widest value; Items takes what is left. A phone keeps
 * the fixed widths until the designer settles its layout.
 *
 * A line rendered alone (outside the table) keeps the same template so it
 * still lays out; inside the table it switches to subgrid.
 */
const ORDER_TABLE_COLUMN_TRACKS = [
  "grid-cols-[minmax(0,1fr)_88px_56px_83px]",
  "sm:grid-cols-[minmax(0,1fr)_minmax(88px,max-content)_56px_minmax(83px,max-content)]",
].join(" ");

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
