import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CartDrawer } from "./cart-drawer";
import {
  applySiteSalePromoInStories,
  DEFAULT_CART_COPY,
  follows,
  formatStoryCreditHkd,
  formatStoryHkd,
  orderDiscountRows,
  REPLACE_PROMO_AMOUNT,
  REPLACED_SUBTOTAL,
  REPLACED_TOTAL,
  SAMPLE_HELD_ON_SITE_SALE,
  SITE_SALE_CART_ITEMS,
  SITE_SALE_CHARIZARD,
  SITE_SALE_LUGIA,
  SITE_SALE_OFF_SALE,
  SITE_SALE_REFUSAL,
  SITE_SALE_SOLD_OUT,
  SITE_SALE_SUBTOTAL,
  SITE_SALE_UNAVAILABLE,
  STACKED_PROMO_AMOUNT,
  STACKED_TOTAL,
  storyPromoLabel,
} from "./fixtures";
import type { CartItemSummary, HeldPromoCode, PromoState } from "./types";

type SiteSaleCombineMode = "refuse" | "stack" | "replace";

/**
 * Interactive host for one cart on the site sale meeting SAVE20. The quote
 * owns every amount and decides line by line which lines a replacing code
 * takes; a code that meets the site sale reaches the drawer only as
 * `PromoState`, never as a line's `couponCode`. Removing the code puts the
 * sale back on the lines while it still runs. The sale is never a summary
 * row.
 */
function SiteSalePromoHost({
  mode,
  initialPromoApplied = false,
  initialItems = SITE_SALE_CART_ITEMS,
}: {
  mode: SiteSaleCombineMode;
  /** Start with SAVE20 already applied (replace / stack applied canvases). */
  initialPromoApplied?: boolean;
  initialItems?: readonly CartItemSummary[];
}) {
  const appliedSeed =
    initialPromoApplied && mode !== "refuse"
      ? applySiteSalePromoInStories("SAVE20", mode)
      : null;
  const appliedOk = appliedSeed?.ok === true ? appliedSeed : null;

  const [open, setOpen] = useState(true);
  const [held, setHeld] = useState<readonly HeldPromoCode[]>(
    SAMPLE_HELD_ON_SITE_SALE,
  );
  const [items, setItems] = useState<readonly CartItemSummary[]>(
    appliedOk?.items ?? initialItems,
  );
  const [subtotal, setSubtotal] = useState(
    appliedOk?.subtotal ?? SITE_SALE_SUBTOTAL,
  );
  const [total, setTotal] = useState(appliedOk?.total ?? SITE_SALE_SUBTOTAL);
  const [promo, setPromo] = useState<PromoState>(
    appliedOk
      ? {
          status: "applied",
          label: storyPromoLabel(appliedOk.label),
          discountAmount: appliedOk.amount,
        }
      : { status: "collapsed" },
  );
  const [selectedHeldId, setSelectedHeldId] = useState<string | null>(
    appliedOk ? "held-save20" : null,
  );

  const restoreSiteSale = () => {
    setItems(SITE_SALE_CART_ITEMS);
    setSubtotal(SITE_SALE_SUBTOTAL);
    setTotal(SITE_SALE_SUBTOTAL);
    setPromo({ status: "collapsed" });
    setSelectedHeldId(null);
  };

  const apply = (code: string, heldId: string | null) => {
    const result = applySiteSalePromoInStories(code, mode);
    if (result.ok) {
      setItems(result.items);
      setSubtotal(result.subtotal);
      setTotal(result.total);
      setSelectedHeldId(heldId);
      setPromo({
        status: "applied",
        label: storyPromoLabel(result.label),
        discountAmount: result.amount,
      });
      return true;
    }
    if (heldId) {
      // A picked code the quote refused can no longer apply on this cart.
      setHeld((codes) =>
        codes.map((c) =>
          c.id === heldId
            ? { ...c, applicable: false, inapplicableReason: result.error }
            : c,
        ),
      );
    }
    setPromo({ status: "expanded", error: result.error });
    return false;
  };

  return (
    <CartDrawer
      open={open}
      onClose={() => setOpen(false)}
      items={items}
      subtotal={subtotal}
      estimatedTotal={total}
      shippingEstimate="Calculated at checkout"
      copy={DEFAULT_CART_COPY}
      pointsState={null}
      promoState={promo}
      heldPromoCodes={held}
      selectedHeldPromoId={selectedHeldId}
      onPromoStateChange={setPromo}
      onQuantityChange={(id, qty) =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item,
          ),
        )
      }
      onRemoveItem={(id) =>
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
      onRemovePromo={restoreSiteSale}
      onApplyPromo={(code) => apply(code, null)}
      onSelectHeldPromo={(id) => {
        const code = held.find((c) => c.id === id);
        if (!code?.applicable) return;
        apply(code.label, id);
      }}
    />
  );
}

