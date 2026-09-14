import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import type { SiteHeaderProps } from "./site-header";

/** Workbench Store Locator page — keep in sync with preview `STORE_LOCATOR_HREF`. */
const STORE_LOCATOR_HREF = "?path=/story/pages-store-locator-page--default";

export const LOCALES = [
  { value: "en", label: "English" },
  { value: "zh-Hant", label: "繁體中文" },
  { value: "zh-Hans", label: "简体中文" },
];

/** Auction-first primary nav: no Store entrance, no Grade. */
export const AUCTION_NAV_ITEMS = [
  { label: "Auction", href: "#auction", current: true },
  { label: "Store Locator", href: STORE_LOCATOR_HREF },
];

export const COPY = {
  locale: "English",
  account: "Account",
  signIn: "Sign In",
  menu: "Menu",
  menuTitle: "Menu",
  language: "Language",
  accountMenuLabel: "Account",
  profile: "Profile",
  myAuctions: "My Auctions",
  signOut: "Sign out",
};

export const GRADE10_LOGO = <G10LogoMono className="h-5 w-auto @3xl:h-7" />;

export const SITE_HEADER_BASE_ARGS = {
  copy: COPY,
  promo: null,
  logo: GRADE10_LOGO,
  logoHref: "/",
  utilityLinks: [] as SiteHeaderProps["utilityLinks"],
  navItems: AUCTION_NAV_ITEMS,
  locales: LOCALES,
  locale: "en",
} satisfies Partial<SiteHeaderProps>;
