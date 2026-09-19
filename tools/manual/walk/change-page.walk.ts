import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { openManual } from "./setup";

/**
 * The hand's arrival on the change page: what the message they were told
 * about it points at, read on `demo-planned` — the Behind fixture, held at
 * Planned with nothing ticked yet and `decisions.md` moved after it was
 * reviewed.
 *
 * The clock is frozen at 2026-09-19 noon, Hong Kong time, before every open —
 * the same instant the board walk freezes it, for the same reason: nothing on
 * this page reads a day count, but a walk that opened the manual with the
 * real clock running would drift from the board walk's reading the day the
 * two run apart.
 */
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-19T12:00:00+08:00"));
});

afterEach(() => {
  vi.useRealTimers();
});

test("shared-planning-change-stages-SC-05 - the stepper's mark and move, and the eyebrow naming the stage", async () => {
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

  // The stepper step this change is in: the agent's mark for Planned, and
  // the engineer's move — scoped to the one step, because Specified's own
  // step carries the same word "read".
  const steps = document.querySelector('[data-stepper="steps"]');
  const plannedStep = steps?.querySelector('[data-stage="planned"]');
  if (!plannedStep) throw new Error("no Planned step in the desktop stepper");
  const step = page.elementLocator(plannedStep);

  await expect
    .element(step.getByText("Planned", { exact: true }))
    .toBeVisible();
  await expect.element(step.getByText("agent drafts the plan")).toBeVisible();
  await expect.element(step.getByText("read", { exact: true })).toBeVisible();

  // On staging, Released and Archived are drafted by nobody, so no step past
  // Building carries the mark.
  for (const stage of ["on-staging", "released", "archived"]) {
    const other = steps?.querySelector(`[data-stage="${stage}"]`);
    if (!other) throw new Error(`no ${stage} step in the desktop stepper`);
    await expect
      .element(page.elementLocator(other).getByText("agent drafts"))
      .not.toBeInTheDocument();
  }
});

test("shared-planning-change-stages-SC-57 - the Your turn card", async () => {
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

  // The command: Planned's own move, the change's id written in.
  await expect
    .element(card.getByText("/tasks demo-planned", { exact: true }))
    .toBeVisible();
  await expect
    .element(card.getByText("Engineer: read", { exact: true }))
    .toBeVisible();
});

test("shared-planning-change-stages-SC-58 - the hands table with an open role", async () => {
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

test("shared-planning-change-stages-SC-59 - the artifact rows, fresh and behind", async () => {
  await openManual("/in-flight/demo-planned");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "The Planned stage" }))
    .toBeVisible();

  const artifacts = rowFor("Artifacts");

  // Fresh: written, and nothing before it has moved since.
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

  // Behind: `decisions.md` is written, but this is the Behind fixture — it
  // moved after it was reviewed, and the row names what it is read again
  // against.
  const decisions = artifacts.querySelector('[data-artifact="decisions"]');
  if (!decisions) throw new Error("no decisions row");
  const decisionsRow = page.elementLocator(decisions);
  await expect
    .element(decisionsRow.getByText("behind", { exact: true }))
    .toBeVisible();
  await expect
    .element(decisionsRow.getByText("read again against proposal"))
    .toBeVisible();

  // Not owed: this fixture waives the UI design, and the row shows it as
  // fresh with the reason on it rather than as a missing file.
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

/**
 * The `<dd>` beside a `ChangeStatus` row's `<dt>` — Hands, Artifacts,
 * Delivery and the rest, each a labelled fact the change page reads down the
 * column. Found by the label the row itself carries, rather than a class
 * the stylesheet owns, because that label is the one word a reader and this
 * walk both read the row by.
 */
function rowFor(label: string): Element {
  const term = Array.from(document.querySelectorAll("dt")).find(
    (dt) => dt.textContent?.trim() === label,
  );
  const value = term?.nextElementSibling;
  if (!value) throw new Error(`no "${label}" row on the change page`);
  return value;
}
