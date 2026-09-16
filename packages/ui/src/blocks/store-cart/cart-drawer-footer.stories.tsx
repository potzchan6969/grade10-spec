import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CartDrawerFooter, CartPromoSheet } from "./cart-drawer";
import {
  applyTypedPromoInStories,
  DEFAULT_CART_COPY,
  formatStoryCreditHkd,
  parseStoryMoney,
  SAMPLE_HELD_DISCOUNTS,
  SAMPLE_HELD_INAPPLICABLE_ONLY,
  SAMPLE_HELD_PROMO_CODES,
  STORY_POINTS_MAX_HKD,
  storyCartEstimatedTotal,
} from "./fixtures";
import type { HeldPromoCode, PointsState, PromoState } from "./types";

const heldPromoSelectionSpy = fn();
const interactiveTypedPromoSpy = fn();

function promoDiscountAmount(promo: PromoState): string | null {
  return promo.status === "applied" ? String(promo.discountAmount) : null;
}

function pointsCreditHkd(points: PointsState): number | null {
  return points.status === "applied"
    ? parseStoryMoney(String(points.amountLabel))
    : null;
}

const container: Decorator[] = [
  (Story) => (
    <div className="w-(--container-md) overflow-hidden rounded-2xl border border-border bg-sidebar">
      <Story />
    </div>
  ),
];

/** Host that nests the promo sheet the same way CartDrawer does (parent tucks). */
function FooterWithPromoNest({
  children,
  promoOpen,
  sheet,
}: {
  children: ReactNode;
  promoOpen: boolean;
  sheet: ReactNode;
}) {
  return (
    <div className="relative h-[640px] overflow-hidden">
      <div
        data-nested-drawer-open={promoOpen || undefined}
        className={[
          "flex h-full flex-col justify-end transition-[transform,opacity] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          promoOpen
            ? "origin-left scale-[0.96] opacity-80 pointer-events-none"
            : "scale-100 opacity-100",
        ].join(" ")}
      >
        {children}
      </div>
      {sheet}
    </div>
  );
}

/**
 * Order summary, compact promo row (opens nested sheet), points tender, and
 * checkout CTA (`4791:2773`).
 *
 * Enter/held-list UI lives on the nested `CartPromoSheet` hosted by
 * [`CartDrawer`](?path=/docs/store-cart-cartdrawer--docs) (or the nest host
 * in these stories). Shopper copy uses **promo code** only — never coupon.
 * `PromoState` `applied` is for order-level codes; a product coupon updates the
 * matching line’s `couponCode` / `price` instead — not a footer discount row.
 * Checkout is members-only; there is no guest checkout path.
 *
 * `InteractiveMember` is the one interactive playground. Static stories cover
 * the promo/points/checkout state matrix; `PromoSheetOpen` is typed-only (no
 * held section).
 */
const meta = {
  title: "Store Cart/CartDrawerFooter",
  component: CartDrawerFooter,
  tags: ["autodocs"],
  decorators: container,
  args: {
    subtotal: "HK$42,700.00",
    estimatedTotal: "HK$42,700.00",
    shippingEstimate: "Calculated at checkout",
    promoState: { status: "collapsed" },
    pointsState: { status: "collapsed" },
    pointsBalanceLabel: "You’ve 1,200 pts.",
    copy: DEFAULT_CART_COPY.footer,
    onPromoStateChange: fn(),
    onRemovePromo: fn(),
    onPointsStateChange: fn(),
    onApplyPoints: fn(),
    onUseMaxPoints: fn(),
    onRemovePoints: fn(),
    onCheckout: fn(),
  },
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-in default: compact promo row + Use points (checkout is members-only) */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Subtotal")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Promo code")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Use points/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
  },
};

