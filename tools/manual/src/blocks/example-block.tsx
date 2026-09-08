import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import type { ReactNode } from "react";
import { slugify } from "../api/paths";
import type { ExampleBlock } from "../content/grammar";
import { AnchorLink } from "./anchor";
import { BlockView } from "./block-view";
import { MissingCard } from "./broken-card";
import {
  balances,
  type ExampleLedger,
  type ExampleOrder,
  type ExampleRow,
  elapsed,
  formatMoney,
  orderTotal,
  readExample,
} from "./example-shape";
import { InlineMarkdown } from "./inline-markdown";

const MINUS = "−";

const delta = (points: number | null): string =>
  points === null || points === 0
    ? ""
    : points > 0
      ? `+${points}`
      : `${MINUS}${-points}`;

const tone = (points: number | null): string =>
  points === null || points === 0
    ? "text-muted-foreground"
    : points > 0
      ? "text-success"
      : "text-destructive";

/**
 * One worked case as a ledger. The cart opens it, then every row is a thing
 * that happened, in order, with what it did to the balance beside it, so the
 * reader watches the rules act instead of being told them. Steps number the
 * rows; a timeline hangs them on their days. A run of them folds into one
 * Examples section (`block-list.tsx`); the card itself is always open.
 */
export const exampleId = (block: ExampleBlock): string =>
  `example-${slugify(block.title)}`;

export function ExampleBlockView({ block }: { block: ExampleBlock }) {
  const id = exampleId(block);
  const read = readExample(block);
  if ("problem" in read) {
    return (
      <MissingCard
        title={`Example “${block.title}” could not be read`}
        tone="error"
      >
        {read.problem}
      </MissingCard>
    );
  }
  const { kind, note } = read.ledger;

  return (
    <section
      className="group/anchor my-4 scroll-mt-24 overflow-hidden rounded-(--radius-2xl) border border-border bg-background-subtle"
      id={id}
    >
      <div className="flex items-center gap-1 px-4 py-3 pr-2">
        <Text as="h3" className="min-w-0 flex-1" size="sm" weight="bold">
          {block.title}
        </Text>
        <AnchorLink id={id} label="Copy link to this example" />
      </div>
      {kind === "steps" ? (
        <Steps ledger={read.ledger} />
      ) : (
        <Timeline ledger={read.ledger} />
      )}
      {note.length === 0 ? null : (
        <div className="border-border-subtle border-t px-4 py-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {note.map((item, position) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
            <BlockView block={item} key={`${item.type}-${position}`} />
          ))}
        </div>
      )}
    </section>
  );
}

function Steps({ ledger }: { ledger: ExampleLedger }) {
  const { order, rows } = ledger;
  const held = balances(rows);
  const offset = order === null ? 0 : 1;
  return (
    <ol className="border-border-subtle border-t bg-background">
      {order === null ? null : (
        <StepRow badge={order.tier} number={1} step="Buys">
          <Cart order={order} />
        </StepRow>
      )}
      {rows.map((row, index) => (
        <StepRow
          // biome-ignore lint/suspicious/noArrayIndexKey: rows are a fixed positional sequence parsed from one immutable table; position is their identity.
          key={`${row.label}-${index}`}
          number={index + 1 + offset}
          step={row.label}
        >
          <Movement held={held[index]} row={row} />
        </StepRow>
      ))}
    </ol>
  );
}

function StepRow({
  number,
  step,
  badge,
  children,
}: {
  number: number;
  step: string;
  badge?: string | null;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[1.5rem_5.5rem_minmax(0,1fr)_3.5rem_3.5rem] items-baseline gap-x-3 border-border-subtle border-b px-4 py-2 last:border-b-0">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[0.6875rem] text-secondary-foreground">
        {number}
      </span>
      <span className="flex flex-col items-start gap-1">
        <Text as="span" size="sm" weight="bold">
          {step}
        </Text>
        {badge ? (
          <Badge size="sm" variant="outline">
            {badge}
          </Badge>
        ) : null}
      </span>
      {children}
    </li>
  );
}

type Day = {
  when: string;
  /** Time since the first day, in the programme's units; null on the first. */
  since: string | null;
  rows: { row: ExampleRow; held: number }[];
};

