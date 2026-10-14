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
  // A guest may take a public code, but spends no points.
  const basket =
    settings.shopper === "guest"
      ? { ...settings, points: "none" as const }
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
    coupon: {
      ...BASKET_ARG_TYPES.coupon,
      description:
        "Held in the member's wallet, minted by Loyalty; for a guest, a public code open to everyone",
    },
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
      "grade10-site-store-checkout-US-04",
    ],
    rules: {
      ...BASKET_RULES,
      shopper:
        "grade10-site/store/checkout: A guest checks out with a public code at most, and the order earns no points",
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
        publicPromoCodes={
          settings.shopper === "guest" && basket.heldCode
            ? [basket.heldCode]
            : undefined
        }
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
    if (basket.promoState.status === "expanded" && basket.promoState.error)
      expect(
        canvas.getAllByText(basket.promoState.error).length,
      ).toBeGreaterThan(0);
    if (settings.shopper === "guest") {
      expect(
        canvas.getByRole("button", { name: "Check Out as Guest" }),
      ).toBeInTheDocument();
      expect(canvas.queryByText("Use points")).not.toBeInTheDocument();
      return;
    }
    if (basket.pointsState?.status === "applied")
      expect(
        canvas.getAllByText(String(basket.pointsState.amountLabel)).length,
      ).toBeGreaterThan(0);
  },
} satisfies Meta<CartScenario>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A member's cart with an order code applied. */
export const Scenario: Story = {};

// Every way a site discount, the one code and points meet. A code meets a site
// discount only when both apply to the basket, and then the shop's answer decides.

export const NoDiscountNoCode: Story = {
  name: "No site discount · no code · 500 pts",
  args: { siteDiscount: "none", coupon: "none", points: "500" },
};

export const NoDiscountOrderCode: Story = {
  name: "No site discount · HK$50 code · 500 pts",
  args: { siteDiscount: "none", coupon: "order", points: "500" },
};

export const NoDiscountProductCode: Story = {
  name: "No site discount · 10% card code · 500 pts",
  args: { siteDiscount: "none", coupon: "product", points: "500" },
};

export const NoDiscountCodeTooSmall: Story = {
  name: "No site discount · HK$200 code, order too small · 500 pts",
  args: { siteDiscount: "none", coupon: "too-small", points: "500" },
};

export const SaleNoCode: Story = {
  name: "Sale on the card · no code · 500 pts",
  args: { siteDiscount: "product-sale", coupon: "none", points: "500" },
};

export const SaleOrderCodeStacks: Story = {
  name: "Sale on the card · HK$50 code stacks · 500 pts",
  args: {
    siteDiscount: "product-sale",
    coupon: "order",
    shopAnswer: "stack",
    points: "500",
  },
};

export const SaleOrderCodeReplaces: Story = {
  name: "Sale on the card · HK$50 code replaces the discount · 500 pts",
  args: {
    siteDiscount: "product-sale",
    coupon: "order",
    shopAnswer: "replace",
    points: "500",
  },
};

export const SaleOrderCodeRefused: Story = {
  name: "Sale on the card · HK$50 code refused · 500 pts",
  args: {
    siteDiscount: "product-sale",
    coupon: "order",
    shopAnswer: "refuse",
    points: "500",
  },
};

export const SaleProductCodeStacks: Story = {
  name: "Sale on the card · 10% card code stacks · 500 pts",
  args: {
    siteDiscount: "product-sale",
    coupon: "product",
    shopAnswer: "stack",
    points: "500",
  },
};

export const SaleProductCodeReplaces: Story = {
  name: "Sale on the card · 10% card code replaces the discount · 500 pts",
  args: {
    siteDiscount: "product-sale",
    coupon: "product",
    shopAnswer: "replace",
    points: "500",
  },
};

export const SaleProductCodeRefused: Story = {
  name: "Sale on the card · 10% card code refused · 500 pts",
  args: {
    siteDiscount: "product-sale",
    coupon: "product",
    shopAnswer: "refuse",
    points: "500",
  },
};

