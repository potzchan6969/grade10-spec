import { Button } from "@grade10/design-system/components/forms/button";
import { ArrowRight, MapPin } from "@phosphor-icons/react";
import { ShowsEditionCard } from "./shows-edition-card";
import { ShowsEventVideo } from "./shows-event-video";
import { Reveal } from "./shows-reveal";
import type { ShowChapter, ShowsPageBodyCopy } from "./types";

type ShowsChapterSectionProps = {
  chapter: ShowChapter;
  copy: ShowsPageBodyCopy;
};

function ShowsChapterSection({ chapter, copy }: ShowsChapterSectionProps) {
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
              {copy.pressRelease}
            </Button>
          ) : null}
        </div>
      </Reveal>
      <Reveal delayMs={60}>
        {chapter.video ? (
          <ShowsEventVideo copy={copy} video={chapter.video} />
        ) : null}
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
              <ShowsEditionCard copy={copy} edition={edition} />
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export { ShowsChapterSection, type ShowsChapterSectionProps };
