import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CartDrawerFooter, CartPromoSheet } from "./cart-drawer";
import {
  FooterWithPromoNest,
  footerMeta,
  interactiveTypedPromoSpy,
  pointsCreditHkd,
  promoDiscountAmount,
} from "./cart-drawer-footer.story-fixtures";
import {
  applyTypedPromoInStories,
  DEFAULT_CART_COPY,
  formatStoryCreditHkd,
  SAMPLE_HELD_DISCOUNTS,
  SAMPLE_HELD_PROMO_CODES,
  STORY_POINTS_MAX_HKD,
  storyCartEstimatedTotal,
  storyPromoLabel,
} from "./fixtures";
import type { HeldPromoCode, PointsState, PromoState } from "./types";

/** The interactive playground and the states that move on click. */
const meta = {
  title: "Store/Cart/Blocks/CartDrawerFooter/Interactive",
  component: CartDrawerFooter,
  ...footerMeta,
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        label: storyPromoLabel(code.label),
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
                  label: storyPromoLabel(result.label),
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

export const ConfirmingCartUpdate: Story = {
  args: { checkoutDisabled: true, onCheckout: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkout = canvas.getByRole("button", {
      name: "Proceed to Checkout",
    });
    expect(checkout).toBeDisabled();
    expect(canvas.getByText("Subtotal")).toBeVisible();
    expect(canvas.getAllByText("HK$42,700.00")).toHaveLength(2);
    checkout.click();
    expect(args.onCheckout).not.toHaveBeenCalled();
  },
};

/** Shared interaction guard: footer mutations remain visible but inert. */
export const InteractionPending: Story = {
  args: {
    interactionPending: true,
    promoState: { status: "expanded" },
    pointsState: { status: "expanded" },
    copy: {
      ...DEFAULT_CART_COPY.footer,
      signInPrompt: "Already a member?",
      signInAction: "Sign in",
    },
    onPromoStateChange: fn(),
    onPointsStateChange: fn(),
    onApplyPoints: fn(),
    onCheckout: fn(),
    onSignIn: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const promo = canvas.getByRole("button", {
      name: /Select or enter code/i,
    });
    const points = canvas.getByRole("button", { name: /Use points/i });
    const input = canvas.getByRole("spinbutton", { name: "Use points" });
    const apply = canvas.getByRole("button", { name: "Apply" });
    const checkout = canvas.getByRole("button", {
      name: "Proceed to Checkout",
    });
    const signIn = canvas.getByRole("button", { name: "Sign in" });

    expect(promo).toBeDisabled();
    expect(points).toBeDisabled();
    expect(input).toBeDisabled();
    expect(apply).toBeDisabled();
    expect(checkout).toBeDisabled();
    expect(signIn).toHaveAttribute("aria-disabled", "true");

    promo.click();
    points.click();
    apply.click();
    checkout.click();
    signIn.click();
    expect(args.onPromoStateChange).not.toHaveBeenCalled();
    expect(args.onPointsStateChange).not.toHaveBeenCalled();
    expect(args.onApplyPoints).not.toHaveBeenCalled();
    expect(args.onCheckout).not.toHaveBeenCalled();
    expect(args.onSignIn).not.toHaveBeenCalled();
  },
};
