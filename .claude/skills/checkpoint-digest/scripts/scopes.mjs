// The manual's scopes - its groups and the products and platform pages under them - and which scope a changed path belongs to,
// so a digest groups its cards the way docs/prds/manual.yaml groups the manual and a reader goes straight to what they work on.
// node scopes.mjs list               - prints every scope in manual order: id, group, title, href
// node scopes.mjs fill <data.json>   - writes data.scopes from the scopes its cards and follow-ups name, in manual order;
//                                      refuses a scope the manual does not hold
// A scope id is a manual product (`grade10-site/vault`), a platform page (`platform/backup`, `platform/shared/money-amounts`),
// `design-system`, or one of the two ways-of-working scopes, `work/guides` and `work/tooling`.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "yaml";

export const MANUAL_URL = "https://spec.grade10-stg.com";
const PRDS = "docs/prds";
const PLATFORM = "Platform";
const WORK = "How we work";
const UNLISTED = "Not in manual.yaml";

const title = (root, file, fallback) => {
  const path = join(root, file);
  if (!existsSync(path)) return fallback;
  const m = readFileSync(path, "utf8").match(
    /^---\n[\s\S]*?^title:\s*["']?(.+?)["']?\s*$/m,
  );
  return m?.[1] ?? fallback;
};
const humanize = (s) =>
  s.replace(/[-_]/g, " ").replace(/^./, (c) => c.toUpperCase());

// Every scope, in the order the manual's nav shows them, with the words it titles each with.
export function manualScopes(root = process.cwd()) {
  const config = parse(readFileSync(join(root, PRDS, "manual.yaml"), "utf8"));
  const scopes = [];
  const seen = new Set();
  const add = (s) => {
    if (seen.has(s.id)) return;
    seen.add(s.id);
    scopes.push(s);
  };
  const product = (id, group) =>
    add({
      id,
      group,
      title: title(root, `${PRDS}/products/${id}/index.md`, humanize(id)),
      href: `${MANUAL_URL}/p/${id}`,
    });
  const groups = Object.entries(config.groups ?? {});
  for (const [group, ids] of groups) for (const id of ids) product(id, group);
  // A product on disk that manual.yaml does not list: the manual shows it under the same words, rather than dropping it.
  const productsDir = join(root, PRDS, "products");
  for (const p of existsSync(productsDir) ? readdirSync(productsDir) : [])
    for (const d of readdirSync(join(productsDir, p), { withFileTypes: true }))
      if (d.isDirectory()) product(`${p}/${d.name}`, UNLISTED);
  for (const ids of Object.values(config.platform ?? {}))
    for (const id of ids)
      add({
        id: `platform/${id}`,
        group: PLATFORM,
        title: title(root, `${PRDS}/platform/${id}.md`, humanize(id)),
        href: `${MANUAL_URL}/platform/${id}`,
      });
  add({
    id: "design-system",
    group: PLATFORM,
    title: "Design system",
    href: config.storybookBase ?? null,
  });
  add({
    id: "work/guides",
    group: WORK,
    title: "The manual's guides",
    href: `${MANUAL_URL}/`,
  });
  add({
    id: "work/tooling",
    group: WORK,
    title: "Skills, tooling and CI",
    href: null,
  });
  // The groups in manual order, the platform pages inside Platform, and How we work last.
  const order = [...new Set([...groups.map(([g]) => g), PLATFORM, UNLISTED])];
  const rank = (g) =>
    g === WORK ? 1e6 : order.includes(g) ? order.indexOf(g) : 1e5;
  return scopes
    .map((s, i) => [s, i])
    .sort(([a, i], [z, j]) => rank(a.group) - rank(z.group) || i - j)
    .map(([s]) => s);
}

// path -> scope id, or null when the path belongs to no one scope (a story, an email, a catalog).
// `changeFiles` is every path under openspec/changes at the commit drawn, so a change's proposal belongs to the scopes its deltas name.
export function scopeResolver(scopes, changeFiles = []) {
  const ids = new Set(scopes.map((s) => s.id));
  const owner = (a, b) =>
    ids.has(`${a}/${b}`)
      ? `${a}/${b}`
      : ids.has(`platform/${a}/${b}`)
        ? `platform/${a}/${b}`
        : ids.has(`platform/${b}`)
          ? `platform/${b}`
          : null;
  const changeName = (path) =>
    path.match(/^openspec\/changes\/(?:archive\/[\d-]+-)?([^/]+)\//)?.[1] ??
    null;
  const byChange = new Map();
  for (const path of changeFiles) {
    const name = changeName(path);
    const m = path.match(/\/specs\/([^/]+)\/([^/]+)\//);
    const id = name && m && owner(m[1], m[2]);
    if (!id) continue;
    if (!byChange.has(name)) byChange.set(name, new Set());
    byChange.get(name).add(id);
  }
  const known = (id) => (ids.has(id) ? id : null);
  // The first rule whose pattern matches names the scope, from what it captured.
  const rules = [
    [
      /^docs\/prds\/products\/([^/]+)\/([^/]+)\//,
      (m) => known(`${m[1]}/${m[2]}`),
    ],
    [/^docs\/prds\/platform\/(.+)\.md$/, (m) => known(`platform/${m[1]}`)],
    [
      /^docs\/prds\/(guides\/|index\.md$|manual\.yaml$|team\.yaml$)/,
      () => "work/guides",
    ],
    [
      /^openspec\/(?:changes\/[^/]+\/(?:[^/]+\/)?)?specs\/([^/]+)\/([^/]+)\//,
      (m) => owner(m[1], m[2]),
    ],
    [/^packages\/ui\/src\/blocks\//, () => known("shared/ui")],
    [/^packages\/design-system\//, () => "design-system"],
    [
      /^(\.(claude|codex|cursor|devin|github)\/|scripts\/|tools\/|docs\/governance\/|AGENTS\.md$|CLAUDE\.md$)/,
      () => "work/tooling",
    ],
  ];
  const resolve = (path) => {
    for (const [pattern, scope] of rules) {
      const m = path.match(pattern);
      if (m) return scope(m);
    }
    return null;
  };
  return {
    path: (path) => {
      const one = resolve(path);
      if (one) return [one];
      const name = changeName(path);
      return name ? [...(byChange.get(name) ?? [])] : [];
    },
    change: (name) => [...(byChange.get(name) ?? [])],
  };
}

// Put a list of scope ids in manual order, once each.
export function inOrder(scopes, list) {
  const rank = new Map(scopes.map((s, i) => [s.id, i]));
  return [...new Set(list)]
    .filter((id) => rank.has(id))
    .sort((a, z) => rank.get(a) - rank.get(z));
}

// data.scopes: the scopes the page's cards and follow-ups name, in manual order, as the template groups by them.
export function fill(data, scopes) {
  const byId = new Map(scopes.map((s) => [s.id, s]));
  const named = [...(data.changes ?? []), ...(data.followups ?? [])]
    .map((x) => x.scope)
    .filter((s) => s != null);
  const unknown = [...new Set(named.filter((id) => !byId.has(id)))];
  return {
    unknown,
    data: { ...data, scopes: inOrder(scopes, named).map((id) => byId.get(id)) },
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const [command, file] = process.argv.slice(2);
  const scopes = manualScopes();
  if (command === "list") {
    console.log(JSON.stringify(scopes, null, 2));
  } else if (command === "fill" && file) {
    const path = resolve(file);
    const out = fill(JSON.parse(readFileSync(path, "utf8")), scopes);
    if (out.unknown.length) {
      for (const id of out.unknown)
        console.error(
          `FAIL scope "${id}" is no scope of the manual: node scopes.mjs list names them`,
        );
      process.exit(1);
    }
    writeFileSync(path, `${JSON.stringify(out.data, null, 2)}\n`);
    console.log(`data.scopes: ${out.data.scopes.length} scopes`);
  } else {
    console.error("usage: node scopes.mjs list | fill <data.json>");
    process.exit(1);
  }
}
