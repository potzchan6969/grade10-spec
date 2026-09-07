import { cn } from "@grade10/design-system/lib/utils";
import { createContext, type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { seekFrames } from "../blocks/seek";

/** A page's own sections, read from what it actually rendered: H2s, and the
 * H3s under them one step in. */
export type PageSection = { id: string; title: string; level: 2 | 3 };

/** Below this many sections a list of them is noise — the page already reads
 * as one. */
export const MIN_SECTIONS = 3;

/** How far under the sticky header a heading counts as the one being read. */
const ACTIVE_LINE = 120;

/** The page's sections and the one being read, scanned once for every surface
 * that lists them. */
export type PageSections = { sections: PageSection[]; active?: string };

/**
 * The section the reader is in: the last heading that has passed the line, or
 * the first one while the page is still above all of them.
 */
export function activeSection(tops: number[], line = ACTIVE_LINE): number {
  let active = 0;
  for (let at = 0; at < tops.length; at += 1) {
    if (tops[at] - line <= 1) active = at;
  }
  return active;
}

function scan(): PageSection[] {
  const found: PageSection[] = [];
  for (const heading of document.querySelectorAll<HTMLElement>(
    "main h2[id], main h3[id]",
  )) {
    const title = (heading.textContent ?? "").trim();
    if (title === "") continue;
    found.push({
      id: heading.id,
      title,
      level: heading.tagName === "H3" ? 3 : 2,
    });
  }
  return found;
}

/**
 * The page's headings, once they exist. The snapshot lands after first paint, so
 * the first look finds an empty page — this keeps looking until it does not.
 * The search is a trigger too: a change page keeps its open tab there, and
 * each tab is a different set of headings.
 */
function useSections(ready: boolean): PageSection[] {
  const { pathname, search } = useLocation();
  const [sections, setSections] = useState<PageSection[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname and search are triggers, not reads — a new page or tab has new headings to find.
  useEffect(() => {
    setSections([]);
    if (!ready) return;
    return seekFrames<PageSection[]>(() => {
      const found = scan();
      return found.length > 0 ? found : null;
    }, setSections);
  }, [pathname, search, ready]);

  return sections;
}

function useActive(sections: PageSection[]): string | undefined {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (sections.length === 0) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const tops = sections.map(
        (section) =>
          document.getElementById(section.id)?.getBoundingClientRect().top ??
          Number.POSITIVE_INFINITY,
      );
      setActive(activeSection(tops));
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return sections[active]?.id;
}

/** One scan and one scroll-spy for the whole shell, so the nav and the column
 * beside the page can never disagree about where the reader is. */
function usePageSections(ready: boolean): PageSections {
  const sections = useSections(ready);
  const active = useActive(sections);
  return { sections, active };
}

/** What the nav lists under the row of the page being read: its H2s, and
 * nothing at all where there are too few to be worth a level. */
export function navSections(sections: PageSection[]): PageSection[] {
  const tops = sections.filter((section) => section.level === 2);
  return tops.length < MIN_SECTIONS ? [] : tops;
}

export const PageSectionsContext = createContext<PageSections>({
  sections: [],
});

/** Holds the scan and the scroll-spy in a component of its own, so a change
 * of section re-renders the surfaces that list sections and never the page
 * being read — a shell holding this state would re-render both. */
export function PageSectionsProvider({
  ready,
  children,
}: {
  ready: boolean;
  children: ReactNode;
}) {
  return (
    <PageSectionsContext value={usePageSections(ready)}>
      {children}
    </PageSectionsContext>
  );
}

/** The anchors themselves, written once for both surfaces that list them. */
export function SectionLinks({
  sections,
  active,
  onNavigate,
  className,
}: PageSections & { onNavigate?: () => void; className?: string }) {
  return (
    <ul className={cn("space-y-px border-border-subtle border-l", className)}>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            aria-current={section.id === active ? "location" : undefined}
            className={`-ml-px block border-l py-1 text-xs leading-snug transition-colors ${section.level === 3 ? "pl-6" : "pl-3"} ${
              section.id === active
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-secondary-foreground hover:border-border-strong hover:text-foreground"
            }`}
            href={`#${section.id}`}
            onClick={onNavigate}
          >
            {section.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
