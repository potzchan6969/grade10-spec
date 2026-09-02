import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  FIXTURE_AUCTION_CLOSED,
  FIXTURE_AUCTION_DEADLINE,
  FIXTURE_AUCTION_OPENS_DEADLINE,
} from "../../lib/datetime-fixtures";
import {
  BUYER_FEE_HINT,
  HighestBidderStanding,
  ListingBidPanelLoading,
  LiveActions,
  LostStanding,
  OutbidStanding,
  PostAuctionActions,
  WatchingAction,
  WatchOnlyActions,
  WonPaymentDueStanding,
  WonSettledStanding,
} from "./fixtures";
import { ListingBidPanel } from "./listing-bid-panel";
import {
  DEFAULT_LISTING_EXTENSION_POLICY,
  formatExtendedBiddingRules,
  formatExtensionDurationValue,
  SHORT_WINDOW_EXTENSION_POLICY,
} from "./listing-extension-policy";

const meta = {
  title: "Auction Listing/ListingBidPanel",
  component: ListingBidPanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      price: "Current bid",
      maximum: "Your maximum",
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
    },
    title: "1999 Charizard, PSA 10",
    watching: false,
    kicker: "Listing 12 · September Slabs",
    price: "HK$4,800.00",
    buyerFeeHint: BUYER_FEE_HINT,
    bidCount: "1 Bid",
    historyRows: [
      {
        id: "bidder-3-4800",
        bidder: "Bidder 3",
        amount: "HK$4,800.00",
        time: "21 Aug 2026, 11:08 UTC",
      },
    ],
    historyLabel: "Bid history",
    remaining: "13D 11H 33M 47S",
    deadline: FIXTURE_AUCTION_DEADLINE,
    extensionValue: formatExtensionDurationValue(
      DEFAULT_LISTING_EXTENSION_POLICY,
    ),
    extensionTooltip: formatExtendedBiddingRules(
      DEFAULT_LISTING_EXTENSION_POLICY,
    ),
    watchAction: <WatchOnlyActions />,
    bidActions: <LiveActions />,
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingBidPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

type PaymentMethodState = "method" | "pending" | "refused";

function PaymentMethodDialog({
  state,
  onClose,
  onAuthorize,
}: {
  state: PaymentMethodState;
  onClose: () => void;
  onAuthorize: () => void;
}) {
  const content: Record<
    PaymentMethodState,
    { description: string; footer: ReactNode; refusal?: string }
  > = {
    method: {
      description:
        "Choose a payment method to authorize your maximum bid. Your card details stay with Stripe.",
      footer: (
        <Button onClick={onAuthorize} size="md">
          Authorize HK$4,800.00
        </Button>
      ),
    },
    pending: {
      description:
        "Your payment method is being authorized. Keep this dialog open while Stripe completes the request.",
      footer: (
        <Button disabled size="md">
          Authorizing payment method
        </Button>
      ),
    },
    refused: {
      description:
        "Choose another payment method to authorize your maximum bid.",
      refusal: "Your payment method was declined. No bid has been placed.",
      footer: (
        <Button onClick={onAuthorize} size="md">
          Try another method
        </Button>
      ),
    },
  };
  const current = content[state];

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Authorize your bid</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack gap="md">
            <DialogDescription>{current.description}</DialogDescription>
            <Card className="p-4">
              <Text size="sm" weight="medium">
                Secure payment field
              </Text>
              <Text size="sm" tone="secondary">
                Stripe securely collects your payment details here.
              </Text>
            </Card>
          </VStack>
        </DialogBody>
        {current.refusal ? <Text role="alert">{current.refusal}</Text> : null}
        <DialogFooter>{current.footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentMethodBidPanel({
  initialState = "method",
}: {
  initialState?: PaymentMethodState;
}) {
  const [dialogState, setDialogState] = useState<PaymentMethodState | null>(
    null,
  );

  return (
    <>
      <ListingBidPanel
        {...meta.args}
        bidActions={
          <LiveActions onPlaceBid={() => setDialogState(initialState)} />
        }
      />
      {dialogState ? (
        <PaymentMethodDialog
          onAuthorize={() => setDialogState("pending")}
          onClose={() => setDialogState(null)}
          state={dialogState}
        />
      ) : null}
    </>
  );
}

export const Loading: Story = {
  render: () => <ListingBidPanelLoading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PreAuction: Story = {
  args: {
    copy: { price: "Starting bid", maximum: "Your maximum", ends: "Opens" },
    price: "HK$1,200.00",
    bidCount: undefined,
    history: undefined,
    remaining: "2D 4H 12M 0S",
    deadline: FIXTURE_AUCTION_OPENS_DEADLINE,
    standing: undefined,
    bidActions: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getByText("Opens")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
    expect(canvas.getByRole("button", { name: "Watch" })).toBeInTheDocument();
  },
};

export const Default: Story = {
  render: () => <PaymentMethodBidPanel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: /Charizard/ }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Current bid")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("list", { name: "Bid history" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Bidder 3")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Place Bid" }));
    expect(
      within(document.body).getByRole("dialog", {
        name: "Authorize your bid",
      }),
    ).toBeInTheDocument();
    expect(
      within(document.body).getByText("Secure payment field"),
    ).toBeInTheDocument();
  },
};