export const SaleCodeTooSmall: Story = {
  name: "Sale on the card · HK$200 code, order too small · 500 pts",
  args: { siteDiscount: "product-sale", coupon: "too-small", points: "500" },
};

export const OrderDiscountNoCode: Story = {
  name: "Order discount · no code · 500 pts",
  args: { siteDiscount: "order-discount", coupon: "none", points: "500" },
};

export const OrderDiscountOrderCodeStacks: Story = {
  name: "Order discount · HK$50 code stacks · 500 pts",
  args: {
    siteDiscount: "order-discount",
    coupon: "order",
    shopAnswer: "stack",
    points: "500",
  },
};

export const OrderDiscountOrderCodeReplaces: Story = {
  name: "Order discount · HK$50 code replaces the discount · 500 pts",
  args: {
    siteDiscount: "order-discount",
    coupon: "order",
    shopAnswer: "replace",
    points: "500",
  },
};

export const OrderDiscountOrderCodeRefused: Story = {
  name: "Order discount · HK$50 code refused · 500 pts",
  args: {
    siteDiscount: "order-discount",
    coupon: "order",
    shopAnswer: "refuse",
    points: "500",
  },
};

export const OrderDiscountProductCodeStacks: Story = {
  name: "Order discount · 10% card code stacks · 500 pts",
  args: {
    siteDiscount: "order-discount",
    coupon: "product",
    shopAnswer: "stack",
    points: "500",
  },
};

export const OrderDiscountProductCodeReplaces: Story = {
  name: "Order discount · 10% card code replaces the discount · 500 pts",
  args: {
    siteDiscount: "order-discount",
    coupon: "product",
    shopAnswer: "replace",
    points: "500",
  },
};

export const OrderDiscountProductCodeRefused: Story = {
  name: "Order discount · 10% card code refused · 500 pts",
  args: {
    siteDiscount: "order-discount",
    coupon: "product",
    shopAnswer: "refuse",
    points: "500",
  },
};

export const OrderDiscountCodeTooSmall: Story = {
  name: "Order discount · HK$200 code, order too small · 500 pts",
  args: { siteDiscount: "order-discount", coupon: "too-small", points: "500" },
};

/** The member asks for more points than they hold, so the whole balance goes. */
export const PointsWholeBalance: Story = {
  name: "Points · the whole balance",
  args: { siteDiscount: "product-sale", points: "max", balance: "1250" },
};

/** Points pay the whole bill, trimmed to what the order carries. */
export const PointsCoverTheBill: Story = {
  name: "Points · cover the bill",
  args: { siteDiscount: "product-sale", points: "max", balance: "50000" },
};

/** The card sold out, so a code for graded cards has nothing to cut. */
export const CardSoldOut: Story = {
  name: "Lines · card sold out, card code held",
  args: { coupon: "product", lines: "sold-out", points: "500" },
};

/** The shop had two boxes of more asked; the codes and points price the two. */
export const BoxesShort: Story = {
  name: "Lines · two boxes left",
  args: { siteDiscount: "order-discount", lines: "adjusted", points: "500" },
};

// A guest meets the same site discounts and codes, with public codes only and no points.

export const GuestNoDiscountNoCode: Story = {
  name: "Guest · No site discount · no code",
  args: { shopper: "guest", siteDiscount: "none", coupon: "none" },
};

export const GuestNoDiscountOrderCode: Story = {
  name: "Guest · No site discount · HK$50 code",
  args: { shopper: "guest", siteDiscount: "none", coupon: "order" },
};

export const GuestNoDiscountProductCode: Story = {
  name: "Guest · No site discount · 10% card code",
  args: { shopper: "guest", siteDiscount: "none", coupon: "product" },
};

export const GuestNoDiscountCodeTooSmall: Story = {
  name: "Guest · No site discount · HK$200 code, order too small",
  args: { shopper: "guest", siteDiscount: "none", coupon: "too-small" },
};

