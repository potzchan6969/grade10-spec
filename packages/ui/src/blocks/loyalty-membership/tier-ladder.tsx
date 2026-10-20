import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";

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
 * The member's climb up the ladder, in a card: the design-system `Stepper`
 * draws every rung the programme has — the rungs already held checked off,
 * the held rung in progress — and the run to keep or reach the next
 * threshold sits below. A rung no one can earn — held by invitation —
 * stands unconnected: nothing is climbed into it.
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
  const showsQualifying = qualifyingPoints != null && qualifyingTarget != null;

  return (
    <Card className={cn("w-full", className)} data-slot="tier-ladder">
      <CardContent>
        <VStack gap="md">
          <Stepper>
            {rungs.map((rung, index) => (
              <Step
                description={rung.caption}
                key={rung.tier}
                label={rung.tier}
                showLeadingConnector={index > 0 && !rung.invitationOnly}
                showTrailingConnector={
                  index < rungs.length - 1 && !rungs[index + 1].invitationOnly
                }
                state={
                  index < current
                    ? "completed"
                    : index === current
                      ? "progress"
                      : "upcoming"
                }
              />
            ))}
          </Stepper>
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
      </CardContent>
    </Card>
  );
}

export type { TierLadderCopy, TierLadderProps, TierLadderRung };
export { TierLadder };
