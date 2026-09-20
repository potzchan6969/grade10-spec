/*
 * The team map's text, read to a map: the half of `team.mjs` that touches no
 * file.
 *
 * Its own module, for `handle.mjs`'s reason. `team.mjs` imports `node:fs` to
 * find the file, and the relay — a Worker, which has no file system and no
 * `node:*` at all — reads the same map from the code host at a sha. So the
 * reading of the text lives here, `team.mjs` reads the file and calls it, and
 * one parser answers both: a rename the store refuses is a rename the relay
 * refuses, and neither has its own idea of what the file says.
 */
import YAML from "yaml";
import { handleOf } from "./handle.mjs";

/** Where the map lives while Operations' own item is open. */
export const TEAM_MAP = "docs/prds/team.yaml";

/**
 * The store's team map: one entry per handle, one channel per role.
 *
 * Empty text is a map that knows nobody, which is an answer and not a
 * failure — a clone that has not landed the file yet, and a fixture store
 * that has no people in it, both read that way. Text that is there and says
 * something wrong about who is told stops the caller and names the line.
 */
export function parseTeamMap(text) {
  let parsed;
  try {
    parsed = YAML.parse(text) ?? {};
  } catch (cause) {
    throw new Error(`${TEAM_MAP} is not valid YAML: ${cause.message}`);
  }
  if (!isMapping(parsed)) throw new Error(`${TEAM_MAP} must be a mapping`);

  const handles = {};
  for (const [handle, entry] of Object.entries(
    mappingOf(parsed.handles, "handles"),
  )) {
    if (!isMapping(entry)) {
      throw new Error(
        `${TEAM_MAP}: \`handles.${handle}\` must carry that person's e-mail, Slack member and roles`,
      );
    }
    const spelled = handleOf(handle);
    // Two spellings of one handle are one person written twice: the second
    // entry would silently replace the first, and whichever e-mail and roles
    // survived would be whichever the file happened to list last.
    if (spelled in handles) {
      throw new Error(
        `${TEAM_MAP}: \`handles.${handle}\` is \`${spelled}\` again - one entry per person`,
      );
    }
    const email = line(entry.email, `handles.${handle}.email`);
    const slack = line(entry.slack, `handles.${handle}.slack`);
    handles[spelled] = {
      // An address is matched case-insensitively, so it is held one way.
      ...(email ? { email: email.toLowerCase() } : {}),
      ...(slack ? { slack } : {}),
      roles: roles(entry.roles, `handles.${handle}.roles`),
    };
  }

  const channels = {};
  for (const [role, id] of Object.entries(
    mappingOf(parsed.channels, "channels"),
  )) {
    const written = line(id, `channels.${role}`);
    if (!written) {
      throw new Error(
        `${TEAM_MAP}: \`channels.${role}\` must name one channel`,
      );
    }
    channels[role] = written;
  }

  return { handles, channels };
}

const isMapping = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function mappingOf(value, key) {
  if (value === undefined || value === null) return {};
  if (!isMapping(value)) {
    throw new Error(`${TEAM_MAP}: \`${key}\` must be a mapping`);
  }
  return value;
}

/** A written line, or nothing where the key is absent or blank. Anything but
 * text is a malformed map, for the reason a record's key is. */
function line(value, key) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new Error(`${TEAM_MAP}: \`${key}\` must be a line of text`);
  }
  return value.trim() === "" ? undefined : value.trim();
}

function roles(value, key) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.some((one) => typeof one !== "string")) {
    throw new Error(`${TEAM_MAP}: \`${key}\` must be a list of roles`);
  }
  return value.map((one) => one.trim());
}
