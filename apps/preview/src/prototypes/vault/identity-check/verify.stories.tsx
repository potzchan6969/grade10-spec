import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VerifyPrototype } from "./verify-prototype";

const meta = {
  title: "Vault/Identity Check/Prototypes/Verify",
  component: VerifyPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VerifyPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The invitation opens the check: what it needs, the consent, and Start the check. */
export const Invited: Story = {
  args: { state: "invited" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Verify your identity" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Start the check" }),
    ).toBeVisible();
  },
};

/** A check begun earlier: the page carries on from the step reached. */
export const Started: Story = {
  args: { state: "started" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Carry on" })).toBeVisible();
  },
};

/** The provider has the check: nothing is asked of the collector. */
export const Submitted: Story = {
  args: { state: "submitted" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("We are checking your ID")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Start the check" }),
    ).not.toBeInTheDocument();
  },
};

/** The check passed: nothing further, and the item is brought to the visit. */
export const Approved: Story = {
  args: { state: "approved" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("You are verified")).toBeVisible();
  },
};

/** Declined online: the page says to bring the ID to the visit, with no reason. */
export const Declined: Story = {
  args: { state: "declined" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "Bring your ID to your visit and we will check it at the counter.",
      ),
    ).toBeVisible();
  },
};

/** The invitation has expired: ask the shop for a new one. */
export const Expired: Story = {
  args: { state: "expired" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("This invitation has expired")).toBeVisible();
  },
};
