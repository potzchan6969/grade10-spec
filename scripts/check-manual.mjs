#!/usr/bin/env node
/*
 * CHECK: the manual against the store it describes.
 *
 *   pnpm check:manual [store-root]
 *
 * The manual restates nothing — it points at specs, changes, images and
 * stories. Every one of those pointers can rot without anyone noticing, so
 * this walks them all and says so out loud.
 *
 * FAIL = a page lies about the store: it does not parse, it is not the
 *        canonical text the editor would write back, a reference names
 *        nothing on disk, a durable spec has no page, a product or topic has
 *        no landing page, or a store file the readers could not parse.
 *        Exits 1.
 * WARN = hygiene with no broken pointer behind it: a page committed before
 *        the spec it embeds, a `::figma` link off figma.com, a spec whose
 *        journeys no page shows. Exits 0.
 *
 * The readers in apps/manual/src are the only parser — this script never
 * grows a second one, so the check and the app can never disagree.
 */
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parsePage,
  serializePage,
} from "../apps/manual/src/content/grammar.ts";
import {
  confine,
  readText,
  walkFiles,
} from "../apps/manual/src/store/disk.mts";
import { NO_GIT, readGitIndex } from "../apps/manual/src/store/git.mts";
import { readChanges } from "../apps/manual/src/store/read-changes.mts";
import { readManualConfig } from "../apps/manual/src/store/read-manual.mts";
import {
  discoverSpecs,
  readSpecs,
} from "../apps/manual/src/store/read-specs.mts";

/** Report order, and which findings end the build. */
const RULES = [
  { key: "canonical", level: "fail", title: "Pages parse and are canonical" },
  { key: "reference", level: "fail", title: "References resolve" },
  { key: "unreferenced", level: "fail", title: "Durable specs no page shows" },
  {
    key: "page",
    level: "fail",
    title: "Products, topics and guides need a page",
  },
  { key: "config", level: "fail", title: "manual.yaml names what exists" },
  {
    key: "store",
    level: "fail",
    title: "Store files the readers could not parse",
  },
  {
    key: "story",
    level: "fail",
    title: "Story ids in the workbench Storybook index",
  },
  {
    key: "stale",
    level: "warn",
    title: "Pages older than the specs they embed",
  },
  { key: "figma", level: "warn", title: "Figma links" },
  {
    key: "journeys",
    level: "warn",
    title: "Specs whose journeys no page shows",
  },
];

const LEVEL = new Map(RULES.map((rule) => [rule.key, rule.level]));
const MANUAL_YAML = "manual/manual.yaml";
const EMPTY_CONFIG = {
  storybookBase: "",
  groups: [],
  platform: [],
  guides: [],
};

/** Pure over `root` and the git index; `git` is injectable so a fixture can
 * pin commit dates. */
export async function runChecks(root, git) {
  const index = git ?? (await gitIndex(root));
  const findings = [];
  const notes = [];
  const add = (rule, path, reason) => {
    findings.push({ rule, level: LEVEL.get(rule), path, reason });
  };

  let config = EMPTY_CONFIG;
  try {
    config = readManualConfig(root);
  } catch (cause) {
    // The reader names the file it refused; the path column already does.
    add("config", MANUAL_YAML, message(cause).replace(`${MANUAL_YAML} `, ""));
  }

  const shape = discoverSpecs(root);
  const specs = new Map(readSpecs(root, index).map((spec) => [spec.id, spec]));
  const changes = readChanges(root, index);

  const paths = walkFiles(root, join(root, "manual"), ".md");
  const pages = readPages(root, paths, index, add);

  const ctx = {
    root,
    specs,
    changing: new Set(changes.flatMap((one) => one.deltas.map((d) => d.spec))),
    stories: readStoryIndex(root),
    referenced: new Set(),
    journeyed: new Set(),
    storyIds: new Set(),
    add,
  };

  for (const page of pages) {
    const spec = page.ast.frontmatter.spec;
    if (spec !== undefined) {
      ctx.referenced.add(spec);
      if (!specs.has(spec)) {
        add(
          "reference",
          page.path,
          `frontmatter \`spec: ${spec}\` names no spec on disk`,
        );
      }
    }
    for (const block of everyBlock(page.ast.blocks)) {
      checkBlock(ctx, page.path, block);
    }
  }

  if (!ctx.stories && ctx.storyIds.size > 0) {
    notes.push(
      `${plural(ctx.storyIds.size, "`::story` id")} not checked — no workbench Storybook index under apps/preview/storybook-static*`,
    );
  }

  for (const [id, dir] of shape.dirs) {
    const spec = specs.get(id);
    if (!ctx.referenced.has(id)) {
      add("unreferenced", `${dir}/spec.md`, `no page names \`${id}\``);
    }
    if (spec?.journeys?.length && !ctx.journeyed.has(id)) {
      add(
        "journeys",
        `${dir}/spec.md`,
        `has ${plural(spec.journeys.length, "journey")} and no page shows them`,
      );
    }
  }

  checkTaxonomy(root, config, shape, paths, add);

  for (const entry of [...specs.values(), ...changes]) {
    if (!entry.error) continue;
    const where = entry.error.line ? ` line ${entry.error.line}` : "";
    add(
      "store",
      entry.error.file,
      `${entry.id}${where}: ${entry.error.message}`,
    );
  }

  checkStale(pages, specs, add);

  return { findings, notes };
}

