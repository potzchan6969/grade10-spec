import { Text } from "@grade10/design-system/components/display/text";
import { ImageBroken } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import type { ImageBlock } from "../content/grammar";
import { useInlineSvg } from "./inline-svg";

const FRAME =
  "w-full rounded-(--radius-2xl) border border-border bg-background-subtle";

export function ImageBlockView({ block }: { block: ImageBlock }) {
  return (
    <figure className="my-6">
      {block.src.endsWith(".svg") ? (
        <InlineSvg block={block} />
      ) : (
        <Bitmap block={block} />
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

function Bitmap({ block }: { block: ImageBlock }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <Broken block={block} />;
  return (
    <img
      alt={block.alt}
      className={FRAME}
      loading="lazy"
      onError={() => setBroken(true)}
      src={`/${block.src.replace(/^\/+/, "")}`}
    />
  );
}

/** An SVG is mounted as live DOM rather than an `<img>`, so a diagram's own
 * styles follow the page's theme. */
function InlineSvg({ block }: { block: ImageBlock }) {
  const { host, state } = useInlineSvg(block.src);
  return (
    <>
      <div
        aria-label={block.alt}
        className={state.status === "ready" ? `${FRAME} px-4 py-4` : "hidden"}
        ref={host}
        role="img"
      />
      {state.status === "unavailable" ? <Broken block={block} /> : null}
    </>
  );
}

function Broken({ block }: { block: ImageBlock }): ReactNode {
  return (
    <div className="flex items-center gap-2 rounded-(--radius-2xl) border border-warning-border border-dashed bg-background-subtle px-4 py-6">
      <span className="inline-flex text-warning-foreground">
        <ImageBroken aria-hidden size={20} />
      </span>
      <Text as="span" size="sm" tone="secondary">
        {block.src} did not load. {block.alt}
      </Text>
    </div>
  );
}
