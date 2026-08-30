import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { List, X } from "@phosphor-icons/react";
import { Link } from "react-router";
import { HealthPip } from "./health-banner";
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
          <Text as="span" size="sm" weight="bold">
            Manual
          </Text>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <HealthPip />
          <ManualSearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
