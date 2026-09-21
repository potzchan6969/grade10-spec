/*
 * What every rule reads, and the one channel they all write to.
 *
 * A rule module owns its family of findings and nothing else; the shape of a
 * finding, the order the report puts them in, and the readers' output they all
 * share live here so the families never have to agree among themselves.
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readTeamMap, TEAM_MAP } from "../../../scripts/openspec/lib/team.mjs";
import { capabilitiesOf } from "../src/store/capabilities.mts";
import { readText } from "../src/store/disk.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";

/** Report order, and which findings end the build. */
export const RULES = [
  { key: "canonical", level: "fail", title: "Pages parse and are canonical" },
  { key: "reference", level: "fail", title: "References resolve" },
  {
    key: "detail",
    level: "fail",
    title: "Detail blocks whose titles collide",
  },
  {
    key: "example",
    level: "fail",
    title: "Example ledgers whose balances do not add up",
  },
  {
    key: "case",
    level: "fail",
    title: "Flow cases a reader could not pick between",
  },
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
    key: "trace",
    level: "fail",
    title: "Test cases tracing an anchor the spec does not offer",
  },
  {
    key: "authority",
    level: "fail",
    title: "Approved suites holding a draft case",
  },
  {
    key: "serves",
    level: "fail",
    title: "Scenarios serving an anchor the spec does not offer",
  },
  {
    // The anchor says where the rule sits; the prose after it says what the
    // walk was. A line repeating the group name back carries neither, and a
    // group anchor is already the weakest of the three — it names a part of
    // the map and nobody who meets the rule. A group anchor with no prose at
    // all is the same line with the repetition left out, so both fail here.
    // Nothing in the store writes either today, so this is a guard on new work
    // rather than a register.
    key: "restates",
    level: "fail",
    title: "`**Serves:**` prose that never names the walk",
  },
  {
    // Every state the designer drew is either a scenario or an exemption that
    // names where it is stated instead. Gated on the change carrying a
    // `decisions.md`, the same marker `decided` uses: a change planned before
    // that artifact existed was planned before this rule did too.
    key: "dressed",
    level: "fail",
    title: "Design states no requirement answers",
  },
  {
    // The blind pass's raised questions land in `decisions.md`, and each owes
    // a landing before the change merges — a `Decisions` row, or a ❓ on the
    // PRD. Without the deadline the list sat at the bottom of a suite until
    // somebody reviewed it, which could be after the change shipped.
    key: "raised",
    level: "fail",
    title: "Raised questions that landed nowhere",
  },
  {
    key: "cited",
    level: "fail",
    title: "Ids cited in backticks that the store issues nowhere",
  },
  {
    // Raised from `warn` by the commit that finished the migration: every
    // scenario in the store names an anchor, so one that does not is new work
    // and not a backlog. Finding a scenario no part of the feature set covers
    // is the useful half — five capabilities turned out to have behaviour their
    // own map never named, and nothing else in this store looks for that.
    key: "anchorless",
    level: "fail",
    title: "Scenarios carrying no `**Serves:**` line",
  },
  {
    key: "walked",
    level: "fail",
    title: "Capabilities that never say who walks them",
  },
  {
    // The blind suite pass reads the restated stories instead of the durable
    // capability, because reading `openspec/specs/` is how it would see the
    // scenarios it must not see. That makes the copy load-bearing, and a
    // load-bearing copy nobody compares is one that drifts.
    key: "context",
    level: "fail",
    title: "Restated stories that are not what the store holds",
  },
  {
    key: "outline",
    level: "fail",
    title: "Suites beside a spec whose scenarios never landed",
  },
  {
    // A change's `skip_specs` is author-declared and turns every other check in
    // the planning workflow off. This is the only guard on it.
    key: "hatch",
    level: "fail",
    title: "Changes claiming `skip_specs` while marking a page",
  },
  {
    key: "derived",
    level: "warn",
    title: "Capabilities with anchors and no suite beside them",
  },
  {
    // Granted silently when the delta moves no behaviour: that is
    // `blind_pass_skipped`, and it is the checker's to grant, never the
    // author's to declare. A `warn` until the register of changes written
    // before the blind pass existed empties.
    key: "blind",
    level: "warn",
    title: "Changes moving behaviour no second reading read",
  },
  {
    key: "awaiting",
    level: "fail",
    title: "Waits naming no artifact, or one already written",
  },
  {
    key: "hands",
    level: "fail",
    title: "Hands naming an unknown role or handle",
  },
  {
    key: "landed_by",
    level: "fail",
    title: "Landings naming an unknown handle or artifact",
  },
  {
    key: "grouping",
    level: "fail",
    title: "Durable specs holding a heading the archive would fold",
  },
  {
    key: "map",
    level: "fail",
    title: "Durable specs the fold left without their map",
  },
  {
    key: "heading",
    level: "fail",
    title: "Deltas holding a heading the archive cannot fold",
  },
  {
    key: "delta",
    level: "fail",
    title: "Delta headings no durable requirement answers to",
  },
  {
    key: "overlap",
    level: "fail",
    title: "Requirements two in-flight changes both fold",
  },
  { key: "issued", level: "fail", title: "Permanent ids issued twice" },
  {
    key: "marks",
    level: "fail",
    title: "🚧 lines no in-flight change delivers",
  },
  {
    key: "fuse",
    level: "fail",
    title: "Page selectors an in-flight change would break",
  },
  { key: "depends", level: "fail", title: "Dependencies naming no change" },
  {
    key: "unmarked",
    level: "fail",
    title: "Changes whose deltas no page marks",
  },
  {
    key: "design",
    level: "fail",
    title: "Application work with no tech design",
  },
  {
    // `decisions.md` is required by the schema, and a required artifact that
    // the boards ask for and no check reads is one a change merges without.
    // Every other required artifact in this workflow has a rule that refuses
    // its absence; this is that rule.
    key: "decided",
    level: "fail",
    title: "Changes with no record of what they settled",
  },
  {
    // A round is the only thing in this workflow that leaves no file of its
    // own, so the row is its whole record. Without this a group could be
    // ticked and an artifact landed with nobody able to tell a round that
    // found nothing from one that never ran.
    key: "round",
    level: "fail",
    title: "Landings and ticks with no round's row",
  },
  {
    key: "archived",
    level: "fail",
    title: "Archives recording no deploy",
  },
  {
    key: "story",
    level: "fail",
    title: "Story ids in the workbench Storybook index",
  },
  {
    // The one signal this store can read that a blind pass stopped being
    // blind, or stopped being a different reading. The Run line says what the
    // pass read, never how it read, and nothing verifies it.
    key: "asking",
    level: "warn",
    title: "Blind passes that raised nothing",
  },
  {
    key: "stale",
    level: "warn",
    title: "Pages older than the specs they embed",
  },
  {
    key: "dense",
    level: "warn",
    title: "Pages denser than the style allows",
  },
  {
    // A warning, because only the author can say whether the mark was meant
    // as a question.
    key: "prose",
    level: "warn",
    title: "Marks inside a sentence, read as words",
  },
  {
    key: "ref",
    level: "warn",
    title: "Prose references naming nothing, or two things",
  },
  {
    key: "ledger",
    level: "warn",
    title: "Ledgers written as a table, outside an example",
  },
  { key: "figma", level: "warn", title: "Figma links" },
  {
    key: "suite",
    level: "warn",
    title: "Specs whose test cases no page shows",
  },
  {
    key: "coverage",
    level: "warn",
    title: "Scenarios no test case traces",
  },
  {
    key: "role",
    level: "warn",
    title: "Journeys walked by the system, not an actor",
  },
  {
    key: "unwritten",
    level: "warn",
    title: "Delta-introduced capabilities no page documents",
  },
  { key: "icon", level: "warn", title: "Domains with no icon in the rail" },
];

