import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-change-stages-SC-85`: the UI design alone proves
 * Designed. `demo-design-waived` is that change — its decisions, its journeys
 * and its `hands:` are in, `ui_waived:` answers the UI design, and nothing
 * answers the tech design — so the ladder reaches Designed and the tech
 * design is still owed, at Specified.
 *
 * Its own file, at its own address, for the reason the other change-page
 * walks each have one: `openManual` reads one address per file, the router
 * having read it as the module loads.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-85 - the UI design's waiver alone reaches Designed", async () => {
  await openManual("/in-flight/demo-design-waived");
  await expect
    .element(page.getByRole("heading", { name: "The UI design waived" }))
    .toBeVisible();

  const eyebrow = document.querySelector("h1")?.previousElementSibling;
  if (!eyebrow) throw new Error("no eyebrow above the change title");
  await expect
    .element(
      page.elementLocator(eyebrow).getByText("Designed", { exact: true }),
    )
    .toBeVisible();

  const artifacts = rowFor("Artifacts");

  // The waived design is answered: not owed and fresh, with its reason.
  const uiDesign = artifacts.querySelector('[data-artifact="ui-design"]');
  if (!uiDesign) throw new Error("no ui-design row");
  const waived = page.elementLocator(uiDesign);
  await expect
    .element(waived.getByText("not owed", { exact: true }))
    .toBeVisible();
  await expect
    .element(waived.getByText("nothing is drawn - the change moves no screen"))
    .toBeVisible();

  // The tech design is Specified's, so it is still to write and holds
  // nothing at Designed.
  const techDesign = artifacts.querySelector('[data-artifact="tech-design"]');
  if (!techDesign) throw new Error("no tech-design row");
  const owed = page.elementLocator(techDesign);
  await expect
    .element(owed.getByText("not yet written", { exact: true }))
    .toBeVisible();
  await expect
    .element(owed.getByText("not owed", { exact: true }))
    .not.toBeInTheDocument();
});
