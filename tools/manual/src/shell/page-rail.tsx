import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { seekFrames } from "../blocks/seek";

/** A page's own sections, read from what it actually rendered: H2s, and the
 * H3s under them one step in. */
export type RailSection = { id: string; title: string; level: 2 | 3 };

/** Below this many sections a rail is noise — the page already reads as one. */
const MIN_SECTIONS = 3;

/** How far under the sticky header a heading counts as the one being read. */
const ACTIVE_LINE = 120;

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

function scan(): RailSection[] {
  const found: RailSection[] = [];
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
function useSections(ready: boolean): RailSection[] {
  const { pathname, search } = useLocation();
  const [sections, setSections] = useState<RailSection[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname and search are triggers, not reads — a new page or tab has new headings to find.
  useEffect(() => {
    setSections([]);
    if (!ready) return;
    return seekFrames<RailSection[]>(() => {
      const found = scan();
      return found.length > 0 ? found : null;
    }, setSections);
  }, [pathname, search, ready]);

  return sections;
}

function useActive(sections: RailSection[]): string | undefined {
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

/**
 * Where you are in a long page. Read from the rendered headings rather than
 * from the page's blocks, so the sections the app adds itself — the archive,
 * what is in flight — are listed on the same terms as the ones an author wrote.
 */
export function PageRail({ ready }: { ready: boolean }) {
  const sections = useSections(ready);
  const active = useActive(sections);

  if (sections.length < MIN_SECTIONS) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block" aria-label="On this page">
      <nav className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto py-1">
        <p className="mb-2 font-medium text-secondary-foreground text-xs uppercase tracking-wide">
          On this page
        </p>
        <ul className="space-y-px border-border-subtle border-l">
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
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
