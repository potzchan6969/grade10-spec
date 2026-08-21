import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Footer } from "./footer";

/* Grade10's own footer content. It lives here, in an example, rather than in
 * the component as a default — a second store renders the same shell and must
 * not inherit this. */
const SOCIAL_LINKS = [
  { label: "INSTAGRAM", href: "#instagram" },
  { label: "YOUTUBE", href: "#youtube" },
  { label: "THREADS", href: "#threads" },
];

const COLUMNS = [
  {
    heading: "SHOP",
    links: [
      { label: "ALL COLLECTIONS", href: "#collections" },
      { label: "POKÉMON", href: "#pokemon" },
      { label: "DRAGON BALL", href: "#dragon-ball" },
      { label: "ONE PIECE", href: "#one-piece" },
      { label: "DISNEY", href: "#disney" },
      { label: "NBA", href: "#nba" },
      { label: "MLB", href: "#mlb" },
      { label: "FORMULA 1", href: "#formula-1" },
    ],
  },
  {
    heading: "HELP",
    links: [
      { label: "CARD SUBMISSION", href: "#submission" },
      { label: "ORDER STATUS", href: "#order-status" },
      { label: "STORE LOCATOR", href: "#locator" },
      { label: "SHIPPING & DELIVERY", href: "#shipping" },
      { label: "RETURNS & REFUNDS", href: "#returns" },
      { label: "FAQ", href: "#faq" },
      { label: "CONTACT", href: "#contact" },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "PRIVACY POLICY", href: "#privacy" },
      { label: "TERMS of SERVICE", href: "#terms" },
      { label: "ABOUT GRADE10", href: "#about" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "PRIVACY", href: "#privacy" },
  { label: "TERMS", href: "#terms" },
  { label: "SHIPPING", href: "#shipping" },
];

const meta = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: {
      description:
        "Japanese trading cards selected for collectors, openers, and complete-set builders.",
      attribution: "A division of MemeStrategy (HKEX: 2440)",
      copyright: "© 2026 Grade10. All rights reserved.",
      locale: "HONG KONG / HKD",
    },
    logo: "Grade10 Marketplace",
    socialLinks: SOCIAL_LINKS,
    columns: COLUMNS,
    legalLinks: LEGAL_LINKS,
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector<HTMLElement>(
      '[data-slot="footer"]',
    );
    expect(footer).not.toBeNull();
    if (footer === null) return;
    expect(footer).toHaveClass("border-t");
    expect(footer).not.toHaveClass("border");
    expect(footer.firstElementChild).toHaveClass("gap-6", "p-8");
    const bar = footer.querySelector('[data-slot="footer-bar"]');
    expect(bar).toHaveClass("px-8");

    const canvas = within(canvasElement);
    for (const heading of ["SHOP", "HELP", "LEGAL"]) {
      expect(canvas.getByText(heading)).toBeInTheDocument();
    }
    expect(canvas.getByRole("link", { name: "INSTAGRAM" })).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "PRIVACY" })).toBeInTheDocument();
    expect(
      canvas.getByText("© 2026 Grade10. All rights reserved."),
    ).toBeInTheDocument();
    expect(canvas.getByText("HONG KONG / HKD")).toBeInTheDocument();
  },
};

/**
 * A store with nowhere to link yet: the brand block, the copyright and the
 * locale, and nothing standing in for the sections it has no content for.
 */
export const WithoutLinks: Story = {
  args: { socialLinks: [], columns: [], legalLinks: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryAllByRole("link")).toHaveLength(0);
    // Absent, not empty: an empty row still reserves its padding.
    for (const slot of ["footer-social", "footer-legal"]) {
      expect(canvasElement.querySelector(`[data-slot="${slot}"]`)).toBeNull();
    }
    expect(canvas.getByText("Grade10 Marketplace")).toBeInTheDocument();
    expect(canvas.getByText("HONG KONG / HKD")).toBeInTheDocument();
  },
};

/**
 * 375 CSS pixels: the columns stack instead of being squeezed into quarters of
 * a phone, and the legal bar wraps rather than clipping at its fixed height.
 */
export const Narrow: Story = {
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
    // catch: the blurb ends up one word per line inside an 80px column.
    const canvas = within(canvasElement);
    const description = canvas.getByText(/Japanese trading cards/);
    expect(description.clientWidth).toBeGreaterThan(240);

    const bar = footer.querySelector<HTMLElement>('[data-slot="footer-bar"]');
    expect(bar).not.toBeNull();
    if (bar === null) return;
    expect(bar.scrollHeight).toBeLessThanOrEqual(bar.clientHeight);
  },
};

/** A column whose destinations do not exist yet is absent, heading and all. */
export const ColumnWithNoLinks: Story = {
  args: { columns: [COLUMNS[0], { heading: "HELP", links: [] }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SHOP")).toBeInTheDocument();
    expect(canvas.queryByText("HELP")).toBeNull();
  },
};

/** The grid is four columns wide; supplying fewer leaves the brand block and
 * the columns it was given, rather than stretching them. */
export const FewerColumns: Story = { args: { columns: COLUMNS.slice(0, 2) } };