/** A page the grammar refuses never reaches the reference checks — it has no
 * blocks to walk, and its parse error is the finding that matters. */
function readPages(root, paths, git, add) {
  const pages = [];
  for (const path of paths) {
    const source = readText(join(root, path));
    try {
      const ast = parsePage(source);
      const canonical = serializePage(ast);
      if (canonical !== source) {
        add("canonical", path, firstDifference(source, canonical));
      }
      pages.push({ path, ast, lastCommit: git.commitOf(path) });
    } catch (cause) {
      add("canonical", path, message(cause));
    }
  }
  return pages;
}

function checkBlock(ctx, path, block) {
  const { add, specs } = ctx;
  switch (block.type) {
    case "spec": {
      ctx.referenced.add(block.id);
      const spec = specs.get(block.id);
      if (!spec) {
        add("reference", path, `${label(block, "id")} names no spec on disk`);
        break;
      }
      if (
        block.requirement !== undefined &&
        !spec.requirements.some((one) => one.name === block.requirement)
      ) {
        add(
          "reference",
          path,
          `${label(block, "id")} has no requirement \`${block.requirement}\``,
        );
      }
      if (
        block.scenario !== undefined &&
        !scenarioIds(spec).has(block.scenario)
      ) {
        add(
          "reference",
          path,
          `${label(block, "id")} issues no scenario \`${block.scenario}\``,
        );
      }
      if (block.story !== undefined && !journeyIds(spec).has(block.story)) {
        add(
          "reference",
          path,
          `${label(block, "id")} issues no story \`${block.story}\``,
        );
      }
      break;
    }
    case "journeys": {
      ctx.journeyed.add(block.id);
      if (!specs.has(block.id)) {
        add("reference", path, `${label(block, "id")} names no spec on disk`);
      }
      break;
    }
    case "cases": {
      const spec = specs.get(block.id);
      if (!spec) {
        add("reference", path, `${label(block, "id")} names no spec on disk`);
        break;
      }
      const issued = scenarioIds(spec);
      for (const test of spec.testCases ?? []) {
        for (const trace of test.traces) {
          if (issued.has(trace)) continue;
          add(
            "reference",
            path,
            `${label(block, "id")}: ${test.id} traces \`${trace}\`, which the spec does not issue`,
          );
        }
      }
      break;
    }
    case "changes": {
      // A ribbon may point at a capability that is still being introduced, so
      // an in-flight change's deltas resolve it as well as a durable spec.
      if (specs.has(block.spec) || ctx.changing.has(block.spec)) break;
      add(
        "reference",
        path,
        `${label(block, "spec")} names no spec on disk and no in-flight change`,
      );
      break;
    }
    case "image": {
      const file = confine(ctx.root, "manual/assets", block.src);
      if (typeof file !== "string") {
        add("reference", path, `${label(block, "src")}: ${file.error}`);
      } else if (!existsSync(file)) {
        add(
          "reference",
          path,
          `${label(block, "src")} names no file under manual/assets`,
        );
      }
      break;
    }
    case "story": {
      ctx.storyIds.add(block.id);
      if (ctx.stories && !ctx.stories.ids.has(block.id)) {
        add(
          "story",
          path,
          `${label(block, "id")} is not in ${ctx.stories.file}`,
        );
      }
      break;
    }
    case "figma": {
      if (!isFigma(block.url)) {
        add("figma", path, `${label(block, "url")} is not a figma.com link`);
      }
      break;
    }
    default:
      break;
  }
}

/** Disk shape decides what must have a page; `manual.yaml` may add a
 * page-only product, but only one that actually has pages. */
function checkTaxonomy(root, config, shape, paths, add) {
  const listed = config.groups.flatMap((group) => group.products);
  const onDisk = new Set(shape.products);
  const hasPages = (id) =>
    paths.some((path) => path.startsWith(`manual/products/${id}/`));

  const pageOnly = listed.filter((id) => !onDisk.has(id) && hasPages(id));
  for (const id of listed) {
    if (onDisk.has(id) || hasPages(id)) continue;
    add(
      "config",
      MANUAL_YAML,
      `\`${id}\` is neither a spec-dir product nor a page-only product with pages under manual/products/${id}/`,
    );
  }

  for (const id of new Set([...shape.products, ...pageOnly])) {
    requirePage(
      add,
      root,
      `manual/products/${id}/index.md`,
      `product \`${id}\``,
    );
  }
  for (const id of shape.topics) {
    requirePage(add, root, `manual/platform/${id}.md`, `topic \`${id}\``);
  }
  for (const slug of config.guides) {
    requirePage(add, root, `manual/guides/${slug}.md`, `guide \`${slug}\``);
  }
}

