import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type FlowArgs,
  flowParameter,
  flowScreen,
  flowStory,
  walkFlow,
} from "../../flow-screens";

/**
 * The shopper's and member's critical store journeys, each a tree of the
 * screens that already draw its steps: the Canvas lays them out, and the
 * Screen control focuses one. No screen state sits in two flows; each flow
 * starts where the one before it stops.
 */
const meta = {
  title: "Store/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta<FlowArgs>;

export default meta;
type Story = StoryObj<FlowArgs>;

const GUEST_BUYS = [
  flowScreen(
    "1",
    "Store front",
    "store-front",
    "store-home-screens-store-home--default",
  ),
  flowScreen(
    "2",
    "Catalogue",
    "catalogue",
    "store-product-listing-screens-product-list--default",
  ),
  flowScreen(
    "3",
    "Card page",
    "card-page",
    "store-product-page-screens-product-detail--default",
  ),
  flowScreen(
    "4",
    "Added, guest cart",
    "guest-cart",
    "store-cart-screens-cart-drawer-guest--guest",
  ),
  flowScreen(
    "5",
    "Paid, back from checkout",
    "just-paid",
    "store-order-detail-screens-order-link--just-paid",
  ),
];

const MEMBER_CHECKS_OUT = [
  flowScreen(
    "1",
    "Member cart",
    "member-cart",
    "store-cart-screens-cart-drawer-member--items",
  ),
  flowScreen(
    "2",
    "Points chosen",
    "points-applied",
    "store-cart-screens-cart-drawer-member-checkout--points-applied",
  ),
  flowScreen(
    "3",
    "Redirecting to payment",
    "redirecting",
    "store-cart-screens-cart-drawer-member-checkout--checkout-redirecting",
  ),
];

const MEMBER_FOLLOWS_ORDERS = [
  flowScreen(
    "1",
    "My Orders",
    "order-list",
    "store-order-history-screens-order-history--filled",
  ),
  flowScreen(
    "2",
    "One order",
    "order-details",
    "store-order-detail-screens-order-details--filled",
  ),
  flowScreen(
    "2a",
    "Refunded in part",
    "partial-refund",
    "store-order-detail-screens-order-details--partial-refund",
  ),
];

/** A guest walks in at the front door, adds a card, pays at the shop and lands back on the order. */
export const GuestBuysACard: Story = {
  ...flowStory(GUEST_BUYS),
  parameters: {
    verification: { caseId: "vc_b21763f2-4f26-4802-bb4e-9e2d7e3780be" },
    journeys: [
      "grade10-site-store-home-US-01",
      "grade10-site-store-home-US-02",
      "grade10-site-store-product-listing-US-01",
      "grade10-site-store-product-listing-US-16",
      "grade10-site-store-product-page-US-02",
      "grade10-site-store-product-page-US-03",
      "grade10-site-store-product-page-US-11",
      "g10.store-cart-drawer.US10",
      "g10.store-cart-drawer.US15",
      "grade10-site-store-checkout-US-04",
      "g10.store-order-detail.US3",
      "g10.store-order-detail.US4",
    ],
    flow: flowParameter(GUEST_BUYS),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, GUEST_BUYS),
};

/** A member opens the cart, puts points against it and goes to pay. */
export const MemberChecksOut: Story = {
  ...flowStory(MEMBER_CHECKS_OUT),
  parameters: {
    verification: { caseId: "vc_c4b18bea-5b60-4b7d-8e7a-a4d36abad4ce" },
    journeys: [
      "g10.store-cart-drawer.US1",
      "g10.store-cart-drawer.US4",
      "g10.store-cart-drawer.US5",
      "grade10-site-store-checkout-US-01",
      "grade10-site-store-checkout-US-05",
    ],
    flow: flowParameter(MEMBER_CHECKS_OUT),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, MEMBER_CHECKS_OUT),
};

/** A member reads their orders, then one order and what was refunded. */
export const MemberFollowsOrders: Story = {
  ...flowStory(MEMBER_FOLLOWS_ORDERS),
  parameters: {
    verification: { caseId: "vc_fe80877d-aca5-465b-99d0-4b98fe8d76e8" },
    journeys: [
      "grade10-site-store-order-history-US-01",
      "grade10-site-store-order-detail-US-01",
    ],
    flow: flowParameter(MEMBER_FOLLOWS_ORDERS),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, MEMBER_FOLLOWS_ORDERS),
};
