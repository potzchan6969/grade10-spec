import { OrderDetails } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  ORDER_DETAILS_CONTENT,
  ORDER_DETAILS_READ_COPY,
  ORDER_DETAILS_READ_MS,
  PARTIAL_REFUND_CONTENT,
  POINT_OF_SALE_CONTENT,
} from "./order-details-content";
import {
  OrderDetailsLoadingCard,
  OrderDetailsNotFound,
  OrderDetailsReadFailed,
} from "./order-details-states";

const meta = {
  title: "Store/Order Detail/Flows/Order Details",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ORDER_CASES: [
  string,
  "web" | "refund" | "point-of-sale" | "not-found" | "loading" | "failed",
][] = [
  ["Owned web order", "web"],
  ["Partial refund", "refund"],
  ["Point-of-sale order", "point-of-sale"],
  ["Not found", "not-found"],
  ["First read loading", "loading"],
  ["Read failed", "failed"],
];

type DetailContent = Pick<
  ComponentProps<typeof OrderDetails>,
  | "copy"
  | "delivery"
  | "lines"
  | "needHelp"
  | "orderId"
  | "payment"
  | "placedOn"
  | "placedOnDateTime"
  | "shippingAddress"
  | "status"
  | "summary"
>;

/** The detail as the collector sees it: the order, or the same not-found for any id they may not see. */
function OrderDetailsCase({ content }: { content: DetailContent }) {
  return (
    <OrderDetails
      copy={content.copy}
      delivery={content.delivery}
      lines={content.lines}
      needHelp={content.needHelp}
      orderId={content.orderId}
      payment={content.payment}
      placedOn={content.placedOn}
      placedOnDateTime={content.placedOnDateTime}
      shippingAddress={content.shippingAddress}
      status={content.status}
      summary={content.summary}
      onTrackOrder={fn()}
    />
  );
}

/** A failed first read: Retry reads the same order again. */
function FailedRead() {
  const [read, setRead] = useState<"failed" | "loading" | "filled">("failed");

  const retry = () => {
    setRead("loading");
    window.setTimeout(() => setRead("filled"), ORDER_DETAILS_READ_MS);
  };

  if (read === "filled") {
    return <OrderDetailsCase content={ORDER_DETAILS_CONTENT} />;
  }
  if (read === "loading") {
    return <OrderDetailsLoadingCard label={ORDER_DETAILS_READ_COPY.loading} />;
  }
  return (
    <OrderDetailsReadFailed
      message={ORDER_DETAILS_READ_COPY.failed}
      onRetry={retry}
      retryLabel={ORDER_DETAILS_READ_COPY.retry}
    />
  );
}

function OrderStep({
  step,
}: {
  step: "web" | "refund" | "point-of-sale" | "not-found" | "loading" | "failed";
}) {
  if (step === "refund") {
    return <OrderDetailsCase content={PARTIAL_REFUND_CONTENT} />;
  }
  if (step === "point-of-sale") {
    return <OrderDetailsCase content={POINT_OF_SALE_CONTENT} />;
  }
  if (step === "not-found") {
    return (
      <OrderDetailsNotFound
        backLabel={ORDER_DETAILS_READ_COPY.backToOrders}
        breadcrumbs={null}
        description={ORDER_DETAILS_READ_COPY.notFoundDescription}
        onBack={fn()}
        title={ORDER_DETAILS_READ_COPY.notFoundTitle}
      />
    );
  }
  if (step === "loading") {
    return <OrderDetailsLoadingCard label={ORDER_DETAILS_READ_COPY.loading} />;
  }
  if (step === "failed") {
    return <FailedRead />;
  }
  return <OrderDetailsCase content={ORDER_DETAILS_CONTENT} />;
}

/** A collector inspects one owned order, including a refund, a point-of-sale sale and a failed read. */
export const InspectAnOwnedOrder: Story = {
  parameters: {
    journeys: ["grade10-site-store-order-detail-US-01"],
  },
  render: () => (
    <FlowContainer
      cases={ORDER_CASES}
      description={
        <p>
          A refunded line stays on the order and its refund shows apart from the
          paid total. A point-of-sale order draws the paid total without a
          delivery, payment or shipping address it does not have. An order the
          collector cannot see gets the same not-found treatment as an unknown
          one. A failed read offers Retry.
        </p>
      }
    >
      {(step) => <OrderStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("Delivery Status")).toBeVisible(),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(canvas.getByText("−HK$105.00")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(canvas.getByText("HK$1,050.00")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByText(ORDER_DETAILS_READ_COPY.notFoundTitle),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByText(ORDER_DETAILS_READ_COPY.loading),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(ORDER_DETAILS_READ_COPY.failed)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await waitFor(() =>
      expect(canvas.getByText("Delivery Status")).toBeVisible(),
    );
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      ORDER_CASES.length,
    );
  },
};
