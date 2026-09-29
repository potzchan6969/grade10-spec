/*
 * One evaluation for every entry: a commit's stops, its people and its
 * `Design-Override:` reason, read from the commit alone.
 */
import { readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseTeamMap, TEAM_MAP } from "../openspec/lib/team-parse.mjs";
import { git, requireGit } from "./git.mjs";
import { lookStops } from "./look.mjs";
import { mergeStops } from "./merge.mjs";
import { readMessage } from "./message.mjs";

const STORE = realpathSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "../.."),
);
const STORE_PATHS = [
  "packages/ui/src/blocks",
  "packages/design-system/src/components",
  "packages/design-system/tokens.json",
  "apps/preview/src/pages",
];
export const CONFIG = "design-override.config.json";

function readFile(path, what) {
  try {
    return readFileSync(path, "utf8");
  } catch (cause) {
    throw new Error(`could not read ${what}: ${cause.message}`);
  }
}

function sitesOf(root) {
  try {
    const { sites } = JSON.parse(readFileSync(join(root, CONFIG), "utf8"));
    if (!Array.isArray(sites))
      throw new Error("`sites` must be a list of pathspecs");
    return sites;
  } catch (cause) {
    throw new Error(`could not read ${CONFIG}: ${cause.message}`);
  }
}

/** The watched paths for the repository the check runs in, and who the designers are. */
export function loadSettings() {
  requireGit();
  const root = realpathSync(git(["rev-parse", "--show-toplevel"]).trim());
  const paths =
    root === STORE
      ? { look: STORE_PATHS, merge: STORE_PATHS }
      : { look: [], merge: sitesOf(root) };
  const team = parseTeamMap(readFile(join(STORE, TEAM_MAP), TEAM_MAP));
  const designers = Object.entries(team.handles)
    .filter(([, member]) => member.roles.includes("design"))
    .map(([handle, member]) => ({ handle, email: member.email }));
  return { ...paths, designers };
}

export function evaluate(settings, sha) {
  const [parents, author, committer, subject, ...body] = git([
    "log",
    "-1",
    "--format=%P%n%ae%n%ce%n%s%n%B",
    sha,
  ]).split("\n");
  const { override, coAuthors } = readMessage(body.join("\n"));
  const people = [author, committer]
    .map((email) => email.toLowerCase())
    .concat(coAuthors);
  const exempt = settings.designers.some(({ email }) => people.includes(email));
  const heads = parents.split(" ").filter(Boolean);
  const rule = heads.length > 1 ? "merge" : "look";
  let stops = [];
  if (rule === "merge") stops = mergeStops(heads, sha, settings.merge);
  else if (heads.length === 1 && !exempt)
    stops = lookStops(heads[0], sha, settings.look);
  stops.sort((a, b) => a.file.localeCompare(b.file) || (a.n ?? 0) - (b.n ?? 0));
  return {
    sha,
    subject,
    rule,
    stops,
    override,
    stopped: stops.length > 0 && !override,
  };
}
