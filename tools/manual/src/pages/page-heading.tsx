import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretRight } from "@phosphor-icons/react";
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { type PageSection, PageSectionsContext } from "../shell/page-sections";

/** The site header's height: the line the heading passes under. */
const HEADER_HEIGHT = 64;

type PageHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  summary?: string;
  children?: ReactNode;
};

export function PageHeading({
  eyebrow,
  title,
  summary,
  children,
}: PageHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const place = usePassed(ref);

  return (
    <header className="mb-8 border-border-subtle border-b pb-6" ref={ref}>
      {eyebrow ? (
        <div className="mb-2 font-medium text-secondary-foreground text-xs uppercase tracking-wide">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="font-heading font-bold text-foreground text-manual-h1 leading-tight">
        {title}
      </h1>
      {summary ? (
        <Text as="p" className="mt-3 max-w-[62ch]" size="lg" tone="secondary">
          {summary}
        </Text>
      ) : null}
      {children}
      <CompactHeading eyebrow={eyebrow} place={place} title={title} />
    </header>
  );
}

/** The site header's and the compact heading's heights together: the line a
 * section heading passes under to become the one being read. */
const BAR_LINE = HEADER_HEIGHT + 44;

type Place = {
  left: number;
  width: number;
  /** The H2 being read, and the H3 inside it where one has passed too. */
  section: string[];
} | null;

const same = (a: Place, b: Place) =>
  a !== null &&
  b !== null &&
  a.left === b.left &&
  a.width === b.width &&
  a.section.join("\n") === b.section.join("\n");

/** The section headings that have scrolled under the bar: the last H2, and
 * the last H3 after it. */
function passedSection(sections: PageSection[]): string[] {
  let h2 = "";
  let h3 = "";
  for (const section of sections) {
    const top = document
      .getElementById(section.id)
      ?.getBoundingClientRect().top;
    if (top === undefined) continue;
    if (top > BAR_LINE) break;
    if (section.level === 2) {
      h2 = section.title;
      h3 = "";
    } else h3 = section.title;
  }
  return [h2, h3].filter(Boolean);
}

/**
 * Where the heading's column is and the section being read, once the heading
 * has scrolled up under the site header; null while any of it still shows.
 */
function usePassed(ref: RefObject<HTMLElement | null>): Place {
  const { sections } = use(PageSectionsContext);
  const [place, setPlace] = useState<Place>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = header.getBoundingClientRect();
      const next: Place =
        box.bottom > HEADER_HEIGHT
          ? null
          : {
              left: box.left,
              width: box.width,
              section: passedSection(sections),
            };
      setPlace((last) => (same(last, next) ? last : next));
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(header);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, sections]);

  return place;
}

/** The heading in one line, with the section being read, held under the
 * site header over the heading's own column. The full heading is the page's
 * h1, so this one stays out of the accessibility tree. */
function CompactHeading({
  eyebrow,
  title,
  place,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  place: Place;
}) {
  const [last, setLast] = useState<Place>(place);
  if (place && place !== last) setLast(place);
  const at = place ?? last;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed top-16 z-20 flex h-11 items-center gap-2 border-border-subtle border-b bg-background/85 backdrop-blur transition-[opacity,translate] duration-150 motion-reduce:transition-none",
        place
          ? "translate-y-0 opacity-100"
          : "-translate-y-1 pointer-events-none invisible opacity-0",
      )}
      style={
        at ? ({ left: at.left, width: at.width } as CSSProperties) : undefined
      }
    >
      {eyebrow ? (
        <span className="shrink-0 font-medium text-secondary-foreground text-xs uppercase tracking-wide">
          {eyebrow}
        </span>
      ) : null}
      <span className="shrink-0 font-bold font-heading text-foreground text-manual-h4">
        {title}
      </span>
      {at?.section.map((name) => (
        <span className="flex min-w-0 items-center gap-2" key={name}>
          <CaretRight
            aria-hidden
            className="shrink-0 text-secondary-foreground"
            size={12}
          />
          <span className="truncate font-heading font-semibold text-manual-h4 text-secondary-foreground">
            {name}
          </span>
        </span>
      ))}
    </div>
  );
}
