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
 *
 * The text itself is read by `team-parse.mjs`, which imports nothing of
 * node's: the relay reads the same map from the code host at a sha, where
 * there is no file to open.
 */
import { join } from "node:path";
import { handleOf, isHandle } from "./handle.mjs";
import { readTextIfThere } from "./read-text.mjs";
import { parseTeamMap, TEAM_MAP } from "./team-parse.mjs";

/** All four pure, and read by a browser and by the relay as well as by this
 * reader — `handle.mjs`'s and `team-parse.mjs`'s own reason for existing
 * beside this file, which reads the map off disk. They are re-exported here
 * so the store's callers still have one module. */
export { handleOf, isHandle, parseTeamMap, TEAM_MAP };

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
  const text = readTextIfThere(join(root, path));
  if (text === undefined) return { handles: {}, channels: {} };
  return parseTeamMap(text);
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