/**
 * Site sale × promo outcomes on the composed cart drawer.
 *
 * A site sale shows on the lines it cuts as the sale price beside the struck
 * list price, each the price of one; a code's discount is the only footer
 * Discount row. An order discount shows as its own footer row instead. Core
 * drawer states stay under
 * [`CartDrawer`](?path=/docs/store-cart-blocks-cartdrawer--docs).
 */
const meta = {
  title: "Store/Cart/Blocks/CartDrawer/Auto Discount",
  component: CartDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: true,
    onClose: () => {},
    items: SITE_SALE_CART_ITEMS,
    subtotal: SITE_SALE_SUBTOTAL,
    estimatedTotal: SITE_SALE_SUBTOTAL,
    shippingEstimate: "Calculated at checkout",
    copy: DEFAULT_CART_COPY,
    pointsState: null,
  },
} satisfies Meta<typeof CartDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The design-system Drawer portals its surface to `document.body` and marks
 * the story canvas inert while open, so every query below reads the body,
 * never `canvasElement`.
 */
const drawer = () => within(document.body);

const footer = () =>
  document.body.querySelector<HTMLElement>(
    '[data-slot="cart-drawer-footer"]',
  ) as HTMLElement;

/** The exact amount a summary row states, read from its spoken value. */
const summaryValue = (label: string) => {
  const row = within(footer()).getByText(label, { exact: true }).parentElement;
  return row?.querySelector(".sr-only")?.textContent ?? null;
};

