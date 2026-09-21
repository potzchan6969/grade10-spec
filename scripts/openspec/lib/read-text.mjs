/*
 * One read for a file the run may not have written yet.
 *
 * A file that is not there is an answer its callers hold: the first run of a
 * push has sent nothing, and a clone that has not landed the team map knows
 * nobody. Anything else the filesystem refuses — a path that is a directory,
 * a file the run may not open — says nothing about what the file holds, so it
 * stops the run rather than reading as empty.
 */
import { readFileSync } from "node:fs";

/** The file's text, or undefined where there is no such file. */
export function readTextIfThere(file) {
  try {
    return readFileSync(file, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw error;
  }
}
