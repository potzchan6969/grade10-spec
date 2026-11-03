import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AccountStatement,
  BotCheckStandIn,
  GuestStatement,
  phone,
} from "./checkout.story-fixtures";
import {
  EMAIL,
  LINES,
  LINES_FREE,
  LINES_FULL_PRICE,
  NOTES_FREE,
  NOTES_PAID,
  ORDER_COPY,
  PROMO_COPY,
  REFUND_POLICY,
  REVIEW_COPY,
  REVIEW_COPY_SIGNED_IN,
  SUBTITLE,
} from "./fixtures";
import { TicketCheckoutOrder } from "./ticket-checkout-order";
import { TicketPointsAbout } from "./ticket-points-about";
import { TicketPromoCodeField } from "./ticket-promo-code-field";
import { TicketReviewStep } from "./ticket-review-step";

const promo = <TicketPromoCodeField copy={PROMO_COPY} onApply={fn()} />;

const guestOrder = (
  <TicketCheckoutOrder
    copy={ORDER_COPY}
    lines={LINES}
    points={
      <TicketPointsAbout
        copy={{
          line: `Earn about 115 points. They go to the Grade10 account for ${EMAIL}.`,
        }}
      />
    }
    promo={promo}
    total="HK$1,150.00"
  />
);

const accountOrder = (
  <TicketCheckoutOrder
    copy={ORDER_COPY}
    lines={LINES}
    points={
      <TicketPointsAbout
        copy={{
          line: "Earn about 115 points. They go to your Grade10 account.",
        }}
      />
    }
    promo={promo}
    total="HK$1,150.00"
  />
);

const meta = {
  title: "Ticketing/Buying/Blocks/TicketReviewStep",
  component: TicketReviewStep,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [phone],
  args: {
    copy: REVIEW_COPY,
    subtitle: SUBTITLE,
    buyerName: "Alex Chan",
    buyerEmail: EMAIL,
    order: guestOrder,
    agreementStatement: <GuestStatement />,
    botCheck: <BotCheckStandIn />,
    notes: NOTES_PAID,
    refundPolicy: REFUND_POLICY,
    payLabel: "Pay HK$1,150.00",
    onBack: fn(),
    onEdit: fn(),
    onAgreedChange: fn(),
    onPay: fn(),
  },
} satisfies Meta<typeof TicketReviewStep>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A guest before ticking: the name and email read back with Edit, the
 * order with its code field and points, and the guest's agreement, which
 * keeps the tickets in a Grade10 account for the email. */
