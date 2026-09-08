import { Badge } from "@grade10/design-system/components/display/badge";
import { slugify } from "../api/paths";
import type { DetailBlock } from "../content/grammar";
import { BlockView } from "./block-view";
import { Collapsible } from "./collapsible";

/** Depth for one audience, collapsed until asked for. */
export function DetailBlockView({ block }: { block: DetailBlock }) {
  const id = `detail-${slugify(block.title)}`;
  return (
    <Collapsible
      badge={
        block.for ? (
          <Badge size="sm" variant="outline">
            for {block.for}
          </Badge>
        ) : null
      }
      id={id}
      linkLabel="Copy link to this detail"
      title={block.title}
    >
      <div className="border-border-subtle border-t px-4 py-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {block.body.map((item, position) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
          <BlockView block={item} key={`${item.type}-${position}`} />
        ))}
      </div>
    </Collapsible>
  );
}
