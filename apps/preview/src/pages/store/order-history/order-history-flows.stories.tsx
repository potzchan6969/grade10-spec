import { OrderHistory } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  ACTIVE_ORDERS,
  ORDER_HISTORY_COPY,
  ORDER_HISTORY_READ_COPY,
  ORDER_HISTORY_READ_MS,
  PAST_ORDERS,
  PENDING_ACTIVE_ORDERS,
} from "./order-history-content";
import {
  OrderHistoryLoadingCards,
  OrderHistoryReadFailed,
} from "./order-history-states";

const meta = {
  title: "Store/Order History/Flows/Order History",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The first read fails, the collector retries, and the orders arrive. */
function RecoverableRead() {
  const [read, setRead] = useState<"failed" | "loading" | "filled">("failed");

  const retry = () => {
    setRead("loading");
    window.setTimeout(() => setRead("filled"), ORDER_HISTORY_READ_MS);
  };

  if (read === "filled") {
    return (
      <OrderHistory
        activeOrders={ACTIVE_ORDERS}
        copy={ORDER_HISTORY_COPY}
        pastOrders={PAST_ORDERS}
        onShopNow={fn()}
        onTrackOrder={fn()}
        onViewDetails={fn()}
      />
    );
  }
  if (read === "loading") {
    return <OrderHistoryLoadingCards label={ORDER_HISTORY_READ_COPY.loading} />;
  }
  return (
    <OrderHistoryReadFailed
      message={ORDER_HISTORY_READ_COPY.failed}
      onRetry={retry}
      retryLabel={ORDER_HISTORY_READ_COPY.retry}
    />
  );
}

const REVIEW_CASES: [string, "filled" | "pending" | "loading" | "failed"][] = [
  ["Active and past orders", "filled"],
  ["Pending total", "pending"],
  ["First read loading", "loading"],
  ["Read failed", "failed"],
];

function ReviewStep({
  step,
}: {
  step: "filled" | "pending" | "loading" | "failed";
}) {
  if (step === "pending") {
    return (
      <OrderHistory
        activeOrders={PENDING_ACTIVE_ORDERS}
        copy={ORDER_HISTORY_COPY}
        pastOrders={[]}
        onShopNow={fn()}
        onTrackOrder={fn()}
        onViewDetails={fn()}
      />
    );
  }
  if (step === "loading") {
    return <OrderHistoryLoadingCards label={ORDER_HISTORY_READ_COPY.loading} />;
  }
  if (step === "failed") {
    return <RecoverableRead />;
  }
  return (
    <OrderHistory
      activeOrders={ACTIVE_ORDERS}
      copy={ORDER_HISTORY_COPY}
      pastOrders={PAST_ORDERS}
      onShopNow={fn()}
      onTrackOrder={fn()}
      onViewDetails={fn()}
    />
  );
}

/** Collector reviews active and past orders, including a pending total and a read that fails. */
export const ReviewOrders: Story = {
  parameters: {
    journeys: ["grade10-site-store-order-history-US-01"],
  },
  render: () => (
    <FlowContainer
      cases={REVIEW_CASES}
      description={
        <p>
          Active and past orders sit apart, and an order with no settled total
          says it is pending rather than showing zero. While the first read runs
          the page says it is loading, with no empty-state claim. A failed read
          offers Retry, which reads the orders again.
        </p>
      }
    >
      {(step) => <ReviewStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { level: 2, name: "Active Orders" }),
      ).toBeVisible(),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(canvas.getByText("Total: Pending")).toBeVisible(),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByText(ORDER_HISTORY_READ_COPY.loading),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(ORDER_HISTORY_READ_COPY.failed)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Track Order" })).toBeVisible(),
    );
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      REVIEW_CASES.length,
    );
  },
};

/** A collector with no orders sees the empty account and a way to start shopping. */
export const StartShoppingFromAnEmptyAccount: Story = {
  parameters: {
    journeys: ["grade10-site-store-order-history-US-03"],
  },
  render: () => (
    <FlowContainer
      cases={[["Empty account", "empty"]]}
      description={
        <p>
          An account with no orders says so and offers Shop Now. The empty state
          makes no claim about an order that is still loading.
        </p>
      }
    >
      {() => (
        <OrderHistory
          copy={ORDER_HISTORY_COPY}
          onShopNow={fn()}
          onTrackOrder={fn()}
          onViewDetails={fn()}
        />
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("No orders yet")).toBeVisible(),
    );
    expect(canvas.getByRole("button", { name: "Shop Now" })).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Active Orders" }),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(1);
  },
};