/** Nested promo sheet open — typed entry only (no held section) */
export const PromoSheetOpen: Story = {
  render: (args) => {
    const promo: PromoState = { status: "expanded" };
    return (
      <FooterWithPromoNest
        promoOpen
        sheet={
          <CartPromoSheet
            open
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            onClose={() => {}}
            onPromoStateChange={() => {}}
            onApplyPromo={() => false}
          />
        }
      >
        <CartDrawerFooter {...args} promoState={promo} />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByPlaceholderText("Enter promo code")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Apply" })).toBeDisabled();
    expect(canvas.getByRole("button", { name: "Back" })).toBeInTheDocument();
  },
};

/** Nested sheet with validation error */
export const PromoSheetError: Story = {
  render: (args) => {
    const promo: PromoState = {
      status: "expanded",
      error: "This promo code is invalid",
    };
    return (
      <FooterWithPromoNest
        promoOpen
        sheet={
          <CartPromoSheet
            open
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            onClose={() => {}}
            onPromoStateChange={() => {}}
            onApplyPromo={() => false}
          />
        }
      >
        <CartDrawerFooter {...args} promoState={promo} />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("This promo code is invalid")).toBeInTheDocument();
  },
};

/** Promo applied — compact footer shows Discount line only */
export const PromoAppliedSuccess: Story = {
  args: {
    promoState: {
      status: "applied",
      code: "GRADE10",
      discountAmount: "−HK$4,270.00",
    },
    estimatedTotal: "HK$38,430.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Discount (GRADE10)")).toBeInTheDocument();
    expect(canvas.getByText("−HK$4,270.00")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /Select or enter code/i }),
    ).not.toBeInTheDocument();
  },
};

/** Nested sheet: held list partitioned applicable / not valid */
export const HeldPromoSheet: Story = {
  render: (args) => {
    const promo: PromoState = { status: "expanded" };
    return (
      <FooterWithPromoNest
        promoOpen
        sheet={
          <CartPromoSheet
            open
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={SAMPLE_HELD_PROMO_CODES}
            onClose={() => {}}
            onPromoStateChange={() => {}}
            onApplyPromo={() => false}
            onSelectHeldPromo={heldPromoSelectionSpy}
          />
        }
      >
        <CartDrawerFooter {...args} promoState={promo} />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Your promo codes")).toBeInTheDocument();
    expect(canvas.getByText("WELCOME100")).toBeInTheDocument();
    expect(canvas.getByText("Not valid for this order")).toBeInTheDocument();
    expect(
      canvas.getByText("Add ~HK$7,300 more to use this promo code"),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/coupon/i)).not.toBeInTheDocument();
    await userEvent.click(
      within(canvas.getByRole("group", { name: "WELCOME100" })).getByRole(
        "button",
        { name: "Apply" },
      ),
    );
    expect(heldPromoSelectionSpy).toHaveBeenCalledTimes(1);
    expect(heldPromoSelectionSpy).toHaveBeenCalledWith("held-welcome");
  },
};

