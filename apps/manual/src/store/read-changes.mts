import { existsSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type {
  ChangeEntry,
  ChangeStatus,
  Delta,
  TaskGroup,
} from "../api/types.ts";
import {
  readTextIfExists,
  StoreFileError,
  storePath,
  subdirectories,
  toItemError,
  walkFiles,
} from "./disk.mts";
import type { GitIndex } from "./git.mts";
import { leadingTitle, outline, type Section } from "./markdown.mts";

const OWNER = /\(owner:\s*@([A-Za-z0-9][A-Za-z0-9_-]*)\)/g;
const GROUP_HEADING = /^\d+\.\s*(.+)$/;
const REPO_TAG = /\s*\(([^()@]+)\)\s*$/;
const CHECKBOX = /^\s*-\s*\[( |x|X)\]/;
const DELTA_HEADING = /^(ADDED|MODIFIED|REMOVED|RENAMED)\s+Requirements$/;
const AUTHOR =
  /^\*\*Author:\*\*\s*@([A-Za-z0-9][A-Za-z0-9_-]*)(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?\s*$/m;
const ARCHIVE_PREFIX = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

export function readChanges(root: string, git: GitIndex): ChangeEntry[] {
  const dir = join(root, "openspec", "changes");
  return subdirectories(dir)
    .filter((name) => name !== "archive")
    .map((name) => readChange(root, join(dir, name), name, "in-flight", git));
}

export function readArchivedChanges(
  root: string,
  git: GitIndex,
): ChangeEntry[] {
  const dir = join(root, "openspec", "changes", "archive");
  return subdirectories(dir).map((name) => {
    const dated = ARCHIVE_PREFIX.exec(name);
    const entry = readChange(
      root,
      join(dir, name),
      dated ? dated[2] : name,
      "archived",
      git,
    );
    if (entry.created === "" && dated) entry.created = dated[1];
    return entry;
  });
}

function readChange(
  root: string,
  dir: string,
  id: string,
  status: ChangeStatus,
  git: GitIndex,
): ChangeEntry {
  const rel = storePath(root, dir);
  const entry: ChangeEntry = {
    id,
    schema: "",
    status,
    owners: [],
    created: "",
    title: humanize(id),
    why: "",
    taskGroups: [],
    deltas: [],
  };

  const lastMoved = git.commitOf(`${rel}/tasks.md`)?.date;
  if (lastMoved) entry.lastMoved = lastMoved;

  const fail = (file: string, cause: unknown) => {
    if (!entry.error) entry.error = toItemError(file, cause);
  };

  const manifest = readTextIfExists(join(dir, ".openspec.yaml"));
  if (manifest !== undefined) {
    try {
      const parsed = YAML.parse(manifest) ?? {};
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new StoreFileError(1, "`.openspec.yaml` must be a mapping");
      }
      const fields = parsed as Record<string, unknown>;
      if (typeof fields.schema === "string") entry.schema = fields.schema;
      if (typeof fields.created === "string") entry.created = fields.created;
      else if (fields.created instanceof Date) {
        entry.created = fields.created.toISOString().slice(0, 10);
      }
    } catch (cause) {
      fail(`${rel}/.openspec.yaml`, cause);
    }
  }

  const proposal = readTextIfExists(join(dir, "proposal.md"));
  if (proposal === undefined) {
    fail(`${rel}/proposal.md`, new StoreFileError(1, "change has no proposal"));
  } else {
    const sections = outline(proposal);
    const title = leadingTitle(sections);
    if (title) entry.title = title;
    const body = title ? sections[0].children : sections;
    const why = body.find((section) => /^Why\b/.test(section.heading));
    if (why) entry.why = why.body;
    else {
      fail(
        `${rel}/proposal.md`,
        new StoreFileError(1, "proposal has no `## Why`"),
      );
    }
    const author = AUTHOR.exec(proposal);
    if (author?.[1]) entry.author = author[1];
    if (entry.created === "") entry.created = author?.[2] ?? "";
  }

  const tasks = readTextIfExists(join(dir, "tasks.md"));
  if (tasks !== undefined) {
    entry.owners = [...new Set(matchAll(tasks, OWNER))];
    try {
      entry.taskGroups = readTaskGroups(tasks);
    } catch (cause) {
      fail(`${rel}/tasks.md`, cause);
    }
  }

  entry.deltas = readDeltas(root, dir, fail);
  return entry;
}

function readTaskGroups(text: string): TaskGroup[] {
  const groups: TaskGroup[] = [];
  const visit = (sections: Section[]): void => {
    for (const section of sections) {
      const match = GROUP_HEADING.exec(section.heading);
      if (!match) {
        visit(section.children);
        continue;
      }
      const title = match[1].replace(OWNER, "").trimEnd();
      const repo = REPO_TAG.exec(title);
      groups.push({
        title: repo ? title.slice(0, repo.index).trimEnd() : title,
        repo: repo ? repo[1].trim() : "",
        ...countTasks(section.raw),
      });
    }
  };
  visit(outline(text));
  return groups;
}

function countTasks(text: string): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const line of text.split("\n")) {
    const box = CHECKBOX.exec(line);
    if (!box) continue;
    total += 1;
    if (box[1] !== " ") done += 1;
  }
  return { done, total };
}

function readDeltas(
  root: string,
  dir: string,
  fail: (file: string, cause: unknown) => void,
): Delta[] {
  const specsDir = join(dir, "specs");
  if (!existsSync(specsDir)) return [];
  const deltas: Delta[] = [];
  const prefix = `${storePath(root, specsDir)}/`;

  for (const file of walkFiles(root, specsDir, "spec.md")) {
    const spec = file.slice(prefix.length, -"/spec.md".length);
    const text = readTextIfExists(join(root, file));
    if (text === undefined) continue;
    const kinds = outline(text)
      .flatMap((section) =>
        section.level === 1 ? section.children : [section],
      )
      .map((section) => DELTA_HEADING.exec(section.heading)?.[1])
      .filter((kind): kind is string => kind !== undefined);
    if (kinds.length === 0) {
      fail(
        file,
        new StoreFileError(
          1,
          "delta names no ADDED/MODIFIED/REMOVED/RENAMED requirements",
        ),
      );
    }
    deltas.push({ spec, kinds: [...new Set(kinds)] });
  }
  return deltas;
}

function matchAll(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].map((match) => match[1]);
}

function humanize(id: string): string {
  const words = id.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