/** Rows hung on their days: a row with no day of its own shares the one above. */
function days(rows: ExampleRow[]): Day[] {
  const held = balances(rows);
  const out: Day[] = [];
  rows.forEach((row, index) => {
    const last = out.at(-1);
    if (last && (row.label === "" || row.label === last.when)) {
      last.rows.push({ row, held: held[index] });
      return;
    }
    const start = rows[0]?.day ?? null;
    const since =
      last === undefined || start === null || row.day === null
        ? null
        : sinceLabel(elapsed(start, row.day));
    out.push({ when: row.label, since, rows: [{ row, held: held[index] }] });
  });
  return out;
}

const plural = (count: number, unit: string): string =>
  `${count} ${unit}${count === 1 ? "" : "s"}`;

function sinceLabel({
  months,
  days,
}: {
  months: number;
  days: number;
}): string {
  const parts = [
    ...(months > 0 ? [plural(months, "month")] : []),
    ...(days > 0 || months === 0 ? [plural(days, "day")] : []),
  ];
  return `+${parts.join(" ")}`;
}

function Timeline({ ledger }: { ledger: ExampleLedger }) {
  const { order, rows } = ledger;
  return (
    <ol className="border-border-subtle border-t bg-background px-4 py-3">
      {days(rows).map((day, index) => (
        <li
          className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4"
          key={day.when}
        >
          <span className="flex flex-col items-end pt-1 whitespace-nowrap">
            <Text as="span" size="sm" weight="bold">
              {day.when}
            </Text>
            {day.since === null ? null : (
              <Text as="span" size="xs" tone="secondary">
                {day.since}
              </Text>
            )}
          </span>
          <div className="relative border-border border-l pb-4 pl-4 [li:last-child>&]:pb-1">
            <span className="absolute top-[0.55rem] -left-[0.3125rem] size-[0.5625rem] rounded-full border-2 border-background bg-foreground" />
            {index === 0 && order !== null ? (
              <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-baseline gap-x-3 py-1">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <Text as="span" size="sm" weight="bold">
                      Buys
                    </Text>
                    {order.tier ? (
                      <Badge size="sm" variant="outline">
                        {order.tier}
                      </Badge>
                    ) : null}
                  </span>
                  <Cart order={order} />
                </div>
              </div>
            ) : null}
            {day.rows.map(({ row, held }, position) => (
              <div
                className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-baseline gap-x-3 py-1"
                // biome-ignore lint/suspicious/noArrayIndexKey: rows are a fixed positional sequence parsed from one immutable table; position is their identity.
                key={`${row.event}-${position}`}
              >
                <Movement held={held} row={row} />
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Movement({ row, held }: { row: ExampleRow; held: number }) {
  return (
    <>
      <Text as="span" size="sm">
        <InlineMarkdown text={row.event} />
      </Text>
      <span
        className={`text-right font-mono text-sm leading-snug ${tone(row.points)}`}
      >
        {delta(row.points)}
      </span>
      <Text
        as="span"
        className="text-right font-mono"
        size="sm"
        tone="secondary"
      >
        {held}
      </Text>
    </>
  );
}

function Cart({ order }: { order: ExampleOrder }) {
  const lines = order.items.map((item) => ({
    label: item.name,
    amount: item.price,
    muted: false,
  }));
  if (order.shipping !== null) {
    lines.push({ label: "Shipping", amount: order.shipping, muted: true });
  }
  return (
    <dl className="col-span-3 grid max-w-sm grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 text-sm">
      {lines.map((line, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: cart lines are a fixed positional sequence parsed from one immutable list; position is their identity.
        <CartLine key={`${line.label}-${index}`} muted={line.muted}>
          <dt>{line.label}</dt>
          <dd className="text-right font-mono">{formatMoney(line.amount)}</dd>
        </CartLine>
      ))}
      {lines.length > 1 ? (
        <CartLine total>
          <dt>Total</dt>
          <dd className="text-right font-mono">
            {formatMoney(orderTotal(order))}
          </dd>
        </CartLine>
      ) : null}
    </dl>
  );
}

function CartLine({
  muted = false,
  total = false,
  children,
}: {
  muted?: boolean;
  total?: boolean;
  children: ReactNode;
}) {
  const style = total
    ? "[&>*]:mt-1 [&>*]:border-border-subtle [&>*]:border-t [&>*]:pt-1 [&>*]:font-bold"
    : muted
      ? "[&>*]:text-muted-foreground"
      : "";
  return <div className={`contents ${style}`}>{children}</div>;
}
