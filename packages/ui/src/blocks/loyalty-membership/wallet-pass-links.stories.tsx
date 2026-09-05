import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { WalletPassLinks } from "./wallet-pass-links";

const copy = {
  heading: "Carry your card on your phone",
  unreachable: "We could not check your passes just now.",
};

const google = {
  id: "google",
  offer: { label: "Add to Google Wallet" },
};

const apple = {
  id: "apple",
  offer: { label: "Add to Apple Wallet" },
};

const meta = {
  title: "Loyalty membership/WalletPassLinks",
  component: WalletPassLinks,
  args: {
    copy,
    wallets: [google, apple],
    state: { status: "read" },
    onAdd: fn(),
    onEnd: fn(),
  },
} satisfies Meta<typeof WalletPassLinks>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Nothing held yet: both wallets, and the actions that mint them. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    );
    // The consumer's own name for the wallet, never the words on the button.
    await expect(args.onAdd).toHaveBeenCalledWith("apple");
  },
};

/** One mint in flight. That wallet's control waits, and only that one. */
export const AddingOne: Story = {
  args: { wallets: [{ ...google, adding: true }, apple] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The busy half is the assertion that matters: it is what stops a second
    // tap minting a second pass and voiding the first.
    await expect(
      canvas.getByRole("button", { name: "Add to Google Wallet" }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeEnabled();
  },
};

/** Minted: the address is a credential, so it arrives only after the tap. */
export const Saveable: Story = {
  args: {
    wallets: [
      {
        id: "google",
        offer: {
          label: "Open in Google Wallet",
          saveUrl: "https://pay.google.com/gp/v/save/x",
        },
      },
      apple,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A link, not a button: the minting already happened.
    await expect(
      canvas.getByRole("link", { name: "Open in Google Wallet" }),
    ).toHaveAttribute("href", "https://pay.google.com/gp/v/save/x");
  },
};

/**
 * Held, and the address still standing. The install survives the member being
 * recorded as holding one — the row existing is not the pass being installed.
 */
export const SaveableWhileHeld: Story = {
  args: {
    wallets: [
      {
        id: "google",
        offer: {
          label: "Open in Google Wallet",
          saveUrl: "https://pay.google.com/gp/v/save/x",
        },
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
      },
      apple,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "Open in Google Wallet" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "End your Google Wallet pass" }),
    ).toBeVisible();
  },
};

/**
 * One held, the other still offered. No add beside a held pass: minting ends
 * whatever is carried there, so the offer is withdrawn rather than repeated.
 */
export const HeldOneOfferedTheOther: Story = {
  args: {
    wallets: [
      {
        id: "google",
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
      },
      apple,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: "Add to Google Wallet" }),
    ).toBeNull();
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeVisible();
  },
};

/** Both held: one ending each, and no offer anywhere. */
export const HeldBothEndsEach: Story = {
  args: {
    wallets: [
      {
        id: "google",
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
      },
      {
        id: "apple",
        heldLabel: "You are carrying a pass in Apple Wallet",
        endLabel: "End your Apple Wallet pass",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "End your Apple Wallet pass" }),
    );
    await expect(args.onEnd).toHaveBeenCalledWith("apple");
  },
};

/** One ending in flight while the other stays actionable. */
export const EndingOne: Story = {
  args: {
    wallets: [
      {
        id: "google",
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
        ending: true,
      },
      {
        id: "apple",
        heldLabel: "You are carrying a pass in Apple Wallet",
        endLabel: "End your Apple Wallet pass",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "End your Google Wallet pass" }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole("button", { name: "End your Apple Wallet pass" }),
    ).toBeEnabled();
  },
};

/**
 * One wallet held and mid-ending, the other mid-add. Every per-wallet state at
 * once, which is the case a single block-level status cannot express.
 */
export const EachWalletItsOwnState: Story = {
  args: {
    wallets: [
      {
        id: "google",
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
        ending: true,
      },
      { ...apple, adding: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "End your Google Wallet pass" }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeDisabled();
  },
};

/**
 * One wallet's act failed while the other is fine. The complaint names the
 * wallet, so an unrelated success cannot wipe it and the member is never told
 * something went through when it did not.
 */
export const OneWalletFailed: Story = {
  args: {
    wallets: [
      {
        id: "google",
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
        failedLabel: "Your Google Wallet pass could not be ended. Try again.",
      },
      apple,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Announced, or a member who cannot see it has no reason to look.
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Your Google Wallet pass could not be ended. Try again.",
    );
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeEnabled();
  },
};

/**
 * A mint replaces the button with a link, under the member's own focus. The
 * link takes that focus: without it a keyboard member is dropped to the page
 * body by the button unmounting, with nothing said.
 */
export const FocusFollowsTheMint: Story = {
  render: (args) => {
    const [minted, setMinted] = useState(false);
    return (
      <WalletPassLinks
        {...args}
        onAdd={(id) => {
          if (id === "google") setMinted(true);
        }}
        wallets={[
          minted
            ? {
                id: "google",
                offer: {
                  label: "Open in Google Wallet",
                  saveUrl: "https://pay.google.com/gp/v/save/x",
                },
              }
            : google,
          apple,
        ]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Add to Google Wallet" }),
    );
    const link = await canvas.findByRole("link", {
      name: "Open in Google Wallet",
    });
    await expect(link).toHaveFocus();
    // The other wallet's control is untouched by the swap.
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeEnabled();
  },
};

/** Held, with nothing on offer: the ending is the whole block. */
export const HeldWithNothingOffered: Story = {
  args: {
    wallets: [
      {
        id: "apple",
        heldLabel: "You are carrying a pass in Apple Wallet",
        endLabel: "End your Apple Wallet pass",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByText("Carry your card on your phone"),
    ).toBeNull();
    await expect(
      canvas.getByRole("button", { name: "End your Apple Wallet pass" }),
    ).toBeVisible();
  },
};

/** A brand carrying no wallet draws nothing at all. */
export const NoneOffered: Story = {
  args: { wallets: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot]")).toBeNull();
  },
};

/** Before the answer arrives, nothing is claimed either way. */
export const Unknown: Story = {
  args: { state: { status: "unknown" } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot]")).toBeNull();
  },
};

/**
 * The standing could not be read. Said out loud rather than drawn as an empty
 * block, which a member would read as carrying nothing.
 */
export const Unreachable: Story = {
  args: {
    wallets: [],
    state: { status: "read", unreachable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "We could not check your passes just now.",
    );
  },
};
