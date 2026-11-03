import { useEffect, useState } from "react";
import type { ManualIndex } from "./derive";
import { DESK_BASE, type DeskVerdicts } from "./desk";
import { type ReleaseReading, readRelease } from "./units";
import { useManualIndex } from "./use-manual-index";

/**
 * The release as the manual reads it: units and their cases once per
 * snapshot, and the run desk's latest verdicts fetched once when a page or
 * the board opens. Results never reach git, so a page with no desk behind
 * it — the static build, a local run — reads up to Reviewed and says so.
 */

const readings = new WeakMap<ManualIndex["snapshot"], ReleaseReading | null>();

/** Null where the manual has no `phases.yaml`. */
export function releaseOf(index: ManualIndex): ReleaseReading | null {
  const { snapshot } = index;
  if (readings.has(snapshot)) return readings.get(snapshot) ?? null;
  const reading = snapshot.phases
    ? readRelease({
        phases: snapshot.phases,
        pages: index.pages.map((page) => ({ path: page.path, ast: page.ast })),
        suites: snapshot.suites ?? [],
        capabilityCases: snapshot.capabilityCases,
      })
    : null;
  readings.set(snapshot, reading);
  return reading;
}

export function useRelease(): ReleaseReading | null {
  return releaseOf(useManualIndex());
}

export type VerdictsState =
  | { status: "loading" }
  | { status: "ready"; verdicts: DeskVerdicts }
  /** No desk answered: the static build, or a local run without one. */
  | { status: "none"; reason: string };

export const VERDICTS_URL = `${DESK_BASE}/verdicts`;

/** The desk's verdicts, or why there are none. A host with no desk answers
 * the route with the app's own HTML, which is no results, not a failure. */
export async function fetchVerdicts(
  fetcher: typeof fetch = fetch,
): Promise<VerdictsState> {
  let response: Response;
  try {
    response = await fetcher(VERDICTS_URL, {
      headers: { accept: "application/json" },
    });
  } catch (cause) {
    return { status: "none", reason: `the run desk is unreachable: ${cause}` };
  }
  if (!response.ok) {
    console.warn(`run desk verdicts: ${response.status}`);
    return {
      status: "none",
      reason: `the run desk answered ${response.status}`,
    };
  }
  if (!(response.headers.get("content-type") ?? "").includes("json")) {
    return { status: "none", reason: "no run desk behind this manual" };
  }
  const body = (await response.json().catch(() => null)) as unknown;
  if (!isVerdicts(body)) {
    console.warn("run desk verdicts: an answer of the wrong shape", body);
    return { status: "none", reason: "the run desk's answer did not read" };
  }
  return { status: "ready", verdicts: body };
}

function isVerdicts(body: unknown): body is DeskVerdicts {
  if (typeof body !== "object" || body === null) return false;
  const { runs, cases, excluded } = body as Record<string, unknown>;
  return (
    Array.isArray(runs) &&
    typeof cases === "object" &&
    cases !== null &&
    typeof excluded === "object" &&
    excluded !== null
  );
}

/** Fetched once each time `opened` changes — a page's path, the board —
 * and never where nothing would read it. */
export function useDeskVerdicts(opened: string, enabled = true): VerdictsState {
  const [state, setState] = useState<VerdictsState>({ status: "loading" });
  // biome-ignore lint/correctness/useExhaustiveDependencies: `opened` is the trigger — each page or board opened asks the desk again.
  useEffect(() => {
    if (!enabled) {
      setState({ status: "none", reason: "nothing here reads results" });
      return;
    }
    let live = true;
    setState({ status: "loading" });
    fetchVerdicts().then((next) => {
      if (live) setState(next);
    });
    return () => {
      live = false;
    };
  }, [opened, enabled]);
  return state;
}

export const verdictsOf = (state: VerdictsState): DeskVerdicts | undefined =>
  state.status === "ready" ? state.verdicts : undefined;
