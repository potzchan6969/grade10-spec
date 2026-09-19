import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { openManual } from "./setup";

/**
 * `shared-planning-agent-rounds-US-09`: the reader of a change tells a round
 * that found nothing from one that never ran. `shared-planning-agent-rounds-SC-51`'s
 * first half: a change whose `rounds.md` carries rows shows one line per
 * round — the artifact or group, the perspectives, what stood and what was
 * asked. The scenario's second half — a ticked task group with no row reads
 * as having none — is `rounds-record-roundless.walk.ts`'s: `setup.ts`'s own
 * "a second address is a second walk" is why the two live in separate files
 * rather than a second `openManual` call here.
 *
 * `demo-on-staging` is given a `rounds.md` of its own for this walk (the
 * demo store carries none yet): one row on an artifact whose round found
 * nothing, one on the fixture's own fully-ticked task group.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-19T12:00:00+08:00"));
});

afterEach(() => {
  vi.useRealTimers();
});

test("shared-planning-agent-rounds-SC-51 - one line per round, one of them finding nothing", async () => {
  await openManual("/in-flight/demo-on-staging");
  await expect
    .element(
      page.getByRole("heading", { level: 1, name: "The On staging stage" }),
    )
    .toBeVisible();

  const rounds = page.elementLocator(rowFor("Rounds"));

  // Round 1: an artifact round whose readers found nothing — named by its
  // perspectives, and by "nothing stood" rather than a blank cell.
  await expect
    .element(rounds.getByText("Round 1", { exact: true }))
    .toBeVisible();
  await expect
    .element(rounds.getByText("Tasks", { exact: true }))
    .toBeVisible();
  await expect
    .element(rounds.getByText("the-simpler-thing; nitpick"))
    .toBeVisible();
  await expect
    .element(rounds.getByText("nothing stood", { exact: true }))
    .toBeVisible();

  // Its own line lists no question id — the row's only `Q` badge is
  // Round 2's, below.
  const round1 = round1Line();
  await expect
    .element(page.elementLocator(round1).getByText(/^Q\d/))
    .not.toBeInTheDocument();

  // Round 2: the fixture's own task group, ticked and rowed — its
  // perspectives, what stood, and the question id it raised.
  await expect
    .element(rounds.getByText("Round 2", { exact: true }))
    .toBeVisible();
  await expect
    .element(rounds.getByText("Group 1", { exact: true }))
    .toBeVisible();
  await expect
    .element(rounds.getByText("missing-pieces; code-smell"))
    .toBeVisible();
  await expect
    .element(rounds.getByText("the fixture's one task lands cleanly"))
    .toBeVisible();
  await expect.element(rounds.getByText("Q1", { exact: true })).toBeVisible();
});

/** Round 1's own `<li>` — found from its "Round 1" badge, so the question-id
 * check below reads that line alone and never Round 2's `Q1`. */
function round1Line(): Element {
  const badge = Array.from(document.querySelectorAll("li")).find((li) =>
    li.textContent?.includes("Round 1"),
  );
  if (!badge) throw new Error("no line for Round 1");
  return badge;
}

/**
 * The `<dd>` beside a `ChangeStatus` row's `<dt>` — the same lookup
 * `change-page.walk.ts` uses, scoped by the label because more than one row
 * can carry the same word inside a chip.
 */
function rowFor(label: string): Element {
  const term = Array.from(document.querySelectorAll("dt")).find(
    (dt) => dt.textContent?.trim() === label,
  );
  const value = term?.nextElementSibling;
  if (!value) throw new Error(`no "${label}" row on the change page`);
  return value;
}
