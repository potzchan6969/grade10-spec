import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { slugify } from "../api/paths";
import type { DetailBlock } from "../content/grammar";
import { AnchorLink, useHashTarget } from "./anchor";
import { BlockView } from "./block-view";

/**
 * Depth for one audience. Collapsed, never removed: the body stays in the DOM
 * so a deep link, a find-in-page and the index all still reach it.
 */
export function DetailBlockView({ block }: { block: DetailBlock }) {
  const id = `detail-${slugify(block.title)}`;
  const targeted = useHashTarget(id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (targeted) setOpen(true);
  }, [targeted]);

  return (
    <section
      className="group/anchor my-6 scroll-mt-24 overflow-hidden rounded-(--radius-2xl) border border-border bg-background-subtle"
      id={id}
    >
      <div className="flex items-center gap-1 pr-2">
        <button
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 px-4 py-3 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => setOpen((on) => !on)}
          type="button"
        >
          <span
            className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${open ? "rotate-90" : ""}`}
          >
            <CaretRight aria-hidden size={14} weight="bold" />
          </span>
          <Text as="span" className="min-w-0 flex-1" size="sm" weight="medium">
            {block.title}
          </Text>
          {block.for ? (
            <Badge size="sm" variant="outline">
              for {block.for}
            </Badge>
          ) : null}
        </button>
        <AnchorLink id={id} label="Copy link to this detail" />
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="border-border-subtle border-t px-4 py-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {block.body.map((item, position) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
              <BlockView block={item} key={`${item.type}-${position}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
