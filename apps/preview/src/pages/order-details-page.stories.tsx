import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { Nav } from "@grade10/design-system/components/layout/nav";
import { OrderDetails } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ORDER_DETAILS_CONTENT } from "./order-details-content";
import { STORE_FOOTER, STORE_NAV } from "./store-content";

/**
 * Order Details as a store assembles it: `Nav`, shared `OrderDetails`, and
 * `Footer`. Content and fixture data live in `order-details-content.ts`.
 */
function OrderDetailsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Nav {...STORE_NAV} />
      <div className="flex w-full flex-1 justify-center">
        <OrderDetails
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbItem href="#account">Account</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem href="#orders">Your Orders</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem current>Order Details</BreadcrumbItem>
            </Breadcrumbs>
          }
          copy={ORDER_DETAILS_CONTENT.copy}
          delivery={ORDER_DETAILS_CONTENT.delivery}
          lines={ORDER_DETAILS_CONTENT.lines}
          loyaltyPoints={
            <>
              <span className="font-semibold">+177</span>{" "}
              <span className="text-sm font-medium text-secondary-foreground">
                pts
              </span>
            </>
          }
          needHelp={ORDER_DETAILS_CONTENT.needHelp}
          orderId={ORDER_DETAILS_CONTENT.orderId}
          payment={ORDER_DETAILS_CONTENT.payment}
          placedOn={ORDER_DETAILS_CONTENT.placedOn}
          placedOnDateTime={ORDER_DETAILS_CONTENT.placedOnDateTime}
          shippingAddress={ORDER_DETAILS_CONTENT.shippingAddress}
          status={ORDER_DETAILS_CONTENT.status}
          summary={ORDER_DETAILS_CONTENT.summary}
          onTrackOrder={() => {
            window.open("https://example.com/track/G10-10482", "_blank");
          }}
        />
      </div>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Pages/Order Details Page",
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
