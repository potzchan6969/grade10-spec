/**
 * What the workbench draws for each manual feature, and which journeys its
 * stories walk. A collector-facing feature holds Screens, or Prototypes until
 * its design is agreed; a feature with no surface of its own, or one only
 * operators see, is declared once in apps/preview/coverage.yaml with why.
 *
 *   pnpm storybook:coverage           the three tables, as markdown
 *   pnpm storybook:coverage --gaps    only what is missing
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { KINDS } from "./grammar.mjs";
import { citedJourneys, readJourneys } from "./journeys.mjs";
import { manualFeatures } from "./sidebar.mjs";
import { rootDirectory, sanitize, storyIndex } from "./story-index.mjs";

export const COVERAGE_FILE = "apps/preview/coverage.yaml";

/** `{ "no-screen": {key: why}, operator: {key: why} }` from the coverage file. */
export function declared(root = rootDirectory) {
  const path = join(root, COVERAGE_FILE);
  const data = existsSync(path) ? parse(readFileSync(path, "utf8")) : {};
  return {
    "no-screen": data?.["no-screen"] ?? {},
    operator: data?.operator ?? {},
  };
}

/** Per feature: its story titles by kind, the journeys its stories cite, and what it owes. */
export function featureCoverage(
  root = rootDirectory,
  index = storyIndex({ root }),
) {
  const declarations = declared(root);
  const byFeature = new Map();
  for (const file of Object.values(index.files)) {
    const [domain, feature, kind] = file.title?.split("/") ?? [];
    if (!KINDS.includes(kind)) continue;
    const key = `${sanitize(domain)}/${sanitize(feature)}`;
    const entry = byFeature.get(key) ?? {
      titles: {},
      journeys: new Set(),
    };
    entry.titles[kind] ??= new Set();
    entry.titles[kind].add(file.title);
    for (const id of citedJourneys(file)) entry.journeys.add(id);
    byFeature.set(key, entry);
  }

  return manualFeatures(root).map((feature) => {
    const entry = byFeature.get(feature.key);
    const counts = Object.fromEntries(
      KINDS.map((kind) => [kind, entry?.titles[kind]?.size ?? 0]),
    );
    const noScreen = declarations["no-screen"][feature.key];
    const operator = declarations.operator[feature.key];
    const status = noScreen
      ? `no screen - ${noScreen}`
      : operator
        ? `operator - ${operator}`
        : counts.Screens || counts.Prototypes
          ? ""
          : "missing - no Screens or Prototypes";
    return {
      ...feature,
      counts,
      journeys: [...(entry?.journeys ?? [])],
      declared: Boolean(noScreen || operator),
      status,
    };
  });
}

/** Per workbench capability: the collector journeys it holds and those a story walks. */
export function journeyCoverage(
  root = rootDirectory,
  index = storyIndex({ root }),
) {
  const { journeys, capabilities } = readJourneys(root);
  const walked = new Set(
    Object.values(index.files).flatMap((file) => citedJourneys(file)),
  );
  return [...capabilities.entries()]
    .filter(([, capability]) => !capability.nobody)
    .map(([capability, { ids }]) => {
      const drawn = ids.filter((id) => journeys.get(id)?.collector);
      return {
        capability,
        held: drawn.length,
        walked: drawn.filter((id) => walked.has(id)),
        open: drawn.filter((id) => !walked.has(id)),
      };
    })
    .filter((row) => row.held > 0)
    .sort((a, b) => a.capability.localeCompare(b.capability));
}

/** Per Scenario: the settings staging can be set to. */
export function scenarioSettings(index = storyIndex({ root: rootDirectory })) {
  return Object.values(index.files)
    .filter((file) => file.tags?.includes("scenario"))
    .map((file) => ({
      title: file.title,
      settings: file.settings ?? [],
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

const shortId = (id) => id.replace(/^.*-(US-\d+)$/, "$1");

function main() {
  const gaps = process.argv.includes("--gaps");
  const index = storyIndex();
  const features = featureCoverage(rootDirectory, index);
  const capabilities = journeyCoverage(rootDirectory, index);

  const featureRows = features.filter(
    (row) => !gaps || row.status.startsWith("missing"),
  );
  console.log("## Features\n");
  console.log(`| Feature | ${KINDS.join(" | ")} | Status |`);
  console.log(`| --- | ${KINDS.map(() => "---:").join(" | ")} | --- |`);
  for (const row of featureRows)
    console.log(
      `| ${row.title} | ${KINDS.map((kind) => row.counts[kind] || "").join(" | ")} | ${row.status} |`,
    );

  const capabilityRows = capabilities.filter((row) => !gaps || row.open.length);
  console.log("\n## Journeys\n");
  console.log("| Capability | Walked | Not yet walked |");
  console.log("| --- | ---: | --- |");
  for (const row of capabilityRows)
    console.log(
      `| ${row.capability} | ${row.walked.length}/${row.held} | ${row.open.map(shortId).join(", ")} |`,
    );

  const scenarios = scenarioSettings(index).filter(
    (row) => !gaps || !row.settings.length,
  );
  console.log("\n## Scenarios\n");
  console.log("| Scenario | Settings |");
  console.log("| --- | --- |");
  for (const row of scenarios)
    console.log(`| ${row.title} | ${row.settings.join(", ") || "missing"} |`);

  const missing = features.filter((row) =>
    row.status.startsWith("missing"),
  ).length;
  const held = capabilities.reduce((sum, row) => sum + row.held, 0);
  const walked = capabilities.reduce((sum, row) => sum + row.walked.length, 0);
  console.log(
    `\n${features.length} features, ${missing} without Screens or Prototypes. ${walked} of ${held} collector journeys walked by a story.`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
