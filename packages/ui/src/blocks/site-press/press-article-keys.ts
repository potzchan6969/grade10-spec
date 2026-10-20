import type { ArticleBlock } from "./types";

/**
 * Yields a unique key for repeated identical content — repeated segments,
 * items or blocks get a `#n` suffix so CMS copy that repeats itself still
 * reconciles cleanly.
 */
function keyDeduper(): (base: string) => string {
  const seen = new Map<string, number>();
  return (base) => {
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}#${count}`;
  };
}

/** A stable key for a body block, derived from its content. */
function pressArticleBlockKey(block: ArticleBlock): string {
  switch (block.type) {
    case "paragraph":
      return `p-${block.segments.map((segment) => segment.text).join("")}`;
    case "heading":
      return `h-${block.text}`;
    case "list":
      return `l-${block.items
        .map((item) => item.map((segment) => segment.text).join(""))
        .join("")}`;
    case "quote":
      return `q-${block.cite.name}`;
    case "figure":
      return `f-${block.figure.src}`;
    case "gallery":
      return `g-${block.figures.map((figure) => figure.src).join("")}`;
  }
}

export { keyDeduper, pressArticleBlockKey };
