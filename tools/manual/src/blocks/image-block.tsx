import { Text } from "@grade10/design-system/components/display/text";
import { ImageBroken } from "@phosphor-icons/react";
import { useState } from "react";
import type { ImageBlock } from "../content/grammar";

export function ImageBlockView({ block }: { block: ImageBlock }) {
  const [broken, setBroken] = useState(false);
  const src = `/${block.src.replace(/^\/+/, "")}`;

  return (
    <figure className="my-6">
      {broken ? (
        <div className="flex items-center gap-2 rounded-(--radius-2xl) border border-warning-border border-dashed bg-background-subtle px-4 py-6">
          <span className="inline-flex text-warning-foreground">
            <ImageBroken aria-hidden size={20} />
          </span>
          <Text as="span" size="sm" tone="secondary">
            {block.src} did not load. {block.alt}
          </Text>
        </div>
      ) : (
        <img
          alt={block.alt}
          className="w-full rounded-(--radius-2xl) border border-border bg-background-subtle"
          loading="lazy"
          onError={() => setBroken(true)}
          src={src}
        />
      )}
      {block.caption ? (
        <figcaption className="mt-2">
          <Text as="span" size="xs" tone="secondary">
            {block.caption}
          </Text>
        </figcaption>
      ) : null}
    </figure>
  );
}
