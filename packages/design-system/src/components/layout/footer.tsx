import { Link } from "@grade10/design-system/components/forms/link";
import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type FooterLink = {
  /** What the link is called — text, so it can name itself to a reader. */
  label: string;
  href: string;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

/**
 * The words the footer says. Where it points and what it draws are not words
 * and stay their own props.
 */
type FooterCopy = {
  description: string;
  attribution: string;
  copyright: string;
  /** What the site says it is being read in — a language, or a region and
   * its currency. */
  locale: string;
};

type FooterProps = ComponentProps<"footer"> & {
  copy: FooterCopy;
  /** The brand's own mark, which the footer places rather than says. */
  logo: ReactNode;
  socialLinks: FooterLink[];
  columns: FooterColumn[];
  legalLinks: FooterLink[];
};

/**
 * Store footer. Figma (`4171:9653`) has no variant axes — columns and copy
 * are consumer-owned so a locale or catalog change does not fork the layout.
 * The fill is `Base/background`. The outer stroke is top-only (`Base/border`),
 * matching Nav's bottom edge — this is page chrome, not a boxed card. Inset
 * and column gap follow `Gap/gap-8` and `Gap/gap-6`; the legal row is centred
 * on the bar, not spaced between the copyright and locale.
 *
 * Every content prop is required rather than defaulted: two stores render this
 * shell, and a default would let the second one ship the first one's link
 * columns, catalog blurb, and corporate attribution with nothing failing.
 *
 * A section with nothing in it is absent rather than empty — including a
 * column whose destinations do not exist yet, which would otherwise render as
 * a heading over nothing.
 *
 * The columns stack below the desktop rungs. Four columns on a phone is not a
 * layout: the catalog blurb ends up one word per line in an 80px column, wide
 * enough to pass a scroll-width check and unreadable all the same.
 *
 * The rungs are container queries, not viewport ones: this shell answers to
 * the width it is given, which is also the only width a story or a test can
 * hand it.
 */
function Footer({
  className,
  logo,
  copy,
  socialLinks,
  columns,
  legalLinks,
  ...props
}: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "@container flex w-full flex-col border-t border-border bg-background",
        className,
      )}
      {...props}
    >
      <div className="grid w-full grid-cols-1 gap-6 p-8 @xl:grid-cols-2 @3xl:grid-cols-4">
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm font-medium text-foreground">{logo}</p>
          <p className="text-xs text-secondary-foreground">
            {copy.description}
          </p>
          <p className="text-xs text-secondary-foreground">
            {copy.attribution}
          </p>
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
      <div
        className="relative flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border px-8 py-3 @3xl:h-[60px] @3xl:flex-nowrap @3xl:py-0"
        data-slot="footer-bar"
      >
        <p className="text-xs font-medium text-secondary-foreground">
          {copy.copyright}
        </p>
        {legalLinks.length > 0 ? (
          <div
            className="flex flex-wrap items-start gap-x-5 gap-y-1 @3xl:absolute @3xl:top-1/2 @3xl:left-1/2 @3xl:-translate-x-1/2 @3xl:-translate-y-1/2 @3xl:flex-nowrap"
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
          {copy.locale}
        </p>
      </div>
    </footer>
  );
}

export type { FooterColumn, FooterCopy, FooterLink, FooterProps };
export { Footer };
