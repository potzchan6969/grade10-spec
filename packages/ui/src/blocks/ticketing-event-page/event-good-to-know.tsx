import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { NoteList, type NoteListItem } from "../page-blocks/note-list";

type EventGoodToKnowCopy = {
  /** The notes' accessible name: `Good to know`. */
  label: string;
};

/** A sign-in hint under the passes: `Early access? Sign in to see your
 * passes.`, its link composed by the page. */
type EventGoodToKnowHint = { id: string; content: ReactNode };

type EventGoodToKnowProps = {
  copy: EventGoodToKnowCopy;
  /** Hints for a signed-out visitor; the page leaves them out once signed
   * in, on a cancelled event and on one that is over. */
  hints?: readonly EventGoodToKnowHint[];
  /** One code per ticket, the PDF by email, what Fast Pass does, the refund
   * policy. */
  notes: readonly NoteListItem[];
  className?: string;
};

/**
 * What to know before buying, under the passes: the sign-in hints, then the
 * short notes one under the other.
 */
function EventGoodToKnow({
  copy,
  hints,
  notes,
  className,
}: EventGoodToKnowProps) {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      data-slot="event-good-to-know"
    >
      {hints && hints.length > 0 ? (
        <div className="flex flex-col gap-1.5 text-sm leading-5 text-secondary-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_button]:font-medium [&_button]:text-foreground [&_button]:underline [&_button]:underline-offset-3">
          {hints.map((hint) => (
            <span key={hint.id}>{hint.content}</span>
          ))}
        </div>
      ) : null}
      <NoteList copy={{ label: copy.label }} notes={notes} slot="event-notes" />
    </div>
  );
}

export type { EventGoodToKnowCopy, EventGoodToKnowHint, EventGoodToKnowProps };
export { EventGoodToKnow };