export const GuestNotAgreed: Story = {
  parameters: {
    verification: { caseId: "vc_776b1385-1bc1-4143-a4a3-28c7e561da50" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const details = canvas.getByRole("region", { name: "Your Details" });
    expect(within(details).getByText("Alex Chan")).toBeVisible();
    expect(within(details).getByText(EMAIL)).toBeVisible();
    await userEvent.click(
      within(details).getByRole("button", { name: "Edit your details" }),
    );
    expect(args.onEdit).toHaveBeenCalledOnce();
    const box = canvas.getByRole("checkbox", { name: /Terms of Sale/ });
    expect(box).not.toBeChecked();
    expect(box).toHaveAccessibleName(
      "I agree to the Terms of Sale and Grade10’s Terms and Privacy Policy.",
    );
    expect(
      canvas.getByRole("link", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("list", { name: "Before you pay" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("group", { name: "Promo code" }),
    ).toBeInTheDocument();
  },
};

/** Pay pressed without the tick: the card and the bar say to tick first,
 * and nothing is paid. */
export const PayPressedUnticked: Story = {
  parameters: {
    verification: { caseId: "vc_7e15be8c-9233-4da6-aee2-08df7b085957" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Pay HK$1,150.00" }),
    );
    expect(
      await canvas.findByText("Tick the box to agree before you pay."),
    ).toBeVisible();
    expect(canvas.getByText("Tick the box to agree first.")).toBeVisible();
    expect(
      canvas.getByRole("checkbox", { name: /Terms of Sale/ }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(args.onPay).not.toHaveBeenCalled();
  },
};

/** Ticked after being asked: both errors go, and Pay goes on. */
export const TickedAfterAsking: Story = {
  parameters: {
    verification: { caseId: "vc_693287f9-488c-4eb7-b7de-da23d0bf8c37" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pay = canvas.getByRole("button", { name: "Pay HK$1,150.00" });
    await userEvent.click(pay);
    await userEvent.click(
      canvas.getByRole("checkbox", { name: /Terms of Sale/ }),
    );
    expect(args.onAgreedChange).toHaveBeenCalledWith(true);
    expect(canvas.queryByRole("alert")).toBeNull();
    await userEvent.click(pay);
    expect(args.onPay).toHaveBeenCalledOnce();
  },
};

/** A guest who ticked: Pay goes on. */
export const GuestAgreed: Story = {
  parameters: {
    verification: { caseId: "vc_ea67ddb1-eb23-4ecd-ac86-fbf3a325a395" },
  },
  args: { defaultAgreed: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("checkbox", { name: /Terms of Sale/ }),
    ).toBeChecked();
    await userEvent.click(
      canvas.getByRole("button", { name: "Pay HK$1,150.00" }),
    );
    expect(args.onPay).toHaveBeenCalledOnce();
  },
};

/** Signed in: the Terms of Sale only, and the points go to the account. */
export const SignedIn: Story = {
  parameters: {
    verification: { caseId: "vc_96dfb684-9dcd-4093-9281-a1f920fb27bd" },
  },
  args: {
    copy: REVIEW_COPY_SIGNED_IN,
    order: accountOrder,
    agreementStatement: <AccountStatement />,
    defaultAgreed: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("checkbox", {
        name: "I agree to the Terms of Sale.",
      }),
    ).toBeChecked();
    expect(canvas.queryByRole("link", { name: "Privacy Policy" })).toBeNull();
    expect(
      canvas.getByText(
        "Your tickets and the points from this order go to your Grade10 account.",
      ),
    ).toBeVisible();
    expect(
      canvas.getByText(
        "Your account’s email. Your tickets go here as one PDF.",
      ),
    ).toBeVisible();
  },
};

/** Pay pressed into a crowd, after 3 seconds: still trying, and Pay waits. */
export const SlowAfterThreeSeconds: Story = {
  parameters: {
    verification: { caseId: "vc_23755a54-c14a-426b-aa79-c2b530103638" },
  },
  args: { defaultAgreed: true, payState: "slow" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent(
      "Lots of people are buying right now. Still trying.",
    );
    const pay = canvas.getByRole("button", { name: "Pay HK$1,150.00" });
    expect(pay).toHaveAttribute("aria-busy", "true");
    await userEvent.click(pay);
    expect(args.onPay).not.toHaveBeenCalled();
  },
};

/** Leaving for Stripe: Opening payment… under the waiting press. */
export const OpeningPayment: Story = {
  parameters: {
    verification: { caseId: "vc_73e76caf-d08a-4bf1-a168-b20b3920bcc4" },
  },
  args: { defaultAgreed: true, payState: "opening" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent("Opening payment…");
    expect(
      canvas.getByRole("button", { name: "Pay HK$1,150.00" }),
    ).toHaveAttribute("aria-busy", "true");
  },
};

/** The early bird ended while the buyer was here: a warning names the new
 * total, the lines show the new prices, and Pay follows. */
export const EarlyBirdEnded: Story = {
  parameters: {
    verification: { caseId: "vc_be11b629-7bb2-4029-a341-cf47dd69b25b" },
  },
  args: {
    copy: REVIEW_COPY_SIGNED_IN,
    agreementStatement: <AccountStatement />,
    defaultAgreed: true,
    priceNotice: {
      title: "The early-bird price ended at 23:59.",
      description:
        "Your total is now HK$1,400.00. The lines below show the new prices.",
    },
    order: (
      <TicketCheckoutOrder
        copy={ORDER_COPY}
        lines={LINES_FULL_PRICE}
        points={
          <TicketPointsAbout
            copy={{
              line: "Earn about 140 points. They go to your Grade10 account.",
            }}
          />
        }
        promo={promo}
        total="HK$1,400.00"
      />
    ),
    payLabel: "Pay HK$1,400.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("The early-bird price ended at 23:59."),
    ).toBeVisible();
    expect(canvas.getAllByText("HK$480.00, was HK$380.00")).toHaveLength(2);
    expect(
      canvas.getByRole("button", { name: "Pay HK$1,400.00" }),
    ).toBeVisible();
  },
};

/** A pass that costs nothing: Get Tickets, nothing charged, no bot check. */
export const FreeOrder: Story = {
  parameters: {
    verification: { caseId: "vc_830d1f2b-5612-4bdd-b8bb-8da919fb890d" },
  },
  args: {
    copy: REVIEW_COPY_SIGNED_IN,
    agreementStatement: <AccountStatement />,
    defaultAgreed: true,
    order: (
      <TicketCheckoutOrder copy={ORDER_COPY} lines={LINES_FREE} total="Free" />
    ),
    botCheck: undefined,
    notes: NOTES_FREE,
    payLabel: "Get Tickets",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing is charged.")).toBeVisible();
    expect(canvas.queryByRole("group", { name: "Bot check" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Get Tickets" }));
    expect(args.onPay).toHaveBeenCalledOnce();
  },
};