/** The code's Discount rows: every row naming a code, apart from order discounts. */
const codeDiscountRows = () => within(footer()).queryAllByText(/^Discount \(/);

const line = (item: CartItemSummary) =>
  drawer()
    .getByRole("button", { name: item.name })
    .closest<HTMLElement>('[data-slot="cart-item"]') as HTMLElement;

const ownText = (el: Element) =>
  Array.from(el.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join("")
    .trim();

/** The prices a line strikes, read by their computed decoration. */
const struckPrices = (item: CartItemSummary) =>
  Array.from(line(item).querySelectorAll<HTMLElement>("span"))
    .filter((el) =>
      getComputedStyle(el).textDecorationLine.includes("line-through"),
    )
    .map(ownText);

const expectOnSale = (item: CartItemSummary) => {
  expect(within(line(item)).getByText(String(item.price))).toBeVisible();
  expect(struckPrices(item)).toEqual([String(item.originalPrice)]);
};

const expectAtPrice = (item: CartItemSummary, price = String(item.price)) => {
  expect(within(line(item)).getByText(price)).toBeVisible();
  expect(struckPrices(item)).toEqual([]);
};

/** Every outcome: the sale lines, the line off the sale, the sold-out line. */
const expectSiteSaleLines = () => {
  expectOnSale(SITE_SALE_CHARIZARD);
  expectOnSale(SITE_SALE_LUGIA);
  expectAtPrice(SITE_SALE_OFF_SALE);
  expect(
    within(line(SITE_SALE_SOLD_OUT)).getByText(
      DEFAULT_CART_COPY.item.soldOutLabel,
    ),
  ).toBeVisible();
};

type Sheet = ReturnType<typeof drawer>;

const openPromoSheet = async () => {
  await userEvent.click(
    drawer().getByRole("button", { name: /Select or enter code/i }),
  );
  return within(drawer().getByRole("dialog", { name: "Promo code" }));
};

/** The promo field's error, read through the field's own description. */
const promoFieldError = (sheet: Sheet) => {
  const input = sheet.getByPlaceholderText("Enter promo code");
  const id = input.getAttribute("aria-describedby");
  return id ? document.getElementById(id)?.textContent : null;
};

/** The tickets the sheet lists under "Not valid for this order". */
const notValidTickets = (sheet: Sheet) => {
  const heading = sheet.getByText(DEFAULT_CART_COPY.footer.notValidPromoCodes);
  return Array.from(
    heading.parentElement?.querySelectorAll<HTMLElement>(
      '[data-slot="promo-ticket"]',
    ) ?? [],
  );
};

const ticket = (sheet: Sheet, label: string) =>
  sheet.getByRole("group", { name: label });

/**
 * The site sale alone: two sale lines, one holding two, a line off the
 * sale, a sold-out line, and an unavailable line the drawer removes as it
 * opens. No code, no discount row.
 */
export const OnSale: Story = {
  render: () => (
    <>
      <Toast position="bottom-right" />
      <SiteSalePromoHost
        mode="stack"
        initialItems={[...SITE_SALE_CART_ITEMS, SITE_SALE_UNAVAILABLE]}
      />
    </>
  ),
  play: async () => {
    // shared-ui-store-cart-SC-26
    toast.dismiss();
    const canvas = drawer();
    await waitFor(() =>
      expect(canvas.queryByText(SITE_SALE_UNAVAILABLE.name)).toBeNull(),
    );
    expectSiteSaleLines();
    expect(summaryValue("Subtotal")).toBe(SITE_SALE_SUBTOTAL);
    expect(SITE_SALE_SUBTOTAL).toBe(formatStoryHkd(22050 + 16380 * 2 + 8900));
    expect(codeDiscountRows()).toHaveLength(0);
    expect(orderDiscountRows(document.body)).toHaveLength(0);
  },
};

/**
 * SAVE20 refused on the site sale, typed and then picked from a held ticket:
 * the lines and totals stay on the sale, the field says why, and the picked
 * ticket moves apart, muted, with that reason and no Apply.
 */
export const Refuse: Story = {
  render: () => <SiteSalePromoHost mode="refuse" />,
  play: async () => {
    // shared-ui-store-cart-SC-28, shared-ui-store-cart-SC-29,
    // shared-ui-store-cart-SC-53 and shared-ui-store-cart-SC-54
    const expectUnchanged = () => {
      expectSiteSaleLines();
      expect(summaryValue("Subtotal")).toBe(SITE_SALE_SUBTOTAL);
      expect(summaryValue("Estimated Total")).toBe(SITE_SALE_SUBTOTAL);
      expect(codeDiscountRows()).toHaveLength(0);
    };
    expectUnchanged();

    const sheet = await openPromoSheet();
    // Held codes that cannot apply sit apart, muted, with their reason.
    const apart = notValidTickets(sheet);
    expect(apart.map((t) => t.getAttribute("aria-label"))).toEqual([
      "SAVE200",
      "STACK10",
    ]);
    for (const held of apart) {
      expect(held).toHaveAttribute("aria-disabled", "true");
      expect(within(held).queryByRole("button")).toBeNull();
    }
    expect(
      within(ticket(sheet, "SAVE200")).getByText(
        "Add ~HK$7,300 more to use this promo code",
      ),
    ).toBeVisible();
    expect(
      within(ticket(sheet, "SAVE20")).getByRole("button", { name: "Apply" }),
    ).toBeEnabled();

    await userEvent.type(
      sheet.getByPlaceholderText("Enter promo code"),
      "SAVE20",
    );
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(promoFieldError(sheet)).toBe(SITE_SALE_REFUSAL));
    expectUnchanged();

    await userEvent.click(
      within(ticket(sheet, "SAVE20")).getByRole("button", { name: "Apply" }),
    );
    await waitFor(() =>
      expect(
        notValidTickets(sheet).map((t) => t.getAttribute("aria-label")),
      ).toContain("SAVE20"),
    );
    expect(promoFieldError(sheet)).toBe(SITE_SALE_REFUSAL);
    const picked = ticket(sheet, "SAVE20");
    expect(picked).toHaveAttribute("aria-disabled", "true");
    expect(within(picked).getByText(SITE_SALE_REFUSAL)).toBeVisible();
    expect(within(picked).queryByRole("button")).toBeNull();
    expect(
      within(ticket(sheet, "WELCOME100")).getByRole("button", {
        name: "Apply",
      }),
    ).toBeEnabled();
    expectUnchanged();
  },
};

/**
 * SAVE20 stacks on the site sale: the lines keep the sale and the footer
 * shows only the code's discount. Removing it leaves the lines on the sale.
 */
export const Stack: Story = {
  render: () => <SiteSalePromoHost mode="stack" />,
  play: async () => {
    // shared-ui-store-cart-SC-27 and shared-ui-store-cart-SC-31
    const canvas = drawer();
    expectSiteSaleLines();
    expect(summaryValue("Subtotal")).toBe(SITE_SALE_SUBTOTAL);
    expect(codeDiscountRows()).toHaveLength(0);

    const sheet = await openPromoSheet();
    await userEvent.click(
      within(ticket(sheet, "SAVE20")).getByRole("button", { name: "Apply" }),
    );

    await waitFor(() => expect(codeDiscountRows()).toHaveLength(1));
    expect(canvas.getByText(STACKED_PROMO_AMOUNT)).toBeVisible();
    expectSiteSaleLines();
    expect(summaryValue("Subtotal")).toBe(SITE_SALE_SUBTOTAL);
    expect(summaryValue("Estimated Total")).toBe(STACKED_TOTAL);
    expect(orderDiscountRows(document.body)).toHaveLength(0);

    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    await waitFor(() => expect(codeDiscountRows()).toHaveLength(0));
    expectSiteSaleLines();
    expect(summaryValue("Subtotal")).toBe(SITE_SALE_SUBTOTAL);
  },
};

/**
 * SAVE20 replaces the site sale on the Charizard alone: that line reads its
 * list price with nothing struck, the Lugia stays on the sale, and the footer
 * shows only the code's discount.
 */
export const Replace: Story = {
  render: () => <SiteSalePromoHost mode="replace" initialPromoApplied />,
  play: async () => {
    // shared-ui-store-cart-SC-30
    const canvas = drawer();
    expectAtPrice(SITE_SALE_CHARIZARD, "HK$24,500.00");
    expectOnSale(SITE_SALE_LUGIA);
    expectAtPrice(SITE_SALE_OFF_SALE);
    expect(codeDiscountRows()).toHaveLength(1);
    expect(canvas.getByText(REPLACE_PROMO_AMOUNT)).toBeVisible();
    expect(summaryValue("Subtotal")).toBe(REPLACED_SUBTOTAL);
    expect(REPLACED_SUBTOTAL).toBe(formatStoryHkd(24500 + 16380 * 2 + 8900));
    expect(summaryValue("Estimated Total")).toBe(REPLACED_TOTAL);
    expect(orderDiscountRows(document.body)).toHaveLength(0);
  },
};

/** Removing the replacing code puts the sale back on the line it had taken. */
export const FallbackAfterRemove: Story = {
  name: "Fallback after remove",
  render: () => <SiteSalePromoHost mode="replace" initialPromoApplied />,
  play: async () => {
    // shared-ui-store-cart-SC-31
    const canvas = drawer();
    expect(codeDiscountRows()).toHaveLength(1);
    expectAtPrice(SITE_SALE_CHARIZARD, "HK$24,500.00");

    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));

    await waitFor(() => expect(codeDiscountRows()).toHaveLength(0));
    expectSiteSaleLines();
    expect(summaryValue("Subtotal")).toBe(SITE_SALE_SUBTOTAL);
    expect(orderDiscountRows(document.body)).toHaveLength(0);
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
  },
};

