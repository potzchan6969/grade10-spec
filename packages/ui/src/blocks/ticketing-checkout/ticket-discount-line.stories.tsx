import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { phone } from "./checkout.story-fixtures";
import { TicketDiscountLine } from "./ticket-discount-line";

const meta = {
  title: "Ticketing/Buying/Blocks/TicketDiscountLine",
  component: TicketDiscountLine,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="px-4">
        <Story />
      </div>
    ),
    phone,
  ],
  args: {
    copy: {
      title: "Promo SPRING20",
      detail: "20% off General passes",
      remove: "Remove",
      removeLabel: "Remove SPRING20",
    },
    amount: "−HK$190.00",
    onRemove: fn(),
  },
} satisfies Meta<typeof TicketDiscountLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Applied: what it takes off in the success tone, and Remove. */
export const Applied: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("−HK$190.00")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove SPRING20" }),
    );
    expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

/** Used up at Pay: the amount struck through, not applied. */
export const UsedUp: Story = {
  args: {
    state: "usedUp",
    copy: {
      title: "Promo SPRING20",
      detail: "Used up, not applied",
      remove: "Remove",
      removeLabel: "Remove SPRING20",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("−HK$190.00").tagName).toBe("S");
    expect(canvas.getByText("Used up, not applied")).toBeVisible();
  },
};

/** The removal is on its way: Remove waits. */
export const Removing: Story = {
  args: { removing: true },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByRole("button", { name: "Remove SPRING20" }),
    ).toHaveAttribute("aria-disabled", "true");
  },
};
