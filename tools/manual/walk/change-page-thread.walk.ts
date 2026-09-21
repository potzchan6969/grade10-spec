import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-agent-rounds-SC-81`: a reader of the change follows what
 * happened to it, and what its hands are being told, without opening Slack.
 *
 * Read on `demo-building`, the one fixture change given a thread of its own:
 * `NO_GIT` leaves every reading's history empty, so `build-fixture.mts`
 * writes that change's events as data - the change opened, the proposal
 * landed on a hand's word, a hand named, a re-read that changed nothing, a
 * tick, and the day its held row was asked on.
 *
 * Both halves of the scenario sit on one page, so they are one walk: the
 * Thread is the last row of `ChangeStatus` and Told now is inside the Your
 * turn card, under the thread link.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: the relative dates the Thread prints are read against one
 * fixed now, and a walk that let the real clock run would drift from theirs
 * the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-agent-rounds-SC-81 - the thread the change's own history tells", async () => {
  await openManual("/in-flight/demo-building");
  await expect
    .element(
      page.getByRole("heading", { level: 1, name: "The Building stage" }),
    )
    .toBeVisible();

  // The Thread row waits on the change's own document, which the shell
  // fetches after the page is up: the sentence over the rows is what says it
  // has arrived.
  await expect
    .element(page.getByText(/What the change's thread shows, read from/))
    .toBeVisible();
  const thread = page.elementLocator(rowFor("Thread"));

  // One row per event, each in the words the thread would carry.
  await expect
    .element(thread.getByText("Opened by @tester", { exact: true }))
    .toBeVisible();
  await expect.element(thread.getByText(/Landed/)).toBeVisible();
  await expect
    .element(thread.getByText("Hand: @tester is the engineer", { exact: true }))
    .toBeVisible();
  await expect.element(thread.getByText(/Read again/)).toBeVisible();
  await expect
    .element(thread.getByText("Ticked 1.1", { exact: true }))
    .toBeVisible();

  // The held row, dated by the commit that asked it rather than left undated.
  // The demo change's own row names a confirmer outside the six roles, and
  // the line says that word.
  await expect
    .element(thread.getByText(/Q1 held for the tester/))
    .toBeVisible();
  await expect
    .element(thread.getByText("undated", { exact: true }))
    .not.toBeInTheDocument();

  // Oldest first, because that is how a thread is read.
  const rows = Array.from(rowFor("Thread").querySelectorAll("li")).map(
    (row) => row.textContent ?? "",
  );
  const at = (text: string) => rows.findIndex((row) => row.includes(text));
  expect(at("Opened by")).toBe(0);
  expect(at("Ticked 1.1")).toBeGreaterThan(at("Hand: @tester"));
});

test("shared-planning-agent-rounds-SC-81 - the message the hand is being told now", async () => {
  await openManual("/in-flight/demo-building");
  await expect
    .element(
      page.getByRole("heading", { level: 1, name: "The Building stage" }),
    )
    .toBeVisible();

  const cardEl = document.querySelector('[data-slot="card"]');
  if (!cardEl) throw new Error("no Your turn card");
  const card = page.elementLocator(cardEl);

  // It says it is the message, not a second status.
  await expect
    .element(card.getByText("Told now", { exact: true }))
    .toBeVisible();
  await expect
    .element(card.getByText("what the message says", { exact: true }))
    .toBeVisible();

  // The block: whose inbox it reaches, then the body word for word, its
  // `mrkdwn` read rather than printed. Scoped to the block, because the hand
  // the card names above it is the same handle.
  const quote = cardEl.querySelector("blockquote");
  const block = quote?.closest("li");
  if (!quote || !block) throw new Error("no quoted message in Told now");
  const told = page.elementLocator(block);
  await expect
    .element(told.getByText("@tester", { exact: true }))
    .toBeVisible();
  await expect
    .element(told.getByText("Your turn", { exact: true }))
    .toBeVisible();
  await expect
    .element(told.getByText("Building", { exact: true }))
    .toBeVisible();
  await expect
    .element(
      told.getByText("/workflow-build demo-building <group>", { exact: true }),
    )
    .toBeVisible();
  expect(quote.textContent ?? "").not.toContain("*Your turn*");
});
