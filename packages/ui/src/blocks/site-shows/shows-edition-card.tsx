import { Card } from "@grade10/design-system/components/display/card";
import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import type { ShowEdition, ShowsPageBodyCopy } from "./types";

type ShowsEditionCardProps = {
  edition: ShowEdition;
  copy: ShowsPageBodyCopy;
};

/** One edition card: a stateful photo carousel over date, title, description
 * and the press-release button. */
function ShowsEditionCard({ edition, copy }: ShowsEditionCardProps) {
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
            alt={copy.photoAlt(edition.title, index + 1, count)}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            src={edition.photos[index]}
          />
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <IconButton
              aria-label={copy.previousPhoto(edition.title)}
              onClick={() => go(index - 1)}
              variant="secondary"
            >
              <ArrowLeft />
            </IconButton>
            <IconButton
              aria-label={copy.nextPhoto(edition.title)}
              onClick={() => go(index + 1)}
              variant="secondary"
            >
              <ArrowRight />
            </IconButton>
          </div>
        </div>
        <CarouselProgress
          aria-label={copy.photos(edition.title)}
          className="justify-center"
        >
          {edition.photos.map((photo, photoIndex) => (
            <CarouselProgressItem
              active={photoIndex === index}
              key={photo}
              label={copy.photo(edition.title, photoIndex + 1)}
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
          {copy.pressRelease}
        </Button>
      </div>
    </Card>
  );
}

export { ShowsEditionCard, type ShowsEditionCardProps };
