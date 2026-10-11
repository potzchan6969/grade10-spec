import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MINE_FAILED_COPY } from "./fixtures";
import { MyConsignmentsFailed } from "./my-consignments-failed";

const meta = {
  title: "Consignment Mine/MyConsignmentsFailed",
  component: MyConsignmentsFailed,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: MINE_FAILED_COPY, onRetry: fn() },
} satisfies Meta<typeof MyConsignmentsFailed>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Said as an alert, the retry reported once. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Your consignments did not load.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};
