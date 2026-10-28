/**
 * A flow's screens, read as a tree from their ids: the number is the step
 * (`1`, `2`), a trailing letter another state of that step (`1a`, `4a`). The
 * canvas, the Screen control and the Verification panel all lay out from it.
 */

export const CANVAS = "canvas";

export type FlowScreen = {
  id: string;
  name: string;
  /** The capture point a recipe walks the site to for this screen. */
  capturePointId: string;
  /** The screen story that draws it, so no state is drawn twice. */
  storyId: string;
};

/** What the Verification panel reads from a flow story's parameters. */
export type FlowParameter = {
  screens: Pick<FlowScreen, "id" | "name" | "capturePointId">[];
};

export type FlowStep = { main: FlowScreen; states: FlowScreen[] };

const SCREEN_ID = /^(\d+)([a-z]?)$/;

export function parseScreenId(id: string): { step: number; state: string } {
  const match = SCREEN_ID.exec(id);
  if (!match)
    throw new Error(
      `screen id "${id}" is a step number and an optional letter, such as 4 or 4a`,
    );
  return { step: Number(match[1]), state: match[2] };
}

export const screenLabel = (screen: Pick<FlowScreen, "id" | "name">) =>
  `Screen ${screen.id} (${screen.name})`;

/** The parent a state hangs under, or null for a step's main screen. */
export function parentId(id: string): string | null {
  const { step, state } = parseScreenId(id);
  return state ? String(step) : null;
}

/**
 * Steps in order, each with its other states in letter order. Every state
 * needs its step's main screen, and no id repeats.
 */
export function flowSteps(screens: readonly FlowScreen[]): FlowStep[] {
  const seen = new Set<string>();
  const byStep = new Map<number, { main?: FlowScreen; states: FlowScreen[] }>();
  for (const screen of screens) {
    if (seen.has(screen.id)) throw new Error(`screen ${screen.id} repeats`);
    seen.add(screen.id);
    const { step, state } = parseScreenId(screen.id);
    const entry = byStep.get(step) ?? { states: [] };
    if (state) entry.states.push(screen);
    else entry.main = screen;
    byStep.set(step, entry);
  }
  return [...byStep.entries()]
    .sort(([left], [right]) => left - right)
    .map(([step, entry]) => {
      if (!entry.main)
        throw new Error(
          `screen ${entry.states[0].id} has no step ${step} to hang under`,
        );
      return {
        main: entry.main,
        states: entry.states.sort((left, right) =>
          left.id.localeCompare(right.id),
        ),
      };
    });
}

/** The screens in tree order: each step, then its other states. */
export function treeOrder<T extends Pick<FlowScreen, "id">>(
  screens: readonly T[],
): T[] {
  return [...screens].sort((left, right) => {
    const a = parseScreenId(left.id);
    const b = parseScreenId(right.id);
    return a.step - b.step || a.state.localeCompare(b.state);
  });
}

/** The Screen control's options: Canvas, then every screen in tree order. */
export function screenOptions(screens: readonly FlowScreen[]) {
  const ordered = treeOrder(screens);
  return {
    options: [CANVAS, ...ordered.map((screen) => screen.id)],
    labels: Object.fromEntries([
      [CANVAS, "Canvas"],
      ...ordered.map((screen) => [screen.id, screenLabel(screen)]),
    ]) as Record<string, string>,
  };
}

export function flowParameter(screens: readonly FlowScreen[]): FlowParameter {
  return {
    screens: treeOrder(screens).map(({ id, name, capturePointId }) => ({
      id,
      name,
      capturePointId,
    })),
  };
}
