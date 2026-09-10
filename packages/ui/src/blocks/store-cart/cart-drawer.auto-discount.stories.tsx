import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CartDrawer } from "./cart-drawer";
import {
  applySiteSalePromoInStories,
  DEFAULT_CART_COPY,
  SAMPLE_HELD_WITH_SITE_SALE_BLOCK,
  SAMPLE_HELD_WITH_SITE_SALE_STACKABLE,
  SPECIAL_SALE_CART_ITEMS,
  STORY_LIST_SUBTOTAL,
  STORY_REPLACE_PROMO_AMOUNT,
  STORY_REPLACE_TOTAL,
  STORY_SITE_SALE_LABEL,
  STORY_SPECIAL_SALE_SUBTOTAL,
  STORY_STACKED_PROMO_AMOUNT,
  STORY_STACKED_TOTAL,
} from "./fixtures";
import type { CartItemSummary, HeldPromoCode, PromoState } from "./types";

type SiteSaleCombineMode = "refuse" | "stack" | "replace";

/**
 * Interactive host for storewide special sale × SAVE20 combine modes.
 * Shopify rules decide refuse / stack / replace; removing the code always
 * restores the auto −10% site sale on the lines when the promotion is still
 * active. The site cut is never repeated as a footer “Store sale” row.
 */
function SiteSalePromoHost({
  mode,
  initialPromoApplied = false,
  heldPromoCodes,
}: {
  mode: SiteSaleCombineMode;
  /** Start with SAVE20 already applied (replace / stack applied canvases). */
  initialPromoApplied?: boolean;
  heldPromoCodes?: readonly HeldPromoCode[];
}) {
  const held =
    heldPromoCodes ??
    (mode === "refuse"
      ? SAMPLE_HELD_WITH_SITE_SALE_BLOCK
      : SAMPLE_HELD_WITH_SITE_SALE_STACKABLE);

  const appliedSeed =
    initialPromoApplied && mode !== "refuse"
      ? applySiteSalePromoInStories("SAVE20", mode)
      : null;
  const appliedOk = appliedSeed?.ok === true ? appliedSeed : null;

  const [open, setOpen] = useState(true);
  const [items, setItems] = useState<readonly CartItemSummary[]>(
    appliedOk?.items ?? SPECIAL_SALE_CART_ITEMS,
  );
  const [subtotal, setSubtotal] = useState(
    appliedOk?.subtotal ?? STORY_SPECIAL_SALE_SUBTOTAL,
  );
  const [total, setTotal] = useState(
    appliedOk?.total ?? STORY_SPECIAL_SALE_SUBTOTAL,
  );
  const [promo, setPromo] = useState<PromoState>(
    appliedOk
      ? {
          status: "applied",
          code: appliedOk.label,
          discountAmount: appliedOk.amount,
        }
      : { status: "collapsed" },
  );
  const [selectedHeldId, setSelectedHeldId] = useState<string | null>(
    appliedOk ? "held-save20" : null,
  );

  const restoreSiteSale = () => {
    setItems(SPECIAL_SALE_CART_ITEMS);
    setSubtotal(STORY_SPECIAL_SALE_SUBTOTAL);
    setTotal(STORY_SPECIAL_SALE_SUBTOTAL);
    setPromo({ status: "collapsed" });
    setSelectedHeldId(null);
  };

  const applySave20 = (code: string) => {
    const result = applySiteSalePromoInStories(code, mode);
    if (result.ok) {
      setItems(result.items);
      setSubtotal(result.subtotal);
      setTotal(result.total);
      setSelectedHeldId("held-save20");
      setPromo({
        status: "applied",
        code: result.label,
        discountAmount: result.amount,
      });
      return true;
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
      onApplyPromo={applySave20}
      onSelectHeldPromo={(id) => {
        const code = held.find((c) => c.id === id);
        if (!code?.applicable) return;
        applySave20(code.label);
      }}
    />
  );
}

/**
 * Site-sale × promo combine modes on the composed cart drawer.
 *
 * Site sale shows as line sale + compare-at; the code is the only footer
 * Discount row when it stacks. Core drawer states stay under
 * [`CartDrawer`](?path=/docs/store-cart-cartdrawer--docs).
 */
const meta = {
  title: "Store Cart/CartDrawer/Auto Discount",
  component: CartDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: true,
    onClose: () => {},
    items: SPECIAL_SALE_CART_ITEMS,
    subtotal: STORY_SPECIAL_SALE_SUBTOTAL,
    estimatedTotal: STORY_SPECIAL_SALE_SUBTOTAL,
    shippingEstimate: "Calculated at checkout",
    copy: DEFAULT_CART_COPY,
    pointsState: null,
  },
} satisfies Meta<typeof CartDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Storewide −10% on lines; SAVE20 refused — no code row. */
export const Refuse: Story = {
  render: () => <SiteSalePromoHost mode="refuse" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(
      canvas.getAllByText(STORY_SPECIAL_SALE_SUBTOTAL).length,
    ).toBeGreaterThanOrEqual(1);
    expect(canvas.queryByText(STORY_SITE_SALE_LABEL)).not.toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    );
    const sheet = within(canvas.getByRole("dialog", { name: "Promo code" }));
    expect(
      sheet.getByText("Cannot combine with the store sale on this order"),
    ).toBeInTheDocument();

    await userEvent.type(
      sheet.getByPlaceholderText("Enter promo code"),
      "SAVE20",
    );
    await userEvent.keyboard("{Enter}");
    expect(
      sheet.getAllByText("Cannot combine with the store sale on this order")
        .length,
    ).toBeGreaterThanOrEqual(1);
    expect(canvas.queryByText(/Discount \(SAVE20\)/)).not.toBeInTheDocument();
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
  },
};

