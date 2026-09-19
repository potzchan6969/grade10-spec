/*
 * One map turns a handle into a person and a role into somewhere to post.
 *
 * `docs/prds/team.yaml` is the file and this is its only reader: the manual's
 * snapshot imports it so a surface can name a hand, the notify script imports
 * it so a message can be addressed, and the landing imports it to resolve the
 * pusher's `git config user.email` into the handle the record names. One
 * reader, because three would answer a rename three ways.
 *
 * It takes a root rather than a path, so the day Operations gives the map a
 * home of its own is one constant here; a caller that was handed another
 * path — a script's `--team`, a fixture's own map — passes it beside the
 * root rather than reading the file itself.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";

/** Where the map lives while Operations' own item is open. */
export const TEAM_MAP = "docs/prds/team.yaml";

/**
 * The hands a change passes through, in the order it passes through them.
 *
 * Here because both halves read it: the record's rules refuse a `hands:` key
 * that is not one of these, and the manual's `Role` is these six. The manual
 * mirrors the list in `src/api/types.ts` rather than importing it, because the
 * app is bundled for a browser and this module reads a file; `team-map.test.ts`
 * holds the two to each other.
 */
export const ROLES = ["pm", "design", "tech", "qa", "dev", "release"];

/**
 * The store's team map: one entry per handle, one channel per role.
 *
 * A store with no map knows nobody, which is an answer and not a failure — a
 * clone that has not landed the file yet, and a fixture store that has no
 * people in it, both read that way, and every caller already has a path for a
 * handle the map does not name. A map that is there and cannot be read is the
 * other thing entirely: it says something wrong about who is told, so it stops
 * the run and says which line.
 */
export function readTeamMap(root, path = TEAM_MAP) {
  const file = join(root, path);
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    return { handles: {}, channels: {} };
  }

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

/** The person a handle names, however the record spelled it; nobody where the
 * map does not name it. A handle the map holds with no `slack` is sent no
 * message, which is what its absence says. */
export function memberOf(map, handle) {
  return map.handles[handleOf(handle)];
}

/** Where a role is posted to when the change names no hand for it. */
export function channelOf(map, role) {
  return map.channels[role];
}

/** The handle whose e-mail this is — what `git config user.email` resolves
 * through, so a landing can say whose word it was. */
export function handleOfEmail(map, email) {
  const wanted = String(email).trim().toLowerCase();
  for (const [handle, member] of Object.entries(map.handles)) {
    if (member.email === wanted) return handle;
  }
  return undefined;
}

/**
 * A handle as every reader in this store spells it: no leading `@`, no case.
 *
 * One spelling, here, because the map is keyed by it and the record's
 * `hands:`, `landed_by:`, `owner:` and owner tags are all matched against it —
 * two readers that trimmed differently would disagree about whether the store
 * knows a person.
 */
export const handleOf = (handle) =>
  String(handle).replace(/^@/, "").trim().toLowerCase();

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
