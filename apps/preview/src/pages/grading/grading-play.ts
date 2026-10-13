import { expect, userEvent, within } from "storybook/test";

/** Walks a FlowContainer's cases in order, then checks every case in Expanded. */
async function walkCases(
  canvasElement: HTMLElement,
  titles: readonly string[],
) {
  const canvas = within(canvasElement);
  const next = canvas.getByRole("button", { name: "Next" });
  for (const [index, title] of titles.entries()) {
    expect(canvas.getAllByText(title)[0]).toBeVisible();
    if (index < titles.length - 1) await userEvent.click(next);
  }
  await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
  expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
    titles.length,
  );
}

/** A drawn page shows its one heading. */
async function expectPage(canvasElement: HTMLElement, heading: string) {
  expect(
    within(canvasElement).getByRole("heading", { level: 1, name: heading }),
  ).toBeVisible();
}

export { expectPage, walkCases };
