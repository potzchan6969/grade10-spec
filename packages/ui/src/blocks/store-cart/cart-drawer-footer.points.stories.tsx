import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";
import { CartDrawerFooter, CartPromoSheet } from "./cart-drawer";
import {
  footerMeta,
  pendingBrowseSpy,
  pendingDraftPromoSpy,
} from "./cart-drawer-footer.story-fixtures";
import { DEFAULT_CART_COPY, storyPromoLabel } from "./fixtures";

/** The points tender: collapsed, expanded, applied, and tender-pending. */
const meta = {
  title: "Store/Cart/Blocks/CartDrawerFooter/Points",
  component: CartDrawerFooter,
  ...footerMeta,
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

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
      label: storyPromoLabel("SAVE10"),
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

export const TenderPendingPoints: Story = {
  args: { pointsState: { status: "expanded" } },
  render: (args) => {
    const [tenderPending, setTenderPending] = useState(false);
    return (
      <CartDrawerFooter
        {...args}
        tenderPending={tenderPending}
        onUseMaxPoints={() => {
          args.onUseMaxPoints?.();
          setTenderPending(true);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("0");
    const apply = canvas.getByRole("button", { name: "Apply" });
    const useMax = canvas.getByRole("button", { name: "Use max" });
    const points = canvas.getByRole("button", { name: "Use points" });
    const promo = canvas.getByRole("button", { name: /Select or enter code/i });
    const checkout = canvas.getByRole("button", {
      name: "Proceed to Checkout",
    });

    await userEvent.type(input, "120");
    await userEvent.click(useMax);
    await waitFor(() => expect(input).toBeDisabled());
    expect(input).toBeDisabled();
    expect(apply).toBeDisabled();
    expect(useMax).toHaveAttribute("aria-disabled", "true");
    expect(points).toBeDisabled();
    expect(promo).toBeDisabled();
    expect(checkout).toBeDisabled();

    apply.click();
    useMax.click();
    promo.click();
    points.click();
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(args.onApplyPoints).not.toHaveBeenCalled();
    expect(args.onUseMaxPoints).toHaveBeenCalledTimes(1);
    expect(args.onPointsStateChange).not.toHaveBeenCalled();
    expect(args.onPromoStateChange).not.toHaveBeenCalled();
    expect(args.onCheckout).not.toHaveBeenCalled();
  },
};

export const TenderPendingPreservesDrafts: Story = {
  args: { pointsState: { status: "expanded" } },
  render: (args) => {
    const [pending, setPending] = useState(false);
    return (
      <>
        <Button onClick={() => setPending(!pending)}>
          {pending ? "Finish saving" : "Start saving"}
        </Button>
        <CartDrawerFooter {...args} tenderPending={pending} />
        <CartPromoSheet
          open
          copy={DEFAULT_CART_COPY.footer}
          promoState={{ status: "expanded" }}
          tenderPending={pending}
          onClose={() => {}}
          heldPromoCodes={[]}
          onApplyPromo={pendingDraftPromoSpy}
          onBrowseLoyalty={pendingBrowseSpy}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    pendingDraftPromoSpy.mockClear();
    pendingBrowseSpy.mockClear();
    const canvas = within(canvasElement);
    const points = canvas.getByPlaceholderText("0");
    const promo = canvas.getByPlaceholderText("Enter promo code");
    await userEvent.type(points, "120");
    await userEvent.type(promo, "SAVE");
    await userEvent.click(canvas.getByRole("button", { name: "Start saving" }));
    expect(points).toBeDisabled();
    expect(promo).toBeDisabled();
    fireEvent.change(points, { target: { value: "999" } });
    fireEvent.change(promo, { target: { value: "OTHER" } });
    expect(points).toHaveValue(120);
    expect(promo).toHaveValue("SAVE");
    fireEvent.keyDown(promo, { key: "Enter" });
    expect(pendingDraftPromoSpy).not.toHaveBeenCalled();
    const browse = canvas.getByRole("button", {
      name: DEFAULT_CART_COPY.footer.browseLoyaltyOffers,
    });
    expect(browse).toBeDisabled();
    fireEvent.click(browse);
    expect(pendingBrowseSpy).not.toHaveBeenCalled();
    await userEvent.click(
      canvas.getByRole("button", { name: "Finish saving" }),
    );
    expect(points).toBeEnabled();
    expect(promo).toBeEnabled();
    expect(points).toHaveValue(120);
    expect(promo).toHaveValue("SAVE");
    await userEvent.type(promo, "{Enter}");
    await waitFor(() =>
      expect(pendingDraftPromoSpy).toHaveBeenCalledWith("SAVE"),
    );
    await userEvent.click(browse);
    expect(pendingBrowseSpy).toHaveBeenCalledTimes(1);
  },
};

export const TenderPendingAppliedPoints: Story = {
  args: {
    tenderPending: true,
    promoState: {
      status: "applied",
      label: storyPromoLabel("TEN-OFF"),
      discountAmount: "−HK$4,270.00",
    },
    pointsState: { status: "applied", amountLabel: "HK$120.00" },
    estimatedTotal: "HK$38,310.00",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const removePromo = canvas.getAllByRole("button", { name: "Remove" })[0];
    const removePoints = canvas.getAllByRole("button", { name: "Remove" })[1];

    expect(canvas.getByText("HK$120.00")).toBeInTheDocument();
    expect(removePromo).toHaveAttribute("aria-disabled", "true");
    expect(removePoints).toHaveAttribute("aria-disabled", "true");
    removePromo.click();
    removePoints.click();
    expect(args.onRemovePromo).not.toHaveBeenCalled();
    expect(args.onRemovePoints).not.toHaveBeenCalled();
  },
};
