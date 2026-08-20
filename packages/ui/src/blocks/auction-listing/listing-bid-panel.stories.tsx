import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ListingBidPanel } from "./listing-bid-panel";

const meta = {
  title: "Auction Listing/ListingBidPanel",
  component: ListingBidPanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "1999 Charizard, PSA 10",
    kicker: "Listing 12 · September Slabs",
    priceLabel: "Current bid",
    price: "HK$4,800.00",
    priceHint: "Buyer's premium is added at invoice.",
    bidCount: "1 bid",
    showHistoryLabel: "Show bid history",
    hideHistoryLabel: "Hide bid history",
    history: "Bidder 3 · HK$4,800.00",
    endsLabel: "Ends",
    remaining: "13D 11H 33M 47S",
    deadline: "1 Sep 2026, 18:00 UTC",
    extensionLabel: "Extended bidding interval",
    extensionValue: "30 minutes",
    actions: (
      <VStack className="w-full" gap="sm">
        <Button className="w-full">Place Bid</Button>
        <Button className="w-full" variant="outline">
          Add to Watch List
        </Button>
      </VStack>
    ),
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: /Charizard/ }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Current bid")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();
  },
};

export const HighestBidder: Story = {
  args: {
    standing: (
      <HStack gap="sm" vAlign="center">
        <Badge variant="success">You're the highest bidder</Badge>
      </HStack>
    ),
  },
};

export const Closed: Story = {
  args: {
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionLabel: undefined,
    extensionValue: undefined,
    actions: <Button disabled>Pay Invoice</Button>,
  },
};

export const OpensHistory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Show bid history" }),
    );
    expect(canvas.getByText(/Bidder 3/)).toBeInTheDocument();
  },
};
