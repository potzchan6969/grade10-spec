import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual } from "./setup";

/**
 * The message QA is told now, on the change page: the Specified change's
 * Your turn card quotes the turn message sent to its QA hand — the review
 * command, the suite, its case count, and that the walk names this review as
 * its input (`shared-planning-agent-rounds-SC-89`; decides
 * `shared-planning-agent-rounds-US11-TC1-1` with `qa-turn.walk.ts`).
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-agent-rounds-SC-89 - the message QA is told now names the suite and the review", async () => {
  await openManual("/in-flight/demo-specified");
  await expect
    .element(
      page.getByRole("heading", { level: 1, name: "The Specified stage" }),
    )
    .toBeVisible();

  const cardEl = document.querySelector('[data-slot="card"]');
  if (!cardEl) throw new Error("no Your turn card");
  const quotes = Array.from(cardEl.querySelectorAll("blockquote"));
  const review = quotes.find((one) =>
    (one.textContent ?? "").includes("/tcs-review demo-specified"),
  );
  if (!review) throw new Error("no message to QA in Told now");
  const told = page.elementLocator(review);
  await expect
    .element(told.getByText("Your turn", { exact: true }))
    .toBeVisible();
  await expect
    .element(told.getByText("/tcs-review demo-specified", { exact: true }))
    .toBeVisible();
  await expect
    .element(
      told.getByText(
        /Suite: .*feature-tcs\.md.*cases; the walk needs it reviewed as its input/,
      ),
    )
    .toBeVisible();
});
