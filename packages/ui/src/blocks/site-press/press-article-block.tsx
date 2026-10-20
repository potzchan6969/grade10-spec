import { cn } from "@grade10/design-system/lib/utils";
import { PressArticleFigure } from "./press-article-figure";
import { keyDeduper } from "./press-article-keys";
import { PressArticleSegments } from "./press-article-segments";
import type { ArticleBlock } from "./types";

const HEADING_CLASSES = {
  2: "text-2xl leading-8 sm:text-3xl sm:leading-9",
  3: "text-xl leading-7 sm:text-2xl sm:leading-8",
  4: "text-lg leading-7 sm:text-xl sm:leading-7",
  5: "text-base leading-6 sm:text-lg sm:leading-7",
  6: "text-sm leading-5 sm:text-base sm:leading-6",
} as const;

type PressArticleBlockProps = {
  block: ArticleBlock;
};

/** One body element an editor composes, drawn in the template's style. */
function PressArticleBlock({ block }: PressArticleBlockProps) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-base leading-7 sm:text-lg">
          <PressArticleSegments segments={block.segments} />
        </p>
      );
    case "heading": {
      const Tag = `h${block.level}` as "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag className={cn("pt-8 font-semibold", HEADING_CLASSES[block.level])}>
          {block.text}
        </Tag>
      );
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      const dedupe = keyDeduper();
      return (
        <Tag
          className={cn(
            "flex flex-col gap-4 ps-7 text-base leading-7 sm:text-lg",
            block.ordered ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item) => (
            <li key={dedupe(item.map((segment) => segment.text).join(""))}>
              <PressArticleSegments segments={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className="flex flex-col gap-4 border-primary-border border-l-2 py-2 ps-6 sm:pe-20">
          <p className="text-base leading-7 sm:text-lg">
            <PressArticleSegments segments={block.segments} />
          </p>
          <footer className="text-base leading-6">
            <span className="font-semibold">{block.cite.name}</span>
            {block.cite.role ? `, ${block.cite.role}` : null}
          </footer>
        </blockquote>
      );
    case "figure":
      return <PressArticleFigure figure={block.figure} />;
    case "gallery":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {block.figures.map((figure) => (
            <PressArticleFigure
              className={figure.span !== "half" ? "sm:col-span-2" : undefined}
              figure={figure}
              key={figure.src}
            />
          ))}
        </div>
      );
  }
}

export { PressArticleBlock, type PressArticleBlockProps };
