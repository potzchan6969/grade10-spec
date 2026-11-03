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
  title: "Loyalty/Membership/Blocks/WalletPassLinks",
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
  parameters: {
    verification: { caseId: "vc_3ce9bcdf-7ce1-4525-8f10-81e7ce558b56" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    );
    // The consumer's own name for the wallet, never the words on the button.
    await expect(args.onAdd).toHaveBeenCalledWith("apple");
  },
};

/**
 * Each wallet's own artwork as the save action, its whole label read as the
 * control's name. Google's is its published button; Apple's is a placeholder
 * until Apple's licensed badge is added.
 */
export const VendorArtwork: Story = {
  parameters: {
    verification: { caseId: "vc_63aa8f34-6241-4c39-84e5-ac7236c1e84a" },
  },
  args: {
    wallets: [
      { ...google, artwork: { wallet: "google" } },
      { ...apple, artwork: { wallet: "apple" } },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole("button", { name: "Add to Google Wallet" });
    await expect(add.querySelector("img")).toHaveAttribute(
      "data-artwork",
      "vendor",
    );
    await expect(
      canvas
        .getByRole("button", { name: "Add to Apple Wallet" })
        .querySelector("img"),
    ).toHaveAttribute("data-artwork", "placeholder");
    await userEvent.click(add);
    await expect(args.onAdd).toHaveBeenCalledWith("google");
  },
};

/** Google's button in the member's own language. */
export const VendorArtworkTraditionalChinese: Story = {
  parameters: {
    verification: { caseId: "vc_19553792-bdfe-4f76-8d4a-8895d3c81d6e" },
  },
  args: {
    wallets: [
      {
        id: "google",
        offer: { label: "新增至 Google 錢包" },
        artwork: { wallet: "google", language: "zh-Hant" },
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "新增至 Google 錢包" }),
    ).toBeVisible();
  },
};

/** A mint in flight under the artwork: never dimmed, and a second tap waits. */
export const VendorArtworkAdding: Story = {
  parameters: {
    verification: { caseId: "vc_4d9b06a9-a3cb-4d2e-a57a-1b7aa5174368" },
  },
  args: {
    wallets: [{ ...google, adding: true, artwork: { wallet: "google" } }],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole("button", { name: "Add to Google Wallet" });
    await expect(add).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(add);
    await expect(args.onAdd).not.toHaveBeenCalled();
  },
};

/** Minted: the artwork becomes the install link, under the same name. */
export const VendorArtworkSaveable: Story = {
  parameters: {
    verification: { caseId: "vc_1bbf94df-7de5-499c-ac9d-87dca178b9b1" },
  },
  args: {
    wallets: [
      {
        id: "apple",
        offer: {
          label: "Add to Apple Wallet",
          saveUrl: "https://example.com/pass.pkpass",
        },
        artwork: { wallet: "apple" },
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "Add to Apple Wallet" }),
    ).toHaveAttribute("href", "https://example.com/pass.pkpass");
  },
};

/** One mint in flight. That wallet's control waits, and only that one. */
export const AddingOne: Story = {
  parameters: {
    verification: { caseId: "vc_75dd8ed3-73ba-4709-ad10-4295104dadc4" },
  },
  args: { wallets: [{ ...google, adding: true }, apple] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The busy half is the assertion that matters: it is what stops a second
    // tap minting a second pass and voiding the first.
    await expect(
      canvas.getByRole("button", { name: "Add to Google Wallet" }),
    ).toHaveAttribute("aria-disabled", "true");
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeEnabled();
  },
};

/** Minted: the address is a credential, so it arrives only after the tap. */
export const Saveable: Story = {
  parameters: {
    verification: { caseId: "vc_ce0e68f1-d6ea-49d6-a179-754cb669b99b" },
  },
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
  parameters: {
    verification: { caseId: "vc_7c6fee8c-34c3-4cfc-8c24-a8a0733c7e27" },
  },
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
  parameters: {
    verification: { caseId: "vc_3927784e-cd57-4478-afc8-aed9ef73de3b" },
  },
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
  parameters: {
    verification: { caseId: "vc_dc3dc618-d70f-4ef6-9bd4-9d6fe2288550" },
  },
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
  parameters: {
    verification: { caseId: "vc_90ccdd75-1971-493c-95e7-e2a9a625d4bc" },
  },
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
    ).toHaveAttribute("aria-disabled", "true");
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
  parameters: {
    verification: { caseId: "vc_17d068b4-6f87-49d1-b9a4-97e6c2fe2595" },
  },
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
    ).toHaveAttribute("aria-disabled", "true");
    await expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toHaveAttribute("aria-disabled", "true");
  },
};

/**
 * One wallet's act failed while the other is fine. The complaint names the
 * wallet, so an unrelated success cannot wipe it and the member is never told
 * something went through when it did not.
 */
export const OneWalletFailed: Story = {
  parameters: {
    verification: { caseId: "vc_77819419-0e7e-46a6-b421-f592f748b29c" },
  },
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
  parameters: {
    verification: { caseId: "vc_986ed4fa-d2a5-46b7-8642-d04298e938ca" },
  },
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
  parameters: {
    verification: { caseId: "vc_91a53f14-fed6-4345-bc38-ca9f26f81ea7" },
  },
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
  parameters: {
    verification: { caseId: "vc_58646818-5ede-4086-875d-e48104dd881e" },
  },
  args: { wallets: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot]")).toBeNull();
  },
};

/** Before the answer arrives, nothing is claimed either way. */
export const Unknown: Story = {
  parameters: {
    verification: { caseId: "vc_7ebc17fe-dcb9-4c6f-a35b-21080c8cce7c" },
  },
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
  parameters: {
    verification: { caseId: "vc_c0339aa4-86d5-4dfa-899a-deba4b293838" },
  },
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
