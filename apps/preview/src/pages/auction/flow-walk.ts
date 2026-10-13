import { expect, userEvent, waitFor, within } from "storybook/test";

/**
 * A flow step's case title, text its state renders, and optionally text its
 * state must not render (a control the step takes away).
 */
type FlowWalkStep = readonly [
  title: string,
  shows: string | RegExp,
  hides?: string | RegExp,
];

/** Blocks such as My Auctions render a small-viewport and a wide layout together; one shows. */
const anyVisible = (elements: HTMLElement[]) =>
  elements.some((element) => element.checkVisibility());

/**
 * Walks a FlowContainer: Next through each step in order, asserting the step's
 * title and the text its state renders, then the Expanded view, which must lay
 * out one card per step with every step's state on screen at once, and back.
 */
async function walkFlowCases(
  canvasElement: HTMLElement,
  steps: readonly FlowWalkStep[],
) {
  const canvas = within(canvasElement);
  for (const [index, [title, shows, hides]] of steps.entries()) {
    if (index > 0) {
      await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    }
    expect(canvas.getByText(title)).toBeVisible();
    expect(anyVisible(canvas.getAllByText(shows))).toBe(true);
    if (hides) expect(canvas.queryAllByText(hides)).toHaveLength(0);
  }
  await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
  for (const [title, shows] of steps) {
    expect(await canvas.findByText(title)).toBeInTheDocument();
    expect(canvas.getAllByText(shows).length).toBeGreaterThan(0);
  }
  // Back to one case, so the canvas holds a single copy of the screen's landmarks.
  await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
  const [first, second] = steps;
  if (first && second) {
    await waitFor(
      () => expect(canvas.queryByText(second[0])).not.toBeInTheDocument(),
      { timeout: 3000 },
    );
    expect(canvas.getByText(first[0])).toBeVisible();
  }
}

export { type FlowWalkStep, walkFlowCases };
