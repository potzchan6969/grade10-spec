import { execFile } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { appendFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";
import YAML from "yaml";

import {
  messagesOf,
  milestonesBetween,
  newlyBehind,
  readingOf,
} from "./lib/moves.mjs";
import { deliver, readSentKeys } from "./lib/notify.mjs";
import { readTeamMap, TEAM_MAP } from "./lib/team.mjs";
import { escapeSlackText } from "./lib/wording.mjs";
import { absentAt } from "./store-main.mjs";

const exec = promisify(execFile);
const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const CHANGE_ROOT = "openspec/changes/";

function location(path) {
  if (!path?.startsWith(CHANGE_ROOT)) return null;

  const parts = path.slice(CHANGE_ROOT.length).split("/");
  if (parts.length < 2 || !parts[0]) return null;

  if (parts[0] === "archive") {
    const directory = parts[1];
    if (!directory) return null;
    return {
      directory,
      id: directory.replace(/^\d{4}-\d{2}-\d{2}-/, ""),
      kind: "archive",
    };
  }

  return { directory: parts[0], id: parts[0], kind: "active" };
}

export function parseChangedFiles(output) {
  const fields = output.split("\0").filter(Boolean);
  const changed = [];

  for (let index = 0; index < fields.length; ) {
    const status = fields[index++];
    if (status.startsWith("R") || status.startsWith("C")) {
      changed.push({
        oldPath: fields[index++],
        path: fields[index++],
        status: status[0],
      });
    } else {
      changed.push({ oldPath: null, path: fields[index++], status: status[0] });
    }
  }

  return changed;
}

function artifact(path) {
  const item = location(path);
  if (!item) return null;
  const prefix =
    item.kind === "archive"
      ? `${CHANGE_ROOT}archive/${item.directory}/`
      : `${CHANGE_ROOT}${item.directory}/`;
  const relative = path.slice(prefix.length);
  const scope = artifactScope(relative);
  return { ...item, path, scope };
}

function artifactScope(relative) {
  if (relative === "proposal.md") return "proposal";
  if (relative === "tech-design.md") return "tech-design";
  if (relative === "ui-design.md") return "ui-design";
  if (relative === "tasks.md") return "tasks";
  // The rest sit beside a capability's requirements, so they are named by the
  // file rather than the path: a change files them under `specs/<capability>/`
  // and the durable store hands them over bare. A suite's name carries its
  // level (tcs-rules r3.0), and `test-cases.md` is the name they were renamed
  // from, still carried by the archive.
  const file = relative.slice(relative.lastIndexOf("/") + 1);
  if (file.endsWith("-tcs.md") || file === "test-cases.md") return "test-cases";
  if (file === "spec.md") return "spec";
  if (file === "user-journeys.md") return "user-journeys";
  return relative;
}

function addChange(groups, status, item) {
  const change = groups[status].get(item.id) ?? {
    id: item.id,
    path: item.directory,
    scopes: new Set(),
  };
  change.scopes.add(item.scope);
  groups[status].set(item.id, change);
}

function finishChanges(groups) {
  return Object.fromEntries(
    Object.entries(groups).map(([status, changes]) => [
      status,
      [...changes.values()]
        .map((change) => ({ ...change, scopes: [...change.scopes].sort() }))
        .sort((left, right) => left.id.localeCompare(right.id)),
    ]),
  );
}

export function classifyChanges(changed) {
  const groups = {
    new: new Map(),
    archived: new Map(),
    removed: new Map(),
    updated: new Map(),
  };

  for (const record of changed) {
    const oldPath = record.status === "D" ? record.path : record.oldPath;
    const newPath = record.status === "D" ? null : record.path;
    const oldItem = artifact(oldPath);
    const newItem = artifact(newPath);

    if (oldItem?.kind === "active" && newItem?.kind === "archive") {
      addChange(groups, "archived", { ...newItem, id: oldItem.id });
      continue;
    }

    if (newItem?.kind === "active") {
      if (record.status === "M") addChange(groups, "updated", newItem);
      else if (record.status === "R" && oldItem?.kind === "active") {
        addChange(groups, "removed", oldItem);
        addChange(groups, "new", newItem);
      } else addChange(groups, "new", newItem);
      continue;
    }

    if (oldItem?.kind === "active") addChange(groups, "removed", oldItem);
    else if (newItem?.kind === "archive")
      addChange(groups, "archived", newItem);
    else if (oldItem?.kind === "archive") {
      if (record.status === "M") addChange(groups, "updated", oldItem);
      else addChange(groups, "removed", oldItem);
    }
  }

  return finishChanges(groups);
}

async function changedFiles(root, base, head) {
  const { stdout } = await exec(
    "git",
    [
      "diff",
      "--name-status",
      "--find-renames",
      "-z",
      base,
      head,
      "--",
      CHANGE_ROOT,
    ],
    { cwd: root },
  );
  return parseChangedFiles(stdout);
}

function humanize(id) {
  return id.replace(/[-_]+/g, " ");
}

/** A Slack link, or the bare label where there is no url: an empty link
 * target is a link nobody can click, not a link nobody clicks. */
function slackLink(url, label) {
  return url ? `<${url}|${label}>` : label;
}

function changeLink(id, title, openspecUrl) {
  const baseUrl = openspecUrl.replace(/\/$/, "");
  return slackLink(
    `${baseUrl}/#/change/${encodeURIComponent(id)}`,
    escapeSlackText(title),
  );
}

/**
 * One file as a revision holds it, or nothing where that revision has none —
 * and nothing for that one reason alone. Every other way `git show` can
 * refuse, a revision the checkout does not hold among them, stops the run
 * naming the ref and the path: a record read as absent because git refused
 * something else would compute a move that never happened.
 */
export async function showAt(root, ref, path) {
  try {
    const { stdout } = await exec("git", ["show", `${ref}:${path}`], {
      cwd: root,
      maxBuffer: Infinity,
    });
    return stdout;
  } catch (error) {
    const said = String(error?.stderr ?? "");
    if (absentAt(root, ref, said)) return undefined;
    throw new Error(
      `git show ${ref}:${path} refused in ${root}: ${(said || error.message).trim()}`,
      { cause: error },
    );
  }
}

/** The five sections of the post, in the order a change meets them: the
 * heading, and what each line adds after the change's link. */
const SECTIONS = [
  ["proposed", ":new: *Proposed*", () => ""],
  [
    "accepted",
    ":white_check_mark: *Accepted* — requirements published to the specs and the manual",
    () => "",
  ],
  [
    "claimed",
    ":raising_hand: *Implementation claimed*",
    ({ claims }) =>
      ` — ${claims
        .map(({ num, owner }) => `group ${num} by @${escapeSlackText(owner)}`)
        .join(", ")}`,
  ],
  [
    "completed",
    ":checkered_flag: *Implementation complete*",
    ({ tasks }) => ` — ${tasks.done}/${tasks.total} tasks checked`,
  ],
  ["archived", ":file_cabinet: *Archived*", () => ""],
];

/** Slack refuses a section whose text passes 3,000 characters, and a
 * message past 50 blocks — `invalid_blocks`, and the whole post with it. */
const SECTION_LIMIT = 3000;
const MAX_SECTIONS = 49;

/** One milestone's lines as sections, each under Slack's limit: the heading
 * opens the first, and the rest carry on under it without repeating it. */
function packed(heading, lines) {
  if (lines.length === 0) return [];
  const sections = [];
  let text = heading;
  for (const line of lines) {
    if (text.length + 1 + line.length > SECTION_LIMIT && text !== heading) {
      sections.push(text);
      text = line;
    } else text = `${text}\n${line}`;
  }
  sections.push(text);
  return sections.map((one) => ({
    type: "section",
    text: { type: "mrkdwn", text: one.slice(0, SECTION_LIMIT) },
  }));
}

/**
 * The channel post: one section per milestone a change crossed, and nothing
 * for a push that crossed none — `blocks` is empty then, and nothing is sent.
 */
export function slackPayload({
  milestones,
  commitSha,
  commitUrl,
  manualUrl,
  openspecUrl = "https://spec.grade10-stg.com/openspec/",
}) {
  const sections = SECTIONS.flatMap(([milestone, heading, detail]) =>
    packed(
      heading,
      milestones
        .filter((one) => one.milestone === milestone)
        .map(
          (one) =>
            `- ${changeLink(one.id, one.title ?? humanize(one.id), openspecUrl)} (\`${one.id}\`)${detail(one)}`,
        ),
    ),
  );
  // Slack takes 50 blocks a message, the context line among them: a range
  // past that names what it dropped rather than being refused whole.
  if (sections.length > MAX_SECTIONS) {
    const dropped = sections.length - (MAX_SECTIONS - 1);
    sections.splice(MAX_SECTIONS - 1, dropped, {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `…and ${dropped} more sections — ${slackLink(manualUrl, "the planning board")} has them all`,
      },
    });
  }
  if (sections.length === 0) return { blocks: [] };

  return {
    blocks: [
      ...sections,
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `${slackLink(manualUrl, "Planning")} | ${slackLink(commitUrl, commitSha.slice(0, 7))}`,
          },
        ],
      },
    ],
  };
}

