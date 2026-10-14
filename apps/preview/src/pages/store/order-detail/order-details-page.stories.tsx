import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { OrderDetails, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  navigateToStory,
  ORDER_HISTORY_STORY_ID,
} from "../../workbench-story-nav";
import {
  ORDER_DETAILS_CONTENT,
  ORDER_DETAILS_READ_COPY,
  ORDER_DETAILS_READ_MS,
  PARTIAL_REFUND_CONTENT,
  POINT_OF_SALE_CONTENT,
  POINTS_CREDIT_CONTENT,
} from "./order-details-content";
import {
  OrderDetailsLoadingCard,
  OrderDetailsNotFound,
  OrderDetailsReadFailed,
} from "./order-details-states";

/**
 * Order Details as a store assembles it: `SiteHeader`, shared `OrderDetails`,
 * and `Footer`. Content and fixture data live in `order-details-content.ts`.
 * An order the collector cannot see is drawn as not found, with no hint of
 * whether it exists. A failed read offers Retry, which reads the order again.
 */
function OrderDetailsPage({
  order = "web",
  read: initialRead = "filled",
}: {
  /** Which order to draw: a web order, one with a refund, or a point-of-sale sale. */
  order?: "web" | "partialRefund" | "pointOfSale" | "pointsCredit";
  /** The read: `notFound` draws the not-found treatment, `failed` offers Retry. */
  read?: "filled" | "loading" | "failed" | "notFound";
}) {
  const [read, setRead] = useState(initialRead);
  const content =
    order === "partialRefund"
      ? PARTIAL_REFUND_CONTENT
      : order === "pointOfSale"
        ? POINT_OF_SALE_CONTENT
        : order === "pointsCredit"
          ? POINTS_CREDIT_CONTENT
          : ORDER_DETAILS_CONTENT;

  const retry = () => {
    setRead("loading");
    window.setTimeout(() => setRead("filled"), ORDER_DETAILS_READ_MS);
  };

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbItem href="#account">Account</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#orders">Your Orders</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Order Details</BreadcrumbItem>
    </Breadcrumbs>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <div className="flex w-full flex-1 justify-center">
        {read === "filled" ? (
          <OrderDetails
            breadcrumbs={breadcrumbs}
            copy={content.copy}
            delivery={content.delivery}
            lines={content.lines}
            loyaltyPoints={
              order === "pointOfSale" ? undefined : (
                <>
                  <span className="font-semibold">+177</span>{" "}
                  <span className="text-sm font-medium text-secondary-foreground">
                    pts
                  </span>
                </>
              )
            }
            needHelp={content.needHelp}
            orderId={content.orderId}
            payment={content.payment}
            placedOn={content.placedOn}
            placedOnDateTime={content.placedOnDateTime}
            shippingAddress={content.shippingAddress}
            status={content.status}
            summary={content.summary}
            onTrackOrder={() => {
              window.open("https://example.com/track/G10-10482", "_blank");
            }}
          />
        ) : read === "notFound" ? (
          <OrderDetailsNotFound
            breadcrumbs={breadcrumbs}
            description={ORDER_DETAILS_READ_COPY.notFoundDescription}
            onBack={() => navigateToStory(ORDER_HISTORY_STORY_ID)}
            backLabel={ORDER_DETAILS_READ_COPY.backToOrders}
            title={ORDER_DETAILS_READ_COPY.notFoundTitle}
          />
        ) : (
          <div className="flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-12">
            {breadcrumbs}
            {read === "loading" ? (
              <OrderDetailsLoadingCard
                label={ORDER_DETAILS_READ_COPY.loading}
              />
            ) : (
              <OrderDetailsReadFailed
                message={ORDER_DETAILS_READ_COPY.failed}
                onRetry={retry}
                retryLabel={ORDER_DETAILS_READ_COPY.retry}
              />
            )}
          </div>
        )}
      </div>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Store/Order Detail/Screens/Order Details",
  component: OrderDetailsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OrderDetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

function orderDetailsRevealed(canvasElement: HTMLElement): boolean {
  const root = canvasElement.querySelector('[data-slot="order-details"]');
  if (root?.getAttribute("data-revealed") !== "true") return false;

  const header = canvasElement.querySelector(
    '[data-slot="order-details-header"]',
  );
  const headerWrapper = header?.parentElement;
  if (
    !headerWrapper ||
    Number(getComputedStyle(headerWrapper).opacity) <= 0.9
  ) {
    return false;
  }

  // The sidebar reveals on a stagger delay behind the header, so waiting on
  // the header alone leaves "Order Summary" mid-fade — which is what the
  // block's own story already waits for.
  const sidebar = canvasElement.querySelector(
    '[data-slot="order-details-sidebar"]',
  );
  const sidebarWrapper = sidebar?.parentElement;
  if (!sidebarWrapper) return false;
  return Number(getComputedStyle(sidebarWrapper).opacity) > 0.9;
}

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderDetailsRevealed(canvasElement)).toBe(true));
    expect(
      canvas.getByRole("heading", { level: 1, name: "Order #G10-10482" }),
    ).toBeVisible();
    expect(canvas.getByText("Delivery Status")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Track Order" })).toBeVisible();
    expect(canvas.getByText("Order Summary")).toBeVisible();
    expect(canvas.getByText("SUMMER10")).toBeVisible();
    expect(canvas.getByText("HK$1,704.50")).toBeVisible();
    expect(
      canvas.getByText("Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)"),
    ).toBeVisible();
  },
};

