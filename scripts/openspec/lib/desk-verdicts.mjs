/**
 * The run desk's latest verdicts, `GET /api/desk/verdicts`, reached through
 * the Access service token, or read from a saved answer.
 */
import { readFileSync } from "node:fs";

export const DESK_URL = "https://spec.grade10-stg.com";

export class VerdictsUnavailable extends Error {}

function shaped(verdicts, from) {
  if (
    typeof verdicts !== "object" ||
    verdicts === null ||
    typeof verdicts.cases !== "object" ||
    typeof verdicts.excluded !== "object"
  )
    throw new VerdictsUnavailable(
      `${from} is not the desk's verdicts: it needs \`cases\` and \`excluded\``,
    );
  return verdicts;
}

/** `DeskVerdicts` from `file`, else from the desk; without either, a
 * one-line refusal naming what is missing. */
export async function loadVerdicts({
  file,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (file) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch (cause) {
      throw new VerdictsUnavailable(`cannot read ${file}: ${cause.message}`);
    }
    try {
      return shaped(JSON.parse(text), file);
    } catch (cause) {
      if (cause instanceof VerdictsUnavailable) throw cause;
      throw new VerdictsUnavailable(`${file} is not JSON: ${cause.message}`);
    }
  }
  const missing = ["CF_ACCESS_CLIENT_ID", "CF_ACCESS_CLIENT_SECRET"].filter(
    (name) => !env[name],
  );
  if (missing.length > 0)
    throw new VerdictsUnavailable(
      `no verdicts: ${missing.join(" and ")} ${missing.length === 1 ? "is" : "are"} not set — the desk's Access service token is a known Blocker; pass --verdicts <file>, a saved /api/desk/verdicts answer, instead`,
    );
  const url = `${(env.DESK_URL ?? DESK_URL).replace(/\/$/, "")}/api/desk/verdicts`;
  const response = await fetchImpl(url, {
    headers: {
      "CF-Access-Client-Id": env.CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": env.CF_ACCESS_CLIENT_SECRET,
      Accept: "application/json",
    },
    redirect: "manual",
  });
  const text = await response.text();
  if (!response.ok)
    throw new VerdictsUnavailable(
      `${url} answered ${response.status}: ${text.slice(0, 200) || response.statusText}`,
    );
  try {
    return shaped(JSON.parse(text), url);
  } catch (cause) {
    if (cause instanceof VerdictsUnavailable) throw cause;
    throw new VerdictsUnavailable(
      `${url} did not answer JSON: ${cause.message}`,
    );
  }
}
