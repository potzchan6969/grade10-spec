import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import { OrderDetails, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { navigateToStory } from "../../workbench-story-nav";
import { showOrderAskToast } from "../order-ask-toast";
import {
  ACCOUNT_ASK_COPY,
  MEMBER_ASK_COPY,
  RECEIPT_NOTE,
} from "../order-confirmed-content";
import {
  ORDER_DETAILS_CONTENT,
  ORDER_DETAILS_READ_COPY,
} from "./order-details-content";
import { OrderDetailsNotFound } from "./order-details-states";

/**
 * The public order page an order's private link opens: the order, with no
 * account facts — no points, wallet or account details. Signed out, the
 * placed-on line names the email the receipt went to and a persistent toast
 * offers sign-in — "add this order" on a guest order, "is this your order?"
 * on a member's; a signed-in view shows neither. A wrong secret or unknown
 * order gets the same not-found treatment as any order the collector cannot
 * see.
 */
function OrderLinkPage({
  ask,
  notFound = false,
}: {
  /** Set when the view is signed out — which order kind the ask names. */
  ask?: "guest" | "member";
  notFound?: boolean;
}) {
  useEffect(() => {
    if (ask && !notFound) showOrderAskToast(ask);
  }, [ask, notFound]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} session="signed-out" />
      <main
        className={
          notFound
            ? "flex w-full flex-1 items-center justify-center"
            : "flex w-full flex-1 flex-col items-center"
        }
      >
        {notFound ? (
          <OrderDetailsNotFound
            breadcrumbs={null}
            description={ORDER_DETAILS_READ_COPY.notFoundLinkDescription}
            onBack={() =>
              navigateToStory("store-home-screens-store-home--default")
            }
            backLabel={ORDER_DETAILS_READ_COPY.backToHome}
            title={ORDER_DETAILS_READ_COPY.notFoundTitle}
          />
        ) : (
          <OrderDetails
            copy={ORDER_DETAILS_CONTENT.copy}
            delivery={ORDER_DETAILS_CONTENT.delivery}
            lines={ORDER_DETAILS_CONTENT.lines}
            needHelp={ORDER_DETAILS_CONTENT.needHelp}
            orderId={ORDER_DETAILS_CONTENT.orderId}
            payment={ORDER_DETAILS_CONTENT.payment}
            placedOn={ORDER_DETAILS_CONTENT.placedOn}
            placedOnDateTime={ORDER_DETAILS_CONTENT.placedOnDateTime}
            placedOnNote={ask ? RECEIPT_NOTE : undefined}
            shippingAddress={ORDER_DETAILS_CONTENT.shippingAddress}
            status={ORDER_DETAILS_CONTENT.status}
            summary={ORDER_DETAILS_CONTENT.summary}
            onTrackOrder={() => undefined}
          />
        )}
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />
    </div>
  );
}

const meta = {
  title: "Store/Order Detail/Screens/Order Link",
  component: OrderLinkPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    journeys: ["g10.store-order-detail.US5"],
  },
} satisfies Meta<typeof OrderLinkPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// The ask rides in the toast layer — each toast is a `li[data-sonner-toast]`
// inside the fixed toaster section, queried on `document.body`.
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

/** A guest order's link opened cold from the order email — the same page
 * as back from checkout: the order page names the receipt's email and a
 * persistent toast asks to add the order to an account. */
export const GuestOrder: Story = {
  name: "Guest order from email",
  args: { ask: "guest" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "Order #G10-10482" }),
      ).toBeVisible(),
    );
    expect(
      canvas.getByText(/Receipt sent to ada@example\.com\./),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Points Earned")).not.toBeInTheDocument();
    const ask = await theToast();
    expect(await ask.findByText(ACCOUNT_ASK_COPY.title)).toBeInTheDocument();
    expect(
      ask.getByRole("button", { name: ACCOUNT_ASK_COPY.signIn }),
    ).toBeInTheDocument();
  },
};

/** A member order's link signed out: the same public page, the same
 * receipt email, and a persistent toast offering sign-in to see it in the
 * account — the page itself shows no account facts. */
export const MemberOrderSignedOut: Story = {
  name: "Member order signed out",
  args: { ask: "member" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "Order #G10-10482" }),
      ).toBeVisible(),
    );
    expect(
      canvas.getByText(/Receipt sent to ada@example\.com\./),
    ).toBeInTheDocument();
    const ask = await theToast();
    expect(await ask.findByText(MEMBER_ASK_COPY.title)).toBeInTheDocument();
    expect(ask.getByText(MEMBER_ASK_COPY.body)).toBeInTheDocument();
    expect(
      ask.getByRole("button", { name: MEMBER_ASK_COPY.signIn }),
    ).toBeInTheDocument();
  },
};

/** A wrong secret or unknown order: the same not-found as any unseen order —
 * but a link holder may hold no account, so the way out is the store, not
 * Your Orders. */
export const NotFound: Story = {
  name: "Not found",
  args: { notFound: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: ORDER_DETAILS_READ_COPY.notFoundTitle,
      }),
    ).toBeVisible();
    expect(canvas.queryByText("Order Summary")).toBeNull();
    expect(
      canvas.queryByText(/Receipt sent to ada@example\.com\./),
    ).not.toBeInTheDocument();
    // A link holder presumes no account — the way out is the store.
    expect(
      canvas.getByRole("button", {
        name: ORDER_DETAILS_READ_COPY.backToHome,
      }),
    ).toBeVisible();
    expect(
      canvas.queryByRole("button", {
        name: ORDER_DETAILS_READ_COPY.backToOrders,
      }),
    ).not.toBeInTheDocument();
  },
};
