import { outline, type Section } from "../../manual/src/store/markdown.mts";

/** What a scenario id looks like, in either form the store has issued: the
 * current `<app>.<domain>-<capability>.SC<n>` (`g10.auction-winner-order.SC4`)
 * or the older `<capability>-SC-<n>` (`alpha-SC-07`), each with a lower-case
 * letter where a scenario was added beside one. Named once; a reader that
 * needs flags or anchors builds them over its `source`. */
export const SCENARIO_ID =
  /(?:[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*\.SC\d+[a-z]?|[a-z0-9][a-z0-9-]*-SC-\d+[a-z]?)/;

/** What a journey id looks like: `<app>.<domain>-<capability>.US<n>`, a
 * composed suite's `g10.auction-dmn.US1`, `g10-pdt.US1` or `platform.US1`, or
 * the older `<capability>-US-<n>`. */
export const JOURNEY_ID =
  /(?:[a-z0-9][a-z0-9.-]*\.US\d+|[a-z0-9][a-z0-9-]*-US-\d+)/;

/** What a case heading's id looks like: its journey and `-TC<m>`
 * (`g10.auction-bidder-suspension.US1-TC1`), or the older
 * `<capability>-US<n>-TC<m>-<k>`. */
export const CASE_ID =
  /(?:[a-z0-9][a-z0-9.-]*\.US\d+-TC\d+|[a-z0-9][a-z0-9-]*?-(?:US-?\d+-)?TC-?\d+(?:-\d+)?)/;

/** Where an id cannot start or end without being part of a longer one:
 * `x.y.SC1` is not cited by `a.x.y.SC1`, `alpha-SC-1` by `demo-alpha-SC-1`,
 * nor either by `…SC12` or `…SC1a`. */
export const ID_START = "(?<![\\w.-])";
export const ID_END = "(?!\\w)";

/** Every scenario id a text carries, bounded on both sides as `citesId`
 * bounds one. */
export function scenarioIdsIn(text: string): string[] {
  return (
    text.match(new RegExp(`${ID_START}${SCENARIO_ID.source}${ID_END}`, "g")) ??
    []
  );
}

/** The token a scenario id is issued under: the id without its number. */
export function scenarioToken(id: string): string {
  return id.replace(/(?:-SC-|\.SC)\d+[a-z]?$/, "");
}

/** The `## ` sections of a delta file, with a `# ` title unwrapped — what
 * `openspec archive` splits the file into. */
export function deltaSections(text: string): Section[] {
  return outline(text).flatMap((one) =>
    one.level === 1 ? one.children : [one],
  );
}
