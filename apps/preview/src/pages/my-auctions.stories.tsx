import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import { AuctionRecord, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import {
  AUCTION_RECORD_COPY,
  POST_AUCTION_BIDDING,
  POST_AUCTION_WATCHING,
} from "./my-auctions-content";
import { STORE_FOOTER } from "./store-content";
import {
  storyHref,
  WINNER_ORDER_AWAITING_ADDRESS_STORY_ID,
  WINNER_ORDER_CANCELLED_STORY_ID,
  WINNER_ORDER_DELIVERED_STORY_ID,
  WINNER_ORDER_EXPIRED_INVOICE_STORY_ID,
  WINNER_ORDER_EXPIRED_SETUP_STORY_ID,
  WINNER_ORDER_PARTIALLY_PAID_STORY_ID,
  WINNER_ORDER_PAYMENT_VERIFYING_STORY_ID,
  WINNER_ORDER_PENDING_PAYMENT_STORY_ID,
  WINNER_ORDER_PREPARING_INVOICE_STORY_ID,
  WINNER_ORDER_PROCESSING_STORY_ID,
  WINNER_ORDER_REFUNDED_STORY_ID,
  WINNER_ORDER_SHIPPED_STORY_ID,
} from "./workbench-story-nav";

/**
 * My Auctions as a store assembles it: chrome + shared `AuctionRecord`.
 * Won rows deep-link to the matching Winner Order story (list → detail),
 * same pattern as Order History → Order Details. Read-only — no pay here.
 */
function MyAuctionsPage({
  bidding = POST_AUCTION_BIDDING,
  watching = POST_AUCTION_WATCHING,
}: {
  bidding?: typeof POST_AUCTION_BIDDING;
  watching?: typeof POST_AUCTION_WATCHING;
}) {
  const [biddingItems, setBiddingItems] = useState(bidding);
  const [watchingItems, setWatchingItems] = useState(watching);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Toast position="bottom-right" />
      <SiteHeader {...AUCTION_SITE_HEADER} />
      <div className="flex w-full flex-1 justify-center px-4 py-8 sm:px-8">
        <AuctionRecord
          biddingItems={biddingItems.map((item) => ({
            ...item,
            onEmailAlertsChange: (enabled: boolean) => {
              setBiddingItems((current) =>
                current.map((row) =>
                  row.id === item.id ? { ...row, emailAlerts: enabled } : row,
                ),
              );
            },
          }))}
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbItem href="#account">Account</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem current>My Auctions</BreadcrumbItem>
            </Breadcrumbs>
          }
          copy={AUCTION_RECORD_COPY}
          onBrowseCatalogue={() => {}}
          watchingItems={watchingItems.map((item) => ({
            ...item,
            onEmailAlertsChange: (enabled: boolean) => {
              setWatchingItems((current) =>
                current.map((row) =>
                  row.id === item.id ? { ...row, emailAlerts: enabled } : row,
                ),
              );
            },
            onWatchToggle: () => {
              setWatchingItems((current) =>
                current.filter((row) => row.id !== item.id),
              );
            },
          }))}
        />
      </div>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Pages/My Auctions Page",
  component: MyAuctionsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MyAuctionsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

async function myAuctionsSettled(canvasElement: HTMLElement) {
  const { waitFor } = await import("storybook/test");
  await waitFor(() => {
    expect(
      canvasElement
        .querySelector('[data-slot="auction-record"]')
        ?.getAttribute("data-revealed"),
    ).toBe("true");
  });
  await Promise.all(
    canvasElement
      .getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSTransition)
      .map((animation) => animation.finished.catch(() => undefined)),
  );
}