export const GuestSaleNoCode: Story = {
  name: "Guest · Sale on the card · no code",
  args: { shopper: "guest", siteDiscount: "product-sale", coupon: "none" },
};

export const GuestSaleOrderCodeStacks: Story = {
  name: "Guest · Sale on the card · HK$50 code stacks",
  args: {
    shopper: "guest",
    siteDiscount: "product-sale",
    coupon: "order",
    shopAnswer: "stack",
  },
};

export const GuestSaleOrderCodeReplaces: Story = {
  name: "Guest · Sale on the card · HK$50 code replaces the discount",
  args: {
    shopper: "guest",
    siteDiscount: "product-sale",
    coupon: "order",
    shopAnswer: "replace",
  },
};

export const GuestSaleOrderCodeRefused: Story = {
  name: "Guest · Sale on the card · HK$50 code refused",
  args: {
    shopper: "guest",
    siteDiscount: "product-sale",
    coupon: "order",
    shopAnswer: "refuse",
  },
};

export const GuestSaleProductCodeStacks: Story = {
  name: "Guest · Sale on the card · 10% card code stacks",
  args: {
    shopper: "guest",
    siteDiscount: "product-sale",
    coupon: "product",
    shopAnswer: "stack",
  },
};

export const GuestSaleProductCodeReplaces: Story = {
  name: "Guest · Sale on the card · 10% card code replaces the discount",
  args: {
    shopper: "guest",
    siteDiscount: "product-sale",
    coupon: "product",
    shopAnswer: "replace",
  },
};

export const GuestSaleProductCodeRefused: Story = {
  name: "Guest · Sale on the card · 10% card code refused",
  args: {
    shopper: "guest",
    siteDiscount: "product-sale",
    coupon: "product",
    shopAnswer: "refuse",
  },
};

export const GuestSaleCodeTooSmall: Story = {
  name: "Guest · Sale on the card · HK$200 code, order too small",
  args: { shopper: "guest", siteDiscount: "product-sale", coupon: "too-small" },
};

export const GuestOrderDiscountNoCode: Story = {
  name: "Guest · Order discount · no code",
  args: { shopper: "guest", siteDiscount: "order-discount", coupon: "none" },
};

export const GuestOrderDiscountOrderCodeStacks: Story = {
  name: "Guest · Order discount · HK$50 code stacks",
  args: {
    shopper: "guest",
    siteDiscount: "order-discount",
    coupon: "order",
    shopAnswer: "stack",
  },
};

export const GuestOrderDiscountOrderCodeReplaces: Story = {
  name: "Guest · Order discount · HK$50 code replaces the discount",
  args: {
    shopper: "guest",
    siteDiscount: "order-discount",
    coupon: "order",
    shopAnswer: "replace",
  },
};

export const GuestOrderDiscountOrderCodeRefused: Story = {
  name: "Guest · Order discount · HK$50 code refused",
  args: {
    shopper: "guest",
    siteDiscount: "order-discount",
    coupon: "order",
    shopAnswer: "refuse",
  },
};

export const GuestOrderDiscountProductCodeStacks: Story = {
  name: "Guest · Order discount · 10% card code stacks",
  args: {
    shopper: "guest",
    siteDiscount: "order-discount",
    coupon: "product",
    shopAnswer: "stack",
  },
};

export const GuestOrderDiscountProductCodeReplaces: Story = {
  name: "Guest · Order discount · 10% card code replaces the discount",
  args: {
    shopper: "guest",
    siteDiscount: "order-discount",
    coupon: "product",
    shopAnswer: "replace",
  },
};

export const GuestOrderDiscountProductCodeRefused: Story = {
  name: "Guest · Order discount · 10% card code refused",
  args: {
    shopper: "guest",
    siteDiscount: "order-discount",
    coupon: "product",
    shopAnswer: "refuse",
  },
};

export const GuestOrderDiscountCodeTooSmall: Story = {
  name: "Guest · Order discount · HK$200 code, order too small",
  args: {
    shopper: "guest",
    siteDiscount: "order-discount",
    coupon: "too-small",
  },
};