export const PaymentAuthorizationPending: Story = {
  render: () => <PaymentMethodBidPanel initialState="pending" />,
};

export const PaymentAuthorizationRefused: Story = {
  render: () => <PaymentMethodBidPanel initialState="refused" />,
};

export const LeadingMaximum: Story = {
  args: {
    copy: {
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
      maximum: "Your maximum",
      price: "Current bid",
    },
    maximum: "HK$8,000.00",
    price: "HK$4,800.00",
    standing: <HighestBidderStanding />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Your maximum")).toBeInTheDocument();
    expect(canvas.getByText("HK$8,000.00")).toBeInTheDocument();
    expect(canvas.getByText("Current bid")).toBeInTheDocument();
    expect(canvas.getByText("HK$4,800.00")).toBeInTheDocument();
  },
};

export const OvertakenMaximum: Story = {
  args: {
    copy: {
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
      maximum: "Your maximum",
      price: "Current bid",
    },
    maximum: "HK$8,000.00",
    price: "HK$8,250.00",
    standing: <OutbidStanding />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Your maximum")).toBeInTheDocument();
    expect(canvas.getByText("HK$8,000.00")).toBeInTheDocument();
    expect(canvas.getByText("Outbid")).toBeInTheDocument();
  },
};

export const NoMaximum: Story = {
  args: {
    copy: {
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
      maximum: "Your maximum",
      price: "Current bid",
    },
    maximum: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Your maximum")).toBeNull();
  },
};

export const LiveNoBids: Story = {
  args: {
    copy: { price: "Starting bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$1,200.00",
    bidCount: "0 Bids",
    historyRows: [],
    historyEmpty: "No bids yet.",
    bidActions: <LiveActions />,
  },
};

export const HighestBidder: Story = {
  args: {
    standing: <HighestBidderStanding />,
    watchAction: <WatchingAction />,
    watching: true,
  },
};

export const CustomExtensionPolicy: Story = {
  args: {
    extensionValue: formatExtensionDurationValue(SHORT_WINDOW_EXTENSION_POLICY),
    extensionTooltip: formatExtendedBiddingRules(SHORT_WINDOW_EXTENSION_POLICY),
    kicker: "Listing 12 · 5-minute window · 15-minute extension",
  },
};

export const Outbid: Story = {
  args: { standing: <OutbidStanding /> },
};

export const ShowsBidHistory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "1 Bid" })).toBeInTheDocument();
    expect(canvas.getByText(/Bidder 3/)).toBeInTheDocument();
  },
};

export const PostSold: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: undefined,
    bidActions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Winning bid")).toBeInTheDocument();
    expect(canvas.getByText(/Closed 30 Aug/)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PostWonPaymentDue: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: <WonPaymentDueStanding />,
    bidActions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/auction won/i)).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pay Invoice" })).toBeDisabled();
  },
};

export const PostWonSettled: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: <WonSettledStanding />,
    bidActions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/auction won/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Pay Invoice" })).toBeNull();
  },
};

export const PostLost: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: <LostStanding />,
    bidActions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/didn’t win/i)).toBeInTheDocument();
  },
};

export const PostUnsold: Story = {
  args: {
    copy: { price: "Result", maximum: "Your maximum", ends: "Ends" },
    price: "Unsold",
    bidCount: "0 Bids",
    historyRows: [],
    historyEmpty: "No bids yet.",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: undefined,
    bidActions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Result")).toBeInTheDocument();
    expect(canvas.getByText("Unsold")).toBeInTheDocument();
  },
};

/** @deprecated Use PostSold — kept as alias for existing links. */
export const Closed: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    bidActions: <PostAuctionActions />,
  },
};
