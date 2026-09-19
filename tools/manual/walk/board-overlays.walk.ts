import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual } from "./setup";

/**
 * What sits beside a change's stage, read on the board the hand opens:
 * `demo-overlays` is the one fixture wearing all five at once — a wait, a
 * dependency that has not shipped, eleven idle days, two behind artifacts and
 * a draft suite — and `demo-approved` is the change beside it in the same
 * lane whose suite QA has been through, so the suite chip reads as a verdict
 * rather than a badge every card wears the same way.
 *
 * Both sit at Planned deliberately: the closed set is proven by one card
 * carrying every chip, and "no stage differs because of an overlay" by the
 * card beside it in the same lane carrying almost none.
 *
 * The clock is frozen at `FROZEN_NOW` before every open: `demo-overlays` is
 * dated 2026-09-08 in `fixture-dates.json`, which only ever reads as eleven
 * idle days — and only ever wears the Idle chip at all — against this one
 * frozen reading.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-19 - the overlays a change wears", async () => {
  await openManual("/in-flight");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "In Flight" }))
    .toBeVisible();

  const overlays = page.elementLocator(cardFor("demo-overlays"));

  // Blocked: the change it waits for, named, because a card that only said
  // "blocked" leaves the reader to find out by what.
  await expect
    .element(overlays.getByText("Blocked", { exact: true }))
    .toBeVisible();
  await expect
    .element(overlays.getByText("demo-planned", { exact: true }))
    .toBeVisible();

  // The suite: a draft verdict here, and the approved one on the card beside
  // it — the same chip, reading what its own suite says.
  await expect
    .element(overlays.getByText("Suite", { exact: true }))
    .toBeVisible();
  await expect
    .element(overlays.getByText("draft", { exact: true }))
    .toBeVisible();

  const approved = page.elementLocator(cardFor("demo-approved"));
  await expect
    .element(approved.getByText("Suite", { exact: true }))
    .toBeVisible();
  await expect
    .element(approved.getByText("approved", { exact: true }))
    .toBeVisible();

  // And nothing outside the set on that card either: one chip, the verdict's
  // own, read the same way `SC-20` reads the card wearing all five.
  expect(
    Array.from(cardFor("demo-approved").querySelectorAll("[data-overlay]")).map(
      (one) => one.getAttribute("data-overlay"),
    ),
  ).toEqual(["suite"]);

  // No stage differs because of an overlay: the card wearing all five and the
  // card wearing one sit in the same lane, the one their files prove.
  const planned = laneSection("planned");
  for (const id of ["demo-overlays", "demo-approved"]) {
    if (!planned.contains(document.getElementById(id))) {
      throw new Error(`${id} is not in the Planned lane`);
    }
  }
});

test("shared-planning-change-stages-SC-20 - nothing outside the set", async () => {
  await openManual("/in-flight");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "In Flight" }))
    .toBeVisible();

  // Exactly the five, in the table's order: read off the `data-overlay` every
  // chip's own `<li>` carries, so a sixth kind would show up here as a word
  // this list does not name rather than as a chip nobody looked at.
  const card = cardFor("demo-overlays");
  await expect
    .element(page.elementLocator(card).getByText("Suite", { exact: true }))
    .toBeVisible();
  const kinds = Array.from(card.querySelectorAll("[data-overlay]")).map((one) =>
    one.getAttribute("data-overlay"),
  );
  expect(kinds).toEqual(["waiting", "blocked", "idle", "behind", "suite"]);

  // And the stage is still the one its files prove, whatever it wears.
  if (!laneSection("planned").contains(card)) {
    throw new Error("demo-overlays is not in the Planned lane");
  }
});

test("shared-planning-change-stages-SC-26 - the card names the earliest behind artifact", async () => {
  await openManual("/in-flight");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "In Flight" }))
    .toBeVisible();

  // `demo-overlays` has two artifacts behind at once — its `reviewed:` line
  // names a content id neither `decisions.md`'s nor `spec.md`'s upstream can
  // match — and the chip names the earliest of them in the schema's order,
  // with the hand the change names for that artifact's role.
  const card = page.elementLocator(cardFor("demo-overlays"));
  await expect.element(card.getByText("Behind", { exact: true })).toBeVisible();
  await expect
    .element(card.getByText("Decisions", { exact: true }))
    .toBeVisible();
  await expect
    .element(card.getByText("@tester", { exact: true }).first())
    .toBeVisible();

  // The later one is not what the card says: one chip, naming the artifact
  // to read again first.
  await expect
    .element(card.getByText("Requirements", { exact: true }))
    .not.toBeInTheDocument();
});

/**
 * `demo-waiting` carries the pair: a dated line on the UI design and an
 * undated one on the tech design, each against the hand its artifact's role
 * names. The card's own half of `SC-21` is here beside the other chips;
 * `change-page-waits.walk.ts` reads the same two lines on the change page,
 * which is the other half the scenario asks for.
 *
 * "No message SHALL be sent for a wait" is not this walk's to decide — no
 * Slack reaches a browser — and `scripts/openspec/changed-changes.test.mjs`
 * proves it over the notify script instead.
 */
test("shared-planning-change-stages-SC-21 - a wait, dated or not, on the card", async () => {
  await openManual("/in-flight");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "In Flight" }))
    .toBeVisible();

  const card = page.elementLocator(cardFor("demo-waiting"));

  // One line per artifact, each naming its own artifact: two chips, not one
  // chip saying the change is waiting.
  await expect
    .element(card.getByText("Waiting", { exact: true }).first())
    .toBeVisible();
  await expect.element(card.getByText("UI", { exact: true })).toBeVisible();
  await expect
    .element(card.getByText("Tech Design", { exact: true }))
    .toBeVisible();

  // As written: the dated line keeps the day it opens with, and the undated
  // one is shown undated rather than dated from somewhere else.
  await expect
    .element(
      card.getByText("2026-09-05 - waiting on the designer's Figma frame", {
        exact: true,
      }),
    )
    .toBeVisible();
  await expect
    .element(
      card.getByText(
        "waiting on the tech PIC to say whether the queue can carry it",
        { exact: true },
      ),
    )
    .toBeVisible();

  // Against the hand that owes it: the designer's line and the tech PIC's
  // line both read `@tester`, the handle this fixture names for each role.
  const owed = Array.from(
    cardFor("demo-waiting").querySelectorAll('[data-overlay="waiting"]'),
  ).map((one) => one.textContent?.includes("@tester"));
  expect(owed).toEqual([true, true]);

  // And the stage is unchanged: a wait is beside it, never a rung of it.
  if (!laneSection("proposed").contains(cardFor("demo-waiting"))) {
    throw new Error("demo-waiting is not in the Proposed lane");
  }
});

/** One change's card, found from the `id={change.id}` its `<article>` carries
 * for deep-linking — the same anchor `/in-flight#<id>` opens, and the same
 * lookup `board.walk.ts` makes. */
function cardFor(id: string): Element {
  const card = document.getElementById(id);
  if (!card) throw new Error(`no card for change "${id}"`);
  return card;
}

/** The lane heading's own `<section>`, found from the `<h2 id={stage}>` every
 * lane carries. */
function laneSection(stage: string): Element {
  const heading = document.getElementById(stage);
  const section = heading?.closest("section");
  if (!section) throw new Error(`no lane section for stage "${stage}"`);
  return section;
}
