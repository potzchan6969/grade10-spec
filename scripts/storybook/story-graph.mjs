/**
 * The workbench stories and the source each one reads, followed through its
 * imports from source with no build: which stories a change reaches, and what
 * a story's render inputs are.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
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

export const rootDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const require = createRequire(join(rootDirectory, "package.json"));
export let ts;
try {
  ts = require("typescript");
} catch {
  ts = createRequire(join(rootDirectory, "packages/ui/package.json"))(
    "typescript",
  );
}
export const STORY_ROOTS = [
  "apps/preview/src",
  "packages/ui/src",
  "packages/design-system/src",
];
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".json"];
export const GLOBAL_INPUTS = [
  "apps/preview/.storybook/",
  "apps/preview/.storybook-workbench/",
  "packages/design-system/src/theme.css",
  "packages/design-system/src/themes/",
];

function repositoryPath(root, file) {
  return normalize(relative(root, file));
}

export function isWorkbenchStory(path) {
  return (
    STORY_ROOTS.some((root) => path.startsWith(`${root}/`)) &&
    /\.stories\.[cm]?[jt]sx?$/.test(path)
  );
}

export function isGlobalInput(path) {
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

const packageExports = new Map();

function exportsOf(directory) {
  if (!packageExports.has(directory)) {
    let exports = null;
    try {
      exports =
        JSON.parse(readFileSync(join(directory, "package.json"), "utf8"))
          .exports ?? null;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    packageExports.set(directory, exports);
  }
  return packageExports.get(directory);
}

function exportPath(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object")
    return exportPath(value.import ?? value.default ?? value.types);
  return null;
}

// Node's rule: the exact subpath, else the `*` pattern with the longest
// prefix, its `*` replaced by what the subpath matched.
function exportTarget(exports, key) {
  if (typeof exports === "string") return key === "." ? exports : null;
  if (Object.hasOwn(exports, key)) return exportPath(exports[key]);
  let best = null;
  for (const [pattern, value] of Object.entries(exports)) {
    const star = pattern.indexOf("*");
    if (star === -1) continue;
    const prefix = pattern.slice(0, star);
    const suffix = pattern.slice(star + 1);
    if (
      key.length >= prefix.length + suffix.length &&
      key.startsWith(prefix) &&
      key.endsWith(suffix) &&
      (!best || prefix.length > best.prefix.length)
    )
      best = { prefix, suffix, value };
  }
  if (!best) return null;
  const middle = key.slice(best.prefix.length, key.length - best.suffix.length);
  return exportPath(best.value)?.replaceAll("*", middle) ?? null;
}

// Any workspace package, through its own `exports`; a path it does not
// export is read from its source folder.
function workspaceSource(root, specifier) {
  const match = /^@grade10\/([^/]+)(?:\/(.+))?$/.exec(specifier);
  if (!match) return null;
  const [, name, subpath] = match;
  const directory = join(root, "packages", name);
  const exports = exportsOf(directory);
  const target =
    exports && exportTarget(exports, subpath ? `./${subpath}` : ".");
  if (target) return join(directory, target);
  return join(directory, "src", subpath ?? "index.ts");
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

export async function workbenchStories(root) {
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

export async function dependencies(root, entry) {
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

async function globalInputFiles(root) {
  const files = [];
  for (const input of GLOBAL_INPUTS) {
    if (!input.endsWith("/")) {
      if (await exists(join(root, input))) files.push(input);
      continue;
    }
    let entries;
    try {
      entries = await readdir(join(root, input), {
        recursive: true,
        withFileTypes: true,
      });
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    for (const entry of entries)
      if (entry.isFile())
        files.push(
          repositoryPath(
            root,
            join(entry.parentPath ?? entry.path, entry.name),
          ),
        );
  }
  return files;
}

/**
 * Each story file's render inputs as one SHA-256: every file it reads through
 * its imports, and the workbench's global inputs, by path and content. A
 * story whose fingerprint is unchanged renders from the same source.
 */
export async function storyFingerprints({ root = rootDirectory } = {}) {
  const digests = new Map();
  const digestOf = async (path) => {
    if (!digests.has(path))
      digests.set(
        path,
        createHash("sha256")
          .update(await readFile(join(root, path)))
          .digest("hex"),
      );
    return digests.get(path);
  };
  // The global inputs, and what their source imports: the preview loads
  // the message catalogs for every story.
  const shared = new Set();
  for (const file of await globalInputFiles(root)) {
    shared.add(file);
    if (/\.[cm]?[jt]sx?$/.test(file))
      for (const dependency of await dependencies(root, file))
        shared.add(dependency);
  }
  const fingerprints = new Map();
  for (const story of await workbenchStories(root)) {
    const files = [
      ...new Set([...shared, ...(await dependencies(root, story))]),
    ].sort();
    const parts = [];
    for (const path of files) parts.push([path, await digestOf(path)]);
    fingerprints.set(
      story,
      createHash("sha256").update(JSON.stringify(parts)).digest("hex"),
    );
  }
  return fingerprints;
}
