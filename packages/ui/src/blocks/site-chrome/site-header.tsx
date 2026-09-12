"use client";

import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  Nav,
  type NavCopy,
  type NavItem,
  type NavLink,
  type NavLocale,
  type NavProps,
} from "@grade10/design-system/components/layout/nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { User } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/**
 * Words the header says beyond the design-system Nav copy. Menu item labels
 * and the account-menu heading arrive here so a brand can rename them without
 * forking the shell.
 */
type SiteHeaderCopy = NavCopy & {
  /** Heading above the signed-in account menu items. */
  accountMenuLabel: string;
  profile: string;
  myAuctions: string;
  signOut: string;
};

type SiteHeaderSession = "signed-out" | "signed-in";

type SiteHeaderProps = {
  copy: SiteHeaderCopy;
  session: SiteHeaderSession;
  promo: ReactNode;
  logo: ReactNode;
  logoHref?: string;
  utilityLinks: NavLink[];
  navItems: NavItem[];
  locales?: NavLocale[];
  locale?: string;
  onLocaleChange?: (value: string) => void;
  onSearchClick?: () => void;
  onCartClick?: () => void;
  onSignIn: () => void;
  onProfile: () => void;
  onMyAuctions: () => void;
  onSignOut: () => void;
  className?: string;
};

/**
 * Grade10 site header: design-system `Nav` plus session-aware account entry.
 *
 * Signed out shows a primary Sign In button. Signed in shows the account icon
 * and a menu of Profile, My Auctions, and Sign out. Cart and search stay
 * optional via handlers — auction-first launches omit them. On compact
 * viewports, `Nav` moves primary nav, utilities, search, and language into the
 * left menu drawer; Account / Sign In and Cart stay in the bar. Orders and KYC
 * are not in this menu.
 *
 * All destinations and copy are application-owned. The component owns only the
 * open/close of the account menu.
 */
function SiteHeader({
  copy,
  session,
  promo,
  logo,
  logoHref,
  utilityLinks,
  navItems,
  locales,
  locale,
  onLocaleChange,
  onSearchClick,
  onCartClick,
  onSignIn,
  onProfile,
  onMyAuctions,
  onSignOut,
  className,
}: SiteHeaderProps) {
  const { accountMenuLabel, profile, myAuctions, signOut, ...navCopy } = copy;

  const accountSlot =
    session === "signed-in" ? (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="[&_svg]:transition-none [&[data-popup-open]_svg]:rotate-0"
          render={
            <IconButton
              aria-label={navCopy.account ?? "Account"}
              size="md"
              variant="ghost"
            />
          }
        >
          <User aria-hidden size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48 w-auto">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{accountMenuLabel}</DropdownMenuLabel>
            <DropdownMenuItem onClick={onProfile}>{profile}</DropdownMenuItem>
            <DropdownMenuItem onClick={onMyAuctions}>
              {myAuctions}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSignOut}>{signOut}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : undefined;

  const navProps: NavProps = {
    className,
    copy: navCopy,
    promo,
    logo,
    logoHref,
    utilityLinks,
    navItems,
    locales,
    locale,
    onLocaleChange,
    onSearchClick,
    onCartClick,
    accountPresentation: "sign-in",
    accountSlot,
    onAccountClick: session === "signed-out" ? onSignIn : undefined,
  };

  return <Nav {...navProps} />;
}

export type { SiteHeaderCopy, SiteHeaderProps, SiteHeaderSession };
export { SiteHeader };
