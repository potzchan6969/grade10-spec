import { Alert } from "@grade10/design-system/components/display/alert";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Textarea } from "@grade10/design-system/components/forms/textarea";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import type { GradingListedCard } from "./types";

/** One outcome of a pasted list: how many lines it took, the line that words
 * it, and the cards it made. */
type GradingPasteOutcome = {
  count: number;
  line: string;
  cards?: readonly GradingListedCard[];
};

/** What the paste made of every line read. The five counts are the
 * consumer's; the sheet adds none of them up. */
type GradingPasteResult = {
  matched: GradingPasteOutcome;
  keptAsTyped: GradingPasteOutcome;
  withoutValue: GradingPasteOutcome;
  aboveCeiling: GradingPasteOutcome;
  /** A card already on the list, skipped. It makes no card. */
  skipped: GradingPasteOutcome;
};

/**
 * The paste's condition. `error` still carries the result it read, because a
 * reference that cannot be asked keeps every line rather than losing it.
 */
type GradingPasteState =
  | { status: "loading" }
  | { status: "empty"; message: string }
  | { status: "error"; message: string; result?: GradingPasteResult }
  | { status: "ready"; result: GradingPasteResult };

type GradingPasteSheetCopy = {
  title: string;
  body: string;
  textLabel: string;
  textPlaceholder: string;
  /** Leads the count of lines read. */
  linesReadLabel: string;
  /** Read by the counter instead of the count while the paste is matched. */
  matching: string;
  matched: string;
  keptAsTyped: string;
  withoutValue: string;
  aboveCeiling: string;
  skipped: string;
  /** Read instead of the kept-as-typed line while the reference is out of reach. */
  catalogueUnavailable: string;
  add: string;
  close: string;
};

type GradingPasteSheetProps = {
  copy: GradingPasteSheetCopy;
  open: boolean;
  text: string;
  /** The lines the consumer read out of the text. */
  linesRead: number;
  result?: GradingPasteState;
  /** What a list past the shorter visit's count reads. */
  bulkNotice?: string;
  /** What a card above the level's ceiling means for the drop-off. */
  secondSubmissionLine?: string;
  onChange: (text: string) => void;
  onApply: (cards: readonly GradingListedCard[]) => void;
  onClose: () => void;
  className?: string;
};

/**
 * A pasted list, one card a line, and what the paste made of each: matched,
 * kept as typed, without a value, above the ceiling, and skipped.
 *
 * Nothing is added until the result is in hand: with nothing read, and while
 * the result reads as loading, the add reports nothing and the counter reads
 * the matching word rather than a count. `onApply` carries the
 * cards the paste made, which the composing page feeds to `GradingCardList`.
 */
function GradingPasteSheet({
  copy,
  open,
  text,
  linesRead,
  result,
  bulkNotice,
  secondSubmissionLine,
  onChange,
  onApply,
  onClose,
  className,
}: GradingPasteSheetProps) {
  const read = result?.status === "ready" ? result.result : undefined;
  const unreachable = result?.status === "error";
  const shown = read ?? (unreachable ? result.result : undefined);
  const canAdd = shown != null && linesRead > 0;

  return (
    <Drawer
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      open={open}
    >
      <DrawerContent
        aria-label={copy.title}
        className={className}
        data-slot="grading-paste-sheet"
      >
        <DrawerHeader showCloseButton={false}>
          <DrawerTitle>{copy.title}</DrawerTitle>
          <DrawerDescription>{copy.body}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <Textarea
            label={copy.textLabel}
            onChange={(event) => onChange(event.target.value)}
            placeholder={copy.textPlaceholder}
            rows={6}
            value={text}
          />
          <Text
            data-slot="grading-paste-sheet-lines"
            size="sm"
            tone="secondary"
          >
            {result?.status === "loading"
              ? copy.matching
              : `${copy.linesReadLabel} ${linesRead}`}
          </Text>
          {result?.status === "loading" ? (
            <Skeleton className="h-24 w-full" />
          ) : null}
          {result?.status === "empty" ? (
            <Text
              data-slot="grading-paste-sheet-empty"
              size="sm"
              tone="secondary"
            >
              {result.message}
            </Text>
          ) : null}
          {unreachable ? (
            <Text data-slot="grading-paste-sheet-error" size="sm" tone="error">
              {result.message}
            </Text>
          ) : null}
          {shown ? (
            <List data-slot="grading-paste-sheet-result">
              <OutcomeRow
                label={copy.matched}
                outcome={shown.matched}
                slot="matched"
              />
              <OutcomeRow
                label={copy.keptAsTyped}
                line={unreachable ? copy.catalogueUnavailable : undefined}
                outcome={shown.keptAsTyped}
                slot="kept-as-typed"
              />
              <OutcomeRow
                label={copy.withoutValue}
                outcome={shown.withoutValue}
                slot="without-a-value"
              />
              <OutcomeRow
                label={copy.aboveCeiling}
                outcome={shown.aboveCeiling}
                slot="above-the-ceiling"
              />
              <OutcomeRow
                divider={false}
                label={copy.skipped}
                outcome={shown.skipped}
                slot="skipped"
              />
            </List>
          ) : null}
          {shown && secondSubmissionLine ? (
            <Text
              data-slot="grading-paste-sheet-second-submission"
              size="sm"
              tone="warning"
            >
              {secondSubmissionLine}
            </Text>
          ) : null}
          {bulkNotice ? (
            <Alert
              data-slot="grading-paste-sheet-bulk"
              dismissible={false}
              status="default"
              title={bulkNotice}
            />
          ) : null}
        </DrawerBody>
        <DrawerFooter>
          <Button
            disabled={!canAdd}
            onClick={() => {
              if (!shown) return;
              onApply([
                ...(shown.matched.cards ?? []),
                ...(shown.keptAsTyped.cards ?? []),
                ...(shown.withoutValue.cards ?? []),
                ...(shown.aboveCeiling.cards ?? []),
              ]);
            }}
          >
            {copy.add}
          </Button>
          <Button onClick={onClose} variant="secondary">
            {copy.close}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function OutcomeRow({
  divider = true,
  label,
  line,
  outcome,
  slot,
}: {
  divider?: boolean;
  label: string;
  line?: string;
  outcome: GradingPasteOutcome;
  slot: string;
}) {
  return (
    <ListItem
      data-slot={`grading-paste-sheet-${slot}`}
      description={line ?? outcome.line}
      divider={divider}
    >
      <VStack gap="none" hAlign="stretch">
        <Text size="sm" weight="medium">
          {`${label}: ${outcome.count}`}
        </Text>
      </VStack>
    </ListItem>
  );
}

export type {
  GradingPasteOutcome,
  GradingPasteResult,
  GradingPasteSheetCopy,
  GradingPasteSheetProps,
  GradingPasteState,
};
export { GradingPasteSheet };
