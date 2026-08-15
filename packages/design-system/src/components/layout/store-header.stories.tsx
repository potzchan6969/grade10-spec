import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoreHeader } from "./store-header";

/* Grade10's own chrome content. It lives here, in an example, rather than in
 * the component as a default — a second store renders the same shell and must
 * not inherit this. */
const UTILITY_LINKS = [
  { label: "Store Finder", href: "#store-finder" },
  { label: "Help", href: "#help" },
  { label: "Shipping & Delivery", href: "#shipping" },
  { label: "Orders & Returns", href: "#orders" },
];

const NAV_ITEMS = [
  { label: "SHOP", href: "#shop", current: true },
  { label: "NEW ARRIVALS", href: "#new" },
  { label: "GRADE", href: "#grade" },
  { label: "AUCTION", href: "#auction" },
];

const meta = {
  title: "Components/StoreHeader",
  component: StoreHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    promo: "PROMO UTILITY BAR",
    logo: "Grade10 Marketplace",
    utilityLinks: UTILITY_LINKS,
    navItems: NAV_ITEMS,
    localeLabel: "Hong Kong (HKD)",
  },
} satisfies Meta<typeof StoreHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Pass `promo: null` and the utility bar is the top edge. */
export const WithoutPromo: Story = { args: { promo: null } };

/** The same shell with another store's content, which is the whole point of
 * requiring it: nothing here is inherited. */
export const AnotherStore: Story = {
  args: {
    promo: null,
    logo: "ZZZ",
    utilityLinks: [
      { label: "Support", href: "#support" },
      { label: "Returns", href: "#returns" },
    ],
    navItems: [
      { label: "NEW", href: "#new", current: true },
      { label: "BRANDS", href: "#brands" },
    ],
    localeLabel: "Singapore (SGD)",
  },
};
