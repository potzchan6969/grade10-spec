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
  /** Homepage destination for the logo. Annotation on the set: click
   * redirects to the homepage. */
  logoHref?: string;
  socialLinks: FooterLink[];
  columns: FooterColumn[];
  legalLinks: FooterLink[];
};

/**
 * Store footer. Figma (`4171:9653`) has no variant axes — columns and copy
 * are consumer-owned so a locale or catalog change does not fork the layout.
 * This is a dark surface: the frame fills `Base/background-inverse` and every
 * string on it is `Base/primary-foreground`. The outer frame draws no stroke at all —
 * the only one in the design sits on the bottom bar's top edge, bound to the
 * `gray-500-opacity-20` primitive rather than to a semantic slot, which is
 * how Figma binds it and the reason no slot was invented for it here.
 *
 * Annotation on the set: the logo link goes to the homepage (`logoHref`).
 * Grade10's mark is the consumer-owned `g10-logo_mono` instance, drawn at
 * `Size/size-5` inside a `Size/size-9` logo frame.
 *
 * Each `Link` carries the light tone as a `className`. Figma does the same
 * thing by a different mechanism — the footer's link instances are the same
 * `secondary` `xs` variant used everywhere else, with the label fill
 * overridden per instance — because the `Link` component set defines no
 * inverse tonal axis. Until it does, a shared component may not offer one:
 * see docs/governance/design-code-sync.md.
 *
 * Inset and column gap follow `Gap/gap-8` and `Gap/gap-6`; the legal row is
 * centred on the bar, not spaced between the copyright and locale.
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
  logoHref = "#",
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
        "@container flex w-full flex-col bg-background-inverse",
        className,
      )}
      {...props}
    >
      <div className="grid w-full grid-cols-1 gap-6 p-8 @xl:grid-cols-2 @3xl:grid-cols-4">
        <div className="flex flex-col items-start gap-4">
          <a
            className="flex h-9 items-center text-primary-foreground"
            data-slot="footer-logo"
            href={logoHref}
          >
            {logo}
          </a>
          <p className="text-xs text-primary-foreground">{copy.description}</p>
          <p className="text-xs text-primary-foreground">{copy.attribution}</p>
          {socialLinks.length > 0 ? (
            <div
              className="flex flex-wrap items-start gap-4 pt-3"
              data-slot="footer-social"
            >
              {socialLinks.map((link) => (
                <Link
                  className="text-primary-foreground"
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
              <p className="text-xs font-medium text-primary-foreground">
                {column.heading}
              </p>
              {column.links.map((link) => (
                <Link
                  className="text-primary-foreground"
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
        className="relative flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[color:var(--gray-500-opacity-20)] px-8 py-3 @3xl:h-[60px] @3xl:flex-nowrap @3xl:py-0"
        data-slot="footer-bar"
      >
        <p className="text-xs font-medium text-primary-foreground">
          {copy.copyright}
        </p>
        {legalLinks.length > 0 ? (
          <div
            className="flex flex-wrap items-start gap-x-5 gap-y-1 @3xl:absolute @3xl:top-1/2 @3xl:left-1/2 @3xl:-translate-x-1/2 @3xl:-translate-y-1/2 @3xl:flex-nowrap"
            data-slot="footer-legal"
          >
            {legalLinks.map((link) => (
              <Link
                className="text-primary-foreground"
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
        <p className="text-xs font-medium text-primary-foreground">
          {copy.locale}
        </p>
      </div>
    </footer>
  );
}

export type { FooterColumn, FooterCopy, FooterLink, FooterProps };
export { Footer };
