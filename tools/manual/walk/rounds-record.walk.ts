import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

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
 * demo store carries none yet): three rows, the GIVEN's own count — one on
 * an artifact whose round found nothing, one on the fixture's own
 * fully-ticked task group, and a third on a second artifact, so the row
 * count itself is what the walk checks and not only that two happen to be
 * present.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

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

  // Round 3: the GIVEN's own third row — the Rounds row lists exactly the
  // three `rounds.md` carries, not two.
  await expect
    .element(rounds.getByText("Round 3", { exact: true }))
    .toBeVisible();
  await expect
    .element(rounds.getByText("Product", { exact: true }))
    .toBeVisible();
  const lines = rowFor("Rounds").querySelectorAll("li");
  if (lines.length !== 3) {
    throw new Error(`the Rounds row lists ${lines.length} lines, not 3`);
  }
});

/** Round 1's own `<li>` — found from its exact "Round 1" badge inside the
 * Rounds row alone, never a page-wide scan of every `<li>`, which "Round 1"
 * as a loose substring would also meet inside "Round 10" the day this suite
 * runs that many rounds. */
function round1Line(): Element {
  const rounds = rowFor("Rounds");
  const badge = Array.from(rounds.querySelectorAll("li")).find((li) =>
    Array.from(li.querySelectorAll("*")).some(
      (el) => el.textContent?.trim() === "Round 1",
    ),
  );
  if (!badge) throw new Error("no line for Round 1");
  return badge;
}
