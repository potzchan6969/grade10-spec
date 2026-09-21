import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-change-stages-SC-25` needs a UI design drawn from a
 * linked page section and read again, so it needs a change whose UI design
 * is written rather than waived — `demo-designed` is the one fixture in
 * this store that carries a real `ui-design.md`, and its proposal already
 * links `## Discounts` for `section-pip.walk.ts`'s own `SC-67`. Its
 * `reviewed: {"ui-design": …}` names a content id `## Discounts`'s current
 * text can never match, which is what puts it behind without needing the
 * section to actually move under this walk.
 *
 * `shared-planning-change-stages-SC-57`'s own wrap case reads `demo-designed`
 * too: its mark, "both designs, from the page and the journeys", is the
 * longest an agent drafts and the one long enough to wrap the one-line
 * stepper's badge at a phone's width.
 *
 * Its own file, at its own address: `demo-designed` is a different fixture
 * than `change-page.walk.ts`'s `demo-planned`, and a second, different
 * address in one file leaves the mounted router pointed at the first.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

// The wrap case below narrows the viewport; every other case in this file
// reads at the suite's own default (414×896), so it is undone here rather
// than left to bleed into the next test's mount.
afterEach(async () => {
  await page.viewport(414, 896);
});

test("shared-planning-change-stages-SC-25 - a page line changes after an artifact was drawn", async () => {
  await openManual("/in-flight/demo-designed");
  // `level: 1` alongside `name` finds nothing on this one fixture though its
  // own `<h1>` renders with exactly this text and no other heading repeats
  // it — a Chromium accessibility-tree quirk this page alone seems to trip;
  // the name alone is unambiguous enough to wait on.
  await expect
    .element(page.getByRole("heading", { name: "The Designed stage" }))
    .toBeVisible();

  const artifacts = rowFor("Artifacts");
  const uiDesign = artifacts.querySelector('[data-artifact="ui-design"]');
  if (!uiDesign) throw new Error("no ui-design row");
  const uiDesignRow = page.elementLocator(uiDesign);

  await expect
    .element(uiDesignRow.getByText("behind", { exact: true }))
    .toBeVisible();
  await expect
    .element(
      uiDesignRow.getByText(
        "read again against docs/prds/products/demo-product/index.md#discounts",
      ),
    )
    .toBeVisible();
});

/**
 * `shared-planning-change-stages-SC-57`'s wrap case: below `sm`, the
 * one-line stepper reuses the lane heading's own full `Badge`, and Designed
 * carries the longest mark an agent drafts — the one the fixture screenshots
 * caught clipping instead of growing the badge.
 */
test("shared-planning-change-stages-SC-57 - a wrapping caption grows the one-line stepper's badge", async () => {
  await openManual("/in-flight/demo-designed");
  await page.viewport(375, 800);

  // Same Chromium accessibility-tree quirk as SC-25 above: `level: 1`
  // alongside `name` finds nothing on this one fixture.
  await expect
    .element(page.getByRole("heading", { name: "The Designed stage" }))
    .toBeVisible();

  const oneLine = document.querySelector('[data-stepper="one-line"]');
  if (!oneLine) throw new Error("no one-line stepper below sm");
  await expect
    .element(
      page.elementLocator(oneLine).getByText("Step 2 of 8 · Designed", {
        exact: true,
      }),
    )
    .toBeVisible();

  const badge = oneLine.querySelector('[data-slot="badge"]');
  if (!badge) throw new Error("no badge in the one-line stepper");
  if (!badge.textContent?.includes("agent drafts")) {
    throw new Error(
      `badge text "${badge.textContent}" does not read "agent drafts"`,
    );
  }
  // A wrap grows the badge instead of clipping it: the badge's own scroll
  // height never runs past what it lays out to.
  if (badge.scrollHeight > badge.clientHeight) {
    throw new Error(
      `badge clips its own wrap: scrollHeight ${badge.scrollHeight} > clientHeight ${badge.clientHeight}`,
    );
  }
});
