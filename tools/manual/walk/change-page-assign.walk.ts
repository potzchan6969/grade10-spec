import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * The change page's Assign on the hosted manual -
 * `shared-planning-change-stages-SC-69`, read on `demo-planned`.
 *
 * The walk never runs a dev server behind `/api/dirty`: `useEditorSession`'s
 * probe answers with no local store, which is exactly the hosted reading -
 * no mock stands in for it, the harness already is the hosted case.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-69 - the hosted manual", async () => {
  await openManual("/in-flight/demo-planned");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "The Planned stage" }))
    .toBeVisible();

  // The Your turn card and the hands are shown, same as on the locally run
  // manual.
  const cardEl = document.querySelector('[data-slot="card"]');
  if (!cardEl) throw new Error("no Your turn card");
  const card = page.elementLocator(cardEl);
  await expect
    .element(card.getByText("Your turn", { exact: true }))
    .toBeVisible();
  await expect
    .element(
      card.getByText(
        "No engineer is named — this goes to the engineer channel",
      ),
    )
    .toBeVisible();
  const hands = page.elementLocator(rowFor("Hands"));
  await expect
    .element(hands.getByText("Engineer", { exact: true }))
    .toBeVisible();

  // Assign: read-only - a disabled button, and the sentence naming why.
  const assign = card.getByRole("button", { name: "Assign" });
  await expect.element(assign).toBeVisible();
  await expect.element(assign).toBeDisabled();
  await expect
    .element(card.getByText(/This hosted build is read-only/))
    .toBeVisible();

  // Nothing an editing session would draw is on the card: no role or handle
  // picker to write with.
  await expect
    .element(card.getByRole("combobox", { name: "Role" }))
    .not.toBeInTheDocument();
});
