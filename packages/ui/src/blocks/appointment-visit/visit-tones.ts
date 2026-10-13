import type { VisitTone } from "./types";

/** Each tone as a tinted fill under ink text; ink itself is the dark pill. */
const VISIT_TINT = {
  plain: "bg-muted text-foreground",
  ink: "bg-foreground text-background",
  info: "bg-info/10 text-foreground",
  ok: "bg-success-muted text-foreground",
  warn: "bg-warning-muted text-foreground",
  bad: "bg-destructive-muted text-foreground",
} as const satisfies Record<VisitTone, string>;

/** The board's second ink: body copy one step lighter than the heading. */
const VISIT_INK_2 = "text-(--gray-700)";

/** The board's third ink: labels and fine print. */
const VISIT_INK_3 = "text-secondary-foreground";

export { VISIT_INK_2, VISIT_INK_3, VISIT_TINT };
