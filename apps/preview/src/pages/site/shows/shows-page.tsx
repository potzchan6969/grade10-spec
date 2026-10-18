import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { ArrowLeft, ArrowRight, MapPin, Play } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import {
  SHOWS_PAGE,
  type ShowChapter,
  type ShowEdition,
} from "./shows-content";

// The same enter reveal the About page uses: a 400ms rise-and-focus that
// reduced-motion visitors skip entirely. Below the fold the same transition
// fires when the section scrolls into view instead of on mount.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

/**
 * A block that reveals on first intersection with the viewport. Reduced
 * motion renders it already revealed.
 */
function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "section" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed || reduceMotion) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed, reduceMotion]);

  const isRevealed = revealed || Boolean(reduceMotion);
  return (
    <Tag
      className={cn(REVEAL, isRevealed && REVEALED, className)}
      ref={ref as never}
      style={{ transitionDelay: isRevealed ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

/** Poster-first YouTube presentation; clicking the play affordance swaps the
 * poster for the embed inside the same rounded container. */
function EventVideo({ video }: { video: NonNullable<ShowChapter["video"]> }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border sm:aspect-[1232/512] sm:rounded-3xl">
      {playing ? (
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="size-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
          title={`${video.badge} video`}
        />
      ) : (
        <>
          <img
            alt={video.posterAlt}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            src={video.poster}
          />
          <Badge className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6">
            {video.badge}
          </Badge>
          <div className="absolute inset-0 grid place-items-center">
            <IconButton
              aria-label={`Play ${video.badge} video`}
              onClick={() => setPlaying(true)}
              size="lg"
              variant="secondary"
            >
              <Play weight="fill" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}

/** One edition card: a stateful photo carousel over date, title, description
 * and the press-release button. */
function EventCard({ edition }: { edition: ShowEdition }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = edition.photos.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  return (
    <Card padding={false} className="gap-0 p-4">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-2/1 overflow-hidden rounded-2xl border border-border">
          <img
            alt={`${edition.title} — ${index + 1} of ${count}`}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            src={edition.photos[index]}
          />
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <IconButton
              aria-label={`Previous ${edition.title} photo`}
              onClick={() => go(index - 1)}
              variant="secondary"
            >
              <ArrowLeft />
            </IconButton>
            <IconButton
              aria-label={`Next ${edition.title} photo`}
              onClick={() => go(index + 1)}
              variant="secondary"
            >
              <ArrowRight />
            </IconButton>
          </div>
        </div>
        <CarouselProgress
          aria-label={`${edition.title} photos`}
          className="justify-center"
        >
          {edition.photos.map((photo, photoIndex) => (
            <CarouselProgressItem
              active={photoIndex === index}
              key={photo}
              label={`${edition.title} photo ${photoIndex + 1}`}
              onClick={() => go(photoIndex)}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </CarouselProgress>
      </div>
      <div className="flex flex-col gap-4 p-2 pt-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-secondary-foreground text-sm leading-5">
            {edition.date}
          </p>
          <h4 className="font-semibold text-lg leading-7 sm:text-xl">
            {edition.title}
          </h4>
          <p className="text-base leading-6">{edition.description}</p>
        </div>
        <Button
          className="self-start"
          render={<a href={edition.pressRelease} />}
          size="md"
          trailing={<ArrowRight />}
          variant="secondary"
        >
          Press Release
        </Button>
      </div>
    </Card>
  );
}

/** True below the `sm` breakpoint so the tab bar can drop to its `sm`
 * size — the `md` track clips "Chinese Mainland" on a 360px viewport. */
function useNarrowViewport() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return narrow;
}

/** The sticky pill tab list — jump navigation over the stacked chapters. */
function ChapterTabs({
  chapters,
  value,
  onValueChange,
}: {
  chapters: readonly ShowChapter[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const narrow = useNarrowViewport();
  return (
    <Tabs
      className="sticky top-4 z-10"
      onValueChange={onValueChange}
      value={value}
    >
      <TabsList
        aria-label="Event format chapters"
        className="mx-auto max-w-full overflow-x-auto"
        size={narrow ? "sm" : "md"}
        variant="pill"
      >
        {chapters.map((chapter) => (
          <TabsTrigger
            key={chapter.id}
            nativeButton={false}
            render={<a href={`#${chapter.id}`} />}
            value={chapter.id}
          >
            {chapter.tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function ChapterSection({ chapter }: { chapter: ShowChapter }) {
  return (
    <section
      aria-labelledby={`shows-chapter-${chapter.id}`}
      className="flex flex-col gap-8 scroll-mt-24"
      id={chapter.id}
    >
      <Reveal>
        <div className="flex flex-col items-start gap-6 sm:grid sm:grid-cols-2 sm:gap-8">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-1 font-medium text-secondary-foreground text-sm leading-5 uppercase">
              <MapPin aria-hidden size={14} />
              {chapter.label}
            </p>
            <h3
              className="font-semibold text-xl leading-7 sm:text-4xl sm:leading-10"
              id={`shows-chapter-${chapter.id}`}
            >
              {chapter.title}
            </h3>
            <p className="text-base leading-6 text-balance sm:text-lg sm:leading-7">
              {chapter.dek}
            </p>
          </div>
          {chapter.pressRelease ? (
            <Button
              className="shrink-0 sm:self-end sm:justify-self-end"
              render={<a href={chapter.pressRelease} />}
              trailing={<ArrowRight />}
              variant="ghost"
            >
              Press Release
            </Button>
          ) : null}
        </div>
      </Reveal>
      <Reveal delayMs={60}>
        {chapter.video ? <EventVideo video={chapter.video} /> : null}
        {chapter.image ? (
          <figure className="flex flex-col gap-3">
            <img
              alt={chapter.image.alt}
              className="aspect-video w-full rounded-2xl border border-border object-cover sm:aspect-[1232/616] sm:rounded-3xl"
              loading="lazy"
              src={chapter.image.src}
            />
            <figcaption className="text-secondary-foreground text-sm leading-5">
              {chapter.image.caption}
            </figcaption>
          </figure>
        ) : null}
      </Reveal>
      {chapter.editions.length ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {chapter.editions.map((edition, editionIndex) => (
            <Reveal delayMs={120 + editionIndex * 60} key={edition.title}>
              <EventCard edition={edition} />
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}

/**
 * The `/shows` surface as the app assembles it: `SiteHeader`, the Figma
 * Shows frame composed from design-system primitives, and `Footer`. The tab
 * list is jump navigation — all three chapters stay mounted and selecting a
 * tab scrolls its chapter into view.
 */
function ShowsPage() {
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [chapter, setChapter] = useState(SHOWS_PAGE.formats.chapters[0].id);

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

  // Scroll-spy: the chapter crossing the middle band owns the active tab.
  useEffect(() => {
    if (reduceMotion) return;
    const nodes = SHOWS_PAGE.formats.chapters
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
  }, [reduceMotion]);

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

  const { hero, eventScale, formats, records } = SHOWS_PAGE;

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
        {/* Hero */}
        <section
          aria-labelledby="shows-heading"
          className="mx-auto grid w-full max-w-[1280px] gap-12 px-5 py-10 sm:grid-cols-[2fr_1fr] sm:gap-24 sm:px-6 sm:py-20"
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
              <Button render={<a href="#shows-formats" />}>
                {hero.explore}
              </Button>
              <Button render={<a href={hero.pressHref} />} variant="outline">
                {hero.press}
              </Button>
            </div>
          </div>
          <Card
            className={cn(REVEAL, "gap-0 self-end", pageIsRevealed && REVEALED)}
            padding={false}
            style={{
              transitionDelay: pageIsRevealed ? "120ms" : "0ms",
            }}
          >
            <p className="px-6 pt-6 font-medium text-secondary-foreground text-sm leading-5 uppercase">
              {hero.latestLabel}
            </p>
            <ul>
              {hero.latestShows.map((show) => (
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
        </section>

        {/* Event scale */}
        <section aria-labelledby="shows-scale-heading" className="bg-muted">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-12 sm:px-6 sm:py-20">
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
          className="mx-auto flex w-full max-w-[1280px] scroll-mt-4 flex-col gap-12 px-5 py-14 sm:gap-20 sm:px-6 sm:py-28"
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
          <ChapterTabs
            chapters={formats.chapters}
            onValueChange={onTabChange}
            value={chapter}
          />
          {formats.chapters.map((chapterItem) => (
            <ChapterSection chapter={chapterItem} key={chapterItem.id} />
          ))}
        </section>

        {/* Event records */}
        <section aria-labelledby="shows-records-heading" className="bg-muted">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-12 sm:px-6 sm:py-20">
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
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { ShowsPage };
