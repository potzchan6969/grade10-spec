/**
 * Every story and docs id the workbench serves, read from source with no
 * Storybook build. A story's id is its meta title and export name run through
 * Storybook's own `sanitize` and `storyNameFromExport`, so the check, the
 * rename and `check:manual` can all resolve an id before anything is built.
 */
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const rootDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

/** Where the workbench reads stories from, as `.storybook-workbench` globs them. */
export const STORY_ROOTS = [
  "apps/preview/src",
  "packages/ui/src",
  "packages/design-system/src",
];

const STORY_FILE = /\.stories\.(ts|tsx)$/;
const DOCS_FILE = /\.mdx$/;

let typescript;
function ts() {
  if (typescript) return typescript;
  const require = createRequire(join(rootDirectory, "package.json"));
  try {
    typescript = require("typescript");
  } catch {
    typescript = createRequire(join(rootDirectory, "packages/ui/package.json"))(
      "typescript",
    );
  }
  return typescript;
}

/** Storybook's `sanitize`, from `storybook/internal/csf`. */
export function sanitize(text) {
  return text
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/** Storybook's `storyNameFromExport`, from `storybook/internal/csf`. */
export function storyNameFromExport(key) {
  return key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\./g, " ")
    .replace(/([^\n])([A-Z])([a-z])/g, (_, a, b, c) => `${a} ${b}${c}`)
    .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a} ${b}`)
    .replace(/([a-z])([0-9])/gi, (_, a, b) => `${a} ${b}`)
    .replace(/([0-9])([a-z])/gi, (_, a, b) => `${a} ${b}`)
    .replace(/(\s|^)(\w)/g, (_, a, b) => `${a}${b.toUpperCase()}`)
    .replace(/ +/g, " ")
    .trim();
}

export const toId = (title, name) =>
  name ? `${sanitize(title)}--${sanitize(name)}` : sanitize(title);

function propertyOf(object, key) {
  const t = ts();
  return object.properties.find(
    (property) =>
      t.isPropertyAssignment(property) &&
      (t.isIdentifier(property.name) || t.isStringLiteral(property.name)) &&
      property.name.text === key,
  );
}

function objectLiteral(node) {
  const t = ts();
  let current = node;
  while (
    current &&
    (t.isSatisfiesExpression(current) ||
      t.isAsExpression(current) ||
      t.isParenthesizedExpression(current))
  ) {
    current = current.expression;
  }
  return current && t.isObjectLiteralExpression(current) ? current : null;
}

function stringsOf(node) {
  const t = ts();
  if (!node || !t.isArrayLiteralExpression(node)) return [];
  return node.elements
    .filter((element) => t.isStringLiteralLike(element))
    .map((element) => element.text);
}

/** `parameters.journeys` of a meta or a story: the journey ids a flow walks. */
function journeysOf(object) {
  const parameters = parametersOf(object);
  return parameters
    ? stringsOf(propertyOf(parameters, "journeys")?.initializer)
    : [];
}

function parametersOf(object) {
  return objectLiteral(propertyOf(object, "parameters")?.initializer);
}

/**
 * Where one file's names come from: its own top-level consts, and what it
 * imports from a relative module, read on demand. A Flow spreads shared
 * settings and rules from a module beside it, so the check follows them.
 */
function moduleScope(path, source, loader) {
  const t = ts();
  const declarations = new Map();
  const imports = new Map();
  for (const statement of source.statements) {
    if (t.isVariableStatement(statement))
      for (const declaration of statement.declarationList.declarations)
        if (t.isIdentifier(declaration.name))
          declarations.set(declaration.name.text, declaration.initializer);
    if (
      t.isImportDeclaration(statement) &&
      t.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text.startsWith(".") &&
      statement.importClause?.namedBindings &&
      t.isNamedImports(statement.importClause.namedBindings)
    )
      for (const element of statement.importClause.namedBindings.elements)
        imports.set(element.name.text, {
          from: posixJoin(path, statement.moduleSpecifier.text),
          name: (element.propertyName ?? element.name).text,
        });
  }
  return { declarations, imports, loader };
}

const posixJoin = (path, specifier) =>
  join(dirname(path), specifier).split(sep).join("/");

/** Reads a module once per index, and gives nothing for a file that is not there. */
export function loaderOf(read) {
  if (!read) return null;
  const scopes = new Map();
  const text = (path) => {
    try {
      return read(path);
    } catch {
      return null;
    }
  };
  return { scopes, text };
}

function importedScope(from, loader) {
  if (!loader) return null;
  for (const candidate of [`${from}.ts`, `${from}.tsx`, from]) {
    if (loader.scopes.has(candidate)) return loader.scopes.get(candidate);
    const text = loader.text(candidate);
    if (text == null) continue;
    const t = ts();
    const source = t.createSourceFile(
      candidate,
      text,
      t.ScriptTarget.Latest,
      true,
    );
    const scope = moduleScope(candidate, source, loader);
    loader.scopes.set(candidate, scope);
    return scope;
  }
  return null;
}

/** An object literal behind a node, following names, imports and `as const`. */
function resolveObject(node, scope, depth = 0) {
  const t = ts();
  const literal = objectLiteral(node);
  if (literal) return { literal, scope };
  let current = node;
  while (
    current &&
    (t.isSatisfiesExpression(current) ||
      t.isAsExpression(current) ||
      t.isParenthesizedExpression(current))
  )
    current = current.expression;
  if (!current || !t.isIdentifier(current) || !scope || depth > 8) return null;
  const name = current.text;
  if (scope.declarations.has(name))
    return resolveObject(scope.declarations.get(name), scope, depth + 1);
  const imported = scope.imports.get(name);
  const next = imported && importedScope(imported.from, scope.loader);
  return next?.declarations.has(imported.name)
    ? resolveObject(next.declarations.get(imported.name), next, depth + 1)
    : null;
}

/** `[key, value node, scope]` for each property, spreads followed in order. */
function entriesOf(node, scope, depth = 0) {
  const t = ts();
  const resolved = resolveObject(node, scope, depth);
  if (!resolved) return [];
  const entries = [];
  for (const property of resolved.literal.properties) {
    if (t.isSpreadAssignment(property))
      entries.push(
        ...entriesOf(property.expression, resolved.scope, depth + 1),
      );
    else if (
      t.isPropertyAssignment(property) &&
      (t.isIdentifier(property.name) || t.isStringLiteral(property.name))
    )
      entries.push([property.name.text, property.initializer, resolved.scope]);
  }
  return entries;
}

/** The keys of an object property, such as a meta's `argTypes`. */
function keysOf(object, key, scope) {
  if (!object) return [];
  const value = propertyOf(object, key)?.initializer;
  return [...new Set(entriesOf(value, scope).map(([name]) => name))];
}

/** `parameters.rules`: each setting's `"<capability>: <requirement title>"`. */
function rulesOf(object, scope) {
  const t = ts();
  const parameters = parametersOf(object);
  const rules = parameters && propertyOf(parameters, "rules")?.initializer;
  if (!rules) return {};
  return Object.fromEntries(
    entriesOf(rules, scope)
      .filter(([, value]) => t.isStringLiteralLike(value))
      .map(([key, value]) => [key, value.text]),
  );
}

/**
 * The meta and the story exports of one CSF file. `titleSpan` is where the
 * title's string literal sits, quotes included, so a rename rewrites that
 * span and nothing else.
 */
export function parseStoryFile(path, text, loader) {
  const t = ts();
  const source = t.createSourceFile(path, text, t.ScriptTarget.Latest, true);
  const scope = moduleScope(path, source, loader);
  const declarations = new Map();
  const exported = [];
  let metaNode;

  for (const statement of source.statements) {
    if (t.isVariableStatement(statement)) {
      const isExported = statement.modifiers?.some(
        (modifier) => modifier.kind === t.SyntaxKind.ExportKeyword,
      );
      for (const declaration of statement.declarationList.declarations) {
        if (!t.isIdentifier(declaration.name)) continue;
        declarations.set(declaration.name.text, declaration.initializer);
        if (isExported) exported.push(declaration.name.text);
      }
    }
    if (t.isExportAssignment(statement) && !statement.isExportEquals) {
      metaNode = t.isIdentifier(statement.expression)
        ? declarations.get(statement.expression.text)
        : statement.expression;
    }
  }

  const meta = objectLiteral(metaNode);
  if (!meta) return null;
  const titleProperty = propertyOf(meta, "title");
  const title =
    titleProperty && t.isStringLiteralLike(titleProperty.initializer)
      ? titleProperty.initializer.text
      : null;
  const titleSpan = title
    ? {
        start: titleProperty.initializer.getStart(source),
        end: titleProperty.initializer.getEnd(),
      }
    : null;
  const componentProperty = propertyOf(meta, "component");
  const component =
    componentProperty && t.isIdentifier(componentProperty.initializer)
      ? componentProperty.initializer.text
      : null;
  const tags = stringsOf(propertyOf(meta, "tags")?.initializer);
  const journeys = journeysOf(meta);
  const settings = keysOf(meta, "argTypes", scope);
  const rules = rulesOf(meta, scope);

  const stories = exported
    .filter((name) => name !== "__namedExportsOrder")
    .map((exportName) => {
      const story = objectLiteral(declarations.get(exportName));
      const nameProperty = story && propertyOf(story, "name");
      const name =
        nameProperty && t.isStringLiteralLike(nameProperty.initializer)
          ? nameProperty.initializer.text
          : storyNameFromExport(exportName);
      return {
        exportName,
        name,
        journeys: story ? journeysOf(story) : [],
        rules: story ? rulesOf(story, scope) : {},
      };
    });

  return {
    title,
    titleSpan,
    component,
    tags,
    journeys,
    settings,
    rules,
    stories,
  };
}

/** `<Meta title="…" />` of an unattached MDX page. */
export function parseDocsFile(text) {
  const match = /<Meta\s+[^>]*title=["']([^"']+)["']/.exec(text);
  return match ? { title: match[1] } : null;
}

const posix = (path) => path.split(sep).join("/");

/** Story and docs files under the workbench's roots, repository-relative. */
export function storyFiles(root = rootDirectory) {
  const files = [];
  for (const directory of STORY_ROOTS) {
    let entries;
    try {
      entries = readdirSync(join(root, directory), { recursive: true });
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    for (const entry of entries) {
      const path = posix(join(directory, entry));
      if (path.includes("/node_modules/")) continue;
      if (STORY_FILE.test(path) || DOCS_FILE.test(path)) files.push(path);
    }
  }
  return files.sort();
}

/** The path the workbench's index.json reports for a file. */
export function importPath(path) {
  if (path.startsWith("apps/preview/"))
    return `./${path.slice("apps/preview/".length)}`;
  return `../../${path}`;
}

/**
 * `{ entries, files }`: `entries` is keyed by id, like a built `index.json`,
 * and `files` holds each file's parse, keyed by its repository path.
 * Synchronous, so `check:manual` can read it in line.
 */
export function storyIndex({ root = rootDirectory, read } = {}) {
  const readText = read ?? ((path) => readFileSync(join(root, path), "utf8"));
  const loader = loaderOf(readText);
  const entries = {};
  const files = {};
  for (const path of storyFiles(root)) {
    const text = readText(path);
    if (DOCS_FILE.test(path)) {
      const docs = parseDocsFile(text);
      if (!docs) continue;
      files[path] = { ...docs, stories: [], tags: [] };
      const id = toId(docs.title, "Docs");
      entries[id] = {
        id,
        title: docs.title,
        name: "Docs",
        type: "docs",
        importPath: importPath(path),
        path,
      };
      continue;
    }
    const parsed = parseStoryFile(path, text, loader);
    if (!parsed?.title) continue;
    files[path] = parsed;
    if (parsed.tags.includes("autodocs")) {
      const id = toId(parsed.title, "Docs");
      entries[id] = {
        id,
        title: parsed.title,
        name: "Docs",
        type: "docs",
        importPath: importPath(path),
        path,
      };
    }
    for (const story of parsed.stories) {
      const id = toId(parsed.title, storyNameFromExport(story.exportName));
      entries[id] = {
        id,
        title: parsed.title,
        name: story.name,
        exportName: story.exportName,
        type: "story",
        importPath: importPath(path),
        path,
      };
    }
  }
  return { entries, files };
}

export const relativeToRoot = (path) => posix(relative(rootDirectory, path));
