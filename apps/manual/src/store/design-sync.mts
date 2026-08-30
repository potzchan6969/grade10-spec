import { join } from "node:path";
import type { DesignSyncClass, DesignSyncReport } from "../api/types.ts";
import { readTextIfExists } from "./disk.mts";

/** Where `design-sync:check --report` leaves its verdict and where the nightly
 * workflow commits it. Generated, never authored, so it sits outside
 * `manual/` — the manual only reads it. */
export const DESIGN_SYNC_REPORT = ".design-sync/report.json";

const CLASSES = new Set<string>(["ok", "warn", "skipped", "fail"]);

/** Optional by design: a store that has never run the check has no file, and
 * the cards simply badge nothing. A file that is there and unreadable is a
 * broken checker, and that fails the build rather than passing as "no drift". */
export function readDesignSync(root: string): DesignSyncReport | undefined {
  const text = readTextIfExists(join(root, DESIGN_SYNC_REPORT));
  if (text === undefined) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    throw new Error(`${DESIGN_SYNC_REPORT} is not valid JSON`, { cause });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${DESIGN_SYNC_REPORT} must be a mapping`);
  }

  const { generatedAt, sets } = parsed as Record<string, unknown>;
  if (typeof generatedAt !== "string") {
    throw new Error(`${DESIGN_SYNC_REPORT} needs a \`generatedAt\` timestamp`);
  }
  if (typeof sets !== "object" || sets === null || Array.isArray(sets)) {
    throw new Error(`${DESIGN_SYNC_REPORT} needs a \`sets\` mapping`);
  }

  const verdicts: Record<string, DesignSyncClass> = {};
  for (const [name, verdict] of Object.entries(sets)) {
    if (typeof verdict !== "string" || !CLASSES.has(verdict)) {
      throw new Error(
        `${DESIGN_SYNC_REPORT}: \`${name}\` is \`${String(verdict)}\`, not ok, warn, skipped or fail`,
      );
    }
    verdicts[name] = verdict as DesignSyncClass;
  }
  return { generatedAt, sets: verdicts };
}