function checkStale(pages, specs, add) {
  for (const page of pages) {
    if (!page.lastCommit) continue;
    const at = Date.parse(page.lastCommit.date);
    const newer = embeddedSpecs(page.ast)
      .filter((id) => {
        const date = specs.get(id)?.lastCommit?.date;
        return date !== undefined && Date.parse(date) > at;
      })
      .sort();
    if (newer.length === 0) continue;
    add(
      "stale",
      page.path,
      `last committed ${page.lastCommit.date.slice(0, 10)}; ${newer.join(", ")} changed after it`,
    );
  }
}

function requirePage(add, root, path, what) {
  if (!existsSync(join(root, path)))
    add("page", path, `${what} has no page here`);
}

export function formatReport(root, result) {
  const lines = [`manual check — ${root}`];
  for (const rule of RULES) {
    const found = result.findings
      .filter((one) => one.rule === rule.key)
      .sort(byPathThenReason);
    if (found.length === 0) continue;
    lines.push("", `${rule.level.toUpperCase()}  ${rule.title}`);
    for (const one of found) lines.push(`      ${one.path} — ${one.reason}`);
  }
  for (const note of result.notes) lines.push("", `note: ${note}`);

  const failures = result.findings.filter((one) => one.level === "fail").length;
  const warnings = result.findings.length - failures;
  lines.push(
    "",
    `${plural(failures, "failure")}, ${plural(warnings, "warning")}`,
  );
  return { text: lines.join("\n"), failures, warnings };
}

function byPathThenReason(a, b) {
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  if (a.reason === b.reason) return 0;
  return a.reason < b.reason ? -1 : 1;
}

function* everyBlock(blocks) {
  for (const block of blocks) {
    yield block;
    if (Array.isArray(block.body)) yield* everyBlock(block.body);
  }
}

function embeddedSpecs(ast) {
  const ids = new Set();
  if (ast.frontmatter.spec !== undefined) ids.add(ast.frontmatter.spec);
  for (const block of everyBlock(ast.blocks)) {
    if (block.type === "spec") ids.add(block.id);
  }
  return [...ids];
}

const scenarioIds = (spec) =>
  new Set(
    spec.requirements
      .flatMap((one) => one.scenarios)
      .map((one) => one.id)
      .filter((id) => id !== undefined),
  );

const journeyIds = (spec) =>
  new Set((spec.journeys ?? []).map((one) => one.id));

const label = (block, key) => `::${block.type}{${key}="${block[key]}"}`;

function isFigma(url) {
  try {
    const { hostname } = new URL(url);
    return hostname === "figma.com" || hostname.endsWith(".figma.com");
  } catch {
    return false;
  }
}

/** The workbench Storybook build is gitignored, so story ids are checkable
 * only where someone has built it. Never fetched over the network. */
function readStoryIndex(root) {
  const dir = join(root, "apps", "preview");
  if (!existsSync(dir)) return null;
  const built = readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && entry.name.startsWith("storybook-static"),
    )
    .map((entry) => entry.name)
    .sort();
  for (const name of built) {
    const file = join(dir, name, "index.json");
    if (!existsSync(file)) continue;
    const entries = JSON.parse(readText(file)).entries ?? {};
    return {
      file: `apps/preview/${name}/index.json`,
      ids: new Set(Object.keys(entries)),
    };
  }
  return null;
}

function firstDifference(actual, canonical) {
  const a = actual.split("\n");
  const b = canonical.split("\n");
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if (a[i] === b[i]) continue;
    return `line ${i + 1}: is ${show(a[i])}, canonical is ${show(b[i])}`;
  }
  return "differs from its canonical form";
}

const show = (line) =>
  line === undefined ? "(end of file)" : JSON.stringify(line);

async function gitIndex(root) {
  if (!existsSync(join(root, ".git"))) return NO_GIT;
  return readGitIndex(root, ["openspec", "manual"]);
}

const message = (cause) =>
  cause instanceof Error ? cause.message : String(cause);

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

if (import.meta.main) {
  const root = process.argv[2]
    ? resolve(process.argv[2])
    : resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const { text, failures } = formatReport(root, await runChecks(root));
  console.log(text);
  process.exitCode = failures > 0 ? 1 : 0;
}
