"use client";

import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Link } from "@grade10/design-system/components/forms/link";
import { NavigationLink } from "@grade10/design-system/components/layout/navigation-link";
import { NavigationList } from "@grade10/design-system/components/layout/navigation-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import {
  Globe,
  Heart,
  MagnifyingGlass,
  ShoppingBag,
  User,
} from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

type NavLink = {
  label: ReactNode;
  href: string;
};

type NavItem = NavLink & {
  current?: boolean;
  disabled?: boolean;
};

type NavLocale = {
  value: string;
  label: ReactNode;
};

type NavProps = ComponentProps<"header"> & {
  /** Promotional bar copy. Pass `null` to drop the bar. */
  promo: ReactNode;
  logo: ReactNode;
  logoHref?: string;
  utilityLinks: NavLink[];
  navItems: NavItem[];
  localeLabel: ReactNode;
  /** Options the locale trigger switches between. Empty when the label is display-only. */
  locales?: NavLocale[];
  /** Currently selected locale `value`. Owned by the application, including IP detection. */
  locale?: string;
  onLocaleChange?: (value: string) => void;
  onSearchClick?: () => void;
  onAccountClick?: () => void;
  onWishlistClick?: () => void;
  onCartClick?: () => void;
  searchLabel?: string;
  accountLabel?: string;
  wishlistLabel?: string;
  cartLabel?: string;
};

const globe = <Globe aria-hidden size={14} weight="regular" />;

function LocaleControl({
  localeLabel,
  locales,
  locale,
  onLocaleChange,
}: {
  localeLabel: ReactNode;
  locales: NavLocale[];
  locale?: string;
  onLocaleChange?: (value: string) => void;
}) {
  if (locales.length > 0 && onLocaleChange) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button leading={globe} size="md" variant="ghost" />}
        >
          {localeLabel}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-max min-w-(--anchor-width) max-w-[calc(100vw-1.5rem)]"
        >
          <DropdownMenuRadioGroup
            value={locale ?? locales[0]?.value}
            onValueChange={(value) => onLocaleChange(value)}
          >
            {locales.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                {item.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <span
      className="flex items-center gap-2 px-3 text-sm font-medium text-foreground"
      data-slot="nav-locale"
    >
      {globe}
      {localeLabel}
    </span>
  );
}

/**
 * Store chrome. Figma set `Nav` (`4171:9937`) has no variant axes — content
 * is passed in so a consumer can swap copy and callbacks without owning the
 * layout. Primary items are `NavigationList` / `NavigationLink`; the locale
 * control opens a dropdown of the supplied locales when a handler backs it.
 *
 * Brand, navigation, and locale content is required rather than defaulted: two
 * stores render this shell, and a default would let the second one ship the
 * first one's navigation with nothing failing.
 *
 * A control renders only where a handler backs it, and a region only where it
 * has content. The handler is the switch rather than a second `showSearch`
 * prop beside it: one fact, one place, and no way for the two to disagree. A
 * site with no basket therefore shows no basket instead of a button that
 * swallows the click.
 *
 * Default locale (detect by IP, otherwise Hong Kong) is an application
 * decision. This shell only switches between the options it is given.
 *
 * The bar's rungs are container queries: below them it wraps — logo and
 * controls, navigation beneath — rather than centring the navigation over
 * them. A shell answers to the width it is given, which is the only width a
 * story can hand it.
 */
function Nav({
  className,
  promo,
  logo,
  logoHref = "#",
  utilityLinks,
  navItems,
  localeLabel,
  locales = [],
  locale,
  onLocaleChange,
  onSearchClick,
  onAccountClick,
  onWishlistClick,
  onCartClick,
  searchLabel = "Search",
  accountLabel = "Account",
  wishlistLabel = "Wishlist",
  cartLabel = "Cart",
  ...props
}: NavProps) {
  return (
    <header
      data-slot="nav"
      className={cn("@container flex w-full flex-col", className)}
      {...props}
    >
      {promo != null ? (
        <div
          data-slot="nav-promo"
          className="flex h-9 items-center justify-center overflow-hidden bg-secondary px-6"
        >
          <p className="min-w-0 flex-1 truncate text-center text-sm font-bold text-secondary-foreground">
            {promo}
          </p>
        </div>
      ) : null}
      {utilityLinks.length > 0 ? (
        <div
          data-slot="nav-utility"
          className="flex min-h-8 items-center bg-background px-6 py-1"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {utilityLinks.map((link) => (
              <Link
                href={link.href}
                key={String(link.label)}
                size="xs"
                variant="secondary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <div
        data-slot="nav-bar"
        className="relative flex flex-wrap items-center justify-between gap-y-2 border-b border-border bg-background px-6 py-3 @3xl:h-[72px] @3xl:flex-nowrap @3xl:py-0"
      >
        <a
          className="text-2xl font-bold text-foreground"
          data-slot="nav-logo"
          href={logoHref}
        >
          {logo}
        </a>
        <NavigationList className="order-last w-full flex-wrap @3xl:absolute @3xl:top-1/2 @3xl:left-1/2 @3xl:order-none @3xl:w-auto @3xl:-translate-x-1/2 @3xl:-translate-y-1/2 @3xl:flex-nowrap">
          {navItems.map((item) => (
            <NavigationLink
              active={item.current}
              disabled={item.disabled}
              href={item.href}
              key={String(item.label)}
            >
              {item.label}
            </NavigationLink>
          ))}
        </NavigationList>
        <div
          data-slot="nav-controls"
          className="flex flex-wrap items-center justify-end gap-1"
        >
          <LocaleControl
            locale={locale}
            localeLabel={localeLabel}
            locales={locales}
            onLocaleChange={onLocaleChange}
          />
          {onSearchClick ? (
            <IconButton
              aria-label={searchLabel}
              onClick={onSearchClick}
              size="md"
              variant="ghost"
            >
              <MagnifyingGlass aria-hidden size={16} weight="regular" />
            </IconButton>
          ) : null}
          {onAccountClick ? (
            <IconButton
              aria-label={accountLabel}
              onClick={onAccountClick}
              size="md"
              variant="ghost"
            >
              <User aria-hidden size={16} weight="regular" />
            </IconButton>
          ) : null}
          {onWishlistClick ? (
            <IconButton
              aria-label={wishlistLabel}
              onClick={onWishlistClick}
              size="md"
              variant="ghost"
            >
              <Heart aria-hidden size={16} weight="regular" />
            </IconButton>
          ) : null}
          {onCartClick ? (
            <IconButton
              aria-label={cartLabel}
              onClick={onCartClick}
              size="md"
              variant="ghost"
            >
              <ShoppingBag aria-hidden size={16} weight="regular" />
            </IconButton>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export type { NavItem, NavLink, NavLocale, NavProps };
export { Nav };