/** An order the collector cannot see: the same not-found treatment, with no hint it exists. */
export const NotFoundWithoutDisclosure: Story = {
  args: { read: "notFound" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: ORDER_DETAILS_READ_COPY.notFoundTitle,
      }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", {
        name: ORDER_DETAILS_READ_COPY.backToOrders,
      }),
    ).toBeVisible();
    expect(canvas.queryByText("Order Summary")).toBeNull();
    expect(canvas.queryByText("Delivery Status")).toBeNull();
  },
};

/** A line refunded: the paid total stays and the refund shows as its own row. */
export const PartialRefund: Story = {
  args: { order: "partialRefund" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderDetailsRevealed(canvasElement)).toBe(true));
    expect(canvas.getByText("Order Summary")).toBeVisible();
    expect(canvas.getByText("−HK$105.00")).toBeVisible();
    const summary = within(
      canvasElement.querySelector(
        '[data-slot="order-details-sidebar"]',
      ) as HTMLElement,
    );
    for (const label of ["Subtotal", "Total"]) {
      const row = summary.getByText(label, { exact: true }).parentElement;
      expect(within(row as HTMLElement).getByText("HK$885.00")).toBeVisible();
    }
  },
};

/** A point-of-sale order draws the paid total and invents no web fields. */
export const PointOfSaleOrder: Story = {
  args: { order: "pointOfSale" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderDetailsRevealed(canvasElement)).toBe(true));
    expect(canvas.getByText("HK$1,050.00")).toBeVisible();
    expect(canvas.queryByText("Delivery Status")).toBeNull();
    expect(canvas.queryByRole("button", { name: "Track Order" })).toBeNull();
    expect(canvas.queryByText("Shipping Address")).toBeNull();
  },
};

/** The first read has not settled: the page says it is loading, with no not-found claim. */
export const Loading: Story = {
  args: { read: "loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(ORDER_DETAILS_READ_COPY.loading),
    ).toBeInTheDocument();
    expect(
      canvas.queryByText(ORDER_DETAILS_READ_COPY.notFoundTitle),
    ).toBeNull();
  },
};

/** The order read failed: the page offers Retry, which reads the same order again. */
export const RecoverableFailure: Story = {
  args: { read: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(ORDER_DETAILS_READ_COPY.failed)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { level: 1, name: "Order #G10-10482" }),
      ).toBeVisible(),
    );
  },
};

/** Points paid part of the order: a Points row after the discount names the points used. */
export const PointsCreditApplied: Story = {
  args: { order: "pointsCredit" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderDetailsRevealed(canvasElement)).toBe(true));
    expect(canvas.getByText("Discount (SUMMER10)")).toBeVisible();
    expect(canvas.getByText("Points (100 pts)")).toBeVisible();
    expect(canvas.getByText("−HK$100.00")).toBeVisible();
    expect(canvas.getByText("HK$1,533.55")).toBeVisible();
  },
};
