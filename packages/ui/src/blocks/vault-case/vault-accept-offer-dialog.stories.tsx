import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { ACCEPT_COPY, REFUSAL } from "./fixtures";
import { VaultAcceptOfferDialog } from "./vault-accept-offer-dialog";

const meta = {
  title: "Vault Case/VaultAcceptOfferDialog",
  component: VaultAcceptOfferDialog,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: ACCEPT_COPY,
    open: true,
    pending: false,
    refusal: null,
    onConfirm: fn(),
    onGoBack: fn(),
  },
} satisfies Meta<typeof VaultAcceptOfferDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const dialog = () => screen.findByRole("dialog", { name: ACCEPT_COPY.title });
const button = (scope: HTMLElement, name: string) =>
  within(scope).getByRole("button", { name });

/** The terms read before the answer, and Accept is reported once
 * (shared-ui-vault-case-SC-18). */
export const Open: Story = {
  play: async ({ args }) => {
    const shown = await dialog();
    for (const line of [
      ACCEPT_COPY.lead,
      ACCEPT_COPY.total,
      ACCEPT_COPY.lateDay,
      ACCEPT_COPY.signs,
    ]) {
      expect(within(shown).getByText(line)).toBeInTheDocument();
    }
    button(shown, ACCEPT_COPY.goBack);
    await userEvent.click(button(shown, ACCEPT_COPY.accept));
    expect(args.onConfirm).toHaveBeenCalledTimes(1);
    expect(args.onGoBack).not.toHaveBeenCalled();
  },
};

/** Go back and Escape each report going back, and nothing is answered
 * (shared-ui-vault-case-SC-19). */
export const GoingBack: Story = {
  play: async ({ args }) => {
    const shown = await dialog();
    await userEvent.click(button(shown, ACCEPT_COPY.goBack));
    expect(args.onGoBack).toHaveBeenCalledTimes(1);
    await userEvent.keyboard("{Escape}");
    expect(args.onGoBack).toHaveBeenCalledTimes(2);
    expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

/** An answer in flight holds the dialog: Accept busy, Go back unavailable,
 * Escape ignored (shared-ui-vault-case-SC-20). */
export const Pending: Story = {
  args: { pending: true },
  play: async ({ args }) => {
    const shown = await dialog();
    expect(button(shown, ACCEPT_COPY.accept)).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(button(shown, ACCEPT_COPY.goBack)).toBeDisabled();
    await userEvent.keyboard("{Escape}");
    expect(await dialog()).toBeInTheDocument();
    expect(args.onGoBack).not.toHaveBeenCalled();
    expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

/** A refusal reads beside the terms, both ways out back
 * (shared-ui-vault-case-SC-21). */
export const Refused: Story = {
  args: { refusal: REFUSAL },
  play: async () => {
    const shown = await dialog();
    expect(within(shown).getByRole("alert")).toHaveTextContent(REFUSAL);
    expect(within(shown).getByText(ACCEPT_COPY.total)).toBeInTheDocument();
    expect(button(shown, ACCEPT_COPY.goBack)).toBeEnabled();
    expect(button(shown, ACCEPT_COPY.accept)).toBeEnabled();
  },
};

/** Closed, it draws nothing: the case page holds it open
 * (shared-ui-vault-case-SC-22). */
export const Closed: Story = {
  args: { open: false },
  play: async () => {
    expect(screen.queryByRole("dialog")).toBeNull();
  },
};
