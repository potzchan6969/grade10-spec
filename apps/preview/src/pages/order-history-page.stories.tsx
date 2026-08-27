import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { Nav } from "@grade10/design-system/components/layout/nav";
import { OrderHistory } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  ACTIVE_ORDERS,
  ORDER_HISTORY_COPY,
  PAST_ORDERS,
} from "./order-history-content";
import { STORE_FOOTER, STORE_NAV } from "./store-content";

/**
 * Order History as a store assembles it: `Nav`, shared `OrderHistory`, and
 * `Footer`. Content and the Active/Past split live here — the compound only
 * renders what it is given.
 */
function OrderHistoryPage({ empty = false }: { empty?: boolean }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Nav {...STORE_NAV} />
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
          onViewDetails={() => {}}
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

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
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
    expect(canvas.getByText("No orders yet")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Shop Now" })).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Active Orders" }),
    ).not.toBeInTheDocument();
  },
};
