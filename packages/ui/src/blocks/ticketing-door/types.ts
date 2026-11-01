/**
 * Where a door block is drawn: a phone at the gate, or the console's
 * full-screen door on a laptop or tablet.
 */
type DoorLayout = "phone" | "console";

/**
 * Every answer a scan or an Admit can give. The kind picks the tone and the
 * icon, so an answer reads the same with the sound off; its words come from
 * the consumer.
 */
type DoorAnswerKind =
  | "admitted"
  | "alreadyAdmitted"
  | "noEntriesLeft"
  | "void"
  | "eventCancelled"
  | "notATicket"
  | "wrongEvent"
  | "notValidToday"
  | "notChecked"
  | "undone";

/** One label–value line under an answer, in display-ready words. */
type DoorDetail = {
  label: string;
  value: string;
  /** A ticket code or order reference, set in the monospace face. */
  code?: boolean;
};

export type { DoorAnswerKind, DoorDetail, DoorLayout };