const LEVEL = new Map(RULES.map((rule) => [rule.key, rule.level]));

/** The config's content-relative path, for the report's path column. */
export const manualYaml = (roots) => `${roots.manual}/manual.yaml`;

/** Where a capability's pages sit. The 🚧 rules read only these — a guide
 * writes the mark to explain it. */
export const productPages = (roots) => `${roots.manual}/products/`;

/** The sink, opened before the readers run so a reader that refuses a file can
 * report it. */
export function createReport() {
  const findings = [];
  const notes = [];
  const add = (rule, path, reason) => {
    findings.push({ rule, level: LEVEL.get(rule), path, reason });
  };
  return { findings, notes, add };
}

export function createContext(roots, report, { specs, changes, stories }) {
  // Read once for the whole pass: `hands` and `landed_by` both resolve a
  // handle against it, and a map that is there and cannot be read says
  // something wrong about who is told rather than nothing about anyone —
  // reported here, once, under the family a store file that will not parse
  // already owns, so neither rule reports the same broken file again.
  let team;
  try {
    team = readTeamMap(roots.store);
  } catch (cause) {
    report.add("store", TEAM_MAP, message(cause));
  }

  const schemaCache = new Map();
  return {
    roots,
    specs,
    // The slice of a snapshot `resolveRef` reads, built once for all pages.
    snapshot: { specs: [...specs.values()] },
    changing: new Set(changes.flatMap((one) => one.deltas.map((d) => d.spec))),
    stories,
    referenced: new Set(),
    cased: new Set(),
    storyIds: new Set(),
    add: report.add,
    team,
    /** The artifacts one schema declares, read once per schema and shared by
     * every rule that asks for the same one — `checkAwaiting`'s wait and
     * `checkLandedBy`'s landing both key off the same set, so one reading
     * answers both instead of each rule caching its own. `undefined` for a
     * schema this store does not define. */
    schemaArtifacts: (schema) => {
      if (!schemaCache.has(schema)) {
        schemaCache.set(schema, schemaArtifacts(roots.store, schema));
      }
      return schemaCache.get(schema);
    },
  };
}

