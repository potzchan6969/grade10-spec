import { slugify } from "../api/paths";
import type { BodyItem, FlowBlock } from "../content/grammar";

export type FlowStep = {
  id: string;
  /** Position in the whole flow, not in its phase — ids and links count once. */
  number: number;
  title: string;
  items: BodyItem[];
};

export type FlowPhase = {
  id: string;
  /** Null when the author wrote no phases; the flow is then one plain run. */
  title: string | null;
  lede: BodyItem[];
  steps: FlowStep[];
};

const FENCE = /^(`{3,}|~{3,})/;
const PHASE = /^#\s+(.*)$/;
const STEP = /^##\s+(.*)$/;

/** What a flow's steps and phases are named after: its title, and the case it
 * walks where it is one of several, so two cases never claim one step id. */
export const flowId = (block: FlowBlock): string =>
  slugify(block.case ? `${block.title} ${block.case}` : block.title);

/**
 * A flow's body is one run of blocks whose headings are structure rather than
 * prose: `#` opens a phase, `##` opens a step, and every leaf between headings
 * belongs to whatever is open. Text before the first step of a phase is that
 * phase's lede, so nothing an author writes falls on the floor.
 */
export function splitFlow(block: FlowBlock): FlowPhase[] {
  const base = flowId(block);
  const phases: FlowPhase[] = [];
  let counted = 0;

  const openPhase = (title: string | null) => {
    phases.push({
      id: `${base}-phase-${phases.length + 1}`,
      title,
      lede: [],
      steps: [],
    });
  };

  const openStep = (title: string) => {
    if (phases.length === 0) openPhase(null);
    counted += 1;
    phases[phases.length - 1].steps.push({
      id: `${base}-step-${counted}`,
      number: counted,
      title,
      items: [],
    });
  };

  /** Where the next leaf lands: the open step, else the open phase's lede. */
  const sink = (): BodyItem[] => {
    if (phases.length === 0) openStep(block.title);
    const phase = phases[phases.length - 1];
    return phase.steps.length === 0
      ? phase.lede
      : phase.steps[phase.steps.length - 1].items;
  };

  for (const item of block.body) {
    if (item.type !== "prose") {
      sink().push(item);
      continue;
    }

    let buffer: string[] = [];
    let fence: string | null = null;
    const flush = () => {
      const markdown = buffer.join("\n").trim();
      buffer = [];
      if (markdown !== "") sink().push({ type: "prose", markdown });
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
      const step = STEP.exec(line);
      if (step) {
        flush();
        openStep(step[1].trim());
        continue;
      }
      const phase = PHASE.exec(line);
      if (phase) {
        flush();
        openPhase(phase[1].trim());
        continue;
      }
      buffer.push(line);
    }
    flush();
  }

  // A phase heading the author left bare prints no empty bar.
  const kept = phases.filter(
    (phase) => phase.steps.length > 0 || phase.lede.length > 0,
  );
  if (kept.length > 0) return kept;

  return [
    {
      id: `${base}-phase-1`,
      title: null,
      lede: [],
      steps: [
        { id: `${base}-step-1`, number: 1, title: block.title, items: [] },
      ],
    },
  ];
}

export function flowSteps(phases: FlowPhase[]): FlowStep[] {
  return phases.flatMap((phase) => phase.steps);
}

/** Every id a flow's own rows answer to, for a deep link that has to find
 * which flow holds the row it names. */
export function flowAnchors(block: FlowBlock): string[] {
  const phases = splitFlow(block);
  return [
    ...phases.map((phase) => phase.id),
    ...flowSteps(phases).map((step) => step.id),
  ];
}

/** Tokens a diagram element may use to claim a step: its number, id, or slug. */
export function stepTokens(step: FlowStep): Set<string> {
  return new Set([String(step.number), step.id, slugify(step.title)]);
}

/** The tokens a diagram element claims in its `data-step` attribute. */
export const stepClaims = (value: string | null): string[] =>
  (value ?? "").split(/[\s,]+/).filter(Boolean);

/** The first step any of these claims names. */
export function claimedStep(
  steps: FlowStep[],
  claims: string[],
): FlowStep | null {
  return (
    steps.find((step) => {
      const tokens = stepTokens(step);
      return claims.some((claim) => tokens.has(claim));
    }) ?? null
  );
}
