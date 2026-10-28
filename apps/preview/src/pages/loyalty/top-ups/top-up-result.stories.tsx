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

/* Only "Confirming Payment" is a modal; every settled outcome is a toast,
 * which sonner renders on document.body, so plays query the body. */

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

/** The pack credited: the new balance, as a toast. */
export const PointsAdded: Story = {
  name: "Points Added",
  args: { state: "added" },
  play: async () => {
    const overlay = within(document.body);
    await waitFor(() =>
      expect(overlay.getByText("1,000 points added")).toBeVisible(),
    );
    expect(overlay.getByText("New balance: 2,200 points")).toBeVisible();
    expect(overlay.queryByRole("dialog")).not.toBeInTheDocument();
  },
};

/** The pack held for an operator: what happens next and where to watch. */
export const UnderReview: Story = {
  name: "Under Review",
  args: { state: "under-review" },
  play: async () => {
    const overlay = within(document.body);
    await waitFor(() =>
      expect(overlay.getByText("Top-up under review")).toBeVisible(),
    );
    expect(
      overlay.getByText(/charged only if it’s approved.*TU-2026-0384/),
    ).toBeVisible();
    expect(
      overlay.getByRole("button", { name: "View in Points History" }),
    ).toBeVisible();
  },
};

/** The review refused the pack: nothing charged. */
export const NotApproved: Story = {
  name: "Not Approved",
  args: { state: "not-approved" },
  play: async () => {
    const overlay = within(document.body);
    await waitFor(() =>
      expect(overlay.getByText("Top-up not approved")).toBeVisible(),
    );
    expect(overlay.getByText("You haven’t been charged.")).toBeVisible();
  },
};

/** The member came back without paying: retry starts the pick again. */
export const PaymentNotCompleted: Story = {
  name: "Payment Not Completed",
  args: { state: "not-completed" },
  play: async () => {
    const overlay = within(document.body);
    await waitFor(() =>
      expect(overlay.getByText("Payment not completed")).toBeVisible(),
    );
    expect(overlay.getByText("You haven’t been charged.")).toBeVisible();
    expect(overlay.getByRole("button", { name: "Try again" })).toBeVisible();
  },
};

/** The toast reads the same at a phone width — only the confirming wait
 * is a drawer. */
export const Narrow: Story = {
  args: { state: "added" },
  globals: { viewport: { value: "mobile1" } },
  play: async () => {
    const overlay = within(document.body);
    await waitFor(() =>
      expect(overlay.getByText("1,000 points added")).toBeVisible(),
    );
    expect(overlay.getByText("New balance: 2,200 points")).toBeVisible();
  },
};
