/**
 * The journeys a flow can cite: every `### <id>: <title>` heading in a
 * `user-journeys.md` beside a spec, durable or in an active change. A flow
 * names the ids it walks in `parameters.journeys`, so the check can refuse an
 * id nobody wrote and the coverage report can count what is walked.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { rootDirectory } from "./story-index.mjs";

// Both id spellings in the store: the legacy `<path>-US-<n>` and the current
// `<app>.<domain>-<capability>.US<n>` of openspec/config.yaml.
const HEADING = /^###\s+([a-z0-9][a-z0-9.-]*[.-]US-?\d+):\s*(.+)$/gm;
const NOBODY = /\*\*Walked by:\*\*\s*nobody/i;
const ROLE = /\*\*As an?\*\*\s+([^,\n]+)/;
/** Roles the workbench does not draw for: operators, staff, machines. */
const BEHIND_THE_COUNTER =
  /^(?!.*\bor\b).*\b(operator|staff|auditor|treasurer|admin|crawler|fetcher|stock keeper|engineer|maker|developer|job)\b/i;
const WORKBENCH = /^(grade10-site\/|shared\/auth\/)/;

function journeyFiles(root, directory) {
  let entries;
  try {
    entries = readdirSync(join(root, directory), { recursive: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return entries
    .map((entry) => entry.split("\\").join("/"))
    .filter((entry) => entry.endsWith("/user-journeys.md"))
    .map((entry) => `${directory}/${entry}`);
}

/**
 * `{ journeys, capabilities }`. `journeys` maps an id to its capability, its
 * title and whether only an active change holds it. `capabilities` maps each
 * workbench capability (`grade10-site/…` or `shared/auth/…`) to its durable
 * journey ids, and `nobody` when it declares no one walks it.
 */
export function readJourneys(root = rootDirectory) {
  const journeys = new Map();
  const capabilities = new Map();
  const read = (path, capability, durable) => {
    const text = readFileSync(join(root, path), "utf8");
    const ids = [];
    const headings = [...text.matchAll(HEADING)];
    headings.forEach((match, index) => {
      const [, id, title] = match;
      const body = text.slice(match.index, headings[index + 1]?.index);
      const role = ROLE.exec(body)?.[1].trim() ?? "";
      const collector = !BEHIND_THE_COUNTER.test(role);
      ids.push(id);
      if (!journeys.has(id) || durable)
        journeys.set(id, {
          id,
          title: title.trim(),
          role,
          collector,
          capability,
          durable,
          path,
        });
    });
    if (durable && WORKBENCH.test(capability))
      capabilities.set(capability, { ids, nobody: NOBODY.test(text) });
  };

  for (const path of journeyFiles(root, "openspec/specs"))
    read(
      path,
      path.slice("openspec/specs/".length, -"/user-journeys.md".length),
      true,
    );

  let changes = [];
  try {
    changes = readdirSync(join(root, "openspec/changes"), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {}
  for (const change of changes) {
    if (change === "archive") continue;
    const directory = `openspec/changes/${change}/specs`;
    for (const path of journeyFiles(root, directory)) {
      const capability = path.slice(
        directory.length + 1,
        -"/user-journeys.md".length,
      );
      read(path, capability, false);
    }
  }
  return { journeys, capabilities };
}

/** Every journey id one parsed story file cites, meta and stories together. */
export function citedJourneys(file) {
  return [
    ...new Set([
      ...(file.journeys ?? []),
      ...(file.stories ?? []).flatMap((story) => story.journeys ?? []),
    ]),
  ];
}

const REQUIREMENT = /^###\s+Requirement:\s*(.+)$/gm;

/**
 * The requirement titles of a capability, durable or in an active change:
 * what a Flow's `parameters.rules` cites as `"<capability>: <title>"`.
 */
export function requirementTitles(root, capability) {
  const paths = [`openspec/specs/${capability}/spec.md`];
  let changes = [];
  try {
    changes = readdirSync(join(root, "openspec/changes"));
  } catch {}
  for (const change of changes)
    if (change !== "archive")
      paths.push(`openspec/changes/${change}/specs/${capability}/spec.md`);
  const titles = new Set();
  for (const path of paths) {
    let text;
    try {
      text = readFileSync(join(root, path), "utf8");
    } catch {
      continue;
    }
    for (const [, title] of text.matchAll(REQUIREMENT))
      titles.add(title.trim());
  }
  return titles;
}

/** `"<capability>: <requirement title>"` as `{ capability, title }`. */
export function parseRule(rule) {
  const at = rule.indexOf(": ");
  return at < 0
    ? null
    : { capability: rule.slice(0, at), title: rule.slice(at + 2).trim() };
}