/**
 * Site sale on lines; SAVE20 as footer Discount on the post-sale Subtotal.
 * Apply SAVE20 from the held ticket to stack.
 */
export const Stack: Story = {
  render: () => <SiteSalePromoHost mode="stack" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(
      canvas.getAllByText(STORY_SPECIAL_SALE_SUBTOTAL).length,
    ).toBeGreaterThanOrEqual(1);
    expect(canvas.queryByText(STORY_SITE_SALE_LABEL)).not.toBeInTheDocument();
    expect(canvas.queryByText(/Discount \(SAVE20\)/)).not.toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    );
    const sheet = within(canvas.getByRole("dialog", { name: "Promo code" }));
    const saveTicketApply = sheet
      .getAllByRole("button", { name: "Apply" })
      .find((btn) => btn.closest('[data-slot="promo-ticket"]'));
    expect(saveTicketApply).toBeTruthy();
    await userEvent.click(saveTicketApply!);

    await waitFor(() => {
      expect(canvas.getByText(/Discount \(SAVE20\)/)).toBeInTheDocument();
    });
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(canvas.queryByText(STORY_SITE_SALE_LABEL)).not.toBeInTheDocument();
    expect(canvas.getByText(STORY_STACKED_PROMO_AMOUNT)).toBeInTheDocument();
    expect(canvas.getByText(STORY_STACKED_TOTAL)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    await waitFor(() => {
      expect(canvas.queryByText(/Discount \(SAVE20\)/)).not.toBeInTheDocument();
    });
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
    expect(
      canvas.getAllByText(STORY_SPECIAL_SALE_SUBTOTAL).length,
    ).toBeGreaterThanOrEqual(1);
  },
};

/** Promo replaces the site sale — list lines; SAVE20 alone in the footer. */
export const Replace: Story = {
  render: () => <SiteSalePromoHost mode="replace" initialPromoApplied />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(canvas.queryByText("HK$22,050.00")).not.toBeInTheDocument();
    expect(canvas.queryByText(STORY_SITE_SALE_LABEL)).not.toBeInTheDocument();
    expect(canvas.getByText(/Discount \(SAVE20\)/)).toBeInTheDocument();
    expect(canvas.getByText(STORY_REPLACE_PROMO_AMOUNT)).toBeInTheDocument();
    expect(canvas.getByText(STORY_REPLACE_TOTAL)).toBeInTheDocument();
    expect(canvas.getByText(STORY_LIST_SUBTOTAL)).toBeInTheDocument();
  },
};

/** Remove the replacing promo — sale + compare-at return on the lines. */
export const FallbackAfterRemove: Story = {
  name: "Fallback after remove",
  render: () => <SiteSalePromoHost mode="replace" initialPromoApplied />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Discount \(SAVE20\)/)).toBeInTheDocument();
    expect(canvas.queryByText("HK$22,050.00")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(canvas.queryByText(/Discount \(SAVE20\)/)).not.toBeInTheDocument();
    });
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(canvas.queryByText(STORY_SITE_SALE_LABEL)).not.toBeInTheDocument();
    expect(
      canvas.getAllByText(STORY_SPECIAL_SALE_SUBTOTAL).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
  },
};
