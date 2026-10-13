import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { type CouponItem, CouponList } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  COUPON_ACTION_COPY,
  COUPON_LIST_COPY,
  COUPONS,
} from "../loyalty-content";
import { type Check, walkCases } from "../loyalty-flow-walk";

type CouponStep = {
  coupons: readonly CouponItem[];
  /** Withholds every code, as a counter surface must. */
  masked?: boolean;
};

const OPEN = COUPONS[0];
const SPENT = COUPONS[1];
const VOID = COUPONS[2];
const EXPIRED = COUPONS[3];

const COUPON_STEPS: ReadonlyArray<readonly [string, CouponStep]> = [
  [
    "Open coupon offered on the basket",
    {
      coupons: [
        {
          ...OPEN,
          action: (
            <Button size="sm" variant="outline">
              {COUPON_ACTION_COPY.useAtCheckout}
            </Button>
          ),
        },
      ],
    },
  ],
  [
    "Code hidden at the counter",
    {
      masked: true,
      coupons: [
        {
          ...OPEN,
          action: (
            <Button size="sm" variant="outline">
              {COUPON_ACTION_COPY.showToTill}
            </Button>
          ),
        },
      ],
    },
  ],
  ["Still open after an unpaid sale", { coupons: [OPEN] }],
  ["Spent, void and expired stay listed", { coupons: [SPENT, VOID, EXPIRED] }],
];

const CHECKS: readonly Check[] = [
  (canvas) => {
    expect(
      canvas.getByRole("button", { name: COUPON_ACTION_COPY.useAtCheckout }),
    ).toBeInTheDocument();
    expect(canvas.getByText("GRD-50-7Q2M")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("Code hidden")).toBeInTheDocument();
    expect(canvas.queryByText("GRD-50-7Q2M")).not.toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("GRD-50-7Q2M")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: COUPON_ACTION_COPY.useAtCheckout }),
    ).not.toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("Spent")).toBeInTheDocument();
    expect(canvas.getByText("Void")).toBeInTheDocument();
    expect(canvas.getByText("Expired")).toBeInTheDocument();
  },
];

const meta = {
  title: "Loyalty/Coupons/Flows/Spend a Coupon",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function CouponStepCard({ coupons, masked }: CouponStep) {
  return (
    <VStack gap="lg">
      <CouponList
        copy={COUPON_LIST_COPY}
        masked={masked}
        state={{ status: "ready", data: coupons }}
      />
    </VStack>
  );
}

/**
 * A member spends an open coupon on whatever sale is in front of them. The
 * coupon stays open through a sale that was left unpaid, its code is hidden
 * when a counter surface must not show it, and a spent, void or expired coupon
 * says so beside the rest.
 */
export const SpendOnSale: Story = {
  parameters: {
    journeys: [
      "grade10-site-loyalty-programme-US-07",
      "grade10-site-loyalty-programme-US-11",
    ],
  },
  render: () => (
    <FlowContainer
      cases={COUPON_STEPS}
      description={
        <p>
          A coupon is spendable wherever the member is, whatever checkout or
          counter sale they left open. An unpaid sale leaves the coupon open. A
          code is withheld wherever a surface must not show it, and a coupon
          already spent, void or expired is named as such.
        </p>
      }
    >
      {(value) => <CouponStepCard {...value} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, CHECKS, () => {
      expect(
        canvasElement.querySelectorAll('[data-slot="coupon-list"]'),
      ).toHaveLength(COUPON_STEPS.length);
    });
  },
};