/** The workbench Storybook build is gitignored, so story ids are checkable
 * only where someone has built it. Never fetched over the network, and an
 * index half-written by an interrupted build is one more store file the
 * readers could not parse — never the end of the whole run. */
export function readStoryIndex(root, add) {
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
    const path = `apps/preview/${name}/index.json`;
    try {
      const entries = JSON.parse(readText(file)).entries ?? {};
      return { file: path, ids: new Set(Object.keys(entries)) };
    } catch (cause) {
      add(
        "store",
        path,
        `the Storybook index is unreadable: ${message(cause)}`,
      );
      return null;
    }
  }
  return null;
}

/** Every permanent scenario id a spec issues — what a scenario trace and a
 * journey's accepted-by all have to land in. */
export const scenarioIds = (spec) =>
  new Set(
    spec.requirements
      .flatMap((one) => one.scenarios)
      .map((one) => one.id)
      .filter((id) => id !== undefined),
  );

export function* everyBlock(blocks) {
  for (const block of blocks) {
    yield block;
    if (Array.isArray(block.body)) yield* everyBlock(block.body);
  }
}

export const message = (cause) =>
  cause instanceof Error ? cause.message : String(cause);

/**
 * Every `user-journeys.md` a change carries, as `{ change, spec, file }`.
 *
 * Read off the tree rather than off the change's deltas. The product manager
 * hands a change over with journeys and no `spec.md` at all — which is the
 * whole of their part now — and a rule keyed on the deltas has nothing to walk
 * in exactly that state: the file that says who walks a capability went
 * unchecked until somebody else added a delta beside it.
 */
