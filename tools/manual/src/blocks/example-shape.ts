import type { BodyItem, ExampleBlock } from "../content/grammar.ts";

export type ExampleItem = { name: string; price: number };

/** What was bought: the cart, the fee on it, and the member's tier then. */
export type ExampleOrder = {
  items: ExampleItem[];
  shipping: number | null;
  tier: string | null;
};

export type ExampleRow = {
  /** The span this row falls in — blank where it shares the span above, and
   * empty on a ledger that marks none. */
  period: string;
  /** The step's name, or on a timeline the day — blank where the row shares the day above. */
  label: string;
  /** On a timeline, the row's day as a UTC instant — shared from above where the label is blank. */
  day: number | null;
  event: string;
  /** Signed change in points; null where the row moves none. */
  points: number | null;
  /** The balance after the row, as written; null where the row carries it. */
  balance: number | null;
  /** A second running figure the rows state rather than reach — tier
   * progress, a window's total. Null on a ledger that keeps none. */
  progress: number | null;
};

/** The colours a period's rail can take. A period the block names none for
 * runs without one, which is how a span that is inside nothing looks. */
export const PERIOD_TONES = [
  "orange",
  "gold",
  "blue",
  "green",
  "red",
  "ink",
] as const;
export type PeriodTone = (typeof PERIOD_TONES)[number];

/** What a period's colour is keyed on: the name before the first `·`, so two
 * terms of the same tier read as the same thing wearing different dates. */
export const periodName = (period: string): string =>
  period.split("·")[0].trim();

export type ExampleLedger = {
  /** Steps in order, or a timeline where the day is what the reader follows. */
  kind: "steps" | "timeline";
  /** Whether the rows keep a second running figure. */
  progress: boolean;
  /** Period name to the colour its rail wears; empty where none is coloured. */
  tones: Record<string, PeriodTone>;
  order: ExampleOrder | null;
  rows: ExampleRow[];
  /** Everything after the table: the why. */
  note: BodyItem[];
};

export const STEP_COLUMNS = ["Step", "Event", "Points", "Balance"] as const;
export const TIMELINE_COLUMNS = ["When", "Event", "Points", "Balance"] as const;
/** A second running figure beside the balance, stated by each row rather than
 * reached from the points — what a rolling window holds, what a term counts. */
export const PROGRESS_COLUMN = "Progress";
/** The optional last column: what a run of days is inside — a term, a window,
 * a tier's life. Named once and left blank for as long as it runs, and `—`
 * closes it: the rows after that are inside nothing. */
export const PERIOD_COLUMN = "Period";
const NO_PERIOD = "—";
const COLUMNS = STEP_COLUMNS.length;

