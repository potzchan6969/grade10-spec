import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingLotMeta } from "./listing-lot-meta";

/** Matches Pages/Auction Lot Details fixture content. */
const LOT_DESCRIPTION =
  "Bandai Carddass checklist and starters slab from the Pocket Monsters set. Printed in 1997 for the early Bandai Carddass series, this PSA 10 example covers the starter trio and checklist art collectors look for when building a first-wave Japanese set. Surfaces stay sharp under the slab; corners and edges grade clean. A strong reference piece for Carddass-era Pokémon in top grade.";

const LOT_FACTS = [
  { label: "Year", value: "1997" },
  { label: "Set", value: "Pocket Monsters Carddass" },
  { label: "Grade", value: "PSA 10" },
  { label: "Cert number", value: "95109007" },
] as const;

const LOT_BADGES = [
  { label: "Pokémon" },
  { label: "Bandai Starters" },
] as const;

const VAULT_SHIPPING_BODY =
  "Stored in Grade10 Vault. Ships from our facility within 1 business day of payment.";

const MARKET_COMPS = {
  title: "Market price",
  range: "HK$46,800–HK$171,600",
} as const;

const COPY = {
  aboutThisLot: "About this lot",
  vaultShipping: "Vault shipping",
  showMore: "Show more",
  showLess: "Show less",
} as const;

const meta = {
  title: "Auction Listing/ListingLotMeta",
  component: ListingLotMeta,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "About-this-lot block under the auction bid card. Same content as Pages/Auction Lot Details. While live, market comps sit under About this lot; after sale they are omitted — the hammer price is on the bid card.",
      },
    },
  },
  args: {
    copy: COPY,
    badges: [...LOT_BADGES],
    description: LOT_DESCRIPTION,
    facts: [...LOT_FACTS],
    marketComps: MARKET_COMPS,
    vaultShippingBody: VAULT_SHIPPING_BODY,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingLotMeta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About this lot")).toBeInTheDocument();
    expect(canvas.getByText("Year")).toBeInTheDocument();
    expect(canvas.getByText("1997")).toBeInTheDocument();
    expect(canvas.getByText("Cert number")).toBeInTheDocument();
    expect(canvas.getByText("95109007")).toBeInTheDocument();
    expect(canvas.getByText("Market price")).toBeInTheDocument();
    expect(canvas.getByText("Vault shipping")).toBeInTheDocument();
    expect(canvas.getByText(/Bandai Carddass checklist/)).toBeInTheDocument();
    expect(canvas.queryByText("Result")).not.toBeInTheDocument();
  },
};

export const BodyOnly: Story = {
  args: {
    facts: undefined,
    marketComps: undefined,
    badges: [],
  },
};

export const Loading: Story = {
  render: () => (
    <VStack className="w-full" gap="lg">
      <VStack gap="md">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </VStack>
      <VStack className="border-t border-border pt-6" gap="sm">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-40" />
      </VStack>
      <VStack className="border-t border-border pt-6" gap="sm">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-full" />
      </VStack>
    </VStack>
  ),
};

/** Closed lot: hammer price lives on the bid card, so market comps are omitted. */
export const AfterSale: Story = {
  args: {
    marketComps: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About this lot")).toBeInTheDocument();
    expect(canvas.getByText("Vault shipping")).toBeInTheDocument();
    expect(canvas.queryByText("Market price")).not.toBeInTheDocument();
    expect(canvas.queryByText("Result")).not.toBeInTheDocument();
  },
};
