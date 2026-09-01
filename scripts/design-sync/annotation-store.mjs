import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve } from "node:path";
import {
  baselineDigestFor,
  normaliseBaselineEntries,
} from "./annotation-core.mjs";

export class AnnotationStoreTransactionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AnnotationStoreTransactionError";
  }
}

function fail(message) {
  throw new AnnotationStoreTransactionError(message);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => key !== "baselineDigest")
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  return value;
}

export function contentDigest(value) {
  return `sha256:${createHash("sha256")
    .update(
      typeof value === "string" ? value : JSON.stringify(canonicalize(value)),
    )
    .digest("hex")}`;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeRelativePath(value, label) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.startsWith("/") ||
    value.split("/").includes("..") ||
    value.includes("\\")
  )
    fail(`${label} must be a relative path without traversal`);
  return value.trim();
}

function pathInside(root, path) {
  const resolvedPath = resolve(root, path);
  const rel = relative(resolve(root), resolvedPath);
  if (rel.startsWith("..") || rel === "")
    fail("target path is outside the store");
  return resolvedPath;
}

function changeDirectories(storeRoot) {
  const root = resolve(storeRoot, "openspec/changes");
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "archive")
    .map((entry) => entry.name);
}

function capabilityExists(storeRoot, capability) {
  const segments = capability.split("/");
  if (
    segments.some((segment) => !segment || segment === "." || segment === "..")
  )
    return false;
  return existsSync(
    resolve(storeRoot, "openspec", "specs", ...segments, "spec.md"),
  );
}

function taskGroupExists(storeRoot, change, taskGroup) {
  if (!changeDirectories(storeRoot).includes(change)) return false;
  const tasksPath = resolve(
    storeRoot,
    "openspec",
    "changes",
    change,
    "tasks.md",
  );
  if (!existsSync(tasksPath)) return false;
  const number = /^(\d+)/.exec(String(taskGroup).trim())?.[1];
  if (!number) return false;
  return new RegExp(`^##\\s+${number}\\.`, "m").test(
    readFileSync(tasksPath, "utf8"),
  );
}

/**
 * Validate the only association forms the store can resolve. This is the
 * semantic authority for acceptance; callers must not invent a looser shape.
 */
export function validateAssociation(association, { storeRoot } = {}) {
  const root = resolve(storeRoot ?? process.cwd());
  if (!isRecord(association) || !Object.keys(association).length)
    fail("association must be a non-empty object");
  const keys = Object.keys(association).sort();
  const allowed = new Set(["capability", "change", "taskGroup"]);
  if (keys.some((key) => !allowed.has(key)))
    fail(
      "association has an unknown key; use capability, change, or taskGroup",
    );
  for (const key of keys)
    if (typeof association[key] !== "string" || !association[key].trim())
      fail(`association ${key} must be a non-empty string`);

  if (keys.length === 1 && keys[0] === "capability") {
    if (!capabilityExists(root, association.capability.trim()))
      fail(
        `capability ${association.capability} does not exist in the registered store`,
      );
    return { capability: association.capability.trim() };
  }
  if (keys.length === 1 && keys[0] === "change") {
    if (!changeDirectories(root).includes(association.change.trim()))
      fail(
        `change ${association.change} does not exist in the registered store`,
      );
    return { change: association.change.trim() };
  }
  if (keys.length === 2 && keys[0] === "change" && keys[1] === "taskGroup") {
    const change = association.change.trim();
    const taskGroup = association.taskGroup.trim();
    if (!taskGroupExists(root, change, taskGroup))
      fail(
        `task group ${change}/${taskGroup} does not exist in the registered store`,
      );
    return { change, taskGroup };
  }
  fail(
    "association must be exactly capability, change, or change plus taskGroup",
  );
}

function validateOpenSpecContent(path, content) {
  if (typeof content !== "string" || !content.trim())
    fail(`${path} must contain non-empty text`);
  if (content.includes("\0") || /^(<<<<<<<|=======|>>>>>>>)/m.test(content))
    fail(`${path} contains invalid or unresolved patch content`);
  if (!/\.(?:md|ya?ml)$/.test(path)) fail(`${path} is not an OpenSpec file`);
}

export function normalizeRelatedFiles(relatedFiles, { storeRoot } = {}) {
  if (relatedFiles === undefined) return [];
  if (!Array.isArray(relatedFiles))
    fail("related OpenSpec files must be an array");
  const root = resolve(storeRoot ?? process.cwd());
  const seen = new Set();
  return relatedFiles.map((file) => {
    if (!isRecord(file))
      fail("related OpenSpec file payload must be an object");
    const path = safeRelativePath(file.path, "related OpenSpec path");
    if (
      !path.startsWith("openspec/changes/") &&
      !path.startsWith("openspec/specs/")
    )
      fail(`${path} is outside the OpenSpec store`);
    if (seen.has(path))
      fail(`related OpenSpec file ${path} is listed more than once`);
    seen.add(path);
    if (typeof file.content !== "string") fail(`${path} content must be text`);
    validateOpenSpecContent(path, file.content);
    const expectedDigest = file.beforeDigest ?? file.expectedDigest;
    if (
      typeof expectedDigest !== "string" ||
      !/^sha256:[0-9a-f]{64}$/.test(expectedDigest)
    )
      fail(`${path} needs an expected beforeDigest`);
    const absolutePath = pathInside(root, path);
    const exists = existsSync(absolutePath);
    if (!exists) fail(`${path} does not exist in the registered store`);
    const current = readFileSync(absolutePath, "utf8");
    if (contentDigest(current) !== expectedDigest)
      fail(`${path} changed before the related patch was prepared`);
    return { path, content: file.content, beforeDigest: expectedDigest };
  });
}

