import { Text } from "@grade10/design-system/components/display/text";
import { GitBranch, Info, Warning } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { warningSignature } from "../api/derive";
import type { CalloutBlock, CalloutKind } from "../content/grammar";
import { useBlockScopeMaybe } from "./block-scope";
import { BlockView } from "./block-view";

/**
 * Three kinds, three hues, no two of them the brand's. `decision` wears the gold
 * accent because a decision is the product speaking; `warning` is the manual
 * saying the store is wrong about itself, and earns the caution red and a bar
 * down its edge; `note` stays the quiet blue aside.
 */
const STYLES: Record<
  CalloutKind,
  { label: string; icon: ReactNode; shell: string; head: string }
> = {
  note: {
    label: "Note",
    icon: <Info aria-hidden size={16} weight="fill" />,
    shell: "border-info/40 bg-info/8",
    head: "text-info",
  },
  decision: {
    label: "Decision",
    icon: <GitBranch aria-hidden size={16} weight="bold" />,
    shell: "border-primary-border bg-primary-muted",
    head: "text-primary-muted-foreground",
  },
  warning: {
    label: "Warning",
    icon: <Warning aria-hidden size={16} weight="fill" />,
    shell:
      "border-destructive-border border-l-4 border-l-destructive bg-destructive-muted",
    head: "text-destructive",
  },
};

export function CalloutBlockView({ block }: { block: CalloutBlock }) {
  const style = STYLES[block.kind];
  const scope = useBlockScopeMaybe();
  const page = scope?.index.pageByPath.get(scope.pagePath);
  // A warning wears a signature: its own attributes when someone signed it by
  // hand, otherwise the one the build derived from git.
  const derived =
    block.kind === "warning" && !(block.author && block.date) && page
      ? warningSignature(page, block)
      : undefined;
  const author = block.author ?? derived?.author;
  const date = block.date ?? derived?.date;

  return (
    <aside
      className={`my-6 rounded-(--radius-2xl) border px-4 py-3 ${style.shell}`}
    >
      <div className={`flex items-center gap-2 ${style.head}`}>
        {style.icon}
        <Text
          as="span"
          className="uppercase tracking-wide"
          size="xs"
          weight="bold"
        >
          {style.label}
        </Text>
        {author || date ? (
          <Text as="span" className="ml-auto" size="xs" tone="secondary">
            {author ? <span className="font-mono">{author}</span> : null}
            {author && date ? " · " : ""}
            {date ?? ""}
          </Text>
        ) : null}
      </div>
      <div className="mt-1.5 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {block.body.map((item, position) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
          <BlockView block={item} key={`${item.type}-${position}`} />
        ))}
      </div>
    </aside>
  );
}
