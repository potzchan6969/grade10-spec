#!/usr/bin/env node
// One package turns an instant into text: `@grade10/date`. The application
// holds the same rule over its own sources; this holds it here, where the
// invoice PDF, the emails and a calendar each grew a formatter of their own
// because nothing refused the first.
//
// Dates only. A number or an amount is `toLocaleString`'s to format, and
// `tools/` is the manual's own scripts, which show no collector or operator a
// date.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Where a check looks, and the one place the library may be reached. */
export const SCOPE = ["packages/", "apps/"];
export const OWNER = "packages/date/";

export const RULES = [
  {
    pattern: /\bIntl\.DateTimeFormat\b/,
    why: "formats a date itself - call the shape it needs from @grade10/date",
  },
  {
    pattern: /\.toLocale(?:Date|Time)String\s*\(/,
    why: "renders a date on the reader's machine - @grade10/date states one format",
  },
  {
    // `from "x"`, a bare `import "x"`, a dynamic `import("x")` and
    // `require("x")` alike: a rule that only knew the first would have a way
    // around it.
    pattern:
      /(?:from|import|require)\s*\(?\s*["'](?:date-fns|@date-fns\/tz)(?:\/[^"']*)?["']/,
    why: "reaches the date library directly - the shapes are @grade10/date's",
  },
];

const SOURCE = /\.(?:[cm]?[jt]sx?)$/;

/** Whether a repository path is read by the check. */
export function isChecked(path) {
  return (
    SOURCE.test(path) &&
    SCOPE.some((root) => path.startsWith(root)) &&
    !path.startsWith(OWNER) &&
    !path.includes("/node_modules/")
  );
}

/** Every line of `files` ([{ path, text }]) that formats a date by hand. */
export function findings(files) {
  const found = [];
  for (const { path, text } of files) {
    if (!isChecked(path)) continue;
    for (const [index, line] of text.split("\n").entries()) {
      for (const rule of RULES) {
        if (rule.pattern.test(line)) {
          found.push(`${path}:${index + 1} ${rule.why}`);
        }
      }
    }
  }
  return found;
}

function main() {
  const paths = execFileSync("git", ["ls-files", "-z"], {
    cwd: ROOT,
    maxBuffer: 256 * 1024 * 1024,
  })
    .toString()
    .split("\0")
    // A path git still lists but the tree no longer holds is a pending delete.
    .filter((path) => isChecked(path) && existsSync(resolve(ROOT, path)));
  const failures = findings(
    paths.map((path) => ({
      path,
      text: readFileSync(resolve(ROOT, path), "utf8"),
    })),
  );
  if (failures.length > 0) {
    console.error("Date check failed:\n");
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    console.error(
      `\n${failures.length} place(s) formatting their own dates. Use @grade10/date.`,
    );
    process.exit(1);
  }
  console.log(
    `Dates OK - ${paths.length} source file(s) format through ${OWNER}.`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
