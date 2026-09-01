import { Text } from "@grade10/design-system/components/display/text";
import { useEffect, useState } from "react";
import { BlockView } from "../blocks/block-view";
import { TextArea } from "./fields";

/** Markdown on the left, the page's own renderer on the right. The preview
 * lags the keystroke on purpose — it re-renders the real block. */

const PREVIEW_DELAY = 200;

export function ProseEditor({
  markdown,
  onChange,
  problem,
}: {
  markdown: string;
  onChange: (next: string) => void;
  problem?: string;
}) {
  const [preview, setPreview] = useState(markdown);

  useEffect(() => {
    const timer = setTimeout(() => setPreview(markdown), PREVIEW_DELAY);
    return () => clearTimeout(timer);
  }, [markdown]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TextArea
        label="Markdown"
        onChange={onChange}
        problem={problem}
        rows={10}
        value={markdown}
      />
      <div className="flex min-w-0 flex-col gap-2">
        <Text as="span" className="font-medium" size="sm" tone="secondary">
          Preview
        </Text>
        <div className="min-w-0 rounded-(--radius-2xl) border border-border-subtle bg-background-subtle px-4 py-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {preview.trim() === "" ? (
            <Text as="p" className="py-3" size="sm" tone="secondary">
              Empty — this block is dropped when the page is saved.
            </Text>
          ) : (
            <BlockView block={{ type: "prose", markdown: preview }} />
          )}
        </div>
      </div>
    </div>
  );
}
