import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Auction first",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...SITE_HEADER_BASE_ARGS,
    session: "signed-out",
    onLocaleChange: fn(),
    onSignIn: fn(),
    onProfile: fn(),
    onMyAuctions: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Language switch, primary Sign In, no Store, no cart. */
export const SignedOut: Story = {
  name: "Signed out",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Account" })).toBeNull();
    expect(canvas.queryByRole("button", { name: "Cart" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Store" })).toBeNull();
    expect(canvas.getByRole("link", { name: "Auction" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const storeLocator = canvas.getByRole("link", { name: "Store Locator" });
    const help = canvas.getByRole("link", { name: "Help" });
    expect(
      storeLocator.compareDocumentPosition(help) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(help).toHaveAttribute("href", "https://grade10.mintlify.io/");
    expect(help).toHaveAttribute("target", "_blank");
    expect(help).toHaveAttribute("rel", "noopener noreferrer");
    await userEvent.click(canvas.getByRole("button", { name: "Sign In" }));
    expect(args.onSignIn).toHaveBeenCalled();
  },
};

/** Account icon; menu holds Profile, My Auctions, Sign out. */
export const SignedIn: Story = {
  name: "Signed in",
  args: { session: "signed-in" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Sign In" })).toBeNull();
    expect(canvas.queryByRole("button", { name: "Cart" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Store" })).toBeNull();
  },
};

/** Opens the account menu and asserts auction-first items. */
export const AccountMenu: Story = {
  name: "Account menu open",
  args: { session: "signed-in", accountMenuDefaultOpen: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    expect(
      await body.findByRole("menuitem", { name: "Profile" }),
    ).toBeInTheDocument();
    expect(
      body.getByRole("menuitem", { name: "My Auctions" }),
    ).toBeInTheDocument();
    expect(
      body.getByRole("menuitem", { name: "Sign out" }),
    ).toBeInTheDocument();
    expect(body.queryByRole("menuitem", { name: "Orders" })).toBeNull();
    await userEvent.click(body.getByRole("menuitem", { name: "My Auctions" }));
    expect(args.onMyAuctions).toHaveBeenCalled();
    // Leave the menu open — this story is the layout SoT for the open menu.
    await userEvent.click(canvas.getByRole("button", { name: "Account" }));
    expect(
      await body.findByRole("menuitem", { name: "Profile" }),
    ).toBeInTheDocument();
  },
};
