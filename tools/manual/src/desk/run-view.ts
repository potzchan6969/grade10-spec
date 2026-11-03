import type {
  LiveMessage,
  Mark,
  Observation,
  RowObjects,
  RunView,
} from "../api/desk.ts";
import type { OutboxOp } from "./outbox.ts";

/** A mark joins the view once, by its id; a newer one on the same row and
 * surface takes the older one's place among the current marks. */
export function withMarks(view: RunView, marks: Mark[]): RunView {
  let next = view.marks;
  for (const mark of marks) {
    if (next.some((one) => one.id === mark.id)) continue;
    const held = next.find(
      (one) => one.row === mark.row && one.surface === mark.surface,
    );
    if (held && held.seq > mark.seq) continue;
    next = [...next.filter((one) => one !== held), mark];
  }
  if (next === view.marks) return view;
  return {
    ...view,
    marks: next,
    seq: Math.max(view.seq, ...marks.map((one) => one.seq)),
  };
}

export function withObservations(
  view: RunView,
  observations: Observation[],
): RunView {
  const fresh = observations.filter(
    (one) => !view.observations.some((held) => held.id === one.id),
  );
  if (fresh.length === 0) return view;
  return {
    ...view,
    observations: [...view.observations, ...fresh],
    seq: Math.max(view.seq, ...fresh.map((one) => one.seq)),
  };
}

export function withObjects(
  view: RunView,
  row: string,
  objects: RowObjects,
  seq: number,
): RunView {
  return {
    ...view,
    objects: { ...view.objects, [row]: objects },
    seq: Math.max(view.seq, seq),
  };
}

/** A live message on top of the view; `spec` asks for a fresh read, which
 * the caller makes. */
export function applyLive(view: RunView, message: LiveMessage): RunView {
  switch (message.type) {
    case "mark":
      return withMarks(view, [message.mark]);
    case "observation":
      return withObservations(view, [message.observation]);
    case "objects":
      return withObjects(view, message.row, message.objects, message.seq);
    case "run":
      return { ...view, run: message.run };
    default:
      return view;
  }
}

/** Seq for a write still waiting: above anything the desk has answered, in
 * the order the page made them. */
const PENDING_SEQ = Number.MAX_SAFE_INTEGER - 1_000_000;

/** The view as the tester sees it: the desk's answer with their own unsent
 * writes on top, so a mark shows the moment it is made. */
export function withPending(
  view: RunView,
  ops: OutboxOp[],
  me: string,
): { view: RunView; pendingMarks: Set<string> } {
  let next = view;
  const pendingMarks = new Set<string>();
  ops.forEach((op, at) => {
    const seq = PENDING_SEQ + at;
    if (op.kind === "marks") {
      next = withMarks(
        next,
        op.marks.map((mark) => ({ ...mark, by: me, at: op.at, seq })),
      );
      for (const mark of op.marks) pendingMarks.add(mark.id);
    } else if (op.kind === "observations") {
      next = withObservations(
        next,
        op.observations.map((one) => ({ ...one, by: me, at: op.at, seq })),
      );
    } else {
      const merged = { ...next.objects[op.row] };
      for (const [key, value] of Object.entries(op.objects)) {
        if (value === "") delete merged[key];
        else merged[key] = value;
      }
      next = { ...next, objects: { ...next.objects, [op.row]: merged } };
    }
  });
  if (next !== view) next = { ...next, seq: view.seq };
  return { view: next, pendingMarks };
}
