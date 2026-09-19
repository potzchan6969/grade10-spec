#!/usr/bin/env node
/**
 * The readers of one draft, and the bundle each one is given:
 *
 *   node scripts/openspec/perspectives.mjs <change> <artifact|group> --diff <file>
 *   node scripts/openspec/perspectives.mjs <artifact|group> --diff <file>
 *
 * The `round` skill calls this at its Challenge step. It prints
 *
 *   { "readers": [{ "name", "agent", "when", "summonedBy" }], "verifier": <bool>, "bundle": { "draft", "upstream" } }
 *
 * - **readers** — the perspectives the draft's own diff summons, plus every
 *   `always`, one dispatch per perspective's own `name` — several may share
 *   an agent, and each is still its own dispatch
 * - **summonedBy** — what the draft raised for that reader, empty for one
 *   dispatched because it always runs
 * - **verifier** — whether a verifier reads the findings: a round that
 *   summoned one challenger dispatches none, and that reader argues its own
 * - **bundle** — the draft, and what is before it: the artifact's `upstream:`
 *   set as the change wrote it, and the page sections the proposal marks
 *
 * The size is read from the draft. No key of the change's record is read for
 * that, so none can add a reader or remove one; a size somebody believes is
 * wrong is a question for the interview. The schema the readers themselves
 * come from is the one exception: it is read from the change's own `schema:`,
 * falling back to the store's default where the change names none — one
 * workflow schema exists today, so this is latent until a second one does. A
 * record nobody can parse is refused, naming the file; the store's default is
 * not what a change with a broken record meant.
 *
 * The change may be left out where `--change` names it or the branch is
 * `change/<id>`. `--root` reads a store other than this one, which is how the
 * tests read a fixture.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { parseArgs } from "./lib/args.mjs";
import {
  bundleFor,
  classifyDiff,
  planningSchema,
  readersFor,
  SCHEMA,
  verifierNeeded,
} from "./lib/perspectives.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: node scripts/openspec/perspectives.mjs [<change>] <artifact|group> --diff <file> [--root <dir>]";

const { positional, flags } = parseArgs(process.argv.slice(2), {
  keys: ["diff", "root", "change"],
  usage: USAGE,
});

const root = flags.root ?? join(HERE, "..", "..");
const target = positional.length > 1 ? positional[1] : positional[0];
const change =
  positional.length > 1 ? positional[0] : (flags.change ?? onBranch(root));

if (!target) fail(USAGE);
if (!change)
  fail(
    `name the change: a first argument, --change <id>, or a branch called change/<id>\n${USAGE}`,
  );
if (!existsSync(join(root, "openspec", "changes", change)))
  fail(`no change ${change} in ${root}/openspec/changes`);
if (flags.diff !== undefined && !existsSync(flags.diff))
  fail(`no diff at ${flags.diff}`);

// A round with no diff yet is a round on an untouched draft: the floor reads
// it and nothing else is summoned.
const diff = flags.diff === undefined ? "" : readFileSync(flags.diff, "utf8");
const schema = planningSchema(root, schemaOf(root, change));
const triggers = classifyDiff(diff, schema, target);
const readers = readersFor(schema, target, triggers);

console.log(
  JSON.stringify(
    {
      readers: readers.map(({ name, agent, when, summonedBy }) => ({
        name,
        agent,
        when,
        summonedBy,
      })),
      verifier: verifierNeeded(readers),
      bundle: bundleFor(root, change, target, schema),
    },
    null,
    2,
  ),
);

/** The schema the change's own record names, or the store's default where it
 * names none — a change opened before `schema:` was written still gets a
 * schema to read readers from. A record that will not parse is refused,
 * naming the file: read as the default it gave the round the readers of a
 * schema the change never named. */
function schemaOf(store, change) {
  const file = join(store, "openspec", "changes", change, ".openspec.yaml");
  if (!existsSync(file)) return SCHEMA;
  let parsed;
  try {
    parsed = YAML.parse(readFileSync(file, "utf8")) ?? {};
  } catch (error) {
    fail(`${relative(store, file)} is not YAML: ${error.message}`);
  }
  const named = typeof parsed.schema === "string" ? parsed.schema.trim() : "";
  return named === "" ? SCHEMA : named;
}

/** The change a round is on, from the branch it drafts on. */
function onBranch(store) {
  try {
    const branch = execFileSync(
      "git",
      ["-C", store, "rev-parse", "--abbrev-ref", "HEAD"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    const named = /^change\/(.+)$/.exec(branch);
    return named ? named[1] : undefined;
  } catch {
    return undefined;
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
