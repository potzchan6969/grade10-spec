import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Nav } from "./nav";

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
  { label: "Store", href: "#store", current: true },
  { label: "Auction", href: "#auction" },
  { label: "Grade", href: "#grade" },
  { label: "Store Locator", href: "#locator" },
];

const LOCALES = [
  { value: "HK", label: "Hong Kong (HKD)" },
  { value: "KR", label: "South Korea (KRW)" },
];

const CONTROLS = ["Account", "Wishlist", "Cart"];

const meta = {
  title: "Components/Nav",
  component: Nav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    promo: "PROMO UTILITY BAR",
    logo: "Grade10",
    utilityLinks: [],
    navItems: NAV_ITEMS,
    localeLabel: "Hong Kong (HKD)",
    locales: LOCALES,
    locale: "HK",
    onLocaleChange: fn(),
    onAccountClick: fn(),
    onWishlistClick: fn(),
    onCartClick: fn(),
  },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A storefront that answers the controls the set draws. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const control of CONTROLS) {
      expect(canvas.getByRole("button", { name: control })).toBeInTheDocument();
    }
    expect(canvas.queryByRole("button", { name: "Search" })).toBeNull();
    expect(
      canvas.getByRole("button", { name: "Hong Kong (HKD)" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Store" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(canvas.getByRole("link", { name: "Grade" })).not.toHaveAttribute(
      "aria-current",
    );
  },
};

/**
 * The locale trigger opens a menu of the supplied regions. Which of those is
 * the default — detect by IP, otherwise Hong Kong — is the application's.
 */
export const LocaleMenu: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      canvas.getByRole("button", { name: "Hong Kong (HKD)" }),
    );
    await userEvent.click(
      await body.findByRole("menuitemradio", { name: "South Korea (KRW)" }),
    );
    expect(args.onLocaleChange).toHaveBeenCalledWith("KR");
  },
};

/** Pass `promo: null` and the utility bar is the top edge. */
export const WithoutPromo: Story = { args: { promo: null } };

/** A store with no basket: the control is absent, not inert. */
export const WithoutCart: Story = {
  args: { onCartClick: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Cart" })).toBeNull();
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
  },
};

/**
 * The grade10 site as it stands: an account to reach, and no search, wishlist
 * or basket behind the icons the set draws.
 */
export const AccountOnly: Story = {
  args: {
    promo: null,
    utilityLinks: [],
    locales: [],
    onLocaleChange: undefined,
    onSearchClick: undefined,
    onWishlistClick: undefined,
    onCartClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    for (const control of ["Search", "Wishlist", "Cart"]) {
      expect(canvas.queryByRole("button", { name: control })).toBeNull();
    }

    // The label stays; nothing about it invites a click.
    expect(canvas.getByText("Hong Kong (HKD)")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Hong Kong (HKD)" }),
    ).toBeNull();

    expect(canvasElement.querySelector('[data-slot="nav-promo"]')).toBeNull();
    expect(canvasElement.querySelector('[data-slot="nav-utility"]')).toBeNull();
  },
};

/** Nothing is current: an address that belongs to no navigation item. */
export const NothingCurrent: Story = {
  args: { navItems: NAV_ITEMS.map(({ label, href }) => ({ label, href })) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const item of NAV_ITEMS) {
      expect(
        canvas.getByRole("link", { name: item.label }),
      ).not.toHaveAttribute("aria-current");
    }
  },
};

/** No copy of the component's own: what renders is what was passed. */
export const NothingDefaulted: Story = {
  args: {
    promo: null,
    logo: "ZZZ",
    utilityLinks: [],
    navItems: [],
    localeLabel: "Singapore (SGD)",
    locales: [],
    onLocaleChange: undefined,
    onSearchClick: undefined,
    onAccountClick: undefined,
    onWishlistClick: undefined,
    onCartClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('[data-slot="nav"]')?.textContent;
    expect(text).toContain("ZZZ");
    expect(text).toContain("Singapore (SGD)");
    // What is left once the supplied strings are removed is whitespace, never
    // a word the component brought with it.
    const leftover = (text ?? "")
      .replace("ZZZ", "")
      .replace("Singapore (SGD)", "")
      .trim();
    expect(leftover).toBe("");
  },
};

/**
 * 375 CSS pixels, the narrowest viewport the shell must survive. The bar wraps
 * rather than overflowing; nothing here decides what a designed mobile
 * navigation looks like.
 */
export const Narrow: Story = {
  args: { utilityLinks: UTILITY_LINKS },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const header =
      canvasElement.querySelector<HTMLElement>('[data-slot="nav"]');
    expect(header).not.toBeNull();
    if (header === null) return;
    expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
    for (const slot of ["nav-promo", "nav-utility", "nav-bar"]) {
      const region = header.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
      expect(region).not.toBeNull();
      if (region === null) continue;
      expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
    }
  },
};

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
    locales: [{ value: "SG", label: "Singapore (SGD)" }],
    locale: "SG",
  },
};
