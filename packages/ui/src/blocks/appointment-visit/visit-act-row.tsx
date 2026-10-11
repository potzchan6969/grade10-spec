import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import type { VisitAct } from "./types";

type VisitActRowProps = { acts: readonly VisitAct[] };

/** The page's acts, primary first, each a button or a link as it behaves.
 * No acts draws nothing. */
function VisitActRow({ acts }: VisitActRowProps) {
  if (acts.length === 0) return null;
  return (
    <HStack data-slot="act-row" gap="sm" wrap>
      {acts.map((act) =>
        act.href ? (
          <Link
            href={act.href}
            key={act.key}
            {...(act.external ? { rel: "noopener", target: "_blank" } : {})}
          >
            {act.label}
          </Link>
        ) : (
          <Button
            key={act.key}
            onClick={act.onClick}
            size="md"
            type="button"
            variant={act.primary ? "default" : "outline"}
          >
            {act.label}
          </Button>
        ),
      )}
    </HStack>
  );
}

export type { VisitActRowProps };
export { VisitActRow };
