import { execFile } from "node:child_process";
import { appendFile, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import {
  dirname,
  extname,
  join,
  normalize,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";

import { diffSnapshots } from "./render-diff.mjs";

const exec = promisify(execFile);
const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(join(rootDirectory, "package.json"));
let ts;
try {
  ts = require("typescript");
} catch {
  ts = createRequire(join(rootDirectory, "packages/ui/package.json"))(
    "typescript",
  );
}
const STORY_ROOTS = [
  "apps/preview/src",
  "packages/ui/src",
  "packages/design-system/src",
];
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".json"];
const GLOBAL_INPUTS = [
  "apps/preview/.storybook/",
  "apps/preview/.storybook-workbench/",
  "packages/design-system/src/theme.css",
  "packages/design-system/src/themes/",
];

function repositoryPath(root, file) {
  return normalize(relative(root, file));
}

function isWorkbenchStory(path) {
  return (
    STORY_ROOTS.some((root) => path.startsWith(`${root}/`)) &&
    /\.stories\.[cm]?[jt]sx?$/.test(path)
  );
}

function isGlobalInput(path) {
  return GLOBAL_INPUTS.some((input) =>
    input.endsWith("/") ? path.startsWith(input) : path === input,
  );
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function sourceFile(path) {
  if (await exists(path)) return path;
  if (!extname(path)) {
    for (const extension of SOURCE_EXTENSIONS) {
      if (await exists(`${path}${extension}`)) return `${path}${extension}`;
    }
    for (const extension of SOURCE_EXTENSIONS) {
      const index = join(path, `index${extension}`);
      if (await exists(index)) return index;
    }
  }
  return null;
}

function workspaceSource(root, specifier) {
  if (specifier === "@grade10/ui")
    return join(root, "packages/ui/src/index.ts");
  if (specifier === "@grade10/design-system") {
    return join(root, "packages/design-system/src/index.ts");
  }
  if (specifier === "@grade10/date") {
    return join(root, "packages/date/src/index.ts");
  }

  const match = /^@grade10\/(ui|design-system)\/(.+)$/.exec(specifier);
  if (!match) return null;

  const [, packageName, path] = match;
  const base = join(root, "packages", packageName, "src");
  return join(base, path);
}

async function resolveImport(root, file, specifier) {
  if (specifier.startsWith("."))
    return sourceFile(resolve(dirname(file), specifier));
  const workspacePath = workspaceSource(root, specifier);
  return workspacePath ? sourceFile(workspacePath) : null;
}

function importNames(clause) {
  if (!clause) return null;
  if (
    clause.name ||
    clause.namedBindings?.kind === ts.SyntaxKind.NamespaceImport
  ) {
    return null;
  }
  return new Set(
    clause.namedBindings?.elements.map(
      (element) => (element.propertyName ?? element.name).text,
    ) ?? [],
  );
}

function isBarrel(source) {
  const statements = source.statements;
  return (
    statements.some((statement) => ts.isExportDeclaration(statement)) &&
    statements.every(
      (statement) =>
        ts.isExportDeclaration(statement) ||
        ts.isEmptyStatement(statement) ||
        ts.isImportDeclaration(statement),
    )
  );
}

function exportNames(statement, requested) {
  if (!statement.exportClause) return null;
  const names = new Set();
  for (const element of statement.exportClause.elements) {
    if (!requested || requested.has(element.name.text)) {
      names.add((element.propertyName ?? element.name).text);
    }
  }
  return names.size ? names : new Set();
}

function moduleReferences(source, requested) {
  const references = [];
  const barrel = isBarrel(source);

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && !barrel) {
      if (ts.isStringLiteral(statement.moduleSpecifier)) {
        references.push({
          names: importNames(statement.importClause),
          specifier: statement.moduleSpecifier.text,
        });
      }
      continue;
    }
    if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
      if (ts.isStringLiteral(statement.moduleSpecifier)) {
        const names = statement.exportClause
          ? exportNames(statement, requested)
          : requested;
        if (names === null || names.size) {
          references.push({ names, specifier: statement.moduleSpecifier.text });
        }
      }
    }
  }

  if (!barrel) {
    const visit = (node) => {
      if (
        ts.isNewExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "URL" &&
        node.arguments?.length >= 1 &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        references.push({ names: null, specifier: node.arguments[0].text });
      }
      ts.forEachChild(node, visit);
    };
    ts.forEachChild(source, visit);
  }

  return references;
}