// ── The stages, the hands and the messages ──────────────────────────────────

/*
 * A push is one repository at two revisions, so the stage, the hands and what
 * is behind are read twice — at the push's base and at its head — and a
 * message is what the difference between the two readings says.
 *
 * The readers are the manual's own, run against two roots: the checkout, and
 * a detached worktree of the base that is removed again before the step ends.
 * `git show` could not serve them — the reader reads files from a root, one
 * artifact being several files — and a second reading of the stage written
 * here would drift from the board's inside a week.
 */

/** The record, which is not an artifact: `reviewed:`, `thread:` and
 * `landed_by:` are what a round writes about a change, never a thing it
 * landed, so a push carrying nothing else tells nobody. */
const RECORD_FILE = ".openspec.yaml";
const RECORD_KEYS = ["reviewed", "thread", "landed_by"];

/** The base's reading, out of a worktree that is removed again whatever
 * happens — a temporary directory here, never inside the checkout, so a
 * failed run leaves no tree for the next push to trip over. */
async function readingAt(root, base) {
  const held = mkdtempSync(join(tmpdir(), "notify-base-"));
  const tree = join(held, "base");
  await exec("git", ["worktree", "add", "--detach", tree, base], { cwd: root });
  try {
    return await readingOf(tree);
  } finally {
    await exec("git", ["worktree", "remove", "--force", tree], {
      cwd: root,
    }).catch(() => exec("git", ["worktree", "prune"], { cwd: root }));
    rmSync(held, { recursive: true, force: true });
  }
}