export const PostAuction: Story = {
  name: "Post-auction",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await myAuctionsSettled(canvasElement);

    expect(
      canvas.getByRole("heading", { level: 1, name: "My Auctions" }),
    ).toBeVisible();
    expect(canvas.getByText("Awaiting Setup")).toBeVisible();
    expect(canvas.getByText("Setup Overdue")).toBeVisible();
    expect(canvas.getByText("Preparing Invoice")).toBeVisible();
    expect(canvas.getByText("Pending Payment")).toBeVisible();
    expect(canvas.getByText("Payment Verifying")).toBeVisible();
    expect(canvas.getByText("Payment Overdue")).toBeVisible();
    expect(canvas.getByText("Partially Paid")).toBeVisible();
    expect(canvas.getByText("Processing")).toBeVisible();
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(canvas.getByText("Delivered")).toBeVisible();
    expect(canvas.getByText("Cancelled")).toBeVisible();
    expect(canvas.getByText("Refunded")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /pay/i }),
    ).not.toBeInTheDocument();

    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Base Set Charizard PSA 9",
      }),
    ).toHaveAttribute(
      "href",
      storyHref(WINNER_ORDER_AWAITING_ADDRESS_STORY_ID),
    );
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Base Set Venusaur PSA 8",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_EXPIRED_SETUP_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1998 Neo Genesis Lugia PSA 10",
      }),
    ).toHaveAttribute(
      "href",
      storyHref(WINNER_ORDER_PREPARING_INVOICE_STORY_ID),
    );
    expect(
      canvas.getByRole("link", {
        name: "Open order: 2000 Skyridge Crystal Charizard PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_PENDING_PAYMENT_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Neo Destiny Dark Tyranitar PSA 9",
      }),
    ).toHaveAttribute(
      "href",
      storyHref(WINNER_ORDER_PAYMENT_VERIFYING_STORY_ID),
    );
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Fossil Dragonite Holo PSA 8",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_EXPIRED_INVOICE_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Jungle Vaporeon Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_PARTIALLY_PAID_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Fossil Dragonite Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_PROCESSING_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 2000 Skyridge Crobat Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_SHIPPED_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Base Set Blastoise PSA 8",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_DELIVERED_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Jungle Scyther Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_CANCELLED_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Fossil Kabutops Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_REFUNDED_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Base Set Charizard PSA 9",
      }),
    ).toHaveAttribute(
      "href",
      storyHref(WINNER_ORDER_AWAITING_ADDRESS_STORY_ID),
    );
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Base Set Venusaur PSA 8",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_EXPIRED_SETUP_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1998 Neo Genesis Lugia PSA 10",
      }),
    ).toHaveAttribute(
      "href",
      storyHref(WINNER_ORDER_PREPARING_INVOICE_STORY_ID),
    );
    expect(
      canvas.getByRole("link", {
        name: "View order: 2000 Skyridge Crystal Charizard PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_PENDING_PAYMENT_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Neo Destiny Dark Tyranitar PSA 9",
      }),
    ).toHaveAttribute(
      "href",
      storyHref(WINNER_ORDER_PAYMENT_VERIFYING_STORY_ID),
    );
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Fossil Dragonite Holo PSA 8",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_EXPIRED_INVOICE_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Jungle Vaporeon Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_PARTIALLY_PAID_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Fossil Dragonite Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_PROCESSING_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 2000 Skyridge Crobat Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_SHIPPED_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Base Set Blastoise PSA 8",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_DELIVERED_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Jungle Scyther Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_CANCELLED_STORY_ID));
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Fossil Kabutops Holo PSA 9",
      }),
    ).toHaveAttribute("href", storyHref(WINNER_ORDER_REFUNDED_STORY_ID));
    expect(
      canvas.queryByRole("link", {
        name: "View order: 1999 Jungle Flareon Holo PSA 8",
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("link", {
        name: "Open listing: 1999 Jungle Flareon Holo PSA 8",
      }),
    ).toHaveAttribute("href", "#lot-flareon");
    expect(
      canvas.getByRole("link", {
        name: "Open listing: 1999 Base Set Venusaur PSA 9",
      }),
    ).toHaveAttribute("href", "#lot-venusaur");
  },
};