async function workbenchStories(root) {
  const stories = [];
  for (const directory of STORY_ROOTS) {
    let entries;
    try {
      entries = await readdir(join(root, directory), { recursive: true });
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    for (const entry of entries) {
      const path = normalize(join(directory, entry));
      if (isWorkbenchStory(path)) stories.push(path);
    }
  }
  return stories.sort();
}

async function dependencies(root, entry) {
  const found = new Set();
  const visited = new Set();
  const sources = new Map();
  const exports = new Map();

  async function readSource(path) {
    if (!sources.has(path)) {
      sources.set(
        path,
        ts.createSourceFile(
          path,
          await readFile(path, "utf8"),
          ts.ScriptTarget.Latest,
          true,
        ),
      );
    }
    return sources.get(path);
  }

  async function exportedNames(path, ancestors = new Set()) {
    if (ancestors.has(path)) return new Set();
    if (exports.has(path)) return exports.get(path);

    const pending = (async () => {
      const source = await readSource(path);
      const names = new Set();
      const nextAncestors = new Set(ancestors).add(path);

      for (const statement of source.statements) {
        if (ts.isExportDeclaration(statement)) {
          if (statement.exportClause) {
            for (const element of statement.exportClause.elements) {
              names.add(element.name.text);
            }
          } else if (statement.moduleSpecifier) {
            const specifier = statement.moduleSpecifier;
            if (ts.isStringLiteral(specifier)) {
              const target = await resolveImport(root, path, specifier.text);
              if (target) {
                for (const name of await exportedNames(target, nextAncestors))
                  names.add(name);
              }
            }
          }
          continue;
        }

        const modifiers = ts.canHaveModifiers(statement)
          ? ts.getModifiers(statement)
          : undefined;
        if (
          modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
          )
        ) {
          if (
            modifiers.some(
              (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
            )
          ) {
            names.add("default");
          }
          if ("name" in statement && statement.name?.text) {
            names.add(statement.name.text);
          }
          if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
              if (ts.isIdentifier(declaration.name))
                names.add(declaration.name.text);
            }
          }
        }
      }
      return names;
    })();
    exports.set(path, pending);
    return pending;
  }

  async function visit(path, requested) {
    const key = `${path}\0${requested ? [...requested].sort().join(",") : "*"}`;
    if (visited.has(key)) return;
    visited.add(key);

    const source = await readSource(path);
    if (
      requested &&
      ![...(await exportedNames(path))].some((name) => requested.has(name))
    ) {
      return;
    }
    if (!isBarrel(source)) found.add(repositoryPath(root, path));
    for (const reference of moduleReferences(source, requested)) {
      const target = await resolveImport(root, path, reference.specifier);
      if (target) await visit(target, reference.names);
    }
  }

  await visit(join(root, entry), null);
  return found;
}

export async function affectedPageStories({
  changedFiles,
  root = rootDirectory,
}) {
  const changed = new Set(changedFiles.map((path) => normalize(path)));
  const pages = await workbenchStories(root);
  if ([...changed].some(isGlobalInput)) return pages;

  const affected = [];
  for (const page of pages) {
    const files = await dependencies(root, page);
    if ([...changed].some((path) => files.has(path))) affected.push(page);
  }
  return affected;
}

function storyImportPaths(path) {
  if (path.startsWith("apps/preview/")) {
    return [`.${path.slice("apps/preview".length)}`];
  }
  return [`../${path}`, `../../${path}`, `../../../${path}`];
}

function textBlocks(lines) {
  const blocks = [];
  let text = "";
  for (const line of lines) {
    if (text && text.length + line.length + 1 > 2800) {
      blocks.push({ text: { text, type: "mrkdwn" }, type: "section" });
      text = "";
    }
    text += `${text ? "\n" : ""}${line}`;
  }
  if (text) blocks.push({ text: { text, type: "mrkdwn" }, type: "section" });
  return blocks;
}

function storyGroupItem(story, count, storybookUrl) {
  const [root = "Stories", ...path] = story.title.split("/");
  const label = path.length ? path.join(" > ") : root;
  const storyCount = `${count} ${count === 1 ? "story" : "stories"}`;
  const linkedCount = story.id
    ? `<${storybookUrl}/?path=/story/${story.id}|${storyCount}>`
    : storyCount;
  const status = story.status ? ` ${story.status}` : "";
  return {
    item: `${label} — ${linkedCount}${status}`,
    root,
    sortKey: label,
  };
}

function mergedLine({ commitSha, commitUrl, mergedPrTitle, mergedPrUrl }) {
  if (!mergedPrTitle) return "";
  const title = mergedPrUrl
    ? `<${mergedPrUrl}|${mergedPrTitle}>`
    : mergedPrTitle;
  const sha = commitSha?.slice(0, 7);
  if (!sha) return `PR merged → ${title}`;
  const commit = commitUrl ? `<${commitUrl}|${sha}>` : sha;
  return `PR merged → ${title} (${commit})`;
}

const REASONS = {
  added: "🆕 new",
  layout: "layout shifted",
  text: "text changed",
};
const MAX_LISTED = 60;

