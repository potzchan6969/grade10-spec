import { G10LogoMono } from "../display/g10-logo-mono";
import type { NavProps } from "./nav";

/** Shared Grade10 chrome fixtures for Nav stories. Content lives in examples,
 * never as component defaults. */
export const UTILITY_LINKS = [
  { label: "Help", href: "#help" },
  { label: "Shipping & Delivery", href: "#shipping" },
  { label: "Orders & Returns", href: "#orders" },
];

export const NAV_ITEMS = [
  { label: "Store", href: "#store", current: true },
  { label: "Auction", href: "#auction" },
  { label: "Store Locator", href: "#locator" },
];

export const LOCALES = [
  { value: "en", label: "English" },
  { value: "zh-Hant", label: "繁體中文" },
  { value: "zh-Hans", label: "简体中文" },
];

export const GRADE10_LOGO = <G10LogoMono className="h-5 w-auto @3xl:h-7" />;

export const NAV_BASE_ARGS = {
  promo: "PROMO UTILITY BAR",
  logo: GRADE10_LOGO,
  logoHref: "/",
  utilityLinks: [] as NavProps["utilityLinks"],
  navItems: NAV_ITEMS,
  copy: {
    locale: "English",
    account: "Account",
    cart: "Cart",
    signIn: "Sign In",
    menu: "Menu",
    menuTitle: "Menu",
    language: "Language",
  },
  locales: LOCALES,
  locale: "en",
} satisfies Partial<NavProps>;
