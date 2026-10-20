import { cn } from "@grade10/design-system/lib/utils";
import { Fragment } from "react";
import { keyDeduper } from "./press-article-keys";
import type { ArticleSegment } from "./types";

// Inline links bind the frame's `Custom/primary-border` (#C4903D, the
// `orange-400` shared by `Base/accent-foreground`) at regular weight with a
// resting underline. The `Link` primitive is `inline-flex` and cannot wrap
// mid-sentence, so these stay plain anchors.
const INLINE_LINK =
  "text-accent-foreground underline decoration-from-font [text-underline-position:from-font]";

type PressArticleSegmentsProps = {
  segments: readonly ArticleSegment[];
};

function PressArticleSegments({ segments }: PressArticleSegmentsProps) {
  const dedupe = keyDeduper();
  return (
    <>
      {segments.map((segment) =>
        segment.link ? (
          <a
            className={cn(INLINE_LINK, segment.bold && "font-semibold")}
            href={segment.link.href}
            key={dedupe(segment.text)}
            rel={segment.link.external ? "noopener noreferrer" : undefined}
            target={segment.link.external ? "_blank" : undefined}
          >
            {segment.text}
          </a>
        ) : segment.bold ? (
          <strong className="font-semibold" key={dedupe(segment.text)}>
            {segment.text}
          </strong>
        ) : (
          <Fragment key={dedupe(segment.text)}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

export { PressArticleSegments, type PressArticleSegmentsProps };
