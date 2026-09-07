import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { List, X } from "@phosphor-icons/react";
import { Link } from "react-router";
import { RecentBell } from "./recent-bell";
import { ManualSearch } from "./search";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = {
  navOpen: boolean;
  onToggleNav: () => void;
  onNavigate: () => void;
};

export function Header({ navOpen, onToggleNav, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-16 border-border border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-[100rem] items-center gap-3 px-4 lg:px-6">
        <IconButton
          aria-expanded={navOpen}
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          className="lg:hidden"
          onClick={onToggleNav}
          size="md"
          variant="ghost"
        >
          {navOpen ? <X aria-hidden /> : <List aria-hidden />}
        </IconButton>

        <Link
          aria-label="Grade10 Manual"
          className="flex items-center gap-3 rounded-(--radius-md) outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={onNavigate}
          to="/"
        >
          <G10LogoMono aria-hidden className="h-5 w-auto text-foreground" />
          {/* The mark alone carries the link on a narrow screen — search, bell
              and theme have to fit beside it at 360px. */}
          <Text as="span" className="max-sm:hidden" size="sm" weight="bold">
            Manual
          </Text>
        </Link>

        <div className="ml-auto flex items-center gap-2 max-sm:gap-1">
          {/* The OpenSpec viewer is its own page under /openspec/ — written beside
              the manual at build time, mounted live by the dev server — so this
              is a plain anchor rather than a route: the router owns nothing
              there, and a full navigation is the honest one. */}
          <a
            className="rounded-(--radius-md) px-2 py-1 text-muted-foreground text-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:hidden"
            href="/openspec/"
          >
            Plan board
          </a>
          <ManualSearch />
          <RecentBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
