import { Card } from "@grade10/design-system/components/display/card";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ShowsChapterNav } from "./shows-chapter-nav";
import { ShowsChapterSection } from "./shows-chapter-section";
import { REVEAL, REVEALED, Reveal } from "./shows-reveal";
import type { ShowsPageBodyCopy, ShowsPageContent } from "./types";

type ShowsPageBodyProps = {
  content: ShowsPageContent;
  copy: ShowsPageBodyCopy;
};

/**
 * The Figma Shows frame (`7180:7423`): the hero with the upcoming-shows
 * card, the event-scale stats, the event-format chapters under their jump
 * navigation, and the event-records timeline. The pill list is jump
 * navigation: every chapter stays mounted and a link click scrolls its
 * chapter into view. The card lists `hero.upcomingShows` as given and
 * leaves the hero when it is empty.
 */
function ShowsPageBody({ content, copy }: ShowsPageBodyProps) {
  const { hero, eventScale, formats, records } = content;
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [chapter, setChapter] = useState(formats.chapters[0]?.id ?? "");

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

  // Scroll-spy: the chapter crossing the middle band owns the active
  // link. Reduced motion only changes how the page scrolls, never which
  // chapter is on screen, so the spy runs regardless.
  useEffect(() => {
    const nodes = formats.chapters
      .map((c) => document.getElementById(c.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setChapter(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nodes.forEach((node) => {
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [formats.chapters]);

  // Native hash navigation is the jump mechanism (the workbench stubs
  // `scrollIntoView`); smooth-scroll the document so chapter jumps glide.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = reduceMotion ? "auto" : "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, [reduceMotion]);

  const pageIsRevealed = entered || Boolean(reduceMotion);

  const onTabChange = useCallback((value: string) => {
    setChapter(value);
  }, []);

  return (
    <>
      <section
        aria-labelledby="shows-heading"
        className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 py-10 sm:grid-cols-[2fr_1fr] sm:gap-24 sm:px-6 sm:py-20"
      >
        <div className="flex flex-col items-start gap-6 sm:gap-8">
          <p
            className={cn(
              "font-semibold text-accent-foreground text-sm leading-5 uppercase sm:text-lg sm:leading-7",
              REVEAL,
              pageIsRevealed && REVEALED,
            )}
          >
            {hero.eyebrow}
          </p>
          <h1
            className={cn(
              "font-semibold text-4xl leading-10 text-balance sm:text-7xl sm:leading-none",
              REVEAL,
              pageIsRevealed && REVEALED,
            )}
            id="shows-heading"
            style={{
              transitionDelay: pageIsRevealed ? "60ms" : "0ms",
            }}
          >
            {hero.heading}
          </h1>
          <p
            className={cn(
              "text-lg leading-7 text-balance sm:text-2xl sm:leading-8",
              REVEAL,
              pageIsRevealed && REVEALED,
            )}
            style={{
              transitionDelay: pageIsRevealed ? "120ms" : "0ms",
            }}
          >
            {hero.intro}
          </p>
          <div
            className={cn(
              "grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap",
              REVEAL,
              pageIsRevealed && REVEALED,
            )}
            style={{
              transitionDelay: pageIsRevealed ? "180ms" : "0ms",
            }}
          >
            <Button render={<a href="#shows-formats" />}>{hero.explore}</Button>
            <Button render={<a href={hero.pressHref} />} variant="outline">
              {hero.press}
            </Button>
          </div>
        </div>
        {hero.upcomingShows.length ? (
          <Card
            // biome-ignore format: the designer's lines, kept as drawn
            className={cn(
              REVEAL,
              "gap-0 self-end",
              pageIsRevealed && REVEALED,
            )}
            padding={false}
            style={{
              transitionDelay: pageIsRevealed ? "120ms" : "0ms",
            }}
          >
            <p className="px-6 pt-6 font-medium text-secondary-foreground text-sm leading-5 uppercase">
              {hero.upcomingLabel}
            </p>
            <ul>
              {hero.upcomingShows.map((show) => (
                <li
                  className="flex gap-6 border-border border-b px-6 py-5 last:border-b-0"
                  key={`${show.month}-${show.title}`}
                >
                  <div className="w-24 shrink-0">
                    <p className="font-semibold text-base leading-6">
                      {show.month}
                    </p>
                    <p className="text-secondary-foreground text-sm leading-5">
                      {show.year}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-base leading-6">
                      {show.title}
                    </p>
                    <p className="text-secondary-foreground text-sm leading-5">
                      {show.city}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </section>

      {/* Event scale */}
      <section aria-labelledby="shows-scale-heading" className="bg-muted">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-12 sm:px-6 sm:py-20">
          <Reveal>
            <div className="flex flex-col gap-3 sm:gap-4">
              <p className="font-semibold text-accent-foreground text-sm leading-5 uppercase sm:text-lg sm:leading-7">
                {eventScale.eyebrow}
              </p>
              <h2
                className="font-semibold text-3xl leading-9 sm:text-6xl sm:leading-none"
                id="shows-scale-heading"
              >
                {eventScale.heading}
              </h2>
              <p className="max-w-3xl text-base leading-6 sm:text-lg sm:leading-7">
                {eventScale.dek}
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
            <Reveal className="sm:relative" delayMs={60}>
              <img
                alt={eventScale.photo.alt}
                className="aspect-[3/2] w-full rounded-2xl object-cover sm:absolute sm:inset-0 sm:size-full sm:aspect-auto sm:rounded-3xl"
                loading="lazy"
                sizes="(max-width: 640px) 94vw, 700px"
                src={eventScale.photo.src}
                srcSet={eventScale.photo.srcSet}
              />
            </Reveal>
            <div className="flex flex-col gap-4">
              {eventScale.stats.map((stat, index) => (
                <Reveal delayMs={120 + index * 60} key={stat.label}>
                  <Card className="gap-3 px-6">
                    <p className="font-medium text-secondary-foreground text-sm leading-5 uppercase">
                      {stat.label}
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-3xl leading-9 sm:text-4xl sm:leading-10">
                        {stat.value}
                      </p>
                      <p className="text-secondary-foreground text-sm leading-5">
                        {stat.detail}
                      </p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event formats */}
      <section
        aria-labelledby="shows-formats-heading"
        className="mx-auto flex w-full max-w-[1280px] scroll-mt-4 flex-col gap-12 px-4 py-14 sm:gap-20 sm:px-6 sm:py-28"
        id="shows-formats"
      >
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
            <p className="font-semibold text-accent-foreground text-sm leading-5 uppercase sm:text-lg sm:leading-7">
              {formats.eyebrow}
            </p>
            <h2
              className="font-semibold text-3xl leading-9 sm:text-6xl sm:leading-none"
              id="shows-formats-heading"
            >
              {formats.heading}
            </h2>
          </div>
        </Reveal>
        <ShowsChapterNav
          chapters={formats.chapters}
          onSelect={onTabChange}
          value={chapter}
        />
        {formats.chapters.map((chapterItem) => (
          <ShowsChapterSection
            chapter={chapterItem}
            copy={copy}
            key={chapterItem.id}
          />
        ))}
      </section>

      {/* Event records */}
      <section aria-labelledby="shows-records-heading" className="bg-muted">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-12 sm:px-6 sm:py-20">
          <Reveal>
            <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
              <p className="font-semibold text-accent-foreground text-sm leading-5 uppercase sm:text-lg sm:leading-7">
                {records.eyebrow}
              </p>
              <h2
                className="font-semibold text-3xl leading-9 sm:text-6xl sm:leading-none"
                id="shows-records-heading"
              >
                {records.heading}
              </h2>
            </div>
          </Reveal>
          <ul className="mx-auto flex w-full max-w-[1017px] flex-col gap-6">
            {records.items.map((record, index) => (
              <Reveal
                as="li"
                className="grid gap-6 rounded-3xl border border-border bg-background p-4 sm:grid-cols-[320px_1fr] sm:gap-8"
                delayMs={index * 60}
                key={record.title}
              >
                <img
                  alt={record.image.alt}
                  className="aspect-[320/213] w-full rounded-2xl object-cover"
                  loading="lazy"
                  src={record.image.src}
                />
                <div className="flex flex-col justify-center gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-accent-foreground text-sm leading-5">
                      {record.year}
                    </p>
                    <h3 className="font-semibold text-xl leading-7 sm:text-2xl sm:leading-8">
                      {record.title}
                    </h3>
                  </div>
                  <p className="text-base leading-6">{record.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export { ShowsPageBody, type ShowsPageBodyProps };
