import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { WalletPassLinks } from "./wallet-pass-links";

const meta = {
  title: "Loyalty Membership/WalletPassLinks",
  component: WalletPassLinks,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      heading: "Carry your card on your phone",
      addLabel: "Add to",
      end: "End this pass",
      held: "You are carrying a pass in",
    },
    offers: [
      {
        wallet: "Google Wallet",
        saveUrl: "https://pay.google.com/gp/v/save/fixture-token",
      },
    ],
    state: { status: "none" },
    onEnd: fn(),
  },
} satisfies Meta<typeof WalletPassLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The address is the consumer's; the block only encodes it. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole("link", { name: /Add to Google Wallet/ });
    expect(add).toHaveAttribute(
      "href",
      "https://pay.google.com/gp/v/save/fixture-token",
    );
    expect(canvas.queryByRole("button", { name: "End this pass" })).toBeNull();
  },
};

/** A member already carrying one is offered the ending, and only reports it. */
export const Held: Story = {
  args: { state: { status: "held", wallet: "Google Wallet" } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/You are carrying a pass in/)).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "End this pass" }),
    );
    expect(args.onEnd).toHaveBeenCalledTimes(1);
  },
};

/** A brand offering no wallet renders nothing at all, never an empty heading. */
export const NoWalletOffered: Story = {
  args: { offers: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Carry your card on your phone")).toBeNull();
  },
};