export function journeysOf(root, changes) {
  const found = [];
  for (const change of changes) {
    for (const one of capabilitiesOf(root, join(root, change.dir))) {
      if (!one.files.has(JOURNEYS)) continue;
      found.push({
        change: change.id,
        spec: one.spec,
        file: `${one.dir}/${JOURNEYS}`,
      });
    }
  }
  return found;
}

const JOURNEYS = "user-journeys.md";

export const plural = (count, word) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

/** An anchor naming another capability's journey:
 * `<product>/<domain>/<capability>#<journey-id>`. A rule sits on the journey
 * somebody walks, and the walk is often somebody else's — the operator's
 * post-sale queue reaches a status the collector's capability derives. Before
 * this, such a rule took a feature set group, which names a part of the map
 * and nobody who meets it, or a hand-written note in a journeys file that
 * named no scenario and so was read by nothing. */
const QUALIFIED = /^([a-z0-9][a-z0-9/-]*)#([a-z0-9][a-z0-9-]*-US-\d+)$/;

/** The journey ids a capability has ever issued - the ones it still holds and
 * the ones it has retired - or undefined where the store holds no such
 * capability. A qualified anchor resolves through this.
 *
 * The retired ids are in the set because the far capability is not the one the
 * anchor is written on. Answering live journeys alone made retiring a journey
 * fail `serves` on every capability that named it, which lands the red in the
 * retirer's pull request and points it at somebody else's file - work they
 * cannot do and would not know to. It also cut against the store's own rule
 * that an issued id is permanent: `archive:preflight` refuses a removed
 * journey that leaves no `## Retired` tombstone precisely because archived
 * suites still trace it. A tombstone the checker then treats as absent is the
 * same id answered two ways.
 *
 * What the anchor stands on going stale is a real question, and it is the
 * retiring change's to answer in its deltas - not a red line on a capability
 * that has not changed. */
export const journeysIn = (ctx) => (id) => {
  const spec = ctx.specs.get(id);
  if (!spec || spec.journeys === undefined) return undefined;
  return new Set([
    ...spec.journeys.map((one) => one.id),
    ...(spec.retiredJourneys ?? []),
  ]);
};

export const qualifiedAnchor = (anchor) => {
  const match = QUALIFIED.exec(anchor);
  return match ? { spec: match[1], journey: match[2] } : null;
};

/** Why an anchor resolves to nothing, as the clause that follows it in a
 * finding, or null when it resolves. `local` is the anchor set the capability
 * offers itself; `far` answers a qualified anchor's capability, and returns
 * undefined where the store holds no such capability. */
export function anchorRefusal(local, anchor, specId, far) {
  if (local.has(anchor)) return null;
  const qualified = qualifiedAnchor(anchor);
  if (!qualified) {
    return `which is neither a journey nor a feature set group of \`${specId}\``;
  }
  const journeys = far(qualified.spec);
  if (journeys === undefined) {
    return `whose capability \`${qualified.spec}\` is not one this store holds`;
  }
  if (!journeys.has(qualified.journey)) {
    return `which \`${qualified.spec}\` issues nowhere`;
  }
  return null;
}

/** Why a group anchor's `**Serves:**` prose says nothing its anchor did not,
 * as the clause that follows the anchor in a finding, or null where the prose
 * names the walk.
 *
 * Two shapes fail, and the emptier one is the stricter case: a group name
 * carries which part of the map the rule sits in and nobody who meets it, so
 * the prose is the only place the walk is ever written. Repeating the group
 * name back says nothing; writing no prose at all says the same thing in fewer
 * words, and a rule that caught only the first would pass the line it was
 * written to catch.
 *
 * Compared on letters and digits alone, so casing and punctuation do not hide
 * a repetition. */
export function groupProseRefusal(anchor, prose) {
  if (prose === undefined || bare(prose) === "") {
    return "names the group and stops — say what the walk is after a dash";
  }
  if (bare(anchor) !== "" && bare(prose) === bare(anchor)) {
    return "repeats the group name after the dash — say what the walk is instead";
  }
  return null;
}

const bare = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "");
