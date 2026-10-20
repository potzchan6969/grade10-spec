import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Card } from "@grade10/design-system/components/display/card";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { CalendarBlank, MapPin } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Fragment, useLayoutEffect, useState } from "react";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import {
  type ArticleBlock,
  type ArticleFigure,
  type ArticleSegment,
  PRESS_ARTICLE,
} from "./press-article-content";

// The same enter reveal the About page uses: a 400ms rise-and-focus
// that reduced-motion visitors skip entirely.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

// Inline links bind the frame's `Custom/primary-border` (#C4903D, the
// `orange-400` shared by `Base/accent-foreground`) at regular weight with a
// resting underline. The `Link` primitive is `inline-flex` and cannot wrap
// mid-sentence, so these stay plain anchors.
const INLINE_LINK =
  "text-accent-foreground underline decoration-from-font [text-underline-position:from-font]";

const HEADING_CLASSES = {
  2: "text-2xl leading-8 sm:text-3xl sm:leading-9",
  3: "text-xl leading-7 sm:text-2xl sm:leading-8",
  4: "text-lg leading-7 sm:text-xl sm:leading-7",
  5: "text-base leading-6 sm:text-lg sm:leading-7",
  6: "text-sm leading-5 sm:text-base sm:leading-6",
} as const;

/**
 * Yields a unique key for repeated identical content — repeated segments,
 * items or blocks get a `#n` suffix so CMS copy that repeats itself still
 * reconciles cleanly.
 */
function keyDeduper(): (base: string) => string {
  const seen = new Map<string, number>();
  return (base) => {
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}#${count}`;
  };
}

/** A stable key for a body block, derived from its content. */
function blockKey(block: ArticleBlock): string {
  switch (block.type) {
    case "paragraph":
      return `p-${block.segments.map((segment) => segment.text).join("")}`;
    case "heading":
      return `h-${block.text}`;
    case "list":
      return `l-${block.items
        .map((item) => item.map((segment) => segment.text).join(""))
        .join("")}`;
    case "quote":
      return `q-${block.cite.name}`;
    case "figure":
      return `f-${block.figure.src}`;
    case "gallery":
      return `g-${block.figures.map((figure) => figure.src).join("")}`;
  }
}

