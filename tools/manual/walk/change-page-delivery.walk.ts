import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-change-stages-SC-59` in full needs the handoff's own day
 * count too - 3 days from a stage landing to the next hand's first word -
 * which only a real commit history can date, and `demo-store/` is read with
 * `NO_GIT` so every fixture's `handoff` is absent. This walk decides the
 * delivery half alone, on `demo-released`: `main`, staging and the release
 * tag it carries.
 *
 * Its own file, at its own address, for the same reason
 * `change-page-behind-design.walk.ts` is: `demo-released` is a different
 * fixture than `change-page.walk.ts`'s `demo-planned`.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
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
  await expect
    .element(delivery.getByText("staging", { exact: true }))
    .toBeVisible();
  await expect
    .element(delivery.getByText("v2026.09.0", { exact: true }))
    .toBeVisible();
});
