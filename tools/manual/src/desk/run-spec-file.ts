import { type RunSpec, SURFACES } from "../api/desk.ts";

export type SpecReading =
  | { ok: true; spec: RunSpec }
  | { ok: false; problems: string[] };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((one) => typeof one === "string");

/** A run sheet's RunSpec file, held to the shape the desk takes before it is
 * sent, so a wrong file is named here rather than half-opened there. */
export function readRunSpec(text: string): SpecReading {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    return {
      ok: false,
      problems: [
        `Not JSON: ${cause instanceof Error ? cause.message : String(cause)}`,
      ],
    };
  }
  const problems: string[] = [];
  if (!isObject(parsed))
    return { ok: false, problems: ["Not a RunSpec object"] };
  for (const key of ["name", "env", "selection", "source", "fingerprint"])
    if (typeof parsed[key] !== "string" || parsed[key] === "")
      problems.push(`\`${key}\` must be a non-empty string`);
  if (!Array.isArray(parsed.cases) || parsed.cases.length === 0)
    problems.push("`cases` must list at least one case");
  if (!Array.isArray(parsed.walks)) problems.push("`walks` must be a list");
  if (!isObject(parsed.placeholders))
    problems.push("`placeholders` must be an object");
  if (!Array.isArray(parsed.exclusions))
    problems.push("`exclusions` must be a list");
  const ids = new Set<string>();
  (Array.isArray(parsed.cases) ? parsed.cases : []).forEach(
    (one: unknown, at) => {
      const where = `case ${at + 1}`;
      if (!isObject(one)) {
        problems.push(`${where} is not an object`);
        return;
      }
      const id = typeof one.id === "string" ? one.id : "";
      const named = id ? `${where} (${id})` : where;
      if (!id) problems.push(`${where} has no \`id\``);
      else if (ids.has(id)) problems.push(`${named} is listed twice`);
      ids.add(id);
      for (const key of ["title", "suite"])
        if (typeof one[key] !== "string")
          problems.push(`${named} has no \`${key}\``);
      for (const key of ["traces", "given", "steps"])
        if (!isStrings(one[key]))
          problems.push(`${named}: \`${key}\` must be a list of strings`);
      if (
        !Array.isArray(one.expect) ||
        !one.expect.every(
          (line: unknown) => isObject(line) && typeof line.text === "string",
        )
      )
        problems.push(`${named}: \`expect\` must be a list of { text, step? }`);
      if (
        !isStrings(one.surfaces) ||
        !one.surfaces.every((surface) =>
          (SURFACES as readonly string[]).includes(surface),
        )
      )
        problems.push(
          `${named}: \`surfaces\` must name ${SURFACES.join(", ")}`,
        );
      if (
        one.data !== undefined &&
        !(
          isObject(one.data) &&
          isStrings(one.data.header) &&
          Array.isArray(one.data.rows) &&
          one.data.rows.every(isStrings)
        )
      )
        problems.push(`${named}: \`data\` must be { header, rows }`);
    },
  );
  return problems.length > 0
    ? { ok: false, problems }
    : { ok: true, spec: parsed as unknown as RunSpec };
}
