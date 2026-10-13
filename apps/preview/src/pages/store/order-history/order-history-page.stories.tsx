import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { OrderHistory, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  navigateToStory,
  ORDER_DETAILS_STORY_ID,
} from "../../workbench-story-nav";
import {
  ACTIVE_ORDERS,
  ORDER_HISTORY_COPY,
  ORDER_HISTORY_READ_COPY,
  ORDER_HISTORY_READ_MS,
  PAST_ORDERS,
  PAST_ORDERS_WITH_GUEST,
  PENDING_ACTIVE_ORDERS,
} from "./order-history-content";
import {
  OrderHistoryLoadingCards,
  OrderHistoryReadFailed,
} from "./order-history-states";

/**
 * Order History as a store assembles it: `SiteHeader`, shared `OrderHistory`,
 * and `Footer`. Content and the Active/Past split live here — the compound
 * only renders what it is given. While the first read is in flight the page
 * says so, and a failed read offers Retry, which reads again.
 */
function OrderHistoryPage({
  empty = false,
  pendingTotal = false,
  guestOrders = false,
  read: initialRead = "filled",
}: {
  empty?: boolean;
  /** An active order whose total is not settled yet. */
  pendingTotal?: boolean;
  /** Past orders lead with a guest order placed under the member's email. */
  guestOrders?: boolean;
  /** The first read: `loading` shows skeletons, `failed` offers Retry. */
  read?: "filled" | "loading" | "failed";
}) {
  const [read, setRead] = useState(initialRead);

  const retry = () => {
    setRead("loading");
    window.setTimeout(() => setRead("filled"), ORDER_HISTORY_READ_MS);
  };

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbItem href="#account">Account</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Your Orders</BreadcrumbItem>
    </Breadcrumbs>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <div className="flex w-full flex-1 justify-center">
        {read === "filled" ? (
          <OrderHistory
            activeOrders={
              empty ? [] : pendingTotal ? PENDING_ACTIVE_ORDERS : ACTIVE_ORDERS
            }
            breadcrumbs={breadcrumbs}
            copy={ORDER_HISTORY_COPY}
            pastOrders={
              empty ? [] : guestOrders ? PAST_ORDERS_WITH_GUEST : PAST_ORDERS
            }
            onShopNow={() => {}}
            onTrackOrder={(orderId) => {
              window.open(`https://example.com/track/${orderId}`, "_blank");
            }}
            onViewDetails={() => navigateToStory(ORDER_DETAILS_STORY_ID)}
          />
        ) : (
          <div className="flex w-full max-w-4xl flex-col gap-8 px-8 py-12">
            {breadcrumbs}
            <h1 className="text-3xl font-bold text-foreground">
              {ORDER_HISTORY_COPY.title}
            </h1>
            {read === "loading" ? (
              <OrderHistoryLoadingCards
                label={ORDER_HISTORY_READ_COPY.loading}
              />
            ) : (
              <OrderHistoryReadFailed
                message={ORDER_HISTORY_READ_COPY.failed}
                onRetry={retry}
                retryLabel={ORDER_HISTORY_READ_COPY.retry}
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
  title: "Store/Order History/Screens/Order History",
  component: OrderHistoryPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OrderHistoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

function orderHistoryRevealed(canvasElement: HTMLElement): boolean {
  const root = canvasElement.querySelector('[data-slot="order-history"]');
  if (root?.getAttribute("data-revealed") !== "true") return false;

  const empty = canvasElement.querySelector(
    '[data-slot="order-history-empty"]',
  );
  if (empty) {
    return Number(getComputedStyle(empty).opacity) > 0.9;
  }

  const card = canvasElement.querySelector('[data-slot="order-history-card"]');
  const wrapper = card?.parentElement;
  if (!wrapper) return false;
  return Number(getComputedStyle(wrapper).opacity) > 0.9;
}

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderHistoryRevealed(canvasElement)).toBe(true));
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your Orders" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("heading", { level: 2, name: "Active Orders" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("heading", { level: 2, name: "Past Orders" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Track Order" })).toBeVisible();
  },
};

/** A guest order placed under the member's email is listed with their orders
 * after sign-in; the card carries nothing to mark it. */
export const WithGuestOrders: Story = {
  name: "With guest orders",
  args: { guestOrders: true },
  parameters: { journeys: ["g10.store-order-history.US4"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderHistoryRevealed(canvasElement)).toBe(true));
    expect(canvas.getByText("Order #G10-10520")).toBeVisible();
    expect(
      canvas.getByRole("heading", { level: 2, name: "Past Orders" }),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderHistoryRevealed(canvasElement)).toBe(true));
    expect(canvas.getByText("No orders yet")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Shop Now" })).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Active Orders" }),
    ).not.toBeInTheDocument();
  },
};

/** The first read has not settled: the page says it is loading, with no empty-state claim. */
export const Loading: Story = {
  args: { read: "loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your Orders" }),
    ).toBeVisible();
    expect(
      canvas.getByText(ORDER_HISTORY_READ_COPY.loading),
    ).toBeInTheDocument();
    expect(canvas.queryByText("No orders yet")).toBeNull();
  },
};

/** The order read failed: the page offers Retry, which reads the orders again. */
export const RecoverableFailure: Story = {
  args: { read: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(ORDER_HISTORY_READ_COPY.failed),
    ).toBeInTheDocument();
    expect(canvas.queryByText("No orders yet")).toBeNull();

    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Track Order" })).toBeVisible(),
    );
  },
};

/** The paid order, found in Your Orders while the store settles it. */
export const PendingTotal: Story = {
  args: { pendingTotal: true },
  parameters: { journeys: ["grade10-site-store-checkout-US-03"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderHistoryRevealed(canvasElement)).toBe(true));
    expect(canvas.getByText("Total: Pending")).toBeVisible();
    expect(canvas.queryByText(/Total: HK\$0/)).toBeNull();
  },
};
