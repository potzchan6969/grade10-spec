import { join } from "node:path";
import type {
  CheckWarning,
  DesignSyncClass,
  DesignSyncReport,
} from "../api/types.ts";
import { type FrameCard, setsReached } from "../blocks/design-drift.ts";
import { type Block, parsePage } from "../content/grammar.ts";
import { readText, readTextIfExists, walkFiles } from "./disk.mts";
import type { Roots } from "./roots.mts";

/** Where `design-sync:check --report` leaves its verdict and where the nightly
 * workflow commits it. Generated, never authored, so it sits outside
 * the manual directory — the manual only reads it. */
export const DESIGN_SYNC_REPORT = ".design-sync/report.json";

const CLASSES = new Set<string>(["ok", "warn", "skipped", "fail"]);

/** The nightly is the only thing keeping the report true, so a report older
 * than a week of nights is not a verdict — it is a stopped clock, and it reads
 * as "no drift" to everyone. */
const STALE_AFTER_DAYS = 8;

function refuse(why: string): never {
  throw new Error(`${DESIGN_SYNC_REPORT} ${why}`);
}

const isMapping = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Optional by design: a store that has never run the check has no file, and the
 * cards simply badge nothing. A file that is there and unreadable is a broken
 * checker, and that fails the build rather than passing as "no drift".
 *
 * `file`, `nodes` and `messages` arrived after the first report shape and are
 * every one of them optional — a report written by an older checker still
 * reads, it just badges fewer cards.
 */
export function readDesignSync(root: string): DesignSyncReport | undefined {
  const text = readTextIfExists(join(root, DESIGN_SYNC_REPORT));
  if (text === undefined) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    throw new Error(`${DESIGN_SYNC_REPORT} is not valid JSON`, { cause });
  }
  if (!isMapping(parsed)) refuse("must be a mapping");

  const { generatedAt, file, sets, nodes, messages } = parsed;
  if (typeof generatedAt !== "string")
    refuse("needs a `generatedAt` timestamp");
  if (!isMapping(sets)) refuse("needs a `sets` mapping");

  const verdicts: Record<string, DesignSyncClass> = {};
  for (const [name, verdict] of Object.entries(sets)) {
    if (typeof verdict !== "string" || !CLASSES.has(verdict)) {
      refuse(
        `: \`${name}\` is \`${String(verdict)}\`, not ok, warn, skipped or fail`,
      );
    }
    verdicts[name] = verdict as DesignSyncClass;
  }

  const report: DesignSyncReport = { generatedAt, sets: verdicts };

  if (file !== undefined) {
    if (typeof file !== "string") refuse("has a `file` that is not a file key");
    report.file = file;
  }

  if (nodes !== undefined) {
    if (!isMapping(nodes)) refuse("has a `nodes` that is not a mapping");
    report.nodes = {};
    for (const [id, name] of Object.entries(nodes)) {
      if (typeof name !== "string") {
        refuse(`: node \`${id}\` answers \`${String(name)}\`, not a set name`);
      }
      report.nodes[id] = name;
    }
  }

  if (messages !== undefined) {
    if (!isMapping(messages)) refuse("has a `messages` that is not a mapping");
    report.messages = {};
    for (const [name, lines] of Object.entries(messages)) {
      if (!Array.isArray(lines) || lines.some((l) => typeof l !== "string")) {
        refuse(`: \`${name}\` messages are not a list of strings`);
      }
      report.messages[name] = lines;
    }
  }

  return report;
}

/**
 * The report as maintenance rows.
 *
 * A badge only reaches whoever opens that page, so a drifting set nobody
 * visits, a report key that reaches no card at all, and a nightly that stopped
 * running were all silent. These join `check:manual`'s own warnings under a
 * `design` rule, because the panel is the one place the whole rail is legible
 * at once.
 */
export function designWarnings(
  roots: Roots,
  report: DesignSyncReport | undefined,
  now = new Date(),
): CheckWarning[] {
  if (!report) return [];
  const rows: CheckWarning[] = [];

  for (const [name, verdict] of Object.entries(report.sets)) {
    if (verdict !== "warn" && verdict !== "fail") continue;
    const why = report.messages?.[name]?.[0];
    rows.push({
      rule: "design",
      message: `\`${name}\` — ${verdict}${why ? `: ${why}` : ""}`,
    });
  }

  const { stories, frames } = cardsOf(roots);
  const reached = setsReached(report, stories, frames);
  for (const name of Object.keys(report.sets)) {
    if (reached.has(name)) continue;
    rows.push({
      rule: "design",
      message: `\`${name}\` is checked every night and no card shows it — renamed in Figma, or never embedded`,
    });
  }

  rows.sort((a, b) => a.message.localeCompare(b.message));

  // First, because it settles what every other row below it is worth: a report
  // nothing has refreshed reads as "no drift" on every card in the manual.
  const days = Math.floor(
    (now.getTime() - Date.parse(report.generatedAt)) / 86_400_000,
  );
  if (Number.isFinite(days) && days >= STALE_AFTER_DAYS) {
    rows.unshift({
      rule: "design",
      message: `the report is ${days} days old (${report.generatedAt}) — the nightly design-sync run has stopped, so every verdict below and every badge on every card is a stopped clock`,
    });
  }

  return rows;
}

/** Every card a verdict could land on, read straight off the pages. A page the
 * grammar refuses is `check:manual`'s finding, never this one's. */
function cardsOf(roots: Roots) {
  const root = roots.content;
  const stories: string[] = [];
  const frames: FrameCard[] = [];
  for (const path of walkFiles(root, join(root, roots.manual), ".md")) {
    let blocks: Block[];
    try {
      blocks = parsePage(readText(join(root, path))).blocks;
    } catch {
      continue;
    }
    for (const block of everyBlock(blocks)) {
      if (block.type === "story") stories.push(block.id);
      if (block.type === "figma") {
        frames.push({
          url: block.url,
          ...(block.set === undefined ? {} : { set: block.set }),
        });
      }
    }
  }
  return { stories, frames };
}

function* everyBlock(blocks: Block[]): Generator<Block> {
  for (const block of blocks) {
    yield block;
    if ("body" in block && Array.isArray(block.body))
      yield* everyBlock(block.body);
  }
}
