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
