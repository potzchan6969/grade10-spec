import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { MEMBERSHIP_STATE_VIEWS, MEMBERSHIP_VIEW } from "../loyalty-content";
import { MembershipPage } from "./membership-page";

const meta = {
  title: "Loyalty/Membership/Screens/Membership/Member Pass",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW, tab: "overview" },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The card is carried in Google Wallet; the member can end that pass alone. */
export const PassAdded: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.passAdded, platform: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Member Pass" }),
    );
    const overlay = within(document.body);
    expect(
      await overlay.findByText("Carried in Google Wallet"),
    ).toBeInTheDocument();
    expect(
      overlay.getByRole("button", { name: "End Google pass" }),
    ).toBeInTheDocument();
    expect(
      overlay.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(overlay.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  },
};
