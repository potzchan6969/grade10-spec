import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { TopUpResultPrototype } from "./top-up-result-prototype";

const meta = {
  title: "Loyalty/Top Ups/Screens/Top Up Result",
  component: TopUpResultPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopUpResultPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The result is a modal over the page the member returns to, so it renders in
 * a portal on document.body: plays query the body for the dialog or drawer. */

/** Back from Stripe, still confirming the payment. */
export const ConfirmingPayment: Story = {
  name: "Confirming Payment",
  args: { state: "confirming" },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", {
        name: "Confirming your payment…",
      }),
    ).toBeInTheDocument();
    expect(overlay.getByRole("status")).toBeInTheDocument();
  },
};

/** The pack credited: the new balance and the way back. */
export const PointsAdded: Story = {
  name: "Points Added",
  args: { state: "added" },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "1,000 points added" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(overlay.getByText("New balance: 2,200 points")).toBeVisible(),
    );
    expect(
      overlay.getByRole("button", { name: "Back to Membership" }),
    ).toBeInTheDocument();
  },
};

/** The pack held for an operator: what happens next and where to watch. */
export const UnderReview: Story = {
  name: "Under Review",
  args: { state: "under-review" },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Top-up under review" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        overlay.getByText(
          "Your card is charged only if it’s approved. You can close this page.",
        ),
      ).toBeVisible();
      expect(overlay.getByText("Reference TU-2026-0384")).toBeVisible();
    });
    expect(
      overlay.getByRole("button", { name: "View Top-Up History" }),
    ).toBeInTheDocument();
  },
};

/** The review refused the pack: nothing charged. */
export const NotApproved: Story = {
  name: "Not Approved",
  args: { state: "not-approved" },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Top-up not approved" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(overlay.getByText("You haven’t been charged.")).toBeVisible(),
    );
    expect(
      overlay.getByRole("button", { name: "Back to Membership" }),
    ).toBeInTheDocument();
  },
};

/** The member came back without paying: retry starts the pick again. */
export const PaymentNotCompleted: Story = {
  name: "Payment Not Completed",
  args: { state: "not-completed" },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Payment not completed" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(overlay.getByRole("button", { name: "Try again" })).toBeVisible(),
    );
    expect(
      overlay.getByRole("button", { name: "Back to Membership" }),
    ).toBeInTheDocument();
  },
};

/** Points added at a phone width — the result is a bottom drawer. */
export const Narrow: Story = {
  args: { state: "added" },
  globals: { viewport: { value: "mobile1" } },
  play: async () => {
    const overlay = within(document.body);
    const drawer = await overlay.findByRole("dialog", {
      name: "1,000 points added",
    });
    expect(drawer).toBeInTheDocument();
    expect(
      drawer.closest('[data-slot="drawer-popup"]') ??
        drawer.querySelector('[data-slot="drawer-popup"]'),
    ).not.toBeNull();
  },
};
