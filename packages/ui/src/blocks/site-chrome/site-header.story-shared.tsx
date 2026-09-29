import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { getMessages } from "@grade10/i18n";
import type { SiteHeaderProps } from "./site-header";

const { auctionRecord, chrome, common, locale } = getMessages("grade10", "en");

/** TBC — provisional docs host for collector Help. Keep in sync with Nav
 * `HELP_HREF` and preview chrome. */
const HELP_HREF = "https://grade10.mintlify.io/";

export const LOCALES = [
  { value: "en", label: locale.en },
  { value: "zh-Hant", label: locale["zh-Hant"] },
  { value: "zh-Hans", label: locale["zh-Hans"] },
];

/** Auction-first primary nav: no Store, no Store Locator (shop not open yet), no Grade. Help after Auction. */
export const AUCTION_NAV_ITEMS = [
  { label: "Auction", href: "#auction", current: true },
  { label: "Help", href: HELP_HREF, external: true },
];

export const COPY = {
  locale: locale.en,
  account: chrome.accountLabel,
  signIn: chrome.signIn,
  menu: chrome.menu,
  menuTitle: chrome.menuTitle,
  language: chrome.language,
  accountMenuLabel: chrome.accountMenuLabel,
  profile: chrome.profile,
  myOrders: chrome.myOrders,
  myAuctions: auctionRecord.title,
  membership: chrome.membership,
  signOut: common.signOut,
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
