import { ArrowRight } from "@phosphor-icons/react";
import type { PressItem } from "./types";

type PressReleaseListItemProps = {
  item: PressItem;
};

/** One press release: the whole row is the link to its article. */
function PressReleaseListItem({ item }: PressReleaseListItemProps) {
  return (
    <a
      className="group flex flex-col gap-2 border-border border-b px-4 py-6 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-muted sm:grid sm:grid-cols-[160px_minmax(0,1fr)_160px] sm:gap-x-8"
      href={item.href}
    >
      <span className="self-start font-medium text-secondary-foreground text-sm leading-6 sm:leading-7">
        {item.date}
      </span>
      <span className="font-medium text-base leading-6 sm:text-xl sm:leading-7">
        {item.title}
      </span>
      <span className="hidden h-6 min-w-7 items-center justify-center justify-self-end text-secondary-foreground transition-[padding,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:pr-0 sm:flex sm:h-7 sm:pr-3">
        <ArrowRight aria-hidden size={16} />
      </span>
    </a>
  );
}

export { PressReleaseListItem, type PressReleaseListItemProps };
