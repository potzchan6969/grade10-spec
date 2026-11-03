import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type {
  Mark,
  MarkInput,
  ObservationInput,
  RowObjects,
  RunView,
} from "../api/desk.ts";
import { type DeskApi, type LiveStatus, unreachable } from "./client.ts";
import { type Acknowledged, Outbox } from "./outbox.ts";
import {
  applyLive,
  withMarks,
  withObjects,
  withObservations,
  withPending,
} from "./run-view.ts";

export type RunHandle = {
  /** The desk's answer with this tester's waiting writes on top. */
  view: RunView | null;
  error: string | null;
  status: LiveStatus;
  /** Writes made here and not yet taken by the desk. */
  waiting: number;
  pendingMarks: Set<string>;
  /** Every mark seen for a row in this visit, oldest first. */
  seen: Map<string, Mark[]>;
  /** What the desk refused, in its own words, newest last. */
  notices: string[];
  dismiss: (at: number) => void;
  mark: (marks: MarkInput[]) => void;
  observe: (observations: ObservationInput[]) => void;
  putObjects: (row: string, objects: RowObjects) => void;
  reload: () => void;
  /** Runs a desk call that is not a mark, saying any refusal out loud. */
  act: <T>(call: (desk: DeskApi) => Promise<T>) => Promise<T | undefined>;
};

/** One run, read once, kept live, with an outbox for every write. */
export function useRun(
  desk: DeskApi | null,
  id: string,
  me: string,
): RunHandle {
  const outbox = useMemo(() => new Outbox(id), [id]);
  const ops = useSyncExternalStore(
    useCallback((listener) => outbox.subscribe(listener), [outbox]),
    () => outbox.list(),
  );
  const [base, setBase] = useState<RunView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LiveStatus>("connecting");
  const [notices, setNotices] = useState<string[]>([]);
  const [seen, setSeen] = useState<Map<string, Mark[]>>(new Map());

  const note = useCallback((message: string) => {
    setNotices((held) => [...held, message]);
  }, []);

  const remember = useCallback((marks: Mark[]) => {
    setSeen((held) => {
      const next = new Map(held);
      for (const mark of marks) {
        const list = next.get(mark.row) ?? [];
        if (!list.some((one) => one.id === mark.id))
          next.set(
            mark.row,
            [...list, mark].sort((a, b) => a.seq - b.seq),
          );
      }
      return next;
    });
  }, []);

  const held = useRef(false);
  const reload = useCallback(() => {
    if (!desk) return;
    desk
      .run(id)
      .then((view) => {
        held.current = true;
        setBase(view);
        setError(null);
        remember(view.marks);
      })
      .catch((cause: unknown) => {
        console.error("run unavailable", cause);
        // A run already on screen stays there while the desk is away.
        if (!unreachable(cause) || !held.current)
          setError(cause instanceof Error ? cause.message : String(cause));
      });
  }, [desk, id, remember]);

  const onAck = useCallback(
    (ack: Acknowledged) => {
      setBase((view) => {
        if (!view) return view;
        if (ack.kind === "marks") return withMarks(view, ack.marks);
        if (ack.kind === "observations")
          return withObservations(view, ack.observations);
        return withObjects(view, ack.row, ack.objects, ack.seq);
      });
      if (ack.kind === "marks") remember(ack.marks);
    },
    [remember],
  );

  const flush = useCallback(() => {
    if (!desk) return;
    outbox.flush(desk, onAck).then(({ rejected }) => {
      for (const one of rejected) note(`Not saved: ${one.message}`);
    });
  }, [desk, outbox, onAck, note]);

  useEffect(() => {
    held.current = false;
    setBase(null);
    reload();
  }, [reload]);

  useEffect(() => {
    if (!desk) return;
    let wasLive = false;
    const stop = desk.live(id, {
      message: (message) => {
        if (message.type === "spec") {
          reload();
          return;
        }
        if (message.type === "mark") remember([message.mark]);
        setBase((view) => (view ? applyLive(view, message) : view));
      },
      status: (next) => {
        setStatus(next);
        if (next === "live") {
          if (wasLive) reload();
          wasLive = true;
          flush();
        }
      },
    });
    const online = () => flush();
    window.addEventListener("online", online);
    return () => {
      stop();
      window.removeEventListener("online", online);
    };
  }, [desk, id, reload, flush, remember]);

  const shown = useMemo(
    () => (base ? withPending(base, ops, me) : null),
    [base, ops, me],
  );

  return {
    view: shown?.view ?? null,
    error,
    status,
    waiting: ops.length,
    pendingMarks: shown?.pendingMarks ?? new Set(),
    seen,
    notices,
    dismiss: (at) => setNotices((held) => held.filter((_, one) => one !== at)),
    mark: (marks) => {
      outbox.add({ kind: "marks", marks });
      flush();
    },
    observe: (observations) => {
      outbox.add({ kind: "observations", observations });
      flush();
    },
    putObjects: (row, objects) => {
      outbox.add({ kind: "objects", row, objects });
      flush();
    },
    reload,
    act: async (call) => {
      if (!desk) return undefined;
      try {
        return await call(desk);
      } catch (cause) {
        console.error("desk refused", cause);
        note(cause instanceof Error ? cause.message : String(cause));
        return undefined;
      }
    },
  };
}
