import { execFile } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { appendFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";

import { STAGE_LABEL } from "../../tools/manual/src/api/stages.ts";
import { messagesOf, newlyBehind, readingOf } from "./lib/moves.mjs";
import {
  appendSentKeys,
  escapeSlackText,
  printable,
  readSentKeys,
  sendAll,
} from "./lib/notify.mjs";
import { readTeamMap, TEAM_MAP } from "./lib/team.mjs";

const exec = promisify(execFile);
const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const CHANGE_ROOT = "openspec/changes/";
const SPEC_ROOT = "openspec/specs/";

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

function capabilityArtifact(path) {
  if (!path?.startsWith(SPEC_ROOT)) return null;
  const parts = path.slice(SPEC_ROOT.length).split("/");
  if (parts.length < 4) return null;
  const directory = parts.slice(0, 3).join("/");
  return {
    directory,
    id: directory,
    kind: "capability",
    path,
    scope: artifactScope(parts.slice(3).join("/")),
  };
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

export function classifyCapabilities(changed) {
  const groups = {
    new: new Map(),
    archived: new Map(),
    removed: new Map(),
    updated: new Map(),
  };

  for (const record of changed) {
    const oldPath = record.status === "D" ? record.path : record.oldPath;
    const newPath = record.status === "D" ? null : record.path;
    const oldItem = capabilityArtifact(oldPath);
    const newItem = capabilityArtifact(newPath);

    if (newItem) {
      if (record.status === "M") addChange(groups, "updated", newItem);
      else if (record.status === "R" && oldItem) {
        addChange(groups, "removed", oldItem);
        addChange(groups, "new", newItem);
      } else addChange(groups, "new", newItem);
    } else if (oldItem) addChange(groups, "removed", oldItem);
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
      SPEC_ROOT,
    ],
    { cwd: root },
  );
  return parseChangedFiles(stdout);
}

function humanize(id) {
  return id.replace(/[-_]+/g, " ");
}

function scopesText(scopes = []) {
  return scopes.length
    ? ` — ${scopes.map((scope) => `\`${escapeSlackText(scope)}\``).join(", ")}`
    : "";
}

function changeLink(id, title, openspecUrl) {
  const baseUrl = openspecUrl.replace(/\/$/, "");
  return `<${baseUrl}/#/change/${encodeURIComponent(id)}|${escapeSlackText(title)}>`;
}

function capabilityLink(id, openspecUrl) {
  const baseUrl = openspecUrl.replace(/\/$/, "");
  const path = id.split("/").map(encodeURIComponent).join("/");
  return `<${baseUrl}/#/spec/${path}|${escapeSlackText(id)}>`;
}

async function titleAt(root, ref, directory, fallback) {
  try {
    const stdout = await showAt(
      root,
      ref,
      `${CHANGE_ROOT}${directory}/proposal.md`,
    );
    const title = stdout?.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (title) return title;
  } catch {
    // The proposal may have been removed in the same push.
  }
  return humanize(fallback);
}

/** One file as a revision holds it, or nothing where that revision has none. */
async function showAt(root, ref, path) {
  try {
    const { stdout } = await exec("git", ["show", `${ref}:${path}`], {
      cwd: root,
      maxBuffer: 16 * 1024 * 1024,
    });
    return stdout;
  } catch {
    return undefined;
  }
}

export async function titledChanges(
  changes,
  { base, head, root = rootDirectory },
) {
  const titled = {};
  for (const [status, items] of Object.entries(changes)) {
    titled[status] = await Promise.all(
      items.map(async (item) => ({
        ...item,
        title: await titleAt(
          root,
          status === "removed" ? base : head,
          item.path,
          item.id,
        ),
      })),
    );
  }
  return titled;
}

/** The stage a change moved into, where this run read one — the channel's own
 * half of what every message says. A run that read no stage says nothing
 * about one rather than guessing from the files it saw. */
