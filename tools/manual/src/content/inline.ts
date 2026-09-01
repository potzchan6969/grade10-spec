/**
 * The inline slice of markdown, for the places the app shows store prose on a
 * clamped line: a change's title and its `why`. Pure and isomorphic like
 * `grammar.ts` — the renderer lives in `blocks/inline-markdown.tsx`, so a
 * summary card never drags the block markdown pipeline in behind it.
 *
 * A `why` is a whole section body, so it can hold a fenced block; the fence
 * collapses to code rather than leaking its backticks onto the card.
 */
export type InlineToken =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string }
  | { kind: "strong"; children: InlineToken[] }
  | { kind: "em"; children: InlineToken[] }
  | { kind: "link"; href: string; children: InlineToken[] };

// Order is precedence: escapes first, a fence before a span of code, `**`
// before `*`. Emphasis may not open or close on whitespace, and `_` only at
// word edges, so `a * b` and `snake_case_name` stay literal.
const INLINE =
  /\\([\\`*_[\]()])|```[\w-]*\r?\n?([\s\S]*?)```|`([^`]+)`|\[([^[\]]*)\]\(([^()\s]*)\)|\*\*(\S(?:[\s\S]*?\S)?)\*\*|\*(\S(?:[\s\S]*?\S)?)\*|(?<!\w)__(\S(?:[\s\S]*?\S)?)__(?!\w)|(?<!\w)_(\S(?:[\s\S]*?\S)?)_(?!\w)/g;

const SAFE_HREF = /^(https?:|mailto:)/i;

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const write = (token: InlineToken) => {
    const last = tokens.at(-1);
    if (token.kind === "text" && last?.kind === "text") last.text += token.text;
    else tokens.push(token);
  };

  let cut = 0;
  // `matchAll` rather than `exec`: emphasis and link labels recurse through
  // here, and a shared `lastIndex` would leave the outer scan mid-string.
  for (const match of text.matchAll(INLINE)) {
    const [
      whole,
      escaped,
      fence,
      code,
      label,
      href,
      strong,
      em,
      strongAlt,
      emAlt,
    ] = match;
    if (match.index > cut) {
      write({ kind: "text", text: text.slice(cut, match.index) });
    }
    cut = match.index + whole.length;

    const marked = strong ?? strongAlt;
    const slanted = em ?? emAlt;
    if (escaped !== undefined) write({ kind: "text", text: escaped });
    else if (fence !== undefined) {
      write({ kind: "code", text: fence.trim() });
    } else if (code !== undefined) write({ kind: "code", text: code });
    else if (href !== undefined) {
      // A label carries no link of its own — the pattern refuses nested
      // brackets — so every recursion here reads a strictly shorter string.
      const children = parseInline(label);
      if (SAFE_HREF.test(href)) write({ kind: "link", href, children });
      else for (const child of children) write(child);
    } else if (marked !== undefined) {
      write({ kind: "strong", children: parseInline(marked) });
    } else if (slanted !== undefined) {
      write({ kind: "em", children: parseInline(slanted) });
    }
  }
  if (cut < text.length) write({ kind: "text", text: text.slice(cut) });
  return tokens;
}

/** The same text with every marker dropped — for a search doc or a label. */
export function plainInline(text: string): string {
  return flatten(parseInline(text));
}

function flatten(tokens: InlineToken[]): string {
  return tokens
    .map((token) =>
      token.kind === "text" || token.kind === "code"
        ? token.text
        : flatten(token.children),
    )
    .join("");
}
