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
  logo: ReactNode;
  description: ReactNode;
  attribution: ReactNode;
  socialLinks: FooterLink[];
  columns: FooterColumn[];
  copyright: ReactNode;
  legalLinks: FooterLink[];
  locale: ReactNode;
};

/**
 * Store footer. Figma (`4171:9653`) has no variant axes — columns and copy
 * are consumer-owned so a locale or catalog change does not fork the layout.
 *
 * Every content prop is required rather than defaulted: two stores render this
 * shell, and a default would let the second one ship the first one's link
 * columns, catalog blurb, and corporate attribution with nothing failing.
 *
 * A section with nothing in it is absent rather than empty — including a
 * column whose destinations do not exist yet, which would otherwise render as
 * a heading over nothing.
 */
function Footer({
  className,
  logo,
  description,
  attribution,
  socialLinks,
  columns,
  copyright,
  legalLinks,
  locale,
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
          {socialLinks.length > 0 ? (
            <div
              className="flex flex-wrap items-start gap-4 pt-3"
              data-slot="footer-social"
            >
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
          ) : null}
        </div>
        {columns.map((column) =>
          column.links.length === 0 ? null : (
            <div
              className="flex flex-col items-start gap-3"
              data-slot="footer-column"
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
          ),
        )}
      </div>
      <div className="flex h-[60px] w-full items-center justify-between border-t border-border px-10">
        <p className="text-xs font-medium text-secondary-foreground">
          {copyright}
        </p>
        {legalLinks.length > 0 ? (
          <div
            className="flex flex-wrap items-start gap-x-6 gap-y-1"
            data-slot="footer-legal"
          >
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
        ) : null}
        <p className="text-xs font-medium text-secondary-foreground">
          {locale}
        </p>
      </div>
    </footer>
  );
}

export type { FooterColumn, FooterLink, FooterProps };
export { Footer };
