import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual } from "./setup";

/**
 * QA is a hand of Specified: the landing that puts the suite up for review is
 * a move to them. `demo-specified` names `tester` as its QA hand, so My turn
 * lists the Specified stage on them now, with the review command to paste,
 * and the change page's Told now quotes the message they were sent — the
 * suite, its case count, and that the walk names this review as its input
 * (`shared-planning-agent-rounds-SC-89`; decides
 * `shared-planning-agent-rounds-US11-TC1-1`).
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-agent-rounds-SC-89 - QA's turn at Specified, on My turn", async () => {
  localStorage.clear();
  await openManual("/my-turn");

  await page.getByRole("textbox", { name: "Your handle" }).fill("tester");
  await page.getByRole("button", { name: "Remember me" }).click();

  const now = page.elementLocator(sectionFor("On you now"));
  await expect
    .element(now.getByRole("link", { name: "The Specified stage" }))
    .toBeVisible();
  await expect
    .element(now.getByText("/tcs-review demo-specified", { exact: true }))
    .toBeVisible();
});

/** The section under one `h2`, up to the next. */
function sectionFor(heading: string): Element {
  const h2 = Array.from(document.querySelectorAll("h2")).find(
    (one) => one.textContent?.trim() === heading,
  );
  if (!h2) throw new Error(`no section headed ${heading}`);
  const section = h2.closest("section") ?? h2.parentElement;
  if (!section) throw new Error(`no section around ${heading}`);
  return section;
}
