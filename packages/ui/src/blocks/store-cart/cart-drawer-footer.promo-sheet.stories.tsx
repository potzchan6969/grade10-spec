import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CartDrawerFooter, CartPromoSheet } from "./cart-drawer";
import {
  FooterWithPromoNest,
  footerMeta,
  heldPromoSelectionSpy,
} from "./cart-drawer-footer.story-fixtures";
import {
  DEFAULT_CART_COPY,
  formatStoryCreditHkd,
  SAMPLE_HELD_INAPPLICABLE_ONLY,
  SAMPLE_HELD_PROMO_CODES,
  STORY_POINTS_MAX_HKD,
  storyPromoLabel,
} from "./fixtures";
import type { PointsState, PromoState } from "./types";

/** The nested promo-code sheet: typed entry, held picks, and its notices. */
const meta = {
  title: "Store/Cart/Blocks/CartDrawerFooter/Promo Sheet",
  component: CartDrawerFooter,
  ...footerMeta,
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

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
      label: storyPromoLabel("GRADE10"),
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
    expect(canvas.getByText("Promo codes")).toBeInTheDocument();
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
              label: storyPromoLabel("WELCOME100"),
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

        <section aria-label="Promo disclosure without callback">
          <CartDrawerFooter
            subtotal="HK$42,700.00"
            estimatedTotal="HK$42,700.00"
            promoState={{ status: "collapsed" }}
            pointsState={{ status: "expanded" }}
            pointsBalanceLabel="You’ve 1,200 pts."
            copy={DEFAULT_CART_COPY.footer}
            onPointsStateChange={() => {}}
          />
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

    const withoutPromoDisclosure = within(
      canvas.getByRole("region", {
        name: "Promo disclosure without callback",
      }),
    );
    expect(
      withoutPromoDisclosure.queryByRole("button", {
        name: /Select or enter code/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      withoutPromoDisclosure.getByRole("button", { name: /Use points/i }),
    ).toBeInTheDocument();
    expect(
      withoutPromoDisclosure.getByText(/1 pt = HK\$1\./),
    ).toBeInTheDocument();
    expect(
      withoutPromoDisclosure.getByText(/You’ve 1,200 pts\./),
    ).toBeInTheDocument();
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
    expect(canvas.queryByText("Promo codes")).not.toBeInTheDocument();
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
    expect(canvas.queryByText("Promo codes")).not.toBeInTheDocument();
    expect(canvas.getByText("SAVE200")).toBeInTheDocument();
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
