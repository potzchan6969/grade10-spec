/*
 * RULES: what the store holds and what the manual owes it — a durable spec no
 * page shows, a product or topic with no landing page, a `manual.yaml` entry
 * naming nothing, a spec shaped so the archive would break it, and a file the
 * readers refused outright.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readText, subdirectories } from "../src/store/disk.mts";
import { groupHeadings } from "../src/store/read-specs.mts";
import { manualYaml, plural } from "./context.mjs";

export function checkCoverage(ctx, shape) {
  for (const [id, dir] of shape.dirs) {
    const spec = ctx.specs.get(id);
    if (!ctx.referenced.has(id)) {
      ctx.add("unreferenced", `${dir}/spec.md`, `no page names \`${id}\``);
    }
    if (spec?.journeys?.length && !ctx.journeyed.has(id)) {
      ctx.add(
        "journeys",
        `${dir}/spec.md`,
        `has ${plural(spec.journeys.length, "journey")} and no page shows them`,
      );
    }
  }
}

/** A capability an in-flight change is introducing deserves its page before it
 * lands — the rail otherwise shows it as an italic dead-end into the planning
 * board. A warning, not a failure: the page is owed, not broken. */
export function checkUnwritten(ctx, changes, shape) {
  const seen = new Set();
  for (const change of changes) {
    for (const delta of change.deltas) {
      const id = delta.spec;
      if (shape.dirs.has(id) || ctx.referenced.has(id) || seen.has(id)) {
        continue;
      }
      seen.add(id);
      ctx.add(
        "unwritten",
        `openspec/changes/${change.id}/specs/${id}/spec.md`,
        `no page names \`${id}\` — the capability shows only on the planning board`,
      );
    }
  }
}

/** Disk shape decides what must have a page; `manual.yaml` may add a
 * page-only product or topic, but only one that actually has pages. Only the
 * store's own manual owes the whole disk shape a page — a manual in another
 * repository owes landing pages for exactly what it lists. */
export function checkTaxonomy(roots, config, shape, paths, add) {
  const root = roots.content;
  const manual = roots.manual;
  const configPath = manualYaml(roots);
  const listed = config.groups.flatMap((group) => group.products);
  const onDisk = new Set(shape.products);
  const hasPages = (id) =>
    paths.some((path) => path.startsWith(`${manual}/products/${id}/`));

  const pageOnly = listed.filter((id) => !onDisk.has(id) && hasPages(id));
  for (const id of listed) {
    if (onDisk.has(id) || hasPages(id)) continue;
    add(
      "config",
      configPath,
      `\`${id}\` is neither a spec-dir product nor a page-only product with pages under ${manual}/products/${id}/`,
    );
  }

  const topics = new Set(shape.topics);
  const listedTopics = config.platform.flatMap((group) => group.topics);
  for (const id of listedTopics) {
    if (topics.has(id) || existsSync(join(root, topicPage(manual, id)))) {
      continue;
    }
    add(
      "config",
      configPath,
      `\`${id}\` is neither a spec-dir topic nor a page-only topic with a page at ${topicPage(manual, id)}`,
    );
  }

  const owedProducts = roots.own
    ? [...shape.products, ...pageOnly]
    : listed.filter((id) => onDisk.has(id) || hasPages(id));
  for (const id of new Set(owedProducts)) {
    requirePage(
      add,
      root,
      `${manual}/products/${id}/index.md`,
      `product \`${id}\``,
    );
  }
  const owedTopics = roots.own
    ? shape.topics
    : listedTopics.filter((id) => topics.has(id));
  for (const id of owedTopics) {
    requirePage(add, root, topicPage(manual, id), `topic \`${id}\``);
  }
  for (const slug of config.guides) {
    requirePage(add, root, `${manual}/guides/${slug}.md`, `guide \`${slug}\``);
  }
}

/** A group heading between requirements is tolerated in a delta and fatal in a
 * durable spec: `openspec archive` absorbs it into the requirement above it,
 * and the spec that comes out of the fold is one the readers refuse. Failing
 * here catches it while a delta is still a delta. The spec rules in
 * `openspec/config.yaml` forbid one on either side, so reading order in a
 * durable spec is the order of its requirements and not a heading. */
export function checkSpecShape(root, shape, add) {
  const named = new Set();
  for (const dir of shape.dirs.values()) {
    const file = `${dir}/spec.md`;
    for (const section of groupHeadings(readText(join(root, file)))) {
      named.add(file);
      add(
        "grouping",
        file,
        `line ${section.line}: \`### ${section.heading}\` names no requirement; \`openspec archive\` would fold it into the requirement above it`,
      );
    }
  }
  return named;
}

/** `openspec archive` folds `## Requirements` and nothing else, so a delta's
 * `## Feature set` — the spec's own map — reaches the durable spec only when
 * someone copies it across by hand. A durable spec with requirements and no
 * map is what that omission looks like once the change is gone, and by then
 * the wording only survives in the archive. `pnpm run archive:preflight`
 * refuses the archive that would cause it; this catches one that already
 * happened, or a hand-written spec that never had a map at all. */
export function checkSpecMap(root, shape, add) {
  for (const dir of shape.dirs.values()) {
    const file = `${dir}/spec.md`;
    const text = readText(join(root, file));
    if (!/^## Requirements\s*$/m.test(text)) continue;
    if (/^## Feature set\s*$/m.test(text)) continue;
    add(
      "map",
      file,
      "no `## Feature set`: the fold carries `## Requirements` alone, so a delta's map reaches the durable spec only by hand",
    );
  }
}

/** Both channels a spec entry can carry a refusal on. The suite gets its own
 * finding naming its own file: it still fails the PR — a file nobody can
 * parse must not merge — but it no longer stands in for the spec, whose
 * requirements parsed and whose delta rules can still run. */
export function checkStoreErrors(specs, changes, folded, add) {
  for (const entry of [...specs.values(), ...changes]) {
    // A spec the fold rule named is refused by the reader for that same
    // heading; one cause earns one finding.
    if (entry.error && !folded.has(entry.error.file)) {
      add("store", entry.error.file, refusal(entry.id, entry.error));
    }
    if (entry.testCasesError) {
      add(
        "store",
        entry.testCasesError.file,
        refusal(entry.id, entry.testCasesError),
      );
    }
  }
}

function refusal(id, error) {
  return `${id}${error.line ? ` line ${error.line}` : ""}: ${error.message}`;
}

/** A `depends_on` id must name a change that exists — in flight, or
 * archived and therefore satisfied. A manifest lying about its blockers
 * fails while the author is still around to fix it. */
export function checkDependencies(root, changes, add) {
  const known = new Set(changes.map((one) => one.id));
  const archive = join(root, "openspec", "changes", "archive");
  for (const name of existsSync(archive) ? subdirectories(archive) : []) {
    known.add(name.replace(/^\d{4}-\d{2}-\d{2}-/, ""));
  }
  for (const change of changes) {
    for (const id of change.dependsOn ?? []) {
      if (known.has(id)) continue;
      add(
        "depends",
        `openspec/changes/${change.id}/.openspec.yaml`,
        `depends_on \`${id}\` names no change, in flight or archived`,
      );
    }
  }
}

const topicPage = (manual, id) => `${manual}/platform/${id}.md`;

function requirePage(add, root, path, what) {
  if (!existsSync(join(root, path)))
    add("page", path, `${what} has no page here`);
}
