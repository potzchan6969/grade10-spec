/**
 * One argument parser for the round's scripts: positional arguments, `--flag
 * value` or `--flag=value` options from a fixed set, boolean `--flag`s, and
 * `--help`. Every entry point under `scripts/openspec/` reads its arguments
 * through this; a copy of the loop beside one of them is what this exists to
 * stop.
 */

/**
 * `argv` parsed against `usage`'s own set: `keys` are options that take a
 * value (`--key value` or `--key=value`), `booleans` are options that do not.
 * `--help`/`-h` prints `usage` and exits 0; an option outside either set, or a
 * valued option given no value, prints its own message beside `usage` and
 * exits 1 — the same refusal every caller gave before this was one function.
 *
 * `prefix` opens that refusal: `::error::` for a script whose refusals a
 * workflow log reads as an annotation, nothing for the rest.
 */
export function parseArgs(argv, { keys = [], booleans = [], usage, prefix }) {
  const die = (message) => {
    console.error(`${prefix ?? ""}${message}`);
    process.exit(1);
  };
  const flags = {};
  const positional = [];
  for (let at = 0; at < argv.length; at += 1) {
    const arg = argv[at];
    if (arg === "--help" || arg === "-h") {
      console.log(usage);
      process.exit(0);
    }
    const bare = arg.startsWith("--") ? arg.slice(2) : null;
    if (bare && booleans.includes(bare)) {
      flags[bare] = true;
      continue;
    }
    const named = /^--([a-z-]+)(?:=([\s\S]*))?$/.exec(arg);
    if (named) {
      if (!keys.includes(named[1]))
        die(`unknown option --${named[1]}\n${usage}`);
      let value = named[2];
      if (value === undefined) {
        at += 1;
        value = argv[at];
      }
      if (value === undefined) die(`--${named[1]} needs a value\n${usage}`);
      flags[named[1]] = value;
      continue;
    }
    if (arg.startsWith("-")) die(`unknown option ${arg}\n${usage}`);
    positional.push(arg);
  }
  return { positional, flags };
}
