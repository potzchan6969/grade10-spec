/* RULE: `[[refs]]` written in prose name exactly one thing. */
import { REF_PATTERN, resolveRef } from "../../apps/manual/src/content/refs.ts";
import { everyBlock } from "./context.mjs";

const FENCE = /^(`{3,}|~{3,})/;
const INLINE_CODE = /(`+)[\s\S]*?\1/g;

/** Prose is verbatim text to the grammar, so `[[refs]]` are found here — with
 * the grammar's own fence rule repeated, since a fenced block inside prose is
 * documentation about the syntax, not a use of it. Inline code hides one too.
 * A bare id resolves inside the page's own spec, the same scope the renderer
 * gives it, through the one resolver both share. */
function* proseRefs(markdown) {
  let fence = null;
  for (const line of markdown.split("\n")) {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      continue;
    }
    const opened = FENCE.exec(line);
    if (opened) {
      fence = opened[1];
      continue;
    }
    for (const match of line.replace(INLINE_CODE, "").matchAll(REF_PATTERN)) {
      yield match[1];
    }
  }
}

export function checkRefs(ctx, page) {
  const pageSpec = page.ast.frontmatter.spec;
  for (const block of everyBlock(page.ast.blocks)) {
    if (block.type !== "prose") continue;
    for (const raw of proseRefs(block.markdown)) {
      const resolved = resolveRef(raw, ctx.snapshot, pageSpec);
      if (resolved.ok) continue;
      ctx.add("ref", page.path, `\`[[${raw}]]\`: ${resolved.reason}`);
    }
  }
}
