import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { MEMBERSHIP_STATE_VIEWS, MEMBERSHIP_VIEW } from "../loyalty-content";
import { MembershipPage } from "./membership-page";

const meta = {
  title: "Loyalty/Membership/Screens/Membership",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW, tab: "overview" },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The overview: tier, balance, the top-up entrance and Tiers & Benefits. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Membership" }),
    ).toBeInTheDocument();
    for (const name of ["Tiers & Benefits", "How points work"]) {
      expect(
        canvas.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
    expect(canvas.getAllByText("Gold").length).toBeGreaterThan(0);
    expect(canvas.getByText("1,250")).toBeInTheDocument();
    expect(
      canvas.getByRole("progressbar", { name: "Keep Gold" }),
    ).toHaveAttribute("aria-valuenow", "320");
    expect(
      canvas.getByRole("button", { name: "Top up points" }),
    ).toBeInTheDocument();

    /* The account menu carries the Membership entrance; close it again so
     * the story opens on the page, not the menu. */
    const overlay = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "Account" }));
    expect(
      await overlay.findByRole("menuitem", { name: "Membership" }),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(overlay.queryByRole("menu")).not.toBeInTheDocument(),
    );
  },
};

/** Nothing earned yet: an empty ledger, no coupons and nothing to redeem. */
export const NoPoints: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.noPoints },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("0").length).toBeGreaterThan(0);
    expect(
      canvas.getByText(/Earn 500\+ pts by .+ to upgrade/),
    ).toBeInTheDocument();
  },
};

/** The default content at a phone width: the rail reads as a scrollable row
 * and the page never scrolls sideways. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Membership" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("navigation", { name: "Membership" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Top up points" }),
    ).toBeInTheDocument();
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  },
};