function Segments({ segments }: { segments: readonly ArticleSegment[] }) {
  const dedupe = keyDeduper();
  return (
    <>
      {segments.map((segment) =>
        segment.link ? (
          <a
            className={cn(INLINE_LINK, segment.bold && "font-semibold")}
            href={segment.link.href}
            key={dedupe(segment.text)}
            rel={segment.link.external ? "noopener noreferrer" : undefined}
            target={segment.link.external ? "_blank" : undefined}
          >
            {segment.text}
          </a>
        ) : segment.bold ? (
          <strong className="font-semibold" key={dedupe(segment.text)}>
            {segment.text}
          </strong>
        ) : (
          <Fragment key={dedupe(segment.text)}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

function Figure({
  figure,
  className,
}: {
  figure: ArticleFigure;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <img
        alt={figure.alt}
        className="aspect-video w-full rounded-2xl object-cover"
        loading="lazy"
        src={figure.src}
      />
      {figure.caption ? (
        <figcaption className="text-secondary-foreground text-sm leading-5">
          {figure.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-base leading-7 sm:text-lg">
          <Segments segments={block.segments} />
        </p>
      );
    case "heading": {
      const Tag = `h${block.level}` as "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag className={cn("pt-8 font-semibold", HEADING_CLASSES[block.level])}>
          {block.text}
        </Tag>
      );
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      const dedupe = keyDeduper();
      return (
        <Tag
          className={cn(
            "flex flex-col gap-4 ps-7 text-base leading-7 sm:text-lg",
            block.ordered ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item) => (
            <li key={dedupe(item.map((segment) => segment.text).join(""))}>
              <Segments segments={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className="flex flex-col gap-4 border-primary-border border-l-2 py-2 ps-6 sm:pe-20">
          <p className="text-base leading-7 sm:text-lg">
            <Segments segments={block.segments} />
          </p>
          <footer className="text-base leading-6">
            <span className="font-semibold">{block.cite.name}</span>
            {block.cite.role ? `, ${block.cite.role}` : null}
          </footer>
        </blockquote>
      );
    case "figure":
      return <Figure figure={block.figure} />;
    case "gallery":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {block.figures.map((figure) => (
            <Figure
              className={figure.span !== "half" ? "sm:col-span-2" : undefined}
              figure={figure}
              key={figure.src}
            />
          ))}
        </div>
      );
  }
}

/**
 * The `/press-releases/{slug}` article surface as the app assembles it:
 * `SiteHeader`, the Figma Press Release Article frame — the Press
 * breadcrumb, the release's title with its publish date and location
 * badges, the 1200:630 feature image, the body an editor composes, and
 * the three fixed sidebar cards — and `Footer`. No nav item is current —
 * the article's entry is the footer's Company column.
 */
function PressArticlePage() {
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  const pageIsRevealed = entered || Boolean(reduceMotion);
  const article = PRESS_ARTICLE;
  const dedupeBlocks = keyDeduper();

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <SiteHeader
        {...AUCTION_SITE_HEADER}
        navItems={AUCTION_SITE_HEADER.navItems.map((item) => ({
          ...item,
          current: false,
        }))}
      />
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-12">
            <div
              className={cn(
                "lg:col-start-1",
                REVEAL,
                pageIsRevealed && REVEALED,
              )}
            >
              <Breadcrumbs>
                <BreadcrumbItem href={article.breadcrumb.back.href}>
                  {article.breadcrumb.back.label}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem current>
                  {article.breadcrumb.current}
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>
            <div
              className={cn(
                "flex flex-col gap-6 lg:col-start-1",
                REVEAL,
                pageIsRevealed && REVEALED,
              )}
              style={{
                transitionDelay: pageIsRevealed ? "60ms" : "0ms",
              }}
            >
              <h1 className="font-semibold text-4xl leading-10 sm:text-5xl sm:leading-none">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  <CalendarBlank aria-hidden />
                  {article.date}
                </Badge>
                <Badge>
                  <MapPin aria-hidden />
                  {article.location}
                </Badge>
              </div>
            </div>
            <article className="flex flex-col gap-10 lg:col-start-1 lg:row-start-3 lg:gap-12">
              <img
                alt={article.featureImage.alt}
                className={cn(
                  "aspect-[1200/630] w-full rounded-3xl object-cover",
                  REVEAL,
                  pageIsRevealed && REVEALED,
                )}
                src={article.featureImage.src}
                style={{
                  transitionDelay: pageIsRevealed ? "120ms" : "0ms",
                }}
              />
              <div
                className={cn(
                  "flex flex-col gap-4",
                  REVEAL,
                  pageIsRevealed && REVEALED,
                )}
                style={{
                  transitionDelay: pageIsRevealed ? "180ms" : "0ms",
                }}
              >
                {article.body.map((block) => (
                  <Block block={block} key={dedupeBlocks(blockKey(block))} />
                ))}
              </div>
            </article>
            <aside
              className={cn(
                "flex flex-col gap-4 lg:sticky lg:top-8 lg:col-start-2 lg:row-start-3 lg:self-start",
                REVEAL,
                pageIsRevealed && REVEALED,
              )}
              style={{
                transitionDelay: pageIsRevealed ? "240ms" : "0ms",
              }}
            >
              {article.sidebar.cards.map((card) => (
                <Card className="gap-3 p-6" key={card.title} padding={false}>
                  <h2 className="font-semibold text-base leading-6">
                    {card.title}
                  </h2>
                  <p className="text-base leading-6">{card.body}</p>
                </Card>
              ))}
              <Card className="gap-3 bg-muted p-6" padding={false}>
                <h2 className="font-semibold text-base leading-6">
                  {article.sidebar.enquiries.title}
                </h2>
                <div className="flex flex-col">
                  {article.sidebar.enquiries.contacts.map((contact) => (
                    <Fragment key={contact.name}>
                      <p className="text-base leading-6">{contact.name}</p>
                      {contact.link ? (
                        <Link href={contact.link.href} variant="brand">
                          {contact.link.label}
                        </Link>
                      ) : null}
                    </Fragment>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { Block, blockKey, PressArticlePage };
