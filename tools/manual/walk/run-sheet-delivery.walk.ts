import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { openManual } from "./setup";

/**
 * `shared-planning-agent-rounds-US-08`: the QA teammate walks only what
 * staging proves. `shared-planning-agent-rounds-SC-61` has two halves — the
 * run sheet leaves an automated case out and says how many, and the change
 * page counts the automated cases against the suite's total. This walk
 * decides the change-page half alone: the run sheet's own half — a written
 * tab holding no automated case, and its printed count — is
 * `scripts/openspec/run-sheet.test.mjs`'s, over a suite no browser renders.
 *
 * `demo-specified` carries `demo-product/alpha`'s one-case suite; its case is
 * given `**Automation status:** automated` so the Delivery row's count reads
 * `1/1` rather than a zero that would pass whether the row read the suite at
 * all.
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

test("shared-planning-agent-rounds-SC-61 - the change page counts automated cases against the total", async () => {
  await openManual("/in-flight/demo-specified");
  await expect
    .element(
      page.getByRole("heading", { level: 1, name: "The Specified stage" }),
    )
    .toBeVisible();

  const delivery = page.elementLocator(rowFor("Delivery"));

  await expect
    .element(delivery.getByText("automated", { exact: true }))
    .toBeVisible();
  await expect
    .element(delivery.getByText("1/1", { exact: true }))
    .toBeVisible();
});

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
