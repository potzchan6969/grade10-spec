import { expect, within } from "storybook/test";

/** A drawn page shows its one heading. */
async function expectPage(canvasElement: HTMLElement, heading: string) {
  expect(
    within(canvasElement).getByRole("heading", { level: 1, name: heading }),
  ).toBeVisible();
}

export { expectPage };
