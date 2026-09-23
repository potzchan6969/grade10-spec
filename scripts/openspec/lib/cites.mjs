/** What a scenario id looks like, named once for the store in
 * `tools/manual/src/store/markdown.mts`. */
export {
  SCENARIO_ID,
  scenarioIdsIn,
} from "../../../tools/manual/src/store/markdown.mts";

/**
 * Whether a text cites an id, bounded on both sides: `SC-1` is never found
 * inside `SC-12` or `SC-1a`, nor `alpha-SC-1` inside `demo-alpha-SC-1`. Read
 * by the landing over a `--tests` path and by the suite's validation over a
 * Manual row's test (`shared-planning-agent-rounds-SC-98`,
 * `shared-planning-agent-rounds-SC-106`).
 */
export function citesId(text, id) {
  const escaped = String(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\w-])${escaped}(?!\\w)`).test(String(text ?? ""));
}
