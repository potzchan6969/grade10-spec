import { join, relative, sep } from "node:path";
import YAML from "yaml";
import { readPhases } from "../api/phases.ts";
import { readSuite } from "../api/suites.ts";
import type { CaseSummary, Snapshot, TeamMember } from "../api/types.ts";
import { readTextIfExists, walkFiles } from "./disk.mts";
import type { Roots } from "./roots.mts";

/** `phases.yaml` beside the team map; a manual without one has no phases.
 * A malformed registry fails the build, as a malformed page does. */
export function readPhaseRegistry(roots: Roots): Snapshot["phases"] {
  const named = `${roots.manual}/phases.yaml`;
  const text = readTextIfExists(join(roots.content, named));
  if (text === undefined) return undefined;
  try {
    return readPhases(text);
  } catch (cause) {
    throw new Error(`${named}: ${(cause as Error).message}`, { cause });
  }
}

/** Every capability's own suite, `openspec/specs/<spec>/feature-tcs.md`,
 * counted rather than shipped: readiness outside the store needs a case's
 * id, revision and status, never its words. A store without OpenSpec has
 * none, and shows no readiness outside its own pages. */
export function readCapabilityCases(
  roots: Roots,
): Record<string, CaseSummary[]> | undefined {
  const specs = join(roots.store, "openspec", "specs");
  const files = walkFiles(roots.store, specs, ".md").filter((path) =>
    path.endsWith("/feature-tcs.md"),
  );
  if (files.length === 0) return undefined;
  const bySpec: Record<string, CaseSummary[]> = {};
  for (const path of files) {
    const source = readTextIfExists(join(roots.store, path)) ?? "";
    const spec = relative(specs, join(roots.store, path))
      .split(sep)
      .slice(0, -1)
      .join("/");
    bySpec[spec] = readSuite({ path, source })
      .filter((one) => one.status !== "deprecated")
      .map((one) => ({
        id: one.id,
        ...(one.status ? { status: one.status } : {}),
        ...(one.marker ? { marker: one.marker, rev: one.rev } : {}),
        ...(one.severity ? { severity: one.severity } : {}),
      }));
  }
  return bySpec;
}

/** The team map's handles, their e-mail and roles: a mark keeps the e-mail
 * Access names, and the manual shows the handle where the map knows it. */
export function readTeam(roots: Roots): TeamMember[] | undefined {
  const text = readTextIfExists(join(roots.content, roots.manual, "team.yaml"));
  if (text === undefined) return undefined;
  const parsed = YAML.parse(text) as {
    handles?: Record<string, { email?: string; roles?: string[] }>;
  } | null;
  return Object.entries(parsed?.handles ?? {}).map(([handle, entry]) => ({
    handle,
    ...(entry?.email ? { email: entry.email } : {}),
    roles: entry?.roles ?? [],
  }));
}
