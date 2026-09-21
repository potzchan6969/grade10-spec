import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-change-stages-SC-59`, both halves, on `demo-released`:
 * where the code is - `main`, staging and the release tag it carries - and
 * where the days went, the handoff from each stage's landing to the next
 * hand's first word.
 *
 * The day count is dated by data rather than by history: `demo-store/` is
 * read with `NO_GIT`, so `demo-store/fixture-dates.json` names when each of
 * this change's artifacts landed, the same file and the same mechanism the
 * idle dates already come from.
 *
 * Its own file, at its own address, for the same reason
 * `change-page-behind-design.walk.ts` is: `demo-released` is a different
 * fixture than `change-page.walk.ts`'s `demo-planned`.
 *
 * The clock is frozen at `FROZEN_NOW` before every open: the last stage's
 * handoff is still running and is counted to today, so a walk that let the
 * real clock run would read a different number every day.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-59 - where the code is", async () => {
  await openManual("/in-flight/demo-released");
  await expect
    .element(page.getByRole("heading", { name: "The Released stage" }))
    .toBeVisible();

  const delivery = page.elementLocator(rowFor("Delivery"));
  await expect
    .element(delivery.getByText("main", { exact: true }))
    .toBeVisible();
  // The term reads "staging" on its own; the value beside it joins the
  // environment and the build the deploy recorded.
  await expect
    .element(delivery.getByText("staging", { exact: true }))
    .toBeVisible();
  await expect
    .element(delivery.getByText("staging · 1.4.0-rc2", { exact: true }))
    .toBeVisible();
  await expect
    .element(delivery.getByText("v2026.09.0", { exact: true }))
    .toBeVisible();
});

test("shared-planning-change-stages-SC-59 - where the days went", async () => {
  await openManual("/in-flight/demo-released");
  await expect
    .element(page.getByRole("heading", { name: "The Released stage" }))
    .toBeVisible();

  // The Handoff row waits on the change's own files, which is what dates a
  // stage landing - so it is the last row of the page to arrive.
  await expect
    .element(page.getByText("Handoff", { exact: true }))
    .toBeVisible();

  // Proposed: its journeys landed on 2026-08-05 and the designer's first
  // word - `ui-design.md` - on 2026-08-08, so three days went by between the
  // rung and the hand that took it, shown against that hand.
  const proposed = page.elementLocator(handoffFor("Proposed"));
  await expect
    .element(proposed.getByText("3 days", { exact: true }))
    .toBeVisible();
  await expect
    .element(proposed.getByText("@tester", { exact: true }))
    .toBeVisible();

  // And the rung nothing has followed is counted to today and says so,
  // rather than reading as a stage that took no time at all: `tasks.md`
  // landed on 2026-08-12, which is 38 days before the frozen reading.
  const planned = page.elementLocator(handoffFor("Planned"));
  await expect
    .element(planned.getByText("38 days so far", { exact: true }))
    .toBeVisible();
});

/** One stage's own `<li>` in the Handoff row, found by the stage label the
 * line leads with - scoped that way because every line of the row carries a
 * day count and a hand, and a row-wide search for "3 days" would not say
 * which stage spent them. */
function handoffFor(stage: string): Element {
  const line = Array.from(rowFor("Handoff").querySelectorAll("li")).find(
    (one) => one.textContent?.startsWith(stage),
  );
  if (!line) throw new Error(`no "${stage}" line in the Handoff row`);
  return line;
}
