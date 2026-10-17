#!/usr/bin/env node
/**
 * Issue the next journey, scenario or case id, and move a branch's ids that
 * the published `main` already holds — so nobody counts "the next unused" by
 * hand (`allocate-ids-across-open-changes`).
 *
 *   pnpm run spec:issue <prefix> US             # the next journey of a capability
 *   pnpm run spec:issue <prefix> SC             # the next scenario
 *   pnpm run spec:issue <journey id> TC         # the next case of a journey
 *   pnpm run spec:issue <id> letter             # the next letter beside an id
 *   pnpm run spec:issue move <change>           # move the change's ids main holds
 *
 * Every reading takes the branch's own tree and the fetched `main` together,
 * and prints the commit of `main` it read. `move` rewrites every id built from
 * a moved one inside the change, in both spellings - `US-07` and `US7` - and
 * nothing outside it: nothing outside a change cites an id it has not landed.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import {
  heldElsewhere,
  issuedIds,
  issuedIdsIn,
  issuedKey,
  issuing,
} from "../../tools/manual/src/store/issued-ids.mts";
import { parseArgs } from "./lib/args.mjs";
import { git, storeMain } from "./store-main.mjs";

const USAGE =
  "usage: pnpm run spec:issue <prefix> US|SC | <journey id> TC | <id> letter | move <change> [--root <dir>] [--no-fetch]";

/** The ids the fetched `main` issues, read off its tree in one batch. */
export function issuedAtMain(root, { fetch = true } = {}) {
  const main = storeMain(root, { fetch });
  if (!main) return { main: undefined, ids: [] };
  const listed =
    git(root, [
      "ls-tree",
      "-r",
      "--name-only",
      main.commit,
      "--",
      "openspec/specs",
      "openspec/changes",
    ]) ?? "";
  const paths = listed.split("\n").filter((path) => path && issuing(path));
  const out = spawnSync("git", ["cat-file", "--batch"], {
    cwd: root,
    input: `${paths.map((path) => `${main.commit}:${path}`).join("\n")}\n`,
    maxBuffer: 1024 * 1024 * 1024,
  });
  if (out.status !== 0)
    throw new Error(`git cat-file refused: ${out.stderr.toString().trim()}`);
  const buffer = out.stdout;
  const files = [];
  let offset = 0;
  for (const path of paths) {
    const end = buffer.indexOf(0x0a, offset);
    const header = buffer.toString("utf8", offset, end);
    offset = end + 1;
    const size = /^[0-9a-f]+ blob (\d+)$/.exec(header)?.[1];
    if (size === undefined) continue;
    files.push({
      path,
      text: buffer.toString("utf8", offset, offset + Number(size)),
    });
    offset += Number(size) + 1;
  }
  return { main, ids: issuedIdsIn(files) };
}

/** The branch's ids and `main`'s, one list, a path `main` holds read once. */
function everyIssued(root, fetch) {
  const atMain = issuedAtMain(root, { fetch });
  const here = issuedIds(root);
  return { main: atMain.main, ids: [...atMain.ids, ...here] };
}

/** The number an id ends on, in whichever spelling it is written. */
const numberOf = (id, kind) =>
  Number(new RegExp(`${kind}-?0*(\\d+)[a-z]?(?:-\\d+)?$`).exec(id)?.[1] ?? 0);

/** The next journey or scenario of a capability. */
export function nextOf(ids, prefix, kind) {
  const dotted = prefix.includes(".");
  const mine = ids.filter(
    (one) =>
      one.kind === kind &&
      (dotted
        ? one.id.startsWith(`${prefix}.${kind}`)
        : new RegExp(`^${escapeRegExp(prefix)}-${kind}-\\d`).test(one.id)),
  );
  const next = Math.max(0, ...mine.map((one) => numberOf(one.id, kind))) + 1;
  return dotted
    ? `${prefix}.${kind}${next}`
    : `${prefix}-${kind}-${String(next).padStart(2, "0")}`;
}

