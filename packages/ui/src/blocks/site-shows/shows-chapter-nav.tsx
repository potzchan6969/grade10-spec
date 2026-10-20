import { cn } from "@grade10/design-system/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ShowChapter } from "./types";

type ShowsChapterNavProps = {
  chapters: readonly ShowChapter[];
  /** The id of the chapter on screen. */
  value: string;
  onSelect: (value: string) => void;
};

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

/** The sticky pill list — jump navigation over the stacked chapters,
 * drawn with the same pill track as the Tabs primitive but built from
 * real links: every entry navigates to its chapter's hash anchor, and
 * `aria-current` marks the chapter on screen. */
function ShowsChapterNav({ chapters, value, onSelect }: ShowsChapterNavProps) {
  const narrow = useNarrowViewport();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const didMoveRef = useRef(false);

  // The same sliding pill `TabsList` draws behind its active trigger,
  // measured off the link marked `data-active`. It animates on chapter
  // change and snaps on mount and resize; reduced motion always snaps.
  const moveIndicator = useCallback((animate: boolean) => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const active = list.querySelector<HTMLElement>("[data-active]");
    if (!active) {
      indicator.style.opacity = "0";
      return;
    }
    const paint = () => {
      indicator.style.opacity = "1";
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = `${active.offsetHeight}px`;
    };
    if (animate) {
      paint();
      return;
    }
    indicator.style.transition = "none";
    paint();
    void indicator.offsetWidth;
    indicator.style.transition = "";
  }, []);

  useLayoutEffect(() => {
    // `value` and `narrow` rebind the measured anchor and its size.
    void value;
    void narrow;
    moveIndicator(didMoveRef.current && !reduceMotion);
    didMoveRef.current = true;
  }, [value, narrow, reduceMotion, moveIndicator]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const resize = new ResizeObserver(() => moveIndicator(false));
    resize.observe(list);
    return () => resize.disconnect();
  }, [moveIndicator]);

  return (
    <nav aria-label="Event format chapters" className="sticky top-4 z-10">
      <ul
        ref={listRef}
        className={cn(
          "relative mx-auto flex w-fit max-w-full items-center gap-0.5 rounded-(--radius-full) bg-muted p-0.5",
          narrow ? "h-9" : "h-11",
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute top-0.5 left-0 z-0 rounded-(--radius-full) bg-background opacity-0 shadow-[0_8px_16px_var(--shadow-color,rgb(117_114_111_/_20%))] transition-[transform,width,height] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,width,height] motion-reduce:transition-none!"
          ref={indicatorRef}
        />
        {chapters.map((chapter) => {
          const active = chapter.id === value;
          return (
            <li className="flex" key={chapter.id}>
              <a
                aria-current={active ? "location" : undefined}
                className={cn(
                  "relative z-[1] inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-(--radius-full) border border-transparent font-medium whitespace-nowrap text-foreground transition-[background-color,color] duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  narrow ? "h-8 gap-1 px-3 text-xs" : "h-10 px-4 text-sm",
                  active ? "" : "hover:bg-background-subtle",
                )}
                data-active={active ? "" : undefined}
                href={`#${chapter.id}`}
                onClick={() => onSelect(chapter.id)}
              >
                {chapter.tab}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { ShowsChapterNav, type ShowsChapterNavProps };
