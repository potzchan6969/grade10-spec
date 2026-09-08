import type { BodyItem, ExampleBlock } from "../content/grammar.ts";

export type ExampleItem = { name: string; price: number };

/** What was bought: the cart, the fee on it, and the member's tier then. */
export type ExampleOrder = {
  items: ExampleItem[];
  shipping: number | null;
  tier: string | null;
};

export type ExampleRow = {
  /** The step's name, or on a timeline the day — blank where the row shares the day above. */
  label: string;
  /** On a timeline, the row's day as a UTC instant — shared from above where the label is blank. */
  day: number | null;
  event: string;
  /** Signed change in points; null where the row moves none. */
  points: number | null;
  /** The balance after the row, as written; null where the row carries it. */
  balance: number | null;
};

export type ExampleLedger = {
  /** Steps in order, or a timeline where the day is what the reader follows. */
  kind: "steps" | "timeline";
  order: ExampleOrder | null;
  rows: ExampleRow[];
  /** Everything after the table: the why. */
  note: BodyItem[];
};

export const STEP_COLUMNS = ["Step", "Event", "Points", "Balance"] as const;
export const TIMELINE_COLUMNS = ["When", "Event", "Points", "Balance"] as const;
const COLUMNS = STEP_COLUMNS.length;

const ITEM = /^-\s+(.+?)\s+(\$\S+)\s*$/;
const MONEY = /^\$(\d{1,3}(?:,\d{3})*|\d+)(?:\.(\d{2}))?$/;
const ROW = /^\s*\|(.*)\|\s*$/;
const RULE = /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/;
const SIGNED = /^([+\-−])(\d+)$/;
const DAY = /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/;
const MONTHS = "JanFebMarAprMayJunJulAugSepOctNovDec";

const cells = (line: string): string[] =>
  (ROW.exec(line)?.[1] ?? "").split("|").map((cell) => cell.trim());

/** `$1,000` or `$12.50` as a number; undefined for anything else. */
export function readMoney(text: string): number | undefined {
  const match = MONEY.exec(text.trim());
  if (!match) return undefined;
  const whole = Number(match[1].replace(/,/g, ""));
  return match[2] === undefined ? whole : whole + Number(match[2]) / 100;
}

