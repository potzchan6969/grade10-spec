import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { REWARDS } from "./fixtures";
import { RewardCheckout } from "./reward-checkout";
import { checkoutMeta } from "./reward-checkout.story-fixtures";

const [ITEM] = REWARDS;

/** Which surface the checkout draws: a sheet under 640px, a dialog from it. */
const meta = {
  title: "Loyalty/Rewards/Blocks/RewardCheckout/Surface",
  component: RewardCheckout,
  ...checkoutMeta,
} satisfies Meta<typeof RewardCheckout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Under 640px the surface is a bottom sheet. */
export const NarrowIsSheet: Story = {
  globals: { viewport: { value: "mobile1" } },
  args: { reward: ITEM },
  play: async () => {
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="drawer-popup"]'),
      ).not.toBeNull(),
    );
    expect(
      document.body.querySelector('[data-slot="dialog-content"]'),
    ).toBeNull();
  },
};

/** From 640px up the surface is a dialog. */
export const WideIsDialog: Story = {
  globals: { viewport: { value: "desktop" } },
  args: { reward: ITEM },
  play: async () => {
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="dialog-content"]'),
      ).not.toBeNull(),
    );
    expect(
      document.body.querySelector('[data-slot="drawer-popup"]'),
    ).toBeNull();
  },
};
