/** What a scenario id looks like, named once for the store in
 * `tools/manual/src/store/markdown.mts`. */
import {
  ID_END,
  ID_START,
} from "../../../tools/openspec-store/src/spec-text.mts";

export {
  SCENARIO_ID,
  scenarioIdsIn,
} from "../../../tools/openspec-store/src/spec-text.mts";

/**
 * Whether a text cites an id, bounded on both sides as `ID_START` and `ID_END`
 * bound it. Read by the landing over a `--tests` path and by the suite's
 * validation over a Manual row's test (`shared-planning-agent-rounds-SC-98`,
 * `shared-planning-agent-rounds-SC-106`).
 */
export function citesId(text, id) {
  const escaped = String(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${ID_START}${escaped}${ID_END}`).test(String(text ?? ""));
}