/**
 * The replace and remove journeys walked from the start: on the sale, type
 * SAVE20, read the replaced line and the footer, then remove it.
 */
export const ReplaceAndRemoveWalk: Story = {
  name: "Replace and remove walk",
  render: () => <SiteSalePromoHost mode="replace" />,
  play: async () => {
    // shared-ui-store-cart-US-16 and shared-ui-store-cart-US-17
    const canvas = drawer();
    expectSiteSaleLines();
    const sheet = await openPromoSheet();
    await userEvent.type(
      sheet.getByPlaceholderText("Enter promo code"),
      "SAVE20",
    );
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(codeDiscountRows()).toHaveLength(1));
    expectAtPrice(SITE_SALE_CHARIZARD, "HK$24,500.00");
    expectOnSale(SITE_SALE_LUGIA);
    expect(summaryValue("Subtotal")).toBe(REPLACED_SUBTOTAL);
    expect(summaryValue("Estimated Total")).toBe(REPLACED_TOTAL);

    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    await waitFor(() => expect(codeDiscountRows()).toHaveLength(0));
    expectSiteSaleLines();
    expect(summaryValue("Estimated Total")).toBe(SITE_SALE_SUBTOTAL);
  },
};

const MIXED_SUBTOTAL_HKD = 22050 + 18200;
const MIXED_ORDER_CUT_HKD = 4025;
const MIXED_ORDER_DISCOUNT = {
  label: storyPromoLabel("Spend 10k 10% off"),
  amount: formatStoryCreditHkd(MIXED_ORDER_CUT_HKD),
};

