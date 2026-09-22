import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { STORAGE } from "../src/editor/config";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual } from "./setup";

/**
 * My turn: the handle picker in the page heading, what is on `tester` across
 * the fixture store, and the two refusals - no handle yet, a handle the team
 * map does not know.
 *
 * `tester` carries two open questions (`demo-building`'s and
 * `demo-specified`'s `## Decisions` rows, each `❓ tester - …`), is the `dev`
 * hand of `demo-building` at its current stage (Building, whose `HANDS_AT`
 * names `dev`) and is the `dev` hand of `demo-specified`, a stage still ahead
 * of `dev`'s own turn - so the same two fixtures the section-pip and my-turn
 * cases both need carry every state this file decides. `other` is left
 * exactly as the store already has it: no question, no hand, no wait, which
 * is what SC-61 needs and no fixture edit has to manufacture.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-62 - before a handle is chosen", async () => {
  localStorage.clear();
  await openManual("/my-turn");

  await expect
    .element(
      page.getByText("Choose a handle to see the changes you are a hand of"),
    )
    .toBeVisible();
  await expect
    .element(page.getByRole("textbox", { name: "Your handle" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("heading", { level: 2, name: "On you now" }))
    .not.toBeInTheDocument();
  await expect
    .element(page.getByRole("heading", { level: 2, name: "Yours later" }))
    .not.toBeInTheDocument();
  await expect
    .element(page.getByRole("heading", { level: 2, name: "Open questions" }))
    .not.toBeInTheDocument();
});

test("shared-planning-change-stages-SC-60 - the order of the page", async () => {
  localStorage.clear();
  await openManual("/my-turn");

  await page.getByRole("textbox", { name: "Your handle" }).fill("tester");
  await page.getByRole("button", { name: "Remember me" }).click();

  await expect
    .element(page.getByRole("heading", { level: 2, name: "Open questions" }))
    .toBeVisible();

  // The page's own order: the open questions' section, then "On you now",
  // then "Yours later" - read off the DOM order itself rather than off
  // text offsets, which two changes sharing a title would leave ambiguous.
  await expect
    .element(page.getByRole("heading", { level: 2, name: "Yours later" }))
    .toBeVisible();
  const headings = Array.from(document.querySelectorAll("h2")).map((heading) =>
    heading.textContent?.trim(),
  );
  expect(headings).toEqual(["Open questions", "On you now", "Yours later"]);

  const questions = page.elementLocator(sectionFor("Open questions"));
  await expect
    .element(questions.getByText("Whether the group ships behind a flag"))
    .toBeVisible();
  await expect
    .element(questions.getByText("Whether the suite ships blind first"))
    .toBeVisible();
  await expect
    .element(questions.getByText("Q1", { exact: true }).first())
    .toBeVisible();
  await expect
    .element(questions.getByRole("link", { name: "The Building stage" }))
    .toBeVisible();
  await expect
    .element(questions.getByRole("link", { name: "The Specified stage" }))
    .toBeVisible();

  const now = page.elementLocator(sectionFor("On you now"));
  await expect
    .element(now.getByRole("link", { name: "The Building stage" }))
    .toBeVisible();

  const later = page.elementLocator(sectionFor("Yours later"));
  await expect
    .element(later.getByRole("link", { name: "The Specified stage" }))
    .toBeVisible();
});

test("shared-planning-change-stages-SC-61 - nothing on the reader", async () => {
  localStorage.clear();
  await openManual("/my-turn");

  await page.getByRole("textbox", { name: "Your handle" }).fill("other");
  await page.getByRole("button", { name: "Remember me" }).click();

  await expect.element(page.getByText("Nothing on you")).toBeVisible();
  await expect
    .element(
      page.getByText(
        "No open question is addressed to you, and no change in flight names you for a hand.",
      ),
    )
    .toBeVisible();
});

test("shared-planning-change-stages-SC-63 - the remembered handle is read from the key", async () => {
  localStorage.setItem(STORAGE.handle, "tester");
  await openManual("/my-turn");

  // Read without asking: "Reading as" rather than the choosing sentence, and
  // the field already carries the handle the key names.
  await expect.element(page.getByText("Reading as")).toBeVisible();
  await expect
    .element(page.getByRole("textbox", { name: "Your handle" }))
    .toHaveValue("tester");
  await expect
    .element(page.getByRole("heading", { level: 2, name: "On you now" }))
    .toBeVisible();
});

test("shared-planning-change-stages-SC-64 - a handle the team map does not know", async () => {
  localStorage.clear();
  await openManual("/my-turn");

  await page.getByRole("textbox", { name: "Your handle" }).fill("ghost");
  await page.getByRole("button", { name: "Remember me" }).click();

  await expect
    .element(page.getByText(/is not a handle this store knows/))
    .toBeVisible();
  await expect
    .element(page.getByText("docs/prds/team.yaml", { exact: true }))
    .toBeVisible();
  await expect
    .element(page.getByRole("heading", { level: 2, name: "On you now" }))
    .not.toBeInTheDocument();
});

/** One `<h2>` of My turn's own sections and the `<section>` it heads - the
 * same lookup `board.walk.ts`'s `laneSection` makes of a lane heading,
 * because a page's own words are what a reader and this walk both scope by. */
function sectionFor(heading: string): Element {
  const found = Array.from(document.querySelectorAll("h2")).find(
    (one) => one.textContent?.trim() === heading,
  );
  const section = found?.closest("section");
  if (!section) throw new Error(`no "${heading}" section on My turn`);
  return section;
}
