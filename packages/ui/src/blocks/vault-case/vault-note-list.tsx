import { List, ListItem } from "@grade10/design-system/components/display/list";
import type { ReactNode } from "react";

/** One line: a stable id, and what it reads, a link included. */
type VaultNote = { id: string; content: ReactNode };

type VaultNoteListCopy = {
  /** The list's accessible name, where one is wanted. */
  label?: string;
};

type VaultNoteListProps = {
  copy?: VaultNoteListCopy;
  notes: readonly VaultNote[];
  className?: string;
};

/**
 * Short lines one under the other, in the order given. A divider sits under
 * every line but the last, whichever lines the consumer includes, so a list
 * whose last line depends on the case never ends on a divider or loses one
 * between two lines. No lines draws nothing.
 */
function VaultNoteList({ copy, notes, className }: VaultNoteListProps) {
  if (notes.length === 0) return null;

  return (
    <List aria-label={copy?.label} className={className}>
      {notes.map((note, at) => (
        <ListItem divider={at < notes.length - 1} key={note.id}>
          {note.content}
        </ListItem>
      ))}
    </List>
  );
}

export type { VaultNote, VaultNoteListCopy, VaultNoteListProps };
export { VaultNoteList };
