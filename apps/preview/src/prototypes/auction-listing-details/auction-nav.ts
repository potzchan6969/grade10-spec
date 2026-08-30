import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { createElement } from "react";

const noop = () => {};

const NAV_LOGO = createElement(G10LogoMono, { className: "h-7 w-auto" });

export const AUCTION_NAV = {
  copy: { locale: "USD" },
  promo: "PROMO UTILITY BAR",
  logo: NAV_LOGO,
  logoHref: "/",
  locales: [
    { value: "US", label: "USD" },
    { value: "HK", label: "HKD" },
  ],
  locale: "US",
  utilityLinks: [],
  navItems: [
    { label: "Store", href: "#shop" },
    { label: "Auction", href: "#auction", current: true },
    { label: "Grade", href: "#grade" },
    { label: "Store Locator", href: "#locator" },
  ],
  onLocaleChange: noop,
  onAccountClick: noop,
  onCartClick: noop,
};
