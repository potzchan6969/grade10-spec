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
    shippingEstimate: "TBD",
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
            onSelectHeldPromo={() => {}}
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

/** Promo cleared — toast (same rail as unavailable item removal) */
export const PromoClearedNotice: Story = {
  args: {
    promoState: { status: "collapsed" },
    promoNotice:
      "Your promo code was removed because it no longer applies to this cart.",
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
      expect(
        body.getByText(
          "Your promo code was removed because it no longer applies to this cart.",
        ),
      ).toBeInTheDocument();
    });
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
            setPoints({
              status: "applied",
              amountLabel: formatStoryCreditHkd(n),
            });
            setTotal(storyCartEstimatedTotal(promoDiscountAmount(promo), n));
            return true;
          }}
          onUseMaxPoints={() => {
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
      expect(
        body.getByText("Couldn’t open checkout. Try again."),
      ).toBeInTheDocument();
    });
  },
};
