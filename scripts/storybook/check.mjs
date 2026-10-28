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
import { caseIdErrors } from "./case-ids.mjs";
import { COVERAGE_FILE, declared, featureCoverage } from "./coverage.mjs";
import {
  DESIGN_SYSTEM,
  FLOWS,
  KINDS,
  START_HERE,
  titleCase,
} from "./grammar.mjs";
import {
  citedJourneys,
  parseRule,
  readJourneys,
  requirementTitles,
} from "./journeys.mjs";
import {
  MISSING,
  manualFeatures,
  sortedPreview,
  WORKBENCH_PREVIEW,
} from "./sidebar.mjs";
import { rootDirectory, sanitize, storyIndex } from "./story-index.mjs";

export { DESIGN_SYSTEM, FLOWS, KINDS, START_HERE, titleCase };

const exec = promisify(execFile);

const PAGES = "apps/preview/src/pages/";
const PROTOTYPES = "apps/preview/src/prototypes/";
const BLOCKS = "packages/ui/src/blocks/";
const PRIMITIVES = "packages/design-system/src/components/";
/** Manual applications whose domains the workbench draws, in lookup order. */
const APPS = ["grade10-site", "shared"];

export const pascalCase = (basename) =>
  basename
    .split(/[-.]/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");

/** The manual page a `<Domain>/<Feature>` title names, or null. */
export function manualPage(root, domain, feature) {
  for (const app of APPS) {
    const path = `docs/prds/products/${app}/${sanitize(domain)}/${sanitize(feature)}.md`;
    if (existsSync(join(root, path))) return path;
  }
  return null;
}

/** The manual folder a domain title names, or null. */
export function manualDomain(root, domain) {
  for (const app of APPS) {
    const path = `docs/prds/products/${app}/${sanitize(domain)}`;
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
  if (feature === FLOWS) {
    const folder = `${PAGES}${sanitize(domain)}/flows/`;
    if (!manualDomain(root, domain))
      errors.push(
        `"${title}" - "${domain}" is no manual domain; a domain's flows are titled "<Domain>/${FLOWS}"`,
      );
    if (parts.length !== 2)
      errors.push(
        `"${title}" - a domain's flows are one file titled "${domain}/${FLOWS}", one story per flow`,
      );
    if (!path.startsWith(folder))
      errors.push(`"${title}" - a flow lives in ${folder}, not ${path}`);
    return errors;
  }
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
    const flow = own[1] === "flows";
    const text = await readFile(join(root, path), "utf8");
    for (const match of text.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
      const target = join(path, "..", match[1]);
      if (!target.startsWith(PAGES)) continue;
      const parts = target.slice(PAGES.length).split("/");
      if (parts.length < 3) continue;
      if (flow && parts[0] !== own[0])
        errors.push(
          `${path} - a flow walks its own domain's screens, not ${match[1]}`,
        );
      else if (!flow && (parts[0] !== own[0] || parts[1] !== own[1]))
        errors.push(
          `${path} - imports ${match[1]} from another feature; move what both use to the nearest folder above them`,
        );
    }
  }
  return errors;
}

const CITATIONS = [
  /::story\{id="?([^"\s}]+)/g,
  /[?&]path=\/(?:story|docs)\/([a-z0-9*-]+)/g,
  /iframe\.html\?id=([a-z0-9*-]+)/g,
  /_STORY_ID\s*=\s*["'`]([a-z0-9-]+)["'`]/g,
  /(?:storyHref|navigateToStory)\(\s*["'`]([a-z0-9-]+)["'`]/g,
  /flowStep\(\s*["'`][^"'`]+["'`]\s*,\s*["'`][^"'`]+["'`]\s*,\s*["'`]([a-z0-9-]+)["'`]/g,
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

/** A flow names the journeys it walks, and every journey a story cites exists. */
export function journeyErrors(root, parsed) {
  const errors = [];
  const warnings = [];
  const { journeys } = readJourneys(root);
  for (const [path, file] of Object.entries(parsed)) {
    if (!file.title) continue;
    const cited = citedJourneys(file);
    if (file.title.split("/")[1] === FLOWS && !cited.length)
      errors.push(
        `"${file.title}" - a flow names the journeys it walks: parameters: { journeys: ["<id>-US-01"] }, from the user-journeys.md beside each spec`,
      );
    for (const id of cited) {
      const journey = journeys.get(id);
      if (!journey)
        errors.push(`${path} - no journey "${id}" in any user-journeys.md`);
      else if (!journey.durable)
        warnings.push(
          `${path} - journey "${id}" is only in ${journey.path}; it lands with that change`,
        );
    }
  }
  return { errors, warnings };
}

/**
 * A Scenario, a story tagged `scenario`, holds the settings staging can be
 * set to; each rule it cites names a setting and a requirement that exists.
 */
export function settingsErrors(root, parsed) {
  const errors = [];
  const warnings = [];
  const titles = new Map();
  const requirements = (capability) => {
    if (!titles.has(capability))
      titles.set(capability, requirementTitles(root, capability));
    return titles.get(capability);
  };
  for (const [path, file] of Object.entries(parsed)) {
    if (!file.tags?.includes("scenario")) continue;
    if (!file.settings?.length)
      errors.push(
        `"${file.title}" - a Scenario holds settings: argTypes for the conditions staging can be set to`,
      );
    const others = (file.stories ?? []).filter(
      (story) => story.exportName !== "Scenario",
    );
    if (others.length)
      errors.push(
        `${path} - a Scenario holds one story, Scenario; its settings reach every case, not ${others.map((story) => story.name).join(", ")}`,
      );
    const rules = [
      file.rules ?? {},
      ...(file.stories ?? []).map((story) => story.rules ?? {}),
    ];
    for (const [setting, rule] of rules.flatMap(Object.entries)) {
      if (!file.settings?.includes(setting))
        errors.push(`${path} - rule for "${setting}", which is no setting`);
      const parsedRule = parseRule(rule);
      if (!parsedRule)
        errors.push(
          `${path} - rule "${rule}" reads "<capability>: <requirement title>"`,
        );
      else if (!requirements(parsedRule.capability).has(parsedRule.title))
        errors.push(
          `${path} - no requirement "${parsedRule.title}" in ${parsedRule.capability}`,
        );
    }
  }
  return { errors, warnings };
}

/** coverage.yaml names real features, and a collector feature holds something to look at. */
export function coverageErrors(root, index) {
  const errors = [];
  const warnings = [];
  const features = new Set(manualFeatures(root).map((feature) => feature.key));
  for (const [kind, entries] of Object.entries(declared(root)))
    for (const key of Object.keys(entries))
      if (!features.has(key))
        errors.push(
          `${COVERAGE_FILE} - ${kind} "${key}" is no feature; use <domain>/<page> under docs/prds/products/grade10-site/ or shared/auth/`,
        );
  for (const row of featureCoverage(root, index)) {
    if (
      row.declared &&
      Object.values(row.counts).some(Boolean) &&
      row.status.startsWith("operator")
    )
      warnings.push(
        `${row.title} - declared operator in ${COVERAGE_FILE} but holds stories`,
      );
    if (row.status.startsWith("missing"))
      warnings.push(
        `${row.title} - no Screens or Prototypes; draw them, or say why in ${COVERAGE_FILE}`,
      );
  }
  return { errors, warnings };
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
  errors.push(...caseIdErrors(parsed));
  const journeyProblems = journeyErrors(root, parsed);
  errors.push(...journeyProblems.errors);
  warnings.push(...journeyProblems.warnings);
  const settingsProblems = settingsErrors(root, parsed);
  errors.push(...settingsProblems.errors);
  warnings.push(...settingsProblems.warnings);
  const coverageProblems = coverageErrors(root, { entries, files: parsed });
  errors.push(...coverageProblems.errors);
  warnings.push(...coverageProblems.warnings);

  const previewPath = join(root, WORKBENCH_PREVIEW);
  if (existsSync(previewPath)) {
    const text = await readFile(previewPath, "utf8");
    const sorted = sortedPreview(text, root);
    if (sorted === null) errors.push(MISSING);
    else if (sorted !== text)
      errors.push(
        `${WORKBENCH_PREVIEW} - storySort's sidebar is not the manual's; run pnpm storybook:sort`,
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
