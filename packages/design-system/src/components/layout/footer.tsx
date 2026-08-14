import { Link } from "@grade10/design-system/components/forms/link";
import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type FooterLink = {
  label: ReactNode;
  href: string;
};

type FooterColumn = {
  heading: ReactNode;
  links: FooterLink[];
};

type FooterProps = ComponentProps<"footer"> & {
  logo?: ReactNode;
  description?: ReactNode;
  attribution?: ReactNode;
  socialLinks?: FooterLink[];
  columns?: FooterColumn[];
  copyright?: ReactNode;
  legalLinks?: FooterLink[];
  locale?: ReactNode;
};

const DEFAULT_SOCIAL: FooterLink[] = [
  { label: "INSTAGRAM", href: "#instagram" },
  { label: "YOUTUBE", href: "#youtube" },
  { label: "THREADS", href: "#threads" },
];

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: "SHOP",
    links: [
      { label: "ALL COLLECTIONS", href: "#collections" },
      { label: "POKÉMON", href: "#pokemon" },
      { label: "DRAGON BALL", href: "#dragon-ball" },
      { label: "ONE PIECE", href: "#one-piece" },
      { label: "DISNEY", href: "#disney" },
      { label: "NBA", href: "#nba" },
      { label: "MLB", href: "#mlb" },
      { label: "FORMULA 1", href: "#formula-1" },
    ],
  },
  {
    heading: "HELP",
    links: [
      { label: "CARD SUBMISSION", href: "#submission" },
      { label: "ORDER STATUS", href: "#order-status" },
      { label: "STORE LOCATOR", href: "#locator" },
      { label: "SHIPPING & DELIVERY", href: "#shipping" },
      { label: "RETURNS & REFUNDS", href: "#returns" },
      { label: "FAQ", href: "#faq" },
      { label: "CONTACT", href: "#contact" },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "PRIVACY POLICY", href: "#privacy" },
      { label: "TERMS of SERVICE", href: "#terms" },
      { label: "ABOUT GRADE10", href: "#about" },
    ],
  },
];

const DEFAULT_LEGAL: FooterLink[] = [
  { label: "PRIVACY", href: "#privacy" },
  { label: "TERMS", href: "#terms" },
  { label: "SHIPPING", href: "#shipping" },
];

/**
 * Store footer. Figma (`4171:9653`) has no variant axes — columns and copy
 * are consumer-owned so a locale or catalog change does not fork the layout.
 */
function Footer({
  className,
  logo = "Grade10 Marketplace",
  description = "Japanese trading cards selected for collectors, openers, and complete-set builders.",
  attribution = "A division of MemeStrategy (HKEX: 2440)",
  socialLinks = DEFAULT_SOCIAL,
  columns = DEFAULT_COLUMNS,
  copyright = "© 2026 Grade10. All rights reserved.",
  legalLinks = DEFAULT_LEGAL,
  locale = "HONG KONG / HKD",
  ...props
}: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "flex w-full flex-col border border-border bg-card",
        className,
      )}
      {...props}
    >
      <div className="grid w-full grid-cols-4 gap-8 px-10 pt-12 pb-8">
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm font-medium text-foreground">{logo}</p>
          <p className="text-xs text-secondary-foreground">{description}</p>
          <p className="text-xs text-secondary-foreground">{attribution}</p>
          <div className="flex items-start gap-4 pt-3">
            {socialLinks.map((link) => (
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
        {columns.map((column) => (
          <div
            className="flex flex-col items-start gap-3"
            key={String(column.heading)}
          >
            <p className="text-xs font-medium text-secondary-foreground">
              {column.heading}
            </p>
            {column.links.map((link) => (
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
        ))}
      </div>
      <div className="flex h-[60px] w-full items-center justify-between border-t border-border px-10">
        <p className="text-xs font-medium text-secondary-foreground">
          {copyright}
        </p>
        <div className="flex items-start gap-6">
          {legalLinks.map((link) => (
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
        <p className="text-xs font-medium text-secondary-foreground">
          {locale}
        </p>
      </div>
    </footer>
  );
}

export type { FooterColumn, FooterLink, FooterProps };
export { Footer };
