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
      canvas.getByRole("button", { name: "Top-up Points" }),
    ).toBeInTheDocument();
  },
};

/** Buying a pack without leaving the screen: the picker over the page, the
 * confirming wait, the credited result and the balance raised. `Default`
 * stays on the overview — this state is reached by acting from it. */
export const TopUp: Story = {
  name: "Top Up",
  parameters: { journeys: ["grade10-site-loyalty-programme-US-14"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: "Top-up Points" }),
    );
    expect(
      await overlay.findByRole("dialog", { name: "Top Up Points" }),
    ).toBeInTheDocument();
    await userEvent.click(overlay.getByRole("radio", { name: /^10,000 pt/ }));
    await userEvent.click(
      overlay.getByRole("button", { name: "Pay HK$9,500" }),
    );
    expect(
      await overlay.findByRole("dialog", {
        name: "Confirming your payment…",
      }),
    ).toBeInTheDocument();
    await waitFor(
      () => expect(overlay.getByText("10,000 points added")).toBeVisible(),
      { timeout: 3000 },
    );
    expect(overlay.getByText("New balance: 11,250 points")).toBeVisible();
    await waitFor(() =>
      expect(overlay.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    /* The picker's and result's scroll locks must both release — a stuck
     * "hidden" would leave the page unscrollable. */
    await waitFor(() =>
      expect(document.documentElement.style.overflow).not.toBe("hidden"),
    );
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(canvas.getByText("11,250")).toBeInTheDocument();
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

/** The default content at a phone width: the rail reads as a scrollable
 * line-tab row and the page never scrolls sideways. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Membership" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("tab", { name: "Overview", selected: true }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Top-up Points" }),
    ).toBeInTheDocument();
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  },
};
