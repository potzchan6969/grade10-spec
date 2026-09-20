/**
 * Where a change's own files live in the store. Spelled once: the landing
 * checks read the record at a sha, the room reads it on `main` for the thread,
 * and a path spelled twice is two readings of one file waiting to disagree.
 */

/** The change's directory, with no trailing slash: everything a landing may
 * write besides the pages. */
export const changeDir = (change: string): string =>
  `openspec/changes/${change}`;

/** The change's record, which carries its hands, its landings, its read
 * again and its thread. */
export const recordPath = (change: string): string =>
  `${changeDir(change)}/.openspec.yaml`;

/** The planning schema, which a landing's role is read from. */
export const SCHEMA_PATH = "openspec/schemas/grade10-planning/schema.yaml";
