/*
 * One read for a file that may not be there.
 *
 * A file that is not there reads as undefined, and the caller says what
 * nothing means. Every other refusal — a path that is a directory, a file the
 * run may not open — says nothing about what the file holds, so the read
 * throws and names the file, which is all the operator has to go on.
 */
import { readFileSync } from "node:fs";

/** The file's text, or undefined where there is no such file. */
export function readTextIfThere(file) {
  try {
    return readFileSync(file, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw new Error(`${file} cannot be read: ${error.message}`, {
      cause: error,
    });
  }
}