// Lists only the stories whose render differs from the deployed baseline, so
// a shared-code edit that moved nothing says so in one line.
function renderPayload({
  candidates,
  commitLine,
  removedStories,
  renderChanges,
  storybookUrl,
}) {
  if (!candidates.length && !removedStories.length) return { blocks: [] };

  const changed = candidates.filter((story) => renderChanges.has(story.id));
  const lines = changed.map((story) => {
    const [root = "Stories", ...path] = story.title.split("/");
    const reason = REASONS[renderChanges.get(story.id)];
    return {
      line: `${path.join(" > ") || root} > ${story.name} — <${storybookUrl}/?path=/story/${story.id}|${reason}>`,
      root,
      sortKey: `${path.join(" > ")} ${story.name}`,
    };
  });
  for (const story of removedStories) {
    const [root = "Stories", ...path] = story.title.split("/");
    lines.push({
      line: `${path.join(" > ") || root} > ${story.name} — ❌ removed`,
      root,
      sortKey: `${path.join(" > ")} ${story.name}`,
    });
  }

  const summary = lines.length
    ? `*${changed.length} of ${candidates.length}* stories reached by this change render differently`
    : `No visual change in the ${candidates.length} stories reached by this change`;
  const shown = lines.slice(0, MAX_LISTED);
  const groups = new Map();
  for (const item of shown) {
    groups.set(item.root, [...(groups.get(item.root) ?? []), item]);
  }
  const nested = `${"\u00a0".repeat(4)}- `;
  const list = [...groups]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([root, items]) => [
      `- ${root}`,
      ...items
        .sort((left, right) => left.sortKey.localeCompare(right.sortKey))
        .map(({ line }) => `${nested}${line}`),
    ]);
  if (lines.length > shown.length) {
    list.push(`…and ${lines.length - shown.length} more`);
  }
  return {
    blocks: [
      {
        text: { text: `:art: Storybook deployed\n${summary}`, type: "mrkdwn" },
        type: "section",
      },
      ...textBlocks(list),
      ...(commitLine
        ? [{ elements: [{ text: commitLine, type: "mrkdwn" }], type: "context" }]
        : []),
    ],
  };
}

export function slackPayload({
  affectedPages,
  changedPaths = new Map(),
  commitSha,
  commitUrl,
  index,
  mergedPrTitle,
  mergedPrUrl,
  removedStories = [],
  renderChanges = null,
  storybookUrl,
}) {
  const pages = new Set(affectedPages.flatMap(storyImportPaths));
  const added = new Set(
    [...changedPaths]
      .filter(([, status]) => status === "A")
      .flatMap(([path]) => storyImportPaths(path)),
  );
  const stories = Object.values(index.entries ?? {})
    .filter((entry) => entry.type === "story" && pages.has(entry.importPath))
    .map((entry) => ({
      ...entry,
      status: added.has(entry.importPath) ? "🆕" : "",
    }));
  if (renderChanges) {
    return renderPayload({
      candidates: stories,
      commitLine: mergedLine({
        commitSha,
        commitUrl,
        mergedPrTitle,
        mergedPrUrl,
      }),
      removedStories,
      renderChanges,
      storybookUrl,
    });
  }
  const states = [...stories, ...removedStories];
  if (!states.length) return { blocks: [] };

  const files = new Map();
  for (const story of states) {
    const key = story.importPath ?? `removed:${story.title}`;
    const file = files.get(key) ?? { stories: [] };
    file.stories.push(story);
    files.set(key, file);
  }
  const groups = new Map();
  for (const file of files.values()) {
    const first = file.stories[0];
    const { item, root, sortKey } = storyGroupItem(
      first,
      file.stories.length,
      storybookUrl,
    );
    groups.set(root, [...(groups.get(root) ?? []), { item, sortKey }]);
  }
  const nested = `${"\u00a0".repeat(4)}- `;
  const links = [...groups]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([root, items]) => [
      `- ${root}`,
      ...items
        .sort((left, right) => left.sortKey.localeCompare(right.sortKey))
        .map(({ item }) => `${nested}${item}`),
    ]);
  const merged = mergedLine({
    commitSha,
    commitUrl,
    mergedPrTitle,
    mergedPrUrl,
  });
  return {
    blocks: [
      {
        text: { text: ":art: Storybook deployed", type: "mrkdwn" },
        type: "section",
      },
      ...textBlocks(links),
      ...(merged
        ? [
            {
              elements: [{ text: merged, type: "mrkdwn" }],
              type: "context",
            },
          ]
        : []),
    ],
  };
}

export async function changedFiles(base, head, cwd = rootDirectory) {
  const { stdout } = await exec(
    "git",
    ["diff", "--name-status", "--find-renames", `${base}...${head}`],
    { cwd, maxBuffer: Infinity },
  );
  return stdout
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      const [status, ...paths] = line.split("\t");
      // A moved story file is the same stories at a new path: neither removed
      // nor new, so a reorganisation reports what changed, not every story.
      if (status.startsWith("R")) {
        return [
          { path: paths[0], status: "R" },
          { path: paths[1], status: "M" },
        ];
      }
      return [{ path: paths[0], status: status[0] }];
    });
}

