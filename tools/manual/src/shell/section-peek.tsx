import { use } from "react";
import { PageSectionsContext, SectionLinks } from "./page-sections";

/**
 * The page's contents while the rail is folded: a strip at the left edge,
 * one dash per section, that opens the full list under the pointer. The list
 * is a child of the strip, so moving onto it keeps it open.
 */
export function SectionPeek() {
  const { sections, active } = use(PageSectionsContext);
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="group/peek fixed top-16 bottom-0 left-0 z-30 w-6 max-lg:hidden"
    >
      <ul aria-hidden className="mt-24 flex flex-col items-start gap-2 pl-2">
        {sections.map((section) => (
          <li
            className={`h-0.5 rounded-full ${section.level === 3 ? "w-2" : "w-3"} ${
              section.id === active ? "bg-foreground" : "bg-border-strong"
            }`}
            key={section.id}
          />
        ))}
      </ul>
      <div className="invisible absolute top-20 left-2 max-h-[calc(100%-6rem)] w-64 overflow-y-auto overscroll-contain rounded-(--radius-xl) border border-border bg-popover p-3 opacity-0 shadow-lg transition-[opacity,visibility] duration-150 group-hover/peek:visible group-hover/peek:opacity-100 group-hover/peek:delay-100 motion-reduce:transition-none">
        <SectionLinks active={active} sections={sections} />
      </div>
    </nav>
  );
}