export function formatMoney(amount: number): string {
  const cents = !Number.isInteger(amount);
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export const orderTotal = (order: ExampleOrder): number =>
  order.items.reduce((sum, item) => sum + item.price, order.shipping ?? 0);

/**
 * Reads the order and the ledger out of an example, or says what is wrong
 * with it. Pure over the block, shared by the renderer and `check:manual`,
 * so what one shows is exactly what the other holds to: the cart is a list
 * of priced lines, the table follows it with fixed columns — steps, or days
 * that never run backwards — and every stated balance is the one the deltas
 * reach.
 */
export function readExample(
  block: ExampleBlock,
): { ledger: ExampleLedger } | { problem: string } {
  const [first, ...rest] = block.body;
  if (first?.type !== "prose") {
    return { problem: "an example opens with its cart and ledger table" };
  }
  const lines = first.markdown.split("\n");

  const items: ExampleItem[] = [];
  let at = 0;
  for (; at < lines.length && lines[at].startsWith("- "); at += 1) {
    const match = ITEM.exec(lines[at]);
    const price = match ? readMoney(match[2]) : undefined;
    if (!match || price === undefined) {
      return {
        problem: `cart line ${items.length + 1} is \`- <item> $<price>\``,
      };
    }
    items.push({ name: match[1], price });
  }
  const order = readOrder(block, items);
  if ("problem" in order) return order;
  while (at < lines.length && lines[at].trim() === "") at += 1;

  const kind = readKind(cells(lines[at] ?? ""));
  if (kind === undefined) {
    return {
      problem: `the ledger's columns are \`${STEP_COLUMNS.join(" | ")}\`, or \`${TIMELINE_COLUMNS.join(" | ")}\` for a timeline`,
    };
  }
  if (!RULE.test(lines[at + 1] ?? "")) {
    return { problem: "the ledger's header is followed by its rule line" };
  }

  const rows: ExampleRow[] = [];
  let day: number | null = null;
  let tail = at + 2;
  for (; tail < lines.length && ROW.test(lines[tail]); tail += 1) {
    const parts = cells(lines[tail]);
    if (parts.length !== COLUMNS) {
      return {
        problem: `row ${rows.length + 1} has ${parts.length} cells, not ${COLUMNS}`,
      };
    }
    const [label, event, points, balance] = parts;
    if (kind === "steps" && label === "") {
      return { problem: `row ${rows.length + 1} names no step` };
    }
    let when: number | null = null;
    if (kind === "timeline") {
      when = label === "" ? day : (readDay(label) ?? null);
      if (when === null) {
        return {
          problem: `row ${rows.length + 1}: a day reads \`3 Jan 2026\`, or is blank to share the day above`,
        };
      }
      if (day !== null && when < day) {
        return { problem: `row ${rows.length + 1} runs back in time` };
      }
      day = when;
    }
    const delta = readPoints(points);
    if (delta === undefined) {
      return {
        problem: `row ${rows.length + 1}: points are signed, \`+15\` or \`−10\`, or blank`,
      };
    }
    const after = readBalance(balance);
    if (after === undefined) {
      return {
        problem: `row ${rows.length + 1}: a balance is a whole number, or blank`,
      };
    }
    rows.push({ label, day: when, event, points: delta, balance: after });
  }
  if (rows.length === 0) return { problem: "the ledger has no rows" };

  const mismatch = reconcile(rows);
  if (mismatch !== null) return { problem: mismatch };

  const after = lines.slice(tail).join("\n").trim();
  const note: BodyItem[] =
    after === "" ? [] : [{ type: "prose", markdown: after }];
  return {
    ledger: { kind, order: order.order, rows, note: [...note, ...rest] },
  };
}

function readOrder(
  block: ExampleBlock,
  items: ExampleItem[],
): { order: ExampleOrder | null } | { problem: string } {
  if (items.length === 0) {
    return block.tier === undefined && block.shipping === undefined
      ? { order: null }
      : {
          problem:
            "tier and shipping describe a cart; list what is bought above the ledger",
        };
  }
  const shipping =
    block.shipping === undefined ? null : readMoney(block.shipping);
  if (shipping === undefined) {
    return { problem: "shipping is a price, `$30`" };
  }
  return { order: { items, shipping, tier: block.tier ?? null } };
}

function readKind(header: string[]): ExampleLedger["kind"] | undefined {
  const matches = (columns: readonly string[]) =>
    header.length === columns.length &&
    header.every((cell, index) => cell === columns[index]);
  if (matches(STEP_COLUMNS)) return "steps";
  if (matches(TIMELINE_COLUMNS)) return "timeline";
  return undefined;
}

/** `3 Jan 2026` as a day number, so a timeline can be held to running forwards. */
function readDay(text: string): number | undefined {
  const match = DAY.exec(text);
  if (!match) return undefined;
  const month = MONTHS.indexOf(match[2]) / 3;
  if (!Number.isInteger(month)) return undefined;
  return Date.UTC(Number(match[3]), month, Number(match[1]));
}

const DAY_MS = 86_400_000;

/**
 * Whole calendar months from `start` to `end`, then the days left over —
 * the units the programme's windows are counted in. The day of month is
 * clamped the way the programme clamps it, so 31 January to 28 February is
 * one month, not 28 days.
 */
export function elapsed(
  start: number,
  end: number,
): { months: number; days: number } {
  const from = new Date(start);
  let months = 0;
  while (addMonths(from, months + 1) <= end) months += 1;
  const days = Math.round((end - addMonths(from, months)) / DAY_MS);
  return { months, days };
}

function addMonths(from: Date, months: number): number {
  const year = from.getUTCFullYear();
  const month = from.getUTCMonth() + months;
  const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Date.UTC(year, month, Math.min(from.getUTCDate(), last));
}

function readPoints(cell: string): number | null | undefined {
  if (cell === "") return null;
  if (cell === "0") return 0;
  const signed = SIGNED.exec(cell);
  if (!signed) return undefined;
  const magnitude = Number(signed[2]);
  return signed[1] === "+" ? magnitude : -magnitude;
}

function readBalance(cell: string): number | null | undefined {
  if (cell === "") return null;
  return /^\d+$/.test(cell) ? Number(cell) : undefined;
}

function reconcile(rows: ExampleRow[]): string | null {
  const run = balances(rows);
  for (const [index, row] of rows.entries()) {
    if (run[index] < 0) {
      return `row ${index + 1} drives the balance to ${run[index]}`;
    }
    if (row.balance !== null && row.balance !== run[index]) {
      return `row ${index + 1} states a balance of ${row.balance}, but the points reach ${run[index]}`;
    }
  }
  return null;
}

/** What every row holds after it ran, stated or carried. The run starts at
 * zero, or at the first stated balance where nothing moved before it — an
 * example may open mid-story. */
export function balances(rows: ExampleRow[]): number[] {
  const out: number[] = [];
  let held: number | null = null;
  for (const row of rows) {
    held =
      held === null && row.points === null && row.balance !== null
        ? row.balance
        : (held ?? 0) + (row.points ?? 0);
    out.push(held);
  }
  return out;
}