function gitDirtyPaths(storeRoot, paths) {
  if (!paths.length) return "";
  try {
    const output = execFileSync(
      "git",
      ["status", "--porcelain", "--untracked-files=all", "--", ...paths],
      {
        cwd: resolve(storeRoot),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    return output.trim();
  } catch {
    return "";
  }
}

function transactionWrite(files) {
  const token = `${process.pid}-${randomUUID()}`;
  const staged = files.map((file) => ({
    ...file,
    temporary: `${file.path}.tmp-${token}`,
    backup: `${file.path}.bak-${token}`,
    moved: false,
    installed: false,
  }));
  try {
    for (const file of staged) {
      mkdirSync(dirname(file.path), { recursive: true });
      writeFileSync(file.temporary, file.content, { flag: "wx" });
      if (file.mode !== undefined) chmodSync(file.temporary, file.mode);
    }
    for (const file of staged) {
      if (existsSync(file.path)) {
        renameSync(file.path, file.backup);
        file.moved = true;
      }
      renameSync(file.temporary, file.path);
      file.installed = true;
    }
  } catch (error) {
    for (const file of [...staged].reverse()) {
      try {
        if (file.installed) unlinkSync(file.path);
        if (file.moved) renameSync(file.backup, file.path);
        if (existsSync(file.temporary)) unlinkSync(file.temporary);
      } catch {
        // Best effort restoration; the original error remains actionable.
      }
    }
    throw new AnnotationStoreTransactionError(
      `annotation transaction rolled back: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  for (const file of staged) {
    if (!file.moved) continue;
    try {
      unlinkSync(file.backup);
    } catch (error) {
      process.emitWarning(
        `annotation transaction committed but backup cleanup failed for ${file.backup}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

/** Apply baseline and exact related OpenSpec contents as one checked transaction. */
export function applyAcceptanceTransaction({
  storeRoot,
  baselinePath,
  baseline,
  decisions,
} = {}) {
  const root = resolve(storeRoot ?? process.cwd());
  const resolvedBaseline = pathInside(
    root,
    baselinePath ?? "scripts/design-sync/annotation-baseline.json",
  );
  if (!existsSync(resolvedBaseline)) fail("annotation baseline does not exist");
  const baselineContent = readFileSync(resolvedBaseline, "utf8");
  let currentBaseline;
  try {
    currentBaseline = JSON.parse(baselineContent);
  } catch (error) {
    fail(
      `annotation baseline is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (typeof decisions?.baselineDigest !== "string")
    fail("acceptance requires a baseline digest");
  const currentDigest = baselineDigestFor(currentBaseline);
  if (currentDigest !== decisions.baselineDigest)
    fail("baseline digest does not match the current store baseline");
  const expectedBaseline = JSON.stringify(baseline, null, 2) + "\n";
  const related = normalizeRelatedFiles(
    decisions.relatedFiles ?? decisions.relatedOpenSpec ?? [],
    { storeRoot: root },
  );
  const relativeBaseline = relative(root, resolvedBaseline);
  const dirtyTargets = [];
  if (!relativeBaseline.startsWith("..")) dirtyTargets.push(relativeBaseline);
  dirtyTargets.push(...related.map((file) => file.path));
  const dirty = gitDirtyPaths(root, dirtyTargets);
  if (dirty) fail(`overlapping dirty store targets block acceptance: ${dirty}`);
  const targetPaths = new Set(dirtyTargets);
  if (targetPaths.size !== dirtyTargets.length)
    fail("baseline and related OpenSpec targets overlap");
  const files = [
    {
      path: resolvedBaseline,
      content: expectedBaseline,
      mode: statSync(resolvedBaseline).mode,
    },
    ...related.map((file) => {
      const path = pathInside(root, file.path);
      return { path, content: file.content, mode: statSync(path).mode };
    }),
  ];
  // All JSON and OpenSpec payload validation is complete before this write.
  JSON.parse(expectedBaseline);
  const baselineBlockers = [];
  normaliseBaselineEntries(baseline, baselineBlockers);
  if (baselineBlockers.length)
    fail("resulting annotation baseline is malformed");
  transactionWrite(files);
  return {
    status: "accepted",
    files: [relativeBaseline, ...related.map((file) => file.path)],
  };
}
