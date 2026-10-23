import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { REWARDS } from "./fixtures";
import { RewardItem } from "./reward-item";

const meta = {
  title: "Loyalty/Rewards/Blocks/RewardItem",
  component: RewardItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-full sm:max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    item: REWARDS[0],
    affordable: true,
    onSelect: fn(),
    pointCount: (points: number) => points.toLocaleString("en-HK"),
    points: "pts",
  },
} satisfies Meta<typeof RewardItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The item's card: art, name, description, deadline where named, points.
 * A press reports the reward's id and redeems nothing. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    expect(args.onSelect).toHaveBeenCalledWith(REWARDS[0]?.id);
  },
};

/** The discount coupon draws the gift tile with the voucher cutouts. */
export const Coupon: Story = {
  args: { item: REWARDS[1] },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="reward-art-coupon"]'),
    ).toBeInTheDocument();
  },
};

/** A reward the balance cannot pay stays pressable — affordability is only
 * read here; the checkout surface does the refusing. */
export const NotAffordable: Story = {
  args: { item: REWARDS[2], affordable: false },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="reward-menu-item"]'),
    ).toHaveAttribute("data-affordable", "false");
  },
};
