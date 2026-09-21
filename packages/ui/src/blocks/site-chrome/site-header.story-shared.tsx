import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import type { SiteHeaderProps } from "./site-header";

/** TBC — provisional docs host for collector Help. Keep in sync with Nav
 * `HELP_HREF` and preview chrome. */
const HELP_HREF = "https://grade10.mintlify.io/";

export const LOCALES = [
  { value: "en", label: "English" },
  { value: "zh-Hant", label: "繁體中文" },
  { value: "zh-Hans", label: "简体中文" },
];

/** Auction-first primary nav: no Store, no Store Locator (shop not open yet), no Grade. Help after Auction. */
export const AUCTION_NAV_ITEMS = [
  { label: "Auction", href: "#auction", current: true },
  { label: "Help", href: HELP_HREF, external: true },
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
  myOrders: "My Orders",
  myAuctions: "My Auctions",
  membership: "Membership",
  signOut: "Sign Out",
};

/** Signed-in address shown above the account menu items. */
export const ACCOUNT_EMAIL = "collector@example.com";

export const GRADE10_LOGO = <G10LogoMono className="h-5 w-auto @4xl:h-7" />;

export const SITE_HEADER_BASE_ARGS = {
  copy: COPY,
  accountEmail: ACCOUNT_EMAIL,
  promo: null,
  logo: GRADE10_LOGO,
  logoHref: "/",
  utilityLinks: [] as SiteHeaderProps["utilityLinks"],
  navItems: AUCTION_NAV_ITEMS,
  locales: LOCALES,
  locale: "en",
} satisfies Partial<SiteHeaderProps>;
