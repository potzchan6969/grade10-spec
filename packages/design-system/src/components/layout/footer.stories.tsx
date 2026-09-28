import {
  FacebookLogo,
  InstagramLogo,
  ThreadsLogo,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { G10LogoMono } from "../display/g10-logo-mono";
import { Footer } from "./footer";

/* Grade10's own footer content. It lives here, in an example, rather than in
 * the component as a default — a second store renders the same shell and must
 * not inherit this.
 *
 * Links follow page-shell and carried-surfaces: only destinations the build
 * answers. Auction-only drops the shop column and every store/help page that
 * does not answer yet. Store launch restores shop destinations and Store
 * Locator once that page answers. Docs (`/docs`) covers auction and store
 * tutorials on both compositions.
 *
 * Privacy and Terms live only in the LEGAL column — not again on the bar.
 * Country/currency is omitted until selection exists. Link labels are Title
 * Case; column headings stay as supplied. */
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/grade10hk/",
    external: true,
    icon: <InstagramLogo aria-hidden size={16} weight="fill" />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/grade10hk/",
    external: true,
    icon: <FacebookLogo aria-hidden size={16} weight="fill" />,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@grade10hk",
    external: true,
    icon: <ThreadsLogo aria-hidden size={16} weight="fill" />,
  },
];

/** Same-origin documentation site — auction and store tutorials. */
const DOCS_LINK = { label: "Docs", href: "/docs", external: true };

const LEGAL_COLUMN = {
  heading: "LEGAL",
  links: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
  ],
};

/** Production today: brand, social, docs, and the two legal pages every lane carries. */
const AUCTION_ONLY_COLUMNS = [
  {
    heading: "HELP",
    links: [DOCS_LINK],
  },
  LEGAL_COLUMN,
];

/** Once Store answers: shop destinations and Store Locator join docs and legal. */
const STORE_LAUNCH_COLUMNS = [
  {
    heading: "SHOP",
    links: [
      { label: "All Collections", href: "#collections" },
      { label: "Pokémon", href: "#pokemon" },
      { label: "Dragon Ball", href: "#dragon-ball" },
      { label: "One Piece", href: "#one-piece" },
      { label: "Disney", href: "#disney" },
      { label: "NBA", href: "#nba" },
      { label: "MLB", href: "#mlb" },
      { label: "Formula 1", href: "#formula-1" },
    ],
  },
  {
    heading: "HELP",
    links: [
      {
        label: "Store Locator",
        href: "?path=/story/pages-store-locator-page--default",
      },
      DOCS_LINK,
    ],
  },
  LEGAL_COLUMN,
];

const GRADE10_LOGO = <G10LogoMono className="h-5 w-auto" />;

const COPY = {
  attribution: "A division of MemeStrategy (HKEX: 2440)",
  copyright: "© 2026 Grade10. All rights reserved.",
};

const meta = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: COPY,
    logo: GRADE10_LOGO,
    logoHref: "/",
    socialLinks: SOCIAL_LINKS,
    columns: AUCTION_ONLY_COLUMNS,
    legalLinks: [],
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Auction-only: brand, social, Docs (`/docs`), Privacy and Terms. No shop
 * column, no bar legal duplicates, and no locale until selection exists.
 */
export const AuctionOnly: Story = {
  name: "Auction only",
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector<HTMLElement>(
      '[data-slot="footer"]',
    );
    expect(footer).not.toBeNull();
    if (footer === null) return;
    expect(footer).toHaveClass("bg-background-inverse");
    expect(footer).not.toHaveClass("border-t");
    expect(footer.firstElementChild).toHaveClass(
      "gap-6",
      "px-4",
      "py-8",
      "sm:px-8",
    );
    const bar = footer.querySelector('[data-slot="footer-bar"]');
    expect(bar).toHaveClass("px-4", "sm:px-8");
    expect(bar).toHaveClass("border-t");
    expect(footer.querySelector('[data-slot="footer-legal"]')).toBeNull();

    const canvas = within(canvasElement);
    expect(canvas.getByText("HELP")).toBeInTheDocument();
    expect(canvas.getByText("LEGAL")).toBeInTheDocument();
    expect(canvas.queryByText("SHOP")).toBeNull();
    expect(canvas.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/grade10hk/",
    );
    expect(canvas.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(canvas.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(canvas.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      "https://www.facebook.com/grade10hk/",
    );
    expect(canvas.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(canvas.getByRole("link", { name: "Threads" })).toHaveAttribute(
      "href",
      "https://www.threads.com/@grade10hk",
    );
    expect(canvas.getByRole("link", { name: "Threads" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(canvas.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs",
    );
    expect(canvas.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(canvas.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(
      canvas.getByRole("link", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "Terms of Service" }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("link", { name: "Privacy" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Terms" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Store Locator" })).toBeNull();
    expect(
      canvas.getByText("© 2026 Grade10. All rights reserved."),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/HONG KONG/)).toBeNull();
    const logo = footer.querySelector('[data-slot="footer-logo"]');
    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveClass("h-9");
  },
};

/**
 * Store launch: shop destinations and Store Locator join Docs, Privacy and
 * Terms. HELP holds Store Locator and Docs; unanswered help pages stay out.
 * The bar carries copyright only — no duplicated legal links, no locale.
 */
export const StoreLaunch: Story = {
  name: "Store launch",
  args: { columns: STORE_LAUNCH_COLUMNS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const heading of ["SHOP", "HELP", "LEGAL"]) {
      expect(canvas.getByText(heading)).toBeInTheDocument();
    }
    expect(
      canvas.getByRole("link", { name: "All Collections" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "Store Locator" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs",
    );
    expect(canvas.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(canvas.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(
      canvas.getByRole("link", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "Terms of Service" }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("link", { name: "Privacy" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Terms" })).toBeNull();
    expect(canvasElement.querySelector('[data-slot="footer-legal"]')).toBeNull();
    expect(canvas.queryByText(/HONG KONG/)).toBeNull();
    expect(canvas.queryByRole("link", { name: "Order Status" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Card Submission" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "FAQ" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Contact" })).toBeNull();
  },
};

/**
 * 375 CSS pixels: the columns stack instead of being squeezed into quarters of
 * a phone, and the legal bar wraps rather than clipping at its fixed height.
 */
export const Narrow: Story = {
  args: { columns: STORE_LAUNCH_COLUMNS },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector<HTMLElement>(
      '[data-slot="footer"]',
    );
    expect(footer).not.toBeNull();
    if (footer === null) return;
    expect(footer.scrollWidth).toBeLessThanOrEqual(footer.clientWidth);

    // Squeezing four columns onto a phone is what the width alone does not
    // catch: a long brand line ends up one word per line inside an 80px column.
    const canvas = within(canvasElement);
    const attribution = canvas.getByText(/MemeStrategy/);
    expect(attribution.clientWidth).toBeGreaterThan(240);

    const bar = footer.querySelector<HTMLElement>('[data-slot="footer-bar"]');
    expect(bar).not.toBeNull();
    if (bar === null) return;
    expect(bar.scrollHeight).toBeLessThanOrEqual(bar.clientHeight);
  },
};
