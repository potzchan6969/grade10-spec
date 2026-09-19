import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-change-stages-SC-07`'s first row — `ui_waived:` beside a
 * written `tech-design.md` — which no fixture showed before `demo-waived`:
 * `change-page.walk.ts` reads the rows of a change carrying both lines, and
 * `demo-designed` carries neither. One line standing for one design, with
 * the other design written, is what proves a waiver stands for the file it
 * names rather than for designing at all.
 *
 * Its own file, at its own address, for the reason the other change-page
 * walks each have one: `openManual` reads one address per file, the router
 * having read it as the module loads. `board.walk.ts` reads the same
 * fixture's other half — the Designed lane its waiver reaches.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-07 - a waiver stands for its design on the change page", async () => {
  await openManual("/in-flight/demo-waived");
  await expect
    .element(page.getByRole("heading", { name: "The waived design" }))
    .toBeVisible();

  // The stage the two lines prove: one waiver and one written design reach
  // Designed, read off the eyebrow above the title.
  const eyebrow = document.querySelector("h1")?.previousElementSibling;
  if (!eyebrow) throw new Error("no eyebrow above the change title");
  await expect
    .element(
      page.elementLocator(eyebrow).getByText("Designed", { exact: true }),
    )
    .toBeVisible();

  const artifacts = rowFor("Artifacts");

  // The waived design: not owed and fresh, carrying the reason its line was
  // written with — a row reading "not yet written" would put an impossible
  // job on the designer's list.
  const uiDesign = artifacts.querySelector('[data-artifact="ui-design"]');
  if (!uiDesign) throw new Error("no ui-design row");
  const waived = page.elementLocator(uiDesign);
  await expect
    .element(waived.getByText("not owed", { exact: true }))
    .toBeVisible();
  await expect
    .element(waived.getByText("fresh", { exact: true }))
    .toBeVisible();
  await expect
    .element(waived.getByText("the change draws nothing - no screen moves"))
    .toBeVisible();

  // The design that was written: fresh, and owed by nobody's line — the
  // waiver stands for the UI design alone.
  const techDesign = artifacts.querySelector('[data-artifact="tech-design"]');
  if (!techDesign) throw new Error("no tech-design row");
  const written = page.elementLocator(techDesign);
  await expect
    .element(written.getByText("fresh", { exact: true }))
    .toBeVisible();
  await expect
    .element(written.getByText("not owed", { exact: true }))
    .not.toBeInTheDocument();
});
