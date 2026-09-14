"use client";

import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Link } from "@grade10/design-system/components/forms/link";
import { NavigationLink } from "@grade10/design-system/components/layout/navigation-link";
import { NavigationList } from "@grade10/design-system/components/layout/navigation-list";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@grade10/design-system/components/overlays/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { IconProvider } from "@grade10/design-system/components/providers/icon-provider";
import { cn } from "@grade10/design-system/lib/utils";
import {
  CaretRight,
  List,
  MagnifyingGlass,
  ShoppingBag,
  Translate,
  User,
} from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useState } from "react";

type NavLink = {
  /** What the link is called — text, so the header can name it to a reader. */
  label: string;
  href: string;
};

type NavItem = NavLink & {
  current?: boolean;
  disabled?: boolean;
};

type NavLocale = {
  value: string;
  label: string;
};

/** How the account control looks when the application supplies `onAccountClick`. */
type NavAccountPresentation = "icon" | "sign-in";

/**
 * The words the header says. What it points at, who handles a click, and
 * which regions it draws are not words and stay their own props.
 */
type NavCopy = {
  /** What the locale control displays — the active language label. Shown
   * whether or not the control can be switched. */
  locale: string;
  /** Accessible names for the controls a handler backs. A control with no
   * handler is not rendered, so its name is never read. */
  search?: string;
  account?: string;
  cart?: string;
  /** Visible label when `accountPresentation` is `"sign-in"`. */
  signIn?: string;
  /** Accessible name for the compact-viewport menu trigger. */
  menu?: string;
  /** Title shown at the top of the compact menu drawer. */
  menuTitle?: string;
  /** Title of the compact language nested drawer. */
  language?: string;
};

type NavProps = ComponentProps<"header"> & {
  copy: NavCopy;
  /** Promotional bar content. Pass `null` to drop the bar. */
  promo: ReactNode;
  /** The brand's own mark: a wordmark, an image, whatever it is. Markup the
   * header places rather than a word it says. */
  logo: ReactNode;
  logoHref?: string;
  utilityLinks: NavLink[];
  navItems: NavItem[];
  /** Options the locale trigger switches between. Empty when the label is display-only. */
  locales?: NavLocale[];
  /** Currently selected locale `value`. Owned by the application, including IP detection. */
  locale?: string;
  onLocaleChange?: (value: string) => void;
  onSearchClick?: () => void;
  onAccountClick?: () => void;
  /**
   * `"icon"` (default) renders the account IconButton; `"sign-in"` renders a
   * primary Button using `copy.signIn`. Ignored when `accountSlot` is supplied.
   */
  accountPresentation?: NavAccountPresentation;
  /**
   * Replaces the built-in account control. Use when a compound header owns the
   * account menu trigger. When set, `onAccountClick` and `accountPresentation`
   * are unused.
   */
  accountSlot?: ReactNode;
  onCartClick?: () => void;
  /**
   * Replaces the built-in cart control. Use when a compound header owns the
   * cart button (for example a count badge). When set, `onCartClick` is unused.
   */
  cartSlot?: ReactNode;
};

const languageIcon = <Translate aria-hidden size={14} />;

/** Compact drawers leave a visible gutter; match Drawer’s x-axis specificity. */
const COMPACT_DRAWER_CLASS =
  "data-[swipe-axis=x]:max-w-[min(var(--container-md),calc(100vw-3.5rem))] data-[swipe-axis=x]:[--drawer-content-width:min(var(--container-md),calc(100vw-3.5rem))]";

const MENU_LINK_CLASS = "min-h-11 w-full justify-start";

function LocaleControl({
  localeLabel,
  locales,
  locale,
  onLocaleChange,
  className,
}: {
  localeLabel: string;
  locales: NavLocale[];
  locale?: string;
  onLocaleChange?: (value: string) => void;
  className?: string;
}) {
  if (locales.length > 0 && onLocaleChange) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="[&_svg]:transition-none [&[data-popup-open]_svg]:rotate-0"
          render={
            <Button
              className={className}
              leading={languageIcon}
              size="md"
              variant="ghost"
            />
          }
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
      className={cn(
        "flex items-center gap-2 px-3 text-sm font-medium text-foreground",
        className,
      )}
      data-slot="nav-locale"
    >
      {languageIcon}
      {localeLabel}
    </span>
  );
}