/** The next case of one journey, at any suite level. */
export function nextCaseOf(ids, journey) {
  const { prefix, number, dotted } = journeyParts(journey);
  const stem = dotted ? `${prefix}.US${number}-TC` : `${prefix}-US${number}-TC`;
  const mine = ids.filter(
    (one) =>
      one.kind === "TC" &&
      one.id.replace(/-US-0*(\d+)/, "-US$1").startsWith(stem),
  );
  const next =
    Math.max(
      0,
      ...mine.map((one) =>
        Number(/TC-?(\d+)/.exec(one.id.slice(stem.length - 2))?.[1] ?? 0),
      ),
    ) + 1;
  return dotted ? `${stem}${next}` : `${stem}${next}-1`;
}

/** The next unused letter beside a named id. */
export function nextLetterOf(ids, id) {
  const held = new Set(ids.map((one) => one.key));
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    const candidate = `${id}${letter}`;
    if (!held.has(candidate.toLowerCase())) return candidate;
  }
  throw new Error(`every letter beside ${id} is taken`);
}

function journeyParts(journey) {
  const dotted = /^(.+)\.US(\d+)$/.exec(journey);
  if (dotted)
    return { prefix: dotted[1], number: Number(dotted[2]), dotted: true };
  const plain = /^(.+)-US-?(\d+)$/.exec(journey);
  if (plain)
    return { prefix: plain[1], number: Number(plain[2]), dotted: false };
  throw new Error(`${journey} is no journey id`);
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The change's ids `main` holds elsewhere, each with the id it moves to:
 * above every id of its kind and prefix the branch and `main` hold together,
 * in the order the change issues them. A moved journey takes its cases with
 * it, so a journey's own cases are not moved twice.
 */
export function movesOf(change, here, atMain, accepted = false) {
  // Journeys first: a moved journey takes its cases with it.
  const order = { US: 0, SC: 1, TC: 2 };
  const clashes = clashesOf(change, here, atMain, accepted)
    .map(({ id }) => id)
    .sort((a, b) => order[a.kind] - order[b.kind]);
  const all = [...here, ...atMain];
  const moves = new Map();
  const taken = [...all];
  const movedJourneys = new Set();
  for (const one of clashes) {
    if (
      one.kind === "TC" &&
      movedJourneys.has(issuedKey(journeyOfCase(one.id)))
    )
      continue;
    if (one.kind === "US") movedJourneys.add(one.key);
    const to =
      one.kind === "TC"
        ? nextCaseOf(taken, journeyOfCase(one.id))
        : nextOf(taken, prefixOf(one.id, one.kind), one.kind);
    moves.set(one.id, to);
    taken.push({ ...one, id: to, key: to.toLowerCase() });
  }
  return moves;
}

function prefixOf(id, kind) {
  return id.replace(new RegExp(`(?:-${kind}-|\\.${kind})\\d+[a-z]?$`), "");
}

function journeyOfCase(id) {
  const dotted = /^(.+\.US\d+)-TC\d+$/.exec(id);
  if (dotted) return dotted[1];
  const plain = /^(.+)-US-?(\d+)[a-z]?-TC-?\d+(?:-\d+)?$/.exec(id);
  if (!plain) throw new Error(`${id} is no case id`);
  return `${plain[1]}-US-${plain[2].padStart(2, "0")}`;
}

/**
 * Every spelling a moved id is cited by inside a change, against the text it
 * becomes: a journey in its canonical and its compact form and every case id
 * built from it, a scenario or a case as written.
 */
export function rewritesOf(moves) {
  const pairs = [];
  for (const [from, to] of moves) {
    pairs.push([from, to]);
    const journey = /^(.+)-US-0*(\d+)$/.exec(from);
    const target = /^(.+)-US-0*(\d+)$/.exec(to);
    if (journey && target) {
      pairs.push([
        `${journey[1]}-US${journey[2]}-`,
        `${target[1]}-US${target[2]}-`,
      ]);
      pairs.push([
        `${journey[1]}-US-${journey[2]}-`,
        `${target[1]}-US-${target[2]}-`,
      ]);
    }
    const dotted = /^(.+)\.US(\d+)$/.exec(from);
    const dottedTo = /^(.+)\.US(\d+)$/.exec(to);
    if (dotted && dottedTo)
      pairs.push([
        `${dotted[1]}.US${dotted[2]}-`,
        `${dottedTo[1]}.US${dottedTo[2]}-`,
      ]);
  }
  return pairs;
}

/**
 * The ids `change` issues on this branch that another place issues on `main`
 * as the branch would leave it — a file the branch holds read as the branch
 * holds it, so an id another change already moved here is not held twice. An
 * accepted change's own ids are the durable specs' already.
 */
export function clashesOf(change, here, atMain, accepted = false) {
  const mine = here.filter((one) => one.where === change);
  const branchFiles = new Set(here.map((one) => one.file));
  const others = [
    ...atMain.filter((one) => !branchFiles.has(one.file)),
    ...here,
  ].filter(
    (one) => one.where !== change && !(accepted && one.where === "durable"),
  );
  return heldElsewhere(mine, others);
}

/** What acceptance refuses: each id the change issues that the fetched
 * `main` already holds, with who holds it, worded with the command that
 * moves it. */
export function idsMainHolds(
  root,
  change,
  { fetch = true, accepted = false } = {},
) {
  const atMain = issuedAtMain(root, { fetch });
  if (!atMain.main) return [];
  return clashesOf(change, issuedIds(root), atMain.ids, accepted).map(
    ({ id, by }) =>
      `\`${id.id}\` is issued by ${by.where === "durable" ? "the durable specs" : `\`${by.where}\``} on main at ${atMain.main.commit.slice(0, 7)} — move this change's ids with \`pnpm run spec:issue move ${change}\``,
  );
}

