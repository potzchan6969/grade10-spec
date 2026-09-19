import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { openManual } from "./setup";

/** The board a hand opens to find their turn. This walk proves the harness
 * carries the manual: the shell mounts, the fixture snapshot arrives, and the
 * board renders under its own heading. The journeys' walks follow it. */
test("the In Flight board opens", async () => {
  await openManual("/in-flight");

  await expect
    .element(page.getByRole("heading", { level: 1, name: "In Flight" }))
    .toBeVisible();
});