function stageText(stages, id) {
  const stage = stages[id];
  return stage ? ` · *${STAGE_LABEL[stage] ?? stage}*` : "";
}

export function slackPayload({
  changes,
  capabilities = { new: [], updated: [], archived: [], removed: [] },
  commitSha,
  commitUrl,
  manualUrl,
  openspecUrl = "https://spec.grade10-stg.com/openspec/",
  stages = {},
}) {
  const sections = [
    ["new", "New", ":new:"],
    ["updated", "Updated", ":pencil2:"],
    ["archived", "Archived", ":file_cabinet:"],
    ["removed", "Removed", ":wastebasket:"],
  ].filter(([status]) => changes[status]?.length);

  return {
    blocks: [
      ...sections.map(([status, label, icon]) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${icon} OpenSpec *${label}*\n${changes[status]
            .map(
              ({ id, title, scopes }) =>
                `- ${changeLink(id, title, openspecUrl)} (\`${id}\`)${stageText(stages, id)}${scopesText(scopes)}`,
            )
            .join("\n")}`,
        },
      })),
      ...[
        ["new", "New", ":new:"],
        ["updated", "Updated", ":pencil2:"],
        ["removed", "Removed", ":wastebasket:"],
      ]
        .filter(([status]) => capabilities[status]?.length)
        .map(([status, label, icon]) => ({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${icon} OpenSpec *${label} capabilities*\n${capabilities[
              status
            ]
              .map(
                ({ id, scopes }) =>
                  `- ${capabilityLink(id, openspecUrl)}${scopesText(scopes)}`,
              )
              .join("\n")}`,
          },
        })),
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `<${manualUrl}|Planning> | <${commitUrl}|${commitSha.slice(0, 7)}>`,
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

/** The record with `reviewed:`, `thread:` and `landed_by:` taken out, blank
 * lines dropped: what is left is what the push said about the change. */
