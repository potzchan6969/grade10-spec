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

type StoreHeaderLink = {
  label: ReactNode;
  href: string;
};

type StoreHeaderNavItem = StoreHeaderLink & {
  current?: boolean;
};

type StoreHeaderProps = ComponentProps<"header"> & {
  promo?: ReactNode;
  logo?: ReactNode;
  logoHref?: string;
  utilityLinks?: StoreHeaderLink[];
  navItems?: StoreHeaderNavItem[];
  localeLabel?: ReactNode;
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

const DEFAULT_UTILITY: StoreHeaderLink[] = [
  { label: "Store Finder", href: "#store-finder" },
  { label: "Help", href: "#help" },
  { label: "Shipping & Delivery", href: "#shipping" },
  { label: "Orders & Returns", href: "#orders" },
];

const DEFAULT_NAV: StoreHeaderNavItem[] = [
  { label: "SHOP", href: "#shop", current: true },
  { label: "NEW ARRIVALS", href: "#new" },
  { label: "GRADE", href: "#grade" },
  { label: "AUCTION", href: "#auction" },
];

/**
 * Store chrome. Figma (`4171:9937`) has no variant axes — content is passed
 * in so a consumer can swap copy and callbacks without owning the layout.
 */
function StoreHeader({
  className,
  promo = "PROMO UTILITY BAR",
  logo = "Grade10 Marketplace",
  logoHref = "#",
  utilityLinks = DEFAULT_UTILITY,
  navItems = DEFAULT_NAV,
  localeLabel = "Hong Kong (HKD)",
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
}: StoreHeaderProps) {
  return (
    <header
      data-slot="store-header"
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {promo != null ? (
        <div
          data-slot="store-header-promo"
          className="flex h-9 items-center justify-center overflow-hidden bg-foreground px-10"
        >
          <p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-primary-foreground">
            {promo}
          </p>
        </div>
      ) : null}
      <div
        data-slot="store-header-utility"
        className="flex h-8 items-center bg-background px-10"
      >
        <div className="flex items-start gap-6">
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
      <div
        data-slot="store-header-nav"
        className="relative flex h-[72px] items-center justify-between border-b border-border bg-background px-10"
      >
        <a
          className="text-2xl font-bold text-foreground"
          data-slot="store-header-logo"
          href={logoHref}
        >
          {logo}
        </a>
        <nav
          aria-label="Primary"
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
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
        <div className="flex items-center gap-1">
          <Button
            leading={<Globe aria-hidden size={14} weight="regular" />}
            onClick={onLocaleClick}
            size="sm"
            variant="ghost"
          >
            {localeLabel}
          </Button>
          <IconButton
            aria-label={searchLabel}
            onClick={onSearchClick}
            size="sm"
            variant="ghost"
          >
            <MagnifyingGlass aria-hidden size={16} weight="regular" />
          </IconButton>
          <IconButton
            aria-label={accountLabel}
            onClick={onAccountClick}
            size="sm"
            variant="ghost"
          >
            <User aria-hidden size={16} weight="regular" />
          </IconButton>
          <IconButton
            aria-label={wishlistLabel}
            onClick={onWishlistClick}
            size="sm"
            variant="ghost"
          >
            <Heart aria-hidden size={16} weight="regular" />
          </IconButton>
          <IconButton
            aria-label={cartLabel}
            onClick={onCartClick}
            size="sm"
            variant="ghost"
          >
            <ShoppingBag aria-hidden size={16} weight="regular" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

export type { StoreHeaderLink, StoreHeaderNavItem, StoreHeaderProps };
export { StoreHeader };
