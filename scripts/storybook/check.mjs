/**
 * `pnpm storybook:check` - holds every story to the sidebar grammar in
 * `docs/governance/storybook.md` and every cited story id to a story that
 * exists. Reads source only, so it runs before anything is built.
 */
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { promisify } from "node:util";
import { parse } from "yaml";
import { rootDirectory, sanitize, storyIndex } from "./story-index.mjs";

const exec = promisify(execFile);

export const START_HERE = "Start Here";
export const DESIGN_SYSTEM = "Design System";
export const KINDS = ["Screens", "Flows", "Prototypes", "Parts", "Blocks"];
const PAGES = "apps/preview/src/pages/";
const PROTOTYPES = "apps/preview/src/prototypes/";
const BLOCKS = "packages/ui/src/blocks/";
const PRIMITIVES = "packages/design-system/src/components/";
const WORKBENCH_PREVIEW = "apps/preview/.storybook-workbench/preview.tsx";
/** Manual applications whose domains the workbench draws, in lookup order. */
const APPS = ["grade10-site", "shared"];
/** Where a domain slug is not its Title Case words. */
const ACRONYMS = { kyc: "KYC" };

export const titleCase = (slug) =>
  ACRONYMS[slug] ??
  slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export const pascalCase = (basename) =>
  basename
    .split(/[-.]/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");

/** The domains the workbench sidebar draws, in `docs/prds/manual.yaml` order. */
export async function manualDomains(root = rootDirectory) {
  const manual = parse(
    await readFile(join(root, "docs/prds/manual.yaml"), "utf8"),
  );
  const domains = [];
  for (const products of Object.values(manual.groups ?? {})) {
    for (const product of products) {
      const [app, domain] = product.split("/");
      if (app === "grade10-site" || product === "shared/auth") {
        const title = titleCase(domain);
        if (!domains.includes(title)) domains.push(title);
      }
    }
  }
  return domains;
}

/** The workbench's root order: Start Here, the manual's domains, the design system. */
export async function rootOrder(root = rootDirectory) {
  return [START_HERE, ...(await manualDomains(root)), DESIGN_SYSTEM];
}

/** The manual page a `<Domain>/<Feature>` title names, or null. */
export function manualPage(root, domain, feature) {
  for (const app of APPS) {
    const path = `docs/prds/products/${app}/${sanitize(domain)}/${sanitize(feature)}.md`;
    if (existsSync(join(root, path))) return path;
  }
  return null;
}

const basenameOf = (path) =>
  path
    .split("/")
    .pop()
    .replace(/\.stories\.(ts|tsx)$/, "");

/** What is wrong with one file's title and place; empty when nothing is. */
export function placementErrors(root, path, file) {
  const errors = [];
  const { title } = file;
  const parts = title.split("/");

  if (path.endsWith(".mdx")) {
    if (title !== START_HERE || path !== "apps/preview/src/start-here.mdx")
      errors.push(
        `docs page "${title}" - the one MDX page is ${START_HERE}, at apps/preview/src/start-here.mdx`,
      );
    return errors;
  }

  const leafNames = [file.component, pascalCase(basenameOf(path))].filter(
    Boolean,
  );
  const leafError = (leaf) =>
    leafNames.includes(leaf)
      ? null
      : `"${title}" - name the component ${leafNames.map((name) => `"${name}"`).join(" or ")}, not "${leaf}"`;

  if (path.startsWith(PRIMITIVES)) {
    const group = titleCase(path.slice(PRIMITIVES.length).split("/")[0]);
    if (parts[0] !== DESIGN_SYSTEM || parts[1] !== group || parts.length < 3)
      errors.push(
        `"${title}" - a primitive in ${group.toLowerCase()}/ is titled "${DESIGN_SYSTEM}/${group}/<Component>"`,
      );
    else {
      const leaf = leafError(parts[2]);
      if (leaf) errors.push(leaf);
    }
    return errors;
  }

  if (![PAGES, PROTOTYPES, BLOCKS].some((folder) => path.startsWith(folder))) {
    errors.push(
      `${path} - a story lives under ${PAGES}, ${PROTOTYPES}, ${BLOCKS} or ${PRIMITIVES}`,
    );
    return errors;
  }

  const [domain, feature, kind, fourth] = parts;
  if (parts.length < 3) {
    errors.push(
      `"${title}" - a title reads "<Domain>/<Feature>/Screens/<Screen>"`,
    );
    return errors;
  }
  if (!manualPage(root, domain, feature)) {
    errors.push(
      `"${title}" - "${domain}/${feature}" has no manual page; use a domain folder and page file under docs/prds/products/grade10-site/ or shared/auth/`,
    );
    return errors;
  }
  if (!KINDS.includes(kind)) {
    errors.push(
      `"${title}" - a screen sits under Screens: "${domain}/${feature}/Screens/${parts.slice(2).join("/")}"`,
    );
    return errors;
  }

  const featureFolder = `${sanitize(domain)}/${sanitize(feature)}/`;
  const expected = {
    Screens: PAGES + featureFolder,
    Flows: PAGES + featureFolder,
    Parts: PAGES + featureFolder,
    Prototypes: PROTOTYPES + featureFolder,
    Blocks: BLOCKS,
  }[kind];
  if (!path.startsWith(expected))
    errors.push(
      `"${title}" - a story under ${kind} lives in ${expected}, not ${path}`,
    );
  if (!fourth) errors.push(`"${title}" - name what sits under ${kind}`);
  if ((kind === "Parts" || kind === "Blocks") && fourth) {
    const leaf = leafError(fourth);
    if (leaf) errors.push(leaf);
  }
  return errors;
}

/** Relative imports that reach into a sibling feature's folder. */
export async function siblingImports(root) {
  const errors = [];
  let entries = [];
  try {
    entries = await readdir(join(root, PAGES), { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const paths = entries
    .map((entry) => PAGES + entry.split(sep).join("/"))
    .filter((path) => /\.(ts|tsx)$/.test(path))
    .sort();
  for (const path of paths) {
    const own = path.slice(PAGES.length).split("/");
    if (own.length < 3) continue;
    const text = await readFile(join(root, path), "utf8");
    for (const match of text.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
      const target = join(path, "..", match[1]);
      if (!target.startsWith(PAGES)) continue;
      const parts = target.slice(PAGES.length).split("/");
      if (parts.length < 3) continue;
      if (parts[0] !== own[0] || parts[1] !== own[1])
        errors.push(
          `${path} - imports ${match[1]} from another feature; move what both use to the nearest folder above them`,
        );
    }
  }
  return errors;
}

/** The root list inside the workbench's `storySort`, or null. */
export function sortRoots(previewText) {
  const match = /storySort:[\s\S]*?const roots = (\[[\s\S]*?\]);/.exec(
    previewText,
  );
  if (!match) return null;
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

const CITATIONS = [
  /::story\{id="?([^"\s}]+)/g,
  /[?&]path=\/(?:story|docs)\/([a-z0-9*-]+)/g,
  /iframe\.html\?id=([a-z0-9*-]+)/g,
  /_STORY_ID\s*=\s*["'`]([a-z0-9-]+)["'`]/g,
  /(?:storyHref|navigateToStory)\(\s*["'`]([a-z0-9-]+)["'`]/g,
];
const BACKTICKED =
  /`([a-z0-9]+(?:-[a-z0-9]+)*--(?:[a-z0-9]+(?:-[a-z0-9]+)*|\*))`/g;
const STORY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*--(?:[a-z0-9]+(?:-[a-z0-9]+)*|\*)$/;

/** Every story id a text cites, with its line. */
export function citedIds(path, text) {
  const found = [];
  const patterns = path.endsWith(".md")
    ? [...CITATIONS, BACKTICKED]
    : CITATIONS;
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const id = match[1];
      if (!STORY_ID.test(id)) continue;
      const line = text.slice(0, match.index).split("\n").length;
      found.push({ id, line });
    }
  }
  return found;
}

/** Files whose cited ids must resolve, and files where a miss only warns. */
export function citationScope(path) {
  if (
    /(^|\/)(test|fixtures)\//.test(path) ||
    /\.test\.[cm]?[jt]sx?$/.test(path)
  )
    return null;
  if (path.startsWith("openspec/changes/archive/")) return null;
  if (path.startsWith("openspec/changes/")) return "warn";
  if (path.startsWith("docs/") || path.startsWith("openspec/specs/"))
    return "error";
  if (
    /\.(ts|tsx|mjs|js)$/.test(path) &&
    /^(apps\/preview|packages|scripts|tools)\//.test(path)
  )
    return "error";
  if (path === "packages/ui/package.json") return "error";
  return null;
}

export function resolves(id, entries) {
  if (id.endsWith("--*")) {
    const prefix = id.slice(0, -1);
    return Object.keys(entries).some((known) => known.startsWith(prefix));
  }
  return Boolean(entries[id]);
}

async function trackedFiles(root) {
  const { stdout } = await exec("git", ["ls-files"], {
    cwd: root,
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout.split("\n").filter(Boolean);
}

/** `{ errors, warnings }` for the stories and the ids the repository cites. */
export async function checkStories({ root = rootDirectory, files } = {}) {
  const { entries, files: parsed } = storyIndex({ root });
  const errors = [];
  const warnings = [];

  for (const [path, file] of Object.entries(parsed)) {
    if (!file.title) continue;
    errors.push(...placementErrors(root, path, file));
  }
  errors.push(...(await siblingImports(root)));

  const previewPath = join(root, WORKBENCH_PREVIEW);
  if (existsSync(previewPath)) {
    const roots = sortRoots(await readFile(previewPath, "utf8"));
    const expected = await rootOrder(root);
    if (!roots || roots.join("|") !== expected.join("|"))
      errors.push(
        `${WORKBENCH_PREVIEW} - storySort's roots read ${JSON.stringify(expected)}, from docs/prds/manual.yaml`,
      );
  }

  for (const path of files ?? (await trackedFiles(root))) {
    const scope = citationScope(path);
    if (!scope || !existsSync(join(root, path))) continue;
    const text = await readFile(join(root, path), "utf8");
    for (const { id, line } of citedIds(path, text)) {
      if (resolves(id, entries)) continue;
      const message = `${path}:${line} - no story "${id}"`;
      (scope === "error" ? errors : warnings).push(message);
    }
  }
  return { errors, warnings, entries };
}

async function main() {
  const { errors, warnings } = await checkStories();
  for (const warning of warnings) console.warn(`warn  ${warning}`);
  for (const error of errors) console.error(`error ${error}`);
  if (errors.length) {
    console.error(
      `\n${errors.length} story problem${errors.length === 1 ? "" : "s"}. The rules: docs/governance/storybook.md`,
    );
    process.exitCode = 1;
  } else console.log("Stories follow the sidebar grammar.");
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
