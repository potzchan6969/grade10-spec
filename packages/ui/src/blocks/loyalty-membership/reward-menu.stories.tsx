import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BALANCE, REWARDS } from "./fixtures";
import { RewardMenu } from "./reward-menu";

const meta = {
  title: "Loyalty Membership/RewardMenu",
  component: RewardMenu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: {
      label: "Rewards",
      redeem: "Redeem",
      points: "pts",
      atQuantityBound: "Limit per redemption reached",
      insufficient: "Not enough points",
      decreaseQuantity: "Fewer",
      increaseQuantity: "More",
    },
    state: { status: "ready", data: REWARDS },
    balance: BALANCE,
    onQuantityChange: fn(),
    onRedeem: fn(),
  },
} satisfies Meta<typeof RewardMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Affordability is judged against the balance: 4000 pts on 1250 disables. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const redeemButtons = canvas.getAllByRole("button", { name: "Redeem" });
    expect(redeemButtons).toHaveLength(3);
    expect(redeemButtons[2]).toBeDisabled();
    expect(canvas.getByText("Not enough points")).toBeInTheDocument();
    await userEvent.click(redeemButtons[0] as HTMLElement);
    expect(args.onRedeem).toHaveBeenCalledWith("voucher-50", 1);
  },
};

/** The stepper input reports; the quantity moves only when the consumer supplies it. */
export const QuantityChangeIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "More" }));
    expect(args.onQuantityChange).toHaveBeenCalledWith("sleeves", 2);
  },
};

/** At the per-redemption bound the increment disables and the refusal is named. */
export const QuantityAtBound: Story = {
  args: { quantities: { sleeves: 3 } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "More" })).toBeDisabled();
    expect(
      canvas.getByText("Limit per redemption reached"),
    ).toBeInTheDocument();
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Redeem" })[1] as HTMLElement,
    );
    expect(args.onRedeem).toHaveBeenCalledWith("sleeves", 3);
  },
};

/** A physical reward states the window it must be collected in, word for word
 * as supplied; a money-off code states its validity instead. */
export const CollectionWindowIsStated: Story = {
  play: async ({ canvasElement }) => {
    const stated = [
      ...canvasElement.querySelectorAll(
        '[data-slot="reward-menu-collection-window"]',
      ),
    ].map((node) => node.textContent);

    expect(stated).toEqual(
      REWARDS.filter((reward) => reward.collectionWindow).map(
        (reward) => reward.collectionWindow,
      ),
    );
    expect(stated.length).toBeGreaterThan(0);
    expect(
      within(canvasElement).getByText("Code valid 90 days from redemption"),
    ).toBeInTheDocument();
  },
};

export const Loading: Story = { args: { state: { status: "loading" } } };

/** The consumer supplies the message and what to call the action. */
export const Empty: Story = {
  args: {
    state: {
      status: "empty",
      message: "No rewards to redeem right now.",
      action: { label: "Refresh", onAction: fn() },
    },
  },
};
