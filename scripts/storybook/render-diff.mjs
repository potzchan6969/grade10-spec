import { createHash } from "node:crypto";

// A story's render is reduced to two hashes so the notice can say what moved:
// `layout` covers element tags and their rounded boxes, `text` covers the
// words, image sources and labels the story shows.
export function renderSignature(elements) {
  const digest = (parts) =>
    createHash("sha1").update(JSON.stringify(parts)).digest("hex").slice(0, 16);
  return {
    layout: digest(elements.map(({ box, tag }) => [tag, box])),
    text: digest(elements.map(({ text }) => text)),
  };
}

// Reasons are `layout`, `text`, `added` or `error` (fails to render); a story absent from the result is
// unchanged. Stories missing from the baseline are `added`.
export function diffSnapshots(baseline, current) {
  const changes = new Map();
  for (const [id, now] of Object.entries(current)) {
    const before = baseline[id];
    if (now.layout === "error" && before?.layout !== "error") {
      changes.set(id, "error");
    } else if (!before) changes.set(id, "added");
    else if (before.layout !== now.layout) changes.set(id, "layout");
    else if (before.text !== now.text) changes.set(id, "text");
  }
  return changes;
}
