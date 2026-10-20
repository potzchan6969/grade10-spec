import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";

// biome-ignore lint/plugin: rungs need <li> semantics and flex-1 equal columns, which the stack primitives cannot express
const RUNG_CLASSES = "flex flex-1 flex-col items-center gap-1";

type TierLadderRung = {
  /** The rung's tier, as the consumer names it. */
  tier: string;
  /** What reaching the rung asks — "500 pts", "Free to join". */
  caption?: string;
  /**
   * An invitation-only rung: the climb stops before it, so no connector is
   * drawn into it.
   */
  invitationOnly?: boolean;
};

type TierLadderCopy = {
  /** Names the qualifying-window progress line — "Qualifying points this year". */
  qualifying: string;
};

type TierLadderProps = {
  copy: TierLadderCopy;
  /** The ladder's rungs, lowest first. */
  rungs: readonly TierLadderRung[];
  /** The tier the member holds; names one rung's `tier`. */
  currentTier: string;
  /** Points earned inside the current qualifying window. */
  qualifyingPoints?: number;
  /**
   * Points the window asks for. Absent for a member whose tier names no
   * threshold — an invitation-held tier — and the progress line is not drawn.
   */
  qualifyingTarget?: number;
  className?: string;
};

/**
 * The member's climb up the ladder: every rung the programme has, the rungs
 * already held filled to the held rung's ring, and the run to keep or reach
 * the next threshold below. A rung no one can earn — held by invitation —
 * stands unconnected: nothing is climbed into it. No Figma set defines this
 * block; it is the member's own progress, drawn from the tier card's
 * qualifying count.
 */
function TierLadder({
  copy,
  rungs,
  currentTier,
  qualifyingPoints,
  qualifyingTarget,
  className,
}: TierLadderProps) {
  const current = rungs.findIndex((rung) => rung.tier === currentTier);
  const segmentWidth = 100 / rungs.length;
  const showsQualifying = qualifyingPoints != null && qualifyingTarget != null;

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="tier-ladder"
      gap="md"
    >
      <div className="relative w-full">
        {rungs.slice(0, -1).map((rung, index) =>
          rungs[index + 1].invitationOnly ? null : (
            <div
              aria-hidden
              className={cn(
                "absolute top-3 h-0.5 -translate-y-1/2 rounded-full",
                index < current ? "bg-primary" : "bg-border",
              )}
              data-slot="tier-ladder-connector"
              key={rung.tier}
              style={{
                left: `${((2 * index + 1) / (2 * rungs.length)) * 100}%`,
                width: `${segmentWidth}%`,
              }}
            />
          ),
        )}
        <ol className="relative flex w-full">
          {rungs.map((rung, index) => (
            <li
              className={RUNG_CLASSES}
              data-slot="tier-ladder-rung"
              key={rung.tier}
            >
              <span className="relative grid size-6 place-items-center">
                {index === current ? (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2 border-primary bg-card"
                  />
                ) : null}
                <span
                  className={cn(
                    "relative rounded-full",
                    index <= current
                      ? "size-3.5 bg-primary"
                      : "size-4 border-2 border-border-strong bg-card",
                  )}
                  data-slot="tier-ladder-dot"
                />
              </span>
              <Text className="font-semibold" size="sm">
                {rung.tier}
              </Text>
              {rung.caption ? (
                <Text
                  className="text-center text-secondary-foreground"
                  size="xs"
                >
                  {rung.caption}
                </Text>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      {showsQualifying ? (
        <HStack
          className="w-full border-t border-border pt-4"
          hAlign="space-between"
          vAlign="baseline"
        >
          <Text className="text-secondary-foreground" size="sm">
            {copy.qualifying}
          </Text>
          <Text data-slot="tier-ladder-qualifying" size="sm">
            <span className="font-semibold">{qualifyingPoints}</span>
            <span className="text-secondary-foreground">
              {` / ${qualifyingTarget}`}
            </span>
          </Text>
        </HStack>
      ) : null}
    </VStack>
  );
}

export type { TierLadderCopy, TierLadderProps, TierLadderRung };
export { TierLadder };
