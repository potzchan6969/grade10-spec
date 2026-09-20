import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * The hand's arrival on the change page: what the message they were told
 * about it points at, read mostly on `demo-planned` — the Behind fixture,
 * held at Planned with nothing ticked yet and `decisions.md` moved after it
 * was reviewed — with `demo-designed` for the one behind reading a real
 * (unwaived) UI design needs, and `demo-released` for delivery.
 *
 * The clock is frozen at `FROZEN_NOW` before every open — the same instant
 * the other walks freeze it, for the same reason: nothing on this page
 * reads a day count, but a walk that opened the manual with the real clock
 * running would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-57 - the stepper marks the stage", async () => {
  await openManual("/in-flight/demo-planned");

  await expect
    .element(page.getByRole("heading", { level: 1, name: "The Planned stage" }))
    .toBeVisible();

  // The eyebrow: the stage badge beside "In Flight", above the title.
  const eyebrow = document.querySelector("h1")?.previousElementSibling;
  if (!eyebrow) throw new Error("no eyebrow above the change title");
  await expect
    .element(page.elementLocator(eyebrow).getByText("Planned", { exact: true }))
    .toBeVisible();

  // The eight-step row `data-stepper="steps"` carries, hidden below `sm` but
  // in the DOM regardless of this walk's own 414px viewport: every stage
  // named, Planned marked as the one the change is in.
  const steps = document.querySelector('[data-stepper="steps"]');
  if (!steps) throw new Error("no eight-step stepper");
  const eightStep = page.elementLocator(steps);
  for (const label of [
    "Proposed",
    "Designed",
    "Specified",
    "Planned",
    "Building",
    "On staging",
    "Released",
    "Archived",
  ]) {
    await expect
      .element(eightStep.getByText(label, { exact: true }))
      .toBeInTheDocument();
  }
  const plannedStep = steps
    .querySelector('[data-stage="planned"]')
    ?.querySelector("[data-state]");
  if (!plannedStep) throw new Error("no planned step");
  if (plannedStep.getAttribute("data-state") !== "progress") {
    throw new Error(
      `Planned step's own state is "${plannedStep.getAttribute("data-state")}", not the one marked as current`,
    );
  }

  // The stepper, as this walk's own viewport (414px, below `sm`) reads it:
  // the one line the design draws for a phone's width rather than the
  // eight-step desktop row above — the stage's position of eight, its name,
  // and the mark and the move beneath it.
  const oneLine = document.querySelector('[data-stepper="one-line"]');
  if (!oneLine) throw new Error("no one-line stepper below sm");
  const stepper = page.elementLocator(oneLine);

  await expect
    .element(stepper.getByText("Step 4 of 8 · Planned", { exact: true }))
    .toBeVisible();
  await expect
    .element(stepper.getByText("agent drafts the plan"))
    .toBeVisible();
  await expect
    .element(stepper.getByText("read", { exact: true }))
    .toBeVisible();
});

test("shared-planning-change-stages-SC-58 - the Your turn card", async () => {
  await openManual("/in-flight/demo-planned");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "The Planned stage" }))
    .toBeVisible();

  const cardEl = document.querySelector('[data-slot="card"]');
  if (!cardEl) throw new Error("no Your turn card");
  const card = page.elementLocator(cardEl);

  // The hand: nobody is named as the engineer, so the card routes to the
  // role's channel by name rather than leaving the row blank.
  await expect
    .element(
      card.getByText(
        "No engineer is named — this goes to the engineer channel",
      ),
    )
    .toBeVisible();

  // No thread is recorded for this fixture, so the card falls back to
  // naming itself as the link to share.
  await expect
    .element(card.getByRole("link", { name: "This page" }))
    .toBeVisible();
  await expect
    .element(
      card.getByText(
        "is the link to share: no thread is recorded for this change yet.",
      ),
    )
    .toBeVisible();

  // The command: Planned's own move, the change's id written in - the one
  // offered to paste, named by its own copy control, because Told now quotes
  // the same line inside the message below it.
  await expect
    .element(card.getByRole("button", { name: "Copy /tasks demo-planned" }))
    .toBeVisible();
  await expect
    .element(card.getByText("Engineer: read", { exact: true }))
    .toBeVisible();
});

/**
 * `shared-planning-change-stages-SC-17` ("A hand nobody has named") read on
 * the change page's own hands table rather than a card: `demo-planned`
 * names no role at all, so every one of the six SHALL still read as a row,
 * open, the engineer among them.
 */
test("shared-planning-change-stages-SC-17 - the hands table with an open role", async () => {
  await openManual("/in-flight/demo-planned");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "The Planned stage" }))
    .toBeVisible();

  const hands = page.elementLocator(rowFor("Hands"));

  // This fixture names no hand at all: every role reads as open, the
  // engineer's among them.
  await expect
    .element(hands.getByText("Engineer", { exact: true }))
    .toBeVisible();
  await expect
    .element(hands.getByText("open", { exact: true }).first())
    .toBeVisible();
});

test("shared-planning-change-stages-SC-07 - either waiver stands for its design", async () => {
  await openManual("/in-flight/demo-planned");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "The Planned stage" }))
    .toBeVisible();

  const artifacts = rowFor("Artifacts");

  // Fresh: proposal and tasks are written, and nothing before either has
  // moved since.
  const proposal = artifacts.querySelector('[data-artifact="proposal"]');
  if (!proposal) throw new Error("no proposal row");
  await expect
    .element(page.elementLocator(proposal).getByText("fresh", { exact: true }))
    .toBeVisible();

  const tasks = artifacts.querySelector('[data-artifact="tasks"]');
  if (!tasks) throw new Error("no tasks row");
  await expect
    .element(page.elementLocator(tasks).getByText("fresh", { exact: true }))
    .toBeVisible();

  // Not owed: both `ui_waived:` and `design_waived:` landed on this fixture,
  // and each waived design SHALL be shown as not owed and fresh, with its
  // reason.
  const uiDesign = artifacts.querySelector('[data-artifact="ui-design"]');
  if (!uiDesign) throw new Error("no ui-design row");
  const uiDesignRow = page.elementLocator(uiDesign);
  await expect
    .element(uiDesignRow.getByText("not owed", { exact: true }))
    .toBeVisible();
  await expect
    .element(uiDesignRow.getByText("fresh", { exact: true }))
    .toBeVisible();
  await expect
    .element(
      uiDesignRow.getByText(
        "the fixture is about the Planned stage, not the designs",
      ),
    )
    .toBeVisible();
});

// `shared-planning-change-stages-SC-25` (behind, via a real UI design) and
// `SC-59` (delivery) each need a different fixture than `demo-planned`, and
// `openManual` only ever picks up the first address a file opens — a second,
// different one leaves the mounted router pointed at the first (confirmed
// empirically: the page never advances past the header). Each lives in its
// own file instead: `change-page-behind-design.walk.ts` and
// `change-page-delivery.walk.ts`.
