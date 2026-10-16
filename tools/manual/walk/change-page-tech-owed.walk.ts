import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual, rowFor } from "./setup";

/**
 * `shared-planning-change-stages-SC-86`: the requirements and the suite are
 * on `main` and the tech design is neither a file nor a line.
 * `demo-tech-owed` is that change, so the ladder holds it at Designed and
 * the page names the tech design as what it owes.
 *
 * Its own file, at its own address, for the reason the other change-page
 * walks each have one: `openManual` reads one address per file, the router
 * having read it as the module loads.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

test("shared-planning-change-stages-SC-86 - requirements and the suite without the tech design", async () => {
  await openManual("/in-flight/demo-tech-owed");
  await expect
    .element(page.getByRole("heading", { name: "The tech design owed" }))
    .toBeVisible();

  const eyebrow = document.querySelector("h1")?.previousElementSibling;
  if (!eyebrow) throw new Error("no eyebrow above the change title");
  await expect
    .element(
      page.elementLocator(eyebrow).getByText("Designed", { exact: true }),
    )
    .toBeVisible();

  const artifacts = rowFor("Artifacts");
  const techDesign = artifacts.querySelector('[data-artifact="tech-design"]');
  if (!techDesign) throw new Error("no tech-design row");
  await expect
    .element(
      page
        .elementLocator(techDesign)
        .getByText("not yet written", { exact: true }),
    )
    .toBeVisible();
  const specs = artifacts.querySelector('[data-artifact="specs"]');
  if (!specs) throw new Error("no specs row");
  await expect
    .element(
      page.elementLocator(specs).getByText("not yet written", { exact: true }),
    )
    .not.toBeInTheDocument();
});
