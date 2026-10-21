// Group one day's commits into focused chunks, and say whether the day is big enough to hand each chunk to its own agent.
// node chunks.mjs <facts.json> - prints the chunks as JSON
// A commit joins the OpenSpec change it moves or builds, else its commit scope, else the first area it touches, so a
// change proposed here and built in the application lands in one chunk. A group of half a chunk or more keeps a chunk
// of its own; the smaller ones, ordered by the area they touch most, fill chunks of up to `size` commits, so neighbours
// share a chunk and no run dispatches more than MAX_CHUNKS agents. Bot commits that only record a report join none.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const SPLIT_COMMITS = 30;
export const SPLIT_LINES = 4000;
export const MAX_CHUNKS = 8;

const BOT = "github-actions[bot]";

export function chunk(facts) {
  const groups = new Map();
  const bots = [];
  const add = (repo, c) => {
    if (c.author === BOT) return bots.push(c.short);
    const key = c.changes?.[0] ?? c.scope ?? c.areas?.[0] ?? "other";
    if (!groups.has(key))
      groups.set(key, { key, spec: [], build: [], areas: {}, lines: 0 });
    const g = groups.get(key);
    g[repo].push(c.short);
    for (const a of c.areas ?? [])
      g.areas[`${repo === "build" ? "app " : ""}${a}`] =
        (g.areas[`${repo === "build" ? "app " : ""}${a}`] ?? 0) + 1;
    g.lines += (c.added ?? 0) + (c.removed ?? 0);
  };
  for (const c of facts.commits ?? []) add("spec", c);
  for (const c of facts.build?.commits ?? []) add("build", c);

  const size = (g) => g.spec.length + g.build.length;
  const sorted = [...groups.values()].sort(
    (a, z) =>
      size(z) - size(a) || z.lines - a.lines || (a.key < z.key ? -1 : 1),
  );
  const commits = sorted.reduce((n, g) => n + size(g), 0);
  const lines = sorted.reduce((n, g) => n + g.lines, 0);
  const split =
    sorted.length > 1 && (commits > SPLIT_COMMITS || lines > SPLIT_LINES);

  const cap = Math.max(SPLIT_COMMITS, Math.ceil(commits / MAX_CHUNKS));
  const own = split
    ? sorted.filter((g) => size(g) >= cap / 2).slice(0, MAX_CHUNKS - 1)
    : [];
  const bins = own.map((g) => [g]);
  const top = (g) =>
    Object.entries(g.areas).sort((a, z) => z[1] - a[1])[0]?.[0] ?? "";
  let open = null;
  for (const g of sorted
    .filter((g) => !own.includes(g))
    .sort((a, z) => top(a).localeCompare(top(z)))) {
    const full = open && open.reduce((n, x) => n + size(x), 0) + size(g) > cap;
    if (!open || (full && bins.length < MAX_CHUNKS)) {
      open = [];
      bins.push(open);
    }
    open.push(g);
  }
  const chunks = bins.map((b) =>
    one(
      split
        ? b
            .map((g) => g.key)
            .slice(0, 3)
            .join("-")
        : "the-day",
      b,
    ),
  );
  const seen = new Set();
  for (const c of chunks) {
    let id = c.id;
    for (let n = 2; seen.has(id); n++) id = `${c.id}-${n}`;
    seen.add(id);
    c.id = id;
  }

  return {
    day: facts.day,
    split: chunks.length > 1,
    why: `${commits} commits and ${lines} lines in ${sorted.length} groups; a day splits past ${SPLIT_COMMITS} commits or ${SPLIT_LINES} lines`,
    commits,
    lines,
    chunks,
    bots,
  };
}

function one(key, groups) {
  const areas = {};
  for (const g of groups)
    for (const [a, n] of Object.entries(g.areas))
      areas[a] = (areas[a] ?? 0) + n;
  return {
    id:
      key
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "other",
    groups: groups.map((g) => g.key),
    spec: groups.flatMap((g) => g.spec),
    build: groups.flatMap((g) => g.build),
    areas,
    lines: groups.reduce((n, g) => n + g.lines, 0),
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: node chunks.mjs <facts.json>");
    process.exit(1);
  }
  console.log(
    JSON.stringify(chunk(JSON.parse(readFileSync(path, "utf8"))), null, 2),
  );
}
