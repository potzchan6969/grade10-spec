import { execFile } from "node:child_process";
import { appendFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";

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

function addLocation(target, path, kind) {
  const item = location(path);
  if (!item || item.kind !== kind) return;
  target.set(item.id, item);
}

export function classifyChanges(
  changed,
  { beforeActiveIds = new Set(), afterActiveIds = new Set(), beforeArchiveIds = new Set(), afterArchiveIds = new Set() } = {},
) {
  const activeBefore = new Map();
  const activeAfter = new Map();
  const archiveBefore = new Map();
  const archiveAfter = new Map();

  for (const item of changed) {
    addLocation(activeBefore, item.oldPath, "active");
    addLocation(activeAfter, item.path, "active");

    const oldLocation = location(item.oldPath);
    const newLocation = location(item.path);
    if (oldLocation?.kind === "archive") archiveBefore.set(oldLocation.id, oldLocation);
    if (newLocation?.kind === "archive") archiveAfter.set(newLocation.id, newLocation);
  }

  const ids = new Set([
    ...activeBefore.keys(),
    ...activeAfter.keys(),
    ...archiveBefore.keys(),
    ...archiveAfter.keys(),
  ]);
  const result = { new: [], archived: [], removed: [], updated: [] };

  for (const id of ids) {
    const wasActive = beforeActiveIds.has(id);
    const isActive = afterActiveIds.has(id);
    const wasArchived = beforeArchiveIds.has(id);
    const isArchived = afterArchiveIds.has(id);
    const movedToArchive = wasActive && !isActive && isArchived;
    const addedArchive = !wasActive && !wasArchived && isArchived;
    const item = {
      id,
      path:
        activeAfter.get(id)?.directory ??
        archiveAfter.get(id)?.directory ??
        activeBefore.get(id)?.directory ??
        archiveBefore.get(id)?.directory ??
        id,
    };

    if (movedToArchive || addedArchive) result.archived.push(item);
    else if (!wasActive && isActive) result.new.push(item);
    else if (wasActive && !isActive) result.removed.push(item);
    else if (wasArchived && !isArchived) result.removed.push(item);
    else if (wasActive && isActive) result.updated.push(item);
  }

  for (const items of Object.values(result)) items.sort((left, right) => left.id.localeCompare(right.id));
  return result;
}

async function treeChangeIds(ref, kind) {
  const { stdout } = await exec(
    "git",
    ["ls-tree", "-r", "--name-only", ref, "--", CHANGE_ROOT],
    { cwd: rootDirectory },
  );
  const ids = new Set();
  for (const path of stdout.split("\n").filter(Boolean)) {
    const item = location(path);
    if (item?.kind === kind) ids.add(item.id);
  }
  return ids;
}

async function changedFiles(base, head) {
  const { stdout } = await exec(
    "git",
    ["diff", "--name-status", "--find-renames", "-z", base, head, "--", CHANGE_ROOT],
    { cwd: rootDirectory },
  );
  return parseChangedFiles(stdout);
}

function humanize(id) {
  return id.replace(/[-_]+/g, " ");
}

function escapeSlackText(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function titleAt(ref, directory, fallback) {
  try {
    const { stdout } = await exec("git", ["show", `${ref}:${CHANGE_ROOT}${directory}/proposal.md`], {
      cwd: rootDirectory,
    });
    const title = stdout.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (title) return title;
  } catch {
    // The proposal may have been removed in the same push.
  }
  return humanize(fallback);
}

export async function titledChanges(changes, { base, head }) {
  const titled = {};
  for (const [status, items] of Object.entries(changes)) {
    titled[status] = await Promise.all(
      items.map(async (item) => ({
        ...item,
        title: await titleAt(status === "removed" ? base : head, item.path, item.id),
      })),
    );
  }
  return titled;
}

export function slackPayload({ changes, commitSha, commitUrl, manualUrl }) {
  const sections = [
    ["new", "New", ":new:"],
    ["updated", "Updated", ":pencil2:"],
    ["archived", "Archived", ":file_cabinet:"],
    ["removed", "Removed", ":wastebasket:"],
  ].filter(([status]) => changes[status]?.length);

  return {
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: ":memo: OpenSpec changes updated" },
      },
      ...sections.map(([status, label, icon]) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${icon} *${label}*\n${changes[status]
            .map(({ id, title }) => `- *${escapeSlackText(title)}* (\`${id}\`)`)
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

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((argument) => argument !== "--"),
    options: {
      base: { type: "string" },
      head: { type: "string", default: "HEAD" },
      "commit-url": { type: "string", default: "" },
      "manual-url": { type: "string", default: "https://spec.grade10-stg.com/planning" },
      "github-output": { type: "string" },
    },
  });
  if (!values.base) throw new Error("--base is required");

  const changed = await changedFiles(values.base, values.head);
  const changedPaths = changed.flatMap(({ oldPath, path }) => [oldPath, path]).filter(Boolean);
  const [beforeActiveIds, afterActiveIds, beforeArchiveIds, afterArchiveIds] = await Promise.all([
    treeChangeIds(values.base, "active"),
    treeChangeIds(values.head, "active"),
    treeChangeIds(values.base, "archive"),
    treeChangeIds(values.head, "archive"),
  ]);
  const changes = await titledChanges(
    classifyChanges(changed, { beforeActiveIds, afterActiveIds, beforeArchiveIds, afterArchiveIds }),
    { base: values.base, head: values.head },
  );
  const { stdout: commitSha } = await exec("git", ["rev-parse", values.head], { cwd: rootDirectory });
  const payload = slackPayload({
    changes,
    commitSha: commitSha.trim(),
    commitUrl: values["commit-url"],
    manualUrl: values["manual-url"],
  });
  const hasChanges = Object.values(changes).some((items) => items.length);

  if (values["github-output"]) {
    await appendFile(
      values["github-output"],
      `has-changes=${hasChanges}\npayload=${JSON.stringify(payload)}\n`,
    );
  }
  process.stdout.write(JSON.stringify({ changedPaths, changes, payload }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