/**
 * The changes whose record a run's own landing wrote in this push.
 *
 * `plan:land` writes a `Wake:` trailer on the commit it cuts in wake mode,
 * and only there, so what says a landing was a run's is the commit the run
 * made. A committer's e-mail cannot say it: it names the machine the push came
 * from, which a rebase, a second account and a workflow's own identity each
 * answer differently, and a person whose e-mail the map does not hold would be
 * read as a run. One `git log` over the push's own range reads every trailer
 * beside the paths each commit touched, and a change whose record a marked
 * commit wrote has had its thread told by the run itself. A git call that
 * refused is not "nobody landed it": it throws, and the step says so.
 */
async function runLandedOf(root, base, head) {
  const { stdout } = await exec(
    "git",
    [
      "log",
      "--format=%x00%(trailers:key=Wake,valueonly,separator=%x2C)",
      "--name-only",
      `${base}..${head}`,
    ],
    { cwd: root },
  );
  const ids = new Set();
  for (const commit of stdout.split("\0").slice(1)) {
    const [marker, ...paths] = commit.split("\n");
    if (marker.trim() === "") continue;
    for (const path of paths) {
      const at = location(path);
      if (at?.kind !== "active") continue;
      if (path === `${CHANGE_ROOT}${at.directory}/${RECORD_FILE}`)
        ids.add(at.id);
    }
  }
  return ids;
}

/** The files of each touched change, change by change — what says whether a
 * push wrote anything but the record's own keys. */
function touchedByChange(changed) {
  const byChange = new Map();
  for (const record of changed) {
    for (const path of [record.oldPath, record.path]) {
      const item = artifact(path);
      if (item?.kind !== "active") continue;
      const prefix = `${CHANGE_ROOT}${item.directory}/`;
      const files = byChange.get(item.id) ?? new Set();
      files.add(item.path.slice(prefix.length));
      byChange.set(item.id, files);
    }
  }
  return byChange;
}

/** The record with `reviewed:`, `thread:` and `landed_by:` taken out: what is
 * left is what the push said about the change. One yaml parse of the whole
 * record rather than a line scanner, so a quoted value that happens to open
 * like a key, or a block scalar that spans several lines, is never mistaken
 * for one. */
