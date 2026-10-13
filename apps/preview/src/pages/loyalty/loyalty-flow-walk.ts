import { userEvent, within } from "storybook/test";

type Canvas = ReturnType<typeof within>;
type Check = (canvas: Canvas) => void | Promise<void>;

/**
 * Steps a Flow through each case with Next, asserting it, then opens Expanded
 * and asserts the row of cases it draws.
 */
async function walkCases(
  canvasElement: HTMLElement,
  checks: readonly Check[],
  expanded: Check,
) {
  const canvas = within(canvasElement);
  for (const [index, check] of checks.entries()) {
    if (index > 0) {
      await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    }
    await check(canvas);
  }
  await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
  await expanded(canvas);
}

export type { Canvas, Check };
export { walkCases };
