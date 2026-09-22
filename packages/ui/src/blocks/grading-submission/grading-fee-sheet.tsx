import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { Text } from "@grade10/design-system/components/display/text";
import { SegmentedControl } from "@grade10/design-system/components/forms/segmented-control";
import { SegmentedControlItem } from "@grade10/design-system/components/forms/segmented-control-item";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { formatGradingMoney, type GradingLocaleProps } from "./grading-copy";
import type { GradingFeeSheetRecord } from "./types";

type GradingFeeSheetCopy = {
  title: string;
  /** The column headings, in the order the sheet draws them. */
  level: string;
  ceiling: string;
  cardsPerSubmission: string;
  feePerCard: string;
  cover: string;
  weeks: string;
  /** What a level carrying no cover rate reads in the cover column. */
  noCover: string;
};

type GradingFeeSheetProps = GradingLocaleProps & {
  copy: GradingFeeSheetCopy;
  graders: readonly GradingFeeSheetRecord[];
  selectedGraderId: string;
  /** What a card worth more than any level takes reads, where given. */
  aboveTopLine?: string;
  onSelectGrader: (graderId: string) => void;
  className?: string;
};

/**
 * One fee sheet a grader: every level's ceiling, the cards a submission, the
 * fee a card, the cover rate where the level carries one, and the weeks back.
 *
 * Every figure is the record it was given, so this block and
 * `GradingLevelPicker` are two drawings of one sheet and cannot disagree. One
 * grader draws no grader control.
 *
 * A `selectedGraderId` naming no grader throws by name rather than falling
 * back to the first: a page that believes one grader is picked must not read
 * another's prices with the substitute marked selected.
 */
function GradingFeeSheet({
  copy,
  graders,
  selectedGraderId,
  aboveTopLine,
  onSelectGrader,
  locale = "en",
  className,
}: GradingFeeSheetProps) {
  const selected = graders.find((grader) => grader.id === selectedGraderId);
  if (selected == null) {
    throw new Error(
      `GradingFeeSheet: selectedGraderId "${selectedGraderId}" names no grader`,
    );
  }

  return (
    <VStack className={className} data-slot="grading-fee-sheet" gap="md">
      <Text as="h2" size="lg" weight="medium">
        {copy.title}
      </Text>
      {graders.length > 1 ? (
        <SegmentedControl
          data-slot="grading-fee-sheet-graders"
          onValueChange={(next) => {
            const picked = next.at(0);
            if (typeof picked === "string") onSelectGrader(picked);
          }}
          value={[selected.id]}
        >
          {graders.map((grader) => (
            <SegmentedControlItem key={grader.id} value={grader.id}>
              {grader.name}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      ) : null}
      {selected.figuresLine ? (
        <Text data-slot="grading-fee-sheet-figures" size="sm" tone="secondary">
          {selected.figuresLine}
        </Text>
      ) : null}
      <Table data-slot="grading-fee-sheet-table">
        <TableHeader>
          <TableHead>{copy.level}</TableHead>
          <TableHead>{copy.ceiling}</TableHead>
          <TableHead>{copy.cardsPerSubmission}</TableHead>
          <TableHead>{copy.feePerCard}</TableHead>
          <TableHead>{copy.cover}</TableHead>
          <TableHead>{copy.weeks}</TableHead>
        </TableHeader>
        <TableBody>
          {selected.levels.map((level) => (
            <TableRow data-slot="grading-fee-sheet-level" key={level.id}>
              <TableCell>{level.name}</TableCell>
              <TableCell>{formatGradingMoney(level.ceiling, locale)}</TableCell>
              <TableCell>{level.cardsPerSubmission}</TableCell>
              <TableCell>
                {formatGradingMoney(level.feePerCard, locale)}
              </TableCell>
              <TableCell>{level.coverRate ?? copy.noCover}</TableCell>
              <TableCell>{level.weeks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {aboveTopLine ? (
        <Text
          data-slot="grading-fee-sheet-above-top"
          size="sm"
          tone="secondary"
        >
          {aboveTopLine}
        </Text>
      ) : null}
    </VStack>
  );
}

export type { GradingFeeSheetCopy, GradingFeeSheetProps };
export { GradingFeeSheet };
