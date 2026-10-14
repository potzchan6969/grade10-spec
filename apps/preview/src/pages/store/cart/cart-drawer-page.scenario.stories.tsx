import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import {
  BASKET_ARG_TYPES,
  BASKET_RULES,
  type BasketSettings,
  basketBeforeTheCode,
  DEFAULT_BASKET,
  priceBasket,
} from "../../basket-walk";
import { CartDrawerPage } from "./cart-drawer-page";
import { drawer } from "./cart-drawer-page.test-helpers";

type Moment = "opening" | "before-code" | "priced";

type CartScenario = BasketSettings & {
  shopper: "member" | "guest";
  moment: Moment;
};

/** What the drawer holds for these settings, at this moment of the open. */
function basketOf(settings: CartScenario) {
  const basket =
    settings.shopper === "guest"
      ? { ...settings, coupon: "none" as const, points: "none" as const }
      : settings;
  return settings.moment === "priced"
    ? priceBasket(basket)
    : basketBeforeTheCode(basket);
}

const memberOnly = { if: { arg: "shopper", eq: "member" } } as const;

/**
 * The cart drawer for any basket staging can hold: a site discount, the one
 * code, the shop's answer when they meet, points and the lines' stock. The
 * screen is the designer's; the settings decide what it is given.
 */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Scenario",
  tags: ["scenario"],
  args: {
    ...DEFAULT_BASKET,
    shopper: "member",
    lines: "ready",
    moment: "priced",
  } satisfies CartScenario,
  argTypes: {
    shopper: {
      name: "Shopper",
      description:
        "Signed in on the shop or not, set in staging by signing in or out",
      control: { type: "radio", labels: { member: "Member", guest: "Guest" } },
      options: ["member", "guest"],
    },
    moment: {
      name: "Moment",
      description:
        "How far the open has come: the read on open, the lines priced before a code, or everything applied",
      control: {
        type: "radio",
        labels: {
          opening: "Reading on open",
          "before-code": "Before the code",
          priced: "Code and points applied",
        },
      },
      options: ["opening", "before-code", "priced"],
    },
    ...BASKET_ARG_TYPES,
    coupon: { ...BASKET_ARG_TYPES.coupon, ...memberOnly },
    points: { ...BASKET_ARG_TYPES.points, ...memberOnly },
    balance: { ...BASKET_ARG_TYPES.balance, ...memberOnly },
  },
  parameters: {
    layout: "fullscreen",
    journeys: [
      "shared-ui-store-cart-US-02",
      "shared-ui-store-cart-US-13",
      "shared-ui-store-cart-US-14",
      "shared-ui-store-cart-US-15",
      "shared-ui-store-cart-US-16",
      "shared-ui-store-cart-US-18",
      "grade10-site-store-checkout-US-01",
    ],
    rules: {
      ...BASKET_RULES,
      shopper:
        "grade10-site/store/checkout: A guest checks out the basket alone, and the order belongs to nobody",
      moment:
        "shared/ui/store-cart: Fetching status and price info on open with Boneyard skeletons",
    },
  },
  render: (args) => {
    const settings = args as CartScenario;
    const basket = basketOf(settings);
    return (
      <CartDrawerPage
        // A new basket opens a new drawer, so the screen's own state starts over.
        key={JSON.stringify(settings)}
        estimatedTotal={basket.estimatedTotal}
        guest={settings.shopper === "guest"}
        heldPromoCodes={basket.heldCode ? [basket.heldCode] : []}
        items={basket.items}
        loading={settings.moment === "opening"}
        orderDiscounts={basket.orderDiscounts}
        pointsBalanceLabel={basket.pointsBalanceLabel}
        pointsState={basket.pointsState}
        promoState={basket.promoState}
        subtotal={basket.subtotal}
      />
    );
  },
  play: async ({ args }) => {
    const settings = args as CartScenario;
    if (settings.moment === "opening") return;
    const basket = basketOf(settings);
    const canvas = drawer();
    await waitFor(() =>
      expect(canvas.getAllByText(basket.estimatedTotal).length).toBeGreaterThan(
        0,
      ),
    );
    for (const row of basket.orderDiscounts)
      expect(canvas.getAllByText(row.amount).length).toBeGreaterThan(0);
  },
} satisfies Meta<CartScenario>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A member's cart with an order code applied. */
export const Scenario: Story = {};

/** The sale on the card's line, and an order code stacked on it. */
export const CodeStacksOnTheSale: Story = {
  args: { siteDiscount: "product-sale", shopAnswer: "stack" },
};

/** The order discount stays and the code is refused beside it. */
export const CodeRefusedBesideTheDiscount: Story = {
  args: { siteDiscount: "order-discount", shopAnswer: "refuse" },
};

/** Points pay the whole bill, trimmed to what the order carries. */
export const PointsCoverTheBill: Story = {
  args: { points: "max", balance: "50000" },
};
