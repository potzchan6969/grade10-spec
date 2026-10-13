import { Badge } from "@grade10/design-system/components/display/badge";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretRight } from "@phosphor-icons/react";
import { useId } from "react";
import type { VisitListRow } from "./types";
import { VISIT_INK_2, VISIT_INK_3, VISIT_TINT } from "./visit-tones";

type VisitListCopy = {
  upcoming: string;
  past: string;
};

type VisitListProps = {
  copy: VisitListCopy;
  upcoming: readonly VisitListRow[];
  past: readonly VisitListRow[];
  /** Opens the page that manages one visit, by its id, for a row with no href. */
  onOpen: (id: string) => void;
};

/** The collector's visits split into upcoming and past, each under its
 * heading and each row opening the page that manages it. An empty half
 * draws nothing. */
function VisitList({ copy, upcoming, past, onOpen }: VisitListProps) {
  return (
    <div className="flex flex-col gap-4" data-slot="booking-list-groups">
      {upcoming.length > 0 ? (
        <Section
          heading={copy.upcoming}
          onOpen={onOpen}
          rows={upcoming}
          slot="booking-list-upcoming"
        />
      ) : null}
      {past.length > 0 ? (
        <Section
          heading={copy.past}
          onOpen={onOpen}
          rows={past}
          slot="booking-list-past"
        />
      ) : null}
    </div>
  );
}

const ROW_CLASS =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-background py-3 pr-2 pl-3.5 text-left text-foreground transition-[border-color,box-shadow] duration-100 outline-none hover:border-border-strong hover:shadow-xs focus-visible:ring-3 focus-visible:ring-ring/50";

function Section({
  heading,
  rows,
  slot,
  onOpen,
}: {
  heading: string;
  rows: readonly VisitListRow[];
  slot: string;
  onOpen: (id: string) => void;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-2"
      data-slot={slot}
    >
      <h2
        className={cn("m-0 text-[13px] leading-[18px] font-bold", VISIT_INK_2)}
        id={id}
      >
        {heading}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {rows.map((row) => {
          const body = <RowBody row={row} />;
          return (
            <li data-slot="booking-list-item" key={row.id}>
              {row.href ? (
                <a className={ROW_CLASS} href={row.href}>
                  {body}
                </a>
              ) : (
                <button
                  className={ROW_CLASS}
                  onClick={() => onOpen(row.id)}
                  type="button"
                >
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function RowBody({ row }: { row: VisitListRow }) {
  return (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[15px] leading-5 font-bold">{row.service}</span>
        <span
          className={cn("truncate text-sm leading-5 tabular-nums", VISIT_INK_2)}
        >
          {row.when} · {row.location}
        </span>
        <Badge
          className={cn(
            VISIT_TINT[row.tone ?? "plain"],
            "h-[22px] px-2 text-xs font-bold",
          )}
          data-tone={row.tone ?? "plain"}
        >
          {row.status}
        </Badge>
      </span>
      <span aria-hidden className={cn("inline-flex shrink-0", VISIT_INK_3)}>
        <CaretRight size={20} />
      </span>
    </>
  );
}

export type { VisitListCopy, VisitListProps };
export { VisitList };
