import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { WalletPassLinks } from "./wallet-pass-links";

const copy = {
  heading: "Carry your card on your phone",
  failed: "That did not go through. Try again.",
};

const google = {
  id: "google",
  addLabel: "Add to Google Wallet",
};

const apple = {
  id: "apple",
  addLabel: "Add to Apple Wallet",
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

/** One mint in flight. Only that wallet's control waits. */
export const AddingOne: Story = {
  args: { wallets: [{ ...google, adding: true }, apple] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeEnabled();
  },
};

/** Minted: the address is a credential, so it arrives only after the tap. */
export const Saveable: Story = {
  args: {
    wallets: [
      { ...google, saveUrl: "https://pay.google.com/gp/v/save/x" },
      apple,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "Add to Google Wallet" }),
    ).toHaveAttribute("href", "https://pay.google.com/gp/v/save/x");
  },
};

/**
 * The address survives the member being recorded as holding one.
 *
 * A row existing is not a pass installed: the member has tapped Add and has
 * not yet opened the link, and taking it away there would leave them holding
 * a pass they cannot install and cannot ask for again.
 */
export const SaveableWhileHeld: Story = {
  args: {
    wallets: [
      {
        ...google,
        saveUrl: "https://pay.google.com/gp/v/save/x",
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
      },
      apple,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "Add to Google Wallet" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "End your Google Wallet pass" }),
    ).toBeInTheDocument();
  },
};

/** Carrying one, offered the other: each is its own row. */
export const HeldOneOfferedTheOther: Story = {
  args: {
    wallets: [
      {
        ...google,
        addLabel: undefined,
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
      },
      apple,
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // The wallet they hold does not hide the one they do not.
    await userEvent.click(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    );
    await expect(args.onAdd).toHaveBeenCalledWith("apple");
  },
};

/** Carrying both: one row each, and each ends on its own. */
export const HeldBothEndsEach: Story = {
  args: {
    wallets: [
      {
        ...google,
        addLabel: undefined,
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
      },
      {
        ...apple,
        addLabel: undefined,
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
    await expect(args.onEnd).not.toHaveBeenCalledWith("google");
  },
};

/** One ending in flight. The other row is untouched. */
export const EndingOne: Story = {
  args: {
    wallets: [
      {
        ...google,
        addLabel: undefined,
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
        ending: true,
      },
      {
        ...apple,
        addLabel: undefined,
        heldLabel: "You are carrying a pass in Apple Wallet",
        endLabel: "End your Apple Wallet pass",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "End your Apple Wallet pass" }),
    ).toBeEnabled();
  },
};

/**
 * A brand that has withdrawn its offer still owes a member who holds one the
 * control that ends it.
 */
export const HeldWithNothingOffered: Story = {
  args: {
    wallets: [
      {
        id: "google",
        heldLabel: "You are carrying a pass in Google Wallet",
        endLabel: "End your Google Wallet pass",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: /^Add to/ }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "End your Google Wallet pass" }),
    ).toBeInTheDocument();
  },
};

/** A deployment carrying no wallet draws nothing at all. */
export const NoneOffered: Story = {
  args: { wallets: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeEmptyDOMElement();
  },
};

/** Not read yet: nothing is claimed either way. */
export const Unknown: Story = {
  args: { state: { status: "unknown" } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeEmptyDOMElement();
  },
};

/** An add or an ending that did not complete, said once. */
export const Failed: Story = {
  args: { state: { status: "read", failed: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("That did not go through. Try again."),
    ).toBeInTheDocument();
  },
};
