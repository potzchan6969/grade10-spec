import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { LEDGER_ENTRIES, POINT_HISTORY_COPY, POINTS_TOTALS } from "./fixtures";
import { PointHistory } from "./point-history";

const meta = {
  title: "Loyalty/Points/Blocks/PointHistory",
  component: PointHistory,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: POINT_HISTORY_COPY,
    state: { status: "ready", data: LEDGER_ENTRIES },
    summary: POINTS_TOTALS,
  },
} satisfies Meta<typeof PointHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Totals on top, filters, what is on the way, then the months. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_3f405747-9b4f-44b6-9502-85d0b3a7a737" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("440 pts")).toBeInTheDocument();
    expect(canvas.getByText("820 pts")).toBeInTheDocument();
    expect(canvas.getByText("Pending 128 pts")).toBeInTheDocument();
    expect(canvas.getByText("Order #10511")).toBeInTheDocument();
    expect(canvas.getByText("Redeemed HK$50 off")).toBeInTheDocument();
    expect(canvas.getByText("October 2026")).toBeInTheDocument();
  },
};

/** Each tab answers one track: Earned hides the spends, Pending the months. */
export const Filtered: Story = {
  parameters: {
    verification: { caseId: "vc_e4fb7d89-5b76-4172-843e-3bd14cc6df79" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /^Earned/ }));
    expect(canvas.queryByText("Redeemed HK$50 off")).not.toBeInTheDocument();
    expect(canvas.getByText("Points adjusted")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: /^Pending/ }));
    expect(canvas.getByText("Order #10511")).toBeInTheDocument();
    expect(canvas.queryByText("October 2026")).not.toBeInTheDocument();
  },
};

/** A purchase: the order tile, the order number, points earned. */
export const Purchase: Story = {
  parameters: {
    verification: { caseId: "vc_cd9d6f45-7e80-4979-9849-b4f50c728b8c" },
  },
  args: {
    state: {
      status: "ready",
      data: [
        {
          id: "entry-purchase",
          kind: "In-store purchase",
          track: "earned",
          icon: "order",
          delta: 105,
          date: "20 Sep 2026",
          month: "September 2026",
          context: "Order #10482",
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("In-store purchase")).toBeInTheDocument();
    expect(canvas.getByText("Order #10482")).toBeInTheDocument();
    expect(canvas.getByText("+105 pts")).toBeInTheDocument();
  },
};

/** A points top-up bought as a pack, credited at once. */
export const TopUp: Story = {
  parameters: {
    verification: { caseId: "vc_1bae180f-059f-4006-80f6-148ac1915a02" },
  },
  args: {
    state: {
      status: "ready",
      data: [
        {
          id: "entry-topup",
          kind: "Points top-up",
          track: "earned",
          icon: "topup",
          delta: 200,
          date: "15 Sep 2026",
          month: "September 2026",
          href: "https://pay.stripe.com/receipts/example",
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const entry = canvas.getByRole("link", { name: /Points top-up/ });
    expect(entry).toHaveAttribute(
      "href",
      "https://pay.stripe.com/receipts/example",
    );
    expect(entry).toHaveAttribute("target", "_blank");
    expect(canvas.getByText("+200 pts")).toBeInTheDocument();
  },
};

/** A reward redeemed: points leave, the reward's name is the context. */
export const RewardRedeemed: Story = {
  parameters: {
    verification: { caseId: "vc_3c7bd781-ebd3-440e-9172-eb449a58f229" },
  },
  args: {
    state: {
      status: "ready",
      data: [
        {
          id: "entry-sleeves",
          kind: "Redeemed reward",
          track: "used",
          icon: "reward",
          delta: -120,
          date: "14 Oct 2026",
          month: "October 2026",
          context: "Redeemed Grade10 card sleeves",
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Redeemed reward")).toBeInTheDocument();
    expect(
      canvas.getByText("Redeemed Grade10 card sleeves"),
    ).toBeInTheDocument();
    expect(canvas.getByText("−120 pts")).toBeInTheDocument();
  },
};

/** An operator's credit on the balance — a refund made good, say. */
export const PointsAdjusted: Story = {
  parameters: {
    verification: { caseId: "vc_2a192d91-feaf-4a41-955f-01a4ff7d3395" },
  },
  args: {
    state: {
      status: "ready",
      data: [
        {
          id: "entry-adjustment",
          kind: "Points adjusted",
          track: "earned",
          icon: "adjustment",
          delta: 120,
          date: "9 Oct 2026",
          month: "October 2026",
          context: "Credit from Grade10",
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Points adjusted")).toBeInTheDocument();
    expect(canvas.getByText("Credit from Grade10")).toBeInTheDocument();
    expect(canvas.getByText("+120 pts")).toBeInTheDocument();
  },
};

/** Points spent straight off an order's total at checkout. */
export const CreditsAtCheckout: Story = {
  parameters: {
    verification: { caseId: "vc_8e9fe31a-3290-403d-ba55-4df89b1222bc" },
  },
  args: {
    state: {
      status: "ready",
      data: [
        {
          id: "entry-credits",
          kind: "Use at checkout",
          track: "used",
          icon: "credits",
          delta: -80,
          date: "10 Sep 2026",
          month: "September 2026",
          context: "Order #10514",
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Use at checkout")).toBeInTheDocument();
    expect(canvas.getByText("Order #10514")).toBeInTheDocument();
    expect(canvas.getByText("−80 pts")).toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_67ef2bd0-4aa4-4064-9bec-0eeeb17c4dc2" },
  },
  args: { state: { status: "loading" } },
};

/** Nothing earned, nothing pending: the empty state points at the shop. */
export const Empty: Story = {
  parameters: {
    verification: { caseId: "vc_d8afa929-ea0e-4e92-8884-a555ace66523" },
  },
  args: {
    state: {
      status: "empty",
      message: "No points yet",
      description: "Earn points on what you pay — online or at the till.",
      action: { label: "Start shopping", onAction: () => {} },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No points yet")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Start shopping" }),
    ).toBeInTheDocument();
  },
};
