import { cn } from "@grade10/design-system/lib/utils";
import type { ArticleFigure } from "./types";

type PressArticleFigureProps = {
  figure: ArticleFigure;
  className?: string;
};

function PressArticleFigure({ figure, className }: PressArticleFigureProps) {
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

export { PressArticleFigure, type PressArticleFigureProps };
