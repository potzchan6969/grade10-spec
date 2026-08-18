import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Link } from "@grade10/design-system/components/forms/link";
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
};

type NavProps = ComponentProps<"header"> & {
  /** Promotional bar copy. Pass `null` to drop the bar. */
  promo: ReactNode;
  logo: ReactNode;
  logoHref?: string;
  utilityLinks: NavLink[];
  navItems: NavItem[];
  localeLabel: ReactNode;
  onLocaleClick?: () => void;
  onSearchClick?: () => void;
  onAccountClick?: () => void;
  onWishlistClick?: () => void;
  onCartClick?: () => void;
  searchLabel?: string;
  accountLabel?: string;
  wishlistLabel?: string;
  cartLabel?: string;
};

/**
 * Store chrome. Figma set `Nav` (`4171:9937`) has no variant axes — content
 * is passed in so a consumer can swap copy and callbacks without owning the
 * layout.
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
 */
function Nav({
  className,
  promo,
  logo,
  logoHref = "#",
  utilityLinks,
  navItems,
  localeLabel,
  onLocaleClick,
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
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {promo != null ? (
        <div
          data-slot="nav-promo"
          className="flex h-9 items-center justify-center overflow-hidden bg-foreground px-4 md:px-10"
        >
          <p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-primary-foreground">
            {promo}
          </p>
        </div>
      ) : null}
      {utilityLinks.length > 0 ? (
        <div
          data-slot="nav-utility"
          className="flex min-h-8 items-center bg-background px-4 py-1 md:px-10 md:py-0"
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
        className="relative flex flex-wrap items-center justify-between gap-y-2 border-b border-border bg-background px-4 py-3 md:h-[72px] md:flex-nowrap md:px-10 md:py-0"
      >
        <a
          className="text-2xl font-bold text-foreground"
          data-slot="nav-logo"
          href={logoHref}
        >
          {logo}
        </a>
        <nav
          aria-label="Primary"
          className="order-last flex w-full flex-wrap items-center justify-center gap-2 md:absolute md:top-1/2 md:left-1/2 md:order-none md:w-auto md:-translate-x-1/2 md:-translate-y-1/2 md:flex-nowrap"
        >
          {navItems.map((item) => (
            <a
              aria-current={item.current ? "page" : undefined}
              className={cn(
                "px-3 py-2 text-xs font-medium",
                item.current
                  ? "text-primary-muted-foreground"
                  : "text-secondary-foreground",
              )}
              href={item.href}
              key={String(item.label)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div
          data-slot="nav-controls"
          className="flex flex-wrap items-center justify-end gap-1"
        >
          {onLocaleClick ? (
            <Button
              leading={<Globe aria-hidden size={14} weight="regular" />}
              onClick={onLocaleClick}
              size="sm"
              variant="ghost"
            >
              {localeLabel}
            </Button>
          ) : (
            <span
              className="flex items-center gap-1.5 px-3 text-xs font-medium text-secondary-foreground"
              data-slot="nav-locale"
            >
              <Globe aria-hidden size={14} weight="regular" />
              {localeLabel}
            </span>
          )}
          {onSearchClick ? (
            <IconButton
              aria-label={searchLabel}
              onClick={onSearchClick}
              size="sm"
              variant="ghost"
            >
              <MagnifyingGlass aria-hidden size={16} weight="regular" />
            </IconButton>
          ) : null}
          {onAccountClick ? (
            <IconButton
              aria-label={accountLabel}
              onClick={onAccountClick}
              size="sm"
              variant="ghost"
            >
              <User aria-hidden size={16} weight="regular" />
            </IconButton>
          ) : null}
          {onWishlistClick ? (
            <IconButton
              aria-label={wishlistLabel}
              onClick={onWishlistClick}
              size="sm"
              variant="ghost"
            >
              <Heart aria-hidden size={16} weight="regular" />
            </IconButton>
          ) : null}
          {onCartClick ? (
            <IconButton
              aria-label={cartLabel}
              onClick={onCartClick}
              size="sm"
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

export type { NavItem, NavLink, NavProps };
export { Nav };
