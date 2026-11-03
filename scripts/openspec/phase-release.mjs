#!/usr/bin/env node
/**
 * Release a phase - docs/prds/products/shared/planning/release-phases.md#releasing-a-phase.
 *
 *   pnpm phase:checked <phase> [--dry-run] [--verdicts <file>]
 *   pnpm phase:release <phase> [--date YYYY-MM-DD] [--verdicts <file>]
 *   pnpm phase:release <phase> --write --confirmed <fingerprint> [...]
 *
 * `checked` takes the 🚧 off the lines of every unit of the phase that has
 * passed, in one commit. `release` is a dry run until `--write`: what
 * launches, what moves to the next phase, the marks that come off, whether
 * the phase signs off and the fingerprint of all of it; written, with the
 * fingerprint a person confirmed, it folds `checked` in, records the release
 * date in phases.yaml, removes the phase's blocks and moves each unit not
 * passed, in one commit — or writes nothing where the plan differs from the
 * one confirmed or a launched line would stay under another phase's block.
 * Verdicts come from the run desk through the Access service token
 * (CF_ACCESS_CLIENT_ID, CF_ACCESS_CLIENT_SECRET, DESK_URL), or from a saved
 * answer with `--verdicts`.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { readPhases } from "../../tools/manual/src/api/phases.ts";
import { STEP_LABEL } from "../../tools/manual/src/api/readiness.ts";
import { loadVerdicts, VerdictsUnavailable } from "./lib/desk-verdicts.mjs";
import {
  checkedEdits,
  domainOf,
  editedPages,
  planPhase,
  plural,
  proveRelease,
  readEdited,
  readStore,
  releaseEdits,
  releaseFingerprint,
  writeReleased,
} from "./lib/phase-release.mjs";

const USAGE = [
  "usage: pnpm phase:checked <phase> [--dry-run] [--verdicts <file>]",
  "       pnpm phase:release <phase> [--date YYYY-MM-DD] [--verdicts <file>]",
  "       pnpm phase:release <phase> --write --confirmed <fingerprint> [--date YYYY-MM-DD] [--verdicts <file>]",
].join("\n");

class Refused extends Error {}

const git = (root, args) =>
  execFileSync("git", ["-C", root, ...args], { encoding: "utf8" });

function refuseDirty(root, files) {
  const dirty = git(root, ["status", "--porcelain", "--", ...files]).trim();
  if (dirty)
    throw new Refused(
      `commit or set aside the changes to these files first:\n${dirty}`,
    );
}

function commit(root, files, message) {
  git(root, ["add", "--", ...files]);
  git(root, ["commit", "--quiet", "-m", message, "--", ...files]);
  return git(root, ["rev-parse", "--short", "HEAD"]).trim();
}

function printMarks(edits) {
  for (const [path, list] of edits) {
    console.log(`  ${path}`);
    for (const edit of list)
      console.log(`    ${edit.at + 1}: ${edit.before.trim()}`);
  }
}

const countMarks = (edits) =>
  [...edits.values()].reduce((sum, list) => sum + list.length, 0);

const unitLine = (one) =>
  `  ${one.unit.priority}  ${one.name}  ${STEP_LABEL[one.readiness.step]}`;

function checked(root, store, plan, { dryRun }) {
  const keys = new Set(plan.passed.map((one) => one.unit.key));
  const edits = checkedEdits(store, keys);
  const count = countMarks(edits);
  console.log(
    `${plan.phase.name}: ${plural(plan.passed.length, "unit")} passed, ${plural(count, "line")} lose the 🚧`,
  );
  for (const one of plan.passed) console.log(unitLine(one));
  printMarks(edits);
  if (count === 0) return;
  const texts = editedPages(
    store,
    new Map([...edits].map(([path, marks]) => [path, { marks }])),
  );
  const after = readEdited(store, texts);
  for (const key of keys) {
    const unit = after.units.find((one) => one.key === key);
    if (unit && unit.building > 0)
      throw new Error(
        `${key} still has ${plural(unit.building, "line")} being built`,
      );
  }
  if (dryRun) {
    console.log(
      `\ndry run: nothing written — pnpm phase:checked ${plan.phase.id} writes it`,
    );
    return;
  }
  const files = [...texts.keys()];
  refuseDirty(root, files);
  for (const [path, text] of texts) writeFileSync(join(root, path), text);
  const message = [
    `docs(${domainOf(files)}): check ${plan.phase.name}'s passed units`,
    "",
    ...plan.passed.map((one) => `- ${one.unit.priority} ${one.name}`),
  ].join("\n");
  console.log(`\ncommitted ${commit(root, files, message)}`);
}

function release(root, store, plan, { write, date, verdictsFile, confirmed }) {
  const { phase, next } = plan;
  console.log(`Release ${phase.name} (${phase.id}) on ${date}\n`);
  console.log(`Launches (${plan.launches.length}):`);
  for (const one of plan.launches) console.log(unitLine(one));
  console.log(
    `\nMoves${next ? ` to ${next.name}` : ""} (${plan.moves.length}):`,
  );
  for (const one of plan.moves) console.log(unitLine(one));

  const stuck = !next && plan.moves.length > 0;
  const passed = new Set(plan.passed.map((one) => one.unit.key));
  const edits = stuck
    ? new Map(
        [...checkedEdits(store, passed)].map(([path, list]) => [
          path,
          { marks: list, ops: [], notes: [] },
        ]),
      )
    : releaseEdits(store, plan);
  const marks = new Map(
    [...edits].flatMap(([path, edit]) =>
      edit.marks.length > 0 ? [[path, edit.marks]] : [],
    ),
  );
  console.log(`\nMarks that come off (${countMarks(marks)}):`);
  printMarks(marks);
  console.log("\nBlocks:");
  for (const [path, edit] of edits)
    for (const note of edit.notes) console.log(`  ${path}: ${note}`);

  const texts = editedPages(store, edits);
  const stillPlaced = stuck
    ? []
    : proveRelease(store, plan, readEdited(store, texts));
  if (stillPlaced.length > 0) {
    console.log(
      "\nLaunching, yet no edit keeps these lines out of another phase's block — place them by hand:",
    );
    for (const one of stillPlaced)
      console.log(`  ${one.path}: \`${one.text}\` stays in ${one.phase}`);
  }

  if (plan.refusals.length > 0) {
    console.log("\nSign-off refused:");
    for (const reason of plan.refusals) console.log(`  - ${reason}`);
    if (write)
      throw new Refused(`${phase.name} does not sign off — nothing written`);
    return;
  }
  console.log(
    "\nSign-off: every P0 unit passed, no question in a unit that launches, no automated fail left untriaged",
  );
  if (stillPlaced.length > 0) {
    if (write)
      throw new Refused(
        `these launched lines stay under another phase's block, so nothing is written:\n${stillPlaced.map((one) => `  ${one.path}: \`${one.text}\` stays in ${one.phase}`).join("\n")}`,
      );
    console.log(
      "\ndry run: nothing written, and the release cannot be until each line above is placed",
    );
    return;
  }
  const fingerprint = releaseFingerprint(plan, date, texts);
  if (!write) {
    const confirm = [
      "pnpm phase:release",
      phase.id,
      "--write",
      "--date",
      date,
      ...(verdictsFile ? ["--verdicts", verdictsFile] : []),
      "--confirmed",
      fingerprint,
    ].join(" ");
    console.log(`\nFingerprint: ${fingerprint}`);
    console.log(
      `\ndry run: nothing written. Once a person confirms, run:\n  ${confirm}`,
    );
    return;
  }
  if (!confirmed)
    throw new Refused(
      "--write needs --confirmed <fingerprint>: dry-run it, show the person, then pass the fingerprint they confirmed",
    );
  if (confirmed !== fingerprint)
    throw new Refused(
      `this is not the release confirmed: its fingerprint is now ${fingerprint} — dry-run it again and show the person — nothing written`,
    );

  const registryPath = `${store.roots.manual}/phases.yaml`;
  const registry = writeReleased(
    readFileSync(join(root, registryPath), "utf8"),
    phase.id,
    date,
  );
  if (
    readPhases(registry).find((one) => one.id === phase.id)?.released !== date
  )
    throw new Error(`${registryPath}: \`released: ${date}\` did not read back`);
  const files = [registryPath, ...texts.keys()];
  refuseDirty(root, files);
  writeFileSync(join(root, registryPath), registry);
  for (const [path, text] of texts) writeFileSync(join(root, path), text);
  const message = [
    `docs(planning): release ${phase.name}`,
    "",
    `Released ${date}.`,
    "",
    "Released:",
    ...plan.launches.map((one) => `- ${one.unit.priority} ${one.name}`),
    ...(plan.moves.length > 0
      ? [
          "",
          `Moved to ${next.name}:`,
          ...plan.moves.map((one) => `- ${one.unit.priority} ${one.name}`),
        ]
      : []),
  ].join("\n");
  console.log(`\ncommitted ${commit(root, files, message)}`);
}

async function main(argv) {
  const [command, ...rest] = argv;
  if (command !== "checked" && command !== "release") throw new Refused(USAGE);
  let parsed;
  try {
    parsed = parseArgs({
      args: rest,
      allowPositionals: true,
      options: {
        "dry-run": { type: "boolean" },
        write: { type: "boolean" },
        date: { type: "string" },
        verdicts: { type: "string" },
        confirmed: { type: "string" },
      },
    });
  } catch (cause) {
    throw new Refused(`${cause.message}\n${USAGE}`);
  }
  const { values, positionals } = parsed;
  if (positionals.length !== 1) throw new Refused(USAGE);
  if (
    command === "checked" &&
    (values.write || values.date || values.confirmed)
  )
    throw new Refused(`phase:checked writes unless --dry-run\n${USAGE}`);
  if (command === "release" && values.write && values["dry-run"])
    throw new Refused("--write and --dry-run together");
  const date = values.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Refused("--date is YYYY-MM-DD");

  const root = process.cwd();
  const store = readStore(root);
  const verdicts = await loadVerdicts({ file: values.verdicts });
  const plan = planPhase(store, positionals[0], verdicts);
  if (command === "checked") {
    if (plan.phase.released)
      throw new Refused(
        `${plan.phase.name} was released ${plan.phase.released}`,
      );
    checked(root, store, plan, { dryRun: Boolean(values["dry-run"]) });
  } else {
    release(root, store, plan, {
      write: Boolean(values.write),
      date,
      verdictsFile: values.verdicts,
      confirmed: values.confirmed,
    });
  }
}

main(process.argv.slice(2)).catch((cause) => {
  if (cause instanceof Refused || cause instanceof VerdictsUnavailable) {
    console.error(cause.message);
    process.exit(cause instanceof Refused && cause.message === USAGE ? 2 : 1);
  }
  console.error(cause);
  process.exit(1);
});
