import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { WalletPassLinks } from "./wallet-pass-links";

const copy = {
  heading: "Carry your card on your phone",
  end: "End this pass",
  held: "You are carrying a pass in Google Wallet",
  failed: "That did not go through. Try again.",
};

const offers = [{ wallet: "Google Wallet", addLabel: "Add to Google Wallet" }];

const meta = {
  title: "Loyalty membership/WalletPassLinks",
  component: WalletPassLinks,
  args: { copy, offers, onAdd: fn(), onEnd: fn() },
} satisfies Meta<typeof WalletPassLinks>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Nothing held yet: the offer, and the action that mints it. */
export const Default: Story = {
  args: { state: { status: "none" } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole("button", { name: "Add to Google Wallet" });
    await userEvent.click(add);
    await expect(args.onAdd).toHaveBeenCalledWith("Google Wallet");
  },
};

/** The mint is in flight. The block owns this state, so no second control exists. */
export const Adding: Story = {
  args: { state: { status: "adding" } },
};

/** Minted: the address is a credential, so it arrives only after the tap. */
export const Saveable: Story = {
  args: {
    state: { status: "none" },
    offers: [{ ...offers[0], saveUrl: "https://pay.google.com/gp/v/save/x" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Add to Google Wallet" });
    await expect(link).toHaveAttribute(
      "href",
      "https://pay.google.com/gp/v/save/x",
    );
  },
};

/** Carrying one: the offer gives way to the control that ends it. */
export const Held: Story = {
  args: { state: { status: "held", wallet: "Google Wallet" } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "End this pass" }),
    );
    await expect(args.onEnd).toHaveBeenCalledTimes(1);
  },
};

/**
 * Held on a deployment that offers nothing new — a wallet withdrawn after the
 * member saved one. The ending must survive it, or somebody who lost a phone
 * has no way to say so.
 */
export const HeldWithNothingOffered: Story = {
  args: { offers: [], state: { status: "held", wallet: "Google Wallet" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "End this pass" }),
    ).toBeVisible();
  },
};

/** An add or an ending that did not complete. Said out loud, and retryable. */
export const Failed: Story = {
  args: { state: { status: "failed" } },
};

/** Not read yet: nothing, rather than an offer that may not be true. */
export const Unknown: Story = {
  args: { state: { status: "unknown" } },
};

/** A brand with no wallet, and nothing held. */
export const NoWalletOffered: Story = {
  args: { offers: [], state: { status: "none" } },
};
