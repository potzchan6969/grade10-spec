import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Account menu",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...SITE_HEADER_BASE_ARGS,
    session: "signed-in",
    accountMenuDefaultOpen: true,
    onLocaleChange: fn(),
    onSignIn: fn(),
    onProfile: fn(),
    onMyOrders: fn(),
    onMyAuctions: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Profile joins first, ahead of My Orders, when its handler is supplied. */
export const ProfileAndMyOrders: Story = {
  name: "Profile and My Orders both offered",
  play: async ({ canvasElement, args }) => {
    await within(canvasElement).findByRole("button", { name: "Account" });
    const body = within(canvasElement.ownerDocument.body);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Profile",
      "My Orders",
      "My Auctions",
      "Sign out",
    ]);
    await userEvent.click(body.getByRole("menuitem", { name: "Profile" }));
    expect(args.onProfile).toHaveBeenCalledTimes(1);
    expect(args.onMyOrders).not.toHaveBeenCalled();
    expect(args.onMyAuctions).not.toHaveBeenCalled();
    expect(args.onSignOut).not.toHaveBeenCalled();
  },
};

/**
 * No `onProfile` handler — the menu omits Profile entirely and opens
 * directly on My Orders.
 */
export const NoProfileHandler: Story = {
  name: "No Profile handler — omitted, opens on My Orders",
  args: { onProfile: undefined },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole("button", { name: "Account" });
    const body = within(canvasElement.ownerDocument.body);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "My Orders",
      "My Auctions",
      "Sign out",
    ]);
    expect(body.queryByRole("menuitem", { name: "Profile" })).toBeNull();
  },
};

/**
 * Neither `onProfile` nor `onMyOrders` is supplied — the menu holds only My
 * Auctions and Sign out.
 */
export const NeitherProfileNorMyOrders: Story = {
  name: "No Profile or My Orders handler",
  args: { onProfile: undefined, onMyOrders: undefined },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole("button", { name: "Account" });
    const body = within(canvasElement.ownerDocument.body);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "My Auctions",
      "Sign out",
    ]);
    expect(body.queryByRole("menuitem", { name: "Profile" })).toBeNull();
    expect(body.queryByRole("menuitem", { name: "My Orders" })).toBeNull();
  },
};

/**
 * Profile supplied without My Orders — Profile still leads, ahead of My
 * Auctions.
 */
export const ProfileWithoutMyOrders: Story = {
  name: "Profile handler, no My Orders handler",
  args: { onMyOrders: undefined },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole("button", { name: "Account" });
    const body = within(canvasElement.ownerDocument.body);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Profile",
      "My Auctions",
      "Sign out",
    ]);
    expect(body.queryByRole("menuitem", { name: "My Orders" })).toBeNull();
  },
};

/**
 * Signed out ignores both handlers entirely — session-gating is the outer
 * gate, so neither Profile nor My Orders ever renders while signed out.
 */
export const SignedOutIgnoresHandlers: Story = {
  name: "Signed out ignores Profile and My Orders handlers",
  args: { session: "signed-out", accountMenuDefaultOpen: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Account" })).toBeNull();
    expect(
      within(canvasElement.ownerDocument.body).queryByRole("menuitem", {
        name: "Profile",
      }),
    ).toBeNull();
  },
};
