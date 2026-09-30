import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EMPTY_COPY } from "./fixtures";
import { VaultCasesEmpty } from "./vault-cases-empty";

const meta = {
  title: "Vault Case/VaultCasesEmpty",
  component: VaultCasesEmpty,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: EMPTY_COPY, onStartRequest: fn() },
} satisfies Meta<typeof VaultCasesEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The empty home reads in order and reports the start once
 * (shared-ui-vault-case-SC-23). */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const start = canvas.getByRole("button", { name: EMPTY_COPY.start });
    const order = [
      canvas.getByText(EMPTY_COPY.intro),
      start,
      canvas.getByRole("heading", { name: EMPTY_COPY.howItWorks }),
      ...EMPTY_COPY.steps.flatMap((step) => [
        canvas.getByText(step.title),
        canvas.getByText(step.body),
      ]),
      canvas.getByText(EMPTY_COPY.emptyTitle),
      canvas.getByText(EMPTY_COPY.emptyBody),
      canvas.getByText(EMPTY_COPY.draftCap),
    ];
    for (let at = 1; at < order.length; at++) {
      expect(
        order[at - 1].compareDocumentPosition(order[at]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
    await userEvent.click(start);
    expect(args.onStartRequest).toHaveBeenCalledTimes(1);
  },
};
