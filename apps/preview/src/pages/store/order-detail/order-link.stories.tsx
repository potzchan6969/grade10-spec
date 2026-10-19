import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ACCOUNT_ASK_COPY, MEMBER_ASK_COPY } from "../order-confirmed-content";
import { ORDER_DETAILS_READ_COPY } from "./order-details-content";
import { OrderLinkPage } from "./order-link-page";

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
    // No loyalty facts on a public link — no points section, no Points row.
    expect(canvas.queryByText(/Points/)).not.toBeInTheDocument();
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
    // A member's link stays just as private — no points section or row.
    expect(canvas.queryByText(/Points/)).not.toBeInTheDocument();
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
