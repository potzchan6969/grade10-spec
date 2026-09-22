import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-change-stages-SC-21` reads its pair of waits on the card
 * and on the change page both. `board-overlays.walk.ts` reads the card's
 * half at `/in-flight`; this is the page's, at `demo-waiting`'s own address —
 * its own file because `openManual` reads one address per file, the router
 * having read it as the module loads.
 *
 * `demo-waiting` carries a dated line on the UI design and an undated one on
 * the tech design, and names `@tester` for both roles, so each line has a
 * hand to be shown against.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-21 - a wait, dated or not, on the change page", async () => {
  await openManual("/in-flight/demo-waiting");
  await expect
    .element(page.getByRole("heading", { name: "The Waiting overlay" }))
    .toBeVisible();

  const beside = rowFor("Beside the stage");
  const chips = page.elementLocator(beside);

  // One line per artifact, each named: the page says which design is waited
  // on rather than that the change is waiting.
  await expect.element(chips.getByText("UI", { exact: true })).toBeVisible();
  await expect
    .element(chips.getByText("Tech Design", { exact: true }))
    .toBeVisible();

  // As written, dated and undated alike.
  await expect
    .element(
      chips.getByText("2026-09-05 - waiting on the designer's Figma frame", {
        exact: true,
      }),
    )
    .toBeVisible();
  await expect
    .element(
      chips.getByText(
        "waiting on the tech PIC to say whether the queue can carry it",
        { exact: true },
      ),
    )
    .toBeVisible();

  // Against the hand that owes it: both roles are `@tester` here, so the
  // reading is per line rather than page-wide — each `waiting` chip carries
  // the handle of its own artifact's hand.
  const owed = Array.from(
    beside.querySelectorAll('[data-overlay="waiting"]'),
  ).map((one) => one.textContent?.includes("@tester"));
  expect(owed).toEqual([true, true]);

  // And the stage is unchanged: the eyebrow above the title still reads the
  // rung the change's files prove, with the waits beside it.
  const eyebrow = document.querySelector("h1")?.previousElementSibling;
  if (!eyebrow) throw new Error("no eyebrow above the change title");
  await expect
    .element(
      page.elementLocator(eyebrow).getByText("Proposed", { exact: true }),
    )
    .toBeVisible();
});