/** Partial callback matrix: each action follows only its own callback. */
export const PartialCallbackMatrix: Story = {
  render: (args) => {
    const promo: PromoState = { status: "expanded" };
    const [heldSheetOpen, setHeldSheetOpen] = useState(true);
    const [withoutApplyPoints, setWithoutApplyPoints] = useState<PointsState>({
      status: "expanded",
    });
    const [withoutMaxPoints, setWithoutMaxPoints] = useState<PointsState>({
      status: "expanded",
    });
    const [disclosurePromo, setDisclosurePromo] = useState<PromoState>({
      status: "collapsed",
    });
    const disclosurePromoOpen = disclosurePromo.status === "expanded";

    return (
      <div className="flex flex-col gap-8">
        <section aria-label="Held promo without selection callback">
          <FooterWithPromoNest
            promoOpen={heldSheetOpen}
            sheet={
              <CartPromoSheet
                open={heldSheetOpen}
                copy={DEFAULT_CART_COPY.footer}
                promoState={promo}
                heldPromoCodes={SAMPLE_HELD_PROMO_CODES}
                onClose={() => setHeldSheetOpen(false)}
                onApplyPromo={() => false}
              />
            }
          >
            <div />
          </FooterWithPromoNest>
        </section>

        <section aria-label="Points without apply callback">
          <CartDrawerFooter
            subtotal="HK$42,700.00"
            estimatedTotal="HK$42,700.00"
            pointsBalanceLabel="You’ve 1,200 pts."
            copy={DEFAULT_CART_COPY.footer}
            pointsState={withoutApplyPoints}
            onPointsStateChange={setWithoutApplyPoints}
            onUseMaxPoints={() => {
              args.onUseMaxPoints?.();
              setWithoutApplyPoints({
                status: "applied",
                amountLabel: formatStoryCreditHkd(STORY_POINTS_MAX_HKD),
              });
            }}
          />
        </section>

        <section aria-label="Points without max callback">
          <CartDrawerFooter
            subtotal="HK$42,700.00"
            estimatedTotal="HK$42,700.00"
            pointsState={withoutMaxPoints}
            pointsBalanceLabel="You’ve 1,200 pts."
            copy={DEFAULT_CART_COPY.footer}
            onPointsStateChange={setWithoutMaxPoints}
            onApplyPoints={(amount) => {
              args.onApplyPoints?.(amount);
              const n = Number(amount.replace(/[^0-9.]/g, ""));
              if (!Number.isFinite(n) || n <= 0) return false;
              setWithoutMaxPoints({
                status: "applied",
                amountLabel: formatStoryCreditHkd(n),
              });
              return true;
            }}
          />
        </section>

        <section aria-label="Applied promo without removal callback">
          <CartDrawerFooter
            subtotal="HK$42,700.00"
            estimatedTotal="HK$38,430.00"
            promoState={{
              status: "applied",
              code: "WELCOME100",
              discountAmount: "−HK$4,270.00",
            }}
            pointsState={null}
            copy={DEFAULT_CART_COPY.footer}
          />
        </section>

        <section aria-label="Applied points without removal callback">
          <CartDrawerFooter
            subtotal="HK$42,700.00"
            estimatedTotal="HK$42,200.00"
            pointsState={{
              status: "applied",
              amountLabel: "−HK$500.00",
            }}
            copy={DEFAULT_CART_COPY.footer}
          />
        </section>

        <section aria-label="Disclosure callback matrix">
          <FooterWithPromoNest
            promoOpen={disclosurePromoOpen}
            sheet={
              <CartPromoSheet
                open={disclosurePromoOpen}
                copy={DEFAULT_CART_COPY.footer}
                promoState={disclosurePromo}
                onClose={() => setDisclosurePromo({ status: "collapsed" })}
                onPromoStateChange={setDisclosurePromo}
              />
            }
          >
            <CartDrawerFooter
              subtotal="HK$42,700.00"
              estimatedTotal="HK$42,700.00"
              promoState={disclosurePromo}
              pointsState={{ status: "expanded" }}
              pointsBalanceLabel="You’ve 1,200 pts."
              copy={DEFAULT_CART_COPY.footer}
              onPromoStateChange={(next) => {
                args.onPromoStateChange?.(next);
                setDisclosurePromo(next);
              }}
            />
          </FooterWithPromoNest>
        </section>
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const held = within(
      canvas.getByRole("region", {
        name: "Held promo without selection callback",
      }),
    );
    expect(held.getByPlaceholderText("Enter promo code")).toBeInTheDocument();
    expect(held.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    expect(
      within(held.getByRole("group", { name: "WELCOME100" })).queryByRole(
        "button",
        { name: "Apply" },
      ),
    ).not.toBeInTheDocument();

    const withoutApply = within(
      canvas.getByRole("region", { name: "Points without apply callback" }),
    );
    expect(withoutApply.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
    expect(withoutApply.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    expect(withoutApply.queryByPlaceholderText("0")).not.toBeInTheDocument();
    expect(
      withoutApply.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
    expect(
      withoutApply.getByRole("button", { name: "Use max" }),
    ).toBeInTheDocument();
    await userEvent.click(
      withoutApply.getByRole("button", { name: "Use max" }),
    );
    expect(args.onUseMaxPoints).toHaveBeenCalledTimes(1);
    expect(args.onApplyPoints).not.toHaveBeenCalled();

    const withoutMax = within(
      canvas.getByRole("region", { name: "Points without max callback" }),
    );
    expect(withoutMax.getByPlaceholderText("0")).toBeInTheDocument();
    expect(
      withoutMax.getByRole("button", { name: "Apply" }),
    ).toBeInTheDocument();
    expect(
      withoutMax.queryByRole("button", { name: "Use max" }),
    ).not.toBeInTheDocument();
    await userEvent.type(withoutMax.getByPlaceholderText("0"), "500");
    await userEvent.click(withoutMax.getByRole("button", { name: "Apply" }));
    expect(args.onApplyPoints).toHaveBeenCalledTimes(1);
    expect(args.onApplyPoints).toHaveBeenCalledWith("500");
    expect(args.onUseMaxPoints).toHaveBeenCalledTimes(1);

    const withoutPromoRemoval = within(
      canvas.getByRole("region", {
        name: "Applied promo without removal callback",
      }),
    );
    expect(
      withoutPromoRemoval.getByText("Discount (WELCOME100)"),
    ).toBeInTheDocument();
    expect(
      withoutPromoRemoval.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();

    const withoutPointsRemoval = within(
      canvas.getByRole("region", {
        name: "Applied points without removal callback",
      }),
    );
    expect(withoutPointsRemoval.getByText("−HK$500.00")).toBeInTheDocument();
    expect(
      withoutPointsRemoval.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();

    const disclosure = within(
      canvas.getByRole("region", { name: "Disclosure callback matrix" }),
    );
    expect(
      disclosure.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
    expect(
      disclosure.queryByRole("button", { name: /Use points/i }),
    ).not.toBeInTheDocument();
    expect(disclosure.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
    expect(disclosure.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    await userEvent.click(
      disclosure.getByRole("button", { name: /Select or enter code/i }),
    );
    expect(args.onPromoStateChange).toHaveBeenCalledTimes(1);
    expect(args.onPromoStateChange).toHaveBeenCalledWith({
      status: "expanded",
    });
  },
};

/** Nested sheet: empty held list with Loyalty CTA stub */
export const HeldPromoEmpty: Story = {
  render: (args) => {
    const promo: PromoState = { status: "expanded" };
    return (
      <FooterWithPromoNest
        promoOpen
        sheet={
          <CartPromoSheet
            open
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={[]}
            onClose={() => {}}
            onPromoStateChange={() => {}}
            onApplyPromo={() => false}
            onBrowseLoyalty={fn()}
          />
        }
      >
        <CartDrawerFooter {...args} promoState={promo} />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("You don’t have any promo codes yet."),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Browse loyalty offers" }),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Your promo codes")).not.toBeInTheDocument();
  },
};

/** Nested sheet: every held code is inapplicable */
export const HeldPromoAllInapplicable: Story = {
  render: (args) => {
    const promo: PromoState = { status: "expanded" };
    return (
      <FooterWithPromoNest
        promoOpen
        sheet={
          <CartPromoSheet
            open
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={SAMPLE_HELD_INAPPLICABLE_ONLY}
            onClose={() => {}}
            onPromoStateChange={() => {}}
            onApplyPromo={() => false}
          />
        }
      >
        <CartDrawerFooter {...args} promoState={promo} />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Not valid for this order")).toBeInTheDocument();
    expect(canvas.queryByText("Your promo codes")).not.toBeInTheDocument();
    expect(canvas.getByText("SAVE200")).toBeInTheDocument();
  },
};

/** Read-only tender context keeps eligibility facts while omitting mutations. */
export const ReadOnlyTenderContext: Story = {
  render: () => {
    const promo: PromoState = { status: "expanded" };
    const [promoOpen, setPromoOpen] = useState(true);

    return (
      <FooterWithPromoNest
        promoOpen={promoOpen}
        sheet={
          <CartPromoSheet
            open={promoOpen}
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={SAMPLE_HELD_PROMO_CODES}
            onClose={() => setPromoOpen(false)}
          />
        }
      >
        <CartDrawerFooter
          subtotal="HK$42,700.00"
          estimatedTotal="HK$42,700.00"
          pointsState={{ status: "expanded" }}
          pointsBalanceLabel="You’ve 1,200 pts."
          copy={DEFAULT_CART_COPY.footer}
        />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("WELCOME100")).toBeInTheDocument();
    expect(
      canvas.getByText("Add ~HK$7,300 more to use this promo code"),
    ).toBeInTheDocument();
    expect(
      canvas.queryByPlaceholderText("Enter promo code"),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Use max" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /Use points/i }),
    ).not.toBeInTheDocument();

    expect(canvas.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
    expect(canvas.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    expect(canvas.queryByPlaceholderText("0")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await waitFor(() => {
      expect(
        canvas.queryByRole("dialog", { name: "Promo code" }),
      ).not.toBeInTheDocument();
    });
  },
};

/** Promo cleared — toast (same rail as unavailable item removal) */
export const PromoClearedNotice: Story = {
  args: {
    promoState: { status: "collapsed" },
    promoNotice: {
      title: "Promo code removed",
      description: "It no longer applies to this cart",
    },
  },
  render: (args) => (
    <>
      <Toast position="bottom-right" />
      <CartDrawerFooter {...args} />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Promo code")).toBeInTheDocument();
    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByText("Promo code removed")).toBeInTheDocument();
    });
    expect(
      body.getByText("It no longer applies to this cart"),
    ).toBeInTheDocument();
  },
};

/** Points UI omitted — balance loading or member without points tender */
export const WithoutPoints: Story = {
  args: {
    pointsState: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: /Use points/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
  },
};

/** Points expanded with balance helper */
export const PointsExpanded: Story = {
  args: {
    pointsState: { status: "expanded" },
    pointsBalanceLabel: "You’ve 1,200 pts.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByPlaceholderText("0")).toBeInTheDocument();
    expect(canvas.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
    expect(canvas.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Use max" })).toBeInTheDocument();
  },
};

/** Points apply error */
export const PointsError: Story = {
  args: {
    pointsState: {
      status: "expanded",
      error: "Enter up to 1,200 pt",
    },
    pointsBalanceLabel: "You’ve 1,200 pts.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Enter up to 1,200 pt")).toBeInTheDocument();
  },
};

/** Points credit applied on summary */
export const PointsApplied: Story = {
  args: {
    pointsState: {
      status: "applied",
      amountLabel: "−HK$500.00",
    },
    pointsBalanceLabel: "You’ve 1,200 pts.",
    estimatedTotal: "HK$42,200.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Points")).toBeInTheDocument();
    expect(canvas.getByText("−HK$500.00")).toBeInTheDocument();
  },
};

/** Stacked: typed promo + points */
export const PromoAndPointsStacked: Story = {
  args: {
    promoState: {
      status: "applied",
      code: "SAVE10",
      discountAmount: "−HK$4,270.00",
    },
    pointsState: {
      status: "applied",
      amountLabel: "−HK$500.00",
    },
    estimatedTotal: "HK$37,930.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Discount (SAVE10)")).toBeInTheDocument();
    expect(canvas.getByText("Points")).toBeInTheDocument();
  },
};

/** Interactive playground: nested sheet, held pick, typed apply, points */
export const InteractiveMember: Story = {
  render: (args) => {
    const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });
    const [points, setPoints] = useState<PointsState>({ status: "collapsed" });
    const [held] = useState<readonly HeldPromoCode[]>(SAMPLE_HELD_PROMO_CODES);
    const [selectedHeldId, setSelectedHeldId] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | undefined>();
    const [total, setTotal] = useState("HK$42,700.00");
    const sheetOpen = promo.status === "expanded";

    const applyHeld = (id: string) => {
      const code = held.find((c) => c.id === id);
      if (!code?.applicable) return;
      const applied = SAMPLE_HELD_DISCOUNTS[id];
      if (!applied) return;
      setSelectedHeldId(id);
      setPromo({
        status: "applied",
        code: code.label,
        discountAmount: applied.amount,
      });
      setTotal(
        storyCartEstimatedTotal(applied.amount, pointsCreditHkd(points)),
      );
      setNotice(undefined);
    };

    return (
      <FooterWithPromoNest
        promoOpen={sheetOpen}
        sheet={
          <CartPromoSheet
            open={sheetOpen}
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={held}
            selectedHeldPromoId={selectedHeldId}
            onClose={() => setPromo({ status: "collapsed" })}
            onPromoStateChange={setPromo}
            onSelectHeldPromo={applyHeld}
            onApplyPromo={(code) => {
              interactiveTypedPromoSpy(code);
              const result = applyTypedPromoInStories(code, held);
              if (result.ok) {
                setSelectedHeldId(result.heldId);
                setPromo({
                  status: "applied",
                  code: result.label,
                  discountAmount: result.amount,
                });
                setTotal(
                  storyCartEstimatedTotal(
                    result.amount,
                    pointsCreditHkd(points),
                  ),
                );
                setNotice(undefined);
                return true;
              }
              setPromo({
                status: "expanded",
                error: result.error,
              });
              return false;
            }}
          />
        }
      >
        <CartDrawerFooter
          {...args}
          estimatedTotal={total}
          promoState={promo}
          promoNotice={notice}
          pointsState={points}
          pointsBalanceLabel="You’ve 1,200 pts."
          onPromoStateChange={setPromo}
          onRemovePromo={() => {
            setPromo({ status: "collapsed" });
            setSelectedHeldId(null);
            setTotal(storyCartEstimatedTotal(null, pointsCreditHkd(points)));
          }}
          onPointsStateChange={setPoints}
          onRemovePoints={() => {
            setPoints({ status: "collapsed" });
            setTotal(storyCartEstimatedTotal(promoDiscountAmount(promo), null));
          }}
          onApplyPoints={(amount) => {
            const n = Number(amount.replace(/[^0-9.]/g, ""));
            if (!Number.isFinite(n) || n <= 0 || n > STORY_POINTS_MAX_HKD) {
              setPoints({
                status: "expanded",
                error: `Enter up to ${STORY_POINTS_MAX_HKD.toLocaleString("en-HK")} pt`,
              });
              return false;
            }
            args.onApplyPoints?.(amount);
            setPoints({
              status: "applied",
              amountLabel: formatStoryCreditHkd(n),
            });
            setTotal(storyCartEstimatedTotal(promoDiscountAmount(promo), n));
            return true;
          }}
          onUseMaxPoints={() => {
            args.onUseMaxPoints?.();
            setPoints({
              status: "applied",
              amountLabel: formatStoryCreditHkd(STORY_POINTS_MAX_HKD),
            });
            setTotal(
              storyCartEstimatedTotal(
                promoDiscountAmount(promo),
                STORY_POINTS_MAX_HKD,
              ),
            );
          }}
        />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    );
    const promoSheet = within(
      canvas.getByRole("dialog", { name: "Promo code" }),
    );
    await userEvent.type(
      promoSheet.getByPlaceholderText("Enter promo code"),
      " WELCOME100 ",
    );
    await userEvent.click(
      promoSheet.getAllByRole("button", { name: "Apply" })[0],
    );
    expect(interactiveTypedPromoSpy).toHaveBeenCalledTimes(1);
    expect(interactiveTypedPromoSpy).toHaveBeenCalledWith("WELCOME100");
    await waitFor(() => {
      expect(canvas.getByText("Discount (WELCOME100)")).toBeInTheDocument();
    });

    await userEvent.click(canvas.getByRole("button", { name: /Use points/i }));
    await userEvent.click(canvas.getByRole("button", { name: "Use max" }));
    expect(args.onUseMaxPoints).toHaveBeenCalledTimes(1);
    expect(args.onApplyPoints).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(canvas.getByText("Points")).toBeInTheDocument();
      expect(
        canvas.getByText(formatStoryCreditHkd(STORY_POINTS_MAX_HKD)),
      ).toBeInTheDocument();
      expect(canvas.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
      expect(canvas.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    });
    const removeButtons = canvas.getAllByRole("button", { name: "Remove" });
    await userEvent.click(removeButtons[removeButtons.length - 1]);
    await userEvent.click(canvas.getByRole("button", { name: /Use points/i }));
    await userEvent.type(canvas.getByPlaceholderText("0"), "500");
    await userEvent.click(canvas.getByRole("button", { name: "Apply" }));
    expect(args.onApplyPoints).toHaveBeenCalledTimes(1);
    expect(args.onApplyPoints).toHaveBeenCalledWith("500");
    expect(args.onUseMaxPoints).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(canvas.getByText("Points")).toBeInTheDocument();
      expect(canvas.getByText("−HK$500.00")).toBeInTheDocument();
      expect(canvas.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
      expect(canvas.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    });
  },
};

const AMOUNT_STEPS = [
  "HK$38,430.00",
  "HK$42,700.00",
  "HK$49,000.00",
  "HK$83,600.00",
] as const;

/** Bump subtotal and estimated total up/down to preview the Stepper-style roll. */
export const AmountRolling: Story = {
  render: (args) => {
    const [step, setStep] = useState(1);
    const amount = AMOUNT_STEPS[step];

    return (
      <div className="flex flex-col gap-4">
        <HStack gap="sm" vAlign="center">
          <Button
            size="sm"
            type="button"
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
          >
            Decrease
          </Button>
          <Button
            size="sm"
            type="button"
            variant="outline"
            disabled={step === AMOUNT_STEPS.length - 1}
            onClick={() =>
              setStep((current) =>
                Math.min(AMOUNT_STEPS.length - 1, current + 1),
              )
            }
          >
            Increase
          </Button>
        </HStack>
        <CartDrawerFooter {...args} estimatedTotal={amount} subtotal={amount} />
      </div>
    );
  },
};

/** Boneyard skeleton loading state for summary amounts during fetching */
export const Loading: Story = {
  args: {
    loading: true,
    promoState: {
      status: "applied",
      code: "GRADE10",
      discountAmount: "−HK$4,270.00",
    },
    pointsState: {
      status: "applied",
      amountLabel: "−HK$500.00",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
  },
};

/** Checkout CTA pending redirect (e.g. Shopify) — click Proceed to see Redirecting… */
export const CheckoutRedirecting: Story = {
  render: (args) => (
    <CartDrawerFooter {...args} onCheckout={() => new Promise(() => {})} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    );
    expect(
      canvas.getByRole("button", { name: "Redirecting..." }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Redirecting..." }),
    ).toBeDisabled();
  },
};

/** Checkout redirect fails — button restores and a toast explains the error */
export const CheckoutFailed: Story = {
  render: (args) => (
    <>
      <Toast position="bottom-right" />
      <CartDrawerFooter
        {...args}
        onCheckout={async () => {
          throw new Error("Shopify session failed");
        }}
      />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole("button", { name: "Proceed to Checkout" }),
      ).toBeEnabled();
    });
    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByText("Couldn’t open checkout")).toBeInTheDocument();
    });
  },
};
