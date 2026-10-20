import { Card } from "@grade10/design-system/components/display/card";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { MediaCoverageCopy, MediaItem } from "./types";

type MediaCoverageCardProps = {
  item: MediaItem;
  copy: MediaCoverageCopy;
};

/**
 * One media card: the whole card is the external link. The frame's Card
 * instance is restyled past the published set — `radius-3xl`, `gap-6`
 * padding, `size-56` minimum height, and `border-strong` with a soft
 * shadow and lift on hover — quick in, springy on the return — so the
 * overrides live here until design settles the contract. Every card holds one height: the publication truncates
 * to one line and the title clamps — three lines on small viewports,
 * four at `sm` — so a longer CMS entry ends in an ellipsis rather than
 * a taller card. Small viewports slim the card: `p-5`, `min-h-48`, and
 * a `text-base` title.
 */
function MediaCoverageCard({ item, copy }: MediaCoverageCardProps) {
  return (
    <a
      className="block h-full"
      href={item.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Card
        className="h-full min-h-48 rounded-3xl motion-safe:[transition:translate_350ms_cubic-bezier(0.34,1.36,0.64,1),border-color_250ms_cubic-bezier(0.22,1,0.36,1),box-shadow_250ms_cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_4px_16px_-4px_var(--shadow-color)] motion-safe:hover:[transition:translate_200ms_cubic-bezier(0.22,1,0.36,1),border-color_250ms_cubic-bezier(0.22,1,0.36,1),box-shadow_250ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:hover:translate-y-0 sm:min-h-56"
        padding={false}
      >
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-1 flex-col gap-2">
            <p className="truncate font-medium text-secondary-foreground text-xs uppercase leading-4">
              {item.publication}
            </p>
            <p className="line-clamp-3 font-medium text-card-foreground text-base leading-6 sm:line-clamp-4 sm:text-lg sm:leading-7">
              {item.title}
            </p>
          </div>
          <div className="flex items-center justify-between text-primary">
            <p className="font-medium text-accent-foreground text-sm leading-5">
              {copy.readArticle}
            </p>
            <ArrowUpRight aria-hidden size={14} />
          </div>
        </div>
      </Card>
    </a>
  );
}

export { MediaCoverageCard, type MediaCoverageCardProps };
