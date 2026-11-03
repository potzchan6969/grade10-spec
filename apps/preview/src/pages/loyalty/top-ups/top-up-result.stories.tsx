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
  parameters: {
    verification: { caseId: "vc_6d0001d2-b5b3-4c24-9acc-1318f24f3883" },
  },
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
  parameters: {
    verification: { caseId: "vc_30a8f3df-6fce-4b21-bb06-7b80f7d57a75" },
  },
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

/** Still unconfirmed after half a minute: the wait closes and the points
 * are promised in Points History. */
export const StillConfirming: Story = {
  parameters: {
    verification: { caseId: "vc_548927bc-def7-486e-a60f-5f9656afcabb" },
  },
  name: "Still Confirming",
  args: { state: "still-confirming" },
  play: async () => {
    const overlay = within(document.body);
    await waitFor(() =>
      expect(overlay.getByText("Still confirming your payment")).toBeVisible(),
    );
    expect(
      overlay.getByText(
        "Your points will show in Points History once it clears.",
      ),
    ).toBeVisible();
    expect(overlay.queryByRole("dialog")).not.toBeInTheDocument();
  },
};

/** The member came back without paying: retry starts the pick again. */
export const PaymentNotCompleted: Story = {
  parameters: {
    verification: { caseId: "vc_f5853734-28d6-45ec-87ea-c9166a766f28" },
  },
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
  parameters: {
    verification: { caseId: "vc_cb56f374-8683-49ea-b3f0-25262f0a7ee1" },
  },
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
