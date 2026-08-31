import { execFile } from "node:child_process";
import { appendFile, readdir, readFile, stat } from "node:fs/promises";
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
const PAGE_DIRECTORY = "apps/preview/src/pages";
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".json"];
const GLOBAL_INPUTS = [
  "package.json",
  "apps/preview/.storybook/",
  "apps/preview/.storybook-workbench/",
  "apps/preview/vite.config.ts",
  "apps/preview/package.json",
  "packages/design-system/src/theme.css",
  "packages/design-system/src/themes/",
];

function repositoryPath(root, file) {
  return normalize(relative(root, file));
}

function isPageStory(path) {
  return (
    path.startsWith(`${PAGE_DIRECTORY}/`) &&
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
    clause.namedBindings?.elements.map((element) => element.name.text) ?? [],
  );
}

function isBarrel(source) {
  return source.statements.every(
    (statement) =>
      ts.isExportDeclaration(statement) ||
      ts.isEmptyStatement(statement) ||
      ts.isImportDeclaration(statement),
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
        const names = exportNames(statement, requested);
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

async function pageStories(root) {
  const directory = join(root, PAGE_DIRECTORY);
  const entries = await readdir(directory, { recursive: true });
  return entries
    .filter((entry) => isPageStory(normalize(join(PAGE_DIRECTORY, entry))))
    .map((entry) => normalize(join(PAGE_DIRECTORY, entry)))
    .sort();
}

async function dependencies(root, entry) {
  const found = new Set();
  const visited = new Set();

  async function visit(path, requested) {
    const key = `${path}\0${requested ? [...requested].sort().join(",") : "*"}`;
    if (visited.has(key)) return;
    visited.add(key);
    found.add(repositoryPath(root, path));

    const source = ts.createSourceFile(
      path,
      await readFile(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
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
  const pages = await pageStories(root);
  if ([...changed].some(isGlobalInput)) return pages;

  const affected = [];
  for (const page of pages) {
    const files = await dependencies(root, page);
    if ([...changed].some((path) => files.has(path))) affected.push(page);
  }
  return affected;
}

function storyPath(path) {
  return `.${path.slice("apps/preview".length)}`;
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

export function slackPayload({
  affectedPages,
  commitSha,
  commitUrl,
  index,
  storybookUrl,
}) {
  const pages = new Set(affectedPages.map(storyPath));
  const stories = Object.values(index.entries ?? {})
    .filter((entry) => entry.type === "story" && pages.has(entry.importPath))
    .sort((a, b) => a.id.localeCompare(b.id));
  if (!stories.length) return { blocks: [] };

  const commit = commitUrl
    ? ` · <${commitUrl}|${commitSha?.slice(0, 7) ?? "commit"}>`
    : "";
  const links = stories.map(
    (story) =>
      `• <${storybookUrl}/iframe.html?id=${story.id}&viewMode=story|${story.title} / ${story.name}>`,
  );
  return {
    blocks: [
      {
        text: { text: `:art: Storybook deployed${commit}`, type: "mrkdwn" },
        type: "section",
      },
      ...textBlocks(links),
    ],
  };
}

async function changedFiles(base, head) {
  const { stdout } = await exec(
    "git",
    ["diff", "--name-only", "--diff-filter=ACMR", `${base}...${head}`],
    { cwd: rootDirectory },
  );
  return stdout.split("\n").filter(Boolean);
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((argument) => argument !== "--"),
    options: {
      base: { type: "string", default: "origin/main" },
      head: { type: "string", default: "HEAD" },
      "storybook-url": {
        type: "string",
        default: "https://grade10-storybook.memeland-qa.workers.dev",
      },
      "commit-url": { type: "string" },
      "github-output": { type: "string" },
    },
  });
  const changed = await changedFiles(values.base, values.head);
  const affectedPages = await affectedPageStories({ changedFiles: changed });
  const index = JSON.parse(
    await readFile(
      join(rootDirectory, "apps/preview/storybook-static/index.json"),
      "utf8",
    ),
  );
  const { stdout: commitSha } = await exec("git", ["rev-parse", values.head], {
    cwd: rootDirectory,
  });
  const payload = slackPayload({
    affectedPages,
    commitSha: commitSha.trim(),
    commitUrl: values["commit-url"],
    index,
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