function withoutRecordKeys(text) {
  const parsed = YAML.parse(text) ?? {};
  for (const key of RECORD_KEYS) delete parsed[key];
  return JSON.stringify(parsed);
}

/** The changes this push touched in no way but the round's own record keys. */
async function keysOnly(root, base, head, touched) {
  const only = new Set();
  for (const [id, files] of touched) {
    if (files.size !== 1 || !files.has(RECORD_FILE)) continue;
    const path = `${CHANGE_ROOT}${id}/${RECORD_FILE}`;
    const [was, now] = await Promise.all([
      showAt(root, base, path),
      showAt(root, head, path),
    ]);
    if (was === undefined || now === undefined) continue;
    if (withoutRecordKeys(was) === withoutRecordKeys(now)) only.add(id);
  }
  return only;
}

/**
 * The re-read job's matrix: one entry per change this push touched whose
 * behind set at head is not empty.
 *
 * Behind at head, not newly behind against the base: a landing that arrives
 * while something of the change is already behind puts nothing new behind,
 * and the read again is owed on what is. A change the push did not touch is
 * left out either way — re-reading it here would fire the same change again
 * on every unrelated push until a landing clears it. Touched is its own
 * directory or an artifact of it this push put newly behind, which is how a
 * commit on a page the proposal links reaches the change that links it.
 *
 * A change touched only through the round's own record lines is excluded by
 * the same `suppressed` set that silences its messages, which is what keeps
 * the cascade finite: the re-read's own commit never re-enters this matrix,
 * even where the content id it wrote leaves the artifact reading as behind.
 *
 * The id is the whole entry: every step of the job names `matrix.id`, and the
 * step that posts reads the change's `thread:` from its own record, so an
 * entry carrying the address too would be a second copy of it to keep true.
 */
export function rereadMatrixOf(touched, base, head, suppressed) {
  const ids = new Set([
    ...touched.keys(),
    ...newlyBehind(base, head).map((one) => one.id),
  ]);
  const matrix = [];
  for (const id of ids) {
    if (suppressed.has(id)) continue;
    const at = head.get(id);
    if (at === undefined || at.behind.length === 0) continue;
    matrix.push({ id });
  }
  return matrix.sort((left, right) => left.id.localeCompare(right.id));
}

function without(changes, suppressed) {
  return Object.fromEntries(
    Object.entries(changes).map(([status, items]) => [
      status,
      items.filter((item) => !suppressed.has(item.id)),
    ]),
  );
}

/** One ref as a commit. */
async function revision(root, ref) {
  const { stdout } = await exec("git", ["rev-parse", ref], { cwd: root });
  return stdout.trim();
}

/** Both ends of the range, or a refusal naming it. A base the checkout cannot
 * reach used to fall back to `HEAD^`, which silently narrowed a multi-commit
 * push and told nobody. */
