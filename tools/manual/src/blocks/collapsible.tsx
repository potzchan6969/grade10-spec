import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { AnchorLink, useHashTarget } from "./anchor";

/**
 * A title that opens what it holds, on click and on a deep link to it or into
 * it. Collapsed, never removed: the body stays in the DOM so a deep link, a
 * find-in-page and the index all still reach it.
 *
 * A `card` wears a border, for depth that is part of the page. A `ghost` is
 * the bare toggle, for a body that already carries its own frame.
 *
 * `defaultOpen` is for a body the page is incomplete without: it still folds
 * away, but the reader is not asked to ask for it.
 */
export function Collapsible({
  id,
  targets = [],
  title,
  badge,
  linkLabel,
  variant = "card",
  defaultOpen = false,
  children,
}: {
  id: string;
  /** Ids inside the body: a deep link to one of them opens the section too. */
  targets?: string[];
  title: string;
  badge?: ReactNode;
  linkLabel: string;
  variant?: "card" | "ghost";
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const ghost = variant === "ghost";
  const targeted = useHashTarget(id, ...targets);
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (targeted) setOpen(true);
  }, [targeted]);

  return (
    <section
      className={`group/anchor my-6 scroll-mt-24 ${
        ghost
          ? ""
          : "overflow-hidden rounded-(--radius-2xl) border border-border bg-background-subtle"
      }`}
      id={id}
    >
      <div className={`flex items-center gap-1 ${ghost ? "" : "pr-2"}`}>
        <button
          aria-expanded={open}
          className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 ${
            ghost ? "-mx-2 rounded-(--radius-lg) px-2 py-1.5" : "px-4 py-3"
          }`}
          onClick={() => setOpen((on) => !on)}
          type="button"
        >
          <span
            className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${open ? "rotate-90" : ""}`}
          >
            <CaretRight aria-hidden size={14} weight="bold" />
          </span>
          <Text
            as="span"
            className={ghost ? "min-w-0" : "min-w-0 flex-1"}
            size="sm"
            tone={ghost ? "secondary" : undefined}
            weight="medium"
          >
            {title}
          </Text>
          {badge}
        </button>
        <AnchorLink id={id} label={linkLabel} />
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          {children}
        </div>
      </div>
    </section>
  );
}
