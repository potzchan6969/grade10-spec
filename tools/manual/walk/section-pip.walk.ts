import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual } from "./setup";

/**
 * A page section's in-flight row and the pip a 🚧 line wears -
 * `shared-planning-change-stages-SC-65` and `SC-67`, read on
 * `demo-product/index.md`, the product page `pnpm fixture` already builds.
 *
 * `demo-refund-window`'s proposal links `## Refunds` alone (Planned, the
 * fourth stage), which is `SC-65`'s own GIVEN - a change of its own rather
 * than the Behind fixture (`demo-planned`), whose own Behind chip names
 * every page section its proposal links: reusing it here would put this
 * section on that chip too and move what `board.walk.ts`'s and
 * `change-page.walk.ts`'s own SC-51/SC-59 cases read off it. `## Discounts`
 * is linked by two
 * changes at once - `demo-designed` (Designed) and `demo-building`
 * (Building) - which is `SC-67`'s GIVEN; the section's own row lists both,
 * and the 🚧 line's pip carries only the further one.
 *
 * `SC-66` - a 🚧 line whose change has archived carrying no pip - has no
 * fixture to reach it through this address: `snapshot.changes`, which
 * `changesForSection` reads, never carries an archived change at all (they
 * live apart, under `readArchivedChanges`/`/api/archive`), so a real archived
 * fixture linking a section could never surface here to prove the line wears
 * no pip. `test/section-pip.test.tsx`'s "wears no pip once every change
 * delivering it has archived" proves it instead, at the block level a
 * synthetic `ChangeEntry` can still carry `status: "archived"` on.
 *
 * The clock is frozen the same instant the other walks freeze it, for the
 * same reason: nothing here reads a day count, but a walk that let the real
 * clock run would drift from theirs the day the two run apart.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-65 - the in-flight row and the pip", async () => {
  await openManual("/p/demo-product");
  await expect
    .element(page.getByRole("heading", { level: 2, name: "Refunds" }))
    .toBeVisible();

  const row = page.elementLocator(sectionRowsFor("Refunds"));

  // The row: the change's stage and its hand, named - `tester` is this
  // fixture's own engineer.
  await expect
    .element(row.getByText("Shorten the refund window", { exact: true }))
    .toBeVisible();
  await expect.element(row.getByText("Planned", { exact: true })).toBeVisible();
  await expect.element(row.getByText("@tester", { exact: true })).toBeVisible();
  await expect
    .element(row.getByText("engineer", { exact: true }))
    .toBeVisible();

  // The pip: on the 🚧 line itself, bearing Planned's own stage number, its
  // hover naming the change and the hand.
  const pip = markedLine("Window").getByTitle(
    /Shorten the refund window — Planned · @tester/,
  );
  await expect.element(pip).toBeVisible();
  await expect.element(pip).toHaveTextContent("4");
});

test("shared-planning-change-stages-SC-67 - two changes deliver one line", async () => {
  await openManual("/p/demo-product");
  await expect
    .element(page.getByRole("heading", { level: 2, name: "Discounts" }))
    .toBeVisible();

  const row = page.elementLocator(sectionRowsFor("Discounts"));

  // Both changes' own rows sit under the section, Designed and Building
  // alike - the row is who is delivering it, not only the furthest one.
  await expect
    .element(row.getByText("The Designed stage", { exact: true }))
    .toBeVisible();
  await expect
    .element(row.getByText("The Building stage", { exact: true }))
    .toBeVisible();

  // The pip on the 🚧 line: the further stage alone, Building's number - not
  // Designed's.
  const pip = markedLine("Cap").getByTitle(/The Building stage — Building/);
  await expect.element(pip).toBeVisible();
  await expect.element(pip).toHaveTextContent("5");
  await expect
    .element(markedLine("Cap").getByTitle(/— Designed/))
    .not.toBeInTheDocument();
});

/** The `SectionChanges` row a `## ` heading leads - its very next sibling in
 * the rendered markdown, the same fragment `markdown.tsx`'s `Heading`
 * returns the two as - found off the heading's own text rather than a class
 * the stylesheet owns, so a page and this walk scope by the same word. */
function sectionRowsFor(title: string): Element {
  const heading = Array.from(document.querySelectorAll("h2")).find(
    (one) => one.textContent?.trim() === title,
  );
  const rows = heading?.nextElementSibling;
  if (!rows) throw new Error(`no in-flight row under "${title}"`);
  return rows;
}

/** The `<li>` of a marked bullet, found by the bold term the line leads
 * with - `- 🚧 **Window** — …` - because the pip badge sits inside this
 * item's own text and nowhere else on the page repeats that term. */
function markedLine(term: string): ReturnType<typeof page.elementLocator> {
  const item = Array.from(document.querySelectorAll("li")).find((one) =>
    one.textContent?.includes(term),
  );
  if (!item) throw new Error(`no marked line carrying "${term}"`);
  return page.elementLocator(item);
}
