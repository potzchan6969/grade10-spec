/**
 * Shared column classes so header and body stay aligned.
 *
 * The design-system Table is flex-per-row, so true content auto-sizing needs
 * one shared CSS grid + subgrid rows (see `AUCTION_RECORD_TABLE_LAYOUT`).
 * Auction takes leftover space with a readable floor; bid, standing, alerts,
 * and actions shrink to the widest cell in that column.
 *
 * `w-max min-w-full` lets the table grow past the viewport on small screens so
 * the page scrollport can pan horizontally instead of collapsing Auction to 0.
 *
 * A row rendered alone (outside `AuctionRecord`) keeps the same five-track
 * template so it still lays out; inside the table it switches to subgrid so
 * max-content widths stay aligned across header and every body row.
 */
const AUCTION_RECORD_COLUMN_TRACKS =
  // 11rem ≈ thumb + gap + a short title before the fr track may grow.
  "grid-cols-[minmax(11rem,1fr)_max-content_max-content_max-content_max-content]";

const AUCTION_RECORD_TABLE_LAYOUT = {
  /** Root `Table`: intrinsic width, at least full — scroll when wider. */
  table: `grid w-max min-w-full ${AUCTION_RECORD_COLUMN_TRACKS}`,
  /**
   * `TableHeader` / each `TableRow`: own tracks when alone; subgrid when under
   * the table so max-content columns share one width.
   */
  row: [
    "grid w-full",
    AUCTION_RECORD_COLUMN_TRACKS,
    "[[data-slot=table]_&]:col-span-full [[data-slot=table]_&]:grid-cols-subgrid",
  ].join(" "),
  /** `TableBody`: promote rows into the table grid. */
  body: "contents",
} as const;

const AUCTION_RECORD_COLUMNS = {
  auction: "min-w-0",
  currentBid: "whitespace-nowrap",
  standing: "whitespace-nowrap",
  emailAlerts: "whitespace-nowrap",
  actions: "whitespace-nowrap",
} as const;

export { AUCTION_RECORD_COLUMNS, AUCTION_RECORD_TABLE_LAYOUT };
