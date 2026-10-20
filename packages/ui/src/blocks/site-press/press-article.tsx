import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Card } from "@grade10/design-system/components/display/card";
import { Link } from "@grade10/design-system/components/forms/link";
import { cn } from "@grade10/design-system/lib/utils";
import { CalendarBlank, MapPin } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Fragment, useLayoutEffect, useState } from "react";
import { PressArticleBlock } from "./press-article-block";
import { keyDeduper, pressArticleBlockKey } from "./press-article-keys";
import type { PressArticleContent } from "./types";

// The same enter reveal the About page uses: a 400ms rise-and-focus
// that reduced-motion visitors skip entirely.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

type PressArticleProps = {
  content: PressArticleContent;
};

/**
 * The Figma Press Release Article frame (`7204:10315`): the Press
 * breadcrumb, the release's title with its publish date and location
 * badges, the 1200:630 feature image, the body an editor composes, and the
 * sidebar cards. The location badge, the feature image and the enquiries
 * card render only when the content carries them.
 */
function PressArticle({ content: article }: PressArticleProps) {
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
  const dedupeBlocks = keyDeduper();

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-20">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-12">
        <div
          // biome-ignore format: the designer's lines, kept as drawn
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
              <PressArticleBlock
                block={block}
                key={dedupeBlocks(pressArticleBlockKey(block))}
              />
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
  );
}

export { PressArticle, type PressArticleProps };
