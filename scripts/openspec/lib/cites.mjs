/**
 * Whether a text cites an id: the id followed by no digit, so `SC-1` is never
 * found inside `SC-12`. One helper, one verdict, read by the landing over a
 * `--tests` path and by the suite's validation over a Manual row's test
 * (`shared-planning-agent-rounds-SC-98`, `shared-planning-agent-rounds-SC-106`).
 */
export function citesId(text, id) {
  const escaped = String(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${escaped}(?!\\d)`).test(String(text ?? ""));
}
