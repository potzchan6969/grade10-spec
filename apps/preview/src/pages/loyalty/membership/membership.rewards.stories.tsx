import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { MEMBERSHIP_STATE_VIEWS, MEMBERSHIP_VIEW } from "../loyalty-content";
import { MembershipPage } from "./membership-page";

const meta = {
  title: "Loyalty/Membership/Screens/Membership/Rewards",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW, tab: "rewards" },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RedeemCoupon: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: /HK\$50 off coupon/ }),
    );
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 500 pts" }),
    );
    expect(
      await overlay.findByText("Added to your coupons"),
    ).toBeInTheDocument();
    await userEvent.click(overlay.getByRole("button", { name: "Done" }));
    await userEvent.click(
      within(canvas.getByRole("navigation", { name: "Membership" })).getByRole(
        "button",
        { name: "Overview" },
      ),
    );
    expect(canvas.getByText("750")).toBeInTheDocument();
  },
};

/** The rewards section holds its place while the catalog is read. */
export const RewardsLoading: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.rewardsLoading },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="reward-menu-loading"]'),
    ).not.toBeNull();
  },
};

/** The reward that ran out: the sheet refuses, closes itself, and the page
 * raises the run-out toast — as on the Rewards screen. */
export const SoldOut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /UV slab sleeves/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 300 pts" }),
    );
    expect(
      await overlay.findByText("This reward just ran out"),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-sheet="reward-checkout"]'),
      ).not.toBeInTheDocument(),
    );
  },
};

/** A refusal the member can retry: the toast lands and the sheet stays
 * open with the press live — nothing proceeds until the member taps
 * Redeem again themselves. */
export const RetryableFailure: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Mystery foil pack/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 800 pts" }),
    );
    expect(
      await overlay.findByText("Couldn't redeem just now"),
    ).toBeInTheDocument();
    expect(
      document.body.querySelector('[data-slot="reward-checkout"]'),
    ).toBeInTheDocument();
    expect(
      overlay.getByRole("button", { name: "Redeem for 800 pts" }),
    ).toBeEnabled();
  },
};

/** The same flaky reward, retried: the member taps Redeem again after the
 * refusal and the redeemed phase lands. */
export const RetryableFailureRecovered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Mystery foil pack/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 800 pts" }),
    );
    await overlay.findByText("Couldn't redeem just now");
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 800 pts" }),
    );
    expect(await overlay.findByText("Ready to Collect")).toBeInTheDocument();
  },
};

/** The balance fell short elsewhere since the sheet opened: the page
 * refetches, the deficit row re-reads it, and the toast says so. */
export const BalanceDropped: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Express grading voucher/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 1,100 pts" }),
    );
    expect(await overlay.findByText("Not enough points")).toBeInTheDocument();
    expect(await overlay.findByText("Need 500 more pts")).toBeInTheDocument();
    expect(
      overlay.getByRole("button", { name: "Redeem for 1,100 pts" }),
    ).toBeDisabled();
  },
};
