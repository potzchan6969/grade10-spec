import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TopUpConfirming } from "./top-up-confirming";

const meta = {
  title: "Loyalty/Top Ups/Blocks/TopUpConfirming",
  component: TopUpConfirming,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    copy: {
      title: "Confirming your payment…",
      description: "Please keep this page open.",
    },
  },
} satisfies Meta<typeof TopUpConfirming>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The wait has no close control, and Escape leaves it up. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_85362096-37e7-4e44-a8bd-becce8bc0155" },
  },
  play: async () => {
    const overlay = within(document.body);
    const dialog = await overlay.findByRole("dialog", {
      name: "Confirming your payment…",
    });
    expect(within(dialog).queryByRole("button")).not.toBeInTheDocument();
    expect(overlay.getByRole("status")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(
      overlay.getByRole("dialog", { name: "Confirming your payment…" }),
    ).toBeInTheDocument();
  },
};

/** A phone: the same wait as a drawer. */
export const Narrow: Story = {
  parameters: {
    verification: { caseId: "vc_7238d7ed-6b74-4e7c-97a0-c8f671165a64" },
  },
  globals: { viewport: { value: "mobile1" } },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Confirming your payment…" }),
    ).toBeInTheDocument();
  },
};
