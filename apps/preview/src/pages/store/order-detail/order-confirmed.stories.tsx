import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import { OrderDetails, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { showOrderAskToast } from "../order-ask-toast";
import { RECEIPT_NOTE } from "../order-confirmed-content";
import { ORDER_DETAILS_CONTENT } from "./order-details-content";

/**
 * A guest's order page on the return from checkout — a normal order page:
 * the placed-on line names the email the receipt went to, and the account
 * ask arrives as a persistent toast bottom-right. A guest order shows no
 * loyalty points.
 */
function OrderConfirmedPage() {
  useEffect(() => {
    showOrderAskToast("guest");
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} session="signed-out" />
      <main className="flex w-full flex-1 flex-col items-center">
        <OrderDetails
          copy={ORDER_DETAILS_CONTENT.copy}
          delivery={ORDER_DETAILS_CONTENT.delivery}
          lines={ORDER_DETAILS_CONTENT.lines}
          needHelp={ORDER_DETAILS_CONTENT.needHelp}
          orderId={ORDER_DETAILS_CONTENT.orderId}
          payment={ORDER_DETAILS_CONTENT.payment}
          placedOn={ORDER_DETAILS_CONTENT.placedOn}
          placedOnDateTime={ORDER_DETAILS_CONTENT.placedOnDateTime}
          placedOnNote={RECEIPT_NOTE}
          shippingAddress={ORDER_DETAILS_CONTENT.shippingAddress}
          status={ORDER_DETAILS_CONTENT.status}
          summary={ORDER_DETAILS_CONTENT.summary}
          onTrackOrder={() => undefined}
        />
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />
    </div>
  );
}

const meta = {
  title: "Store/Order Detail/Screens/Order Link",
  component: OrderConfirmedPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    journeys: ["g10.store-order-detail.US3", "g10.store-order-detail.US4"],
  },
} satisfies Meta<typeof OrderConfirmedPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// The ask rides in the toast layer, outside the order grid — its content
// is queried on `document.body`, the page itself on `canvasElement`. Each
// toast is a `li[data-sonner-toast]` inside the fixed toaster section.

/** The one live toast, once it lands. */
async function theToast() {
  const el = await waitFor(() => {
    const node = document.body.querySelector<HTMLElement>(
      "[data-sonner-toast]",
    );
    expect(node).not.toBeNull();
    return node;
  });
  return within(el as HTMLElement);
}

/** Back from Shopify checkout: the guest's order page is any order's — the
 * placed-on line names the receipt's email — and the account ask arrives
 * as a persistent toast with one Sign in action. The ask's outcomes —
 * link sent, added, another email, send failed — ride the toast's
 * standard variants, so they draw no stories of their own. */
export const JustPaid: Story = {
  name: "Back from checkout",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(/Receipt sent to ada@example\.com\./),
    ).toBeInTheDocument();
    const ask = await theToast();
    expect(
      await ask.findByText("Add this order to your account"),
    ).toBeInTheDocument();
    expect(
      ask.getByText("Sign in to earn points for this order."),
    ).toBeInTheDocument();
    expect(ask.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "Order #G10-10482" }),
      ).toBeVisible(),
    );
    // The order id is the page's one h1 — no confirmation banner.
    expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    // A guest order shows no account facts.
    expect(canvas.queryByText("Points Earned")).not.toBeInTheDocument();
  },
};
