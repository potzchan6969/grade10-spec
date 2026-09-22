import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { openManual } from "./setup";

/**
 * `shared-planning-agent-rounds-US-09`, the second half of
 * `shared-planning-agent-rounds-SC-51`: a ticked task group with no row
 * reads as having none. Split from `rounds-record.walk.ts`'s first half
 * (one line per round) because the two need different addresses, and
 * `setup.ts`'s own `openManual` reads its address once as the module loads —
 * a second, different address is a second walk, not a second call here.
 *
 * `demo-building` is left exactly as the other fixtures found it: its one
 * task group carries a tick and no `rounds.md` at all, so its row reads "no
 * round" rather than going missing.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-19T12:00:00+08:00"));
});

afterEach(() => {
  vi.useRealTimers();
});

test("shared-planning-agent-rounds-SC-51 - a ticked group with no row reads no round", async () => {
  await openManual("/in-flight/demo-building");
  await expect
    .element(
      page.getByRole("heading", { level: 1, name: "The Building stage" }),
    )
    .toBeVisible();

  const rounds = page.elementLocator(rowFor("Rounds"));

  // The fixture's only task group has a tick and no `rounds.md` — no round
  // badge names it, and the row reads "no round" rather than going missing.
  await expect
    .element(rounds.getByText("Group 1", { exact: true }))
    .toBeVisible();
  await expect
    .element(rounds.getByText("no round", { exact: true }))
    .toBeVisible();
  await expect.element(rounds.getByText(/^Round \d/)).not.toBeInTheDocument();
});

/**
 * The `<dd>` beside a `ChangeStatus` row's `<dt>` — the same lookup
 * `change-page.walk.ts` uses, scoped by the label because more than one row
 * can carry the same word inside a chip.
 */
function rowFor(label: string): Element {
  const term = Array.from(document.querySelectorAll("dt")).find(
    (dt) => dt.textContent?.trim() === label,
  );
  const value = term?.nextElementSibling;
  if (!value) throw new Error(`no "${label}" row on the change page`);
  return value;
}
