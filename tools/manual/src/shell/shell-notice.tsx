import type { ReactNode } from "react";

/**
 * The shell's notice: one strip above the page, saying something about the
 * reading rather than about the route.
 *
 * Two of them are worn — the bundled fixture's line, and the banner that says
 * `main` moved — so the chrome is written here once and neither drifts into a
 * second look for one kind of thing. It is a status, never an alert: nothing
 * it says is a failure the reader has to answer.
 */
export function ShellNotice({
  children,
  slot,
}: {
  children: ReactNode;
  /** What this strip is, for a test that goes looking for it. */
  slot?: string;
}) {
  return (
    <div
      className="mb-8 rounded-lg border border-warning-border bg-background-subtle px-4 py-3"
      data-slot={slot}
      role="status"
    >
      {children}
    </div>
  );
}
