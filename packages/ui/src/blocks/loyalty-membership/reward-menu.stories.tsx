import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BALANCE, REWARDS } from "./fixtures";
import { RewardMenu } from "./reward-menu";

const meta = {
  title: "Loyalty/Rewards/Blocks/RewardMenu",
  component: RewardMenu,
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
    copy: {
      label: "Rewards",
      points: "pts",
      pointCount: (points: number) => points.toLocaleString("en-HK"),
    },
    state: { status: "ready", data: REWARDS },
    balance: BALANCE,
    onSelect: fn(),
  },
} satisfies Meta<typeof RewardMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A card per reward: the item draws its art, the coupon its gift tile; a
 * press reports the reward's id and redeems nothing. Affordability reads
 * off the balance the consumer supplies — a reward it cannot pay stays
 * pressable, the checkout surface does the refusing — and the menu offers
 * no quantity, a redemption is always one unit. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_98c2ae3f-fee4-4616-8460-0b368e5d8b44" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cards = canvas.getAllByRole("button");
    expect(cards).toHaveLength(4);
    expect(
      canvasElement.querySelectorAll('[data-slot="reward-art-coupon"]'),
    ).toHaveLength(1);
    expect(canvas.getByText("Halloween Potatoz")).toBeInTheDocument();
    expect(canvas.getByText("Until 31 Dec 2026")).toBeInTheDocument();
    expect(canvas.getByText("500")).toBeInTheDocument();
    const items = [
      ...canvasElement.querySelectorAll('[data-slot="reward-menu-item"]'),
    ];
    expect(items[0]).toHaveAttribute("data-affordable", "true");
    expect(items[2]).toHaveAttribute("data-affordable", "false");
    expect(
      canvasElement.querySelector(
        '[role="spinbutton"], [data-slot="stepper-input"]',
      ),
    ).toBeNull();

    await userEvent.click(cards[0] as HTMLElement);
    expect(args.onSelect).toHaveBeenCalledWith("potatoz");
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_edeade4c-fabf-496b-9582-d526958e0764" },
  },
  args: { state: { status: "loading" } },
};

/** The consumer supplies the message and what to call the action. */
export const Empty: Story = {
  parameters: {
    verification: { caseId: "vc_611837eb-5d02-4fd0-b2b1-f6e1b170baf1" },
  },
  args: {
    state: {
      status: "empty",
      message: "No rewards to redeem right now.",
      action: { label: "Refresh", onAction: fn() },
    },
  },
};