/**
 * A product sale on one line beside an order discount: the sale line is
 * struck, the other line is not, and the order discount is its own footer row
 * after the Subtotal, with no Remove.
 */
export const ProductSaleWithOrderDiscount: Story = {
  name: "Product sale with order discount",
  args: {
    items: [
      {
        id: "item-1",
        name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
        price: "HK$22,050.00",
        originalPrice: "HK$24,500.00",
        quantity: 1,
        maxQuantity: 1,
        status: "default",
      },
      {
        id: "item-2",
        name: "2000 Neo Genesis 1st Edition Lugia Holo #9 BGS 9.5",
        price: "HK$18,200.00",
        quantity: 1,
        maxQuantity: 3,
        status: "default",
      },
    ],
    subtotal: formatStoryHkd(MIXED_SUBTOTAL_HKD),
    orderDiscounts: [MIXED_ORDER_DISCOUNT],
    estimatedTotal: formatStoryHkd(MIXED_SUBTOTAL_HKD - MIXED_ORDER_CUT_HKD),
    onPromoStateChange: () => {},
  },
  play: async () => {
    const canvas = drawer();
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(canvas.getAllByText("HK$18,200.00")).toHaveLength(1);

    const [row] = orderDiscountRows(document.body);
    expect(within(row).getByText(MIXED_ORDER_DISCOUNT.label)).toBeVisible();
    expect(within(row).getByText(MIXED_ORDER_DISCOUNT.amount)).toBeVisible();
    expect(within(row).queryByRole("button")).not.toBeInTheDocument();
    expect(follows(canvas.getByText("Subtotal"), row)).toBe(true);
    expect(
      follows(
        row,
        canvas.getByRole("button", { name: /Select or enter code/i }),
      ),
    ).toBe(true);
    expect(canvas.getByText("HK$36,225.00")).toBeInTheDocument();
  },
};