async function deletedStoryStates(base, changed) {
  return Promise.all(
    changed
      .filter(({ path, status }) => status === "D" && isWorkbenchStory(path))
      .map(async ({ path }) => {
        const { stdout } = await exec("git", ["show", `${base}:${path}`], {
          cwd: rootDirectory,
          maxBuffer: Infinity,
        });
        const source = ts.createSourceFile(
          path,
          stdout,
          ts.ScriptTarget.Latest,
          true,
        );
        let title;
        const names = [];
        const visit = (node) => {
          if (
            ts.isPropertyAssignment(node) &&
            ts.isIdentifier(node.name) &&
            node.name.text === "title" &&
            ts.isStringLiteral(node.initializer)
          ) {
            title = node.initializer.text;
          }
          if (
            ts.isVariableStatement(node) &&
            node.modifiers?.some(
              (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
            )
          ) {
            for (const declaration of node.declarationList.declarations) {
              if (ts.isIdentifier(declaration.name))
                names.push(declaration.name.text);
            }
          }
          ts.forEachChild(node, visit);
        };
        visit(source);
        return names.map((name) => ({
          name,
          status: "❌",
          title: title ?? "Pages",
        }));
      }),
  ).then((states) => states.flat());
}

// Renders the candidate stories and compares them with the baseline of the
// last deployed main. Returns null (list every candidate, as before) when no
// baseline exists yet; writes the refreshed baseline to `snapshotOut`.
async function renderedChanges({
  affectedPages,
  baselinePath,
  index,
  snapshotOut,
}) {
  if (!snapshotOut) return null;
  const { snapshotStories } = await import("./render-snapshots.mjs");
  let baseline = null;
  if (baselinePath) {
    try {
      baseline = JSON.parse(await readFile(baselinePath, "utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  const pages = new Set(affectedPages.flatMap(storyImportPaths));
  const storyIds = Object.values(index.entries ?? {})
    .filter((entry) => entry.type === "story")
    .map((entry) => entry.id);
  const candidates = Object.values(index.entries ?? {})
    .filter((entry) => entry.type === "story" && pages.has(entry.importPath))
    .map((entry) => entry.id);
  // No baseline: render everything so the next run has one to compare with.
  const current = await snapshotStories({
    ids: baseline ? candidates : storyIds,
    staticDirectory: join(rootDirectory, "apps/preview/storybook-static"),
  });

  const live = new Set(storyIds);
  const merged = Object.fromEntries(
    Object.entries({ ...baseline, ...current }).filter(([id]) => live.has(id)),
  );
  await writeFile(snapshotOut, JSON.stringify(merged));
  return baseline ? diffSnapshots(baseline, current) : null;
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((argument) => argument !== "--"),
    options: {
      base: { type: "string", default: "origin/main" },
      head: { type: "string", default: "HEAD" },
      "storybook-url": {
        type: "string",
        default: "https://storybook.grade10-stg.com",
      },
      "commit-url": { type: "string" },
      "merged-pr-title": { type: "string" },
      "merged-pr-url": { type: "string" },
      "github-output": { type: "string" },
      baseline: { type: "string" },
      "snapshot-out": { type: "string" },
    },
  });
  const changed = await changedFiles(values.base, values.head);
  const affectedPages = await affectedPageStories({
    changedFiles: changed.map(({ path }) => path),
  });
  const index = JSON.parse(
    await readFile(
      join(rootDirectory, "apps/preview/storybook-static/index.json"),
      "utf8",
    ),
  );
  const { stdout: commitSha } = await exec("git", ["rev-parse", values.head], {
    cwd: rootDirectory,
  });
  const renderChanges = await renderedChanges({
    affectedPages,
    baselinePath: values.baseline,
    index,
    snapshotOut: values["snapshot-out"],
  });
  const payload = slackPayload({
    affectedPages,
    changedPaths: new Map(changed.map(({ path, status }) => [path, status])),
    commitSha: commitSha.trim(),
    commitUrl: values["commit-url"],
    index,
    mergedPrTitle: values["merged-pr-title"],
    mergedPrUrl: values["merged-pr-url"],
    removedStories: await deletedStoryStates(values.base, changed),
    renderChanges,
    storybookUrl: values["storybook-url"].replace(/\/$/, ""),
  });

  if (values["github-output"]) {
    await appendFile(
      values["github-output"],
      `has-pages=${payload.blocks.length > 0}\npayload=${JSON.stringify(payload)}\n`,
    );
  }
  process.stdout.write(JSON.stringify(payload));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
