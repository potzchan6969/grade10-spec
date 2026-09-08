import { execFile } from "node:child_process";
import { appendFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";

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
  let scope = relative;
  if (relative === "proposal.md") scope = "proposal";
  else if (relative === "tech-design.md") scope = "tech-design";
  else if (relative === "ui-design.md") scope = "ui-design";
  else if (relative === "tasks.md") scope = "tasks";
  else if (relative === "feature-tcs.md" || relative === "test-cases.md")
    scope = "test-cases";
  else if (relative === "spec.md" || relative.endsWith("/spec.md")) scope = "spec";
  else if (
    relative === "user-journeys.md" ||
    relative.endsWith("/user-journeys.md")
  )
    scope = "user-journeys";
  return scope;
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
    else if (newItem?.kind === "archive") addChange(groups, "archived", newItem);
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

export function slackPayload({
  changes,
  capabilities = { new: [], updated: [], archived: [], removed: [] },
  commitSha,
  commitUrl,
  manualUrl,
  openspecUrl = "https://spec.grade10-stg.com/openspec/",
}) {
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
        text: { type: "mrkdwn", text: ":memo: OpenSpec updates" },
      },
      ...sections.map(([status, label, icon]) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${icon} *${label}*\n${changes[status]
            .map(
              ({ id, title, scopes }) =>
                `- ${changeLink(id, title, openspecUrl)} (\`${id}\`)${scopesText(scopes)}`,
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
            text: `${icon} *${label} capabilities*\n${capabilities[status]
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

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((argument) => argument !== "--"),
    options: {
      base: { type: "string" },
      head: { type: "string", default: "HEAD" },
      "commit-url": { type: "string", default: "" },
      "manual-url": { type: "string", default: "https://spec.grade10-stg.com/planning" },
      "openspec-url": { type: "string", default: "https://spec.grade10-stg.com/openspec/" },
      "github-output": { type: "string" },
    },
  });
  if (!values.base) throw new Error("--base is required");

  const changed = await changedFiles(values.base, values.head);
  const changedPaths = changed.flatMap(({ oldPath, path }) => [oldPath, path]).filter(Boolean);
  const changes = await titledChanges(
    classifyChanges(changed),
    { base: values.base, head: values.head },
  );
  const capabilities = classifyCapabilities(changed);
  const { stdout: commitSha } = await exec("git", ["rev-parse", values.head], { cwd: rootDirectory });
  const payload = slackPayload({
    changes,
    capabilities,
    commitSha: commitSha.trim(),
    commitUrl: values["commit-url"],
    manualUrl: values["manual-url"],
    openspecUrl: values["openspec-url"],
  });
  const hasChanges =
    Object.values(changes).some((items) => items.length) ||
    Object.values(capabilities).some((items) => items.length);

  if (values["github-output"]) {
    await appendFile(
      values["github-output"],
      `has-changes=${hasChanges}\npayload=${JSON.stringify(payload)}\n`,
    );
  }
  process.stdout.write(JSON.stringify({ changedPaths, changes, capabilities, payload }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