/** One text with every moved id rewritten, bounded so `SC-1` never rewrites
 * `SC-12`. */
export function rewrite(text, pairs) {
  let out = text;
  for (const [from, to] of pairs) {
    const tail = from.endsWith("-") ? "" : "(?![\\w])";
    out = out.replace(
      new RegExp(`(?<![\\w.-])${escapeRegExp(from)}${tail}`, "g"),
      `\u0000${to}`,
    );
  }
  return out.replaceAll("\u0000", "");
}

function filesUnder(dir) {
  const found = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) found.push(...filesUnder(path));
    else found.push(path);
  }
  return found;
}

async function main(argv) {
  const { flags, positional } = parseArgs(argv, {
    keys: ["root"],
    booleans: ["no-fetch"],
    usage: USAGE,
  });
  const root = flags.root ?? process.cwd();
  const fetch = !flags["no-fetch"];
  const [first, second] = positional;
  if (!first || !second) {
    console.error(USAGE);
    return 2;
  }
  if (first === "move") {
    const change = second;
    const atMain = issuedAtMain(root, { fetch });
    const here = issuedIds(root);
    const accepted = statSafe(
      join(root, "openspec/changes", change, "acceptance.json"),
    );
    const moves = movesOf(change, here, atMain.ids, accepted);
    console.log(`read main at ${atMain.main?.commit ?? "(no main)"}`);
    if (moves.size === 0) {
      console.log(`${change} issues no id main holds elsewhere; nothing moved`);
      return 0;
    }
    const pairs = rewritesOf(moves);
    const dir = join(root, "openspec/changes", change);
    for (const file of filesUnder(dir)) {
      if (!/\.(md|ya?ml|json)$/.test(file)) continue;
      const text = readFileSync(file, "utf8");
      const next = rewrite(text, pairs);
      if (next !== text) {
        writeFileSync(file, next);
        console.log(`  rewrote ${relative(root, file)}`);
      }
    }
    for (const [from, to] of moves) console.log(`  ${from} → ${to}`);
    return 0;
  }
  const { main: read, ids } = everyIssued(root, fetch);
  let issued;
  if (second === "US" || second === "SC") issued = nextOf(ids, first, second);
  else if (second === "TC") issued = nextCaseOf(ids, first);
  else if (second === "letter") issued = nextLetterOf(ids, first);
  else {
    console.error(USAGE);
    return 2;
  }
  console.log(issued);
  console.error(`read the branch and main at ${read?.commit ?? "(no main)"}`);
  return 0;
}

function statSafe(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await main(process.argv.slice(2));
}
