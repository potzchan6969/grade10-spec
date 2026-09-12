import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { OrderHistory, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  ACTIVE_ORDERS,
  ORDER_HISTORY_COPY,
  PAST_ORDERS,
} from "./order-history-content";
import { STORE_FOOTER, STORE_SITE_HEADER } from "./store-content";
import { navigateToStory, ORDER_DETAILS_STORY_ID } from "./workbench-story-nav";

/**
 * Order History as a store assembles it: `SiteHeader`, shared `OrderHistory`,
 * and `Footer`. Content and the Active/Past split live here — the compound
 * only renders what it is given.
 */
function OrderHistoryPage({ empty = false }: { empty?: boolean }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <div className="flex w-full flex-1 justify-center">
        <OrderHistory
          activeOrders={empty ? [] : ACTIVE_ORDERS}
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbItem href="#account">Account</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem current>Your Orders</BreadcrumbItem>
            </Breadcrumbs>
          }
          copy={ORDER_HISTORY_COPY}
          pastOrders={empty ? [] : PAST_ORDERS}
          onShopNow={() => {}}
          onTrackOrder={(orderId) => {
            window.open(`https://example.com/track/${orderId}`, "_blank");
          }}
          onViewDetails={() => navigateToStory(ORDER_DETAILS_STORY_ID)}
        />
      </div>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Pages/Order History Page",
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
