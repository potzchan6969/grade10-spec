import { slugify } from "../api/paths";
import type { BodyItem, FlowBlock } from "../content/grammar";

export type FlowStep = { id: string; title: string; items: BodyItem[] };

const FENCE = /^(`{3,}|~{3,})/;
const HEADING = /^##\s+(.*)$/;

/**
 * A flow's body is one run of blocks; each `##` heading in its prose starts a
 * step, and every leaf between headings belongs to the step it sits under.
 */
export function splitSteps(block: FlowBlock): FlowStep[] {
  const base = slugify(block.title);
  const steps: FlowStep[] = [];

  const open = (title: string) => {
    steps.push({ id: `${base}-step-${steps.length + 1}`, title, items: [] });
  };
  const current = () => {
    if (steps.length === 0) open(block.title);
    return steps[steps.length - 1];
  };

  for (const item of block.body) {
    if (item.type !== "prose") {
      current().items.push(item);
      continue;
    }

    let buffer: string[] = [];
    let fence: string | null = null;
    const flush = () => {
      const markdown = buffer.join("\n").trim();
      buffer = [];
      if (markdown !== "") current().items.push({ type: "prose", markdown });
    };

    for (const line of item.markdown.split("\n")) {
      if (fence !== null) {
        buffer.push(line);
        if (line.startsWith(fence)) fence = null;
        continue;
      }
      const fenced = FENCE.exec(line);
      if (fenced) {
        buffer.push(line);
        fence = fenced[1];
        continue;
      }
      const heading = HEADING.exec(line);
      if (heading) {
        flush();
        open(heading[1].trim());
        continue;
      }
      buffer.push(line);
    }
    flush();
  }

  return steps.length === 0
    ? [{ id: `${base}-step-1`, title: block.title, items: [] }]
    : steps;
}

/** Room left beside a chip that had to be scrolled to, clear of the edge fade. */
const CHIP_MARGIN = 24;

/**
 * Where the step rail must scroll for a chip to be fully in it — the browser's
 * own `inline: "nearest"`, done by hand because `scrollIntoView` would drag the
 * page along with the rail and steal the reader's place on it.
 */
export function railScrollLeft(
  view: { scrollLeft: number; clientWidth: number },
  chip: { offsetLeft: number; offsetWidth: number },
  margin = CHIP_MARGIN,
): number {
  const left = chip.offsetLeft - margin;
  if (left < view.scrollLeft) return Math.max(0, left);

  const past =
    chip.offsetLeft +
    chip.offsetWidth +
    margin -
    view.scrollLeft -
    view.clientWidth;
  return past > 0 ? view.scrollLeft + past : view.scrollLeft;
}

/** Tokens a diagram element may use to claim a step: its number, id, or slug. */
export function stepTokens(step: FlowStep, position: number): Set<string> {
  return new Set([String(position + 1), step.id, slugify(step.title)]);
}
