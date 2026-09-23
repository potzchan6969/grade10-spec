import { hkDate } from "@/emails/_components/format";
import { Note } from "@/emails/vault/_components/vault-letter";

export type ReminderScheduleProps = {
  /** The dates the borrower will next hear from us. Empty once a notice stands. */
  dates: readonly string[];
};

const listed = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

/**
 * When the borrower will hear from us next, and that a reminder adds
 * nothing to what is owed. Once a forfeiture notice stands, no further
 * reminder follows, so this renders that instead of a schedule.
 */
export function ReminderSchedule({ dates }: ReminderScheduleProps) {
  if (dates.length === 0) {
    return <Note>No further reminder follows this one.</Note>;
  }

  return (
    <Note>
      We will write again on {listed.format(dates.map(hkDate))}. A reminder adds
      nothing to what you owe.
    </Note>
  );
}
