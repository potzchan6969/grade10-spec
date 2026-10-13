import { cn } from "@grade10/design-system/lib/utils";
import { VISIT_INK_2, VISIT_INK_3 } from "./visit-tones";

type VisitPassCopy = {
  /** The counter once called, drawn under the name on the day's pass only. */
  title?: string;
  nameLabel: string;
  /** What the visit is, under the name. */
  line?: string;
  note?: string;
};

/** Before the day, a compact card read at a glance; on the day, a centred
 * pass held up at the counter. */
type VisitPassSize = "compact" | "day";

type VisitPassProps = {
  copy: VisitPassCopy;
  /** Who the visit is booked for. */
  name: string;
  size?: VisitPassSize;
};

/**
 * The pass: who the visit is booked for as large text, what the visit is,
 * and the counter once called. Staff at any shop find the visit by the
 * collector's phone, email or name.
 */
function VisitPass({ copy, name, size = "compact" }: VisitPassProps) {
  const day = size === "day";
  return (
    <section
      aria-label={day && copy.title ? `${name}, ${copy.title}` : name}
      className={cn(
        "flex flex-col border border-border",
        day
          ? "items-center gap-2 rounded-2xl px-4 pt-[18px] pb-4 text-center"
          : "gap-0.5 rounded-xl p-3",
      )}
      data-size={size}
      data-slot="visit-pass"
    >
      <span className={cn("text-xs leading-4", VISIT_INK_3)}>
        {copy.nameLabel}
      </span>
      <span
        className={cn(
          "font-bold [overflow-wrap:anywhere]",
          day ? "text-4xl leading-[44px]" : "text-2xl leading-[30px]",
        )}
      >
        {name}
      </span>
      {day && copy.title ? (
        <span className="text-[17px] leading-6 font-bold">{copy.title}</span>
      ) : null}
      {copy.line ? (
        <span
          className={cn(
            "tabular-nums",
            day
              ? "text-[15px] leading-[22px] font-semibold"
              : cn("text-[13px] leading-[18px]", VISIT_INK_2),
          )}
        >
          {copy.line}
        </span>
      ) : null}
      {copy.note ? (
        <span className={cn("text-[13px] leading-[18px]", VISIT_INK_2)}>
          {copy.note}
        </span>
      ) : null}
    </section>
  );
}

export type { VisitPassCopy, VisitPassProps, VisitPassSize };
export { VisitPass };
