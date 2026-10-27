/* RULE: `[[refs]]` written in prose name exactly one thing. */
import { REF_PATTERN, resolveRef } from "../src/content/refs.ts";
import { everyBlock } from "./context.mjs";

const FENCE = /^(`{3,}|~{3,})/;
const INLINE_CODE = /(`+)[\s\S]*?\1/g;

/** Prose is verbatim text to the grammar, so `[[refs]]` are found here — with
 * the grammar's own fence rule repeated, since a fenced block inside prose is
 * documentation about the syntax, not a use of it. Inline code hides one too.
 * The one resolver the renderer shares decides what each names. */
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
  for (const block of everyBlock(page.ast.blocks)) {
    if (block.type !== "prose") continue;
    for (const raw of proseRefs(block.markdown)) {
      const resolved = resolveRef(raw, ctx.titles);
      if (resolved.ok) continue;
      ctx.add("ref", page.path, `\`[[${raw}]]\`: ${resolved.reason}`);
    }
  }
}
