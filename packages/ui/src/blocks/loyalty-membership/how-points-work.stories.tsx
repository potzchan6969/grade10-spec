import {
  Basket,
  ClockCountdown,
  HandCoins,
  Truck,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { HowPointsWork } from "./how-points-work";

const meta = {
  title: "Loyalty/Membership/Blocks/HowPointsWork",
  component: HowPointsWork,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    items: [
      {
        icon: <Basket size={20} weight="regular" />,
        title: "Earn",
        body: "1 pt for every HK$10 you spend, online or in store.",
      },
      {
        icon: <Truck size={20} weight="regular" />,
        title: "Pending",
        body: "Points land once the order completes.",
      },
      {
        icon: <HandCoins size={20} weight="regular" />,
        title: "Spend",
        body: "1 pt = HK$1 off at checkout, or swap them for rewards and coupons.",
      },
      {
        icon: <ClockCountdown size={20} weight="regular" />,
        title: "Expiry",
        body: "Points lapse after 12 months with no activity. We'll remind you 30 days before.",
      },
    ],
  },
} satisfies Meta<typeof HowPointsWork>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The four mechanics, stacked or paired by width. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelectorAll('[data-slot="how-points-work-row"]'),
    ).toHaveLength(4);
    for (const title of ["Earn", "Pending", "Spend", "Expiry"]) {
      expect(canvas.getByText(title)).toBeInTheDocument();
    }
    expect(canvas.getByText(/12 months with no activity/)).toBeInTheDocument();
  },
};

/** The single-column stack at a phone width. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelectorAll('[data-slot="how-points-work-row"]'),
    ).toHaveLength(4);
  },
};
