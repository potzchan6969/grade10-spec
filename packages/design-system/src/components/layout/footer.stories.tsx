import type { Meta, StoryObj } from "@storybook/react-vite";
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
    logo: "Grade10 Marketplace",
    description:
      "Japanese trading cards selected for collectors, openers, and complete-set builders.",
    attribution: "A division of MemeStrategy (HKEX: 2440)",
    socialLinks: SOCIAL_LINKS,
    columns: COLUMNS,
    copyright: "© 2026 Grade10. All rights reserved.",
    legalLinks: LEGAL_LINKS,
    locale: "HONG KONG / HKD",
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The grid is four columns wide; supplying fewer leaves the brand block and
 * the columns it was given, rather than stretching them. */
export const FewerColumns: Story = { args: { columns: COLUMNS.slice(0, 2) } };
