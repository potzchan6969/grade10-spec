import { Badge } from "@grade10/design-system/components/display/badge";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import type { GradingTone } from "./types";

type GradingOwnershipChipCopy = {
  /** Where the submission stands. */
  status: string;
  /** Whose move it is. A closed submission has none. */
  chip?: string;
};

type GradingOwnershipChipProps = {
  copy: GradingOwnershipChipCopy;
  statusTone: GradingTone;
  chipTone?: GradingTone;
  className?: string;
};

/**
 * The status word and whose move it is, drawn as one pair so the two can never
 * disagree. Both words and both tones are given: the block derives neither
 * from the other and carries no status vocabulary of its own.
 */
function GradingOwnershipChip({
  copy,
  statusTone,
  chipTone = "outline",
  className,
}: GradingOwnershipChipProps) {
  return (
    <HStack
      className={className}
      data-slot="grading-ownership-chip"
      gap="sm"
      vAlign="center"
    >
      <Badge data-slot="grading-ownership-status" variant={statusTone}>
        {copy.status}
      </Badge>
      {copy.chip ? (
        <Badge data-slot="grading-ownership-move" variant={chipTone}>
          {copy.chip}
        </Badge>
      ) : null}
    </HStack>
  );
}

export type { GradingOwnershipChipCopy, GradingOwnershipChipProps };
export { GradingOwnershipChip };