function withoutRecordKeys(text) {
  const kept = [];
  let dropping = false;
  for (const line of text.split("\n")) {
    if (line.trim() === "") continue;
    if (/^\S/.test(line)) {
      dropping = RECORD_KEYS.some((key) => line.startsWith(`${key}:`));
    }
    if (!dropping) kept.push(line);
  }
  return kept.join("\n");
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
 * The re-read job's matrix: one entry per change this push newly put
 * something behind — the same `newlyBehind` the `behind` messages are drawn
 * from, never a second diff.
 *
 * A change with something already behind before this push is left out: the
 * push did not touch it, so re-reading it here would fire the same change
 * again on every unrelated push until a landing clears it. A change touched
 * only through the round's own record lines is excluded by the same
 * `suppressed` set that silences its messages, which is what keeps the
 * cascade finite: the re-read's own commit never re-enters this matrix, even
 * where the content id it wrote leaves the artifact reading as behind.
 */
export function rereadMatrixOf(base, head, suppressed) {
  const matrix = [];
  for (const behind of newlyBehind(base, head)) {
    if (suppressed.has(behind.id)) continue;
    const at = head.get(behind.id);
    if (!at) continue;
    matrix.push({ id: behind.id, thread: at.thread ?? null });
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
      only: { type: "string", default: "all" },
      channel: { type: "string", default: "" },
      "sheet-url": { type: "string", default: process.env.TCS_SHEET_URL ?? "" },
      "workspace-url": {
        type: "string",
        default: process.env.SLACK_WORKSPACE_URL ?? "",
      },
      "commit-url": { type: "string", default: "" },
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
  if (!["all", "post", "dms"].includes(values.only)) {
    throw new Error("--only takes all, post or dms");
  }
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
  const changes = await titledChanges(
    without(classifyChanges(changed), suppressed),
    { base: values.base, head: values.head, root },
  );
  const capabilities = classifyCapabilities(changed);
  const [head, checkout] = await Promise.all([
    revision(root, values.head),
    revision(root, "HEAD"),
  ]);

  let stages = {};
  let messages = [];
  let skipped = [];
  let matrix = [];
  if (values.stages) {
    const options = {
      manualUrl: values["manual-url"],
      workspaceUrl: values["workspace-url"],
      sheetUrl: values["sheet-url"],
    };
    // The head is the checkout, which is what a push's job holds; a head
    // given by hand that is not the checkout is read from its own worktree
    // rather than from whatever the working tree happens to be on.
    const atBase = await readingAt(root, values.base);
    const atHead =
      head === checkout ? await readingOf(root) : await readingAt(root, head);
    stages = Object.fromEntries([...atHead].map(([id, at]) => [id, at.stage]));
    const told = messagesOf(
      atBase,
      atHead,
      readTeamMap(root, values.team),
      options,
    );
    const sent = readSentKeys(values["sent-keys"]);
    // A push whose only word about a change is the round's own record keys
    // moves nobody, and says so rather than naming the change.
    messages = told.messages.filter(
      (one) => !sent.has(one.key) && !suppressed.has(one.key.split(":")[0]),
    );
    skipped = told.skipped.filter(
      (one) => !suppressed.has(one.key.split(":")[0]),
    );
    matrix = rereadMatrixOf(atBase, atHead, suppressed);
  }

  const payload = slackPayload({
    changes,
    capabilities,
    commitSha: head,
    commitUrl: values["commit-url"],
    manualUrl: values["manual-url"],
    openspecUrl: values["openspec-url"],
    stages,
  });
  const hasChanges =
    Object.values(changes).some((items) => items.length) ||
    Object.values(capabilities).some((items) => items.length);
  const hasMessages = messages.length > 0;

  for (const one of skipped) {
    process.stderr.write(`nothing sent for ${one.key}: ${one.why}\n`);
  }
  if (values.send) await send(values, { messages, payload, hasChanges });
  else if (messages.length > 0) {
    // The keys are the run's record of what it answered for, whether it sent
    // the messages or printed them: a dry run twice over one push is the same
    // push twice, and says nothing twice either.
    process.stderr.write(`${printable(messages)}\n`);
    if (values.only !== "post") {
      appendSentKeys(
        values["sent-keys"],
        messages.map((one) => one.key),
      );
    }
  }

  if (values["github-output"]) {
    await appendFile(
      values["github-output"],
      `has-changes=${hasChanges}\nhas-messages=${hasMessages}\npayload=${JSON.stringify(payload)}\nmatrix=${JSON.stringify(matrix)}\n`,
    );
  }
  process.stdout.write(
    JSON.stringify({
      changedPaths,
      changes,
      capabilities,
      payload,
      stages,
      messages,
      skipped,
      hasMessages,
      matrix,
    }),
  );
}

/**
 * The one sender: this script, through `chat.postMessage`.
 *
 * `--only` is how the workflow tells the channel post from the direct
 * messages: the post goes on every push that moved something, and the
 * messages are behind a repository variable, so the two are separate steps
 * and each says in its own name what it does. The keys of what went out are
 * appended whatever happens next, so a re-run does not send them again.
 */
async function send(values, { messages, payload, hasChanges }) {
  const token = process.env.SLACK_BOT_TOKEN;
  const only = values.only;
  if (only !== "dms" && hasChanges) {
    const channel =
      values.channel ||
      process.env.SLACK_PLANNING_CHANNEL_ID ||
      process.env.SLACK_CHANNEL_ID;
    if (!channel) throw new Error("no channel to post to: pass --channel");
    await sendAll(
      [
        {
          key: "the channel post",
          to: "channel",
          channel,
          text: "OpenSpec changes on main",
          blocks: payload.blocks,
        },
      ],
      { token },
    );
  }
  if (only === "post" || messages.length === 0) return;
  try {
    appendSentKeys(values["sent-keys"], await sendAll(messages, { token }));
  } catch (cause) {
    appendSentKeys(values["sent-keys"], cause.sent ?? []);
    throw cause;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
