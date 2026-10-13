import {
  Button,
  buttonVariants,
} from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { VisitAct } from "./types";

type VisitActRowProps = { acts: readonly VisitAct[] };

/** One act as the board draws it: a 44px pill, the primary filled across the
 * row, a wide secondary across the row, the rest two to a row. */
const ACT_CLASS =
  "h-11 w-full min-w-0 px-3 text-[15px] font-semibold [text-box-trim:none]";

/** The page's acts in a two-column grid, each a button or a link as it
 * behaves. No acts draws nothing. */
function VisitActRow({ acts }: VisitActRowProps) {
  if (acts.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2" data-slot="act-row">
      {acts.map((act) => {
        const className = cn(
          ACT_CLASS,
          (act.primary || act.wide) && "col-span-2",
          !act.primary && "border-border-strong bg-background",
        );
        const variant = act.primary ? "default" : "outline";
        return act.href ? (
          <a
            className={cn(buttonVariants({ size: "md", variant }), className)}
            href={act.href}
            key={act.key}
            onClick={act.onClick}
            {...(act.external ? { rel: "noopener", target: "_blank" } : {})}
          >
            {act.label}
          </a>
        ) : (
          <Button
            className={className}
            key={act.key}
            onClick={act.onClick}
            size="md"
            type="button"
            variant={variant}
          >
            {act.label}
          </Button>
        );
      })}
    </div>
  );
}

export type { VisitActRowProps };
export { VisitActRow };
