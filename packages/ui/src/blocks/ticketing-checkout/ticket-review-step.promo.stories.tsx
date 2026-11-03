import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  BotCheckStandIn,
  GuestStatement,
  phone,
} from "./checkout.story-fixtures";
import {
  EMAIL,
  LINES,
  LINES_TWO_FREE,
  NOTES_FREE,
  NOTES_PAID,
  ORDER_COPY,
  PROMO_COPY,
  REFUND_POLICY,
  REVIEW_COPY,
  SUBTITLE,
} from "./fixtures";
import { TicketCheckoutOrder } from "./ticket-checkout-order";
import { TicketCodeUsedUpNotice } from "./ticket-code-used-up-notice";
import { TicketDiscountLine } from "./ticket-discount-line";
import { TicketPointsAbout } from "./ticket-points-about";
import { TicketPromoCodeField } from "./ticket-promo-code-field";
import { TicketReviewStep } from "./ticket-review-step";

const points = (count: number) => (
  <TicketPointsAbout
    copy={{
      line: `Earn about ${count} points. They go to the Grade10 account for ${EMAIL}.`,
    }}
  />
);

const onRemove = fn();

const meta = {
  title: "Ticketing/Buying/Blocks/TicketReviewStep/Promo",
  component: TicketReviewStep,
  parameters: { layout: "fullscreen" },
  decorators: [phone],
  args: {
    copy: REVIEW_COPY,
    subtitle: SUBTITLE,
    buyerName: "Alex Chan",
    buyerEmail: EMAIL,
    order: null,
    agreementStatement: <GuestStatement />,
    defaultAgreed: true,
    botCheck: <BotCheckStandIn checked />,
    notes: NOTES_PAID,
    refundPolicy: REFUND_POLICY,
    payLabel: "Pay HK$1,150.00",
    onBack: fn(),
    onEdit: fn(),
    onPay: fn(),
  },
} satisfies Meta<typeof TicketReviewStep>;

export default meta;
type Story = StoryObj<typeof meta>;

/** SPRING20 applied, as a share link opens it too: the discount line with
 * Remove stands where the field was, and the total, the points and Pay
 * follow. */
export const CodeApplied: Story = {
  parameters: {
    verification: { caseId: "vc_c8ba23ac-83bd-4832-bbec-29043aec962c" },
  },
  args: {
    order: (
      <TicketCheckoutOrder
        copy={ORDER_COPY}
        lines={LINES}
        points={points(96)}
        promo={
          <TicketPromoCodeField
            applied={{
              copy: {
                title: "Promo SPRING20",
                detail: "20% off General passes",
                remove: "Remove",
                removeLabel: "Remove SPRING20",
              },
              amount: "−HK$190.00",
              onRemove,
            }}
            copy={PROMO_COPY}
            onApply={fn()}
          />
        }
        total="HK$960.00"
      />
    ),
    payLabel: "Pay HK$960.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("group", { name: "Promo code" })).toBeNull();
    expect(canvas.getByText("−HK$190.00")).toBeVisible();
    expect(canvas.getByText("HK$960.00")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Pay HK$960.00" })).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove SPRING20" }),
    );
    expect(onRemove).toHaveBeenCalled();
  },
};

const onPayFull = fn();
const onRemoveCode = fn();

/** Pay pressed, and the last use was just taken: pay the full total, or
 * take the code off. The code's line stays, struck through. */
export const UsedUpAtPay: Story = {
  parameters: {
    verification: { caseId: "vc_412a2144-daea-4498-bdd1-d97b6eff0d03" },
  },
  args: {
    notice: (
      <TicketCodeUsedUpNotice
        copy={{
          title: "The last use of SPRING20 was just taken.",
          body: "The total is back to HK$1,150.00.",
          payFull: "Pay HK$1,150.00",
          removeCode: "Remove Code",
        }}
        onPayFull={onPayFull}
        onRemoveCode={onRemoveCode}
      />
    ),
    order: (
      <TicketCheckoutOrder
        copy={ORDER_COPY}
        lines={LINES}
        points={points(115)}
        promo={
          <TicketDiscountLine
            amount="−HK$190.00"
            copy={{
              title: "Promo SPRING20",
              detail: "Used up, not applied",
              remove: "Remove",
              removeLabel: "Remove SPRING20",
            }}
            onRemove={fn()}
            state="usedUp"
          />
        }
        total="HK$1,150.00"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const notice = canvas.getByRole("alert");
    expect(notice).toHaveTextContent(
      "The last use of SPRING20 was just taken.",
    );
    await userEvent.click(
      within(notice).getByRole("button", { name: "Pay HK$1,150.00" }),
    );
    expect(onPayFull).toHaveBeenCalled();
    await userEvent.click(
      within(notice).getByRole("button", { name: "Remove Code" }),
    );
    expect(onRemoveCode).toHaveBeenCalled();
    expect(canvas.getByText("Used up, not applied")).toBeVisible();
  },
};

/** CREW4 makes the order free: HK$0.00, no points, Get Tickets. */
export const CodeMakesOrderFree: Story = {
  parameters: {
    verification: { caseId: "vc_afff9574-d224-4a67-aa2b-6fb317176591" },
  },
  args: {
    order: (
      <TicketCheckoutOrder
        copy={ORDER_COPY}
        lines={LINES}
        points={
          <TicketPointsAbout
            copy={{
              line: "This order is free with CREW4. It earns no points.",
            }}
          />
        }
        promo={
          <TicketDiscountLine
            amount="−HK$1,150.00"
            copy={{
              title: "Promo CREW4",
              detail: "Your 3 tickets are free, Fast Pass too.",
              remove: "Remove",
              removeLabel: "Remove CREW4",
            }}
            onRemove={fn()}
          />
        }
        total="HK$0.00"
      />
    ),
    notes: NOTES_FREE,
    botCheck: undefined,
    payLabel: "Get Tickets",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$0.00")).toBeVisible();
    expect(
      canvas.getByText("This order is free with CREW4. It earns no points."),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Get Tickets" })).toBeVisible();
  },
};

/** CREW4 with 2 left: the dearest two tickets go free, each line says so,
 * and the rest is paid. */
export const CodeWithTwoLeft: Story = {
  parameters: {
    verification: { caseId: "vc_c36ce43f-e37f-4616-8fae-2c70b1599315" },
  },
  args: {
    order: (
      <TicketCheckoutOrder
        copy={ORDER_COPY}
        lines={LINES_TWO_FREE}
        points={points(19)}
        promo={
          <TicketDiscountLine
            amount="−HK$960.00"
            copy={{
              title: "Promo CREW4",
              detail: "2 of your 3 tickets are free. CREW4 had 2 left.",
              remove: "Remove",
              removeLabel: "Remove CREW4",
            }}
            onRemove={fn()}
          />
        }
        total="HK$190.00"
      />
    ),
    payLabel: "Pay HK$190.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Free with CREW4")).toHaveLength(2);
    expect(canvas.getByRole("button", { name: "Pay HK$190.00" })).toBeVisible();
  },
};
