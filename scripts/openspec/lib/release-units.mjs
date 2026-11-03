/**
 * The release as the run sheet reads it: phases, units and each unit's
 * readiness, through the manual's own reader so a board, a run and a release
 * cannot disagree (release-phases.md, **One Reader**).
 *
 * Imported only where a run selects by phase or opens on the desk: the
 * manual's modules are TypeScript that node runs by stripping types.
 */

import {
  READY_STEPS,
  readinessOf,
} from "../../../tools/manual/src/api/readiness.ts";
import { readRelease } from "../../../tools/manual/src/api/units.ts";
import {
  readManualPages,
  readManualSuites,
} from "../../../tools/manual/src/store/read-manual.mts";
import {
  readCapabilityCases,
  readPhaseRegistry,
} from "../../../tools/manual/src/store/read-release.mts";
import { rootsOf } from "../../../tools/manual/src/store/roots.mts";

export { READY_STEPS };

const NO_GIT = { commitOf: () => undefined };

/**
 * Every unit with its step and the ids of its cases, read from the files
 * under `root`. Desk verdicts are not read: a dry run touches no network, so
 * a unit reads at most Reviewed here, which is what `--ready` asks for.
 */
export function readReleaseAt(root) {
  const roots = rootsOf(root);
  const { asts } = readManualPages(roots, NO_GIT);
  const reading = readRelease({
    phases: readPhaseRegistry(roots) ?? [],
    pages: [...asts].map(([path, ast]) => ({ path, ast })),
    suites: readManualSuites(roots),
    capabilityCases: readCapabilityCases(roots),
  });
  const phaseById = new Map(reading.phases.map((one) => [one.id, one]));
  const units = reading.units.map((unit) => {
    const cases = reading.casesOf(unit);
    const readiness = readinessOf(unit, cases, phaseById.get(unit.phase));
    return {
      ...unit,
      step: readiness.step,
      drafts: readiness.drafts,
      uncovered: readiness.uncovered,
      cases: cases.map((one) => one.id),
    };
  });
  return {
    phases: reading.phases,
    units,
    /** `docs/prds/.../cart.md` → its `##` headings, as traces name them. */
    sections: new Map(
      [...reading.pages].map(([path, page]) => [
        path,
        page.outline.headings
          .filter((one) => one.level === 2)
          .map(({ anchor, trace, title }) => ({ anchor, trace, title })),
      ]),
    ),
    storePages: new Set(
      [...reading.pages.values()]
        .filter((page) => page.traced)
        .map((page) => page.path),
    ),
  };
}