function CompactLanguageDrawer({
  localeLabel,
  languageTitle,
  locales,
  locale,
  onLocaleChange,
}: {
  localeLabel: string;
  languageTitle: string;
  locales: NavLocale[];
  locale?: string;
  onLocaleChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="left">
      <DrawerTrigger
        data-slot="nav-menu-language"
        render={
          <Button
            className={MENU_LINK_CLASS}
            leading={languageIcon}
            size="md"
            trailing={
              <span aria-hidden className="ml-auto flex">
                <CaretRight size={14} />
              </span>
            }
            variant="ghost"
          />
        }
      >
        {localeLabel}
      </DrawerTrigger>
      <DrawerContent className={COMPACT_DRAWER_CLASS} data-slot="nav-language">
        <DrawerHeader>
          <DrawerTitle>{languageTitle}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="gap-1">
          <NavigationList
            aria-label={languageTitle}
            className="w-full flex-col items-stretch gap-1"
          >
            {locales.map((item) => (
              <NavigationLink
                active={item.value === (locale ?? locales[0]?.value)}
                className={MENU_LINK_CLASS}
                href="#"
                key={item.value}
                onClick={(event) => {
                  event.preventDefault();
                  onLocaleChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
              </NavigationLink>
            ))}
          </NavigationList>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function AccountControl({
  copy,
  presentation,
  onAccountClick,
  accountSlot,
}: {
  copy: NavCopy;
  presentation: NavAccountPresentation;
  onAccountClick?: () => void;
  accountSlot?: ReactNode;
}) {
  if (accountSlot != null) {
    return <>{accountSlot}</>;
  }
  if (!onAccountClick) {
    return null;
  }
  if (presentation === "sign-in") {
    return (
      <Button
        className="shrink-0 @max-3xl:h-8 @max-3xl:gap-1 @max-3xl:px-3 @max-3xl:text-xs"
        onClick={onAccountClick}
        size="md"
        variant="default"
      >
        {copy.signIn ?? "Sign In"}
      </Button>
    );
  }
  return (
    <IconButton
      aria-label={copy.account ?? "Account"}
      onClick={onAccountClick}
      size="md"
      variant="ghost"
    >
      <User aria-hidden size={14} />
    </IconButton>
  );
}

/**
 * Store chrome. Storybook is the layout source of truth.
 *
 * Wide (`@3xl+`): utility strip, centered primary nav, language + trailing
 * controls in the bar. Compact: a single row with a leading hamburger that
 * opens a left drawer (primary nav, then utility links as the same link
 * style, then language via a nested drawer), and Account / Sign In plus Cart
 * on the trailing edge.
 *
 * Brand, navigation, and locale content is required rather than defaulted. A
 * control renders only where a handler backs it (or an `accountSlot` is
 * supplied).
 */
function Nav({
  className,
  promo,
  logo,
  logoHref = "#",
  utilityLinks,
  copy,
  navItems,
  locales = [],
  locale,
  onLocaleChange,
  onSearchClick,
  onAccountClick,
  accountPresentation = "icon",
  accountSlot,
  onCartClick,
  cartSlot,
  ...props
}: NavProps) {
  const showAccount = accountSlot != null || onAccountClick != null;
  const showCart = cartSlot != null || onCartClick != null;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuLabel = copy.menu ?? "Menu";
  const menuTitle = copy.menuTitle ?? menuLabel;
  const languageTitle = copy.language ?? "Language";

  return (
    <IconProvider>
      <header
        data-slot="nav"
        className={cn(
          "@container flex w-full flex-col border-b border-border bg-background",
          className,
        )}
        {...props}
      >
        {promo != null ? (
          <div
            data-slot="nav-promo"
            className="flex h-9 items-center justify-center overflow-hidden bg-secondary-foreground px-8"
          >
            <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-primary-foreground">
              {promo}
            </p>
          </div>
        ) : null}
        {utilityLinks.length > 0 ? (
          <div
            data-slot="nav-utility"
            className="hidden min-h-8 items-center px-8 py-1 @3xl:flex"
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
          className="relative flex min-w-0 items-center justify-between gap-1 px-2 py-3 @3xl:h-[72px] @3xl:gap-y-2 @3xl:px-8 @3xl:py-0"
        >
          <div
            data-slot="nav-leading"
            className="flex min-w-0 items-center gap-1"
          >
            <Drawer
              open={menuOpen}
              onOpenChange={setMenuOpen}
              swipeDirection="left"
            >
              <DrawerTrigger
                className="@3xl:hidden"
                render={
                  <IconButton
                    aria-label={menuLabel}
                    size="md"
                    variant="ghost"
                  />
                }
              >
                <List aria-hidden size={14} />
              </DrawerTrigger>
              <DrawerContent
                className={COMPACT_DRAWER_CLASS}
                data-slot="nav-menu"
              >
                <DrawerHeader>
                  <DrawerTitle>{menuTitle}</DrawerTitle>
                </DrawerHeader>
                <DrawerBody className="gap-6">
                  <NavigationList
                    className="w-full flex-col items-stretch gap-1"
                    data-slot="nav-menu-primary"
                  >
                    {navItems.map((item) => (
                      <NavigationLink
                        active={item.current}
                        className={MENU_LINK_CLASS}
                        disabled={item.disabled}
                        href={item.href}
                        key={String(item.label)}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </NavigationLink>
                    ))}
                  </NavigationList>
                  {utilityLinks.length > 0 ? (
                    <NavigationList
                      aria-label="Utilities"
                      className="w-full flex-col items-stretch gap-1 border-t border-border pt-4"
                      data-slot="nav-menu-utility"
                    >
                      {utilityLinks.map((link) => (
                        <NavigationLink
                          className={MENU_LINK_CLASS}
                          href={link.href}
                          key={String(link.label)}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                        </NavigationLink>
                      ))}
                    </NavigationList>
                  ) : null}
                  {onSearchClick ? (
                    <Button
                      className={MENU_LINK_CLASS}
                      leading={<MagnifyingGlass aria-hidden size={14} />}
                      onClick={() => {
                        setMenuOpen(false);
                        onSearchClick();
                      }}
                      size="md"
                      variant="ghost"
                    >
                      {copy.search ?? "Search"}
                    </Button>
                  ) : null}
                  {locales.length > 0 && onLocaleChange ? (
                    <div className="border-t border-border pt-4">
                      <CompactLanguageDrawer
                        languageTitle={languageTitle}
                        locale={locale}
                        localeLabel={copy.locale}
                        locales={locales}
                        onLocaleChange={onLocaleChange}
                      />
                    </div>
                  ) : null}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <a
              className="min-w-0 max-w-[9rem] shrink overflow-hidden text-xl font-bold text-foreground @3xl:max-w-none @3xl:text-2xl [&_svg]:h-5 [&_svg]:w-auto @3xl:[&_svg]:h-7"
              data-slot="nav-logo"
              href={logoHref}
            >
              {logo}
            </a>
          </div>
          <NavigationList className="absolute top-1/2 left-1/2 hidden w-auto -translate-x-1/2 -translate-y-1/2 flex-nowrap @3xl:flex">
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
            className="flex shrink-0 items-center justify-end gap-1"
          >
            <div className="hidden @3xl:contents">
              <LocaleControl
                locale={locale}
                localeLabel={copy.locale}
                locales={locales}
                onLocaleChange={onLocaleChange}
              />
              {onSearchClick ? (
                <IconButton
                  aria-label={copy.search ?? "Search"}
                  onClick={onSearchClick}
                  size="md"
                  variant="ghost"
                >
                  <MagnifyingGlass aria-hidden size={14} />
                </IconButton>
              ) : null}
            </div>
            {showAccount ? (
              <AccountControl
                accountSlot={accountSlot}
                copy={copy}
                onAccountClick={onAccountClick}
                presentation={accountPresentation}
              />
            ) : null}
            {showCart ? (
              cartSlot != null ? (
                cartSlot
              ) : (
                <IconButton
                  aria-label={copy.cart ?? "Cart"}
                  onClick={onCartClick}
                  size="md"
                  variant="ghost"
                >
                  <ShoppingBag aria-hidden size={14} />
                </IconButton>
              )
            ) : null}
          </div>
        </div>
      </header>
    </IconProvider>
  );
}

export type {
  NavAccountPresentation,
  NavCopy,
  NavItem,
  NavLink,
  NavLocale,
  NavProps,
};
export { Nav };
