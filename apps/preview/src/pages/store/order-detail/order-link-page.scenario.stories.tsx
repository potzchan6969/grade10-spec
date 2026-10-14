import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { askContent } from "../order-ask-toast";
import { RECEIPT_NOTE } from "../order-confirmed-content";
import { ORDER_DETAILS_READ_COPY } from "./order-details-content";
import { OrderLinkPage } from "./order-link-page";
import {
  DEFAULT_ORDER_LINK,
  ORDER_LINK_ARG_TYPES,
  ORDER_LINK_RULES,
  type OrderLinkSettings,
  viewOf,
} from "./order-link-scenario";

/**
 * An order through its private link, for any order and viewer staging can
 * hold: a guest's or a member's order, signed out or in, and how a sign-in
 * made from the page's ask went. The Screen is the designer's; the settings
 * decide what it shows and what the toast says.
 */
const meta = {
  title: "Store/Order Detail/Screens/Order Link/Scenario",
  tags: ["scenario"],
  args: DEFAULT_ORDER_LINK,
  argTypes: ORDER_LINK_ARG_TYPES,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-store-checkout-US-09"],
    rules: ORDER_LINK_RULES,
  },
  render: (args) => {
    const view = viewOf(args as OrderLinkSettings);
    return (
      <OrderLinkPage
        // New settings open the page again, so its toast starts over.
        key={JSON.stringify(args)}
        ask={view.ask}
        notFound={view.notFound}
        signedIn={view.signedIn}
      />
    );
  },
  play: async ({ args, canvasElement }) => {
    const view = viewOf(args as OrderLinkSettings);
    const canvas = within(canvasElement);
    if (view.notFound) {
      expect(
        canvas.getByRole("heading", {
          level: 1,
          name: ORDER_DETAILS_READ_COPY.notFoundTitle,
        }),
      ).toBeVisible();
      return;
    }
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "Order #G10-10482" }),
      ).toBeVisible(),
    );
    const note = canvas.queryByText(RECEIPT_NOTE, { exact: false });
    if (view.signedIn || !view.ask) expect(note).not.toBeInTheDocument();
    else expect(note).toBeInTheDocument();
    if (!view.ask) {
      expect(
        document.body.querySelector("[data-sonner-toast]"),
      ).not.toBeInTheDocument();
      return;
    }
    const { title } = askContent(view.ask);
    const toast = await waitFor(() => {
      const node = document.body.querySelector<HTMLElement>(
        "[data-sonner-toast]",
      );
      expect(node).not.toBeNull();
      return within(node as HTMLElement);
    });
    expect(await toast.findByText(title)).toBeInTheDocument();
  },
} satisfies Meta<OrderLinkSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A guest's order opened signed out: the receipt's email and the ask to add it. */
export const Scenario: Story = {};

/** The guest order has completed, so adding it now earns nothing. */
export const GuestOrderCompleted: Story = {
  name: "Guest order, completed",
  args: { progress: "completed" },
};

/** A member's order opened signed out: is this your order? */
export const MemberOrderSignedOut: Story = {
  name: "Member order, signed out",
  args: { order: "member" },
};

/** The holder closed the ask before; the page asks nothing. */
export const AskClosed: Story = {
  name: "Ask closed before",
  args: { closed: "yes" },
};

/** Signed in to an account that does not own it: the order, and no ask. */
export const SomeoneElse: Story = {
  name: "Signed in, not the owner",
  args: { viewer: "someoneElse" },
};

/** Signed in from the ask with the receipt's email: the order is added. */
export const Added: Story = {
  name: "Signed in · order added",
  args: { viewer: "signedInHere", joined: "added" },
};

/** Signed in under another email: the order is not added; a link can go to the receipt's. */
export const AnotherEmail: Story = {
  name: "Signed in · another email",
  args: { viewer: "signedInHere", joined: "notAdded" },
};

/** The sign-in link went to the receipt's email. */
export const LinkSent: Story = {
  name: "Signed in · another email, link sent",
  args: { viewer: "signedInHere", joined: "sent" },
};

/** The sign-in link could not be sent; the toast offers it again. */
export const SendFailed: Story = {
  name: "Signed in · another email, send failed",
  args: { viewer: "signedInHere", joined: "sendFailed" },
};

/** A wrong secret, an unknown order or no secret: not-found, and the way out is the store. */
export const WrongLink: Story = {
  name: "Wrong link",
  args: { link: "wrong" },
};