async function mustResolve(root, base, head) {
  for (const ref of [base, head]) {
    try {
      await exec("git", ["rev-parse", "--verify", `${ref}^{commit}`], {
        cwd: root,
      });
    } catch {
      throw new Error(
        `${ref} is not a commit this checkout holds — the push's range is ${base}..${head}`,
      );
    }
  }
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((argument) => argument !== "--"),
    options: {
      base: { type: "string" },
      head: { type: "string", default: "HEAD" },
      root: { type: "string" },
      stages: { type: "boolean", default: false },
      team: { type: "string", default: TEAM_MAP },
      "sent-keys": { type: "string" },
      send: { type: "boolean", default: false },
      // A repository variable turns the per-hand messages off in production -
      // a role's channel among them, which is one hand's message rerouted -
      // without touching the channel post or the thread's landing reply. The
      // CLI default keeps a bare run - a test, a local dry run - showing what
      // it would tell each hand.
      dms: { type: "string", default: "true" },
      channel: { type: "string", default: "" },
      "sheet-url": { type: "string", default: process.env.TCS_SHEET_URL ?? "" },
      "workspace-url": {
        type: "string",
        default: process.env.SLACK_WORKSPACE_URL ?? "",
      },
      "commit-url": { type: "string" },
      "manual-url": {
        type: "string",
        default: "https://spec.grade10-stg.com/planning",
      },
      "openspec-url": {
        type: "string",
        default: "https://spec.grade10-stg.com/openspec/",
      },
      "github-output": { type: "string" },
    },
  });
  if (!values.base) throw new Error("--base is required");
  const root = values.root ? resolve(values.root) : rootDirectory;
  await mustResolve(root, values.base, values.head);

  const changed = await changedFiles(root, values.base, values.head);
  const changedPaths = changed
    .flatMap(({ oldPath, path }) => [oldPath, path])
    .filter(Boolean);
  const touched = touchedByChange(changed);
  const suppressed = values.stages
    ? await keysOnly(root, values.base, values.head, touched)
    : new Set();
  const changes = without(classifyChanges(changed), suppressed);
  const [head, checkout] = await Promise.all([
    revision(root, values.head),
    revision(root, "HEAD"),
  ]);

  let stages = {};
  // Without `--stages` nothing reads a change's record, so the only milestone
  // a run can see is the move into the archive, from the files alone.
  let atBase = new Map();
  let atHead = new Map();
  let messages = [];
  let skipped = [];
  let matrix = [];
  if (values.stages) {
    const team = readTeamMap(root, values.team);
    // The head is the checkout, which is what a push's job holds; a head
    // given by hand that is not the checkout is read from its own worktree
    // rather than from whatever the working tree happens to be on.
    atBase = await readingAt(root, values.base);
    atHead =
      head === checkout ? await readingOf(root) : await readingAt(root, head);
    stages = Object.fromEntries([...atHead].map(([id, at]) => [id, at.stage]));
    const told = messagesOf(atBase, atHead, team, {
      manualUrl: values["manual-url"],
      workspaceUrl: values["workspace-url"],
      sheetUrl: values["sheet-url"],
      pushHead: head,
    });
    const sent = readSentKeys(values["sent-keys"]);
    // One git call for the whole push, whatever it landed: the changes whose
    // landing a run marked, and whose threads it has told itself.
    const runLanded = await runLandedOf(root, values.base, head);
    // A push whose only word about a change is the round's own record keys
    // moves nobody, and says so rather than naming the change - but the
    // thread's landing reply is about those very keys, so it is owed even
    // then, and is dropped only where the run that landed it replied itself.
    // Each message carries the change's own id, so it is read off directly
    // rather than split back out of the key.
    const held = (one) =>
      one.kind === "landed" ? runLanded.has(one.id) : suppressed.has(one.id);
    messages = told.messages.filter((one) => !sent.has(one.key) && !held(one));
    skipped = told.skipped.filter((one) => !suppressed.has(one.id));
    matrix = rereadMatrixOf(touched, atBase, atHead, suppressed);
  }

  const milestones = milestonesBetween(
    atBase,
    atHead,
    changes.archived.map((one) => one.id),
  );
  const payload = slackPayload({
    milestones,
    commitSha: head,
    commitUrl: values["commit-url"],
    manualUrl: values["manual-url"],
    openspecUrl: values["openspec-url"],
  });

  for (const one of skipped) {
    process.stderr.write(`nothing sent for ${one.key}: ${one.why}\n`);
  }

  // The channel post and the direct messages are one delivery: the post is
  // keyed by the range's own head, so a re-run does not post it twice either,
  // and `--dms` is what a repository variable turns off in production without
  // touching the post. The post goes out only where a change crossed one of
  // the five milestones; any other push is silent in the channel.
  //
  // What it turns off is the messages a hand reads. The thread's landing reply
  // is nobody's inbox - it is the change's own record read out in the change's
  // own thread - so it goes out either way.
  const toDeliver = [];
  if (payload.blocks.length > 0) {
    if (values.send && !values.channel) {
      throw new Error("no channel to post to: pass --channel");
    }
    toDeliver.push({
      key: `channel:${head}`,
      to: "channel",
      channel: values.channel,
      text: "OpenSpec milestones on main",
      blocks: payload.blocks,
    });
  }
  toDeliver.push(
    ...messages.filter((one) => values.dms === "true" || one.kind === "landed"),
  );
  await deliver(toDeliver, {
    file: values["sent-keys"],
    send: values.send,
    token: process.env.SLACK_BOT_TOKEN,
  });

  if (values["github-output"]) {
    await appendFile(
      values["github-output"],
      `matrix=${JSON.stringify(matrix)}\n`,
    );
  }
  process.stdout.write(
    JSON.stringify({
      changedPaths,
      changes,
      milestones,
      payload,
      stages,
      messages,
      skipped,
      matrix,
    }),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