const ITEM = /^-\s+(.+?)\s+(\$\S+)\s*$/;
const MONEY = /^\$(\d{1,3}(?:,\d{3})*|\d+)(?:\.(\d{2}))?$/;
const ROW = /^\s*\|(.*)\|\s*$/;
const RULE = /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/;
const SIGNED = /^([+\-−])(\d+)$/;
const DAY = /^(\d{4})\/(\d{2})\/(\d{2})$/;

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

  const header = readKind(cells(lines[at] ?? ""));
  if (header === undefined) {
    return {
      problem: `the ledger's columns are \`${STEP_COLUMNS.join(" | ")}\`, or \`${TIMELINE_COLUMNS.join(" | ")}\` for a timeline, either with \`| ${PROGRESS_COLUMN}\` then \`| ${PERIOD_COLUMN}\` after it — an example walks points moving, so anything else is a plain table`,
    };
  }
  const { kind, progress: keepsProgress, periods } = header;
  if (periods && kind === "steps") {
    return {
      problem: `\`${PERIOD_COLUMN}\` marks a span of days, which a steps ledger has none of — write it as a timeline, or put the span in the step`,
    };
  }
  const width = COLUMNS + (keepsProgress ? 1 : 0) + (periods ? 1 : 0);
  if (!RULE.test(lines[at + 1] ?? "")) {
    return { problem: "the ledger's header is followed by its rule line" };
  }

  const rows: ExampleRow[] = [];
  let day: number | null = null;
  let period = "";
  let progress: number | null = null;
  let tail = at + 2;
  for (; tail < lines.length && ROW.test(lines[tail]); tail += 1) {
    const parts = cells(lines[tail]);
    if (parts.length !== width) {
      return {
        problem: `row ${rows.length + 1} has ${parts.length} cells, not ${width}`,
      };
    }
    const [label, event, points, balance, ...extra] = parts;
    if (keepsProgress) {
      const stated = readBalance(extra[0]);
      if (stated === undefined) {
        return {
          problem: `row ${rows.length + 1}: ${PROGRESS_COLUMN.toLowerCase()} is a whole number, or blank to hold the one above`,
        };
      }
      if (stated !== null) progress = stated;
    }
    const span = periods ? (extra[keepsProgress ? 1 : 0] ?? "") : "";
    if (span === NO_PERIOD) period = "";
    else if (span !== "") period = span;
    if (kind === "steps" && label === "") {
      return { problem: `row ${rows.length + 1} names no step` };
    }
    let when: number | null = null;
    if (kind === "timeline") {
      when = label === "" ? day : (readDay(label) ?? null);
      if (when === null) {
        return {
          problem: `row ${rows.length + 1}: a day reads \`2026/01/03\`, or is blank to share the day above`,
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
    rows.push({
      label,
      day: when,
      event,
      points: delta,
      balance: after,
      progress: keepsProgress ? progress : null,
      period,
    });
  }
  if (rows.length === 0) return { problem: "the ledger has no rows" };

  const mismatch = reconcile(rows);
  if (mismatch !== null) return { problem: mismatch };

  const coloured = readTones(block.periods, periods, rows);
  if ("problem" in coloured) return coloured;

  const after = lines.slice(tail).join("\n").trim();
  const note: BodyItem[] =
    after === "" ? [] : [{ type: "prose", markdown: after }];
  return {
    ledger: {
      kind,
      progress: keepsProgress,
      tones: coloured.tones,
      order: order.order,
      rows,
      note: [...note, ...rest],
    },
  };
}

function readTones(
  spec: string | undefined,
  periods: boolean,
  rows: ExampleRow[],
): { tones: Record<string, PeriodTone> } | { problem: string } {
  if (spec === undefined) return { tones: {} };
  if (!periods) {
    return {
      problem: `\`periods\` colours the spans a \`${PERIOD_COLUMN}\` column marks, and this ledger marks none`,
    };
  }
  const named = new Set(rows.map((row) => periodName(row.period)));
  const tones: Record<string, PeriodTone> = {};
  for (const entry of spec.split(",")) {
    const [name, colour] = entry.split("=").map((part) => part.trim());
    if (!name || colour === undefined) {
      return {
        problem: "`periods` pairs each period with its colour, `Gold=gold`",
      };
    }
    const tone = PERIOD_TONES.find((known) => known === colour);
    if (tone === undefined) {
      return {
        problem: `\`${colour}\` is not one of the colours: ${PERIOD_TONES.join(", ")}`,
      };
    }
    if (tones[name] !== undefined) {
      return { problem: `\`${name}\` is given a colour twice` };
    }
    if (!named.has(name)) return { problem: `no row is inside \`${name}\`` };
    tones[name] = tone;
  }
  return { tones };
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

function readKind(
  header: string[],
):
  | { kind: ExampleLedger["kind"]; progress: boolean; periods: boolean }
  | undefined {
  const periods = header.at(-1) === PERIOD_COLUMN;
  let named = periods ? header.slice(0, -1) : header;
  const progress = named.at(-1) === PROGRESS_COLUMN;
  if (progress) named = named.slice(0, -1);
  const matches = (columns: readonly string[]) =>
    named.length === columns.length &&
    named.every((cell, index) => cell === columns[index]);
  if (matches(STEP_COLUMNS)) return { kind: "steps", progress, periods };
  if (matches(TIMELINE_COLUMNS)) return { kind: "timeline", progress, periods };
  return undefined;
}

/** `2026/01/03` as a day number, so a timeline can be held to running
 * forwards. A day the calendar does not have is refused, not rolled over. */
function readDay(text: string): number | undefined {
  const match = DAY.exec(text);
  if (!match) return undefined;
  const [year, month, day] = match.slice(1).map(Number);
  const at = Date.UTC(year, month - 1, day);
  return new Date(at).getUTCDate() === day && month >= 1 && month <= 12
    ? at
    : undefined;
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
