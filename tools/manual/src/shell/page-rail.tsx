import { use } from "react";
import {
  MIN_SECTIONS,
  PageSectionsContext,
  SectionLinks,
} from "./page-sections";

/**
 * Where you are in a long page. Read from the rendered headings rather than
 * from the page's blocks, so the sections the app adds itself — the archive,
 * what is in flight — are listed on the same terms as the ones an author wrote.
 */
export function PageRail() {
  const { sections, active } = use(PageSectionsContext);

  if (sections.length < MIN_SECTIONS) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block" aria-label="On this page">
      <nav className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto py-1">
        <p className="mb-2 font-medium text-secondary-foreground text-xs uppercase tracking-wide">
          On this page
        </p>
        <SectionLinks active={active} sections={sections} />
      </nav>
    </aside>
  );
}
